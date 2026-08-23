import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";
import { LOANS_QUERY_KEYS } from "./queries";
import type { CreateLoanInput, Loan } from "./types";

interface UpdateLoanInput {
	id: string;
	counterpartyName?: string;
	principalAmount?: number;
	dueDate?: string | null;
	notes?: string | null;
}

/**
 * Creates a tracked loan (optionally linked to an existing transaction or
 * recording a new origin movement).
 */
export function useCreateLoan() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: CreateLoanInput) => {
			const res = await rpc.api.loans.$post({ json: input });
			return unwrap<{ loan: Loan }>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEYS.root });
			queryClient.invalidateQueries({
				queryKey: TRANSACTIONS_ROOT_KEY,
			});
		},
	});
}

const TRANSACTIONS_ROOT_KEY = ["transactions"] as const;

/**
 * Updates editable loan fields.
 */
export function useUpdateLoan() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: Omit<UpdateLoanInput, "id"> & { id: string }) => {
			const { id, ...body } = input;
			const res = await rpc.api.loans[":id"].$patch({
				param: { id },
				json: body,
			});
			return unwrap<{ loan: Loan }>(res);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEYS.root });
			queryClient.invalidateQueries({
				queryKey: LOANS_QUERY_KEYS.detail(variables.id),
			});
		},
	});
}

/**
 * Deletes a loan. Linked transactions are kept as normal transactions.
 */
export function useDeleteLoan() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { id: string }) => {
			const res = await rpc.api.loans[":id"].$delete({
				param: { id: input.id },
			});
			return unwrap<{ message: string }>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEYS.root });
		},
	});
}

export interface SettleLoanInput {
	id: string;
	amount?: number;
	transactionDate?: string;
	categoryId?: string;
	remarks?: string;
}

/**
 * Records a repayment transaction against the loan.
 */
export function useSettleLoan() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: SettleLoanInput) => {
			const { id, ...body } = input;
			const res = await rpc.api.loans[":id"].settle.$post({
				param: { id },
				json: body,
			});
			return unwrap<{ loan: Loan; settlementTransactionId: string }>(res);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEYS.root });
			queryClient.invalidateQueries({
				queryKey: LOANS_QUERY_KEYS.detail(variables.id),
			});
			queryClient.invalidateQueries({
				queryKey: TRANSACTIONS_ROOT_KEY,
			});
		},
	});
}
