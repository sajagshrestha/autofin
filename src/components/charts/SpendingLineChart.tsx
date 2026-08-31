import { defineChart, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CategoryCombobox,
	type CategoryComboboxOption,
} from "@/components/ui/category-combobox";
import { formatCurrency, formatCurrencyShort } from "@/lib/formatCurrency";
import { LINE_COLOR } from "./chart-theme";

export type SpendingDataPoint = {
	day: number;
	label: string;
	spending: number;
	/** Bucket date range (ISO) used when a point is clicked to filter transactions. */
	startDate?: string;
	endDate?: string;
	/** Date period matching the bucket granularity, e.g. "daily" or "monthly". */
	period?: string;
};

export type SpendingCategoryOption = {
	name: string;
	icon?: string | null;
};

const ALL_CATEGORIES = "__all__";

type SpendingLineChartProps = {
	data: SpendingDataPoint[];
	/** Optional subtitle, e.g. period label from the date filter */
	periodLabel?: string;
	/** "month" for All time view; default "day" */
	granularity?: "day" | "month";
	/** Available categories for the filter dropdown */
	categories?: SpendingCategoryOption[];
	/** Selected category name; empty string means all categories */
	selectedCategory?: string;
	onCategoryChange?: (category: string) => void;
	/** Fired when a data point is clicked or keyboard-activated. */
	onDataPointClick?: (point: SpendingDataPoint) => void;
};

export function SpendingLineChart({
	data,
	periodLabel,
	granularity = "day",
	categories,
	selectedCategory = "",
	onCategoryChange,
	onDataPointClick,
}: SpendingLineChartProps) {
	const definition = useMemo(() => {
		return defineChart({
			marks: [
				lineY(data, {
					x: "label",
					y: "spending",
					stroke: LINE_COLOR,
					strokeWidth: 2,
				}),
			],
			x: { scale: () => scalePoint<string>().padding(0.35) },
			y: {
				scale: scaleLinear,
				nice: true,
				grid: true,
				axis: {
					ticks: { format: (value) => formatCurrencyShort(Number(value)) },
				},
			},
			focus: "nearest-x",
			tooltip: {
				use: tooltip,
				items: [
					"x",
					{
						channel: "y",
						label: "Spending",
						text: (point) => formatCurrency(point.yValue),
					},
				],
			},
		});
	}, [data]);

	const perLabel = granularity === "month" ? "per month" : "per day";
	const categoryName = categories?.find(
		(c) => c.name === selectedCategory,
	)?.name;
	const subtitle = [`Spending ${perLabel}`, categoryName, periodLabel]
		.filter(Boolean)
		.join(" · ");

	const categoryOptions = useMemo<CategoryComboboxOption[]>(
		() => [
			{
				id: ALL_CATEGORIES,
				label: "All categories",
				searchLabel: "all categories",
			},
			...(categories ?? []).map((cat) => ({
				id: cat.name,
				label: cat.icon ? `${cat.icon} ${cat.name}` : cat.name,
				searchLabel: cat.name.toLowerCase(),
			})),
		],
		[categories],
	);

	return (
		<Card className="hover:shadow-md transition-shadow min-w-0 overflow-hidden">
			<CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
				<div className="min-w-0">
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Spending
					</CardTitle>
					<p className="text-sm text-muted-foreground">{subtitle}</p>
				</div>
				{categories && categories.length > 0 && (
					<CategoryCombobox
						value={selectedCategory || ALL_CATEGORIES}
						onChange={(value) =>
							onCategoryChange?.(value === ALL_CATEGORIES ? "" : value)
						}
						options={categoryOptions}
						placeholder="Filter by category"
						className="w-52"
					/>
				)}
			</CardHeader>
			<CardContent className="px-4">
				{data.length > 0 ? (
					<Chart
						definition={definition}
						height={300}
						ariaLabel="Spending over time"
						className={onDataPointClick ? "cursor-pointer" : undefined}
						onSelect={(point) => {
							if (point) onDataPointClick?.(point.datum);
						}}
					/>
				) : (
					<div className="h-[300px] flex items-center justify-center text-muted-foreground">
						No spending data for this period
					</div>
				)}
			</CardContent>
		</Card>
	);
}
