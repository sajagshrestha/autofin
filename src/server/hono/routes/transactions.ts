import { zValidator as zv } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";
import { toTransactionDto } from "@/server/lib/dto";
import { filterDateToUtc, localToUtc } from "@/server/lib/timezone";
import type { DuplicateMatch } from "@/server/repositories/transaction.repository";

const transactionTypeSchema = z.enum(["debit", "credit"]);

const createSchema = z.object({
	amount: z.number().positive(),
	type: transactionTypeSchema,
	categoryId: z.string().optional(),
	merchant: z.string().max(255).optional(),
	remarks: z.string().max(500).optional(),
	transactionDate: z.iso.datetime().optional(),
});

const smsSchema = z.object({
	smsBody: z.string().min(10),
	sender: z.string().optional(),
});

const updateSchema = z.object({
	categoryId: z.string().optional(),
	merchant: z.string().max(255).optional(),
	remarks: z.string().max(500).optional(),
	transactionDate: z.iso.datetime().optional(),
});

/**
 * Query-string-friendly number: accepts "10" or 10, validates the result,
 * and keeps the RPC client's input type honest (string | number).
 */
const queryNumber = (min: number, max = Number.MAX_SAFE_INTEGER) =>
	z
		.union([z.string(), z.number()])
		.transform((v) => Number(v))
		.pipe(z.number().min(min).max(max));

const filtersSchema = z.object({
	categoryId: z.string().optional(),
	type: transactionTypeSchema.optional(),
	startDate: z.iso.datetime().optional(),
	endDate: z.iso.datetime().optional(),
	timezone: z.string().optional(),
	minAmount: queryNumber(0).optional(),
	maxAmount: queryNumber(0).optional(),
	limit: queryNumber(1, 500).default(100),
	offset: queryNumber(0).default(0),
});

const bulkImportSchema = z.object({
	transactions: z
		.array(
			z.object({
				amount: z.number().positive(),
				type: transactionTypeSchema,
				merchant: z.string().max(255).optional(),
				remarks: z.string().max(500).optional(),
				transactionDate: z.iso.datetime().optional(),
				categoryId: z.string().optional(),
				confidence: z.number().min(0).max(1).optional(),
			}),
		)
		.min(1)
		.max(200),
	allowDuplicates: z.boolean().optional(),
});

function notFound(message: string): HTTPException {
	return new HTTPException(404, { message });
}

function serializeDuplicate(match: DuplicateMatch) {
	return {
		id: match.id,
		amount: match.amount,
		type: match.type,
		transactionDate: match.transactionDate?.toISOString() ?? null,
		merchant: match.merchant,
	};
}

/** Non-blocking duplicate check for a single candidate row. */
async function checkDuplicate(
	userId: string,
	candidate: {
		type: "debit" | "credit";
		amount: number;
		transactionDate: Date | null;
	},
): Promise<DuplicateMatch | null> {
	if (!candidate.transactionDate) return null;
	const container = getContainer();
	const [match] = await container.transactionRepo.findPotentialDuplicates(
		userId,
		[
			{
				type: candidate.type,
				amount: candidate.amount,
				transactionDate: candidate.transactionDate,
			},
		],
	);
	return match;
}

/**
 * Protected transactions API. Chained so the RPC client can infer every route.
 */
export const transactionsRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/", zv("query", filtersSchema), async (c) => {
		const user = c.get("user");
		const query = c.req.valid("query");
		const container = getContainer();

		const userRecord = await container.userRepo.findById(user.id);
		const tz = query.timezone ?? userRecord?.timezone ?? "Asia/Kathmandu";

		const repoFilters = {
			categoryId: query.categoryId,
			type: query.type,
			minAmount: query.minAmount,
			maxAmount: query.maxAmount,
			startDate: query.startDate
				? filterDateToUtc(query.startDate, tz)
				: undefined,
			endDate: query.endDate ? filterDateToUtc(query.endDate, tz) : undefined,
		};

		const [transactions, total] = await Promise.all([
			container.transactionRepo.findAllForUser(
				user.id,
				repoFilters,
				query.limit,
				query.offset,
			),
			container.transactionRepo.countForUser(user.id, repoFilters),
		]);

		return c.json(
			{
				transactions: transactions.map(toTransactionDto),
				total,
				limit: query.limit,
				offset: query.offset,
			},
			200,
		);
	})

	.get("/summary", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const startDate = c.req.query("startDate");
		const endDate = c.req.query("endDate");

		const userRecord = await container.userRepo.findById(user.id);
		const tz = userRecord?.timezone ?? "Asia/Kathmandu";

		const summary = await container.transactionRepo.getSummaryForUser(
			user.id,
			startDate ? filterDateToUtc(startDate, tz) : undefined,
			endDate ? filterDateToUtc(endDate, tz) : undefined,
		);

		return c.json({
			summary: {
				...summary,
				netAmount: summary.totalCredit - summary.totalDebit,
			},
		});
	})

	.get("/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const container = getContainer();

		const transaction =
			await container.transactionRepo.findByIdWithCategory(id);
		if (!transaction || transaction.userId !== user.id) {
			throw notFound("Transaction not found");
		}

		return c.json({ transaction: toTransactionDto(transaction) });
	})

	.post("/", zv("json", createSchema), async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");
		const container = getContainer();

		const userRecord = await container.userRepo.findById(user.id);
		const userTimezone = userRecord?.timezone ?? "Asia/Kathmandu";

		const transactionDate = body.transactionDate
			? filterDateToUtc(body.transactionDate, userTimezone)
			: new Date();

		const duplicateMatch = await checkDuplicate(user.id, {
			type: body.type,
			amount: body.amount,
			transactionDate,
		});

		const created = await container.transactionRepo.create({
			id: crypto.randomUUID(),
			userId: user.id,
			amount: body.amount.toString(),
			type: body.type,
			categoryId: body.categoryId,
			merchant: body.merchant,
			remarks: body.remarks,
			transactionDate,
			currency: "NPR",
			isAiCreated: false,
		});

		const withCategory = await container.transactionRepo.findByIdWithCategory(
			created.id,
		);
		if (!withCategory) {
			throw new HTTPException(500, {
				message: "Failed to retrieve created transaction",
			});
		}

		void container.discordService.notifyNewTransaction({
			id: withCategory.id,
			amount: withCategory.amount,
			type: withCategory.type as "debit" | "credit",
			merchant: withCategory.merchant,
			source: "api",
			category: withCategory.category?.name ?? null,
			transactionDate: withCategory.transactionDate?.toISOString() ?? null,
		});

		return c.json(
			{
				transaction: toTransactionDto(withCategory),
				duplicateOf: duplicateMatch ? serializeDuplicate(duplicateMatch) : null,
			},
			201,
		);
	})

	.post("/sms", zv("json", smsSchema), async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");
		const container = getContainer();

		const categories = await container.categoryRepo.findAllForUser(user.id);
		const categoryInfoForAI = categories.map((cat) => ({
			id: cat.id,
			name: cat.name,
			icon: cat.icon,
		}));

		const extractionResult =
			await container.transactionExtractor.extractFromSms(
				{ body: body.smsBody, sender: body.sender },
				categoryInfoForAI,
			);

		if (
			!container.transactionExtractor.isValidTransaction(extractionResult) ||
			!extractionResult.transaction
		) {
			throw new HTTPException(400, {
				message: "Could not extract valid transaction from SMS",
			});
		}

		const txn = extractionResult.transaction;
		let categoryId = txn.categoryId;

		if (txn.newCategory) {
			try {
				const existing = await container.categoryRepo.findByNameForUser(
					txn.newCategory.name,
					user.id,
				);

				if (existing) {
					categoryId = existing.id;
				} else {
					const newCat = await container.categoryRepo.create({
						id: crypto.randomUUID(),
						userId: user.id,
						name: txn.newCategory.name,
						icon: txn.newCategory.icon,
						isDefault: false,
						isAiCreated: true,
					});
					categoryId = newCat.id;
				}
			} catch (err) {
				console.warn("Failed to create AI category:", err);
				const existing = await container.categoryRepo.findByNameForUser(
					txn.newCategory.name,
					user.id,
				);
				if (existing) categoryId = existing.id;
			}
		}

		const userRecord = await container.userRepo.findById(user.id);
		const userTimezone = userRecord?.timezone ?? "Asia/Kathmandu";

		let transactionDate: Date | null = null;
		if (txn.date) {
			try {
				transactionDate = localToUtc(txn.date, txn.time ?? null, userTimezone);
			} catch {
				console.warn(`Failed to parse SMS transaction date: ${txn.date}`);
			}
		}

		const duplicateMatch = await checkDuplicate(user.id, {
			type: txn.type,
			amount: txn.amount,
			transactionDate,
		});

		const created = await container.transactionRepo.create({
			id: crypto.randomUUID(),
			userId: user.id,
			categoryId,
			amount: txn.amount.toString(),
			type: txn.type,
			currency: "NPR",
			merchant: txn.merchant,
			accountNumber: txn.accountLastFour,
			bankName: txn.bankName,
			transactionDate,
			remarks: txn.remarks,
			aiConfidence: txn.confidence.toString(),
			aiExtractedData: extractionResult,
			isAiCreated: true,
		});

		const withCategory = await container.transactionRepo.findByIdWithCategory(
			created.id,
		);
		if (!withCategory) {
			throw new HTTPException(500, {
				message: "Failed to retrieve created transaction",
			});
		}

		void container.discordService.notifyNewTransaction({
			id: withCategory.id,
			amount: withCategory.amount,
			type: withCategory.type as "debit" | "credit",
			merchant: withCategory.merchant,
			source: "api_sms",
			category: withCategory.category?.name ?? null,
			transactionDate: withCategory.transactionDate?.toISOString() ?? null,
		});

		return c.json(
			{
				transaction: toTransactionDto(withCategory),
				duplicateOf: duplicateMatch ? serializeDuplicate(duplicateMatch) : null,
			},
			201,
		);
	})

	.patch("/:id", zv("json", updateSchema), async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const container = getContainer();

		const userRecord = await container.userRepo.findById(user.id);
		const userTimezone = userRecord?.timezone ?? "Asia/Kathmandu";

		const updated = await container.transactionRepo.update(id, user.id, {
			...body,
			transactionDate: body.transactionDate
				? filterDateToUtc(body.transactionDate, userTimezone)
				: undefined,
		});

		if (!updated) throw notFound("Transaction not found");

		const transaction =
			await container.transactionRepo.findByIdWithCategory(id);
		if (!transaction) throw notFound("Transaction not found");

		return c.json({ transaction: toTransactionDto(transaction) });
	})

	.delete("/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const container = getContainer();

		const deleted = await container.transactionRepo.delete(id, user.id);
		if (!deleted) throw notFound("Transaction not found");

		return c.json({ message: "Transaction deleted successfully" });
	})

	.post("/bulk-import", zv("json", bulkImportSchema), async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");
		const container = getContainer();

		// Duplicate prevention: same type + amount (±cent) within 24h of an
		// existing transaction is treated as a duplicate unless the caller
		// explicitly overrides after review.
		if (!body.allowDuplicates) {
			const candidates = body.transactions
				.filter((row) => row.transactionDate)
				.map((row) => ({
					type: row.type,
					amount: row.amount,
					transactionDate: new Date(row.transactionDate as string),
				}));
			const matches = await container.transactionRepo.findPotentialDuplicates(
				user.id,
				candidates,
			);
			const dupCount = matches.filter(Boolean).length;

			if (dupCount > 0) {
				throw new HTTPException(409, {
					message: `${dupCount} duplicate transaction${dupCount !== 1 ? "s" : ""} detected (same amount within 24h of an existing one). Review them in the import preview or retry with allowDuplicates.`,
				});
			}
		}

		// Only allow assigning categories the user can see (predefined + own).
		const visibleCategories = await container.categoryRepo.findAllForUser(
			user.id,
		);
		const validCategoryIds = new Set(visibleCategories.map((cat) => cat.id));

		const createdIds: string[] = [];
		for (const row of body.transactions) {
			const categoryId =
				row.categoryId && validCategoryIds.has(row.categoryId)
					? row.categoryId
					: undefined;

			const transaction = await container.transactionRepo.create({
				id: crypto.randomUUID(),
				userId: user.id,
				categoryId,
				amount: row.amount.toString(),
				type: row.type,
				currency: "NPR",
				merchant: row.merchant,
				remarks: row.remarks,
				transactionDate: row.transactionDate
					? new Date(row.transactionDate)
					: null,
				aiConfidence:
					row.confidence !== undefined ? row.confidence.toString() : null,
				isAiCreated: true,
			});
			createdIds.push(transaction.id);

			void container.discordService.notifyNewTransaction({
				id: transaction.id,
				amount: row.amount.toString(),
				type: row.type,
				merchant: row.merchant ?? null,
				source: "import",
				transactionDate: row.transactionDate ?? null,
			});
		}

		const transactions = await Promise.all(
			createdIds.map(async (id) => {
				const txn = await container.transactionRepo.findByIdWithCategory(id);
				return txn ? toTransactionDto(txn) : null;
			}),
		);

		return c.json(
			{
				created: createdIds.length,
				transactions: transactions.filter((t) => t !== null),
			},
			201,
		);
	});
