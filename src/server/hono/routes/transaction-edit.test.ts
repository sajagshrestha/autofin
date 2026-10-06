import type { MiddlewareHandler } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const repo = vi.hoisted(() => ({
	update: vi.fn(),
	findByIdWithCategory: vi.fn(),
}));
vi.mock("@/server/lib/container", () => ({
	getContainer: () => ({
		transactionRepo: repo,
		userRepo: { findById: async () => ({ timezone: "Asia/Kathmandu" }) },
	}),
}));
vi.mock("@/server/hono/middleware", () => ({
	requireUser: (async (c, next) => {
		c.set("user", { id: "owner" });
		await next();
	}) satisfies MiddlewareHandler,
}));

import { transactionsRouter } from "./transactions";

const request = (body: unknown) =>
	transactionsRouter.request("/transaction", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

beforeEach(() => {
	vi.resetAllMocks();
	repo.update.mockResolvedValue({ id: "transaction" });
	repo.findByIdWithCategory.mockResolvedValue({
		id: "transaction",
		userId: "owner",
		amount: "100.00",
		type: "debit",
		loanId: "loan",
		loanDirection: "taken",
		loanOriginTransactionId: "origin",
		createdAt: new Date(),
		updatedAt: new Date(),
	});
});

describe("transaction type editing", () => {
	it.each(["debit", "credit"])("saves and returns %s", async (type) => {
		repo.findByIdWithCategory.mockResolvedValue({
			...(await repo.findByIdWithCategory()),
			type,
		});
		const response = await request({ type });
		expect(response.status).toBe(200);
		expect(repo.update).toHaveBeenCalledWith("transaction", "owner", {
			type,
			transactionDate: undefined,
		});
		expect(await response.json()).toMatchObject({
			transaction: {
				type,
				amount: "100.00",
				loanId: "loan",
				loanDirection: "taken",
				loanOriginTransactionId: "origin",
			},
		});
	});

	it("allows existing callers to omit type", async () => {
		expect((await request({ notes: "Updated note" })).status).toBe(200);
		expect(repo.update).toHaveBeenCalledWith("transaction", "owner", {
			notes: "Updated note",
			transactionDate: undefined,
		});
	});

	it.each(["invalid", "Credit", null, 1])(
		"rejects invalid type %s",
		async (type) => {
			expect((await request({ type })).status).toBe(400);
			expect(repo.update).not.toHaveBeenCalled();
		},
	);

	it("returns not found when the owner-scoped update fails", async () => {
		repo.update.mockResolvedValue(null);
		expect((await request({ type: "credit" })).status).toBe(404);
		expect(repo.update).toHaveBeenCalledWith("transaction", "owner", {
			type: "credit",
			transactionDate: undefined,
		});
		expect(repo.findByIdWithCategory).not.toHaveBeenCalled();
	});
});
