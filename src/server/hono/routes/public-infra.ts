import { Hono } from "hono";
import { serve } from "inngest/edge";
import { getSessionUserFromCookieHeader } from "@/server/auth/session";
import { inngest } from "@/server/inngest/client";
import { gmailHistoryPoll } from "@/server/inngest/functions/gmail-history-poll";
import { gmailWatchResync } from "@/server/inngest/functions/gmail-watch-resync";
import { getContainer } from "@/server/lib/container";

const inngestHandler = serve({
	client: inngest,
	functions: [gmailWatchResync, gmailHistoryPoll],
});

const PUBSUB_TOPIC =
	process.env.GMAIL_PUBSUB_TOPIC ??
	"projects/project-4d4e1b26-7614-4156-a58/topics/autofin";

interface PubSubMessage {
	message: {
		data: string; // base64-encoded payload
		messageId: string;
		publishTime: string;
		attributes?: Record<string, string>;
	};
	subscription: string;
}

interface GmailNotification {
	emailAddress: string;
	historyId: string;
}

/**
 * Public (unauthenticated) endpoints: health, the Inngest function host, the
 * Gmail Pub/Sub push webhook, and the Gmail OAuth redirect target.
 *
 * Mounted at /api by the app composer.
 */
export const publicInfraRouter = new Hono()
	.get("/health", (c) =>
		c.json({
			status: "ok",
			service: "autofin",
			timestamp: new Date().toISOString(),
		}),
	)

	.all("/inngest", (c) => inngestHandler(c.req.raw))

	.get("/gmail/oauth/callback", async (c) => {
		const url = new URL(c.req.url);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");
		const oauthError = url.searchParams.get("error");

		if (oauthError) {
			console.error("Gmail OAuth failed:", oauthError);
			return redirectToSettings("error", encodeURIComponent(oauthError));
		}
		if (!code || !state) {
			return redirectToSettings("error", "missing_parameters");
		}

		let stateData: { userId: string; timestamp: number };
		try {
			stateData = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
		} catch {
			return redirectToSettings("error", "invalid_state");
		}

		const TEN_MINUTES = 10 * 60 * 1000;
		if (!stateData.userId || Date.now() - stateData.timestamp > TEN_MINUTES) {
			return redirectToSettings("error", "expired_state");
		}

		// The caller must be the same authenticated user that started the flow.
		const cookieHeader = c.req.header("cookie");
		const sessionUser = await getSessionUserFromCookieHeader(cookieHeader);
		if (!sessionUser) {
			return c.redirect("/login", 302);
		}
		if (sessionUser.id !== stateData.userId) {
			return redirectToSettings("error", "user_mismatch");
		}

		try {
			const tokens = await exchangeGmailCode(code);

			const profileResponse = await fetch(
				"https://gmail.googleapis.com/gmail/v1/users/me/profile",
				{ headers: { Authorization: `Bearer ${tokens.access_token}` } },
			);
			if (!profileResponse.ok) {
				throw new Error("Failed to fetch Gmail profile");
			}
			const profile = (await profileResponse.json()) as {
				emailAddress: string;
			};

			const container = getContainer();
			await container.gmailService.storeTokens(
				sessionUser.id,
				profile.emailAddress,
				tokens.access_token,
				tokens.refresh_token ?? "",
				tokens.expires_in,
				tokens.scope ?? "",
			);

			// Auto-start watching right after connecting so the user doesn't have to.
			// Best-effort: the watch requires the Pub/Sub topic + Autofin label; if it
			// fails (e.g. topic not yet configured), the user can still enable it from
			// settings and the Inngest resync loop will take over from there.
			try {
				const labelIds = await container.gmailService.getWatchLabelIds(
					sessionUser.id,
				);
				await container.gmailService.startWatchAndPersist(
					sessionUser.id,
					PUBSUB_TOPIC,
					labelIds,
				);
				await inngest.send({
					name: "gmail/watch.started",
					data: {
						userId: sessionUser.id,
						topicName: PUBSUB_TOPIC,
						labelIds,
					},
				});
			} catch (err) {
				console.warn("Failed to auto-start Gmail watch after connect:", err);
			}

			return redirectToSettings("connected");
		} catch (error) {
			console.error("Error processing Gmail OAuth callback:", error);
			return redirectToSettings(
				"error",
				encodeURIComponent(error instanceof Error ? error.message : "unknown"),
			);
		}
	})

	.post("/webhooks/gmail", async (c) => {
		try {
			// Optional shared-secret verification for the push subscription.
			const verificationToken = c.req.header("x-verification-token");
			const expectedToken = process.env.GMAIL_PUBSUB_VERIFICATION_TOKEN;
			if (
				verificationToken &&
				expectedToken &&
				verificationToken !== expectedToken
			) {
				return c.json({ error: "Invalid verification token" }, 401);
			}

			const body = (await c.req.json()) as PubSubMessage;
			if (!body.message?.data) {
				return c.json({ success: false, error: "Invalid message format" }, 400);
			}

			const notification = JSON.parse(
				Buffer.from(body.message.data, "base64").toString("utf-8"),
			) as GmailNotification;

			console.log("Gmail webhook received:", {
				messageId: body.message.messageId,
				emailAddress: notification.emailAddress,
				historyId: notification.historyId,
				publishTime: body.message.publishTime,
			});

			const container = getContainer();

			let token = null;
			try {
				token = await container.gmailOAuthRepo.findByEmailAddress(
					notification.emailAddress,
				);
			} catch (dbError) {
				console.error("Database error looking up token:", dbError);
				return c.json({
					success: false,
					error: "Database error",
					messageId: body.message.messageId,
				});
			}

			if (!token) {
				console.warn(
					`No OAuth token found for email: ${notification.emailAddress}`,
				);
				return c.json({
					success: false,
					message: "No OAuth token found for this email address",
					messageId: body.message.messageId,
				});
			}

			const result = await container.gmailService.processNotification(
				token.userId,
				notification,
				token.historyId,
			);

			if (result.success) {
				await container.gmailOAuthRepo.updateHistoryIdByEmail(
					notification.emailAddress,
					result.historyId,
				);
			}

			return c.json({
				success: true,
				message: "Gmail notification received and processed",
				messageId: body.message.messageId,
				receivedAt: new Date().toISOString(),
				processedCount: result.processedCount,
			});
		} catch (error) {
			console.error("Error processing Gmail webhook:", error);
			// Always 200 so Pub/Sub does not retry indefinitely.
			return c.json(
				{ success: false, error: "Failed to process webhook" },
				200,
			);
		}
	})

	.get("/webhooks/gmail", (c) =>
		c.json({
			status: "ok",
			service: "gmail-webhook",
			timestamp: new Date().toISOString(),
		}),
	);

function redirectToSettings(status: "connected" | "error", detail?: string) {
	const params = new URLSearchParams({ gmail: status });
	if (detail) params.set("detail", detail);
	return new Response(null, {
		status: 302,
		headers: { Location: `/settings?${params.toString()}` },
	});
}

/** Exchange an OAuth authorization code for Google tokens. */
async function exchangeGmailCode(code: string): Promise<{
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	scope?: string;
}> {
	const redirectUri = process.env.GMAIL_OAUTH_REDIRECT_URI;
	const clientId = process.env.GMAIL_CLIENT_ID;
	const clientSecret = process.env.GMAIL_CLIENT_SECRET;

	if (!redirectUri || !clientId || !clientSecret) {
		throw new Error("Gmail OAuth not configured");
	}

	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectUri,
			grant_type: "authorization_code",
		}),
	});

	if (!response.ok) {
		const details = await response.json().catch(() => response.statusText);
		throw new Error(
			`Failed to exchange authorization code: ${JSON.stringify(details)}`,
		);
	}

	return (await response.json()) as {
		access_token: string;
		refresh_token?: string;
		expires_in: number;
		scope?: string;
	};
}
