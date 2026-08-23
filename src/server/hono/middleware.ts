import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { SessionUser } from "@/server/auth/session";
import { getSupabaseServerClient } from "@/server/auth/supabase.server";

export type ApiEnv = {
	Variables: {
		user: SessionUser;
	};
};

/** Resolve the session user and stash it on the context. */
export const requireUser = createMiddleware<ApiEnv>(async (c, next) => {
	const supabase = getSupabaseServerClient(c);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	c.set("user", { id: user.id, email: user.email ?? "" });
	await next();
});

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Same-origin guard for mutating requests (CSRF protection).
 *
 * Server functions had this built in; plain Hono endpoints need it explicit.
 * Requests without an Origin header (native apps, Pub/Sub pushes) pass through.
 */
export const sameOriginGuard = createMiddleware(async (c, next) => {
	if (!SAFE_METHODS.has(c.req.method)) {
		const origin = c.req.header("origin");
		if (origin) {
			let matches = false;
			try {
				matches = new URL(origin).host === new URL(c.req.url).host;
			} catch {
				matches = false;
			}
			if (!matches) {
				throw new HTTPException(403, {
					message: "Cross-origin request rejected",
				});
			}
		}
	}
	await next();
});

/** Request logger — tiny stand-in for the old Hono backend's logger middleware. */
export const requestLogger = createMiddleware(async (c, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	console.info(`${c.req.method} ${c.req.path} -> ${c.res.status} (${ms}ms)`);
});
