import { defineChart } from "@tanstack/charts";
import { pie, polar, radialArc } from "@tanstack/charts/polar";
import { Chart } from "@tanstack/charts/react";
import { tooltip } from "@tanstack/charts/tooltip";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

export type CategoryPieDataPoint = {
	name: string;
	value: number;
	icon?: string | null;
	fill: string;
	/** Category id, or null for the "Uncategorized" grouping. */
	id?: string | null;
};

type CategoryPieChartProps = {
	data: CategoryPieDataPoint[];
	/** Fired when a slice or legend item is clicked or keyboard-activated. */
	onDataPointClick?: (point: CategoryPieDataPoint) => void;
};

export function CategoryPieChart({
	data,
	onDataPointClick,
}: CategoryPieChartProps) {
	const definition = useMemo(() => {
		const slices = pie(data, { value: "value" });

		return defineChart({
			marks: [
				polar({
					inset: 8,
					radiusRatio: 0.9,
					marks: [
						radialArc(slices, {
							innerRadius: ({ radius }) => radius * 0.58,
							cornerRadius: 4,
							color: "name",
							key: "name",
						}),
					],
				}),
			],
			color: {
				domain: data.map((row) => row.name),
				range: data.map((row) => row.fill),
			},
			tooltip: {
				use: tooltip,
				items: [
					{
						field: "name" as const,
						label: "Category",
					},
					{
						channel: "y" as const,
						label: "Spent",
						text: (point: { yValue: unknown }) =>
							formatCurrency(Number(point.yValue)),
					},
				],
			},
		});
	}, [data]);

	return (
		<Card className="hover:shadow-md transition-shadow min-w-0 overflow-hidden">
			<CardHeader>
				<CardTitle>Spending by Category</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<div className="flex flex-col md:flex-row items-center gap-4">
						<div className="w-full max-w-[350px] mx-auto">
							<Chart
								definition={definition}
								height={350}
								ariaLabel="Spending share by category"
								className={onDataPointClick ? "cursor-pointer" : undefined}
								onSelect={(point) => {
									if (point) onDataPointClick?.(point.datum);
								}}
							/>
						</div>
						<div className="flex flex-wrap gap-2 justify-center">
							{data.map((item) => (
								<button
									key={item.name}
									type="button"
									disabled={!onDataPointClick}
									onClick={() => onDataPointClick?.(item)}
									className={cn(
										"rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
										onDataPointClick &&
											"transition-opacity hover:opacity-75 disabled:opacity-100",
									)}
								>
									<Badge
										variant="secondary"
										className="flex items-center gap-1.5"
									>
										<span
											className="w-2 h-2 rounded-full"
											style={{ backgroundColor: item.fill }}
										/>
										{item.name}
									</Badge>
								</button>
							))}
						</div>
					</div>
				) : (
					<div className="h-[350px] flex items-center justify-center text-muted-foreground">
						No category data available
					</div>
				)}
			</CardContent>
		</Card>
	);
}
