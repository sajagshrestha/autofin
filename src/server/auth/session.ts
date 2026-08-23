import { db } from "@/server/db/connection";
import { users } from "@/server/db/schema";

export interface SessionUser {
	id: string;
	email: string;
}

/** Minimal cookie-header parser — `name=value` pairs, quoted values unescaped. */
function parseCookieHeader(header?: string | null): Record<string, string> {
	if (!header) return {};
	const out: Record<string, string> = {};
	for (const part of header.split(";")) {
		const idx = part.indexOf("=");
		if (idx === -1) continue;
		const name = part.slice(0, idx).trim();
		let value = part.slice(idx + 1).trim();
		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1);
		}
		if (name) out[name] = decodeURIComponent(value);
	}
	return out;
}

/**
 * Resolve the authenticated user purely from a Cookie header.
 *
 * Framework-agnostic on purpose: the Hono auth middleware passes the request
 * header, and the `_authenticated` route guard passes Start's request header —
 * one implementation, two hosts. Read-only (no refresh-cookie writes); the
 * Hono-bound client handles refresh flows.
 */
export async function getSessionUserFromCookieHeader(
	cookieHeader?: string | null,
): Promise<SessionUser | null> {
	try {
		const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
		const anonKey =
			process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
		if (!url || !anonKey) return null;

		const { createServerClient } = await import("@supabase/ssr");
		const supabase = createServerClient(url, anonKey, {
			cookies: {
				getAll() {
					return Object.entries(parseCookieHeader(cookieHeader)).map(
						([name, value]) => ({ name, value }),
					);
				},
				setAll() {
					/* read-only resolver */
				},
			},
		});

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return null;
		return { id: user.id, email: user.email ?? "" };
	} catch {
		return null;
	}
}

/**
 * Keep the application `users` row in sync with Supabase auth users.
 * Idempotent: safe to call on every login/signup/OAuth callback.
 */
export async function ensureAppUser(user: SessionUser): Promise<void> {
	await db
		.insert(users)
		.values({
			id: user.id,
			email: user.email,
			timezone: "Asia/Kathmandu",
		})
		.onConflictDoNothing({ target: users.id });
}
