import { Hono } from "hono";
import { z } from "zod";
import { verifyMcpToken } from "@/server/auth/mcp-token";
import type { SessionUser } from "@/server/auth/session";
import { getSessionUserFromCookieHeader } from "@/server/auth/session";
import { getContainer } from "@/server/lib/container";
import { getAdvisorToolDefs } from "@/server/tools/advisor-tools";

/**
 * Model Context Protocol server (stateless Streamable HTTP flavor).
 *
 * - POST /api/mcp  — JSON-RPC: initialize · notifications/initialized ·
 *   tools/list · tools/call (single message or batch)
 * - GET /api/mcp   — 405 (no SSE streams in stateless mode)
 *
 * Auth: `Authorization: Bearer <token>` (see Settings → MCP for the token)
 * or the app's session cookies (handy with local MCP inspectors).
 */
export const mcpRouter = new Hono()
	.post("/", async (c) => {
		const user = await resolveCaller(c.req.raw);
		if (!user) {
			return jsonRpcError(
				null,
				401,
				-32001,
				"Unauthorized — provide a valid bearer token or session",
			);
		}

		let body: unknown;
		try {
			body = await c.req.json();
		} catch {
			return jsonRpcError(null, 400, -32700, "Parse error");
		}

		const messages = Array.isArray(body) ? body : [body];
		const responses: unknown[] = [];

		for (const message of messages) {
			const parsed = singleMessageSchema.safeParse(message);
			if (!parsed.success) {
				responses.push(errorBody(null, -32600, "Invalid Request"));
				continue;
			}

			const msg = {
				...parsed.data,
				id: parsed.data.id as string | number | undefined,
			};
			const id = msg.id ?? null;

			if (msg.method.startsWith("notifications/")) {
				// e.g. notifications/initialized — nothing to answer per message,
				// the whole POST is acknowledged with 202 below.
				continue;
			}

			switch (msg.method) {
				case "initialize": {
					responses.push(
						resultBody(id, {
							protocolVersion: SUPPORTED_PROTOCOL_VERSION,
							capabilities: {
								tools: { listChanged: false },
							},
							serverInfo: {
								name: SERVER_INFO.name,
								version: SERVER_INFO.version,
							},
							instructions:
								"Read-only access to this AutoFin user's transactions. All amounts are NPR. Use the provided date format YYYY-MM-DD.",
						}),
					);
					break;
				}

				case "ping": {
					responses.push(resultBody(id, {}));
					break;
				}

				case "tools/list": {
					responses.push(
						resultBody(id, {
							tools: getAdvisorToolDefs().map((def) => ({
								name: def.name,
								title: def.title,
								description: def.description,
								inputSchema: z.toJSONSchema(def.inputSchema),
							})),
						}),
					);
					break;
				}

				case "tools/call": {
					const params = toolCallSchema.safeParse(msg.params ?? {});
					if (!params.success) {
						responses.push(errorBody(id, -32602, "Invalid params"));
						break;
					}

					const def = getAdvisorToolDefs().find(
						(toolDef) => toolDef.name === params.data.name,
					);
					if (!def) {
						responses.push(
							resultBody(id, {
								content: [
									{ type: "text", text: `Unknown tool: ${params.data.name}` },
								],
								isError: true,
							}),
						);
						break;
					}

					const args = def.inputSchema.safeParse(params.data.arguments ?? {});
					if (!args.success) {
						const first = args.error.issues[0];
						responses.push(
							resultBody(id, {
								content: [
									{
										type: "text",
										text: `Invalid arguments: ${first?.path?.join(".") ?? ""}${first?.path?.length ? ": " : ""}${first?.message ?? "invalid input"}`,
									},
								],
								isError: true,
							}),
						);
						break;
					}

					try {
						const container = getContainer();
						const record = await container.userRepo.findById(user.id);
						const timezone = record?.timezone ?? "Asia/Kathmandu";

						const data = await def.execute(args.data, {
							userId: user.id,
							timezone,
						});
						responses.push(
							resultBody(id, {
								content: [
									{ type: "text", text: JSON.stringify(data, null, 2) },
								],
								structuredContent: data,
							}),
						);
					} catch (error) {
						console.error(`MCP tool ${def.name} failed:`, error);
						responses.push(
							resultBody(id, {
								content: [
									{
										type: "text",
										text:
											error instanceof Error
												? error.message
												: "Tool execution failed",
									},
								],
								isError: true,
							}),
						);
					}
					break;
				}

				default: {
					responses.push(
						errorBody(id, -32601, `Method not found: ${msg.method}`),
					);
				}
			}
		}

		if (responses.length === 0) {
			return new Response(null, { status: 202 });
		}
		return Response.json(responses.length === 1 ? responses[0] : responses);
	})

	.get("/", () =>
		Response.json(
			{ error: "Method not allowed — use POST (Streamable HTTP)" },
			{ status: 405, headers: { Allow: "POST" } },
		),
	)
	.delete("/", () => new Response(null, { status: 405 }));

const SUPPORTED_PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "autofin", version: "1.0.0" } as const;

const envelopeSchema = z.object({
	jsonrpc: z.literal("2.0").optional(),
	id: z.union([z.string(), z.number()]).optional(),
	method: z.string(),
	params: z.unknown().optional(),
});

const singleMessageSchema = envelopeSchema.refine(
	(message) =>
		message.method.startsWith("notifications/") ||
		("id" in message && message.id !== undefined),
	{ message: "Requests must have an id" },
);

const toolCallSchema = z.object({
	name: z.string(),
	arguments: z.record(z.string(), z.unknown()).optional(),
});

function resultBody(id: string | number | null | undefined, result: unknown) {
	return { jsonrpc: "2.0", id: id ?? null, result };
}

function errorBody(id: string | number | null, code: number, message: string) {
	return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function jsonRpcError(
	id: string | number | null,
	status: number,
	code: number,
	message: string,
) {
	return Response.json(errorBody(id, code, message), { status });
}

/** Session cookie (browser inspectors) OR MCP bearer token (external clients). */
async function resolveCaller(request: Request): Promise<SessionUser | null> {
	const authorization = request.headers.get("authorization");
	if (authorization?.startsWith("Bearer ")) {
		const userId = verifyMcpToken(authorization.slice(7).trim());
		if (userId) return { id: userId, email: "" };
		return null;
	}
	return getSessionUserFromCookieHeader(request.headers.get("cookie"));
}
