import { describe, expect, it } from "vitest";
import {
	batchImportMessage,
	formatRs,
	singleTransactionMessage,
} from "./notifications";

describe("formatRs", () => {
	it("always shows two decimals and a 'Rs.' prefix", () => {
		expect(formatRs(1200)).toBe("Rs. 1,200.00");
	});

	it("uses Indian/Nepali digit grouping", () => {
		expect(formatRs(150000)).toBe("Rs. 1,50,000.00");
	});

	it("keeps fractional amounts", () => {
		expect(formatRs(1234.5)).toBe("Rs. 1,234.50");
	});
});

describe("singleTransactionMessage", () => {
	it("mimics a debit bank alert with merchant and category", () => {
		expect(
			singleTransactionMessage({
				amount: 1200,
				type: "debit",
				merchant: "KFC",
				category: "Food & Dining",
			}),
		).toEqual({
			title: "Debit alert",
			body: "Rs. 1,200.00 debited at KFC (Food & Dining)",
		});
	});

	it("mimics a credit bank alert with merchant and category", () => {
		expect(
			singleTransactionMessage({
				amount: 50000,
				type: "credit",
				merchant: "ABC Corp",
				category: "Salary",
			}),
		).toEqual({
			title: "Credit alert",
			body: "Rs. 50,000.00 credited from ABC Corp (Salary)",
		});
	});

	it("omits missing merchant and category", () => {
		expect(singleTransactionMessage({ amount: 300, type: "debit" })).toEqual({
			title: "Debit alert",
			body: "Rs. 300.00 debited",
		});
	});
});

describe("batchImportMessage", () => {
	it("summarizes count, totals, and top merchants", () => {
		expect(
			batchImportMessage({
				count: 12,
				totalDebit: 4500,
				totalCredit: 2000,
				topMerchants: ["KFC", "Daraz"],
			}),
		).toEqual({
			title: "Import complete",
			body: "12 transactions imported · Rs. 4,500.00 debited · Rs. 2,000.00 credited · KFC, Daraz +10 more",
		});
	});

	it("handles a single merchant with no remaining", () => {
		expect(
			batchImportMessage({
				count: 1,
				totalDebit: 1200,
				totalCredit: 0,
				topMerchants: ["KFC"],
			}),
		).toEqual({
			title: "Import complete",
			body: "1 transaction imported · Rs. 1,200.00 debited · KFC",
		});
	});
});
