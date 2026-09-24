import type { Category } from "@/hooks/categories/types";
import type { Loan } from "@/hooks/loans/types";
import type { Transaction } from "@/hooks/transactions/types";

export function createDemoData(now = new Date()) {
	const month = new Date(now.getFullYear(), now.getMonth(), 1, 12);
	const categories: Category[] = [
		["groceries", "Groceries", "🛒"],
		["dining", "Food & dining", "🍜"],
		["transport", "Transport", "🚌"],
		["shopping", "Shopping", "🛍️"],
		["health", "Health", "💚"],
		["rent", "Rent", "🏠"],
		["income", "Income", "💰"],
	].map(([id, name, icon]) => ({
		id,
		name,
		icon,
		userId: "demo",
		isDefault: false,
		isAiCreated: true,
		createdAt: month.toISOString(),
	}));
	const transactions: Transaction[] = [];
	const merchants = [
		"Fresh Mart",
		"The Corner Café",
		"City Rides",
		"Everyday Store",
		"Wellness Pharmacy",
	];
	const add = (
		id: string,
		amount: number,
		date: Date,
		categoryIndex: number,
		merchant: string,
		type: "debit" | "credit" = "debit",
	) => {
		const category = categories[categoryIndex];
		transactions.push({
			id,
			userId: "demo",
			categoryId: category.id,
			amount: String(amount),
			type,
			currency: "NPR",
			merchant,
			accountNumber: "****1234",
			bankName: "Sample Bank",
			transactionDate: date.toISOString(),
			remarks: `${category.name} · imported from a sample bank alert`,
			notes: null,
			isAiCreated: true,
			aiConfidence: "0.96",
			createdAt: date.toISOString(),
			updatedAt: date.toISOString(),
			category,
		});
	};
	for (let offset = 5; offset >= 0; offset--) {
		const start = new Date(
			month.getFullYear(),
			month.getMonth() - offset,
			1,
			12,
		);
		const days =
			offset === 0
				? now.getDate()
				: new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
		const prefix = `${start.getFullYear()}-${start.getMonth()}`;
		add(`${prefix}-salary`, 95000, start, 6, "Monthly salary", "credit");
		add(`${prefix}-rent`, 18000, start, 5, "Monthly rent");
		for (let day = 1; day <= days; day++) {
			const date = new Date(start.getFullYear(), start.getMonth(), day, 10);
			const i = (day + offset) % 5;
			add(
				`${prefix}-${day}`,
				[1850, 650, 350, 2400, 850][i] + ((day * 37) % 250),
				date,
				i,
				merchants[i],
			);
		}
	}
	transactions.sort((a, b) =>
		(b.transactionDate ?? "").localeCompare(a.transactionDate ?? ""),
	);
	const loans: Loan[] = [
		{
			id: "demo-loan",
			direction: "given",
			counterparty: { id: "demo-counterparty", name: "Alex" },
			counterpartyName: "Alex",
			principalAmount: "10000",
			currency: "NPR",
			issuedDate: month.toISOString(),
			dueDate: null,
			notes: "Shared trip expenses",
			originTransactionId: null,
			settledAmount: 4000,
			remainingAmount: 6000,
			settlementCount: 1,
			status: "outstanding",
			isOverdue: false,
			createdAt: month.toISOString(),
		},
	];
	return { transactions, categories, loans };
}

export type DemoData = ReturnType<typeof createDemoData>;
