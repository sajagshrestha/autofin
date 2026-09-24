import { beforeEach, describe, expect, it, vi } from "vitest";
import { GmailService } from "./gmail.service";

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

function createService() {
	const gmailOAuthRepo = {
		findByUserId: vi.fn(async () => ({
			accessToken: "valid-access-token",
			// Far-future expiry so no refresh is attempted.
			expiresAt: new Date(Date.now() + 3600_000),
			refreshToken: "refresh-token",
		})),
	};
	return new GmailService(
		{} as never,
		gmailOAuthRepo as never,
		null as never,
		null as never,
		null as never,
		null as never,
		null as never,
		null as never,
		null as never,
		null as never,
	);
}

describe("GmailService gmailRequest", () => {
	beforeEach(() => {
		vi.unstubAllGlobals();
	});

	it("resolves empty 200 bodies (users.stop, filters.delete)", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response(null, { status: 200 })),
		);
		const service = createService();

		await expect(service.stopWatch("user-1")).resolves.toBeUndefined();
		await expect(
			service.deleteFilter("user-1", "filter-1"),
		).resolves.toBeUndefined();
	});

	it("parses JSON bodies as before", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => jsonResponse({ id: "filter-1" })),
		);
		const service = createService();

		await expect(
			service.createFilter("user-1", { from: "a@b.com" }, ["label-1"]),
		).resolves.toEqual({ id: "filter-1" });
	});

	it("throws a descriptive error on API failures", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => jsonResponse({ error: { code: 404 } }, 404)),
		);
		const service = createService();

		await expect(service.getProfile("user-1")).rejects.toThrow(
			"Gmail API error: 404",
		);
	});
});
