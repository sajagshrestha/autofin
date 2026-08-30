import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "VITE_",

	client: {
		VITE_APP_TITLE: z.string().min(1).optional(),
		VITE_SUPABASE_URL: z.string().url(),
		VITE_SUPABASE_ANON_KEY: z.string().min(1),
		VITE_VAPID_PUBLIC_KEY: z.string().min(1).optional(),
	},

	/**
	 * What object holds the environment variables at runtime.
	 */
	runtimeEnv: import.meta.env,

	emptyStringAsUndefined: true,
});
