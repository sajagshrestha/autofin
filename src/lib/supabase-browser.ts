import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

/**
 * Browser-side Supabase client.
 *
 * Uses cookie-based storage (@supabase/ssr) so the session is shared with the
 * server: server functions resolve the caller from cookies with no token
 * plumbing.
 */
export const supabase = createBrowserClient(
	env.VITE_SUPABASE_URL,
	env.VITE_SUPABASE_ANON_KEY,
);
