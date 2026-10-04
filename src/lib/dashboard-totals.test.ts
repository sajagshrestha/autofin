import { describe, expect, it } from "vitest";
import { summarizeDashboardTransactions } from "./dashboard-totals";

const transactions = [
	{ amount: "1000", type: "credit" as const, category: { name: "Salary" } },
	{ amount: "100", type: "debit" as const, category: { name: "Income Tax" } },
	{ amount: "200", type: "debit" as const, category: { name: "Food" } },
	{
		amount: "30",
		type: "debit" as const,
		category: { name: "Tax" },
		loanId: "loan",
	},
];

describe("dashboard tax deductions", () => {
	it("deducts tax from income without counting it twice in savings", () => {
		expect(
			summarizeDashboardTransactions(transactions, {
				excludeLoans: true,
				excludeTax: true,
			}),
		).toEqual({
			totalIncome: 900,
			totalExpenses: 200,
			savings: 700,
			transactionCount: 2,
		});
	});
	it("restores gross income, tax expenses, and count when tax exclusion is off", () => {
		expect(
			summarizeDashboardTransactions(transactions, {
				excludeLoans: true,
				excludeTax: false,
			}),
		).toEqual({
			totalIncome: 1000,
			totalExpenses: 300,
			savings: 700,
			transactionCount: 3,
		});
	});
	it("honors the loan filter before calculating the tax deduction", () => {
		expect(
			summarizeDashboardTransactions(transactions, {
				excludeLoans: false,
				excludeTax: true,
			}),
		).toEqual({
			totalIncome: 870,
			totalExpenses: 200,
			savings: 670,
			transactionCount: 2,
		});
	});
	it("retains tax-only deductions even when no transactions are counted", () => {
		expect(
			summarizeDashboardTransactions([transactions[1]], {
				excludeLoans: true,
				excludeTax: true,
			}),
		).toEqual({
			totalIncome: -100,
			totalExpenses: 0,
			savings: -100,
			transactionCount: 0,
		});
	});
});
