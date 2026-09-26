import type { Transaction } from "./types";

export interface TransactionPage {
	transactions: Transaction[];
	total: number;
	limit: number;
	offset: number;
}

/** Load the complete date range so local search and sorting see every record. */
export async function fetchTransactionHistory(
	fetchPage: (offset: number) => Promise<TransactionPage>,
): Promise<TransactionPage> {
	let page = await fetchPage(0);
	const transactions = [...page.transactions];
	let offset = page.transactions.length;
	while (offset < page.total) {
		page = await fetchPage(offset);
		if (!page.transactions.length) {
			if (offset >= page.total) break;
			throw new Error("Transaction history is incomplete. Please try again.");
		}
		transactions.push(...page.transactions);
		offset += page.transactions.length;
	}
	return {
		...page,
		transactions: [
			...new Map(
				transactions.map((transaction) => [transaction.id, transaction]),
			).values(),
		],
		offset: 0,
		limit: transactions.length,
	};
}
