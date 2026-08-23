import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDateRangeForPeriod } from "@/components/ui/date-filter";
import { rpc, unwrap } from "@/lib/api-client";
import { INSIGHTS_QUERY_KEYS, type InsightDto } from "./queries";

interface GenerateResult {
	insight: InsightDto;
}

/**
 * Generates AI-powered financial insights for a given period.
 * Defaults to the current month when no params are provided.
 */
export function useGenerateInsight() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { startDate?: string; endDate?: string }) => {
			const res = await rpc.api.insights.generate.$post({ json: input });
			return unwrap<GenerateResult>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: INSIGHTS_QUERY_KEYS.latest });
		},
	});
}

/**
 * Returns startDate and endDate for the current month (ISO strings).
 */
export function getCurrentMonthRange() {
	const range = getDateRangeForPeriod("monthly");
	return {
		startDate: range.startDate ?? "",
		endDate: range.endDate ?? "",
	};
}
