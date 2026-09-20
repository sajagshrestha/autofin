import { useQuery } from "@tanstack/react-query";
import { unwrap } from "@/lib/api-client";
import { useApiClient } from "@/lib/api-context";
import type { ListTransactionsFilters } from "./types";

export const TRANSACTIONS_QUERY_KEYS = {
	root: ["transactions"] as const,
	list: (params?: Partial<ListTransactionsFilters>) =>
		["transactions", "list", params ?? {}] as const,
	summary: (params?: { startDate?: string; endDate?: string }) =>
		["transactions", "summary", params ?? {}] as const,
	detail: (id: string) => ["transactions", "detail", id] as const,
};

/** Drop empty/undefined values so optional filters are omitted, not sent blank. */
function compactParams<T extends Record<string, unknown>>(
	params?: T,
): Partial<T> {
	if (!params) return {};
	return Object.fromEntries(
		Object.entries(params).filter(
			([, value]) => value !== undefined && value !== "",
		),
	) as Partial<T>;
}

/**
 * Fetches all transactions with optional filters.
 */
export function useGetAllTransactions(
	params?: Partial<ListTransactionsFilters>,
) {
	const rpc = useApiClient();
	const clean = compactParams(params);
	return useQuery({
		queryKey: TRANSACTIONS_QUERY_KEYS.list(clean),
		queryFn: async () => {
			const res = await rpc.api.transactions.$get({
				query: { limit: 500, offset: 0, ...clean },
			});
			return unwrap<{
				transactions: import("./types").Transaction[];
				total: number;
				limit: number;
				offset: number;
			}>(res);
		},
	});
}

/**
 * Fetches transaction summary statistics.
 */
export function useGetTransactionSummary(params?: {
	startDate?: string;
	endDate?: string;
}) {
	const rpc = useApiClient();
	const clean = compactParams(params);
	return useQuery({
		queryKey: TRANSACTIONS_QUERY_KEYS.summary(clean),
		queryFn: async () => {
			const res = await rpc.api.transactions.summary.$get({
				query: clean as Record<string, string>,
			});
			return unwrap<{
				summary: {
					totalDebit: number;
					totalCredit: number;
					transactionCount: number;
					netAmount: number;
				};
			}>(res);
		},
	});
}

/**
 * Fetches a single transaction by its ID.
 */
export function useGetTransactionById(id: string) {
	const rpc = useApiClient();
	return useQuery({
		queryKey: TRANSACTIONS_QUERY_KEYS.detail(id),
		queryFn: async () => {
			const res = await rpc.api.transactions[":id"].$get({
				param: { id },
			});
			return unwrap<{ transaction: import("./types").Transaction }>(res);
		},
	});
}
