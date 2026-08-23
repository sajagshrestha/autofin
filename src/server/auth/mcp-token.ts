import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Deterministic per-user bearer token for the MCP server.
 *
 * `token = "<userId>.<base64url(HMAC-SHA256(secret, userId))>"`
 *
 * - No database storage needed: the same user always derives the same token.
 * - Rotating MCP_TOKEN_SECRET (or changing DATABASE_URL, the fallback seed)
 *   invalidates all tokens at once — that is the revocation mechanism.
 */
function getSecret(): string {
	const explicit = process.env.MCP_TOKEN_SECRET;
	if (explicit) return explicit;
	// Deterministic dev fallback so local setups work with zero configuration.
	return createHash("sha256")
		.update(`autofin-mcp:${process.env.DATABASE_URL ?? ""}`)
		.digest("hex");
}

export function getMcpToken(userId: string): string {
	const signature = createHmac("sha256", getSecret())
		.update(userId)
		.digest("base64url");
	return `${userId}.${signature}`;
}

/** Resolve a presented token back to a userId, or null when invalid. */
export function verifyMcpToken(token: string): string | null {
	const dotIndex = token.indexOf(".");
	if (dotIndex <= 0) return null;

	const userId = token.slice(0, dotIndex);
	const signature = Buffer.from(token.slice(dotIndex + 1), "base64url");
	const expected = createHmac("sha256", getSecret()).update(userId).digest();

	if (signature.length !== expected.length) return null;
	if (!timingSafeEqual(signature, expected)) return null;
	return userId;
}
