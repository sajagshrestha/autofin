import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { z } from "zod";
export const BUDGET_TIMEZONE = "Asia/Kathmandu";
export const budgetMonthSchema = z.string().regex(/^20\d{2}-(0[1-9]|1[0-2])$/);
export const budgetInputSchema = z.object({
	mode: z.enum(["fixed", "dynamic"]).default("dynamic"),
	categoryId: z.string().min(1),
	bucket: z.enum(["needs", "wants", "unassigned"]).default("unassigned"),
	amount: z.number().positive().max(9999999999.99).multipleOf(0.01),
	notifications: z.boolean().default(true),
	thresholds: z
		.array(z.number().int().min(1).max(1000))
		.min(1)
		.max(10)
		.default([80, 100])
		.transform((v) => [...new Set(v)].sort((a, b) => a - b)),
});
export type BudgetInput = z.input<typeof budgetInputSchema>;
export function currentBudgetMonth(now = new Date()) {
	return formatInTimeZone(now, BUDGET_TIMEZONE, "yyyy-MM");
}
export function shiftBudgetMonth(month: string, offset: number) {
	const [year, m] = month.split("-").map(Number);
	return new Date(Date.UTC(year, m - 1 + offset, 1)).toISOString().slice(0, 7);
}
export function budgetMonthStart(month: string) {
	return fromZonedTime(`${month}-01T00:00:00`, BUDGET_TIMEZONE);
}
export function budgetTransactionsSearch(
	categoryId: string,
	month = currentBudgetMonth(),
) {
	return {
		period: "monthly" as const,
		startDate: budgetMonthStart(month).toISOString(),
		endDate: new Date(
			budgetMonthStart(shiftBudgetMonth(month, 1)).getTime() - 1,
		).toISOString(),
		type: "debit" as const,
		category: categoryId,
		bank: "",
		excludeLoans: false,
	};
}
export function crossedThresholds(
	spent: number,
	limit: number,
	thresholds: number[],
) {
	return thresholds.filter(
		(t) => Math.round(spent * 100) * 100 >= Math.round(limit * 100) * t,
	);
}
export function effectiveBudgets<
	T extends { categoryId: string; month: string; enabled: boolean },
>(versions: T[], month: string): T[] {
	const latest = new Map<string, T>();
	for (const v of versions)
		if (v.month <= month && (latest.get(v.categoryId)?.month ?? "") < v.month)
			latest.set(v.categoryId, v);
	return [...latest.values()].filter((v) => v.enabled);
}
export type BudgetBucket = "needs" | "wants" | "unassigned";
export const BUDGET_GROUPS = [
	{
		key: "needs",
		label: "Needs",
		description: "Essentials and fixed payments",
	},
	{
		key: "wants",
		label: "Wants",
		description: "Flexible and discretionary spending",
	},
	{
		key: "unassigned",
		label: "Unassigned",
		description: "Edit these budgets to choose Needs or Wants",
	},
] as const;
export function groupBudgets<T extends { bucket?: string }>(items: T[]) {
	return BUDGET_GROUPS.map((group) => ({
		...group,
		items: items.filter((item) => (item.bucket ?? "unassigned") === group.key),
	})).filter((group) => group.items.length > 0);
}
export interface BudgetRow {
	mode?: "fixed" | "dynamic";
	bucket?: BudgetBucket;
	categoryId: string;
	name: string;
	amount: number;
	spent: number;
	notifications: boolean;
	thresholds: number[];
	stopping: boolean;
}
export interface BudgetList {
	budgets: BudgetRow[];
	firstMonth: string;
}
export interface BudgetProposal {
	mode?: "fixed" | "dynamic";
	latestMonthly?: number;
	latestMonth?: string;
	bucket?: "needs" | "wants";
	categoryId: string;
	name: string;
	average: number;
	amount: number;
	explanation: string;
}
