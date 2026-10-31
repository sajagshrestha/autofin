import { and, eq, isNull, or, sql } from "drizzle-orm";
import {
	type Category,
	categories,
	merchantCategoryHints,
} from "@/server/db/schema";
import { BaseRepository } from "./base.repository";

export interface MerchantHintEntry {
	merchantKey: string;
	categoryId: string;
}

/**
 * Learned merchant → category mappings, scoped per user.
 *
 * Only user-confirmed categorizations should be written here; AI output must
 * not feed back into its own future decisions.
 */
export class MerchantCategoryHintRepository extends BaseRepository {
	/**
	 * Resolve the remembered category for a merchant key. Categories are
	 * re-checked against the user's visibility so a hint can never leak a
	 * custom category from another account.
	 */
	async findCategory(
		userId: string,
		merchantKey: string,
	): Promise<Category | null> {
		if (!merchantKey) return null;
		const rows = await this.db
			.select({ category: categories })
			.from(merchantCategoryHints)
			.innerJoin(
				categories,
				eq(merchantCategoryHints.categoryId, categories.id),
			)
			.where(
				and(
					eq(merchantCategoryHints.userId, userId),
					eq(merchantCategoryHints.merchantKey, merchantKey),
					or(isNull(categories.userId), eq(categories.userId, userId)),
				),
			)
			.limit(1);
		return rows[0]?.category ?? null;
	}

	/** Record (or reinforce) a single user categorization. */
	async record(
		userId: string,
		merchantKey: string,
		categoryId: string,
	): Promise<void> {
		if (!merchantKey || !categoryId) return;
		await this.upsert(userId, [{ merchantKey, categoryId }]);
	}

	/** Batch variant for reviewed imports. Deduped by merchant key. */
	async recordMany(
		userId: string,
		entries: MerchantHintEntry[],
	): Promise<void> {
		const deduped = new Map<string, string>();
		for (const entry of entries) {
			if (entry.merchantKey && entry.categoryId) {
				deduped.set(entry.merchantKey, entry.categoryId);
			}
		}
		if (deduped.size === 0) return;
		await this.upsert(
			userId,
			[...deduped].map(([merchantKey, categoryId]) => ({
				merchantKey,
				categoryId,
			})),
		);
	}

	/** Forget a merchant (used when the user clears its category). */
	async remove(userId: string, merchantKey: string): Promise<void> {
		if (!merchantKey) return;
		await this.db
			.delete(merchantCategoryHints)
			.where(
				and(
					eq(merchantCategoryHints.userId, userId),
					eq(merchantCategoryHints.merchantKey, merchantKey),
				),
			);
	}

	private async upsert(
		userId: string,
		entries: MerchantHintEntry[],
	): Promise<void> {
		await this.db
			.insert(merchantCategoryHints)
			.values(
				entries.map((entry) => ({
					id: crypto.randomUUID(),
					userId,
					merchantKey: entry.merchantKey,
					categoryId: entry.categoryId,
				})),
			)
			.onConflictDoUpdate({
				target: [
					merchantCategoryHints.userId,
					merchantCategoryHints.merchantKey,
				],
				set: {
					categoryId: sql`excluded.category_id`,
					// Count agreement with the current mapping: changing the
					// category starts a fresh streak.
					hits: sql`CASE WHEN ${merchantCategoryHints.categoryId} = excluded.category_id THEN ${merchantCategoryHints.hits} + 1 ELSE 1 END`,
					updatedAt: new Date(),
				},
			});
	}
}
