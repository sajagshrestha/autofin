import { and, asc, eq, inArray, sql } from "drizzle-orm";
import {
	type LoanCounterparty,
	loanCounterparties,
	loans,
	type NewLoanCounterparty,
} from "@/server/db/schema";
import { BaseRepository } from "./base.repository";

export interface CounterpartyWithLoanCounts extends LoanCounterparty {
	/** Loans referencing this counterparty (any status — status is derived). */
	totalLoans: number;
}

export class CounterpartyRepository extends BaseRepository {
	async findAllForUser(userId: string): Promise<CounterpartyWithLoanCounts[]> {
		const rows = await this.db
			.select({
				id: loanCounterparties.id,
				userId: loanCounterparties.userId,
				name: loanCounterparties.name,
				notes: loanCounterparties.notes,
				createdAt: loanCounterparties.createdAt,
				updatedAt: loanCounterparties.updatedAt,
				totalLoans: sql<number>`COUNT(${loans.id})::int`,
			})
			.from(loanCounterparties)
			.leftJoin(loans, eq(loans.counterpartyId, loanCounterparties.id))
			.where(eq(loanCounterparties.userId, userId))
			.groupBy(loanCounterparties.id)
			.orderBy(asc(sql`lower(${loanCounterparties.name})`));
		return rows;
	}

	async findById(userId: string, id: string): Promise<LoanCounterparty | null> {
		const rows = await this.db
			.select()
			.from(loanCounterparties)
			.where(
				and(
					eq(loanCounterparties.id, id),
					eq(loanCounterparties.userId, userId),
				),
			)
			.limit(1);
		return rows[0] ?? null;
	}

	/** Batch lookup scoped to the user (for resolving loan counterparties). */
	async findManyByIds(
		userId: string,
		ids: string[],
	): Promise<LoanCounterparty[]> {
		if (ids.length === 0) return [];
		return this.db
			.select()
			.from(loanCounterparties)
			.where(
				and(
					eq(loanCounterparties.userId, userId),
					inArray(loanCounterparties.id, [...new Set(ids)]),
				),
			);
	}

	/**
	 * Case-insensitive name lookup scoped to the user. Used for
	 * select-or-create so "Ram" and "ram" resolve to the same row.
	 */
	async findByNameForUser(
		userId: string,
		name: string,
	): Promise<LoanCounterparty | null> {
		const normalized = name.trim().toLowerCase();
		if (!normalized) return null;
		const rows = await this.db
			.select()
			.from(loanCounterparties)
			.where(
				and(
					eq(loanCounterparties.userId, userId),
					sql`lower(trim(${loanCounterparties.name})) = ${normalized}`,
				),
			)
			.limit(1);
		return rows[0] ?? null;
	}

	/** Find-or-create scoped to the user (case-insensitive match). */
	async findOrCreate(userId: string, name: string): Promise<LoanCounterparty> {
		const trimmed = name.trim();
		if (!trimmed) throw new Error("Counterparty name is required");
		const existing = await this.findByNameForUser(userId, trimmed);
		if (existing) return existing;
		const rows = await this.db
			.insert(loanCounterparties)
			.values({ id: crypto.randomUUID(), userId, name: trimmed })
			.returning();
		return rows[0];
	}

	async create(data: NewLoanCounterparty): Promise<LoanCounterparty> {
		const rows = await this.db
			.insert(loanCounterparties)
			.values(data)
			.returning();
		return rows[0];
	}

	async update(
		userId: string,
		id: string,
		data: Partial<Pick<NewLoanCounterparty, "name" | "notes">>,
	): Promise<LoanCounterparty | null> {
		const rows = await this.db
			.update(loanCounterparties)
			.set({ ...data, updatedAt: new Date() })
			.where(
				and(
					eq(loanCounterparties.id, id),
					eq(loanCounterparties.userId, userId),
				),
			)
			.returning();
		return rows[0] ?? null;
	}

	/** Number of loans referencing this counterparty (any status). */
	async countLoans(userId: string, counterpartyId: string): Promise<number> {
		const rows = await this.db
			.select({ count: sql<number>`COUNT(*)::int` })
			.from(loans)
			.where(
				and(eq(loans.userId, userId), eq(loans.counterpartyId, counterpartyId)),
			);
		return Number(rows[0]?.count ?? 0);
	}

	/**
	 * Deletes a counterparty only when no loans reference it.
	 * Returns false when missing; throws when still referenced.
	 */
	async delete(userId: string, id: string): Promise<boolean> {
		if ((await this.countLoans(userId, id)) > 0) {
			throw new Error(
				"Cannot delete a counterparty that still has loans. Delete or reassign its loans first.",
			);
		}
		const rows = await this.db
			.delete(loanCounterparties)
			.where(
				and(
					eq(loanCounterparties.id, id),
					eq(loanCounterparties.userId, userId),
				),
			)
			.returning({ id: loanCounterparties.id });
		return rows.length > 0;
	}
}
