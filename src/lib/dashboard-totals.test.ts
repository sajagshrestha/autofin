import { describe, expect, it } from "vitest";
import {
	dashboardTransactionSavings,
	summarizeDashboardTransactions,
} from "./dashboard-totals";

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
	it.each([true, false])(
		"excludes linked debits and credits from savings when toggled (excludeTax=%s)",
		(excludeTax) => {
			const entries = [
				...transactions.slice(0, 3),
				{ amount: "300", type: "debit" as const, loanId: "loan" },
				{ amount: "100", type: "credit" as const, loanId: "loan" },
			];
			const included = summarizeDashboardTransactions(entries, {
				excludeLoans: false,
				excludeTax,
			});
			const excluded = summarizeDashboardTransactions(entries, {
				excludeLoans: true,
				excludeTax,
			});
			expect(excluded.savings).toBe(700);
			expect(included.savings).toBe(500);
			expect(excluded.savings).toBe(
				excluded.totalIncome - excluded.totalExpenses,
			);
			expect(included.savings).toBe(
				included.totalIncome - included.totalExpenses,
			);
			expect(included.totalIncome - excluded.totalIncome).toBe(100);
			expect(included.totalExpenses - excluded.totalExpenses).toBe(300);
			expect(included.transactionCount - excluded.transactionCount).toBe(2);
		},
	);
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
	it.each([true, false])(
		"monthly savings uses the same loan filter (excludeTax=%s)",
		(excludeTax) => {
			const entries = [
				...transactions,
				{ amount: "300", type: "debit" as const, loanId: "loan" },
				{ amount: "100", type: "credit" as const, loanId: "loan" },
			];
			for (const excludeLoans of [true, false]) {
				const filters = { excludeLoans, excludeTax };
				const monthlySavings = entries.reduce(
					(sum, transaction) =>
						sum + dashboardTransactionSavings(transaction, filters),
					0,
				);
				expect(monthlySavings).toBe(excludeLoans ? 700 : 470);
				expect(monthlySavings).toBe(
					summarizeDashboardTransactions(entries, filters).savings,
				);
			}
		},
	);
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

const loanTransactions = [
	{
		id: "lent",
		amount: "300",
		type: "debit" as const,
		loanId: "given",
		loanDirection: "given" as const,
		loanOriginTransactionId: "lent",
	},
	{
		id: "received",
		amount: "100",
		type: "credit" as const,
		loanId: "given",
		loanDirection: "given" as const,
		loanOriginTransactionId: "lent",
	},
	{
		id: "borrowed",
		amount: "500",
		type: "credit" as const,
		loanId: "taken",
		loanDirection: "taken" as const,
		loanOriginTransactionId: "borrowed",
	},
	{
		id: "repaid",
		amount: "150",
		type: "debit" as const,
		loanId: "taken",
		loanDirection: "taken" as const,
		loanOriginTransactionId: "borrowed",
	},
];

describe("savings loan classification", () => {
	it.each([true, false])(
		"deducts own repayments while excluding other loan flows (excludeTax=%s)",
		(excludeTax) => {
			const filters = { excludeLoans: true, excludeTax };
			const entries = [...transactions.slice(0, 3), ...loanTransactions];
			const summary = summarizeDashboardTransactions(entries, filters);
			expect(summary.savings).toBe(550);
			expect(summary.totalIncome - summary.totalExpenses).toBe(700);
			expect(
				loanTransactions.map((transaction) =>
					dashboardTransactionSavings(transaction, filters),
				),
			).toEqual([0, 0, 0, -150]);
			expect(
				entries.reduce(
					(sum, transaction) =>
						sum + dashboardTransactionSavings(transaction, filters),
					0,
				),
			).toBe(summary.savings);
		},
	);
	it("includes all loan flows when exclusion is off", () => {
		const filters = { excludeLoans: false, excludeTax: false };
		expect(
			loanTransactions.map((transaction) =>
				dashboardTransactionSavings(transaction, filters),
			),
		).toEqual([-300, 100, 500, -150]);
	});
	it("deducts repayments on loans without a recorded origin", () => {
		expect(
			dashboardTransactionSavings(
				{ ...loanTransactions[3], loanOriginTransactionId: null },
				{ excludeLoans: true, excludeTax: true },
			),
		).toBe(-150);
	});
	it("does not treat an origin changed to debit as a repayment", () => {
		expect(
			dashboardTransactionSavings(
				{ ...loanTransactions[2], type: "debit" },
				{ excludeLoans: true, excludeTax: true },
			),
		).toBe(0);
	});
	it("keeps unclassified linked transactions excluded", () => {
		expect(
			dashboardTransactionSavings(
				{ ...loanTransactions[3], loanDirection: null },
				{ excludeLoans: true, excludeTax: true },
			),
		).toBe(0);
	});
});
