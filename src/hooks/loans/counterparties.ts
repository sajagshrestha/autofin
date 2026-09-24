import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api-client";
import { useApiClient } from "@/lib/api-context";
import { LOANS_QUERY_KEYS } from "./queries";
import type { LoanCounterparty } from "./types";

export const COUNTERPARTIES_QUERY_KEYS = {
	root: ["counterparties"] as const,
	list: ["counterparties", "list"] as const,
};

/** Fetches all loan counterparties for the user (with loan counts). */
export function useGetCounterparties() {
	const rpc = useApiClient();
	return useQuery({
		queryKey: COUNTERPARTIES_QUERY_KEYS.list,
		queryFn: async () => {
			const res = await rpc.api.counterparties.$get();
			return unwrap<{ counterparties: LoanCounterparty[] }>(res);
		},
	});
}

function invalidateCounterparties(
	queryClient: ReturnType<typeof useQueryClient>,
) {
	queryClient.invalidateQueries({ queryKey: COUNTERPARTIES_QUERY_KEYS.root });
}

/** Creates a counterparty (409 when the name already exists). */
export function useCreateCounterparty() {
	const rpc = useApiClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { name: string; notes?: string }) => {
			const res = await rpc.api.counterparties.$post({ json: input });
			return unwrap<{ counterparty: LoanCounterparty }>(res);
		},
		onSuccess: () => invalidateCounterparties(queryClient),
	});
}

/** Renames a counterparty or updates its notes. */
export function useUpdateCounterparty() {
	const rpc = useApiClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (
			input: { id: string } & { name?: string; notes?: string | null },
		) => {
			const { id, ...body } = input;
			const res = await rpc.api.counterparties[":id"].$patch({
				param: { id },
				json: body,
			});
			return unwrap<{ counterparty: LoanCounterparty }>(res);
		},
		onSuccess: () => {
			invalidateCounterparties(queryClient);
			queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEYS.root });
		},
	});
}

/** Deletes a counterparty (fails while loans still reference it). */
export function useDeleteCounterparty() {
	const rpc = useApiClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { id: string }) => {
			const res = await rpc.api.counterparties[":id"].$delete({
				param: { id: input.id },
			});
			return unwrap<{ message: string }>(res);
		},
		onSuccess: () => invalidateCounterparties(queryClient),
	});
}
