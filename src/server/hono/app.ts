import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import {
	isTrustedOrigin,
	requestLogger,
	sameOriginGuard,
} from "@/server/hono/middleware";
import { authRouter } from "@/server/hono/routes/auth";
import { categoriesRouter } from "@/server/hono/routes/categories";
import { chatRouter } from "@/server/hono/routes/chat";
import { gmailRouter } from "@/server/hono/routes/gmail";
import { publicInfraRouter } from "@/server/hono/routes/public-infra";
import { statementsRouter } from "@/server/hono/routes/statements";
import { transactionsRouter } from "@/server/hono/routes/transactions";

/**
 * The whole HTTP API as one chained Hono app.
 *
 * The chain order matters twice over:
 *  1. public infra routes are mounted before protected domain routers;
 *  2. `typeof apiApp` is what the browser imports for the typed RPC client —
 *     every `.route()` link must stay in this chain or the client loses it.
 */
const api = new Hono()
	.route("/auth", authRouter)
	.route("/transactions", transactionsRouter)
	.route("/categories", categoriesRouter)
	.route("/chat", chatRouter)
	.route("/statements", statementsRouter)
	.route("/gmail", gmailRouter);

export const apiApp = new Hono()
	.use("*", requestLogger)
	// CORS: reflect trusted origins (own host, loopback dev servers, or
	// EXTRA_ALLOWED_ORIGINS) so preflights and credentialed calls succeed.
	.use(
		"*",
		cors({
			origin: (origin, c) => (isTrustedOrigin(origin, c) ? origin : ""),
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowHeaders: ["content-type", "authorization", "x-verification-token"],
		}),
	)
	// CSRF defense-in-depth for mutating requests (trusted origins only).
	.use("*", sameOriginGuard)
	.onError((err, c) => {
		if (err instanceof HTTPException) {
			return c.json({ error: err.message }, err.status);
		}
		console.error("Unhandled API error:", err);
		return c.json({ error: "Internal server error" }, 500);
	})
	// Public: health, inngest, pub/sub webhook, gmail oauth callback
	.route("/api", publicInfraRouter)
	// Protected domain API
	.route("/api", api);

/** Type-only export powering `hc<AppType>` on the client. */
export type AppType = typeof apiApp;
