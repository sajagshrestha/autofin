import { isTaxCategory } from "./transaction-filters";

type DashboardTransaction = {
	id?: string;
	amount: string;
	type: "debit" | "credit";
	loanId?: string | null;
	loanDirection?: "given" | "taken" | null;
	loanOriginTransactionId?: string | null;
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
	let savings = 0;
	for (const transaction of transactions) {
		const amounts = dashboardTransactionAmounts(transaction, filters);
		totalIncome += amounts.income;
		totalExpenses += amounts.expenses;
		transactionCount += amounts.count;
		savings += dashboardTransactionSavings(transaction, filters);
	}
	return {
		totalIncome,
		totalExpenses,
		savings,
		transactionCount,
	};
}

/** Exclude loan transfers from savings, but retain repayments of borrowed money. */
export function dashboardTransactionSavings(
	transaction: DashboardTransaction,
	filters: DashboardFilters,
) {
	const isOwnLoanRepayment =
		!!transaction.loanId &&
		transaction.loanDirection === "taken" &&
		transaction.type === "debit" &&
		(!transaction.loanOriginTransactionId ||
			transaction.id !== transaction.loanOriginTransactionId);
	const amounts = dashboardTransactionAmounts(transaction, {
		...filters,
		excludeLoans: filters.excludeLoans && !isOwnLoanRepayment,
	});
	return amounts.income - amounts.expenses;
}
