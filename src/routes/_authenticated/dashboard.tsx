import { createFileRoute, Link } from "@tanstack/react-router";
import {
	eachDayOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	format,
	startOfWeek,
} from "date-fns";
import {
	ArrowDownRight,
	ArrowRight,
	ArrowUpRight,
	CreditCard,
	PiggyBank,
	Wallet,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import {
	BankBarChart,
	CategoryBarChart,
	CategoryPieChart,
	MonthlyTrendsChart,
	SpendingLineChart,
} from "@/components/charts";
import { pickChartColor } from "@/components/charts/chart-theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DateFilter,
	type DatePeriod,
	type DateRange,
	getDateRangeForPeriod,
} from "@/components/ui/date-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllTransactions } from "@/hooks/transactions/queries";
import { formatCurrency } from "@/lib/formatCurrency";

const defaultRange = getDateRangeForPeriod("monthly");

const searchParamsSchema = z.object({
	period: z
		.enum(["daily", "weekly", "monthly", "yearly", "all"])
		.optional()
		.default("monthly"),
	startDate: z
		.string()
		.optional()
		.default(defaultRange.startDate ?? ""),
	endDate: z
		.string()
		.optional()
		.default(defaultRange.endDate ?? ""),
});

export const Route = createFileRoute("/_authenticated/dashboard")({
	validateSearch: searchParamsSchema,
	component: AnalyticsDashboard,
});

function AnalyticsDashboard() {
	const { period, startDate, endDate } = Route.useSearch();
	const navigate = Route.useNavigate();

	const { data: transactionsData, isLoading } = useGetAllTransactions({
		startDate,
		endDate,
	});

	const handlePeriodChange = useCallback(
		(newPeriod: DatePeriod) => {
			const range = getDateRangeForPeriod(newPeriod);
			navigate({
				search: {
					period: newPeriod,
					startDate: range.startDate ?? "",
					endDate: range.endDate ?? "",
				},
			});
		},
		[navigate],
	);

	const handleDateRangeChange = useCallback(
		(range: DateRange) => {
			navigate({
				search: (prev) => ({
					...prev,
					startDate: range.startDate ?? "",
					endDate: range.endDate ?? "",
				}),
			});
		},
		[navigate],
	);

	const transactions = useMemo(
		() => transactionsData?.transactions || [],
		[transactionsData],
	);

	// Loan-linked entries are tracked separately — they are transfers, not
	// income/expenses.
	const { regularTransactions, loanFlows } = useMemo(() => {
		const regularTransactions: typeof transactions = [];
		const loanTransactions: Array<{ amount: string; type: string }> = [];
		let lent = 0;
		let received = 0;

		for (const t of transactions) {
			if (t.loanId) {
				loanTransactions.push(t);
				if (t.type === "debit") lent += parseFloat(t.amount || "0");
				else received += parseFloat(t.amount || "0");
			} else {
				regularTransactions.push(t);
			}
		}

		return {
			regularTransactions,
			loanFlows: { lent, received, count: loanTransactions.length },
		};
	}, [transactions]);

	// Calculate summary stats (loan transfers excluded)
	const stats = useMemo(() => {
		let totalExpenses = 0;
		let totalIncome = 0;

		regularTransactions.forEach((t) => {
			const amount = parseFloat(t.amount || "0");
			if (t.type === "credit") {
				totalIncome += amount;
			} else {
				totalExpenses += amount;
			}
		});

		return {
			totalExpenses,
			totalIncome,
			savings: totalIncome - totalExpenses,
			transactionCount: regularTransactions.length,
		};
	}, [regularTransactions]);

	// Monthly spending data for area chart
	const monthlyData = useMemo(() => {
		if (!regularTransactions.length) return [];

		const monthMap = new Map<string, { expenses: number; income: number }>();

		regularTransactions.forEach((t) => {
			const date = t.transactionDate ? new Date(t.transactionDate) : new Date();
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

			const existing = monthMap.get(monthKey) || { expenses: 0, income: 0 };
			const amount = parseFloat(t.amount || "0");

			if (t.type === "credit") {
				existing.income += amount;
			} else {
				existing.expenses += amount;
			}

			monthMap.set(monthKey, existing);
		});

		return Array.from(monthMap.entries())
			.sort((a, b) => a[0].localeCompare(b[0]))
			.slice(-6)
			.map(([month, data]) => ({
				month: new Date(`${month}-01`).toLocaleDateString("en-US", {
					month: "short",
				}),
				expenses: data.expenses,
				income: data.income,
			}));
	}, [regularTransactions]);

	const categoryData = useMemo(() => {
		if (!regularTransactions.length) return [];

		const categoryMap = new Map<
			string,
			{ amount: number; icon?: string | null }
		>();

		regularTransactions.forEach((t) => {
			if (t.type === "credit") return;
			const categoryName = t.category?.name || "Uncategorized";
			const categoryIcon = t.category?.icon || null;
			const amount = parseFloat(t.amount || "0");
			const existing = categoryMap.get(categoryName) || {
				amount: 0,
				icon: categoryIcon,
			};
			categoryMap.set(categoryName, {
				amount: existing.amount + amount,
				icon: categoryIcon,
			});
		});

		return Array.from(categoryMap.entries())
			.sort((a, b) => b[1].amount - a[1].amount)
			.map(([name, data], index) => ({
				name,
				value: data.amount,
				icon: data.icon,
				fill: pickChartColor(index),
			}));
	}, [regularTransactions]);

	// Spending data for line chart: buckets based on date filter (period + start/end)
	const spendingData = useMemo(() => {
		const rangeStart =
			startDate && startDate !== "" ? new Date(startDate) : null;
		const rangeEnd = endDate && endDate !== "" ? new Date(endDate) : null;
		const hasRange =
			rangeStart &&
			rangeEnd &&
			period !== "all" &&
			Number.isFinite(rangeStart.getTime()) &&
			Number.isFinite(rangeEnd.getTime());

		let buckets: { key: string; date: Date; label: string }[] = [];

		if (hasRange && rangeStart && rangeEnd) {
			const interval = { start: rangeStart, end: rangeEnd };
			switch (period) {
				case "daily":
					buckets = eachDayOfInterval(interval).map((d) => ({
						key: format(d, "yyyy-MM-dd"),
						date: d,
						label: format(d, "MMM d"),
					}));
					break;
				case "weekly":
					buckets = eachWeekOfInterval(interval, {
						weekStartsOn: 1,
					}).map((d) => ({
						key: format(d, "yyyy-'W'ww"),
						date: d,
						label: format(d, "MMM d"),
					}));
					break;
				case "monthly":
					buckets = eachDayOfInterval(interval).map((d) => ({
						key: format(d, "yyyy-MM-dd"),
						date: d,
						label: format(d, "MMM d"),
					}));
					break;
				case "yearly":
					buckets = eachMonthOfInterval(interval).map((m) => ({
						key: format(m, "yyyy-MM"),
						date: m,
						label: format(m, "MMM"),
					}));
					break;
				default:
					buckets = eachMonthOfInterval(interval).map((m) => ({
						key: format(m, "yyyy-MM"),
						date: m,
						label: format(m, "MMM yyyy"),
					}));
			}
		} else {
			// All time: derive range from transaction dates
			if (!regularTransactions.length) return [];
			const dates = regularTransactions
				.map((t) => (t.transactionDate ? new Date(t.transactionDate) : null))
				.filter((d): d is Date => d !== null);
			if (!dates.length) return [];
			const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
			const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
			const months = eachMonthOfInterval({ start: minDate, end: maxDate });
			buckets = months.map((m) => ({
				key: format(m, "yyyy-MM"),
				date: m,
				label: format(m, "MMM yyyy"),
			}));
		}

		const keyToSpending = new Map<string, number>();
		for (const b of buckets) {
			keyToSpending.set(b.key, 0);
		}
		regularTransactions.forEach((t) => {
			if (t.type === "credit") return;
			const date = t.transactionDate ? new Date(t.transactionDate) : new Date();
			let key: string;
			if (period === "daily" || period === "monthly")
				key = format(date, "yyyy-MM-dd");
			else if (period === "weekly")
				key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-'W'ww");
			else key = format(date, "yyyy-MM");
			if (!keyToSpending.has(key)) return;
			const amount = parseFloat(t.amount || "0");
			keyToSpending.set(key, (keyToSpending.get(key) ?? 0) + amount);
		});
		return buckets.map((b, index) => ({
			day: index + 1,
			label: b.label,
			spending: keyToSpending.get(b.key) ?? 0,
		}));
	}, [regularTransactions, period, startDate, endDate]);

	// Chart subtitle and granularity from date filter
	const { chartPeriodLabel, chartGranularity } = useMemo(() => {
		if (period === "all" || !startDate || !endDate) {
			return {
				chartPeriodLabel: "All time",
				chartGranularity: "month" as const,
			};
		}
		const start = new Date(startDate);
		const end = new Date(endDate);
		const formatRange = () => {
			if (period === "daily") return format(start, "MMM d, yyyy");
			if (period === "monthly") return format(start, "MMMM yyyy");
			if (period === "yearly") return format(start, "yyyy");
			return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
		};
		const label = formatRange();
		const granularity =
			period === "daily" || period === "monthly"
				? ("day" as const)
				: ("month" as const);
		return { chartPeriodLabel: label, chartGranularity: granularity };
	}, [period, startDate, endDate]);

	// Bank breakdown for bar chart
	const bankData = useMemo(() => {
		if (!regularTransactions.length) return [];

		const bankMap = new Map<string, number>();

		regularTransactions.forEach((t) => {
			if (t.type === "credit") return;
			const bankName = t.bankName || "Unknown Bank";
			const amount = parseFloat(t.amount || "0");
			const existing = bankMap.get(bankName) || 0;
			bankMap.set(bankName, existing + amount);
		});

		return Array.from(bankMap.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([name, amount]) => ({
				name: name.length > 12 ? `${name.slice(0, 12)}...` : name,
				amount,
			}));
	}, [regularTransactions]);

	return (
		<div className="space-y-8 min-w-0 overflow-hidden">
			<div className="space-y-8 min-w-0">
				{/* Header - always visible */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
						<p className="text-muted-foreground mt-1">
							Overview of your spending patterns and transactions.
						</p>
					</div>
					<DateFilter
						period={period}
						startDate={startDate}
						endDate={endDate}
						onPeriodChange={handlePeriodChange}
						onDateRangeChange={handleDateRangeChange}
					/>
				</div>

				{isLoading ? (
					<>
						{/* Summary cards skeleton */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<Card key={i} className="hover:shadow-md transition-shadow">
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-4 w-4 rounded" />
									</CardHeader>
									<CardContent>
										<Skeleton className="h-8 w-28 mb-2" />
										<Skeleton className="h-3 w-20" />
									</CardContent>
								</Card>
							))}
						</div>

						{/* Daily spending chart skeleton */}
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-56" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-[300px] w-full" />
							</CardContent>
						</Card>

						{/* Charts row skeleton */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-40" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-[300px] w-full" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-44" />
								</CardHeader>
								<CardContent>
									<div className="flex flex-col md:flex-row items-center gap-4">
										<Skeleton className="h-[250px] w-[250px] rounded-full shrink-0" />
										<div className="flex flex-wrap gap-2">
											{Array.from({ length: 4 }).map((_, i) => (
												<Skeleton key={i} className="h-6 w-16" />
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Bottom charts row skeleton */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-52" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-[300px] w-full" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-36" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-[300px] w-full" />
								</CardContent>
							</Card>
						</div>
					</>
				) : (
					<>
						{/* Summary Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<Card className="hover:shadow-md transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Expenses
									</CardTitle>
									<div className="rounded-full bg-ds-red-500/10 p-1.5">
										<ArrowDownRight className="h-4 w-4 text-ds-red-700" />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold text-ds-red-700">
										{formatCurrency(stats.totalExpenses)}
									</div>
									<p className="text-xs text-muted-foreground">
										Excludes loan transfers
									</p>
								</CardContent>
							</Card>

							<Card className="hover:shadow-md transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Income
									</CardTitle>
									<div className="rounded-full bg-ds-green-500/10 p-1.5">
										<ArrowUpRight className="h-4 w-4 text-ds-green-700" />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold text-ds-green-700">
										{formatCurrency(stats.totalIncome)}
									</div>
									<p className="text-xs text-muted-foreground">
										Excludes loan transfers
									</p>
								</CardContent>
							</Card>

							<Card className="hover:shadow-md transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Savings
									</CardTitle>
									<div className="rounded-full bg-ds-green-500/10 p-1.5">
										<PiggyBank
											className={`h-4 w-4 ${stats.savings >= 0 ? "text-ds-green-700" : "text-ds-red-700"}`}
										/>
									</div>
								</CardHeader>
								<CardContent>
									<div
										className={`text-2xl font-bold ${stats.savings >= 0 ? "text-ds-green-700" : "text-ds-red-700"}`}
									>
										{formatCurrency(stats.savings)}
									</div>
									<p className="text-xs text-muted-foreground">
										{stats.savings >= 0 ? "Net positive" : "Net negative"}
									</p>
								</CardContent>
							</Card>

							<Card className="hover:shadow-md transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Transactions
									</CardTitle>
									<div className="rounded-full bg-ds-blue-500/10 p-1.5">
										<CreditCard className="h-4 w-4 text-ds-blue-700" />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats.transactionCount}
									</div>
									<p className="text-xs text-muted-foreground">
										{loanFlows.count > 0
											? `+ ${loanFlows.count} loan transfer${loanFlows.count !== 1 ? "s" : ""} tracked separately`
											: "Total tracked"}
									</p>
								</CardContent>
							</Card>
						</div>

						{loanFlows.count > 0 && (
							<Card className="border-primary/20 bg-primary/[0.03]">
								<CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
									<div className="flex items-center gap-2 text-sm font-medium">
										<Wallet className="h-4 w-4 text-primary" />
										Loan activity
									</div>
									<span className="inline-flex items-center gap-1 text-sm">
										<ArrowUpRight className="h-3.5 w-3.5 text-ds-red-700" />
										Lent {formatCurrency(loanFlows.lent)}
									</span>
									<span className="inline-flex items-center gap-1 text-sm">
										<ArrowDownRight className="h-3.5 w-3.5 text-ds-green-700" />
										Received {formatCurrency(loanFlows.received)}
									</span>
									<Link
										to="/loans"
										className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
									>
										View loans <ArrowRight className="h-3 w-3" />
									</Link>
								</CardContent>
							</Card>
						)}

						{/* Daily spending line chart - full width */}
						<SpendingLineChart
							data={spendingData}
							periodLabel={chartPeriodLabel}
							granularity={chartGranularity}
						/>

						{/* Charts Row */}
						<CategoryBarChart data={categoryData} />
						<CategoryPieChart data={categoryData} />

						{/* Bottom Charts Row */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<MonthlyTrendsChart data={monthlyData} />
							<BankBarChart data={bankData} />
						</div>
					</>
				)}
			</div>
		</div>
	);
}
