import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { getSessionUserFromCookieHeader } from "@/server/auth/session";

/**
 * Server-authoritative session check for the homepage and app route guards.
 *
 * The SSR homepage calls this directly on the server. Client-rendered app
 * routes cache its HTTP result for navigation and revalidate in the background.
 * In both cases,
 * the session is verified on the server using the incoming request's cookies.
 */
export const getSessionUserFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const cookieHeader = getRequestHeader("cookie");
		const user = await getSessionUserFromCookieHeader(cookieHeader);
		return { user };
	},
);
