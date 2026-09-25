import type { MiddlewareHandler } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const repo = vi.hoisted(() => ({
	findById: vi.fn(),
	updateSettlement: vi.fn(),
}));
vi.mock("@/server/lib/container", () => ({
	getContainer: () => ({ loanRepo: repo }),
}));
vi.mock("@/server/hono/middleware", () => ({
	requireUser: (async (c, next) => {
		c.set("user", { id: "owner" });
		await next();
	}) satisfies MiddlewareHandler,
}));

import { loansRouter } from "./loans";

const changes = {
	amount: 1200.25,
	transactionDate: "2026-09-25T12:00:00.000Z",
	remarks: "Corrected repayment",
};
const request = (body: unknown) =>
	loansRouter.request("/loan/settlements/payment", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
beforeEach(() => {
	vi.resetAllMocks();
	repo.findById.mockResolvedValue({
		id: "loan",
		userId: "owner",
		direction: "given",
		transactionId: "origin",
	});
	repo.updateSettlement.mockResolvedValue({ id: "payment" });
});
describe("settlement management", () => {
	it("updates the linked transaction with currency precision and owner scope", async () => {
		expect((await request(changes)).status).toBe(200);
		expect(repo.findById).toHaveBeenCalledWith("owner", "loan");
		expect(repo.updateSettlement).toHaveBeenCalledWith(
			"owner",
			expect.objectContaining({ id: "loan" }),
			"payment",
			{
				amount: "1200.25",
				transactionDate: new Date(changes.transactionDate),
				remarks: changes.remarks,
			},
		);
	});
	it.each([0, 0.001, -1, "invalid"])(
		"rejects invalid amount %s",
		async (amount) => {
			expect((await request({ ...changes, amount })).status).toBe(400);
			expect(repo.updateSettlement).not.toHaveBeenCalled();
		},
	);
	it("rejects invalid dates", async () => {
		expect((await request({ ...changes, transactionDate: "bad" })).status).toBe(
			400,
		);
	});
	it("does not mutate a loan inaccessible to this user", async () => {
		repo.findById.mockResolvedValue(null);
		expect((await request(changes)).status).toBe(404);
		expect(repo.updateSettlement).not.toHaveBeenCalled();
	});
	it("rejects a transaction that does not match the repayment guards", async () => {
		repo.updateSettlement.mockResolvedValue(null);
		expect((await request(changes)).status).toBe(404);
	});
	it("removes only the loan association", async () => {
		const response = await loansRouter.request("/loan/settlements/payment", {
			method: "DELETE",
		});
		expect(response.status).toBe(200);
		expect(repo.updateSettlement).toHaveBeenCalledWith(
			"owner",
			expect.objectContaining({ id: "loan" }),
			"payment",
			{ loanId: null },
		);
	});
});
