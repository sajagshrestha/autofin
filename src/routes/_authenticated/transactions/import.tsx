import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	CheckCircle2,
	FileText,
	Loader2,
	Trash2,
	Upload,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CategoryCombobox } from "@/components/ui/category-combobox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllCategories } from "@/hooks/categories/queries";
import type { Category } from "@/hooks/categories/types";
import {
	type DuplicateRef,
	type StatementExtractionDto,
	useBulkCreateTransactions,
	useExtractStatement,
} from "@/hooks/statements";
import { formatCurrency } from "@/lib/formatCurrency";

export const Route = createFileRoute("/_authenticated/transactions/import")({
	component: ImportStatementPage,
});

const MAX_FILE_BYTES = 10 * 1024 * 1024; // must stay in sync with extractStatementFn
const ACCEPTED_TYPES = [
	"application/pdf",
	"image/png",
	"image/jpeg",
	"image/webp",
];

interface ImportRow {
	id: string;
	include: boolean;
	/** Set when this row matches an existing transaction (same amount ±24h). */
	duplicateOf?: DuplicateRef | null;
	/** datetime-local input value: "YYYY-MM-DDTHH:mm" */
	date: string;
	type: "debit" | "credit";
	merchant: string;
	categoryId: string;
	amount: string;
	remarks: string;
	confidence?: number;
}

function toLocalInputValue(date: string | null, time: string | null): string {
	if (!date) return "";
	const t = time ? time.slice(0, 5) : "00:00";
	return `${date}T${t}`;
}

function rowsFromExtraction(
	result: StatementExtractionDto,
	categories: Category[],
): ImportRow[] {
	const byLowerName = new Map(
		categories.map((c) => [c.name.trim().toLowerCase(), c.id]),
	);
	const uncategorizedId =
		categories.find((c) => c.name.toLowerCase() === "uncategorized")?.id ?? "";

	return result.transactions.map((txn, index) => {
		const matched = txn.suggestedCategoryName
			? byLowerName.get(txn.suggestedCategoryName.trim().toLowerCase())
			: undefined;

		return {
			id: `row-${index}-${Date.now()}`,
			include: !txn.duplicateOf,
			duplicateOf: txn.duplicateOf ?? null,
			date: toLocalInputValue(txn.date, txn.time),
			type: txn.type,
			merchant: txn.merchant ?? "",
			categoryId: matched ?? uncategorizedId,
			amount: txn.amount.toString(),
			remarks: txn.remarks ?? "",
			confidence: txn.confidence,
		};
	});
}

function ImportStatementPage() {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [extraction, setExtraction] = useState<StatementExtractionDto | null>(
		null,
	);
	const [rows, setRows] = useState<ImportRow[]>([]);
	const [dragActive, setDragActive] = useState(false);

	const { data: categoriesData } = useGetAllCategories();
	const categories = useMemo<Category[]>(
		() =>
			[...(categoriesData?.categories ?? [])].sort((a, b) =>
				a.name.localeCompare(b.name),
			),
		[categoriesData],
	);

	const categoryOptions = useMemo(
		() => [
			{ id: "", label: "Uncategorized", searchLabel: "uncategorized" },
			...categories.map((c) => ({
				id: c.id,
				label: `${c.icon ? `${c.icon} ` : ""}${c.name}`,
				searchLabel: `${c.name} ${c.icon ?? ""}`.toLowerCase(),
			})),
		],
		[categories],
	);

	const extractMutation = useExtractStatement();
	const importMutation = useBulkCreateTransactions();

	const handleFile = (file: File | undefined | null) => {
		if (!file) return;

		if (
			!ACCEPTED_TYPES.includes(file.type) &&
			!/\.(pdf|png|jpe?g|webp)$/i.test(file.name)
		) {
			toast.error("Unsupported file", {
				description: "Upload a PDF or a PNG/JPG/WebP image.",
			});
			return;
		}
		if (file.size > MAX_FILE_BYTES) {
			toast.error("File is too large", {
				description: "Statements must be under 10 MB.",
			});
			return;
		}

		setSelectedFile(file);
		extractMutation.mutate(
			{ file },
			{
				onSuccess: (result) => {
					if (result.transactions.length === 0) {
						toast.error("No transactions found", {
							description:
								"We couldn't find any transaction rows in this document. Try a clearer photo or a different file.",
						});
						setSelectedFile(null);
						return;
					}
					setExtraction(result);
					setRows(rowsFromExtraction(result, categories));
					toast.success(
						`Found ${result.transactions.length} transaction${result.transactions.length !== 1 ? "s" : ""}`,
					);
				},
				onError: (error) => {
					setSelectedFile(null);
					toast.error("Extraction failed", {
						description: error.message,
					});
				},
			},
		);
	};

	const reset = () => {
		setSelectedFile(null);
		setExtraction(null);
		setRows([]);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const updateRow = (id: string, patch: Partial<ImportRow>) => {
		setRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
		);
	};

	const removeRow = (id: string) => {
		setRows((prev) => prev.filter((row) => row.id !== id));
	};

	const includedRows = rows.filter((row) => row.include);

	const totals = useMemo(() => {
		let debit = 0;
		let credit = 0;
		for (const row of includedRows) {
			const amount = Number.parseFloat(row.amount);
			if (!Number.isFinite(amount) || amount <= 0) continue;
			if (row.type === "debit") debit += amount;
			else credit += amount;
		}
		return { debit, credit };
	}, [includedRows]);

	const invalidRowCount = includedRows.filter((row) => {
		const amount = Number.parseFloat(row.amount);
		return !Number.isFinite(amount) || amount <= 0;
	}).length;

	const handleConfirm = () => {
		if (invalidRowCount > 0) {
			toast.error("Some rows have invalid amounts", {
				description: "Set an amount greater than 0 or remove those rows.",
			});
			return;
		}

		const hasFlaggedIncluded = includedRows.some((row) => row.duplicateOf);
		importMutation.mutate(
			{
				allowDuplicates: hasFlaggedIncluded || undefined,
				transactions: includedRows.map((row) => ({
					amount: Number.parseFloat(row.amount),
					type: row.type,
					merchant: row.merchant.trim() || undefined,
					remarks: row.remarks.trim() || undefined,
					transactionDate: row.date
						? new Date(row.date).toISOString()
						: undefined,
					categoryId: row.categoryId || undefined,
					confidence: row.confidence,
				})),
			},
			{
				onSuccess: (result) => {
					toast.success(
						`Imported ${result.created} transaction${result.created !== 1 ? "s" : ""}`,
					);
					navigate({ to: "/transactions" });
				},
				onError: (error) => {
					toast.error("Import failed", {
						description: error.message,
					});
				},
			},
		);
	};

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			<div className="flex flex-col gap-4">
				<BackButton
					fallback="/transactions"
					variant="ghost"
					size="sm"
					className="self-start"
				>
					Back to Transactions
				</BackButton>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Import from statement
					</h1>
					<p className="text-muted-foreground mt-1">
						Upload a bank statement (PDF or photo). AI reads it, you review and
						edit, then import everything at once.
					</p>
				</div>
			</div>

			{!extraction ? (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Upload statement
						</CardTitle>
						<CardDescription>
							PDF exports and photos/scans of paper statements both work. Max
							10&nbsp;MB.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{extractMutation.isPending ? (
							<div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
								<Loader2 className="h-10 w-10 animate-spin text-primary" />
								<div className="space-y-1">
									<p className="font-medium">Reading your statement…</p>
									<p className="text-sm text-muted-foreground">
										{selectedFile?.name}
									</p>
									<p className="text-xs text-muted-foreground">
										This can take up to a minute for long documents.
									</p>
								</div>
							</div>
						) : (
							<label
								className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors sm:p-12 ${
									dragActive
										? "border-primary bg-primary/5"
										: "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40 cursor-pointer"
								}`}
								onDragOver={(e) => {
									e.preventDefault();
									setDragActive(true);
								}}
								onDragLeave={() => setDragActive(false)}
								onDrop={(e) => {
									e.preventDefault();
									setDragActive(false);
									handleFile(e.dataTransfer.files?.[0]);
								}}
							>
								<input
									ref={fileInputRef}
									type="file"
									className="sr-only"
									accept=".pdf,.png,.jpg,.jpeg,.webp"
									onChange={(e) => handleFile(e.target.files?.[0])}
								/>
								<div className="rounded-full bg-muted p-4">
									<Upload className="h-7 w-7 text-muted-foreground" />
								</div>
								<div className="space-y-1">
									<p className="font-medium">
										Drop your file here, or click to browse
									</p>
									<p className="text-sm text-muted-foreground">
										PDF, PNG, JPG or WebP · max 10 MB
									</p>
								</div>
							</label>
						)}
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
							<div>
								<CardTitle>Review &amp; edit extracted transactions</CardTitle>
								<CardDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
									{selectedFile && <span>{selectedFile.name}</span>}
									{extraction.bankName && (
										<span>Bank: {extraction.bankName}</span>
									)}
									{extraction.accountNumber && (
										<span>Account: ••{extraction.accountNumber.slice(-4)}</span>
									)}
									<span>
										{rows.length} found · {includedRows.length} selected
									</span>
								</CardDescription>
							</div>
							<div className="flex flex-wrap items-center gap-2">
								<Button variant="outline" size="sm" onClick={reset}>
									Start over
								</Button>
								<Button
									size="sm"
									onClick={handleConfirm}
									disabled={
										importMutation.isPending ||
										includedRows.length === 0 ||
										invalidRowCount > 0
									}
								>
									{importMutation.isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Importing…
										</>
									) : (
										<>
											<CheckCircle2 className="mr-2 h-4 w-4" />
											Import {includedRows.length} transaction
											{includedRows.length !== 1 ? "s" : ""}
										</>
									)}
								</Button>
							</div>
						</div>

						<Separator className="my-4" />

						<div className="flex flex-wrap items-center justify-between gap-3">
							<div className="flex flex-wrap items-center gap-2 text-sm">
								<Badge variant="destructive">
									Debits {formatCurrency(totals.debit)}
								</Badge>
								<Badge className="bg-ds-green-700 hover:bg-ds-green-800">
									Credits {formatCurrency(totals.credit)}
								</Badge>
								{includedRows.some((row) => row.duplicateOf) && (
									<Badge
										variant="outline"
										className="border-ds-amber-500/50 bg-ds-amber-500/10 text-ds-amber-900 dark:text-ds-amber-700"
									>
										Includes possible duplicates
									</Badge>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										setRows((prev) =>
											prev.map((row) => ({ ...row, include: true })),
										)
									}
								>
									Select all
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										setRows((prev) =>
											prev.map((row) => ({ ...row, include: false })),
										)
									}
								>
									Clear selection
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent className="px-0">
						{/* Mobile: stacked cards */}
						<div className="space-y-3 px-4 pb-2 md:hidden">
							{rows.map((row) => {
								const amountNum = Number.parseFloat(row.amount);
								const invalid = !Number.isFinite(amountNum) || amountNum <= 0;
								const lowConfidence =
									row.confidence !== undefined && row.confidence < 0.6;

								return (
									<div
										key={row.id}
										className={`rounded-xl border p-3 space-y-3 ${
											row.include ? "" : "opacity-45"
										}`}
									>
										<div className="flex items-center justify-between gap-2">
											<label className="flex items-center gap-2 text-sm font-medium">
												<input
													type="checkbox"
													aria-label={`Include ${row.merchant || "transaction"}`}
													checked={row.include}
													onChange={(e) =>
														updateRow(row.id, {
															include: e.target.checked,
														})
													}
												/>
												{row.merchant || "Transaction"}
											</label>
											<div className="flex items-center gap-1">
												{row.confidence !== undefined && (
													<Badge
														variant={lowConfidence ? "outline" : "secondary"}
														title="AI confidence"
													>
														{Math.round(row.confidence * 100)}%
													</Badge>
												)}
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-muted-foreground hover:text-ds-red-700"
													onClick={() => removeRow(row.id)}
													aria-label="Remove row"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
										{row.duplicateOf && (
											<Badge
												variant="outline"
												className="border-ds-amber-500/50 bg-ds-amber-500/10 text-[10px] text-ds-amber-900 dark:text-ds-amber-700"
												title={`Possible duplicate of an existing transaction (${row.duplicateOf.merchant ?? "unknown"}, ${row.duplicateOf.amount} NPR)`}
											>
												Duplicate?
											</Badge>
										)}
										<div className="grid grid-cols-2 gap-2">
											<div className="space-y-1">
												<span className="text-xs text-muted-foreground">
													Date &amp; time
												</span>
												<Input
													type="datetime-local"
													value={row.date}
													onChange={(e) =>
														updateRow(row.id, { date: e.target.value })
													}
													className="h-8 w-full"
												/>
											</div>
											<div className="space-y-1">
												<span className="text-xs text-muted-foreground">
													Amount
												</span>
												<Input
													type="number"
													min="0"
													step="0.01"
													aria-invalid={invalid}
													value={row.amount}
													onChange={(e) =>
														updateRow(row.id, { amount: e.target.value })
													}
													className={`h-8 w-full text-right ${
														row.type === "debit"
															? "text-ds-red-700 dark:text-ds-red-900"
															: "text-ds-green-700 dark:text-ds-green-900"
													}`}
												/>
											</div>
											<div className="space-y-1">
												<span className="text-xs text-muted-foreground">
													Type
												</span>
												<Select
													value={row.type}
													onValueChange={(value) =>
														updateRow(row.id, {
															type: value as "debit" | "credit",
														})
													}
												>
													<SelectTrigger className="h-8 w-full capitalize">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="debit">debit</SelectItem>
														<SelectItem value="credit">credit</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-1">
												<span className="text-xs text-muted-foreground">
													Category
												</span>
												<CategoryCombobox
													value={row.categoryId}
													onChange={(value) =>
														updateRow(row.id, { categoryId: value })
													}
													options={categoryOptions}
													className="w-full"
												/>
											</div>
										</div>
										<div className="space-y-1">
											<span className="text-xs text-muted-foreground">
												Merchant
											</span>
											<Input
												value={row.merchant}
												placeholder="Merchant"
												onChange={(e) =>
													updateRow(row.id, { merchant: e.target.value })
												}
												className="h-8 w-full"
											/>
										</div>
										<div className="space-y-1">
											<span className="text-xs text-muted-foreground">
												Remarks
											</span>
											<Textarea
												value={row.remarks}
												placeholder="—"
												rows={1}
												onChange={(e) =>
													updateRow(row.id, { remarks: e.target.value })
												}
												className="min-h-8 w-full resize-y text-sm"
											/>
										</div>
									</div>
								);
							})}
						</div>

						{/* Desktop: table */}
						<div className="hidden md:block overflow-x-auto pb-2">
							<table className="w-full min-w-[980px] text-sm">
								<thead>
									<tr className="border-b text-left text-muted-foreground">
										<th className="w-10 px-4 py-2 font-medium">
											<input
												type="checkbox"
												aria-label="Select all rows"
												checked={
													rows.length > 0 && includedRows.length === rows.length
												}
												onChange={(e) =>
													setRows((prev) =>
														prev.map((row) => ({
															...row,
															include: e.target.checked,
														})),
													)
												}
											/>
										</th>
										<th className="px-2 py-2 font-medium">Date &amp; time</th>
										<th className="px-2 py-2 font-medium">Type</th>
										<th className="px-2 py-2 font-medium">Merchant</th>
										<th className="px-2 py-2 font-medium">Category</th>
										<th className="px-2 py-2 font-medium text-right">Amount</th>
										<th className="px-2 py-2 font-medium">Remarks</th>
										<th className="px-2 py-2 font-medium">AI</th>
										<th className="w-10 px-2 py-2" />
									</tr>
								</thead>
								<tbody>
									{rows.map((row) => {
										const amountNum = Number.parseFloat(row.amount);
										const invalid =
											!Number.isFinite(amountNum) || amountNum <= 0;
										const lowConfidence =
											row.confidence !== undefined && row.confidence < 0.6;

										return (
											<tr
												key={row.id}
												className={`border-b align-middle ${
													row.include ? "" : "opacity-45"
												}`}
											>
												<td className="px-4 py-2">
													<input
														type="checkbox"
														aria-label={`Include ${row.merchant || "transaction"}`}
														checked={row.include}
														onChange={(e) =>
															updateRow(row.id, {
																include: e.target.checked,
															})
														}
													/>
												</td>
												<td className="px-2 py-1.5">
													<Input
														type="datetime-local"
														value={row.date}
														onChange={(e) =>
															updateRow(row.id, { date: e.target.value })
														}
														className="h-8 w-[190px]"
													/>
												</td>
												<td className="px-2 py-1.5">
													<Select
														value={row.type}
														onValueChange={(value) =>
															updateRow(row.id, {
																type: value as "debit" | "credit",
															})
														}
													>
														<SelectTrigger className="h-8 w-[104px] capitalize">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="debit">debit</SelectItem>
															<SelectItem value="credit">credit</SelectItem>
														</SelectContent>
													</Select>
												</td>
												<td className="px-2 py-1.5">
													<Input
														value={row.merchant}
														placeholder="Merchant"
														onChange={(e) =>
															updateRow(row.id, { merchant: e.target.value })
														}
														className="h-8 w-[160px]"
													/>
													{row.duplicateOf && (
														<Badge
															variant="outline"
															className="mt-1 border-ds-amber-500/50 bg-ds-amber-500/10 text-[10px] text-ds-amber-900 dark:text-ds-amber-700"
															title={`Possible duplicate of an existing transaction (${row.duplicateOf.merchant ?? "unknown"}, ${row.duplicateOf.amount} NPR)`}
														>
															Duplicate?
														</Badge>
													)}
												</td>
												<td className="px-2 py-1.5">
													<CategoryCombobox
														value={row.categoryId}
														onChange={(value) =>
															updateRow(row.id, { categoryId: value })
														}
														options={categoryOptions}
														className="w-[170px]"
													/>
												</td>
												<td className="px-2 py-1.5 text-right">
													<Input
														type="number"
														min="0"
														step="0.01"
														aria-invalid={invalid}
														value={row.amount}
														onChange={(e) =>
															updateRow(row.id, { amount: e.target.value })
														}
														className="h-8 w-[120px] text-right ml-auto"
													/>
												</td>
												<td className="px-2 py-1.5">
													<Textarea
														value={row.remarks}
														placeholder="—"
														rows={1}
														onChange={(e) =>
															updateRow(row.id, { remarks: e.target.value })
														}
														className="min-h-8 w-[200px] resize-y text-sm"
													/>
												</td>
												<td className="px-2 py-1.5">
													{row.confidence !== undefined ? (
														<Badge
															variant={lowConfidence ? "outline" : "secondary"}
															title="AI confidence"
														>
															{Math.round(row.confidence * 100)}%
														</Badge>
													) : null}
												</td>
												<td className="px-2 py-1.5">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-muted-foreground hover:text-ds-red-700"
														onClick={() => removeRow(row.id)}
														aria-label="Remove row"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{rows.length === 0 && (
							<div className="py-10 text-center text-muted-foreground">
								Nothing left to review.{" "}
								<button
									type="button"
									className="underline hover:text-foreground"
									onClick={reset}
								>
									Upload another file
								</button>
							</div>
						)}

						<div className="flex items-center justify-between gap-4 px-4 pt-4">
							<p className="text-xs text-muted-foreground">
								Only selected rows are saved. Dates use this device's time zone.
							</p>
							<Button variant="ghost" size="sm" onClick={reset} asChild>
								<span className="cursor-pointer">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Use a different file
								</span>
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
