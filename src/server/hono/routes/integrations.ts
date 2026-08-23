import { Hono } from "hono";
import { getMcpToken } from "@/server/auth/mcp-token";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";

/**
 * Integration helpers for the authenticated user.
 */
export const integrationsRouter = new Hono<ApiEnv>()
	.use("*", requireUser)
	.get("/mcp/token", (c) => {
		const user = c.get("user");
		return c.json({
			token: getMcpToken(user.id),
			url: "/api/mcp",
		});
	});
