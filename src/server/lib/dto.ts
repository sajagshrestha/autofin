import type { TransactionRepository } from "@/server/repositories/transaction.repository";

export type TransactionRow = NonNullable<
	Awaited<ReturnType<TransactionRepository["findByIdWithCategory"]>>
>;

export interface TransactionDto {
	id: string;
	userId: string;
	categoryId: string | null;
	amount: string;
	type: "debit" | "credit";
	currency: string | null;
	merchant: string | null;
	accountNumber: string | null;
	bankName: string | null;
	transactionDate: string | null;
	remarks: string | null;
	aiConfidence: string | null;
	isAiCreated: boolean;
	createdAt: string;
	updatedAt: string;
	category: { id: string; name: string; icon: string | null } | null;
}

/**
 * Lean, serializable transaction DTO — the shape the client app consumes.
 * Debug-only fields (raw email content, full AI payload) stay on the server.
 */
export function toTransactionDto(txn: TransactionRow): TransactionDto {
	return {
		id: txn.id,
		userId: txn.userId,
		categoryId: txn.categoryId,
		amount: txn.amount,
		type: txn.type as "debit" | "credit",
		currency: txn.currency ?? null,
		merchant: txn.merchant,
		accountNumber: txn.accountNumber,
		bankName: txn.bankName,
		transactionDate: txn.transactionDate?.toISOString() ?? null,
		remarks: txn.remarks,
		aiConfidence: txn.aiConfidence ?? null,
		isAiCreated: txn.isAiCreated,
		createdAt: txn.createdAt.toISOString(),
		updatedAt: txn.updatedAt.toISOString(),
		category: txn.category ?? null,
	};
}
