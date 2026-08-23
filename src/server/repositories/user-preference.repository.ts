import { eq } from "drizzle-orm";
import type { NewUserPreference, UserPreference } from "@/server/db/schema";
import { userPreferences } from "@/server/db/schema";
import { BaseRepository } from "./base.repository";

export class UserPreferenceRepository extends BaseRepository {
	async findByUserId(userId: string): Promise<UserPreference | null> {
		const rows = await this.db
			.select()
			.from(userPreferences)
			.where(eq(userPreferences.userId, userId))
			.limit(1);
		return rows[0] ?? null;
	}

	async findByUserIdOrCreate(userId: string): Promise<UserPreference> {
		const existing = await this.findByUserId(userId);
		if (existing) return existing;
		return this.upsert(userId, {});
	}

	async upsert(
		userId: string,
		data: Partial<Pick<NewUserPreference, "categoryMappingPrompt">>,
	): Promise<UserPreference> {
		const rows = await this.db
			.insert(userPreferences)
			.values({
				userId,
				categoryMappingPrompt: data.categoryMappingPrompt ?? null,
			})
			.onConflictDoUpdate({
				target: userPreferences.userId,
				set: {
					categoryMappingPrompt: data.categoryMappingPrompt ?? null,
					updatedAt: new Date(),
				},
			})
			.returning();
		return rows[0];
	}
}
