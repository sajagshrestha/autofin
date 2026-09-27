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
		<Card>
			<CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
				<div>
					<CardTitle className="flex items-center gap-2">
						<Target className="size-4 text-ds-blue-900" />
						Monthly budgets
					</CardTitle>
					<p className="mt-1 text-xs text-muted-foreground">
						{monthLabel} · All expenses in budgeted categories
					</p>
				</div>
				<Button asChild variant="ghost" size="sm">
					<Link to="/budgets">
						View budgets
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent>
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
					<div className="space-y-5">
						<dl className="grid gap-4 sm:grid-cols-3">
							{[
								{ label: "Monthly budget", value: limit },
								{ label: "Spent so far", value: spent },
								{
									label: spent > limit ? "Over budget" : "Remaining",
									value: Math.abs(limit - spent),
								},
							].map((item, i) => (
								<div
									key={item.label}
									className="rounded-xl border bg-muted/20 p-4"
								>
									<dt className="text-xs text-muted-foreground">
										{item.label}
									</dt>
									<dd
										className={cn(
											"mt-2 text-xl font-semibold tabular-nums",
											i === 2 && spent > limit && "text-ds-red-900",
										)}
									>
										{formatCurrency(item.value)}
									</dd>
								</div>
							))}
						</dl>
						<div className="space-y-2">
							<div
								className="h-2 overflow-hidden rounded-full bg-muted"
								role="progressbar"
								aria-label="Monthly budget used"
								aria-valuemin={0}
								aria-valuemax={100}
								aria-valuenow={Math.min(100, Math.round((spent / limit) * 100))}
								aria-valuetext={`${formatCurrency(spent)} spent of ${formatCurrency(limit)}`}
							>
								<div
									className={cn(
										"h-full rounded-full",
										spent > limit ? "bg-ds-red-700" : "bg-ds-blue-700",
									)}
									style={{
										width: `${Math.min(100, Math.max(0, (spent / limit) * 100))}%`,
									}}
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								{budgets.length} categories ·{" "}
								{over ? `${over} over budget` : "No categories over budget"}
							</p>
						</div>
						{attention.length > 0 && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium">Keep an eye on</h3>
								<div className="grid gap-2 sm:grid-cols-3">
									{attention.map((b) => (
										<Link
											key={b.categoryId}
											to="/transactions"
											search={budgetTransactionsSearch(b.categoryId, month)}
											className="rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										>
											<span className="font-medium">{b.name}</span>
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
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
