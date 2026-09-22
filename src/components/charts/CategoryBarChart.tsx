import { barX, defineChart } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyShort } from "@/lib/formatCurrency";
import { useChartTheme } from "./chart-theme";

export type CategoryBarDataPoint = {
	name: string;
	value: number;
	icon?: string | null;
	fill: string;
	/** Category id, or null for the "Uncategorized" grouping. */
	id?: string | null;
};

type CategoryBarChartProps = {
	data: CategoryBarDataPoint[];
	/** Fired when a bar is clicked or keyboard-activated. */
	onDataPointClick?: (point: CategoryBarDataPoint) => void;
};

type CategoryBarChartContentProps = CategoryBarChartProps & {
	/** Chart height in pixels. Defaults to fit the category count. */
	height?: number;
};

export function CategoryBarChartContent({
	data,
	onDataPointClick,
	height,
}: CategoryBarChartContentProps) {
	const theme = useChartTheme();
	const definition = useMemo(() => {
		return defineChart({
			marks: [
				barX(data, {
					x: "value",
					y: "name",
					fill: theme.accent,
					radius: 4,
					maxThickness: 26,
				}),
			],
			x: {
				scale: scaleLinear,
				nice: true,
				grid: true,
				axis: {
					ticks: { format: (value) => formatCurrencyShort(Number(value)) },
				},
			},
			y: { scale: () => scaleBand<string>().padding(0.25) },
			focus: "nearest-y",
			tooltip: {
				use: tooltip,
				items: [
					"y",
					{
						channel: "x",
						label: "Spent",
						text: (point) => formatCurrency(point.xValue),
					},
				],
			},
		});
	}, [data, theme]);

	const chartHeight = height ?? Math.max(300, data.length * 44);

	if (data.length === 0) {
		return (
			<div
				style={{ height: chartHeight }}
				className="flex items-center justify-center text-muted-foreground"
			>
				No category data available
			</div>
		);
	}

	return (
		<Chart
			definition={definition}
			height={chartHeight}
			ariaLabel="Spending by category"
			className={onDataPointClick ? "cursor-pointer" : undefined}
			onSelect={(point) => {
				if (point) onDataPointClick?.(point.datum);
			}}
		/>
	);
}

export function CategoryBarChart({
	data,
	onDataPointClick,
}: CategoryBarChartProps) {
	return (
		<Card className="hover:shadow-md transition-shadow min-w-0 overflow-hidden">
			<CardHeader>
				<CardTitle>Spending by Category (Bar)</CardTitle>
			</CardHeader>
			<CardContent>
				<CategoryBarChartContent
					data={data}
					onDataPointClick={onDataPointClick}
				/>
			</CardContent>
		</Card>
	);
}
