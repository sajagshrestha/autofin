import { queryOptions } from "@tanstack/react-query";
import { getSessionUserFn } from "@/server/functions/session.fns";

export const SESSION_QUERY_KEY = ["auth", "session"] as const;

// This cache only controls navigation. Every API request still verifies auth.
export const sessionQueryOptions = queryOptions({
	queryKey: SESSION_QUERY_KEY,
	queryFn: ({ signal }) => getSessionUserFn({ signal }),
	staleTime: 5 * 60 * 1000,
	retry: false,
});
