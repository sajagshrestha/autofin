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
	type BudgetBucket,
	type BudgetInput,
	type BudgetList,
	type BudgetProposal,
	budgetTransactionsSearch,
	type BudgetRow,
	budgetInputSchema,
	currentBudgetMonth,
	groupBudgets,
	shiftBudgetMonth,
} from "@/lib/budgets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/budgets")({
	component: BudgetsPage,
});
const money = (n: number) =>
	`NPR ${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
type SavingsPlan = {
	averageIncome: number;
	savingsTarget: number;
	spendingAllowance: number;
	needsTarget: number;
	wantsTarget: number;
};
export function BudgetsPage() {
	const rpc = useApiClient();
	const client = useQueryClient();
	const current = currentBudgetMonth();
	const [month, setMonth] = useState(current);
	const [editor, setEditor] = useState<BudgetRow | "new" | null>(null);
	const [aiOpen, setAiOpen] = useState(false);
	const [savingsTarget, setSavingsTarget] = useState("");
	const [proposals, setProposals] = useState<
		(BudgetProposal & { selected: boolean })[]
	>([]);
	const [categorySearch, setCategorySearch] = useState("");
	const [analysisCategoryIds, setAnalysisCategoryIds] = useState<string[]>([]);
	const [historyMonths, setHistoryMonths] = useState(0);
	const [savingsPlan, setSavingsPlan] = useState<SavingsPlan | null>(null);
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
		mutationFn: async (selectedCategoryIds?: string[]) =>
			unwrap<{
				proposals: BudgetProposal[];
				months: number;
				savingsPlan: SavingsPlan | null;
			}>(
				await rpc.api.budgets.suggest.$post({
					json: {
						selectedCategoryIds,
						savingsTarget:
							savingsTarget !== "" ? Number(savingsTarget) : undefined,
					},
				}),
			),
		onSuccess: (d, selectedCategoryIds) => {
			setProposals((previous) => [
				...d.proposals.map((p) => ({ ...p, selected: true })),
				...(selectedCategoryIds
					? previous.filter(
							(p) =>
								!p.selected &&
								!d.proposals.some((next) => next.categoryId === p.categoryId),
						)
					: []),
			]);
			setHistoryMonths(d.months);
			setSavingsPlan(d.savingsPlan);
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
	const averages = useQuery({
		queryKey: ["budget-category-averages"],
		enabled: aiOpen,
		queryFn: async () =>
			unwrap<{
				months: number;
				categories: { categoryId: string; average: number }[];
			}>(await rpc.api.budgets["category-averages"].$get()),
	});
	const averageByCategory = new Map(
		averages.data?.categories.map((c) => [c.categoryId, c.average]),
	);
	const analysisCategories = (
		categories.data?.categories.filter(
			(c) =>
				c.name.trim() &&
				!/(^|[^a-z0-9])(tax(es|ation)?|vat|tds|others?|uncategori[sz]ed)([^a-z0-9]|$)/i.test(
					c.name,
				),
		) ?? []
	).sort(
		(a, b) =>
			(averageByCategory.get(b.id) ?? 0) - (averageByCategory.get(a.id) ?? 0) ||
			a.name.localeCompare(b.name),
	);
	const visibleAnalysisCategories = analysisCategories.filter((category) =>
		category.name
			.toLocaleLowerCase()
			.includes(categorySearch.trim().toLocaleLowerCase()),
	);
	const changeAnalysisCategories = (ids: string[]) => {
		setAnalysisCategoryIds(ids);
		setProposals([]);
		setSavingsPlan(null);
		suggest.reset();
	};
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
						{groupBudgets(rows).map((group) => (
							<section
								key={group.key}
								aria-label={`${group.label} budgets`}
								className="space-y-3"
							>
								<div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
									<div>
										<h3 className="font-semibold">
											{group.label}{" "}
											<span className="ml-1 text-xs font-normal text-muted-foreground">
												{group.items.length}
											</span>
										</h3>
										<p className="mt-1 text-xs text-muted-foreground">
											{group.description}
										</p>
									</div>
									<p className="text-xs text-muted-foreground tabular-nums">
										{money(group.items.reduce((sum, b) => sum + b.spent, 0))}{" "}
										spent /{" "}
										{money(group.items.reduce((sum, b) => sum + b.amount, 0))}{" "}
										budgeted
									</p>
								</div>
								<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
									{group.items.map((b) => {
										const percent =
											b.spent < b.amount
												? Math.min(
														99.9,
														Math.round((b.spent / b.amount) * 1000) / 10,
													)
												: Math.round((b.spent / b.amount) * 100);
										const over = b.spent > b.amount;
										const near = !over && b.spent >= b.amount * 0.8;
										const category = categories.data?.categories.find(
											(c) => c.id === b.categoryId,
										);
										return (
											<article
												key={b.categoryId}
												className="relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-colors hover:border-primary/50 focus-within:border-primary/50"
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
																	<Link
																		to="/transactions"
																		search={budgetTransactionsSearch(
																			b.categoryId,
																			month,
																		)}
																		aria-label={`View ${b.name} transactions for ${monthLabel}`}
																		className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:ring-2 after:focus-visible:ring-inset after:focus-visible:ring-ring"
																	>
																		{b.name}
																	</Link>
																</h3>
																<div className="mt-1.5">
																	<Badge
																		size="sm"
																		variant={
																			over
																				? "red"
																				: near
																					? "amber"
																					: "secondary"
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
																		className="relative z-10"
																		aria-label={`Manage ${b.name} budget`}
																	>
																		<MoreHorizontal className="size-4" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	<DropdownMenuItem
																		onSelect={() => setEditor(b)}
																	>
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
													<dl className="grid grid-cols-2 gap-3 rounded-xl border bg-muted/20 p-4">
														<div className="min-w-0">
															<dt className="text-xs font-medium text-muted-foreground">
																Monthly budget
															</dt>
															<dd className="mt-2 break-words text-xl font-semibold tracking-tight tabular-nums">
																{money(b.amount)}
															</dd>
														</div>
														<div className="min-w-0 border-l pl-3">
															<dt className="text-xs font-medium text-muted-foreground">
																Spent this month
															</dt>
															<dd
																className={cn(
																	"mt-2 break-words text-xl font-semibold tracking-tight tabular-nums",
																	over ? "text-ds-red-900" : "text-ds-blue-900",
																)}
															>
																{money(b.spent)}
															</dd>
														</div>
													</dl>
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
																{over ? "over budget" : "remaining"}
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
															className="relative z-10 h-7 px-2 text-xs"
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
							</section>
						))}
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
							AI analyzes up to six completed months, excluding loan-linked
							transactions and tax, Others, and Uncategorized categories. Rent
							and loan payments use their latest recorded monthly totals. At
							least one full month of history is required. Review and edit
							before applying to the current month.
						</DialogDescription>
					</DialogHeader>
					<fieldset
						disabled={suggest.isPending || save.isPending}
						className="space-y-3 rounded-xl border p-4"
					>
						<legend className="px-1 text-sm font-medium">
							Categories to analyze
						</legend>
						<Input
							type="search"
							aria-label="Search categories"
							placeholder="Search categories…"
							value={categorySearch}
							onChange={(event) => setCategorySearch(event.target.value)}
						/>
						<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
							<span>
								{analysisCategoryIds.length} selected · Highest average spend
								first
							</span>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() =>
										changeAnalysisCategories([
											...new Set([
												...analysisCategoryIds,
												...visibleAnalysisCategories.map((c) => c.id),
											]),
										])
									}
								>
									{categorySearch.trim() ? "Select matches" : "Select all"}
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => changeAnalysisCategories([])}
								>
									Clear
								</Button>
							</div>
						</div>
						{categories.isLoading ? (
							<p className="text-sm text-muted-foreground">
								Loading categories…
							</p>
						) : categories.isError ? (
							<p role="alert" className="text-sm text-destructive">
								Could not load categories.{" "}
								<button type="button" onClick={() => categories.refetch()}>
									Retry
								</button>
							</p>
						) : (
							<div className="grid max-h-48 grid-cols-2 gap-3 overflow-y-auto">
								{visibleAnalysisCategories.length === 0 && (
									<p
										role="status"
										className="col-span-2 py-4 text-center text-sm text-muted-foreground"
									>
										No categories match your search.
									</p>
								)}
								{visibleAnalysisCategories.map((category) => (
									<label
										key={category.id}
										className="flex items-center gap-2 text-sm"
									>
										<input
											type="checkbox"
											className="size-4 shrink-0 accent-primary"
											checked={analysisCategoryIds.includes(category.id)}
											onChange={(event) =>
												changeAnalysisCategories(
													event.target.checked
														? [...analysisCategoryIds, category.id]
														: analysisCategoryIds.filter(
																(id) => id !== category.id,
															),
												)
											}
										/>
										<span aria-hidden="true" className="shrink-0 text-lg">
											{category.icon || "🏷️"}
										</span>
										<span className="min-w-0">
											<span className="block truncate">{category.name}</span>
											<span className="block text-xs text-muted-foreground tabular-nums">
												{averages.isPending
													? "Loading average…"
													: averages.isError
														? "Average unavailable"
														: `${money(averageByCategory.get(category.id) ?? 0)}/month`}
											</span>
										</span>
									</label>
								))}
							</div>
						)}
						<p className="text-xs text-muted-foreground">
							{averages.data &&
								`Averages cover ${averages.data.months} completed months. `}
							Only selected categories’ eligible expenses are analyzed.
							Categories without completed-month expenses are skipped. Income is
							analyzed separately for your savings goal.
						</p>
					</fieldset>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							suggest.mutate(analysisCategoryIds);
						}}
						className="flex flex-wrap items-end gap-3"
					>
						<label htmlFor="budget-target" className="flex-1 space-y-2 text-sm">
							Monthly savings goal (NPR, optional override)
							<Input
								type="number"
								min="0"
								step="0.01"
								max="9999999999.99"
								id="budget-target"
								value={savingsTarget}
								onChange={(e) => {
									setSavingsTarget(e.target.value);
									setProposals([]);
									setSavingsPlan(null);
								}}
								disabled={suggest.isPending || save.isPending}
								aria-describedby="savings-goal-help"
							/>
						</label>
						<Button
							disabled={
								suggest.isPending ||
								save.isPending ||
								!analysisCategoryIds.length
							}
						>
							{suggest.isPending ? "Analyzing…" : "Generate suggestions"}
						</Button>
					</form>
					<p id="savings-goal-help" className="text-xs text-muted-foreground">
						How much would you like to save each month? We’ll subtract this from
						your average eligible recorded income. Others and uncategorized
						transactions are excluded. Leave blank for 50% needs, 30% wants, and
						20% savings. A custom goal changes the savings amount; the remaining
						spending is split 5:3 between needs and wants.
					</p>
					{suggest.isError && (
						<p
							role="alert"
							className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
						>
							{suggest.error.message}
						</p>
					)}
					{proposals.length > 0 && (
						<>
							<p className="text-sm text-muted-foreground">
								Based on {historyMonths} completed months. Changes apply only to
								selected categories.
							</p>
							{savingsPlan && (
								<div className="space-y-2 rounded-xl border bg-muted/30 p-4 text-sm">
									<div className="flex justify-between gap-4">
										<span className="text-muted-foreground">
											Average monthly income
										</span>
										<span className="tabular-nums">
											{money(savingsPlan.averageIncome)}
										</span>
									</div>
									<div className="flex justify-between gap-4">
										<span className="text-muted-foreground">Savings goal</span>
										<span className="tabular-nums">
											{money(savingsPlan.savingsTarget)}
										</span>
									</div>
									<div className="flex justify-between gap-4 border-t pt-2 font-medium">
										<span>Available for needs and wants</span>
										<span className="tabular-nums">
											{money(savingsPlan.spendingAllowance)}
										</span>
									</div>
									<p className="text-xs text-muted-foreground">
										An estimate from recorded credits, excluding linked loans
										and tax, Others, and Uncategorized categories. Unlinked
										transfers may still be included. Your income and actual
										spending may vary. Editing or applying only some suggestions
										can change the savings outcome.
									</p>
								</div>
							)}
							{savingsPlan && (
								<div className="rounded-xl border bg-muted/30 p-4 text-sm space-y-2">
									<p className="font-medium">50/30/20 guide</p>
									<p>
										Needs: {money(savingsPlan.needsTarget)} · Wants:{" "}
										{money(savingsPlan.wantsTarget)}
									</p>
									<p className="text-xs text-muted-foreground">
										Fixed rent and loan payments are protected. The needs target
										is a guideline, not a reduction in your obligations.
									</p>
									{proposals
										.filter((p) => p.selected && p.bucket === "needs")
										.reduce((sum, p) => sum + p.amount, 0) >
										savingsPlan.needsTarget && (
										<p className="text-ds-amber-900 text-xs">
											Selected needs exceed the guideline. Review discretionary
											spending before applying.
										</p>
									)}
								</div>
							)}
							{proposals.some((p) => !p.selected) && (
								<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/30 p-4">
									<p className="text-sm text-muted-foreground">
										Reallocate the budget across selected categories with the
										same savings goal. Selected amounts will be replaced for
										review.
									</p>
									<Button
										type="button"
										variant="outline"
										disabled={
											suggest.isPending ||
											save.isPending ||
											!proposals.some((p) => p.selected)
										}
										onClick={() =>
											suggest.mutate(
												proposals
													.filter((p) => p.selected)
													.map((p) => p.categoryId),
											)
										}
									>
										{suggest.isPending && suggest.variables
											? "Reevaluating…"
											: "Reevaluate"}
									</Button>
									{!proposals.some((p) => p.selected) && (
										<p className="text-xs text-muted-foreground">
											Select at least one category to reevaluate.
										</p>
									)}
								</div>
							)}
							{groupBudgets(
								[...proposals].sort(
									(a, b) =>
										b.average - a.average || a.name.localeCompare(b.name),
								),
							).map((group) => (
								<section
									key={group.key}
									aria-label={`${group.label} suggestions`}
									className="space-y-3"
								>
									<div className="flex items-center justify-between gap-3 border-b pb-2">
										<h3 className="font-semibold">{group.label}</h3>
										<span className="text-xs text-muted-foreground tabular-nums">
											{money(
												group.items
													.filter((p) => p.selected)
													.reduce((sum, p) => sum + p.amount, 0),
											)}{" "}
											selected
										</span>
									</div>
									{group.items.map((p) => (
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
													disabled={suggest.isPending || save.isPending}
													onChange={(e) =>
														setProposals((old) =>
															old.map((v) =>
																v.categoryId === p.categoryId
																	? { ...v, selected: e.target.checked }
																	: v,
															),
														)
													}
												/>
												<span aria-hidden="true">
													{categories.data?.categories.find(
														(c) => c.id === p.categoryId,
													)?.icon || "🏷️"}
												</span>
												{p.name}
												{p.mode === "fixed" && (
													<Badge variant="outline">Fixed</Badge>
												)}
												{p.bucket && (
													<Badge size="sm" variant="secondary">
														{p.bucket === "needs" ? "Need" : "Want"}
													</Badge>
												)}
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
													disabled={
														suggest.isPending ||
														save.isPending ||
														!p.selected ||
														p.mode === "fixed"
													}
													onChange={(e) =>
														setProposals((old) =>
															old.map((v) =>
																v.categoryId === p.categoryId
																	? { ...v, amount: Number(e.target.value) }
																	: v,
															),
														)
													}
												/>
											</label>
											{p.latestMonth &&
												p.latestMonthly !== undefined &&
												p.latestMonthly > 0 && (
													<div className="flex flex-wrap items-center justify-between gap-2">
														<span className="text-xs text-muted-foreground">
															Latest recorded month ({p.latestMonth}):{" "}
															{money(p.latestMonthly)}
														</span>
														<Button
															type="button"
															variant="outline"
															size="sm"
															disabled={
																!p.selected ||
																p.mode === "fixed" ||
																suggest.isPending ||
																save.isPending ||
																p.amount === p.latestMonthly
															}
															aria-label={`Use latest month for ${p.name}`}
															onClick={() =>
																setProposals((old) =>
																	old.map((item) =>
																		item.categoryId === p.categoryId
																			? {
																					...item,
																					amount: p.latestMonthly!,
																					explanation: `Uses eligible expenses recorded in ${p.latestMonth}. Review this amount before applying.`,
																				}
																			: item,
																	),
																)
															}
														>
															{p.amount === p.latestMonthly
																? "Using latest month"
																: "Use latest month"}
														</Button>
													</div>
												)}
											<p className="text-sm text-muted-foreground">
												{p.explanation}
											</p>
										</div>
									))}
								</section>
							))}
							<p className="rounded-xl border bg-muted/30 p-4 text-sm font-medium tabular-nums">
								Selected total:{" "}
								{money(
									proposals
										.filter((p) => p.selected)
										.reduce((s, p) => s + p.amount, 0),
								)}
							</p>
							{savingsPlan &&
								proposals
									.filter((p) => p.selected)
									.reduce((sum, p) => sum + p.amount, 0) >
									savingsPlan.spendingAllowance && (
									<p role="status" className="text-sm text-ds-amber-900">
										Selected budgets exceed the spending allowance for your
										savings goal. Review the amounts before applying.
									</p>
								)}
							<Button
								disabled={
									save.isPending ||
									suggest.isPending ||
									!proposals.some((p) => p.selected)
								}
								onClick={() => {
									const inputs: BudgetInput[] = proposals
										.filter((p) => p.selected)
										.map((p) => {
											const existing = currentRows.find(
												(b) => b.categoryId === p.categoryId,
											);
											return {
												categoryId: p.categoryId,
												bucket: p.bucket ?? "unassigned",
												amount: p.amount,
												mode: existing?.mode ?? "dynamic",
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
	categories: { id: string; name: string; bucket?: BudgetBucket }[];
	pending: boolean;
	onSave: (b: BudgetInput) => void;
}) {
	const [categoryId, setCategoryId] = useState(
		budget?.categoryId ?? categories[0]?.id ?? "",
	);
	const [amount, setAmount] = useState(String(budget?.amount ?? ""));
	const [mode, setMode] = useState<"fixed" | "dynamic">(
		budget?.mode ?? "dynamic",
	);
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
					bucket:
						categories.find((c) => c.id === categoryId)?.bucket ??
						budget?.bucket ??
						"unassigned",
					amount: Number(amount),
					mode,
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
			<label className="block space-y-2 text-sm">
				Budget mode
				<Select
					value={mode}
					onValueChange={(value) => setMode(value as "fixed" | "dynamic")}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="dynamic">Dynamic — AI can adjust</SelectItem>
						<SelectItem value="fixed">Fixed — keep my saved amount</SelectItem>
					</SelectContent>
				</Select>
				<span className="block text-xs text-muted-foreground">
					Fixed budgets keep their saved amount during suggestions and
					reevaluation. You can still edit them here.
				</span>
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
