import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import type { Loan, NewLoan } from "@/server/db/schema";
import { categories, loans, transactions } from "@/server/db/schema";
import { BaseRepository } from "./base.repository";

export interface LoanSettlementTotals {
	settledAmount: number;
	settlementCount: number;
}

export class LoanRepository extends BaseRepository {
	async create(data: NewLoan): Promise<Loan> {
		const rows = await this.db.insert(loans).values(data).returning();
		return rows[0];
	}

	async findById(userId: string, id: string): Promise<Loan | null> {
		const rows = await this.db
			.select()
			.from(loans)
			.where(and(eq(loans.id, id), eq(loans.userId, userId)))
			.limit(1);
		return rows[0] ?? null;
	}

	async findAllForUser(userId: string): Promise<Loan[]> {
		return this.db
			.select()
			.from(loans)
			.where(eq(loans.userId, userId))
			.orderBy(desc(loans.createdAt));
	}

	async update(
		userId: string,
		id: string,
		data: Partial<
			Pick<
				NewLoan,
				"counterpartyName" | "principalAmount" | "dueDate" | "notes"
			>
		>,
	): Promise<Loan | null> {
		const rows = await this.db
			.update(loans)
			.set({ ...data, updatedAt: new Date() })
			.where(and(eq(loans.id, id), eq(loans.userId, userId)))
			.returning();
		return rows[0] ?? null;
	}

	async delete(userId: string, id: string): Promise<boolean> {
		const rows = await this.db
			.delete(loans)
			.where(and(eq(loans.id, id), eq(loans.userId, userId)))
			.returning({ id: loans.id });
		return rows.length > 0;
	}

	/**
	 * Settlement totals per loan id: sum of every repayment transaction linked
	 * via transactions.loanId. The loan's ORIGIN transaction is excluded so a
	 * newly created loan starts at zero. Missing ids resolve to zero.
	 */
	async getSettlementTotals(
		userId: string,
		items: Array<{ loanId: string; excludeTransactionId?: string | null }>,
	): Promise<Map<string, LoanSettlementTotals>> {
		const map = new Map<string, LoanSettlementTotals>();
		if (items.length === 0) return map;

		const loanIds = items.map((item) => item.loanId);
		const rows = await this.db
			.select({
				id: transactions.id,
				loanId: transactions.loanId,
				total: transactions.amount,
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.userId, userId),
					inArray(transactions.loanId, loanIds),
				),
			);

		const exclusions = new Map(
			items.map((item) => [item.loanId, item.excludeTransactionId ?? null]),
		);

		for (const row of rows) {
			if (!row.loanId) continue;
			if (exclusions.get(row.loanId) === row.id) continue; // skip origin
			const entry = map.get(row.loanId) ?? {
				settledAmount: 0,
				settlementCount: 0,
			};
			entry.settledAmount += Number.parseFloat(row.total || "0");
			entry.settlementCount += 1;
			map.set(row.loanId, entry);
		}
		return map;
	}

	/** Settlement transactions for one loan (origin excluded), oldest first. */
	async findSettlements(userId: string, loan: Loan) {
		const rows = await this.db
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
				isAiCreated: transactions.isAiCreated,
				createdAt: transactions.createdAt,
				updatedAt: transactions.updatedAt,
				categoryName: categories.name,
				categoryIcon: categories.icon,
			})
			.from(transactions)
			.leftJoin(categories, eq(transactions.categoryId, categories.id))
			.where(
				and(
					eq(transactions.userId, userId),
					eq(transactions.loanId, loan.id),
					loan.transactionId
						? ne(transactions.id, loan.transactionId)
						: undefined,
				),
			)
			.orderBy(asc(transactions.transactionDate), asc(transactions.createdAt));

		return rows.map((row) => ({
			id: row.id,
			amount: row.amount,
			type: row.type as "debit" | "credit",
			currency: row.currency ?? null,
			transactionDate: row.transactionDate?.toISOString() ?? null,
			merchant: row.merchant,
			remarks: row.remarks,
			category: row.categoryName
				? { name: row.categoryName, icon: row.categoryIcon }
				: null,
			createdAt: row.createdAt.toISOString(),
		}));
	}

	async countByOriginTransaction(
		userId: string,
		transactionId: string,
	): Promise<number> {
		const rows = await this.db
			.select({ id: loans.id })
			.from(loans)
			.where(
				and(eq(loans.userId, userId), eq(loans.transactionId, transactionId)),
			)
			.limit(1);
		return rows.length;
	}
	/** Attach the origin transaction to a freshly created loan. */
	/** Point a transaction at a loan (sets transactions.loanId). */
	async linkTransactionToLoan(
		userId: string,
		loanId: string,
		transactionId: string,
	): Promise<void> {
		await this.db
			.update(transactions)
			.set({ loanId })
			.where(
				and(
					eq(transactions.userId, userId),
					eq(transactions.id, transactionId),
				),
			);
	}

	async linkOriginTransaction(
		userId: string,
		loanId: string,
		transactionId: string,
	): Promise<void> {
		await this.linkTransactionToLoan(userId, loanId, transactionId);
		await this.db
			.update(loans)
			.set({ transactionId, updatedAt: new Date() })
			.where(and(eq(loans.userId, userId), eq(loans.id, loanId)));
	}
}
