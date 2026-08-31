import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { HandCoins, Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/components/BackButton";
import { EditTransactionForm } from "@/components/EditTransactionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Category, Transaction } from "@/hooks";
import { useGetAllCategories } from "@/hooks/categories/queries";
import type { LoanDirection } from "@/hooks/loans";
import { useCreateLoan } from "@/hooks/loans";
import {
	useDeleteTransaction,
	useUpdateTransaction,
} from "@/hooks/transactions/mutations";
import { useGetTransactionById } from "@/hooks/transactions/queries";
import { formatCurrency } from "@/lib/formatCurrency";

export const Route = createFileRoute(
	"/_authenticated/transactions/$transactionId",
)({
	component: TransactionDetailPage,
});

/** Format AI confidence (e.g. "0.95" → "95%", or pass through if already percentage). */
function formatAiConfidence(value: string): string {
	const n = Number.parseFloat(value);
	if (Number.isNaN(n)) return value;
	if (n <= 1 && n >= 0) return `${Math.round(n * 100)}%`;
	return `${n}%`;
}

function TransactionDetailPage() {
	const { transactionId } = Route.useParams();
	const navigate = useNavigate();
	const [editOpen, setEditOpen] = useState(false);
	const [loanOpen, setLoanOpen] = useState(false);
	const [loanCounterparty, setLoanCounterparty] = useState("");
	const [loanDueDate, setLoanDueDate] = useState("");
	const createLoanMutation = useCreateLoan();
	const { data, isLoading, error, refetch } =
		useGetTransactionById(transactionId);
	const { data: categoriesData } = useGetAllCategories();
	const deleteMutation = useDeleteTransaction();
	const updateMutation = useUpdateTransaction();

	const transaction = data?.transaction as Transaction | undefined;
	const categories = (categoriesData?.categories as Category[]) ?? [];

	const handleDelete = () => {
		if (!transaction) return;

		deleteMutation.mutate(
			{
				id: transaction.id,
			},
			{
				onSuccess: () => {
					toast.success("Transaction deleted");
					navigate({ to: "/transactions" });
				},
				onError: (err) => {
					toast.error("Failed to delete transaction", {
						description: err.message,
					});
				},
			},
		);
	};

	if (isLoading) {
		return (
			<div className="max-w-3xl mx-auto">
				<div className="animate-pulse space-y-6">
					<div className="h-8 w-48 bg-muted rounded" />
					<div className="h-40 bg-muted rounded" />
					<div className="h-64 bg-muted rounded" />
				</div>
			</div>
		);
	}

	if (error || !transaction) {
		return (
			<div className="max-w-3xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Transaction not found</CardTitle>
						<CardDescription>
							{error?.message ?? "This transaction may have been removed."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BackButton fallback="/transactions" variant="outline">
							Back to Transactions
						</BackButton>
					</CardContent>
				</Card>
			</div>
		);
	}

	const amountNum = parseFloat(transaction.amount ?? "0");
	const formattedAmount = formatCurrency(
		amountNum,
		transaction.currency ?? "NPR",
	);
	const isDebit = transaction.type === "debit";

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<BackButton
					fallback="/transactions"
					variant="ghost"
					size="sm"
					className="gap-2"
				>
					Back to Transactions
				</BackButton>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
						onClick={() => setEditOpen(true)}
					>
						<Pencil className="h-4 w-4" />
						Edit
					</Button>
					{!transaction.loanId && (
						<Button
							variant="outline"
							size="sm"
							className="gap-2"
							onClick={() => {
								setLoanCounterparty("");
								setLoanDueDate("");
								setLoanOpen(true);
							}}
						>
							<HandCoins className="h-4 w-4" />
							Track as loan
						</Button>
					)}
					{transaction.loanId && (
						<Badge
							variant="secondary"
							title="This transaction is part of a tracked loan"
						>
							Loan-linked
						</Badge>
					)}
					{transaction && (
						<EditTransactionForm
							transaction={transaction}
							categories={categories}
							open={editOpen}
							onOpenChange={setEditOpen}
							onSubmit={(body) => {
								updateMutation.mutate(
									{
										id: transaction.id,
										...body,
									},
									{
										onSuccess: () => {
											toast.success("Transaction updated");
											setEditOpen(false);
											refetch();
										},
										onError: (err) => {
											toast.error("Failed to update transaction", {
												description: err.message,
											});
										},
									},
								);
							}}
							isPending={updateMutation.isPending}
							onCancel={() => setEditOpen(false)}
						/>
					)}
					<DeleteConfirmButton
						merchant={transaction.merchant ?? "this transaction"}
						onConfirm={handleDelete}
						isPending={deleteMutation.isPending}
					/>
				</div>
			</div>

			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-start justify-between gap-4">
						<div>
							<CardTitle className="text-2xl">
								{transaction.merchant ?? "Unknown merchant"}
							</CardTitle>
							<CardDescription>
								{transaction.transactionDate
									? format(new Date(transaction.transactionDate), "PPP")
									: "No date"}
							</CardDescription>
						</div>
						<span
							className={`text-xl font-semibold ${
								isDebit
									? "text-destructive"
									: "text-ds-green-700 dark:text-ds-green-900"
							}`}
						>
							{isDebit ? "-" : "+"}
							{formattedAmount}
						</span>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<Separator />

					<div className="grid gap-4 sm:grid-cols-2">
						<DetailRow
							label="Transaction date"
							value={
								transaction.transactionDate
									? format(new Date(transaction.transactionDate), "PPP")
									: "—"
							}
						/>
						<DetailRow
							label="Type"
							value={
								<Badge variant={isDebit ? "destructive" : "default"}>
									{transaction.type}
								</Badge>
							}
						/>
						<DetailRow
							label="Amount"
							value={
								<span
									className={
										isDebit
											? "text-destructive font-medium"
											: "text-ds-green-700 dark:text-ds-green-900 font-medium"
									}
								>
									{isDebit ? "-" : "+"}
									{formattedAmount}
								</span>
							}
						/>
						<DetailRow label="Currency" value={transaction.currency ?? "—"} />
						<DetailRow
							label="Category"
							value={
								transaction.category ? (
									<Badge variant="secondary" className="font-normal">
										{transaction.category.icon && (
											<span className="mr-1">{transaction.category.icon}</span>
										)}
										{transaction.category.name}
									</Badge>
								) : (
									<span className="text-muted-foreground italic">
										Uncategorized
									</span>
								)
							}
						/>
						<DetailRow label="Bank" value={transaction.bankName ?? "—"} />
						{transaction.accountNumber != null &&
							transaction.accountNumber !== "" && (
								<DetailRow
									label="Account number"
									value={transaction.accountNumber}
								/>
							)}
						{transaction.isAiCreated != null && (
							<DetailRow
								label="Created by AI"
								value={
									<Badge
										variant={transaction.isAiCreated ? "secondary" : "outline"}
									>
										{transaction.isAiCreated ? "Yes" : "No"}
									</Badge>
								}
							/>
						)}
						{transaction.aiConfidence != null &&
							transaction.aiConfidence !== "" && (
								<DetailRow
									label="AI confidence"
									value={formatAiConfidence(transaction.aiConfidence)}
								/>
							)}
					</div>

					{transaction.remarks != null && transaction.remarks !== "" && (
						<>
							<Separator />
							<DetailRow label="Remarks" value={transaction.remarks} />
						</>
					)}

					{transaction.notes != null && transaction.notes !== "" && (
						<>
							<Separator />
							<DetailRow label="Notes" value={transaction.notes} />
						</>
					)}

					<Separator />

					<div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
						<DetailRow
							label="Created"
							value={
								transaction.createdAt
									? format(new Date(transaction.createdAt), "PPp")
									: "—"
							}
						/>
						<DetailRow
							label="Updated"
							value={
								transaction.updatedAt
									? format(new Date(transaction.updatedAt), "PPp")
									: "—"
							}
						/>
					</div>
				</CardContent>
			</Card>

			<Dialog open={loanOpen} onOpenChange={setLoanOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Track as loan</DialogTitle>
						<DialogDescription>
							This transaction becomes the origin of a tracked loan (
							{formatCurrency(amountNum, transaction.currency ?? "NPR")},{" "}
							{transaction.type === "debit"
								? "money you gave"
								: "money you took"}
							).
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-1">
						<div className="space-y-2">
							<Label htmlFor="loan-counterparty">Counterparty</Label>
							<Input
								id="loan-counterparty"
								placeholder={transaction.merchant ?? "Who is this with?"}
								value={loanCounterparty}
								onChange={(e) => setLoanCounterparty(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="loan-due">Due date (optional)</Label>
							<Input
								id="loan-due"
								type="date"
								value={loanDueDate}
								onChange={(e) => setLoanDueDate(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setLoanOpen(false)}>
							Cancel
						</Button>
						<Button
							disabled={createLoanMutation.isPending}
							onClick={() => {
								if (!loanCounterparty.trim()) {
									toast.error("Counterparty is required");
									return;
								}
								const direction: LoanDirection =
									transaction.type === "debit" ? "given" : "taken";
								createLoanMutation.mutate(
									{
										counterpartyName: loanCounterparty.trim(),
										direction,
										principalAmount: amountNum,
										originTransactionId: transaction.id,
										dueDate: loanDueDate || undefined,
									},
									{
										onSuccess: () => {
											toast.success("Loan tracked");
											setLoanOpen(false);
											refetch();
										},
										onError: (err) => {
											toast.error("Failed to track loan", {
												description: err.message,
											});
										},
									},
								);
							}}
						>
							{createLoanMutation.isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							Track loan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function DetailRow({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="space-y-1">
			<p className="text-sm font-medium text-muted-foreground">{label}</p>
			<div className="text-foreground">{value}</div>
		</div>
	);
}

function DeleteConfirmButton({
	merchant,
	onConfirm,
	isPending,
}: {
	merchant: string;
	onConfirm: () => void;
	isPending: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				variant="outline"
				size="sm"
				className="text-destructive hover:text-destructive hover:bg-destructive/10"
				onClick={() => setOpen(true)}
			>
				<Trash2 className="h-4 w-4" />
				Delete
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete transaction?</DialogTitle>
						<DialogDescription>
							This cannot be undone. This will permanently delete the
							transaction for <span className="font-medium">{merchant}</span>.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								onConfirm();
								setOpen(false);
							}}
							disabled={isPending}
						>
							{isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
