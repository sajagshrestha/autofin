import { describe, expect, it, vi } from "vitest";
import { fetchTransactionHistory } from "./fetch-history";
import type { Transaction } from "./types";

const transaction = (id: number) => ({ id: String(id) }) as Transaction;
const page = (ids: number[], total: number, offset = 0) => ({
	transactions: ids.map(transaction),
	total,
	limit: 500,
	offset,
});
describe("complete transaction history", () => {
	it("loads beyond 500 records using the number actually received", async () => {
		const fetchPage = vi
			.fn()
			.mockResolvedValueOnce(
				page(
					Array.from({ length: 500 }, (_, i) => i),
					501,
				),
			)
			.mockResolvedValueOnce(page([500], 501, 500));
		const result = await fetchTransactionHistory(fetchPage);
		expect(fetchPage.mock.calls).toEqual([[0], [500]]);
		expect(result.transactions).toHaveLength(501);
	});
	it("handles an empty date range without requesting more", async () => {
		const fetchPage = vi.fn().mockResolvedValue(page([], 0));
		expect((await fetchTransactionHistory(fetchPage)).transactions).toEqual([]);
		expect(fetchPage).toHaveBeenCalledTimes(1);
	});
	it("does not silently truncate or loop when the server returns an incomplete page", async () => {
		const fetchPage = vi
			.fn()
			.mockResolvedValueOnce(page([1], 2))
			.mockResolvedValueOnce(page([], 2, 1));
		await expect(fetchTransactionHistory(fetchPage)).rejects.toThrow(
			"incomplete",
		);
		expect(fetchPage).toHaveBeenCalledTimes(2);
	});
	it("deduplicates overlapping pages", async () => {
		const fetchPage = vi
			.fn()
			.mockResolvedValueOnce(page([1, 2], 4))
			.mockResolvedValueOnce(page([2, 3], 4, 2));
		expect(
			(await fetchTransactionHistory(fetchPage)).transactions.map(
				(row) => row.id,
			),
		).toEqual(["1", "2", "3"]);
	});
});
