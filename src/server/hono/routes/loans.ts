import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { Loan } from "@/server/db/schema";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";

const isoDate = z.string().datetime();

function notFound(message: string): HTTPException {
	return new HTTPException(404, { message });
}

interface LoanWithStats {
	id: string;
	direction: "given" | "taken";
	counterpartyName: string;
	principalAmount: string;
	currency: string | null;
	issuedDate: string;
	dueDate: string | null;
	notes: string | null;
	originTransactionId: string | null;
	settledAmount: number;
	remainingAmount: number;
	settlementCount: number;
	status: "outstanding" | "settled" | "overpaid";
	isOverdue: boolean;
	createdAt: string;
}

function withStats(
	loan: Loan,
	totals: { settledAmount: number; settlementCount: number },
): LoanWithStats {
	const settled = Number(totals.settledAmount.toFixed(2));
	const principal = Number.parseFloat(loan.principalAmount);
	const remaining = Number((principal - settled).toFixed(2));
	return {
		id: loan.id,
		direction: loan.direction,
		counterpartyName: loan.counterpartyName,
		principalAmount: loan.principalAmount,
		currency: loan.currency ?? "NPR",
		issuedDate: loan.issuedDate.toISOString(),
		dueDate: loan.dueDate?.toISOString() ?? null,
		notes: loan.notes,
		originTransactionId: loan.transactionId,
		settledAmount: settled,
		remainingAmount: remaining,
		settlementCount: totals.settlementCount,
		status:
			remaining < 0 ? "overpaid" : remaining === 0 ? "settled" : "outstanding",
		isOverdue:
			remaining > 0 &&
			loan.dueDate !== null &&
			loan.dueDate.getTime() < Date.now(),
		createdAt: loan.createdAt.toISOString(),
	};
}

async function loadStats(
	userId: string,
	loans: Loan[],
): Promise<LoanWithStats[]> {
	const container = getContainer();
	const totals = await container.loanRepo.getSettlementTotals(
		userId,
		loans.map((loan) => ({
			loanId: loan.id,
			excludeTransactionId: loan.transactionId,
		})),
	);
	return loans.map((loan) =>
		withStats(
			loan,
			totals.get(loan.id) ?? { settledAmount: 0, settlementCount: 0 },
		),
	);
}

/** Create the money-movement transaction for a loan (origin or repayment). */
async function createLinkedTransaction(
	userId: string,
	opts: {
		loanId: string;
		direction: "given" | "taken";
		isOrigin: boolean;
		amount: number;
		transactionDate?: Date;
		merchant?: string | null;
		categoryId?: string | null;
		remarks?: string | null;
	},
): Promise<string> {
	const container = getContainer();
	// given + origin  -> money leaves (debit)   | given + repayment -> credit
	// taken + origin  -> money arrives (credit) | taken + repayment -> debit
	const isDebit =
		(opts.direction === "given" && opts.isOrigin) ||
		(opts.direction === "taken" && !opts.isOrigin);

	const created = await container.transactionRepo.create({
		id: crypto.randomUUID(),
		userId,
		loanId: opts.loanId,
		categoryId: opts.categoryId ?? undefined,
		amount: opts.amount.toFixed(2),
		type: isDebit ? "debit" : "credit",
		currency: "NPR",
		merchant: opts.merchant ?? null,
		remarks: opts.remarks ?? null,
		transactionDate: opts.transactionDate ?? new Date(),
		isAiCreated: false,
	});
	return created.id;
}

const createSchema = z.object({
	counterpartyName: z.string().min(1).max(120),
	direction: z.enum(["given", "taken"]),
	principalAmount: z.number().positive().max(99_999_999_999).optional(),
	/** Track an EXISTING transaction as the origin of this loan. */
	originTransactionId: z.string().optional(),
	issuedDate: isoDate.optional(),
	dueDate: z
		.union([isoDate, z.literal("")])
		.optional()
		.transform((value) => value || undefined),
	notes: z.string().max(500).optional(),
	/** When no originTransactionId: also record the money movement. */
	createTransaction: z.boolean().default(true),
	transactionDate: isoDate.optional(),
	categoryId: z.string().optional(),
});

const updateSchema = z.object({
	counterpartyName: z.string().min(1).max(120).optional(),
	principalAmount: z.number().positive().optional(),
	dueDate: z.union([isoDate, z.null()]).optional(),
	notes: z.string().max(500).nullable().optional(),
});

const settleSchema = z.object({
	amount: z.number().positive().optional(),
	transactionDate: isoDate.optional(),
	categoryId: z.string().optional(),
	remarks: z.string().max(500).optional(),
});

/** Protected loan-tracking API. */
export const loansRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const loans = await container.loanRepo.findAllForUser(user.id);
		const withStatsLoans = await loadStats(user.id, loans);

		return c.json({ loans: withStatsLoans });
	})

	.get("/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const container = getContainer();

		const loan = await container.loanRepo.findById(user.id, id);
		if (!loan) throw notFound("Loan not found");

		const [stats] = await loadStats(user.id, [loan]);
		const settlements = await container.loanRepo.findSettlements(user.id, loan);

		return c.json({ loan: stats, settlements });
	})

	.post("/", zValidator("json", createSchema), async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");
		const container = getContainer();

		// Origin-from-existing-transaction mode.
		let existingOrigin: {
			id: string;
			amount: string;
			type: string;
			transactionDate: Date | null;
		} | null = null;

		if (body.originTransactionId) {
			const txn = await container.transactionRepo.findByIdWithCategory(
				body.originTransactionId,
			);
			if (!txn || txn.userId !== user.id) {
				throw notFound("Origin transaction not found");
			}
			existingOrigin = txn;
		}

		const direction =
			body.direction ??
			(existingOrigin
				? existingOrigin.type === "debit"
					? ("given" as const)
					: ("taken" as const)
				: undefined);
		if (!direction) {
			throw new HTTPException(400, { message: "direction is required" });
		}

		const principal = existingOrigin
			? Number.parseFloat(existingOrigin.amount)
			: body.principalAmount;
		if (!principal || principal <= 0) {
			throw new HTTPException(400, {
				message:
					"principalAmount is required when not linking an existing transaction",
			});
		}

		const issuedAt = existingOrigin?.transactionDate
			? existingOrigin.transactionDate
			: body.issuedDate
				? new Date(body.issuedDate)
				: new Date();

		const loan = await container.loanRepo.create({
			id: crypto.randomUUID(),
			userId: user.id,
			direction,
			counterpartyName: body.counterpartyName.trim(),
			principalAmount: principal.toFixed(2),
			currency: "NPR",
			issuedDate: issuedAt,
			dueDate: body.dueDate ? new Date(`${body.dueDate}T23:59:59`) : null,
			notes: body.notes?.trim() || null,
			transactionId: existingOrigin?.id ?? null,
		});

		let originTransactionId: string | null = null;
		if (existingOrigin) {
			// Link the existing transaction to this loan.
			await container.loanRepo.linkOriginTransaction(
				user.id,
				loan.id,
				existingOrigin.id,
			);
			originTransactionId = existingOrigin.id;
		} else if (body.createTransaction) {
			originTransactionId = await createLinkedTransaction(user.id, {
				loanId: loan.id,
				direction,
				isOrigin: true,
				amount: principal,
				transactionDate: issuedAt,
				merchant: `Loan ${direction} — ${body.counterpartyName.trim()}`,
				categoryId: body.categoryId ?? null,
				remarks: body.notes?.trim() || null,
			});
			await container.loanRepo.linkOriginTransaction(
				user.id,
				loan.id,
				originTransactionId,
			);
		}

		const fresh = (await container.loanRepo.findById(user.id, loan.id)) ?? loan;
		const [stats] = await loadStats(user.id, [fresh]);

		return c.json({ loan: stats }, 201);
	})

	.patch("/:id", zValidator("json", updateSchema), async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const container = getContainer();

		const updated = await container.loanRepo.update(user.id, id, {
			counterpartyName: body.counterpartyName,
			principalAmount: body.principalAmount?.toFixed(2),
			dueDate:
				body.dueDate === undefined
					? undefined
					: body.dueDate === null
						? null
						: new Date(`${body.dueDate}T23:59:59`),
			notes: body.notes === undefined ? undefined : body.notes?.trim() || null,
		});

		if (!updated) throw notFound("Loan not found");

		const [stats] = await loadStats(user.id, [updated]);
		return c.json({ loan: stats });
	})

	.delete("/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const container = getContainer();

		const deleted = await container.loanRepo.delete(user.id, id);
		if (!deleted) throw notFound("Loan not found");

		return c.json({ message: "Loan deleted — linked transactions are kept" });
	})

	.post("/:id/settle", zValidator("json", settleSchema), async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const input = c.req.valid("json");

		const container = getContainer();
		const loan = await container.loanRepo.findById(user.id, id);
		if (!loan) throw notFound("Loan not found");

		const [current] = await loadStats(user.id, [loan]);
		const amount = input.amount ?? Math.max(current.remainingAmount, 0);
		if (amount <= 0) {
			throw new HTTPException(400, {
				message: "Nothing left to settle on this loan",
			});
		}

		const settlementTransactionId = await createLinkedTransaction(user.id, {
			loanId: loan.id,
			direction: loan.direction,
			isOrigin: false,
			amount,
			transactionDate: input.transactionDate
				? new Date(input.transactionDate)
				: new Date(),
			merchant: `${loan.direction === "given" ? "Repayment from" : "Repayment to"} ${loan.counterpartyName}`,
			categoryId: input.categoryId ?? null,
			remarks: input.remarks ?? null,
		});

		const refreshed = (await container.loanRepo.findById(user.id, id)) ?? loan;
		const [stats] = await loadStats(user.id, [refreshed]);

		return c.json({ loan: stats, settlementTransactionId }, 201);
	});
