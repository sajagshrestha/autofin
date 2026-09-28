import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Target } from "lucide-react";
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
	const attention = [...budgets]
		.filter((b) => b.spent >= b.amount * 0.8)
		.sort((a, b) => b.spent / b.amount - a.spent / a.amount)
		.slice(0, 3);
	const monthLabel = new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${month}-01T00:00:00Z`));
	return (
		<Card className="min-w-0">
			<CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pb-4 sm:px-6">
				<div className="flex items-start gap-2">
					<div className="shrink-0 rounded-full bg-ds-blue-500/10 p-1.5">
						<Target className="size-4 text-ds-blue-900" />
					</div>
					<div>
						<CardTitle className="text-sm font-medium">
							Monthly budgets
						</CardTitle>
						<p className="mt-1 text-xs text-muted-foreground">{monthLabel}</p>
					</div>
				</div>
				<Button asChild variant="ghost" size="sm">
					<Link to="/budgets">
						View budgets
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent className="px-4 sm:px-6">
				{query.isPending ? (
					<div className="grid grid-cols-3 gap-4" aria-label="Loading budgets">
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
					<div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8">
						<div className="min-w-0 space-y-5">
							<div>
								<p className="text-xs text-muted-foreground">
									{spent > limit ? "Over budget" : "Left to spend"}
								</p>
								<p
									className={cn(
										"mt-1 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl",
										spent > limit ? "text-ds-red-900" : "text-foreground",
									)}
								>
									{formatCurrency(Math.abs(limit - spent))}
								</p>
							</div>
							<dl className="grid grid-cols-2 gap-4">
								<div>
									<dt className="text-xs text-muted-foreground">
										Spent so far
									</dt>
									<dd className="mt-1 text-lg font-semibold tabular-nums">
										{formatCurrency(spent)}
									</dd>
								</div>
								<div className="border-l pl-4">
									<dt className="text-xs text-muted-foreground">
										Monthly budget
									</dt>
									<dd className="mt-1 text-lg font-semibold tabular-nums">
										{formatCurrency(limit)}
									</dd>
								</div>
							</dl>
							<div className="space-y-2">
								<div className="flex justify-between gap-3 text-xs text-muted-foreground">
									<span>{budgets.length} budgeted categories</span>
									<span className="tabular-nums">
										{limit > 0 ? Math.round((spent / limit) * 100) : 0}% used
									</span>
								</div>
								<div
									className="h-2 overflow-hidden rounded-full bg-muted"
									role="progressbar"
									aria-label="Monthly budget used"
									aria-valuemin={0}
									aria-valuemax={100}
									aria-valuenow={
										limit > 0
											? Math.min(100, Math.round((spent / limit) * 100))
											: 0
									}
									aria-valuetext={`${formatCurrency(spent)} spent of ${formatCurrency(limit)}`}
								>
									<div
										className={cn(
											"h-full rounded-full",
											spent > limit ? "bg-ds-red-700" : "bg-ds-blue-700",
										)}
										style={{
											width: `${limit > 0 ? Math.min(100, Math.max(0, (spent / limit) * 100)) : 0}%`,
										}}
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									Includes all expenses in budgeted categories, including linked
									loans.
								</p>
							</div>
						</div>

						{attention.length > 0 ? (
							<div className="min-w-0 border-t pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
								<div className="mb-2 flex items-center justify-between gap-2">
									<h3 className="text-sm font-medium">Needs attention</h3>
									<span className="text-xs text-muted-foreground">
										{over ? `${over} over budget` : "Approaching limits"}
									</span>
								</div>
								<div className="divide-y">
									{attention.map((b) => (
										<Link
											key={b.categoryId}
											to="/transactions"
											search={budgetTransactionsSearch(b.categoryId, month)}
											className="group flex items-center justify-between gap-3 rounded-md px-2 py-3 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										>
											<span className="min-w-0 flex-1">
												<span className="block font-medium">{b.name}</span>
												<span
													className={cn(
														"mt-1 block text-xs tabular-nums",
														b.spent > b.amount
															? "text-ds-red-900"
															: "text-muted-foreground",
													)}
												>
													{formatCurrency(Math.abs(b.amount - b.spent))}{" "}
													{b.spent > b.amount ? "over budget" : "remaining"}
												</span>
											</span>
											<ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
										</Link>
									))}
								</div>
							</div>
						) : (
							<div className="flex flex-col justify-center border-t pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
								<p className="text-sm font-medium">
									Your category budgets are on track
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									Every category is below 80% of its limit.
								</p>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
