import { areaY, defineChart, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyShort } from "@/lib/formatCurrency";
import { EXPENSES_COLOR, INCOME_COLOR } from "./chart-theme";

export type MonthlyTrendsDataPoint = {
	month: string;
	expenses: number;
	income: number;
	/** Month bucket key in `yyyy-MM` form, used for click-to-filter. */
	key?: string;
};

type TrendRow = {
	month: string;
	kind: "Income" | "Expenses";
	amount: number;
	key?: string;
};

type MonthlyTrendsChartProps = {
	data: MonthlyTrendsDataPoint[];
	/** Fired when a month point is clicked or keyboard-activated. */
	onDataPointClick?: (point: {
		key?: string;
		month: string;
		kind: "Income" | "Expenses";
	}) => void;
};

export function MonthlyTrendsChart({
	data,
	onDataPointClick,
}: MonthlyTrendsChartProps) {
	const definition = useMemo(() => {
		// Long format lets both series share one scale while explicit y1/y2 keep
		// them overlapping (not stacked), matching the previous chart semantics.
		const rows: TrendRow[] = data.flatMap((d) => [
			{ month: d.month, kind: "Income", amount: d.income, key: d.key },
			{ month: d.month, kind: "Expenses", amount: d.expenses, key: d.key },
		]);

		return defineChart({
			marks: [
				areaY(rows, {
					x: "month",
					y1: 0,
					y2: "amount",
					z: "kind",
					fillOpacity: 0.3,
				}),
				lineY(rows, {
					x: "month",
					y: "amount",
					z: "kind",
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
			color: {
				domain: ["Expenses", "Income"],
				range: [EXPENSES_COLOR, INCOME_COLOR],
			},
			focus: "group-x",
			tooltip: {
				use: tooltip,
				items: [
					{
						channel: "y",
						label: "Amount",
						text: (point) => formatCurrency(point.yValue),
					},
				],
			},
		});
	}, [data]);

	return (
		<Card className="hover:shadow-md transition-shadow min-w-0 overflow-hidden">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Monthly Trends
				</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<Chart
						definition={definition}
						height={300}
						ariaLabel="Monthly income and expenses trends"
						className={onDataPointClick ? "cursor-pointer" : undefined}
						onSelect={(point) => {
							if (point) onDataPointClick?.(point.datum);
						}}
					/>
				) : (
					<div className="h-[300px] flex items-center justify-center text-muted-foreground">
						No transaction data available
					</div>
				)}
			</CardContent>
		</Card>
	);
}
