import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TRANSACTIONS_QUERY_KEYS } from "@/hooks/transactions/queries";
import type { Transaction } from "@/hooks/transactions/types";
import { rpc, unwrap } from "@/lib/api-client";
import type { StatementExtractionResult } from "@/server/services/statement-extractor.service";

/** Result of extracting a statement — rows are plain/serializable. */
export type StatementExtractionDto = StatementExtractionResult;

export interface BulkImportRowInput {
	amount: number;
	type: "debit" | "credit";
	merchant?: string;
	remarks?: string;
	transactionDate?: string;
	categoryId?: string;
	confidence?: number;
}

interface BulkImportResult {
	created: number;
	transactions: Transaction[];
}

/**
 * Uploads a statement file (PDF or image) and returns AI-extracted
 * transactions for review. Nothing is saved until bulk-create is called.
 */
export function useExtractStatement() {
	return useMutation({
		mutationFn: async (input: { file: File }) => {
			const res = await rpc.api.statements.extract.$post({
				form: { file: input.file },
			});
			return unwrap<StatementExtractionDto>(res);
		},
	});
}

/**
 * Persists the reviewed transactions as real transactions (bulk insert).
 */
export function useBulkCreateTransactions() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { transactions: BulkImportRowInput[] }) => {
			const res = await rpc.api.transactions["bulk-import"].$post({
				json: input,
			});
			return unwrap<BulkImportResult>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: TRANSACTIONS_QUERY_KEYS.root,
			});
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}
