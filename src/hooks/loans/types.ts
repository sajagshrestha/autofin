export type LoanDirection = "given" | "taken";
export type LoanStatus = "outstanding" | "settled" | "overpaid";

/** A tracked loan with derived settlement stats (amounts are NPR). */
export interface Loan {
	id: string;
	direction: LoanDirection;
	counterpartyName: string;
	principalAmount: string;
	currency: string | null;
	issuedDate: string;
	dueDate: string | null;
	notes: string | null;
	originTransactionId: string | null;
	settledAmount: number;
	remainingAmount: number;
	settlementCount: number;
	status: LoanStatus;
	isOverdue: boolean;
	createdAt: string;
}

/** A repayment transaction linked to a loan. */
export interface LoanSettlement {
	id: string;
	amount: string;
	type: "debit" | "credit";
	currency: string | null;
	transactionDate: string | null;
	merchant: string | null;
	remarks: string | null;
	category: { name: string; icon: string | null } | null;
	createdAt: string;
}

export interface CreateLoanInput {
	counterpartyName: string;
	direction: LoanDirection;
	principalAmount?: number;
	issuedDate?: string;
	dueDate?: string;
	notes?: string;
	originTransactionId?: string;
	createTransaction?: boolean;
	transactionDate?: string;
	categoryId?: string;
}
