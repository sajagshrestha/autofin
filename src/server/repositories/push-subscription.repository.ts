import { and, eq } from "drizzle-orm";
import type { PushSubscription } from "@/server/db/schema";
import { pushSubscriptions } from "@/server/db/schema";
import { BaseRepository } from "./base.repository";

export interface PushSubscriptionInput {
	endpoint: string;
	p256dh: string;
	auth: string;
	userAgent?: string | null;
}

export class PushSubscriptionRepository extends BaseRepository {
	/**
	 * Insert a browser push subscription for a user. Endpoints are unique, so
	 * re-registering the same device (e.g. after a VAPID key refresh) updates
	 * the existing row instead of creating a duplicate.
	 */
	async upsert(
		userId: string,
		input: PushSubscriptionInput,
	): Promise<PushSubscription> {
		const rows = await this.db
			.insert(pushSubscriptions)
			.values({
				id: crypto.randomUUID(),
				userId,
				endpoint: input.endpoint,
				p256dh: input.p256dh,
				auth: input.auth,
				userAgent: input.userAgent ?? null,
			})
			.onConflictDoUpdate({
				target: pushSubscriptions.endpoint,
				set: {
					userId,
					p256dh: input.p256dh,
					auth: input.auth,
					userAgent: input.userAgent ?? null,
					updatedAt: new Date(),
				},
			})
			.returning();
		return rows[0];
	}

	async findAllForUser(userId: string): Promise<PushSubscription[]> {
		return this.db
			.select()
			.from(pushSubscriptions)
			.where(eq(pushSubscriptions.userId, userId))
			.orderBy(pushSubscriptions.createdAt);
	}

	async findById(id: string): Promise<PushSubscription | null> {
		const rows = await this.db
			.select()
			.from(pushSubscriptions)
			.where(eq(pushSubscriptions.id, id))
			.limit(1);
		return rows[0] ?? null;
	}

	async delete(id: string, userId: string): Promise<boolean> {
		const rows = await this.db
			.delete(pushSubscriptions)
			.where(
				and(eq(pushSubscriptions.id, id), eq(pushSubscriptions.userId, userId)),
			)
			.returning();
		return rows.length > 0;
	}

	/** Remove subscriptions the push service reports as gone (410/404). */
	async deleteByEndpoint(endpoint: string): Promise<void> {
		await this.db
			.delete(pushSubscriptions)
			.where(eq(pushSubscriptions.endpoint, endpoint));
	}
}
