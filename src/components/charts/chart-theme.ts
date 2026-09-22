import { useEffect, useState } from "react";

/**
 * Dashboard-driven chart palette, resolved live from CSS tokens.
 *
 * Charts read the same tokens the dashboard cards use (`--chart-1…5` for
 * categories, `--ds-green-700`/`--ds-red-700` for income/expenses), so they
 * automatically follow the active appearance (light/dark) and named theme
 * (default/midnight/ocean/forest). Finance semantics (green = good,
 * red = bad) stay consistent across themes, matching `__root.css`.
 */

export type ChartTheme = {
	/** Category colors, cycling order. Grey last = "Other"/"Uncategorized". */
	categorical: string[];
	income: string;
	expenses: string;
	/** Line + single-hue bar color. */
	accent: string;
};

const CATEGORICAL_VARS = [
	"--chart-1",
	"--chart-2",
	"--chart-3",
	"--chart-4",
	"--chart-5",
	"--ds-pink-700",
	"--ds-blue-900",
] as const;
const INCOME_VAR = "--ds-green-700";
const EXPENSES_VAR = "--ds-red-700";
const ACCENT_VAR = "--chart-1";
const OTHER_COLOR = "#999999";

/** Static fallback (default light theme), also used for SSR first paint. */
export const CHART_COLORS = [
	"#0072f5",
	"#45a557",
	"#ffb224",
	"#8e4ec6",
	"#12a594",
	"#ea3e83",
	"#52a8ff",
	"#999999",
] as const;

export const LINE_COLOR = CHART_COLORS[0];
export const INCOME_COLOR = "#45a557";
export const EXPENSES_COLOR = "#e5484d";
export const BAR_PRIMARY = CHART_COLORS[0];
export const BAR_SECONDARY = CHART_COLORS[0];

const FALLBACK_THEME: ChartTheme = {
	categorical: [...CHART_COLORS],
	income: INCOME_COLOR,
	expenses: EXPENSES_COLOR,
	accent: LINE_COLOR,
};

/**
 * Normalize a computed custom-property value for canvas/SVG use.
 * `getComputedStyle` returns tokens verbatim (e.g. `hsl(212 100% 48%)`);
 * space-separated `hsl()` is rewritten to the widely-supported comma form.
 */
function normalizeColor(value: string, fallback: string): string {
	const v = value.trim();
	if (!v) return fallback;
	const spaceHsl = /^hsl\(\s*([\d.]+)\s+([\d.]+%)\s+([\d.]+%)\s*\)$/i.exec(v);
	if (spaceHsl) return `hsl(${spaceHsl[1]}, ${spaceHsl[2]}, ${spaceHsl[3]})`;
	return v;
}

function readVar(name: string, fallback: string): string {
	if (typeof window === "undefined") return fallback;
	const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
	return normalizeColor(raw, fallback);
}

function resolveChartTheme(): ChartTheme {
	return {
		categorical: [
			...CATEGORICAL_VARS.map((name, i) =>
				readVar(name, CHART_COLORS[i] ?? OTHER_COLOR),
			),
			OTHER_COLOR,
		],
		income: readVar(INCOME_VAR, INCOME_COLOR),
		expenses: readVar(EXPENSES_VAR, EXPENSES_COLOR),
		accent: readVar(ACCENT_VAR, LINE_COLOR),
	};
}

/**
 * Live chart palette for the current theme context. Re-resolves whenever the
 * `<html>` class, `data-theme`, or inline style changes (i.e. any appearance
 * or named-theme switch).
 */
export function useChartTheme(): ChartTheme {
	const [theme, setTheme] = useState<ChartTheme>(FALLBACK_THEME);

	useEffect(() => {
		setTheme(resolveChartTheme());
		const observer = new MutationObserver(() => {
			setTheme(resolveChartTheme());
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme", "style"],
		});
		return () => observer.disconnect();
	}, []);

	return theme;
}

export function pickChartColor(
	palette: readonly string[],
	index: number,
): string {
	return palette[index % palette.length];
}
