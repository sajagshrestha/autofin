import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { getSessionUserFromCookieHeader } from "@/server/auth/session";

/**
 * Server-authoritative session check for the `_authenticated` route guard.
 *
 * This is intentionally still a TanStack server function (not a Hono RPC
 * call): beforeLoad runs during SSR, not in the browser, so there is no HTTP
 * round-trip to make — it resolves the user straight from the incoming
 * request's cookies.
 */
export const getSessionUserFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const cookieHeader = getRequestHeader("cookie");
		const user = await getSessionUserFromCookieHeader(cookieHeader);
		return { user };
	},
);
