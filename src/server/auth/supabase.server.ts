import { createServerClient } from "@supabase/ssr";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

/**
 * Supabase server client bound to a Hono context.
 *
 * Sessions live in cookies written by the browser client (@supabase/ssr);
 * reads come from the request, refreshes are appended to the response's
 * Set-Cookie headers by hono/cookie helpers.
 */
export function getSupabaseServerClient(c: Context) {
	const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
	const anonKey =
		process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be configured");
	}

	return createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return Object.entries(getCookie(c)).map(([name, value]) => ({
					name,
					value,
				}));
			},
			setAll(cookiesToSet) {
				for (const { name, value, options } of cookiesToSet) {
					// @supabase/ssr's serialize options and hono's overlap but their
					// sameSite unions differ slightly; align them here.
					setCookie(
						c,
						name,
						value,
						options as unknown as Parameters<typeof setCookie>[3],
					);
				}
			},
		},
	});
}
