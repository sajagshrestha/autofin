import { useQuery } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";

export const PREFERENCES_QUERY_KEYS = {
	root: ["preferences"] as const,
	current: ["preferences", "current"] as const,
};

export interface UserPreferences {
	categoryMappingPrompt: string | null;
}

/**
 * Fetches the user's AI preferences.
 */
export function useGetPreferences() {
	return useQuery({
		queryKey: PREFERENCES_QUERY_KEYS.current,
		queryFn: async () => {
			const res = await rpc.api.preferences.$get();
			return unwrap<UserPreferences>(res);
		},
	});
}
