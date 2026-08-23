import { defineChart } from "@tanstack/charts";
import { pie, polar, radialArc } from "@tanstack/charts/polar";
import { Chart } from "@tanstack/charts/react";
import { tooltip } from "@tanstack/charts/tooltip";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";

export type CategoryPieDataPoint = {
	name: string;
	value: number;
	icon?: string | null;
	fill: string;
};

type CategoryPieChartProps = {
	data: CategoryPieDataPoint[];
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
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
							/>
						</div>
						<div className="flex flex-wrap gap-2 justify-center">
							{data.map((item) => (
								<Badge
									key={item.name}
									variant="secondary"
									className="flex items-center gap-1.5"
								>
									<span
										className="w-2 h-2 rounded-full"
										style={{ backgroundColor: item.fill }}
									/>
									{item.name}
								</Badge>
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
