import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import {
	categories,
	type NewTransaction,
	type Transaction,
	transactions,
} from "@/server/db/schema";
import { BaseRepository } from "./base.repository";

export interface TransactionFilters {
	categoryId?: string;
	type?: "debit" | "credit";
	startDate?: Date;
	endDate?: Date;
	minAmount?: number;
	maxAmount?: number;
}

export interface TransactionWithCategory extends Transaction {
	category: { id: string; name: string; icon: string | null } | null;
}

export interface DuplicateCandidate {
	type: "debit" | "credit";
	/** Exact numeric amount */
	amount: number;
	/** Rows without a parsable date never match */
	transactionDate: Date | null;
}

export interface DuplicateMatch {
	id: string;
	amount: string;
	type: string;
	transactionDate: Date | null;
	merchant: string | null;
}

export class TransactionRepository extends BaseRepository {
	/**
	 * Find all transactions for a user with optional filters
	 */
	async findAllForUser(
		userId: string,
		filters?: TransactionFilters,
		limit = 50,
		offset = 0,
	): Promise<TransactionWithCategory[]> {
		const conditions = [eq(transactions.userId, userId)];

		if (filters?.categoryId) {
			conditions.push(eq(transactions.categoryId, filters.categoryId));
		}

		if (filters?.type) {
			conditions.push(eq(transactions.type, filters.type));
		}

		if (filters?.startDate) {
			conditions.push(gte(transactions.transactionDate, filters.startDate));
		}

		if (filters?.endDate) {
			conditions.push(lte(transactions.transactionDate, filters.endDate));
		}

		if (filters?.minAmount !== undefined) {
			conditions.push(gte(transactions.amount, filters.minAmount.toString()));
		}

		if (filters?.maxAmount !== undefined) {
			conditions.push(lte(transactions.amount, filters.maxAmount.toString()));
		}

		const result = await this.db
			.select({
				id: transactions.id,
				userId: transactions.userId,
				categoryId: transactions.categoryId,
				amount: transactions.amount,
				type: transactions.type,
				currency: transactions.currency,
				merchant: transactions.merchant,
				accountNumber: transactions.accountNumber,
				bankName: transactions.bankName,
				transactionDate: transactions.transactionDate,
				remarks: transactions.remarks,
				emailId: transactions.emailId,
				isAiCreated: transactions.isAiCreated,
				rawEmailContent: transactions.rawEmailContent,
				aiConfidence: transactions.aiConfidence,
				aiExtractedData: transactions.aiExtractedData,
				createdAt: transactions.createdAt,
				updatedAt: transactions.updatedAt,
				category: {
					id: categories.id,
					name: categories.name,
					icon: categories.icon,
				},
			})
			.from(transactions)
			.leftJoin(categories, eq(transactions.categoryId, categories.id))
			.where(and(...conditions))
			.orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
			.limit(limit)
			.offset(offset);

		return result as TransactionWithCategory[];
	}

	/**
	 * Find a transaction by ID
	 */
	async findById(id: string): Promise<Transaction | null> {
		const result = await this.db
			.select()
			.from(transactions)
			.where(eq(transactions.id, id))
			.limit(1);
		return result[0] || null;
	}

	/**
	 * Find a transaction by ID with category info
	 */
	async findByIdWithCategory(
		id: string,
	): Promise<TransactionWithCategory | null> {
		const result = await this.db
			.select({
				id: transactions.id,
				userId: transactions.userId,
				categoryId: transactions.categoryId,
				amount: transactions.amount,
				type: transactions.type,
				currency: transactions.currency,
				merchant: transactions.merchant,
				accountNumber: transactions.accountNumber,
				bankName: transactions.bankName,
				transactionDate: transactions.transactionDate,
				remarks: transactions.remarks,
				emailId: transactions.emailId,
				isAiCreated: transactions.isAiCreated,
				rawEmailContent: transactions.rawEmailContent,
				aiConfidence: transactions.aiConfidence,
				aiExtractedData: transactions.aiExtractedData,
				createdAt: transactions.createdAt,
				updatedAt: transactions.updatedAt,
				category: {
					id: categories.id,
					name: categories.name,
					icon: categories.icon,
				},
			})
			.from(transactions)
			.leftJoin(categories, eq(transactions.categoryId, categories.id))
			.where(eq(transactions.id, id))
			.limit(1);

		return (result[0] as TransactionWithCategory) || null;
	}

	/**
	 * Find a transaction by email ID (for duplicate detection)
	 */
	async findByEmailId(emailId: string): Promise<Transaction | null> {
		const result = await this.db
			.select()
			.from(transactions)
			.where(eq(transactions.emailId, emailId))
			.limit(1);
		return result[0] || null;
	}

	/**
	 * Create a new transaction
	 */
	async create(data: NewTransaction): Promise<Transaction> {
		const result = await this.db.insert(transactions).values(data).returning();
		return result[0];
	}

	/**
	 * Update a transaction
	 */
	async update(
		id: string,
		userId: string,
		data: Partial<
			Pick<
				NewTransaction,
				"categoryId" | "merchant" | "remarks" | "transactionDate"
			>
		>,
	): Promise<Transaction | null> {
		const result = await this.db
			.update(transactions)
			.set({ ...data, updatedAt: new Date() })
			.where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
			.returning();
		return result[0] || null;
	}

	/**
	 * Delete a transaction
	 */
	async delete(id: string, userId: string): Promise<boolean> {
		const result = await this.db
			.delete(transactions)
			.where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
			.returning();
		return result.length > 0;
	}

	/**
	 * Count transactions for a user with optional filters
	 */
	async countForUser(
		userId: string,
		filters?: TransactionFilters,
	): Promise<number> {
		const conditions = [eq(transactions.userId, userId)];

		if (filters?.categoryId) {
			conditions.push(eq(transactions.categoryId, filters.categoryId));
		}

		if (filters?.type) {
			conditions.push(eq(transactions.type, filters.type));
		}

		if (filters?.startDate) {
			conditions.push(gte(transactions.transactionDate, filters.startDate));
		}

		if (filters?.endDate) {
			conditions.push(lte(transactions.transactionDate, filters.endDate));
		}

		const result = await this.db
			.select({ count: sql<number>`count(*)` })
			.from(transactions)
			.where(and(...conditions));

		return Number(result[0]?.count || 0);
	}

	/**
	 * Get summary statistics for a user
	 */
	async getSummaryForUser(
		userId: string,
		startDate?: Date,
		endDate?: Date,
	): Promise<{
		totalDebit: number;
		totalCredit: number;
		transactionCount: number;
	}> {
		const conditions = [eq(transactions.userId, userId)];

		if (startDate) {
			conditions.push(gte(transactions.transactionDate, startDate));
		}

		if (endDate) {
			conditions.push(lte(transactions.transactionDate, endDate));
		}

		const result = await this.db
			.select({
				totalDebit: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'debit' THEN ${transactions.amount} ELSE 0 END), 0)`,
				totalCredit: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'credit' THEN ${transactions.amount} ELSE 0 END), 0)`,
				transactionCount: sql<number>`count(*)`,
			})
			.from(transactions)
			.where(and(...conditions));

		return {
			totalDebit: Number.parseFloat(result[0]?.totalDebit || "0"),
			totalCredit: Number.parseFloat(result[0]?.totalCredit || "0"),
			transactionCount: Number(result[0]?.transactionCount || 0),
		};
	}

	/**
	 * Total spending (debit) grouped by category, largest first.
	 * Includes uncategorized rows under a null category.
	 */
	async getSpendingByCategory(
		userId: string,
		startDate?: Date,
		endDate?: Date,
	): Promise<
		Array<{
			categoryId: string | null;
			name: string;
			icon: string | null;
			total: number;
		}>
	> {
		const conditions = [
			eq(transactions.userId, userId),
			eq(transactions.type, "debit"),
		];
		if (startDate)
			conditions.push(gte(transactions.transactionDate, startDate));
		if (endDate) conditions.push(lte(transactions.transactionDate, endDate));

		const rows = await this.db
			.select({
				categoryId: categories.id,
				name: categories.name,
				icon: categories.icon,
				total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
			})
			.from(transactions)
			.leftJoin(categories, eq(transactions.categoryId, categories.id))
			.where(and(...conditions))
			.groupBy(categories.id, categories.name, categories.icon)
			.orderBy(sql`SUM(${transactions.amount}) DESC`);

		return rows.map((row) => ({
			categoryId: row.categoryId,
			name: row.name ?? "Uncategorized",
			icon: row.icon,
			total: Number.parseFloat(row.total || "0"),
		}));
	}

	/**
	 * Per-month income vs expenses for the trailing `months` months
	 * (including the current one), oldest first. Months are calendar months in UTC.
	 */
	async getMonthlyTrend(
		userId: string,
		months = 6,
	): Promise<Array<{ month: string; income: number; expenses: number }>> {
		const rows = await this.db
			.select({
				month: sql<string>`to_char(date_trunc('month', ${transactions.transactionDate}), 'YYYY-MM')`,
				income: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'credit' THEN ${transactions.amount} ELSE 0 END), 0)`,
				expenses: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'debit' THEN ${transactions.amount} ELSE 0 END), 0)`,
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.userId, userId),
					gte(
						transactions.transactionDate,
						sql`date_trunc('month', now()) - make_interval(months => ${months - 1})`,
					),
				),
			)
			.groupBy(sql`date_trunc('month', ${transactions.transactionDate})`)
			.orderBy(sql`date_trunc('month', ${transactions.transactionDate}) ASC`);

		return rows.map((row) => ({
			month: row.month,
			income: Number.parseFloat(row.income || "0"),
			expenses: Number.parseFloat(row.expenses || "0"),
		}));
	}
	/**
	 * Detect likely duplicates for the given candidates: same user, same type,
	 * amount within a cent, and transaction date within `windowHours`
	 * (default 24h — covers timezone/day-boundary differences between
	 * statement dates and bank alert timestamps).
	 *
	 * Returns one entry per candidate (null = no duplicate), index-aligned.
	 */
	async findPotentialDuplicates(
		userId: string,
		candidates: DuplicateCandidate[],
		options?: { windowHours?: number },
	): Promise<Array<DuplicateMatch | null>> {
		const windowMs = (options?.windowHours ?? 24) * 60 * 60 * 1000;
		const none = (): Array<DuplicateMatch | null> => candidates.map(() => null);

		const dated = candidates.filter(
			(c): c is DuplicateCandidate & { transactionDate: Date } =>
				c.transactionDate !== null &&
				Number.isFinite(c.transactionDate.getTime()),
		);
		if (dated.length === 0) return none();

		const times = dated.map((c) => c.transactionDate.getTime());
		const rangeStart = new Date(Math.min(...times) - windowMs);
		const rangeEnd = new Date(Math.max(...times) + windowMs);

		const rows = await this.db
			.select({
				id: transactions.id,
				amount: transactions.amount,
				type: transactions.type,
				transactionDate: transactions.transactionDate,
				merchant: transactions.merchant,
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.userId, userId),
					gte(transactions.transactionDate, rangeStart),
					lte(transactions.transactionDate, rangeEnd),
				),
			);

		return candidates.map((candidate) => {
			const candidateTime = candidate.transactionDate?.getTime();
			if (candidateTime === undefined || !Number.isFinite(candidateTime)) {
				return null;
			}
			const match = rows.find(
				(row) =>
					row.type === candidate.type &&
					Math.abs(Number.parseFloat(row.amount) - candidate.amount) < 0.005 &&
					row.transactionDate !== null &&
					Math.abs(row.transactionDate.getTime() - candidateTime) <= windowMs,
			);
			return match ?? null;
		});
	}
}
