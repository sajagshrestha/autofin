import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";

const subscriptionSchema = z.object({
	endpoint: z.string().url().max(2048),
	p256dh: z.string().min(1).max(1024),
	auth: z.string().min(1).max(1024),
	userAgent: z.string().max(512).optional(),
});

/**
 * Browser Web Push subscription management (PWA notifications).
 *
 * The client registers its `PushSubscription` here so the server can send
 * notifications (e.g. a "statement imported" push) to the user's devices.
 */
export const pushRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/subscriptions", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const subscriptions = await container.pushSubscriptionRepo.findAllForUser(
			user.id,
		);

		return c.json({
			subscriptions: subscriptions.map((sub) => ({
				id: sub.id,
				endpoint: sub.endpoint,
				userAgent: sub.userAgent,
				createdAt: sub.createdAt.toISOString(),
			})),
		});
	})

	.post("/subscriptions", zValidator("json", subscriptionSchema), async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");
		const container = getContainer();

		const saved = await container.pushSubscriptionRepo.upsert(user.id, {
			endpoint: body.endpoint,
			p256dh: body.p256dh,
			auth: body.auth,
			userAgent: body.userAgent,
		});

		return c.json(
			{
				id: saved.id,
				endpoint: saved.endpoint,
				userAgent: saved.userAgent,
				createdAt: saved.createdAt.toISOString(),
			},
			201,
		);
	})

	.delete("/subscriptions/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const container = getContainer();

		const deleted = await container.pushSubscriptionRepo.delete(id, user.id);
		if (!deleted) {
			throw new HTTPException(404, { message: "Subscription not found" });
		}

		return c.json({ message: "Subscription removed" });
	})

	.post("/test", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		await container.pushService.sendToUser(user.id, {
			title: "AutoFin",
			body: "Push notifications are working.",
			url: "/",
		});

		return c.json({ message: "Test notification sent" });
	});
