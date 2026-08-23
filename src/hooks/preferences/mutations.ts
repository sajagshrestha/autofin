import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";
import type { UserPreferences } from "./queries";
import { PREFERENCES_QUERY_KEYS } from "./queries";

/**
 * Saves the user's AI preferences (custom category-mapping prompt).
 */
export function useUpdatePreferences() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { categoryMappingPrompt: string | null }) => {
			const res = await rpc.api.preferences.$put({ json: input });
			return unwrap<UserPreferences>(res);
		},
		onSuccess: (data) => {
			queryClient.setQueryData(PREFERENCES_QUERY_KEYS.current, data);
		},
	});
}
