import { describe, expect, it } from "vitest";
import {
	budgetInputSchema,
	budgetTransactionsSearch,
	budgetMonthStart,
	crossedThresholds,
	currentBudgetMonth,
	effectiveBudgets,
	shiftBudgetMonth,
} from "./budgets";

describe("calendar budgets", () => {
	it("uses Nepal midnight rather than UTC for month boundaries", () => {
		expect(currentBudgetMonth(new Date("2026-09-30T18:14:59Z"))).toBe(
			"2026-09",
		);
		expect(currentBudgetMonth(new Date("2026-09-30T18:15:00Z"))).toBe(
			"2026-10",
		);
		expect(budgetMonthStart("2026-10").toISOString()).toBe(
			"2026-09-30T18:15:00.000Z",
		);
		expect(shiftBudgetMonth("2026-12", 1)).toBe("2027-01");
		expect(shiftBudgetMonth("2026-01", -1)).toBe("2025-12");
	});
	it("preserves old limits, repeats across skipped months and stops next month", () => {
		const versions = [
			{ categoryId: "food", month: "2026-01", enabled: true, amount: 100 },
			{ categoryId: "food", month: "2026-04", enabled: true, amount: 200 },
			{ categoryId: "food", month: "2026-05", enabled: false, amount: 200 },
		];
		expect(effectiveBudgets(versions, "2025-12")).toEqual([]);
		expect(effectiveBudgets(versions, "2026-03")[0].amount).toBe(100);
		expect(effectiveBudgets(versions, "2026-04")[0].amount).toBe(200);
		expect(effectiveBudgets(versions, "2026-08")).toEqual([]);
	});
	it("combines crossed thresholds, including exact boundaries", () => {
		expect(crossedThresholds(79.99, 100, [80, 100])).toEqual([]);
		expect(crossedThresholds(80, 100, [80, 100])).toEqual([80]);
		expect(crossedThresholds(120, 100, [80, 100])).toEqual([80, 100]);
	});
	it("validates limits and normalizes notification thresholds", () => {
		expect(
			budgetInputSchema.parse({
				categoryId: "food",
				amount: 100,
				thresholds: [100, 80, 80],
			}).thresholds,
		).toEqual([80, 100]);
		for (const amount of [0, -1, Infinity, 1.234])
			expect(
				budgetInputSchema.safeParse({ categoryId: "food", amount }).success,
			).toBe(false);
		expect(
			budgetInputSchema.safeParse({
				categoryId: "food",
				amount: 1,
				thresholds: [0],
			}).success,
		).toBe(false);
	});
});

describe("budget grouping", () => {
	it("keeps needs and wants separate and preserves unclassified budgets", async () => {
		const { groupBudgets } = await import("./budgets");
		const rows = [
			{ categoryId: "fun", bucket: "wants" },
			{ categoryId: "rent", bucket: "needs" },
			{ categoryId: "old" },
		];
		expect(
			groupBudgets(rows).map((g) => ({
				key: g.key,
				ids: g.items.map((i) => i.categoryId),
			})),
		).toEqual([
			{ key: "needs", ids: ["rent"] },
			{ key: "wants", ids: ["fun"] },
			{ key: "unassigned", ids: ["old"] },
		]);
	});
	it("accepts and preserves classifications when saving", () => {
		expect(
			budgetInputSchema.parse({
				categoryId: "rent",
				amount: 25000,
				bucket: "needs",
			}).bucket,
		).toBe("needs");
		expect(
			budgetInputSchema.safeParse({
				categoryId: "rent",
				amount: 25000,
				bucket: "invalid",
			}).success,
		).toBe(false);
	});
});

it("links budget categories to matching Nepal calendar-month expenses", () => {
	expect(budgetTransactionsSearch("rent", "2026-09")).toEqual({
		period: "monthly",
		startDate: "2026-08-31T18:15:00.000Z",
		endDate: "2026-09-30T18:14:59.999Z",
		category: "rent",
		type: "debit",
		bank: "",
		excludeLoans: false,
	});
});
