import { areaY, defineChart, dot, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { PiggyBank } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyShort } from "@/lib/formatCurrency";
import { EXPENSES_COLOR, INCOME_COLOR } from "./chart-theme";

export type SavingsPerMonthDataPoint = {
	month: string;
	/** Net savings for the month (income minus expenses); may be negative. */
	savings: number;
	/** Month bucket key in `yyyy-MM` form, used for click-to-filter. */
	key?: string;
};

type Sign = "positive" | "negative";

type SavingsPoint = SavingsPerMonthDataPoint & {
	index: number;
	sign: Sign;
};

type SavingsSegmentRow = SavingsPoint & { segment: number };

const signOf = (value: number): Sign => (value >= 0 ? "positive" : "negative");

/**
 * Split the series into sign runs so the line/area can be painted green above
 * zero and red below. Exact zero crossings are interpolated in index space and
 * shared by the two adjacent segments, so they meet without a gap.
 */
function buildSegments(data: SavingsPerMonthDataPoint[]): SavingsSegmentRow[] {
	if (data.length === 0) return [];
	const points = data.map((d, index) => ({
		...d,
		index,
		sign: signOf(d.savings),
	}));
	const rows: SavingsSegmentRow[] = [];
	let segment = 0;
	let prevSign = points[0].sign;
	rows.push({ ...points[0], segment });

	for (let i = 1; i < points.length; i++) {
		const prev = points[i - 1];
		const cur = points[i];
		const curSign = cur.sign;

		if (curSign !== prevSign) {
			let crossIndex: number;
			if (prev.savings === 0) crossIndex = prev.index;
			else if (cur.savings === 0) crossIndex = cur.index;
			else {
				const t = prev.savings / (prev.savings - cur.savings);
				crossIndex = prev.index + t * (cur.index - prev.index);
			}
			const crossing = {
				index: crossIndex,
				month: "",
				savings: 0,
				key: undefined,
				sign: prevSign,
			};
			rows.push({ ...crossing, segment });
			segment += 1;
			rows.push({ ...crossing, sign: curSign, segment });
			prevSign = curSign;
			if (crossIndex === cur.index) continue;
		}
		rows.push({ ...cur, segment });
	}
	return rows;
}

type SavingsPerMonthChartProps = {
	data: SavingsPerMonthDataPoint[];
	/** Fired when a month point is clicked or keyboard-activated. */
	onDataPointClick?: (point: SavingsPerMonthDataPoint) => void;
};

export function SavingsPerMonthChart({
	data,
	onDataPointClick,
}: SavingsPerMonthChartProps) {
	const definition = useMemo(() => {
		const rows = buildSegments(data);
		const points: SavingsPoint[] = data.map((d, index) => ({
			...d,
			index,
			sign: signOf(d.savings),
		}));
		const lastIndex = Math.max(data.length - 1, 1);

		return defineChart({
			marks: [
				areaY(rows, {
					x: "index",
					y1: 0,
					y2: "savings",
					z: "segment",
					fill: (datum) =>
						datum.sign === "positive" ? INCOME_COLOR : EXPENSES_COLOR,
					fillOpacity: 0.15,
				}),
				lineY(rows, {
					x: "index",
					y: "savings",
					z: "segment",
					stroke: (datum) =>
						datum.sign === "positive" ? INCOME_COLOR : EXPENSES_COLOR,
					strokeWidth: 2,
				}),
				dot(
					points.filter((p) => p.sign === "positive"),
					{ x: "index", y: "savings", fill: INCOME_COLOR, r: 3 },
				),
				dot(
					points.filter((p) => p.sign === "negative"),
					{ x: "index", y: "savings", fill: EXPENSES_COLOR, r: 3 },
				),
			],
			x: {
				scale: scaleLinear().domain([-0.5, lastIndex + 0.5]),
				axis: {
					ticks: {
						values: points.map((p) => p.index),
						format: (value) => points[value]?.month ?? "",
					},
				},
			},
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
					{
						channel: "x",
						label: "Month",
						text: (point) => point.datum.month,
					},
					{
						channel: "y",
						label: "Net savings",
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
					<PiggyBank className="h-5 w-5" />
					Savings per Month
				</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<Chart
						definition={definition}
						height={300}
						ariaLabel="Net savings per month this year"
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
