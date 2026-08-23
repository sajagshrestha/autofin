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

/** Extra origins allowed to call the API cross-origin (comma-separated env). */
export const extraAllowedOrigins = (process.env.EXTRA_ALLOWED_ORIGINS ?? "")
	.split(",")
	.map((o) => o.trim())
	.filter(Boolean);

function isLoopback(origin: URL): boolean {
	return ["localhost", "127.0.0.1", "[::1]", "::1"].includes(origin.hostname);
}

/** Hosts the request could legitimately be addressed by (direct or proxied). */
export function requestHosts(c: {
	req: { header(name: string): string | undefined; url: string };
}): string[] {
	const hosts = new Set<string>();
	try {
		hosts.add(new URL(c.req.url).host);
	} catch {
		/* ignore */
	}
	const forwarded = c.req.header("x-forwarded-host");
	if (forwarded) {
		for (const h of forwarded.split(",")) {
			const trimmed = h.trim();
			if (trimmed) hosts.add(trimmed);
		}
	}
	return [...hosts];
}

/**
 * Trusted cross-origin callers: the API's own host (direct or via
 * X-Forwarded-Host), loopback dev servers, or EXTRA_ALLOWED_ORIGINS entries.
 */
export function isTrustedOrigin(
	origin: string,
	c: { req: { header(name: string): string | undefined; url: string } },
): boolean {
	try {
		const o = new URL(origin);
		return (
			requestHosts(c).includes(o.host) ||
			isLoopback(o) ||
			extraAllowedOrigins.includes(origin)
		);
	} catch {
		return false;
	}
}

/**
 * Same-origin guard for mutating requests (CSRF protection).
 *
 * Requests without an Origin header (native apps, Pub/Sub pushes, curl) pass
 * through. Proxy-aware: compares against both the resolved URL host and any
 * X-Forwarded-Host values so deployments behind reverse proxies don't get
 * falsely rejected.
 */
export const sameOriginGuard = createMiddleware(async (c, next) => {
	if (!SAFE_METHODS.has(c.req.method)) {
		const origin = c.req.header("origin");
		if (origin && !isTrustedOrigin(origin, c)) {
			throw new HTTPException(403, {
				message: "Cross-origin request rejected",
			});
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
