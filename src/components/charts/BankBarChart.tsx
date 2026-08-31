import { barX, defineChart } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyShort } from "@/lib/formatCurrency";
import { BAR_PRIMARY } from "./chart-theme";

export type BankBarDataPoint = {
	name: string;
	amount: number;
	/** Full untruncated bank name, used for click-to-filter. */
	fullName?: string;
};

type BankBarChartProps = {
	data: BankBarDataPoint[];
	/** Fired when a bar is clicked or keyboard-activated. */
	onDataPointClick?: (point: BankBarDataPoint) => void;
};

export function BankBarChart({ data, onDataPointClick }: BankBarChartProps) {
	const definition = useMemo(() => {
		return defineChart({
			marks: [
				barX(data, {
					x: "amount",
					y: "name",
					fill: BAR_PRIMARY,
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
	}, [data]);

	return (
		<Card className="hover:shadow-md transition-shadow min-w-0 overflow-hidden">
			<CardHeader>
				<CardTitle>Spending by Bank</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<Chart
						definition={definition}
						height={300}
						ariaLabel="Spending by bank"
						className={onDataPointClick ? "cursor-pointer" : undefined}
						onSelect={(point) => {
							if (point) onDataPointClick?.(point.datum);
						}}
					/>
				) : (
					<div className="h-[300px] flex items-center justify-center text-muted-foreground">
						No bank data available
					</div>
				)}
			</CardContent>
		</Card>
	);
}
