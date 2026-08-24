/**
 * Fixed chart palette — Geist design system colors (vercel.com/geist/colors).
 * Mid-tones (600–700) chosen to read well in light & dark themes.
 */
export const CHART_COLORS = [
	"#0072f5", // blue-700
	"#45a557", // green-700
	"#ffb224", // amber-700
	"#e5484d", // red-700
	"#8e4ec6", // purple-700
	"#12a594", // teal-700
	"#f5b047", // amber-600
	"#ea3e83", // pink-700
	"#52a8ff", // blue-900
	"#62c073", // green-900
] as const;

export const LINE_COLOR = "#0072f5"; // blue-700
export const INCOME_COLOR = "#45a557"; // green-700
export const EXPENSES_COLOR = "#e5484d"; // red-700
export const BAR_PRIMARY = "#0072f5"; // blue-700
export const BAR_SECONDARY = "#8e4ec6"; // purple-700

export function pickChartColor(index: number): string {
	return CHART_COLORS[index % CHART_COLORS.length];
}
