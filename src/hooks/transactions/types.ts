/** Category info embedded in transaction rows. */
export interface TransactionCategoryInfo {
	id: string;
	name: string;
	icon: string | null;
}

/** A transaction as returned by the API (dates are ISO strings). */
export interface Transaction {
	id: string;
	userId: string;
	categoryId: string | null;
	/** Stored as numeric in DB, returned as string. */
	amount: string;
	type: "debit" | "credit";
	currency: string | null;
	merchant: string | null;
	accountNumber: string | null;
	bankName: string | null;
	transactionDate: string | null;
	remarks: string | null;
	emailId?: string | null;
	rawEmailContent?: string | null;
	aiConfidence?: string | null;
	isAiCreated: boolean;
	createdAt: string;
	updatedAt: string;
	category?: TransactionCategoryInfo | null;
}

export type TransactionType = "debit" | "credit";

/** Reference to an existing transaction that looks like a duplicate. */
export interface DuplicateRef {
	id: string;
	amount: string;
	type: string;
	transactionDate: string | null;
	merchant: string | null;
}

/** Query filters accepted by GET /api/transactions. */
export interface ListTransactionsFilters {
	categoryId?: string;
	type?: "debit" | "credit";
	startDate?: string;
	endDate?: string;
	timezone?: string;
	minAmount?: number;
	maxAmount?: number;
	limit?: number;
	offset?: number;
}

export type UpdateTransactionBody = {
	categoryId?: string;
	merchant?: string;
	remarks?: string;
	transactionDate?: string;
};

/** Form values for editing a transaction. */
export type EditTransactionFormValues = {
	merchant: string;
	categoryId: string;
	remarks: string;
};

/** Map edit-form values to an update payload (`id` added by callers). */
export function mapEditFormToUpdateBody(
	values: EditTransactionFormValues,
): UpdateTransactionBody {
	return {
		merchant: values.merchant || undefined,
		categoryId: values.categoryId || undefined,
		remarks: values.remarks || undefined,
	};
}

export type CreateTransactionBody = {
	amount: number;
	type: "debit" | "credit";
	categoryId?: string;
	merchant?: string;
	remarks?: string;
	transactionDate?: string;
};

/** Form values for creating a manual transaction. */
export type CreateTransactionFormValues = {
	amount: string;
	type: "debit" | "credit";
	categoryId: string;
	merchant: string;
	remarks: string;
	transactionDate: string;
};

/** Map create-form values to a create payload (trim + convert primitives). */
export function mapCreateFormToCreateBody(
	values: CreateTransactionFormValues,
): CreateTransactionBody {
	return {
		amount: Number(values.amount),
		type: values.type,
		categoryId: values.categoryId || undefined,
		merchant: values.merchant.trim() || undefined,
		remarks: values.remarks.trim() || undefined,
		transactionDate: values.transactionDate
			? new Date(values.transactionDate).toISOString()
			: undefined,
	};
}
