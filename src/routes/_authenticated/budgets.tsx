import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	Bell,
	BellOff,
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
	Pencil,
	Plus,
	Sparkles,
	Target,
	TrendingDown,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { NoData } from "@/components/ui/no-data";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllCategories } from "@/hooks/categories/queries";
import { unwrap } from "@/lib/api-client";
import { useApiClient } from "@/lib/api-context";
import {
	type BudgetInput,
	type BudgetList,
	type BudgetProposal,
	type BudgetRow,
	budgetInputSchema,
	currentBudgetMonth,
	shiftBudgetMonth,
} from "@/lib/budgets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/budgets")({
	component: BudgetsPage,
});
const money = (n: number) =>
	`NPR ${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
export function BudgetsPage() {
	const rpc = useApiClient();
	const client = useQueryClient();
	const current = currentBudgetMonth();
	const [month, setMonth] = useState(current);
	const [editor, setEditor] = useState<BudgetRow | "new" | null>(null);
	const [aiOpen, setAiOpen] = useState(false);
	const [target, setTarget] = useState("");
	const [proposals, setProposals] = useState<
		(BudgetProposal & { selected: boolean })[]
	>([]);
	const [historyMonths, setHistoryMonths] = useState(0);
	const categories = useGetAllCategories();
	const query = useQuery({
		queryKey: ["budgets", month],
		staleTime: 0,
		refetchInterval: 30000,
		queryFn: async () =>
			unwrap<BudgetList>(await rpc.api.budgets.$get({ query: { month } })),
	});
	const currentQuery = useQuery({
		queryKey: ["budgets", current],
		enabled: month !== current,
		staleTime: 0,
		queryFn: async () =>
			unwrap<BudgetList>(
				await rpc.api.budgets.$get({ query: { month: current } }),
			),
	});
	const currentRows =
		(month === current ? query.data : currentQuery.data)?.budgets ?? [];
	const save = useMutation({
		mutationFn: async (budgets: BudgetInput[]) =>
			unwrap(await rpc.api.budgets.$post({ json: { budgets } })),
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ["budgets"] });
			setEditor(null);
			setAiOpen(false);
			setProposals([]);
			toast.success("Budgets saved");
		},
		onError: (e) => toast.error(e.message),
	});
	const stop = useMutation({
		mutationFn: async (categoryId: string) =>
			unwrap(
				await rpc.api.budgets[":categoryId"].stop.$post({
					param: { categoryId },
				}),
			),
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ["budgets"] });
			toast.success("Budget will stop next month");
		},
		onError: (e) => toast.error(e.message),
	});
	const suggest = useMutation({
		mutationFn: async () =>
			unwrap<{ proposals: BudgetProposal[]; months: number }>(
				await rpc.api.budgets.suggest.$post({
					json: { target: target ? Number(target) : undefined },
				}),
			),
		onSuccess: (d) => {
			setProposals(d.proposals.map((p) => ({ ...p, selected: true })));
			setHistoryMonths(d.months);
		},
		onError: (e) => toast.error(e.message),
	});
	const rows = query.data?.budgets ?? [];
	const totalLimit = rows.reduce((sum, budget) => sum + budget.amount, 0);
	const totalSpent = rows.reduce((sum, budget) => sum + budget.spent, 0);
	const overCount = rows.filter(
		(budget) => budget.spent > budget.amount,
	).length;
	const monthLabel = new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${month}-01T00:00:00Z`));
	const available =
		categories.data?.categories.filter(
			(c) => !rows.some((b) => b.categoryId === c.id),
		) ?? [];
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
						Budgets
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Give every category a monthly spending limit.
					</p>
				</div>
				<div className="flex w-full gap-2 sm:w-auto">
					<Button
						className="flex-1 sm:flex-none"
						variant="outline"
						onClick={() => setAiOpen(true)}
					>
						<Sparkles className="size-4" />
						Suggest budgets
					</Button>
					<Button
						className="flex-1 sm:flex-none"
						disabled={
							month !== current ||
							query.isPending ||
							query.isError ||
							!available.length
						}
						onClick={() => setEditor("new")}
					>
						<Plus className="size-4" />
						Add budget
					</Button>
				</div>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3">
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Previous month"
						disabled={
							query.isPending ||
							!query.data?.firstMonth ||
							month <= query.data.firstMonth
						}
						onClick={() => setMonth(shiftBudgetMonth(month, -1))}
					>
						<ChevronLeft className="size-4" />
					</Button>
					<label htmlFor="budget-month" className="sr-only">
						Budget month (AD)
					</label>
					<Input
						id="budget-month"
						aria-label="Budget month (AD)"
						type="month"
						className="h-9 w-44 border-0 bg-transparent text-center shadow-none"
						value={month}
						min={query.data?.firstMonth}
						max={current}
						onChange={(e) => {
							const value = e.target.value;
							if (
								value &&
								value <= current &&
								(!query.data?.firstMonth || value >= query.data.firstMonth)
							)
								setMonth(value);
						}}
					/>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Next month"
						disabled={month >= current}
						onClick={() => setMonth(shiftBudgetMonth(month, 1))}
					>
						<ChevronRight className="size-4" />
					</Button>
				</div>
				{month !== current ? (
					<Button variant="ghost" size="sm" onClick={() => setMonth(current)}>
						Back to this month
					</Button>
				) : (
					<span className="px-2 text-xs text-muted-foreground">
						Resets monthly · No rollover
					</span>
				)}
			</div>
			{query.isPending ? (
				<BudgetsSkeleton showActions={month === current} />
			) : query.isError ? (
				<div
					role="alert"
					className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-10 text-center"
				>
					<span className="rounded-xl bg-destructive/10 p-3 text-destructive">
						<AlertCircle className="size-5" />
					</span>
					<h2 className="font-semibold">Budgets couldn’t be loaded</h2>
					<p className="max-w-sm text-sm text-muted-foreground">
						Your budget data is unavailable right now. Try loading it again.
					</p>
					<Button variant="outline" onClick={() => query.refetch()}>
						Try again
					</Button>
				</div>
			) : rows.length === 0 ? (
				<div className="rounded-xl border bg-card">
					<NoData
						title={
							month === current
								? "Make room for what matters"
								: "No budgets for this month"
						}
						description={
							month === current
								? "Set a monthly category limit to see where your money goes and how much you have left."
								: "Choose another month to explore your budget history."
						}
					>
						{month === current && (
							<Button
								disabled={!available.length}
								onClick={() => setEditor("new")}
							>
								<Plus className="size-4" />
								Create your first budget
							</Button>
						)}
					</NoData>
				</div>
			) : (
				<>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
						<BudgetMetric
							label="Monthly budget"
							value={money(totalLimit)}
							description={`${rows.length} budgeted ${rows.length === 1 ? "category" : "categories"}`}
							icon={Target}
						/>
						<BudgetMetric
							label="Spent so far"
							value={money(totalSpent)}
							description={`${Math.round((totalSpent / totalLimit) * 100)}% of your budget used`}
							icon={TrendingDown}
							tone="red"
						/>
						<BudgetMetric
							label={totalSpent > totalLimit ? "Over budget" : "Left to spend"}
							value={money(Math.abs(totalLimit - totalSpent))}
							description={
								overCount
									? `${overCount} ${overCount === 1 ? "category is" : "categories are"} over budget`
									: "Across your budgeted categories"
							}
							icon={Wallet}
							tone="green"
							danger={totalSpent > totalLimit}
						/>
					</div>
					<div className="space-y-4">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<h2 className="text-base font-semibold">Category budgets</h2>
							<span className="text-xs text-muted-foreground">
								{monthLabel}
								{month !== current ? " · History" : ""}
							</span>
						</div>
						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
							{rows.map((b) => {
								const percent = Math.round((b.spent / b.amount) * 100);
								const over = b.spent > b.amount;
								const near = !over && b.spent >= b.amount * 0.8;
								const category = categories.data?.categories.find(
									(c) => c.id === b.categoryId,
								);
								return (
									<article
										key={b.categoryId}
										className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs"
									>
										<div className="space-y-5 p-5">
											<div className="flex items-start justify-between gap-3">
												<div className="flex min-w-0 items-center gap-3">
													<span
														aria-hidden="true"
														className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted/60 text-lg"
													>
														{category?.icon || (
															<Target className="size-4 text-muted-foreground" />
														)}
													</span>
													<div className="min-w-0">
														<h3 className="break-words text-sm font-semibold">
															{b.name}
														</h3>
														<div className="mt-1.5">
															<Badge
																size="sm"
																variant={
																	over ? "red" : near ? "amber" : "secondary"
																}
															>
																{over
																	? "Over budget"
																	: b.spent === b.amount
																		? "Limit reached"
																		: near
																			? "Near limit"
																			: "Within budget"}
															</Badge>
														</div>
													</div>
												</div>
												{month === current && (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon-sm"
																aria-label={`Manage ${b.name} budget`}
															>
																<MoreHorizontal className="size-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem onSelect={() => setEditor(b)}>
																<Pencil className="size-4" />
																Edit budget
															</DropdownMenuItem>
															<DropdownMenuItem
																disabled={b.stopping || stop.isPending}
																onSelect={() => stop.mutate(b.categoryId)}
															>
																{b.stopping
																	? "Stops next month"
																	: "Stop from next month"}
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												)}
											</div>
											<div>
												<p className="text-2xl font-semibold tracking-tight tabular-nums">
													{money(b.spent)}
												</p>
												<p className="mt-1 text-xs text-muted-foreground">
													spent of {money(b.amount)}
												</p>
											</div>
											<div className="space-y-2.5">
												<BudgetProgress
													spent={b.spent}
													limit={b.amount}
													name={b.name}
												/>
												<div className="flex items-center justify-between gap-2 text-xs">
													<span
														className={cn(
															"font-medium tabular-nums",
															over ? "text-destructive" : "text-foreground",
														)}
													>
														{money(Math.abs(b.amount - b.spent))}{" "}
														{over ? "over" : "left"}
													</span>
													<span className="text-muted-foreground tabular-nums">
														{percent}% used
													</span>
												</div>
											</div>
										</div>
										<div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
											<span className="flex items-center gap-1.5">
												{b.notifications ? (
													<Bell className="size-3.5" />
												) : (
													<BellOff className="size-3.5" />
												)}
												{b.notifications
													? `Alerts at ${b.thresholds.join("%, ")}%`
													: "Alerts off"}
											</span>
											{b.stopping && (
												<Badge size="sm" variant="outline">
													Stops next month
												</Badge>
											)}
											{month === current && (
												<Button
													variant="ghost"
													size="sm"
													className="h-7 px-2 text-xs"
													aria-label={`Edit ${b.name} budget`}
													onClick={() => setEditor(b)}
												>
													Edit
												</Button>
											)}
										</div>
									</article>
								);
							})}
						</div>
					</div>
				</>
			)}
			<div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
				<p>NPR · AD calendar · Nepal time. All category expenses count.</p>
				<Link
					to="/settings/notifications"
					className="inline-flex items-center gap-1.5 rounded-md py-2 text-foreground underline-offset-4 hover:underline"
				>
					<Bell className="size-3.5" />
					Manage push notifications
					<ChevronRight className="size-3" />
				</Link>
			</div>
			<Dialog
				open={editor !== null}
				onOpenChange={(open) => {
					if (!open && !save.isPending) setEditor(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editor === "new" ? "Add budget" : "Edit budget"}
						</DialogTitle>
						<DialogDescription>
							Applies this month and repeats monthly. Past limits stay
							unchanged.
						</DialogDescription>
					</DialogHeader>
					{editor && (
						<BudgetEditor
							key={editor === "new" ? "new" : editor.categoryId}
							budget={editor === "new" ? undefined : editor}
							categories={available}
							pending={save.isPending}
							onSave={(b) => save.mutate([b])}
						/>
					)}
				</DialogContent>
			</Dialog>
			<Dialog
				open={aiOpen}
				onOpenChange={(open) => {
					if (!suggest.isPending && !save.isPending) setAiOpen(open);
				}}
			>
				<DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Suggest budgets</DialogTitle>
						<DialogDescription>
							AI analyzes up to three completed months. At least one full month
							of history is required. Review and edit before applying to the
							current month.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							suggest.mutate();
						}}
						className="flex flex-wrap items-end gap-3"
					>
						<label htmlFor="budget-target" className="flex-1 space-y-2 text-sm">
							Optional monthly spending target (NPR)
							<Input
								type="number"
								min="0.01"
								step="0.01"
								max="9999999999.99"
								id="budget-target"
								value={target}
								onChange={(e) => setTarget(e.target.value)}
							/>
						</label>
						<Button disabled={suggest.isPending || save.isPending}>
							{suggest.isPending ? "Analyzing…" : "Generate suggestions"}
						</Button>
					</form>
					{proposals.length > 0 && (
						<>
							<p className="text-sm text-muted-foreground">
								Based on {historyMonths} completed months. Changes apply only to
								selected categories.
							</p>
							{proposals.map((p, i) => (
								<div
									key={p.categoryId}
									className={cn(
										"space-y-3 rounded-xl border p-4 transition-colors",
										p.selected
											? "border-primary/30 bg-primary/5"
											: "bg-muted/20",
									)}
								>
									<label className="flex items-center gap-2 font-medium">
										<input
											type="checkbox"
											className="size-4 shrink-0 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											checked={p.selected}
											onChange={(e) =>
												setProposals((old) =>
													old.map((v, j) =>
														j === i ? { ...v, selected: e.target.checked } : v,
													),
												)
											}
										/>
										{p.name}
									</label>
									<p className="text-sm text-muted-foreground">
										Average: {money(p.average)}
										{currentRows.find((b) => b.categoryId === p.categoryId)
											? ` · Existing limit: ${money(currentRows.find((b) => b.categoryId === p.categoryId)?.amount ?? 0)}`
											: ""}
									</p>
									<label
										htmlFor={`proposal-${p.categoryId}`}
										className="block space-y-2 text-sm"
									>
										Proposed limit (NPR)
										<Input
											type="number"
											min="0.01"
											step="0.01"
											id={`proposal-${p.categoryId}`}
											value={p.amount}
											onChange={(e) =>
												setProposals((old) =>
													old.map((v, j) =>
														j === i
															? { ...v, amount: Number(e.target.value) }
															: v,
													),
												)
											}
										/>
									</label>
									<p className="text-sm text-muted-foreground">
										{p.explanation}
									</p>
								</div>
							))}
							<p className="rounded-xl border bg-muted/30 p-4 text-sm font-medium tabular-nums">
								Selected total:{" "}
								{money(
									proposals
										.filter((p) => p.selected)
										.reduce((s, p) => s + p.amount, 0),
								)}
							</p>
							<Button
								disabled={
									save.isPending ||
									suggest.isPending ||
									!proposals.some((p) => p.selected)
								}
								onClick={() => {
									const inputs = proposals
										.filter((p) => p.selected)
										.map((p) => {
											const existing = currentRows.find(
												(b) => b.categoryId === p.categoryId,
											);
											return {
												categoryId: p.categoryId,
												amount: p.amount,
												notifications: existing?.notifications ?? true,
												thresholds: existing?.thresholds ?? [80, 100],
											};
										});
									if (
										inputs.some((p) => !budgetInputSchema.safeParse(p).success)
									) {
										toast.error(
											"Enter valid positive amounts with up to two decimals",
										);
										return;
									}
									save.mutate(inputs);
								}}
							>
								{save.isPending ? "Applying…" : "Apply selected budgets"}
							</Button>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
function BudgetEditor({
	budget,
	categories,
	pending,
	onSave,
}: {
	budget?: BudgetRow;
	categories: { id: string; name: string }[];
	pending: boolean;
	onSave: (b: BudgetInput) => void;
}) {
	const [categoryId, setCategoryId] = useState(
		budget?.categoryId ?? categories[0]?.id ?? "",
	);
	const [amount, setAmount] = useState(String(budget?.amount ?? ""));
	const [notifications, setNotifications] = useState(
		budget?.notifications ?? true,
	);
	const [thresholds, setThresholds] = useState(
		(budget?.thresholds ?? [80, 100]).join(", "),
	);
	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				const parsed = budgetInputSchema.safeParse({
					categoryId,
					amount: Number(amount),
					notifications,
					thresholds: thresholds.split(",").map((v) => Number(v.trim())),
				});
				if (!parsed.success) {
					toast.error(
						"Enter a positive amount and 1–10 whole-number thresholds between 1% and 1000%.",
					);
					return;
				}
				onSave(parsed.data);
			}}
		>
			<label htmlFor="budget-category" className="block space-y-2 text-sm">
				Category
				{budget ? (
					<Input id="budget-category" readOnly value={budget.name} />
				) : (
					<Select value={categoryId} onValueChange={setCategoryId}>
						<SelectTrigger id="budget-category" className="w-full">
							<SelectValue placeholder="Choose a category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((c) => (
								<SelectItem key={c.id} value={c.id}>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</label>
			<label htmlFor="budget-amount" className="block space-y-2 text-sm">
				Monthly limit (NPR)
				<Input
					required
					type="number"
					min="0.01"
					max="9999999999.99"
					step="0.01"
					id="budget-amount"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
				/>
			</label>
			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					className="size-4 shrink-0 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					checked={notifications}
					onChange={(e) => setNotifications(e.target.checked)}
				/>
				Push notifications for this category
			</label>
			{notifications && (
				<label htmlFor="budget-thresholds" className="block space-y-2 text-sm">
					Alert percentages, separated by commas
					<Input
						id="budget-thresholds"
						value={thresholds}
						onChange={(e) => setThresholds(e.target.value)}
					/>
					<span className="text-xs text-muted-foreground">
						Each threshold alerts once per month. Already crossed thresholds
						alert immediately.
					</span>
				</label>
			)}
			<Button className="w-full" disabled={pending || !categoryId}>
				{pending ? "Saving…" : "Save budget"}
			</Button>
		</form>
	);
}

function BudgetMetric({
	label,
	value,
	description,
	icon: Icon,
	danger = false,
	tone = "blue",
}: {
	label: string;
	value: string;
	description: string;
	icon: typeof Target;
	danger?: boolean;
	tone?: "blue" | "red" | "green";
}) {
	const colors =
		danger || tone === "red"
			? {
					accent: "[--summary-accent:var(--ds-red-700)]",
					text: "text-ds-red-700",
					icon: "bg-ds-red-500/10 text-ds-red-700",
				}
			: tone === "green"
				? {
						accent: "[--summary-accent:var(--ds-green-700)]",
						text: "text-ds-green-700",
						icon: "bg-ds-green-500/10 text-ds-green-700",
					}
				: {
						accent: "[--summary-accent:var(--ds-blue-700)]",
						text: "text-foreground",
						icon: "bg-ds-blue-500/10 text-ds-blue-700",
					};
	return (
		<Card className={cn("summary-card min-w-0", colors.accent)}>
			<CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{label}
				</CardTitle>
				<span className={cn("rounded-full p-1.5", colors.icon)}>
					<Icon aria-hidden="true" className="size-4" />
				</span>
			</CardHeader>
			<CardContent>
				<div
					className={cn(
						"break-words text-xl xl:text-2xl font-semibold tracking-tight tabular-nums",
						colors.text,
					)}
				>
					{value}
				</div>
				<p className="mt-2 text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

function BudgetProgress({
	spent,
	limit,
	name,
}: {
	spent: number;
	limit: number;
	name: string;
}) {
	const percent = (spent / limit) * 100;
	return (
		<div
			role="progressbar"
			aria-label={`${name} budget used`}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.min(100, Math.round(percent))}
			aria-valuetext={`${Math.round(percent)}% used, ${money(spent)} of ${money(limit)}`}
			className="h-2 overflow-hidden rounded-full bg-muted"
		>
			<div
				className={cn(
					"h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none",
					percent > 100
						? "bg-destructive"
						: percent >= 80
							? "bg-ds-amber-700"
							: "bg-chart-1",
				)}
				style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
			/>
		</div>
	);
}
function BudgetsSkeleton({ showActions }: { showActions: boolean }) {
	return (
		<div role="status">
			<span className="sr-only">Loading budgets…</span>
			<div
				aria-hidden="true"
				className="space-y-6 [&_[data-budget-skeleton]]:motion-reduce:animate-none"
			>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
					{["limit", "spent", "left"].map((key) => (
						<div key={key} className="rounded-xl border bg-card p-5 shadow-xs">
							<Skeleton data-budget-skeleton className="h-5 w-28" />
							<Skeleton
								data-budget-skeleton
								className="mt-3 h-8 w-40 max-w-full"
							/>
							<Skeleton
								data-budget-skeleton
								className="mt-2 h-4 w-44 max-w-full"
							/>
						</div>
					))}
				</div>
				<div className="space-y-4">
					<Skeleton data-budget-skeleton className="h-6 w-36" />
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{["first", "second", "third"].map((key) => (
							<div
								key={key}
								className="overflow-hidden rounded-xl border bg-card shadow-xs"
							>
								<div className="space-y-5 p-5">
									<div className="flex gap-3">
										<Skeleton
											data-budget-skeleton
											className="size-10 rounded-xl"
										/>
										<div className="space-y-2">
											<Skeleton data-budget-skeleton className="h-4 w-28" />
											<Skeleton
												data-budget-skeleton
												className="h-5 w-20 rounded-full"
											/>
										</div>
									</div>
									<div>
										<Skeleton data-budget-skeleton className="h-8 w-36" />
										<Skeleton data-budget-skeleton className="mt-1 h-4 w-24" />
									</div>
									<div className="space-y-2.5">
										<Skeleton data-budget-skeleton className="h-2 w-full" />
										<Skeleton
											data-budget-skeleton
											className="h-4 w-40 max-w-full"
										/>
									</div>
								</div>
								<div className="flex items-center justify-between border-t bg-muted/20 px-5 py-3">
									<Skeleton data-budget-skeleton className="h-4 w-32" />
									{showActions && (
										<Skeleton data-budget-skeleton className="h-7 w-10" />
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
