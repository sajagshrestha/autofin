import { useQuery } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";
import type { Loan, LoanSettlement } from "./types";

export const LOANS_QUERY_KEYS = {
	root: ["loans"] as const,
	list: ["loans", "list"] as const,
	detail: (id: string) => ["loans", "detail", id] as const,
};

/**
 * Fetches all tracked loans for the user (with settlement stats).
 */
export function useGetLoans() {
	return useQuery({
		queryKey: LOANS_QUERY_KEYS.list,
		queryFn: async () => {
			const res = await rpc.api.loans.$get();
			return unwrap<{ loans: Loan[] }>(res);
		},
	});
}

/**
 * Fetches one loan plus its settlement transactions.
 */
export function useGetLoan(id: string | null) {
	return useQuery({
		queryKey: LOANS_QUERY_KEYS.detail(id ?? "_"),
		queryFn: async () => {
			if (!id) return null;
			const res = await rpc.api.loans[":id"].$get({ param: { id } });
			return unwrap<{ loan: Loan; settlements: LoanSettlement[] }>(res);
		},
		enabled: id !== null,
	});
}
