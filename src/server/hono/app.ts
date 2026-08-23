import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requestLogger, sameOriginGuard } from "@/server/hono/middleware";
import { authRouter } from "@/server/hono/routes/auth";
import { categoriesRouter } from "@/server/hono/routes/categories";
import { gmailRouter } from "@/server/hono/routes/gmail";
import { insightsRouter } from "@/server/hono/routes/insights";
import { publicInfraRouter } from "@/server/hono/routes/public-infra";
import { statementsRouter } from "@/server/hono/routes/statements";
import { transactionsRouter } from "@/server/hono/routes/transactions";

/**
 * The whole HTTP API as one chained Hono app.
 *
 * The chain order matters twice over:
 *  1. public infra routes are mounted before protected domain routers;
 *  2. `typeof api` is what the browser imports for the typed RPC client —
 *     every `.route()` link must stay in this chain or the client loses it.
 */
const api = new Hono()
	.route("/auth", authRouter)
	.route("/transactions", transactionsRouter)
	.route("/categories", categoriesRouter)
	.route("/insights", insightsRouter)
	.route("/statements", statementsRouter)
	.route("/gmail", gmailRouter);

export const apiApp = new Hono()
	.use("*", requestLogger)
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
