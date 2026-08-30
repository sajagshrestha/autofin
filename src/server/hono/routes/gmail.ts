import { zValidator as zv } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { inngest } from "@/server/inngest/client";
import { getContainer } from "@/server/lib/container";

const PUBSUB_TOPIC =
	process.env.GMAIL_PUBSUB_TOPIC ??
	"projects/project-4d4e1b26-7614-4156-a58/topics/autofin";

/**
 * Protected Gmail integration API (connection status, filters, watch).
 * The OAuth redirect endpoint lives on the public router.
 */
export const gmailRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/authorize", async (c) => {
		const user = c.get("user");

		const redirectUri = process.env.GMAIL_OAUTH_REDIRECT_URI;
		const clientId = process.env.GMAIL_CLIENT_ID;
		if (!redirectUri || !clientId) {
			throw new HTTPException(500, {
				message:
					"Gmail OAuth not configured — GMAIL_OAUTH_REDIRECT_URI and GMAIL_CLIENT_ID must be set",
			});
		}

		const scopes = [
			"https://www.googleapis.com/auth/gmail.readonly",
			"https://www.googleapis.com/auth/gmail.modify",
			"https://www.googleapis.com/auth/gmail.settings.basic",
		].join(" ");

		const state = Buffer.from(
			JSON.stringify({ userId: user.id, timestamp: Date.now() }),
		).toString("base64url");

		const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
		authUrl.searchParams.set("client_id", clientId);
		authUrl.searchParams.set("redirect_uri", redirectUri);
		authUrl.searchParams.set("response_type", "code");
		authUrl.searchParams.set("scope", scopes);
		authUrl.searchParams.set("access_type", "offline");
		authUrl.searchParams.set("prompt", "consent");
		authUrl.searchParams.set("state", state);

		return c.json({ authorizationUrl: authUrl.toString(), state });
	})

	.get("/status", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const token = await container.gmailOAuthRepo.findByUserId(user.id);
		if (!token) {
			return c.json({
				authorized: false,
				message: "No Gmail OAuth token found",
			});
		}

		const isValid = await container.gmailOAuthRepo.isTokenValid(token.id);
		const expiresAt = new Date(token.expiresAt);
		const now = new Date();

		return c.json({
			authorized: true,
			emailAddress: token.emailAddress,
			expiresAt:
				token.expiresAt instanceof Date
					? token.expiresAt.toISOString()
					: token.expiresAt,
			isExpired: expiresAt < now,
			isValid,
			scope: token.scope,
			createdAt:
				token.createdAt instanceof Date
					? token.createdAt.toISOString()
					: token.createdAt,
			updatedAt:
				token.updatedAt instanceof Date
					? token.updatedAt.toISOString()
					: token.updatedAt,
		});
	})

	.post("/refresh", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const token = await container.gmailOAuthRepo.findByUserId(user.id);
		if (!token) {
			throw new HTTPException(404, {
				message:
					"No Gmail OAuth token found — please authorize Gmail access first",
			});
		}

		try {
			await container.gmailService.refreshAccessToken(
				user.id,
				token.refreshToken,
			);
			return c.json({
				success: true as const,
				message: "Token refreshed successfully",
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			throw new HTTPException(500, {
				message: `Failed to refresh token — ${message}`,
			});
		}
	})

	.post("/revoke", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const token = await container.gmailOAuthRepo.findByUserId(user.id);
		if (!token) {
			throw new HTTPException(404, { message: "No Gmail OAuth token found" });
		}

		try {
			await fetch("https://oauth2.googleapis.com/revoke", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({ token: token.refreshToken }),
			});
		} catch (error) {
			console.error("Error revoking token with Google:", error);
		}

		await container.gmailOAuthRepo.deleteByUserId(user.id);
		return c.json({
			success: true as const,
			message: "Gmail account disconnected",
		});
	})

	.get("/filters/senders", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const emails = await container.gmailOAuthRepo.getFilterSenderEmails(
			user.id,
		);
		return c.json({ filterId: emails.length > 0 ? "configured" : "", emails });
	})

	.post(
		"/filters/senders",
		zv("json", z.object({ emails: z.array(z.string().email()) })),
		async (c) => {
			const user = c.get("user");
			const body = c.req.valid("json");
			const container = getContainer();

			const result = await container.gmailService.setSenderFilterEmails(
				user.id,
				body.emails,
			);

			return c.json({ filterId: result.filterId, emails: body.emails });
		},
	)

	.delete("/filters/senders", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		await container.gmailService.setSenderFilterEmails(user.id, []);
		return c.json({
			success: true as const,
			message: "Sender filter deleted successfully",
		});
	})

	.post("/watch/start", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const labelIds = await container.gmailService.getWatchLabelIds(user.id);
		const response = await container.gmailService.startWatchAndPersist(
			user.id,
			PUBSUB_TOPIC,
			labelIds,
		);
		await container.gmailOAuthRepo.updateHistoryId(user.id, response.historyId);

		try {
			await inngest.send({
				name: "gmail/watch.stopped",
				data: { userId: user.id },
			});
			await inngest.send({
				name: "gmail/watch.started",
				data: { userId: user.id, topicName: PUBSUB_TOPIC, labelIds },
			});
		} catch (err) {
			console.warn("Failed to enqueue Inngest Gmail watch resync:", err);
		}

		return c.json(response);
	})

	.get("/watch/status", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const expiresAt = await container.gmailOAuthRepo.getWatchExpiresAt(user.id);
		const hasWatch = expiresAt !== null && expiresAt.getTime() > Date.now();
		const now = new Date();
		const hoursUntilExpiry = expiresAt
			? (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)
			: 0;

		return c.json({
			hasWatch,
			expiresAt: expiresAt?.toISOString(),
			expiresInHours: Math.round(hoursUntilExpiry * 10) / 10,
			isExpired: expiresAt !== null && expiresAt.getTime() <= Date.now(),
			topicName: PUBSUB_TOPIC,
			autoRenews: true as const,
			resyncInterval: process.env.GMAIL_WATCH_RESYNC_INTERVAL || "1d",
			message: hasWatch
				? `Watch active, expires in ${Math.round(hoursUntilExpiry)} hours`
				: "Watch is not active",
		});
	})

	.post("/watch/stop", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		await container.gmailService.stopWatchAndClear(user.id);

		try {
			await inngest.send({
				name: "gmail/watch.stopped",
				data: { userId: user.id },
			});
		} catch (err) {
			console.warn("Failed to enqueue Inngest Gmail watch cancel event:", err);
		}

		return c.json({
			success: true as const,
			message: "Gmail watch stopped successfully",
		});
	});
