import { isTaxCategory } from "./transaction-filters";

type DashboardTransaction = {
	amount: string;
	type: "debit" | "credit";
	loanId?: string | null;
	category?: { name: string } | null;
};
type DashboardFilters = { excludeLoans: boolean; excludeTax: boolean };

/** Move excluded tax payments from expenses to a deduction from income. */
export function dashboardTransactionAmounts(
	transaction: DashboardTransaction,
	filters: DashboardFilters,
) {
	if (filters.excludeLoans && transaction.loanId)
		return { income: 0, expenses: 0, count: 0 };
	const amount = parseFloat(transaction.amount || "0");
	if (filters.excludeTax && isTaxCategory(transaction.category?.name))
		return {
			income: transaction.type === "debit" ? -amount : 0,
			expenses: 0,
			count: 0,
		};
	return {
		income: transaction.type === "credit" ? amount : 0,
		expenses: transaction.type === "debit" ? amount : 0,
		count: 1,
	};
}

export function summarizeDashboardTransactions(
	transactions: DashboardTransaction[],
	filters: DashboardFilters,
) {
	let totalIncome = 0;
	let totalExpenses = 0;
	let transactionCount = 0;
	for (const transaction of transactions) {
		const amounts = dashboardTransactionAmounts(transaction, filters);
		totalIncome += amounts.income;
		totalExpenses += amounts.expenses;
		transactionCount += amounts.count;
	}
	return {
		totalIncome,
		totalExpenses,
		savings: totalIncome - totalExpenses,
		transactionCount,
	};
}
