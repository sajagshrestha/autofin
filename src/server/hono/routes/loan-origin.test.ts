import type { MiddlewareHandler } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const repos = vi.hoisted(() => ({
	loanRepo: {
		create: vi.fn(),
		findById: vi.fn(),
		linkOriginTransaction: vi.fn(),
		getSettlementTotals: vi.fn(),
	},
	transactionRepo: {
		findByIdWithCategory: vi.fn(),
		update: vi.fn(),
	},
	categoryRepo: {
		findByNameForUser: vi.fn(),
	},
	counterpartyRepo: {
		findOrCreate: vi.fn(),
		findManyByIds: vi.fn(),
	},
}));
vi.mock("@/server/lib/container", () => ({
	getContainer: () => repos,
}));
vi.mock("@/server/hono/middleware", () => ({
	requireUser: (async (c, next) => {
		c.set("user", { id: "owner" });
		await next();
	}) satisfies MiddlewareHandler,
}));

import { loansRouter } from "./loans";

const originTransaction = {
	id: "txn",
	userId: "owner",
	amount: "5000.00",
	type: "debit",
	transactionDate: new Date("2026-09-01T00:00:00.000Z"),
};
const loan = {
	id: "loan",
	userId: "owner",
	direction: "given",
	counterpartyId: "counterparty",
	principalAmount: "5000.00",
	currency: "NPR",
	issuedDate: new Date("2026-09-01T00:00:00.000Z"),
	dueDate: null,
	notes: null,
	transactionId: "txn",
	createdAt: new Date("2026-09-01T00:00:00.000Z"),
	updatedAt: new Date("2026-09-01T00:00:00.000Z"),
};

const request = () =>
	loansRouter.request("/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			counterpartyName: "Alex",
			direction: "given",
			originTransactionId: "txn",
		}),
	});

beforeEach(() => {
	vi.resetAllMocks();
	repos.transactionRepo.findByIdWithCategory.mockResolvedValue(
		originTransaction,
	);
	repos.loanRepo.create.mockResolvedValue(loan);
	repos.loanRepo.findById.mockResolvedValue(loan);
	repos.loanRepo.getSettlementTotals.mockResolvedValue(new Map());
	repos.counterpartyRepo.findOrCreate.mockResolvedValue({
		id: "counterparty",
		name: "Alex",
	});
	repos.counterpartyRepo.findManyByIds.mockResolvedValue([
		{ id: "counterparty", name: "Alex" },
	]);
	repos.categoryRepo.findByNameForUser.mockResolvedValue({
		id: "loan-category",
		name: "Loan",
	});
});

describe("tracking an existing transaction as a loan", () => {
	it("recategorizes the transaction as a Loan", async () => {
		expect((await request()).status).toBe(201);
		expect(repos.loanRepo.linkOriginTransaction).toHaveBeenCalledWith(
			"owner",
			"loan",
			"txn",
		);
		expect(repos.categoryRepo.findByNameForUser).toHaveBeenCalledWith(
			"Loan",
			"owner",
		);
		expect(repos.transactionRepo.update).toHaveBeenCalledWith("txn", "owner", {
			categoryId: "loan-category",
		});
	});

	it("keeps the existing category when no Loan category exists", async () => {
		repos.categoryRepo.findByNameForUser.mockResolvedValue(null);
		expect((await request()).status).toBe(201);
		expect(repos.transactionRepo.update).not.toHaveBeenCalled();
	});

	it("does not touch transactions the user does not own", async () => {
		repos.transactionRepo.findByIdWithCategory.mockResolvedValue({
			...originTransaction,
			userId: "someone-else",
		});
		expect((await request()).status).toBe(404);
		expect(repos.transactionRepo.update).not.toHaveBeenCalled();
	});
});
