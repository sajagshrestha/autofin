const AMOUNT_FORMATTER = new Intl.NumberFormat("en-IN", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

/**
 * Bank-alert style NPR amount: "Rs. 1,200.00", "Rs. 1,23,456.00".
 */
export function formatRs(value: number): string {
	return `Rs. ${AMOUNT_FORMATTER.format(value)}`;
}

export interface TransactionNotification {
	amount: number;
	type: "debit" | "credit";
	merchant?: string | null;
	category?: string | null;
}

/**
 * Copy that mimics a bank SMS alert:
 * "Rs. 1,200.00 debited at KFC (Food & Dining)"
 * "Rs. 50,000.00 credited from ABC Corp (Salary)"
 */
export function singleTransactionMessage(txn: TransactionNotification): {
	title: string;
	body: string;
} {
	const verb = txn.type === "credit" ? "credited" : "debited";
	const from = txn.type === "credit" ? "from" : "at";

	const parts = [`${formatRs(txn.amount)} ${verb}`];
	if (txn.merchant) parts.push(`${from} ${txn.merchant}`);
	if (txn.category) parts.push(`(${txn.category})`);

	return {
		title: txn.type === "credit" ? "Credit alert" : "Debit alert",
		body: parts.join(" "),
	};
}

/**
 * Batch import summary:
 * "12 transactions imported · Rs. 4,500.00 debited · Rs. 2,000.00 credited · KFC, Daraz +10 more"
 */
export function batchImportMessage(args: {
	count: number;
	totalDebit: number;
	totalCredit: number;
	topMerchants: string[];
}): { title: string; body: string } {
	const parts = [
		`${args.count} transaction${args.count !== 1 ? "s" : ""} imported`,
	];
	if (args.totalDebit > 0) parts.push(`${formatRs(args.totalDebit)} debited`);
	if (args.totalCredit > 0)
		parts.push(`${formatRs(args.totalCredit)} credited`);
	if (args.topMerchants.length > 0) {
		const extra = args.count - args.topMerchants.length;
		parts.push(
			`${args.topMerchants.join(", ")}${extra > 0 ? ` +${extra} more` : ""}`,
		);
	}

	return { title: "Import complete", body: parts.join(" · ") };
}
