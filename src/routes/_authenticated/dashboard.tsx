import { createFileRoute, Link } from "@tanstack/react-router";
import {
	eachDayOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	format,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "date-fns";
import {
	ArrowDownRight,
	ArrowRight,
	ArrowUpRight,
	CreditCard,
	PiggyBank,
	SlidersHorizontal,
	Wallet,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import {
	CategorySpendingChart,
	type CategorySpendingDataPoint,
	IncomeVsExpensesChart,
	SavingsPerMonthChart,
	type SpendingDataPoint,
	SpendingLineChart,
} from "@/components/charts";
import { pickChartColor, useChartTheme } from "@/components/charts/chart-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DateFilter,
	type DatePeriod,
	type DateRange,
	getDateRangeForPeriod,
} from "@/components/ui/date-filter";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useGetAllTransactions } from "@/hooks/transactions/queries";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatCurrency } from "@/lib/formatCurrency";

const defaultRange = getDateRangeForPeriod("monthly");

const searchParamsSchema = z.object({
	period: z
		.enum(["daily", "last7d", "weekly", "monthly", "yearly", "all"])
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
	category: z.string().optional().default(""),
	excludeLoans: z.boolean().optional().default(false),
});

export const Route = createFileRoute("/_authenticated/dashboard")({
	validateSearch: searchParamsSchema,
	component: AnalyticsDashboard,
});

export function AnalyticsDashboard() {
	const { period, startDate, endDate, category, excludeLoans } =
		Route.useSearch();
	const navigate = Route.useNavigate();
	// Chart click-to-filter is a pointer-heavy interaction; keep it desktop-only
	// to avoid accidental navigations while scrolling on touch devices.
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const { data: transactionsData, isLoading } = useGetAllTransactions({
		startDate,
		endDate,
	});
	// Live palette from the active theme context (light/dark + named theme).
	const chartTheme = useChartTheme();

	// Savings-per-month ignores the dashboard date filter and always shows the
	// current calendar year, so it needs its own year-scoped fetch.
	const { data: yearTransactionsData } = useGetAllTransactions({
		startDate: startOfYear(new Date()).toISOString(),
		endDate: endOfYear(new Date()).toISOString(),
	});

	const handlePeriodChange = useCallback(
		(newPeriod: DatePeriod) => {
			const range = getDateRangeForPeriod(newPeriod);
			navigate({
				search: (prev) => ({
					...prev,
					period: newPeriod,
					startDate: range.startDate ?? "",
					endDate: range.endDate ?? "",
				}),
				resetScroll: false,
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
				resetScroll: false,
			});
		},
		[navigate],
	);

	const handleCategoryChange = useCallback(
		(newCategory: string) => {
			navigate({
				search: (prev) => ({ ...prev, category: newCategory }),
				resetScroll: false,
			});
		},
		[navigate],
	);

	type TransactionNavOptions = {
		type?: "debit" | "credit";
		category?: string;
		bank?: string;
		startDate?: string;
		endDate?: string;
		period?: DatePeriod;
	};

	const goToTransactions = useCallback(
		(opts: TransactionNavOptions = {}) => {
			navigate({
				to: "/transactions",
				search: {
					period: opts.period ?? period,
					startDate: opts.startDate ?? startDate,
					endDate: opts.endDate ?? endDate,
					type: opts.type ?? "all",
					category: opts.category ?? "all",
					bank: opts.bank ?? "",
					excludeLoans,
				},
				resetScroll: false,
			});
		},
		[navigate, period, startDate, endDate, excludeLoans],
	);

	const handleSpendingPointClick = useCallback(
		(point: SpendingDataPoint) => {
			if (!point.startDate || !point.endDate || !point.period) return;
			goToTransactions({
				startDate: point.startDate,
				endDate: point.endDate,
				period: point.period as DatePeriod,
			});
		},
		[goToTransactions],
	);

	const handleCategoryPointClick = useCallback(
		(point: CategorySpendingDataPoint) => {
			goToTransactions({ category: point.id ?? "uncategorized" });
		},
		[goToTransactions],
	);

	const handleMonthPointClick = useCallback(
		(point: { key?: string }) => {
			if (!point.key) return;
			const start = startOfMonth(new Date(`${point.key}-01`));
			goToTransactions({
				startDate: start.toISOString(),
				endDate: endOfMonth(start).toISOString(),
				period: "monthly",
			});
		},
		[goToTransactions],
	);

	const transactions = useMemo(() => {
		const entries = transactionsData?.transactions ?? [];
		return excludeLoans ? entries.filter((t) => !t.loanId) : entries;
	}, [transactionsData, excludeLoans]);

	// Loan activity follows the same filter as the summary cards and charts.
	const { loanFlows } = useMemo(() => {
		let lent = 0;
		let received = 0;
		let count = 0;

		for (const t of transactions) {
			if (t.loanId) {
				count += 1;
				if (t.type === "debit") lent += parseFloat(t.amount || "0");
				else received += parseFloat(t.amount || "0");
			}
		}

		return {
			loanFlows: { lent, received, count },
		};
	}, [transactions]);

	// Calculate summary stats for the filtered transactions.
	const stats = useMemo(() => {
		let totalExpenses = 0;
		let totalIncome = 0;

		transactions.forEach((t) => {
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
			transactionCount: transactions.length,
		};
	}, [transactions]);

	// Monthly spending data for area chart
	const monthlyData = useMemo(() => {
		if (!transactions.length) return [];

		const monthMap = new Map<string, { expenses: number; income: number }>();

		transactions.forEach((t) => {
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
				key: month,
			}));
	}, [transactions]);

	// Net savings per month for the current calendar year (Jan through the
	// current month), using the same loan filter as the summary cards.
	const savingsData = useMemo(() => {
		const transactions = yearTransactionsData?.transactions ?? [];
		const year = new Date().getFullYear();
		const now = new Date();
		const months = eachMonthOfInterval({
			start: startOfYear(now),
			end: startOfMonth(now),
		});

		const savingsByMonth = new Map<string, number>();
		for (const t of transactions) {
			if (excludeLoans && t.loanId) continue;
			const date = t.transactionDate ? new Date(t.transactionDate) : null;
			if (!date || date.getFullYear() !== year) continue;
			const amount = parseFloat(t.amount || "0");
			const signed = t.type === "credit" ? amount : -amount;
			const key = format(date, "yyyy-MM");
			savingsByMonth.set(key, (savingsByMonth.get(key) ?? 0) + signed);
		}

		return months.map((m) => {
			const key = format(m, "yyyy-MM");
			return {
				month: format(m, "MMM"),
				savings: savingsByMonth.get(key) ?? 0,
				key,
			};
		});
	}, [yearTransactionsData, excludeLoans]);

	const categoryData = useMemo(() => {
		if (!transactions.length) return [];

		const categoryMap = new Map<
			string,
			{ amount: number; icon?: string | null; id: string | null }
		>();

		transactions.forEach((t) => {
			if (t.type === "credit") return;
			const categoryName = t.category?.name || "Uncategorized";
			const categoryIcon = t.category?.icon || null;
			const categoryId = t.category?.id ?? null;
			const amount = parseFloat(t.amount || "0");
			const existing = categoryMap.get(categoryName) || {
				amount: 0,
				icon: categoryIcon,
				id: categoryId,
			};
			categoryMap.set(categoryName, {
				amount: existing.amount + amount,
				icon: categoryIcon,
				id: existing.id ?? categoryId,
			});
		});

		return Array.from(categoryMap.entries())
			.sort((a, b) => b[1].amount - a[1].amount)
			.map(([name, data], index) => ({
				name,
				value: data.amount,
				icon: data.icon,
				fill: pickChartColor(chartTheme.categorical, index),
				id: data.id,
			}));
	}, [transactions, chartTheme]);

	// Available categories for the spending line chart filter
	const spendingCategories = useMemo(
		() =>
			categoryData.map((c) => ({
				name: c.name,
				icon: c.icon,
			})),
		[categoryData],
	);

	// Transactions restricted to the selected category (line chart filter)
	const spendingSource = useMemo(() => {
		if (!category) return transactions;
		return transactions.filter(
			(t) => (t.category?.name || "Uncategorized") === category,
		);
	}, [transactions, category]);

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
				case "last7d":
				case "monthly":
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
			if (!spendingSource.length) return [];
			const dates = spendingSource
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
		spendingSource.forEach((t) => {
			if (t.type === "credit") return;
			const date = t.transactionDate ? new Date(t.transactionDate) : new Date();
			let key: string;
			if (period === "daily" || period === "last7d" || period === "monthly")
				key = format(date, "yyyy-MM-dd");
			else if (period === "weekly")
				key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-'W'ww");
			else key = format(date, "yyyy-MM");
			if (!keyToSpending.has(key)) return;
			const amount = parseFloat(t.amount || "0");
			keyToSpending.set(key, (keyToSpending.get(key) ?? 0) + amount);
		});

		const bucketPeriod: DatePeriod =
			period === "weekly"
				? "weekly"
				: period === "daily" || period === "last7d" || period === "monthly"
					? "daily"
					: "monthly";
		const bucketRange = (date: Date): { startDate: Date; endDate: Date } => {
			if (bucketPeriod === "weekly")
				return {
					startDate: startOfWeek(date, { weekStartsOn: 1 }),
					endDate: endOfWeek(date, { weekStartsOn: 1 }),
				};
			if (bucketPeriod === "daily")
				return { startDate: startOfDay(date), endDate: endOfDay(date) };
			return { startDate: startOfMonth(date), endDate: endOfMonth(date) };
		};

		return buckets.map((b, index) => {
			const range = bucketRange(b.date);
			return {
				day: index + 1,
				label: b.label,
				spending: keyToSpending.get(b.key) ?? 0,
				startDate: range.startDate.toISOString(),
				endDate: range.endDate.toISOString(),
				period: bucketPeriod,
			};
		});
	}, [spendingSource, period, startDate, endDate]);

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
			if (period === "daily" || period === "last7d")
				return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
			if (period === "monthly") return format(start, "MMMM yyyy");
			if (period === "yearly") return format(start, "yyyy");
			return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
		};
		const label = formatRange();
		const granularity =
			period === "daily" || period === "last7d" || period === "monthly"
				? ("day" as const)
				: ("month" as const);
		return { chartPeriodLabel: label, chartGranularity: granularity };
	}, [period, startDate, endDate]);

	return (
		<div className="space-y-6 min-w-0 overflow-hidden">
			<div className="space-y-6 min-w-0">
				{/* Header - always visible */}
				<div className="relative flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1 className="pr-12 text-2xl sm:pr-0 sm:text-3xl font-semibold tracking-tight">
							Your money, at a glance
						</h1>
						<p className="text-sm text-muted-foreground mt-2">
							Track your cash flow and see where your money goes.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2 max-sm:w-full">
						<DateFilter
							period={period}
							startDate={startDate}
							endDate={endDate}
							onPeriodChange={handlePeriodChange}
							onDateRangeChange={handleDateRangeChange}
						/>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									aria-label={
										excludeLoans
											? "Dashboard filters (1 active)"
											: "Dashboard filters"
									}
									title="Dashboard filters"
									className={
										excludeLoans
											? "max-sm:absolute max-sm:right-0 max-sm:top-0 relative border-primary/60 text-primary"
											: "max-sm:absolute max-sm:right-0 max-sm:top-0 relative"
									}
								>
									<SlidersHorizontal aria-hidden="true" />
									{excludeLoans && (
										<span
											aria-hidden="true"
											className="absolute right-1 top-1 size-1.5 rounded-full bg-primary"
										/>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								align="end"
								aria-label="Dashboard filters"
								className="w-80 max-w-[calc(100vw-2rem)] space-y-4"
							>
								<h2 className="text-sm font-semibold">Filters</h2>
								<div className="flex items-center gap-3">
									<Switch
										id="exclude-loan-transactions"
										className="peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
										checked={excludeLoans}
										onChange={(event) => {
											const checked = event.target.checked;
											navigate({
												search: (prev) => ({ ...prev, excludeLoans: checked }),
												resetScroll: false,
											});
										}}
									/>
									<Label
										htmlFor="exclude-loan-transactions"
										className="cursor-pointer"
									>
										Exclude loan-linked transactions
									</Label>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{isLoading ? (
					<>
						{/* Summary cards skeleton */}
						<div className="grid grid-cols-1 min-[380px]:grid-cols-2 xl:grid-cols-4 gap-4">
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
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
						<div className="grid grid-cols-1 min-[380px]:grid-cols-2 xl:grid-cols-4 gap-4">
							<Card
								className="summary-card [--summary-accent:var(--ds-red-700)] hover:border-primary/40 transition-colors cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-ring"
								role="button"
								tabIndex={0}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										event.currentTarget.click();
									}
								}}
								onClick={() => goToTransactions({ type: "debit" })}
							>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Expenses
									</CardTitle>
									<div className="rounded-full bg-ds-red-500/10 p-1.5">
										<ArrowDownRight className="h-4 w-4 text-ds-red-700" />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-xl xl:text-2xl font-bold text-ds-red-700 truncate tabular-nums">
										{formatCurrency(stats.totalExpenses)}
									</div>
									<p className="text-xs text-muted-foreground">
										{excludeLoans
											? "Excludes loan transfers"
											: "Includes loan transfers"}
									</p>
								</CardContent>
							</Card>

							<Card
								className="summary-card [--summary-accent:var(--ds-green-700)] hover:border-primary/40 transition-colors cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-ring"
								role="button"
								tabIndex={0}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										event.currentTarget.click();
									}
								}}
								onClick={() => goToTransactions({ type: "credit" })}
							>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Income
									</CardTitle>
									<div className="rounded-full bg-ds-green-500/10 p-1.5">
										<ArrowUpRight className="h-4 w-4 text-ds-green-700" />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-xl xl:text-2xl font-bold text-ds-green-700 truncate tabular-nums">
										{formatCurrency(stats.totalIncome)}
									</div>
									<p className="text-xs text-muted-foreground">
										{excludeLoans
											? "Excludes loan transfers"
											: "Includes loan transfers"}
									</p>
								</CardContent>
							</Card>

							<Card
								className={`summary-card ${stats.savings >= 0 ? "[--summary-accent:var(--ds-green-700)]" : "[--summary-accent:var(--ds-red-700)]"} hover:border-primary/40 transition-colors cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-ring`}
								role="button"
								tabIndex={0}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										event.currentTarget.click();
									}
								}}
								onClick={() => goToTransactions()}
							>
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
										className={`text-xl xl:text-2xl font-bold truncate tabular-nums ${stats.savings >= 0 ? "text-ds-green-700" : "text-ds-red-700"}`}
									>
										{formatCurrency(stats.savings)}
									</div>
									<p className="text-xs text-muted-foreground">
										{stats.savings >= 0 ? "Net positive" : "Net negative"}
									</p>
								</CardContent>
							</Card>

							<Card
								className="summary-card [--summary-accent:var(--chart-1)] hover:border-primary/40 transition-colors cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-ring"
								role="button"
								tabIndex={0}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										event.currentTarget.click();
									}
								}}
								onClick={() => goToTransactions()}
							>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Transactions
									</CardTitle>
									<div className="rounded-full bg-chart-1/10 p-1.5">
										<CreditCard className="h-4 w-4 text-chart-1" />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats.transactionCount}
									</div>
									<p className="text-xs text-muted-foreground">
										{loanFlows.count > 0
											? `Includes ${loanFlows.count} loan transfer${loanFlows.count !== 1 ? "s" : ""}`
											: excludeLoans
												? "Excludes loan transfers"
												: "Total tracked"}
									</p>
								</CardContent>
							</Card>
						</div>

						{loanFlows.count > 0 && (
							<Card className="border-primary/20 bg-primary/[0.03]">
								<CardContent className="space-y-3 px-4 py-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-sm font-medium">
											<Wallet className="h-4 w-4 text-primary" />
											Loan activity
										</div>
										<span className="text-xs text-muted-foreground">
											{loanFlows.count} transfer
											{loanFlows.count !== 1 ? "s" : ""}
										</span>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div className="flex items-center gap-2 rounded-lg bg-ds-red-500/10 px-3 py-2">
											<ArrowUpRight className="h-4 w-4 shrink-0 text-ds-red-700" />
											<div className="min-w-0">
												<p className="text-[11px] leading-tight text-muted-foreground">
													Lent
												</p>
												<p className="truncate text-sm font-semibold tabular-nums text-ds-red-700">
													{formatCurrency(loanFlows.lent)}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2 rounded-lg bg-ds-green-500/10 px-3 py-2">
											<ArrowDownRight className="h-4 w-4 shrink-0 text-ds-green-700" />
											<div className="min-w-0">
												<p className="text-[11px] leading-tight text-muted-foreground">
													Received
												</p>
												<p className="truncate text-sm font-semibold tabular-nums text-ds-green-700">
													{formatCurrency(loanFlows.received)}
												</p>
											</div>
										</div>
									</div>
									<Link
										to="/loans"
										className="flex w-full items-center justify-center gap-1 rounded-md border border-primary/20 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 hover:underline"
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
							categories={spendingCategories}
							selectedCategory={category}
							onCategoryChange={handleCategoryChange}
							onDataPointClick={
								isDesktop ? handleSpendingPointClick : undefined
							}
						/>

						{/* Category breakdown — bar/pie toggle */}
						<CategorySpendingChart
							data={categoryData}
							onDataPointClick={
								isDesktop ? handleCategoryPointClick : undefined
							}
						/>

						{/* Bottom Charts Row */}
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							<SavingsPerMonthChart
								data={savingsData}
								onDataPointClick={isDesktop ? handleMonthPointClick : undefined}
							/>
							<IncomeVsExpensesChart
								data={monthlyData}
								onDataPointClick={isDesktop ? handleMonthPointClick : undefined}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
