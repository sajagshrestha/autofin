import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowDownLeft,
	ArrowUpRight,
	Eye,
	GitMerge,
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
	CounterpartySelect,
	type CounterpartySelection,
} from "@/components/ui/counterparty-select";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	type Loan,
	type LoanCounterparty,
	type LoanDirection,
	type LoanSettlement,
	useCombineLoans,
	useCreateLoan,
	useDeleteCounterparty,
	useDeleteLoan,
	useGetCounterparties,
	useGetLoan,
	useGetLoans,
	useManageSettlement,
	useSettleLoan,
	useUpdateCounterparty,
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

export function LoansPage() {
	const { tab } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data, isLoading } = useGetLoans();

	const [createOpen, setCreateOpen] = useState(false);
	const [counterpartiesOpen, setCounterpartiesOpen] = useState(false);
	const [detailLoan, setDetailLoan] = useState<Loan | null>(null);
	const [combineTarget, setCombineTarget] = useState<Loan | null>(null);
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

	// Loans that have at least one combinable partner (same counterparty +
	// direction) — used to enable the Combine menu item per card.
	const combinableIds = useMemo(() => {
		const counts = new Map<string, number>();
		for (const loan of loans) {
			const key = `${loan.counterparty.id}:${loan.direction}`;
			counts.set(key, (counts.get(key) ?? 0) + 1);
		}
		return new Set(
			loans
				.filter(
					(loan) =>
						(counts.get(`${loan.counterparty.id}:${loan.direction}`) ?? 0) > 1,
				)
				.map((loan) => loan.id),
		);
	}, [loans]);

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
					<h1 className="flex min-h-9 items-center text-xl sm:text-2xl font-semibold tracking-tight">
						Loans
					</h1>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<Button
						className="h-10 rounded-lg px-4"
						variant="outline"
						data-demo-action
						onClick={() => setCounterpartiesOpen(true)}
					>
						Counterparties
					</Button>
					<Button
						className="h-10 rounded-lg px-4 has-[>svg]:px-4"
						data-demo-action
						onClick={() => setCreateOpen(true)}
					>
						<Plus className="h-4 w-4" />
						Track a loan
					</Button>
				</div>
			</div>

			{/* Summary */}
			<div className="loan-summary grid grid-cols-2 gap-3 md:gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							<span className="md:hidden">Lent out</span>
							<span className="hidden md:inline">
								Outstanding — lent by you
							</span>
						</CardTitle>
						<ArrowUpRight className="h-4 w-4 text-ds-red-700" />
					</CardHeader>
					<CardContent>
						<div className="break-words text-base md:text-2xl font-bold tabular-nums text-ds-red-700 dark:text-ds-red-900">
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
							<span className="md:hidden">Borrowed</span>
							<span className="hidden md:inline">
								Outstanding — borrowed by you
							</span>
						</CardTitle>
						<ArrowDownLeft className="h-4 w-4 text-ds-green-700" />
					</CardHeader>
					<CardContent>
						<div className="break-words text-base md:text-2xl font-bold tabular-nums text-ds-green-700 dark:text-ds-green-900">
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
						<Button
							data-demo-action
							onClick={() => setCreateOpen(true)}
							size="sm"
						>
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
					<TabsList className="max-md:flex max-md:w-full max-md:[&>button]:flex-1">
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
										onCombine={setCombineTarget}
										canCombine={combinableIds.has(loan.id)}
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
										onCombine={setCombineTarget}
										canCombine={combinableIds.has(loan.id)}
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

			<CounterpartiesDialog
				open={counterpartiesOpen}
				onClose={() => setCounterpartiesOpen(false)}
			/>

			{detailLoan && (
				<LoanDetailDialog
					key={detailLoan.id + detailLoan.settlementCount}
					loan={detailLoan}
					onClose={() => setDetailLoan(null)}
				/>
			)}

			{combineTarget && (
				<LoanDetailDialog
					key={`${combineTarget.id}-combine`}
					loan={combineTarget}
					initialCombineOpen
					onClose={() => setCombineTarget(null)}
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
	onCombine,
	canCombine,
	onDelete,
}: {
	loan: Loan;
	onViewDetails: (loan: Loan) => void;
	onCombine: (loan: Loan) => void;
	canCombine: boolean;
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
									<Eye aria-hidden="true" className="mr-2 h-4 w-4" />
									View details
								</DropdownMenuItem>
								<DropdownMenuItem
									disabled={!canCombine}
									data-demo-action
									onClick={() => onCombine(loan)}
								>
									<GitMerge aria-hidden="true" className="mr-2 h-4 w-4" />
									Combine…
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-ds-red-700 focus:text-ds-red-700"
									data-demo-action
									onClick={() => onDelete(loan)}
								>
									<Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
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
						onClick={() => onViewDetails(loan)}
					>
						<TrendingUp className="mr-2 h-4 w-4" />
						Manage settlements
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
		counterparty: null as CounterpartySelection | null,
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
		const name =
			form.counterparty?.kind === "new" ? form.counterparty.name.trim() : null;
		if (!form.counterparty || (form.counterparty.kind === "new" && !name)) {
			setError("Select an existing counterparty or create a new one");
			return;
		}
		if (!Number.isFinite(amount) || amount <= 0) {
			setError("Enter an amount greater than 0");
			return;
		}
		createMutation.mutate(
			{
				...(form.counterparty.kind === "existing"
					? { counterpartyId: form.counterparty.id }
					: { counterpartyName: name as string }),
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
						counterparty: null,
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
						<CounterpartySelect
							id="loan-counterparty"
							value={form.counterparty}
							onChange={(counterparty) =>
								setForm((f) => ({ ...f, counterparty }))
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

/* ── Counterparties manager ────────────────────────────────────────────── */

function CounterpartiesDialog({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { data, isLoading } = useGetCounterparties();
	const counterparties = data?.counterparties ?? [];

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Counterparties</DialogTitle>
					<DialogDescription>
						People you lend to or borrow from. Renaming updates every loan
						linked to them.
					</DialogDescription>
				</DialogHeader>
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : counterparties.length === 0 ? (
					<p className="py-4 text-center text-sm text-muted-foreground">
						No counterparties yet — one is created each time you track a loan.
					</p>
				) : (
					<ul className="space-y-2">
						{counterparties.map((counterparty) => (
							<CounterpartyRow
								key={counterparty.id}
								counterparty={counterparty}
							/>
						))}
					</ul>
				)}
			</DialogContent>
		</Dialog>
	);
}

function CounterpartyRow({ counterparty }: { counterparty: LoanCounterparty }) {
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(counterparty.name);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const updateMutation = useUpdateCounterparty();
	const deleteMutation = useDeleteCounterparty();

	const save = () => {
		const trimmed = name.trim();
		if (!trimmed) {
			toast.error("Name cannot be empty");
			return;
		}
		if (trimmed === counterparty.name) {
			setEditing(false);
			return;
		}
		updateMutation.mutate(
			{ id: counterparty.id, name: trimmed },
			{
				onSuccess: () => {
					toast.success("Counterparty renamed");
					setEditing(false);
				},
				onError: (err) => {
					toast.error("Failed to rename", { description: err.message });
				},
			},
		);
	};

	const remove = () => {
		deleteMutation.mutate(
			{ id: counterparty.id },
			{
				onSuccess: () => toast.success("Counterparty deleted"),
				onError: (err) => {
					toast.error("Failed to delete", { description: err.message });
					setConfirmingDelete(false);
				},
			},
		);
	};

	return (
		<li className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
			<div className="min-w-0 flex-1">
				{editing ? (
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="h-8"
					/>
				) : (
					<>
						<p className="truncate font-medium">{counterparty.name}</p>
						<p className="text-xs text-muted-foreground">
							{counterparty.totalLoans} loan
							{counterparty.totalLoans !== 1 ? "s" : ""}
						</p>
					</>
				)}
			</div>
			<div className="flex shrink-0 items-center gap-1">
				{editing ? (
					<>
						<Button
							variant="ghost"
							size="sm"
							onClick={save}
							disabled={updateMutation.isPending}
						>
							Save
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setEditing(false);
								setName(counterparty.name);
							}}
						>
							Cancel
						</Button>
					</>
				) : confirmingDelete ? (
					<>
						<Button
							variant="destructive"
							size="sm"
							onClick={remove}
							disabled={deleteMutation.isPending}
						>
							Confirm
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setConfirmingDelete(false)}
						>
							Cancel
						</Button>
					</>
				) : (
					<>
						<Button
							variant="ghost"
							size="sm"
							data-demo-action
							onClick={() => setEditing(true)}
						>
							Rename
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="text-ds-red-700 hover:text-ds-red-800"
							data-demo-action
							onClick={() => setConfirmingDelete(true)}
							title={
								counterparty.totalLoans > 0
									? "Delete or reassign its loans first"
									: "Delete counterparty"
							}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</>
				)}
			</div>
		</li>
	);
}

/* ── Detail dialog (settlements + record settlement) ───────────────────── */

function LoanDetailDialog({
	loan,
	initialCombineOpen = false,
	onClose,
}: {
	loan: Loan;
	initialCombineOpen?: boolean;
	onClose: () => void;
}) {
	const queryClient = useQueryClient();
	const detail = useGetLoan(loan.id);
	const settleMutation = useSettleLoan();
	const deleteMutation = useDeleteLoan();
	const combineMutation = useCombineLoans();
	const { data: allLoansData } = useGetLoans();

	const [settleOpen, setSettleOpen] = useState(false);
	const [amount, setAmount] = useState(
		Math.max(loan.remainingAmount, 0).toString(),
	);
	const [remarks, setRemarks] = useState("");
	const [combineOpen, setCombineOpen] = useState(initialCombineOpen);
	const [secondaryId, setSecondaryId] = useState("");
	const [confirmingCombine, setConfirmingCombine] = useState(false);

	const current = detail.data?.loan ?? loan;
	const settlements: LoanSettlement[] = detail.data?.settlements ?? [];

	const combinableLoans = useMemo(
		() =>
			(allLoansData?.loans ?? []).filter(
				(other) =>
					other.id !== loan.id &&
					other.counterparty.id === current.counterparty.id &&
					other.direction === current.direction,
			),
		[allLoansData, loan.id, current.counterparty.id, current.direction],
	);

	const handleCombine = () => {
		if (!secondaryId) {
			toast.error("Pick another loan to combine into this one");
			return;
		}
		combineMutation.mutate(
			{ primaryLoanId: loan.id, secondaryLoanId: secondaryId },
			{
				onSuccess: () => {
					toast.success("Loans combined");
					invalidateLoans(queryClient);
					onClose();
				},
				onError: (err) => {
					toast.error("Failed to combine loans", {
						description: err.message,
					});
					setConfirmingCombine(false);
				},
			},
		);
	};

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
						data-demo-action
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
								data-demo-action
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
						Repayments{detail.isPending ? "" : ` (${settlements.length})`}
					</p>
					{detail.isPending ? (
						<div
							role="status"
							aria-label="Loading repayments"
							className="space-y-2"
						>
							{[0, 1].map((i) => (
								<div key={i} className="space-y-3 rounded-lg border p-3">
									<Skeleton className="h-4 w-28" />
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-3 w-3/4" />
									<div className="flex gap-2">
										<Skeleton className="h-8 w-14" />
										<Skeleton className="h-8 w-20" />
									</div>
								</div>
							))}
						</div>
					) : detail.isError ? (
						<div role="alert" className="space-y-2 py-2">
							<p className="text-sm text-muted-foreground">
								Could not load repayments.
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => detail.refetch()}
							>
								Try again
							</Button>
						</div>
					) : settlements.length === 0 ? (
						<p className="py-2 text-sm text-muted-foreground">
							No repayments recorded yet.
						</p>
					) : (
						<ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
							{settlements.map((settlement: LoanSettlement) => (
								<SettlementRow
									key={settlement.id}
									loanId={loan.id}
									settlement={settlement}
								/>
							))}
						</ul>
					)}
				</div>

				{combinableLoans.length > 0 && !combineOpen && (
					<Button
						variant="outline"
						size="sm"
						className="w-full"
						data-demo-action
						onClick={() => {
							setSecondaryId(combinableLoans[0].id);
							setConfirmingCombine(false);
							setCombineOpen(true);
						}}
					>
						Combine with another loan
					</Button>
				)}

				{combineOpen ? (
					<div className="space-y-3 rounded-lg border bg-muted/30 p-3">
						<div className="space-y-2">
							<Label htmlFor="combine-loan-select">Merge into this loan</Label>
							<Select value={secondaryId} onValueChange={setSecondaryId}>
								<SelectTrigger id="combine-loan-select" className="w-full">
									<SelectValue placeholder="Pick a loan" />
								</SelectTrigger>
								<SelectContent>
									{combinableLoans.map((other) => (
										<SelectItem key={other.id} value={other.id}>
											{formatCurrency(Number(other.principalAmount))} ·{" "}
											{formatCurrency(Math.max(other.remainingAmount, 0))}{" "}
											remaining
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<p className="text-xs text-muted-foreground">
							Amounts and repayments move here and the other loan is deleted.
							This cannot be undone.
						</p>
						<div className="flex justify-end gap-2">
							{confirmingCombine ? (
								<>
									<Button
										variant="ghost"
										onClick={() => setConfirmingCombine(false)}
									>
										Cancel
									</Button>
									<Button
										data-demo-action
										onClick={handleCombine}
										disabled={combineMutation.isPending || !secondaryId}
									>
										{combineMutation.isPending ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : null}
										Confirm combine
									</Button>
								</>
							) : (
								<>
									<Button variant="ghost" onClick={() => setCombineOpen(false)}>
										Cancel
									</Button>
									<Button
										onClick={() => setConfirmingCombine(true)}
										disabled={!secondaryId}
									>
										Combine
									</Button>
								</>
							)}
						</div>
					</div>
				) : null}

				<Separator />
				<div className="flex justify-between">
					<Button
						variant="ghost"
						size="sm"
						className="text-ds-red-700 hover:text-ds-red-800"
						data-demo-action
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
					>
						<Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
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
						data-demo-action
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

function SettlementRow({
	loanId,
	settlement,
}: {
	loanId: string;
	settlement: LoanSettlement;
}) {
	const mutation = useManageSettlement();
	const [editing, setEditing] = useState(false);
	const [removing, setRemoving] = useState(false);
	const [amount, setAmount] = useState(settlement.amount);
	const [date, setDate] = useState(
		settlement.transactionDate?.slice(0, 10) ?? "",
	);
	const [remarks, setRemarks] = useState(settlement.remarks ?? "");
	const save = (unlink = false) => {
		const value = Number(amount);
		if (!unlink && (!Number.isFinite(value) || value <= 0 || !date)) {
			toast.error("Enter a positive amount and a valid date");
			return;
		}
		mutation.mutate(
			{
				id: loanId,
				transactionId: settlement.id,
				...(unlink
					? {}
					: {
							changes: {
								amount: value,
								transactionDate:
									date === settlement.transactionDate?.slice(0, 10)
										? settlement.transactionDate
										: new Date(`${date}T12:00:00`).toISOString(),
								remarks,
							},
						}),
			},
			{
				onSuccess: () => {
					setEditing(false);
					setRemoving(false);
					toast.success(
						unlink
							? "Settlement removed; transaction kept"
							: "Settlement updated",
					);
				},
				onError: (error) => toast.error(error.message),
			},
		);
	};
	return (
		<li className="space-y-3 rounded-lg border p-3 text-sm">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div>
					<p className="font-medium">
						{formatCurrency(
							Number(settlement.amount),
							settlement.currency ?? "NPR",
						)}
					</p>
					<p className="text-xs text-muted-foreground">
						{settlement.transactionDate
							? new Date(settlement.transactionDate).toLocaleDateString()
							: "No date"}
					</p>
					{settlement.remarks && (
						<p className="break-words text-xs text-muted-foreground">
							{settlement.remarks}
						</p>
					)}
				</div>
				{!editing && !removing && (
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							data-demo-action
							onClick={() => {
								setAmount(settlement.amount);
								setDate(settlement.transactionDate?.slice(0, 10) ?? "");
								setRemarks(settlement.remarks ?? "");
								setEditing(true);
							}}
						>
							Edit
						</Button>
						<Button
							size="sm"
							variant="outline"
							data-demo-action
							onClick={() => setRemoving(true)}
						>
							Remove
						</Button>
					</div>
				)}
			</div>
			{editing && (
				<div className="space-y-3">
					<label
						htmlFor={`settlement-amount-${settlement.id}`}
						className="block space-y-1"
					>
						<span>Amount ({settlement.currency ?? "NPR"})</span>
						<Input
							id={`settlement-amount-${settlement.id}`}
							type="number"
							min="0.01"
							step="0.01"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</label>
					<label
						htmlFor={`settlement-date-${settlement.id}`}
						className="block space-y-1"
					>
						<span>Date</span>
						<Input
							id={`settlement-date-${settlement.id}`}
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
						/>
					</label>
					<label
						htmlFor={`settlement-remarks-${settlement.id}`}
						className="block space-y-1"
					>
						<span>Remarks</span>
						<Textarea
							id={`settlement-remarks-${settlement.id}`}
							maxLength={5000}
							value={remarks}
							onChange={(e) => setRemarks(e.target.value)}
						/>
					</label>
					<p className="text-xs text-muted-foreground">
						Changes also update the linked transaction.
					</p>
					<div className="flex gap-2">
						<Button
							size="sm"
							disabled={mutation.isPending}
							data-demo-action
							onClick={() => save()}
						>
							Save changes
						</Button>
						<Button
							size="sm"
							variant="ghost"
							disabled={mutation.isPending}
							onClick={() => setEditing(false)}
						>
							Cancel
						</Button>
					</div>
				</div>
			)}
			{removing && (
				<div className="space-y-2">
					<p>
						Remove this repayment from the loan? The transaction will be kept,
						and the outstanding balance will be recalculated.
					</p>
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="destructive"
							disabled={mutation.isPending}
							data-demo-action
							onClick={() => save(true)}
						>
							Remove settlement
						</Button>
						<Button
							size="sm"
							variant="ghost"
							disabled={mutation.isPending}
							onClick={() => setRemoving(false)}
						>
							Cancel
						</Button>
					</div>
				</div>
			)}
		</li>
	);
}
