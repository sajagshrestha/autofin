import { ChartBar, ChartPie } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CategoryBarChartContent,
	type CategoryBarDataPoint,
} from "./CategoryBarChart";
import { CategoryPieChartContent } from "./CategoryPieChart";

export type CategorySpendingDataPoint = CategoryBarDataPoint;

type CategorySpendingChartProps = {
	data: CategorySpendingDataPoint[];
	/** Fired when a category is clicked or keyboard-activated. */
	onDataPointClick?: (point: CategorySpendingDataPoint) => void;
};

export function CategorySpendingChart({
	data,
	onDataPointClick,
}: CategorySpendingChartProps) {
	const [view, setView] = useState<"bar" | "pie">("bar");

	return (
		<Card className="hover:shadow-md transition-shadow min-w-0 overflow-hidden">
			<Tabs
				value={view}
				onValueChange={(value) => setView(value as "bar" | "pie")}
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<CardTitle>Spending by Category</CardTitle>
					<TabsList>
						<TabsTrigger value="bar" aria-label="Bar chart">
							<ChartBar className="h-4 w-4" />
						</TabsTrigger>
						<TabsTrigger value="pie" aria-label="Pie chart">
							<ChartPie className="h-4 w-4" />
						</TabsTrigger>
					</TabsList>
				</CardHeader>
				<CardContent>
					<TabsContent value="bar" className="mt-0">
						<CategoryBarChartContent
							data={data}
							onDataPointClick={onDataPointClick}
						/>
					</TabsContent>
					<TabsContent value="pie" className="mt-0">
						<CategoryPieChartContent
							data={data}
							onDataPointClick={onDataPointClick}
						/>
					</TabsContent>
				</CardContent>
			</Tabs>
		</Card>
	);
}
