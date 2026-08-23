/** Fixed chart palette — saturated mid-tones that read well in light & dark themes. */
export const CHART_COLORS = [
	"#2563eb", // blue
	"#16a34a", // green
	"#f59e0b", // amber
	"#dc2626", // red
	"#9333ea", // violet
	"#0d9488", // teal
	"#ea580c", // orange
	"#db2777", // pink
	"#65a30d", // lime
	"#4f46e5", // indigo
] as const;

export const LINE_COLOR = "#3b82f6";
export const INCOME_COLOR = "#22c55e";
export const EXPENSES_COLOR = "#ef4444";
export const BAR_PRIMARY = "#2563eb";
export const BAR_SECONDARY = "#6366f1";

export function pickChartColor(index: number): string {
	return CHART_COLORS[index % CHART_COLORS.length];
}
