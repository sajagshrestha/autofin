import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";
import { TRANSACTIONS_QUERY_KEYS } from "./queries";
import type {
	CreateTransactionBody,
	DuplicateRef,
	Transaction,
	UpdateTransactionBody,
} from "./types";

/**
 * Creates a manual transaction.
 */
export function useCreateTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: CreateTransactionBody) => {
			const res = await rpc.api.transactions.$post({
				json: input,
			});
			return unwrap<{
				transaction: Transaction;
				duplicateOf?: DuplicateRef | null;
			}>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.root });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}

/**
 * Creates a transaction from an SMS message using AI extraction.
 */
export function useCreateTransactionFromSms() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { smsBody: string; sender?: string }) => {
			const res = await rpc.api.transactions.sms.$post({ json: input });
			return unwrap<{
				transaction: Transaction;
				duplicateOf?: DuplicateRef | null;
			}>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.root });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}

/**
 * Updates transaction details.
 */
export function useUpdateTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: UpdateTransactionBody & { id: string }) => {
			const { id, ...body } = input;
			const res = await rpc.api.transactions[":id"].$patch({
				param: { id },
				json: body,
			});
			return unwrap<{ transaction: Transaction }>(res);
		},
		onSuccess: (_data, variables) => {
			void variables;
			queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.root });
		},
	});
}

/**
 * Deletes a transaction by ID.
 */
export function useDeleteTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { id: string }) => {
			const res = await rpc.api.transactions[":id"].$delete({
				param: { id: input.id },
			});
			return unwrap<{ message: string }>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.root });
		},
	});
}
