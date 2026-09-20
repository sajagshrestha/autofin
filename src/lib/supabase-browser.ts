import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

/**
 * Browser-side Supabase client.
 *
 * Uses cookie-based storage (@supabase/ssr) so the session is shared with the
 * server: server functions resolve the caller from cookies with no token
 * plumbing.
 */
let client: ReturnType<typeof createBrowserClient> | undefined;

// Public demo documents must not initialize or refresh a real auth session.
export function getSupabase() {
	client ??= createBrowserClient(
		env.VITE_SUPABASE_URL,
		env.VITE_SUPABASE_ANON_KEY,
	);
	return client;
}
