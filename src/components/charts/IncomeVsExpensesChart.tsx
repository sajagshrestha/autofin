import { barY, colorLegend, defineChart, group } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyShort } from "@/lib/formatCurrency";
import { useChartTheme } from "./chart-theme";

export type IncomeVsExpensesDataPoint = {
	month: string;
	expenses: number;
	income: number;
	/** Month bucket key in `yyyy-MM` form, used for click-to-filter. */
	key?: string;
};

type SeriesRow = {
	month: string;
	kind: "Income" | "Expenses";
	amount: number;
	key?: string;
};

type IncomeVsExpensesChartProps = {
	data: IncomeVsExpensesDataPoint[];
	/** Fired when a month bar is clicked or keyboard-activated. */
	onDataPointClick?: (point: { key?: string; month: string }) => void;
};

export function IncomeVsExpensesChart({
	data,
	onDataPointClick,
}: IncomeVsExpensesChartProps) {
	const theme = useChartTheme();
	const definition = useMemo(() => {
		// Long format + group layout renders income and expenses side by side
		// within each month band.
		const rows: SeriesRow[] = data.flatMap((d) => [
			{ month: d.month, kind: "Income", amount: d.income, key: d.key },
			{ month: d.month, kind: "Expenses", amount: d.expenses, key: d.key },
		]);

		return defineChart({
			marks: [
				barY(rows, {
					x: "month",
					y: "amount",
					z: "kind",
					layout: group({ padding: 0.1 }),
					radius: 3,
					maxThickness: 28,
				}),
			],
			x: { scale: () => scaleBand<string>().padding(0.25) },
			y: {
				scale: scaleLinear,
				nice: true,
				grid: true,
				axis: {
					ticks: { format: (value) => formatCurrencyShort(Number(value)) },
				},
			},
			color: {
				domain: ["Income", "Expenses"],
				range: [theme.income, theme.expenses],
				legend: colorLegend({ label: "Cash flow" }),
			},
			focus: "group-x",
			tooltip: {
				use: tooltip,
				items: [
					"x",
					{
						channel: "y",
						label: "Amount",
						text: (point) => formatCurrency(point.yValue),
					},
				],
			},
		});
	}, [data, theme]);

	return (
		<Card className="hover:shadow-md transition-shadow min-w-0 overflow-hidden">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Income vs Expenses
				</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<Chart
						definition={definition}
						height={300}
						ariaLabel="Income versus expenses per month"
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
