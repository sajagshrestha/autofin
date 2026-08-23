import { hc } from "hono/client";
import type { AppType } from "@/server/hono/app";

/**
 * Typed Hono RPC client.
 *
 * `AppType` is imported type-only, so no server code reaches the browser —
 * just the inferred route/param/response types. All calls are same-origin,
 * so session cookies ride along automatically.
 */
export const rpc = hc<AppType>("/");

/** Error thrown for non-2xx API responses; message comes from the server. */
export class ApiError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

interface ErrorBody {
	error?: unknown;
	message?: string;
	success?: boolean;
}

/** Pull a human-readable message out of the API's various error payloads. */
function extractErrorMessage(body: ErrorBody | null): string | undefined {
	if (!body) return undefined;
	if (typeof body.error === "string") return body.error;

	// Zod validation failures arrive as `{ success: false, error: ZodError }`.
	const errObj =
		body.error && typeof body.error === "object"
			? (body.error as {
					message?: string;
					issues?: Array<{ path?: PropertyKey[]; message: string }>;
				})
			: undefined;

	const issue = errObj?.issues?.[0];
	if (issue) {
		const prefix = issue.path?.length ? `${issue.path.join(".")}: ` : "";
		return `${prefix}${issue.message}`;
	}
	return errObj?.message ?? body.message ?? undefined;
}

/**
 * Unwrap an RPC response: returns the parsed JSON body on 2xx, throws
 * `ApiError` (with the server's error message) otherwise.
 */
export async function unwrap<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as ErrorBody | null;
		throw new ApiError(
			response.status,
			extractErrorMessage(body) ?? `${response.status} ${response.statusText}`,
		);
	}

	return (await response.json()) as T;
}
