import { defineChart, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyShort } from "@/lib/formatCurrency";
import { LINE_COLOR } from "./chart-theme";

export type SpendingDataPoint = {
	day: number;
	label: string;
	spending: number;
};

type SpendingLineChartProps = {
	data: SpendingDataPoint[];
	/** Optional subtitle, e.g. period label from the date filter */
	periodLabel?: string;
	/** "month" for All time view; default "day" */
	granularity?: "day" | "month";
};

export function SpendingLineChart({
	data,
	periodLabel,
	granularity = "day",
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
	const subtitle = periodLabel
		? `Spending ${perLabel} · ${periodLabel}`
		: `Spending ${perLabel}`;

	return (
		<Card className="hover:shadow-md transition-shadow min-w-0 overflow-hidden">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Spending
				</CardTitle>
				<p className="text-sm text-muted-foreground">{subtitle}</p>
			</CardHeader>
			<CardContent className="px-4">
				{data.length > 0 ? (
					<Chart
						definition={definition}
						height={300}
						ariaLabel="Spending over time"
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
