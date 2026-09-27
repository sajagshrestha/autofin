import { PgDialect } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import {
	budgetAnalysisFilter,
	protectFixedCostProposals,
} from "./budget-analysis";

describe("budget analysis exclusions", () => {
	it("excludes linked loans and named tax or loan categories and excludes Others and uncategorized transactions", () => {
		const query = new PgDialect().sqlToQuery(budgetAnalysisFilter).sql;
		expect(query).toContain("t.loan_id IS NULL");
		expect(query).toContain("t.category_id IS NOT NULL");
		expect(query).toContain("c.id IS NOT NULL");
		expect(query).toContain("others?|uncategori[sz]ed");
		expect(query).toContain("COALESCE(c.name, '') !~*");
		expect(query).toContain("tax(es|ation)?|vat|tds|others?");
	});
});
describe("fixed rent protection", () => {
	const rows = [
		{
			categoryId: "rent",
			name: "Monthly rent",
			average: "8333.33",
			latestMonthly: "25000",
		},
	];
	it("does not divide a single recorded rent payment by three months", () => {
		const proposals = [
			{ categoryId: "rent", amount: 8300, explanation: "Average" },
		];
		expect(protectFixedCostProposals(proposals, rows)[0].amount).toBe(25000);
		expect(proposals[0].amount).toBe(8300);
	});
	it("preserves a higher suggested rent amount", () => {
		expect(
			protectFixedCostProposals(
				[{ categoryId: "rent", amount: 26000, explanation: "Increase" }],
				rows,
			)[0].amount,
		).toBe(26000);
	});
	it("does not silently drop rent to satisfy a savings goal", () => {
		expect(() => protectFixedCostProposals([], rows)).toThrow(
			"omitted a fixed rent or loan category",
		);
	});
	it("does not treat variable categories as fixed rent", () => {
		expect(
			protectFixedCostProposals(
				[{ categoryId: "food", amount: 100, explanation: "Cut back" }],
				[
					{
						categoryId: "food",
						name: "Food",
						average: "300",
						latestMonthly: "500",
					},
				],
			)[0].amount,
		).toBe(100);
	});
});

it("protects loan-category payments just like rent", () => {
	expect(
		protectFixedCostProposals(
			[{ categoryId: "loan", amount: 100, explanation: "average" }],
			[
				{
					categoryId: "loan",
					name: "Loan repayment",
					average: "100",
					latestMonthly: "600",
				},
			],
		)[0].amount,
	).toBe(600);
	const query = new PgDialect().sqlToQuery(budgetAnalysisFilter).sql;
	expect(query).not.toContain("loans?");
});
