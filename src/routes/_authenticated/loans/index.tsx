import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowDownLeft,
	ArrowUpRight,
	HandCoins,
	Loader2,
	MoreVertical,
	Plus,
	Trash2,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	type Loan,
	type LoanDirection,
	type LoanSettlement,
	useCreateLoan,
	useDeleteLoan,
	useGetLoan,
	useGetLoans,
	useSettleLoan,
} from "@/hooks/loans";
import { formatCurrency } from "@/lib/formatCurrency";

const loansSearchSchema = z.object({
	tab: z.enum(["outstanding", "settled"]).optional().default("outstanding"),
});

type LoanTab = z.infer<typeof loansSearchSchema>["tab"];

export const Route = createFileRoute("/_authenticated/loans/")({
	validateSearch: loansSearchSchema,
	component: LoansPage,
});

function todayIso(): string {
	return new Date().toISOString();
}

function directionBadge(direction: LoanDirection) {
	return direction === "given" ? (
		<Badge variant="blue">
			<ArrowUpRight className="h-3 w-3" />
			Given
		</Badge>
	) : (
		<Badge variant="gray">
			<ArrowDownLeft className="h-3 w-3" />
			Taken
		</Badge>
	);
}

function statusBadge(loan: Loan) {
	if (loan.status === "settled" || loan.status === "overpaid") {
		return <Badge variant="green">Settled</Badge>;
	}
	if (loan.isOverdue) {
		return <Badge variant="red">Overdue</Badge>;
	}
	return <Badge variant="amber">Outstanding</Badge>;
}

function LoansPage() {
	const { tab } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data, isLoading } = useGetLoans();

	const [createOpen, setCreateOpen] = useState(false);
	const [detailLoan, setDetailLoan] = useState<Loan | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Loan | null>(null);

	const loans = useMemo(() => data?.loans ?? [], [data]);

	const { outstandingLoans, settledLoans } = useMemo(() => {
		const outstandingLoans: Loan[] = [];
		const settledLoans: Loan[] = [];
		for (const loan of loans) {
			if (loan.status === "outstanding") outstandingLoans.push(loan);
			else settledLoans.push(loan);
		}
		return { outstandingLoans, settledLoans };
	}, [loans]);

	const totals = useMemo(() => {
		let givenOutstanding = 0;
		let takenOutstanding = 0;
		for (const loan of outstandingLoans) {
			if (loan.direction === "given") givenOutstanding += loan.remainingAmount;
			else takenOutstanding += loan.remainingAmount;
		}
		return { givenOutstanding, takenOutstanding };
	}, [outstandingLoans]);

	const handleTabChange = useCallback(
		(value: LoanTab) => {
			navigate({ search: { tab: value }, resetScroll: false });
		},
		[navigate],
	);

	return (
		<div className="max-w-5xl mx-auto space-y-6 min-w-0 overflow-hidden">
			<div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
				<div>
					<h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
						<Wallet className="h-6 w-6 text-primary" />
						Loans
					</h1>
					<p className="mt-1 text-muted-foreground">
						Track money you've lent or borrowed — settle via transactions.
					</p>
				</div>
				<Button onClick={() => setCreateOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Track a loan
				</Button>
			</div>

			{/* Summary */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Outstanding — lent by you
						</CardTitle>
						<ArrowUpRight className="h-4 w-4 text-ds-red-700" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-ds-red-700 dark:text-ds-red-900">
							{formatCurrency(totals.givenOutstanding)}
						</div>
						<p className="text-xs text-muted-foreground">
							Expecting repayments
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Outstanding — borrowed by you
						</CardTitle>
						<ArrowDownLeft className="h-4 w-4 text-ds-green-700" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-ds-green-700 dark:text-ds-green-900">
							{formatCurrency(totals.takenOutstanding)}
						</div>
						<p className="text-xs text-muted-foreground">You still owe</p>
					</CardContent>
				</Card>
			</div>

			{/* List */}
			{isLoading ? (
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : loans.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center gap-3 py-16 text-center">
						<div className="rounded-full bg-primary/10 p-4">
							<HandCoins className="h-8 w-8 text-primary" />
						</div>
						<div>
							<p className="font-medium">No tracked loans yet</p>
							<p className="text-sm text-muted-foreground">
								Record money you've lent or borrowed to keep tabs on it.
							</p>
						</div>
						<Button onClick={() => setCreateOpen(true)} size="sm">
							<Plus className="mr-2 h-4 w-4" />
							Track your first loan
						</Button>
					</CardContent>
				</Card>
			) : (
				<Tabs
					value={tab}
					onValueChange={(value) => handleTabChange(value as LoanTab)}
				>
					<TabsList>
						<TabsTrigger value="outstanding">
							Outstanding
							<span className="ml-1.5 rounded-full bg-primary/10 px-1.5 text-xs font-semibold tabular-nums">
								{outstandingLoans.length}
							</span>
						</TabsTrigger>
						<TabsTrigger value="settled">
							Settled
							<span className="ml-1.5 rounded-full bg-primary/10 px-1.5 text-xs font-semibold tabular-nums">
								{settledLoans.length}
							</span>
						</TabsTrigger>
					</TabsList>
					<TabsContent value="outstanding" className="mt-4">
						{outstandingLoans.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center gap-2 py-12 text-center">
									<div className="rounded-full bg-ds-green-700/10 p-3">
										<HandCoins className="h-6 w-6 text-ds-green-700" />
									</div>
									<p className="font-medium">No outstanding loans</p>
									<p className="text-sm text-muted-foreground">
										Everything is settled. New loans you track will appear here.
									</p>
								</CardContent>
							</Card>
						) : (
							<div className="space-y-3">
								{outstandingLoans.map((loan) => (
									<LoanCard
										key={loan.id}
										loan={loan}
										onViewDetails={setDetailLoan}
										onDelete={setDeleteTarget}
									/>
								))}
							</div>
						)}
					</TabsContent>
					<TabsContent value="settled" className="mt-4">
						{settledLoans.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center gap-2 py-12 text-center">
									<div className="rounded-full bg-primary/10 p-3">
										<Wallet className="h-6 w-6 text-primary" />
									</div>
									<p className="font-medium">No settled loans yet</p>
									<p className="text-sm text-muted-foreground">
										Loans move here once they're fully repaid.
									</p>
								</CardContent>
							</Card>
						) : (
							<div className="space-y-3">
								{settledLoans.map((loan) => (
									<LoanCard
										key={loan.id}
										loan={loan}
										onViewDetails={setDetailLoan}
										onDelete={setDeleteTarget}
									/>
								))}
							</div>
						)}
					</TabsContent>
				</Tabs>
			)}

			<CreateLoanDialog
				open={createOpen}
				onClose={() => setCreateOpen(false)}
			/>

			{detailLoan && (
				<LoanDetailDialog
					key={detailLoan.id + detailLoan.settlementCount}
					loan={detailLoan}
					onClose={() => setDetailLoan(null)}
				/>
			)}

			<DeleteLoanDialog
				loan={deleteTarget}
				onClose={() => setDeleteTarget(null)}
			/>
		</div>
	);
}

/* ── Loan card ─────────────────────────────────────────────────────────── */

function LoanCard({
	loan,
	onViewDetails,
	onDelete,
}: {
	loan: Loan;
	onViewDetails: (loan: Loan) => void;
	onDelete: (loan: Loan) => void;
}) {
	const progress =
		loan.principalAmount && Number(loan.principalAmount) > 0
			? Math.min(
					100,
					Math.round((loan.settledAmount / Number(loan.principalAmount)) * 100),
				)
			: 0;

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 space-y-1">
						<div className="flex flex-wrap items-center gap-2">
							<span className="font-semibold truncate">
								{loan.counterpartyName}
							</span>
							{directionBadge(loan.direction)}
							{statusBadge(loan)}
						</div>
						<p className="text-sm text-muted-foreground">
							Principal{" "}
							<span className="font-medium text-foreground">
								{formatCurrency(Number(loan.principalAmount))}
							</span>{" "}
							· Settled{" "}
							<span className="font-medium text-foreground">
								{formatCurrency(loan.settledAmount)}
							</span>{" "}
							({loan.settlementCount} payment
							{loan.settlementCount !== 1 ? "s" : ""})
							{loan.dueDate && (
								<> · Due {new Date(loan.dueDate).toLocaleDateString()}</>
							)}
						</p>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<div className="text-right">
							<p
								className={`font-semibold ${loan.remainingAmount <= 0 ? "text-ds-green-700 dark:text-ds-green-900" : ""}`}
							>
								{formatCurrency(Math.max(loan.remainingAmount, 0))}
							</p>
							<p className="text-xs text-muted-foreground">remaining</p>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => onViewDetails(loan)}>
									View details
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-ds-red-700 focus:text-ds-red-700"
									onClick={() => onDelete(loan)}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
					<div
						className={`h-full rounded-full ${loan.status === "outstanding" ? "bg-primary" : "bg-ds-green-700"}`}
						style={{ width: `${progress}%` }}
					/>
				</div>
				<div className="mt-2 flex items-center justify-between">
					<p className="text-xs text-muted-foreground">
						{progress}% settled
						{loan.isOverdue && (
							<span className="ml-2 text-destructive font-medium">
								Past due date
							</span>
						)}
					</p>
					<Button
						variant="outline"
						size="sm"
						disabled={loan.status !== "outstanding"}
						onClick={() => onViewDetails(loan)}
					>
						<TrendingUp className="mr-2 h-4 w-4" />
						Settle
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

/* ── Create dialog ─────────────────────────────────────────────────────── */

function CreateLoanDialog({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const createMutation = useCreateLoan();
	const [form, setForm] = useState({
		counterpartyName: "",
		direction: "given" as LoanDirection,
		principalAmount: "",
		dueDate: "",
		notes: "",
		createTransaction: true,
	});
	const [error, setError] = useState<string | null>(null);

	const submit = () => {
		setError(null);
		const amount = Number(form.principalAmount);
		if (!form.counterpartyName.trim()) {
			setError("Counterparty is required");
			return;
		}
		if (!Number.isFinite(amount) || amount <= 0) {
			setError("Enter an amount greater than 0");
			return;
		}
		createMutation.mutate(
			{
				counterpartyName: form.counterpartyName.trim(),
				direction: form.direction,
				principalAmount: amount,
				issuedDate: todayIso(),
				dueDate: form.dueDate || undefined,
				notes: form.notes.trim() || undefined,
				createTransaction: form.createTransaction,
			},
			{
				onSuccess: () => {
					toast.success("Loan tracked");
					setForm({
						counterpartyName: "",
						direction: "given",
						principalAmount: "",
						dueDate: "",
						notes: "",
						createTransaction: true,
					});
					onClose();
				},
				onError: (err) => {
					toast.error("Failed to track loan", { description: err.message });
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Track a loan</DialogTitle>
					<DialogDescription>
						Optionally record the money movement as a transaction too.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-2">
					{error && (
						<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
							{error}
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="loan-counterparty">Counterparty</Label>
						<Input
							id="loan-counterparty"
							placeholder="Who lent / borrowed?"
							value={form.counterpartyName}
							onChange={(e) =>
								setForm((f) => ({ ...f, counterpartyName: e.target.value }))
							}
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Direction</Label>
							<div className="flex gap-2">
								<Button
									type="button"
									variant={form.direction === "given" ? "default" : "outline"}
									size="sm"
									className="flex-1"
									onClick={() => setForm((f) => ({ ...f, direction: "given" }))}
								>
									<ArrowUpRight className="mr-1 h-4 w-4" />
									Given
								</Button>
								<Button
									type="button"
									variant={form.direction === "taken" ? "default" : "outline"}
									size="sm"
									className="flex-1"
									onClick={() => setForm((f) => ({ ...f, direction: "taken" }))}
								>
									<ArrowDownLeft className="mr-1 h-4 w-4" />
									Taken
								</Button>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="loan-amount">Amount (NPR)</Label>
							<Input
								id="loan-amount"
								type="number"
								min="0"
								step="0.01"
								placeholder="10000"
								value={form.principalAmount}
								onChange={(e) =>
									setForm((f) => ({ ...f, principalAmount: e.target.value }))
								}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label htmlFor="loan-due">Due date (optional)</Label>
							<Input
								id="loan-due"
								type="date"
								value={form.dueDate}
								onChange={(e) =>
									setForm((f) => ({ ...f, dueDate: e.target.value }))
								}
							/>
						</div>
						<div className="space-y-2 pt-6">
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={form.createTransaction}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											createTransaction: e.target.checked,
										}))
									}
								/>
								Also record as transaction
							</label>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="loan-notes">Notes (optional)</Label>
						<Textarea
							id="loan-notes"
							rows={2}
							placeholder="Any context…"
							value={form.notes}
							onChange={(e) =>
								setForm((f) => ({ ...f, notes: e.target.value }))
							}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={submit} disabled={createMutation.isPending}>
						{createMutation.isPending ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						Save loan
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/* ── Detail dialog (settlements + record settlement) ───────────────────── */

function LoanDetailDialog({
	loan,
	onClose,
}: {
	loan: Loan;
	onClose: () => void;
}) {
	const queryClient = useQueryClient();
	const detail = useGetLoan(loan.id);
	const settleMutation = useSettleLoan();
	const deleteMutation = useDeleteLoan();

	const [settleOpen, setSettleOpen] = useState(false);
	const [amount, setAmount] = useState(
		Math.max(loan.remainingAmount, 0).toString(),
	);
	const [remarks, setRemarks] = useState("");

	const current = detail.data?.loan ?? loan;
	const settlements: LoanSettlement[] = detail.data?.settlements ?? [];

	const recordSettlement = () => {
		const value = Number(amount);
		if (!Number.isFinite(value) || value <= 0) {
			toast.error("Enter an amount greater than 0");
			return;
		}
		settleMutation.mutate(
			{
				id: loan.id,
				amount: value,
				transactionDate: todayIso(),
				remarks: remarks.trim() || undefined,
			},
			{
				onSuccess: () => {
					toast.success("Repayment recorded");
					setSettleOpen(false);
					setRemarks("");
				},
				onError: (err) => {
					toast.error("Failed to record repayment", {
						description: err.message,
					});
				},
			},
		);
	};

	const handleDelete = () => {
		deleteMutation.mutate(
			{ id: loan.id },
			{
				onSuccess: () => {
					toast.success("Loan deleted");
					invalidateLoans(queryClient);
					onClose();
				},
				onError: (err) => {
					toast.error("Failed to delete loan", { description: err.message });
				},
			},
		);
	};

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex flex-wrap items-center gap-2">
						{current.counterpartyName}
						{directionBadge(current.direction)}
						{statusBadge(current)}
					</DialogTitle>
					<DialogDescription>
						Principal {formatCurrency(Number(current.principalAmount))} ·
						Settled {formatCurrency(current.settledAmount)} · Remaining{" "}
						<b>{formatCurrency(Math.max(current.remainingAmount, 0))}</b>
					</DialogDescription>
				</DialogHeader>

				{current.status === "outstanding" && !settleOpen && (
					<Button
						onClick={() => {
							setAmount(Math.max(current.remainingAmount, 0).toString());
							setSettleOpen(true);
						}}
					>
						<HandCoins className="mr-2 h-4 w-4" />
						Record repayment
					</Button>
				)}

				{settleOpen ? (
					<div className="space-y-3 rounded-lg border bg-muted/30 p-3">
						<div className="space-y-2">
							<Label htmlFor="settle-amount">Repayment amount (NPR)</Label>
							<Input
								id="settle-amount"
								type="number"
								min="0"
								step="0.01"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="settle-remarks">Note (optional)</Label>
							<Textarea
								id="settle-remarks"
								rows={2}
								value={remarks}
								onChange={(e) => setRemarks(e.target.value)}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Creates a {current.direction === "given" ? "credit" : "debit"}{" "}
							transaction linked to this loan.
						</p>
						<div className="flex justify-end gap-2">
							<Button variant="ghost" onClick={() => setSettleOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={recordSettlement}
								disabled={settleMutation.isPending}
							>
								{settleMutation.isPending ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : null}
								Record
							</Button>
						</div>
					</div>
				) : null}

				<div className="space-y-2">
					<p className="text-sm font-medium">
						Repayments ({settlements.length})
					</p>
					{settlements.length === 0 ? (
						<p className="py-2 text-sm text-muted-foreground">
							No repayments recorded yet.
						</p>
					) : (
						<ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
							{settlements.map((settlement: LoanSettlement) => (
								<li
									key={settlement.id}
									className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
								>
									<div className="min-w-0">
										<p className="truncate font-medium">
											{formatCurrency(
												Number(settlement.amount),
												settlement.currency ?? "NPR",
											)}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{settlement.transactionDate
												? new Date(
														settlement.transactionDate,
													).toLocaleDateString()
												: "No date"}
											{settlement.category?.name
												? ` · ${settlement.category.name}`
												: ""}
										</p>
									</div>
									<Badge variant="gray" contrast="low" size="sm">
										{current.direction === "given" ? "received" : "paid"}
									</Badge>
								</li>
							))}
						</ul>
					)}
				</div>

				<Separator />
				<div className="flex justify-between">
					<Button
						variant="ghost"
						size="sm"
						className="text-ds-red-700 hover:text-ds-red-800"
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete loan
					</Button>
					<Button variant="outline" size="sm" onClick={onClose}>
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/* ── Delete confirm ────────────────────────────────────────────────────── */

function DeleteLoanDialog({
	loan,
	onClose,
}: {
	loan: Loan | null;
	onClose: () => void;
}) {
	const deleteMutation = useDeleteLoan();
	const queryClient = useQueryClient();

	const handleDelete = () => {
		if (!loan) return;
		deleteMutation.mutate(
			{ id: loan.id },
			{
				onSuccess: () => {
					toast.success("Loan deleted");
					invalidateLoans(queryClient);
					onClose();
				},
				onError: (err) => {
					toast.error("Failed to delete loan", { description: err.message });
				},
			},
		);
	};

	return (
		<Dialog open={!!loan} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete loan?</DialogTitle>
					<DialogDescription>
						This removes the tracking record for{" "}
						<span className="font-medium">{loan?.counterpartyName}</span>.
						Linked transactions are kept.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending ? "Deleting…" : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function invalidateLoans(queryClient: ReturnType<typeof useQueryClient>) {
	queryClient.invalidateQueries({ queryKey: ["loans"] });
}
