import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { unwrap } from "@/lib/api-client";
import { useApiClient } from "@/lib/api-context";
import {
	type BudgetList,
	budgetTransactionsSearch,
	currentBudgetMonth,
} from "@/lib/budgets";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

export function DashboardBudgets() {
	const rpc = useApiClient();
	const month = currentBudgetMonth();
	const query = useQuery({
		queryKey: ["budgets", month],
		queryFn: async () =>
			unwrap<BudgetList>(await rpc.api.budgets.$get({ query: { month } })),
		refetchInterval: 30000,
	});
	const budgets = query.data?.budgets ?? [];
	const limit = budgets.reduce((sum, b) => sum + b.amount, 0);
	const spent = budgets.reduce((sum, b) => sum + b.spent, 0);
	const over = budgets.filter((b) => b.spent > b.amount).length;
	const topOverspend = budgets
		.filter((budget) => budget.spent > budget.amount)
		.map((budget) => ({ ...budget, excess: budget.spent - budget.amount }))
		.sort((a, b) => b.excess - a.excess)
		.slice(0, 5);
	const largestOverspend = topOverspend[0]?.excess ?? 0;
	const nearLimit = budgets.filter(
		(b) => b.spent >= b.amount * 0.8 && b.spent <= b.amount,
	).length;
	const usedPercent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
	// Above the limit, the ring splits total spending into budget and excess.
	const budgetArc =
		spent > limit
			? Math.max(0, (limit / spent) * 100)
			: limit > 0
				? Math.max(0, (spent / limit) * 100)
				: 0;
	const monthLabel = new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${month}-01T00:00:00Z`));
	return (
		<Card className="min-w-0 overflow-hidden">
			<CardHeader className="flex flex-row flex-nowrap items-center justify-between gap-2 p-4 pb-4 sm:px-6 sm:pt-5">
				<div className="flex min-w-0 items-center gap-2 sm:gap-3">
					<div className="shrink-0 rounded-xl bg-ds-blue-500/10 p-2 sm:p-2.5">
						<Target aria-hidden="true" className="size-4 text-ds-blue-900" />
					</div>
					<div>
						<CardTitle className="text-sm font-semibold sm:text-base">
							Monthly budgets
						</CardTitle>
						<p className="mt-1 text-xs text-muted-foreground">{monthLabel}</p>
					</div>
				</div>
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="shrink-0 gap-1 px-2"
				>
					<Link to="/budgets" aria-label="View budgets">
						<span className="sm:hidden">View</span>
						<span className="hidden sm:inline">View budgets</span>
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent className="px-4 pb-4 sm:px-6">
				{query.isPending ? (
					<div
						role="status"
						className="grid grid-cols-3 gap-4"
						aria-label="Loading budgets"
					>
						{[0, 1, 2].map((i) => (
							<Skeleton key={i} className="h-20 rounded-xl" />
						))}
					</div>
				) : query.isError ? (
					<div
						role="alert"
						className="flex items-center justify-between gap-3 text-sm"
					>
						<p>Could not load budgets.</p>
						<Button variant="outline" size="sm" onClick={() => query.refetch()}>
							Retry
						</Button>
					</div>
				) : !budgets.length ? (
					<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed p-5">
						<div>
							<p className="font-medium">Set your first monthly budget</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Track category spending against limits you choose.
							</p>
						</div>
						<Button asChild variant="outline">
							<Link to="/budgets">Create a budget</Link>
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-6">
							<section
								className="flex min-w-0 flex-col justify-center rounded-xl border bg-muted/20 p-3 sm:p-4"
								aria-label="Overall budget"
							>
								<div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 sm:gap-x-5">
									<div
										className="relative size-20 shrink-0 sm:row-span-3 sm:size-28"
										role="img"
										aria-label={`${usedPercent}% of monthly budget used. ${formatCurrency(spent)} spent of ${formatCurrency(limit)}. ${spent > limit ? `${formatCurrency(spent - limit)} excess spending, shown in red.` : ""}`}
									>
										<svg
											aria-hidden="true"
											viewBox="0 0 80 80"
											className="size-full -rotate-90"
										>
											<circle
												cx="40"
												cy="40"
												r="34"
												fill="none"
												strokeWidth="6"
												className={
													spent > limit ? "stroke-ds-red-700" : "stroke-muted"
												}
											/>
											<circle
												cx="40"
												cy="40"
												r="34"
												fill="none"
												strokeWidth="6"
												pathLength="100"
												strokeDasharray={`${budgetArc} 100`}
												className="stroke-ds-blue-700"
											/>
										</svg>
										<div
											aria-hidden="true"
											className="absolute inset-0 flex flex-col items-center justify-center"
										>
											<span className="text-xl font-semibold tracking-tight tabular-nums">
												{usedPercent}%
											</span>
											<span className="text-[10px] text-muted-foreground">
												used
											</span>
										</div>
									</div>
									<div className="min-w-0 flex-1 space-y-1">
										<p className="text-xs text-muted-foreground">
											{spent > limit ? "Over budget" : "Left to spend"} · NPR
										</p>
										<p
											className={cn(
												"break-words text-xl font-semibold tracking-tight tabular-nums sm:text-2xl xl:text-3xl",
												spent > limit && "text-ds-red-900",
											)}
										>
											{Math.abs(limit - spent).toLocaleString("en", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</p>
									</div>
									<dl className="col-span-2 grid grid-cols-2 gap-3 border-t pt-3 text-xs sm:col-span-1 sm:col-start-2 sm:border-0 sm:pt-0">
										<div>
											<dt className="text-muted-foreground">Spent</dt>
											<dd className="mt-1 break-words font-medium tabular-nums">
												{formatCurrency(spent)}
											</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">Budget</dt>
											<dd className="mt-1 break-words font-medium tabular-nums">
												{formatCurrency(limit)}
											</dd>
										</div>
									</dl>
									{spent > limit && (
										<div className="col-span-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground sm:col-span-1 sm:col-start-2 sm:justify-start">
											<span className="inline-flex items-center gap-1.5">
												<span
													aria-hidden="true"
													className="size-2 rounded-full bg-ds-blue-700"
												/>
												Within budget
											</span>
											<span className="inline-flex items-center gap-1.5">
												<span
													aria-hidden="true"
													className="size-2 rounded-full bg-ds-red-700"
												/>
												Excess spending
											</span>
										</div>
									)}
								</div>
							</section>
							<section
								className="min-w-0 space-y-3 py-1"
								aria-label="Top overspending categories"
							>
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-2">
										<h3 className="text-xs font-semibold sm:text-sm">
											Top overspending
										</h3>
										{over > 0 && (
											<Badge variant="red" size="sm">
												{over}
											</Badge>
										)}
									</div>
									<span className="text-[11px] text-muted-foreground">
										Excess · NPR
									</span>
								</div>
								{topOverspend.length > 0 ? (
									<ol className="space-y-1">
										{topOverspend.map((budget) => (
											<li key={budget.categoryId}>
												<Link
													to="/transactions"
													search={budgetTransactionsSearch(
														budget.categoryId,
														month,
													)}
													aria-label={`${budget.name}: ${formatCurrency(budget.excess)} over budget. View transactions.`}
													className="group grid grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 rounded-lg py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_5rem] sm:gap-3 sm:px-2 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												>
													<span
														className="truncate text-xs font-medium group-hover:text-foreground"
														title={budget.name}
													>
														{budget.name}
													</span>
													<div
														aria-hidden="true"
														className="flex h-5 items-center border-l border-border/60"
													>
														<div
															className="h-3 min-w-px rounded-r bg-ds-red-700/80 transition-colors group-hover:bg-ds-red-700"
															style={{
																width: `${(budget.excess / largestOverspend) * 100}%`,
															}}
														/>
													</div>
													<span className="text-right text-xs font-medium tabular-nums">
														{budget.excess.toLocaleString("en", {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})}
													</span>
												</Link>
											</li>
										))}
									</ol>
								) : (
									<p className="rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
										No categories over budget this month.
									</p>
								)}
							</section>
						</div>
						<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px]">
							<span className="text-muted-foreground">
								Budgeted categories only · Includes linked loans
							</span>
							{over === 0 && (
								<span
									className={
										nearLimit > 0 ? "text-ds-amber-900" : "text-ds-green-900"
									}
								>
									{nearLimit > 0
										? `${nearLimit} ${nearLimit === 1 ? "category" : "categories"} near limit`
										: "All categories on track"}
								</span>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
