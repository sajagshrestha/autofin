import { useQuery } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";

export const INSIGHTS_QUERY_KEYS = {
	root: ["insights"] as const,
	latest: ["insights", "latest"] as const,
};

export interface InsightDto {
	id: string;
	periodStart: string;
	periodEnd: string;
	content: string;
	summary: {
		topSpendingCategories?: Array<{
			category: string;
			amount: number;
			percentage: number;
		}>;
		savingsSuggestions?: string[];
		netFlow?: string;
	} | null;
	createdAt: string;
}

/**
 * Fetches the most recent financial insights for the authenticated user.
 */
export function useGetLatestInsight() {
	return useQuery({
		queryKey: INSIGHTS_QUERY_KEYS.latest,
		queryFn: async () => {
			const res = await rpc.api.insights.latest.$get({
				query: { limit: "1", offset: "0" },
			});
			return unwrap<{ insights: InsightDto[] }>(res);
		},
	});
}
