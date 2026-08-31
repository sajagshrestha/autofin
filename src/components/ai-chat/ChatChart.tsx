import {
	BankBarChart,
	CategoryBarChart,
	CategoryPieChart,
	MonthlyTrendsChart,
	type SpendingDataPoint,
	SpendingLineChart,
} from "@/components/charts";
import { pickChartColor } from "@/components/charts/chart-theme";

type ChartOutput = {
	type: string;
	title?: string;
	data: Array<Record<string, unknown>>;
};

function toNumber(value: unknown): number {
	return Number(value ?? 0) || 0;
}

/**
 * Renders a chart from a `renderChart` advisor-tool output. Assigns the fixed
 * chart palette client-side so the model only needs to supply values.
 */
export function ChatChart({ output }: { output: ChartOutput }) {
	const data = output.data ?? [];

	switch (output.type) {
		case "monthlyTrend":
			return (
				<MonthlyTrendsChart
					data={data.map((row) => ({
						month: String(row.month ?? ""),
						income: toNumber(row.income),
						expenses: toNumber(row.expenses),
					}))}
				/>
			);

		case "categoryPie":
			return (
				<CategoryPieChart
					data={data.map((row, index) => ({
						name: String(row.name ?? ""),
						value: toNumber(row.value),
						fill: pickChartColor(index),
					}))}
				/>
			);

		case "categoryBar":
			return (
				<CategoryBarChart
					data={data.map((row, index) => ({
						name: String(row.name ?? ""),
						value: toNumber(row.value),
						fill: pickChartColor(index),
					}))}
				/>
			);

		case "bank":
			return (
				<BankBarChart
					data={data.map((row) => ({
						name: String(row.name ?? ""),
						amount: toNumber(row.amount),
					}))}
				/>
			);

		case "spending":
			return (
				<SpendingLineChart
					data={data.map((row) => ({
						label: String(row.label ?? ""),
						spending: toNumber(row.spending),
						day: 0,
					})) as SpendingDataPoint[]}
				/>
			);

		default:
			return null;
	}
}
