import webpush from "web-push";
import type { PushSubscriptionRepository } from "@/server/repositories/push-subscription.repository";

const { sendNotification, setVapidDetails } = webpush;

export interface PushNotificationPayload {
	title: string;
	body: string;
	/** Relative in-app URL to open when the notification is clicked. */
	url?: string;
}

export interface PushService {
	/** Send a push notification to every device registered by the user. */
	sendToUser(userId: string, payload: PushNotificationPayload): Promise<void>;
}

const GONE_STATUS_CODES = new Set([404, 410]);

/**
 * Sends PWA push notifications over the Web Push Protocol (RFC 8292 + VAPID).
 *
 * Requires VAPID_SUBJECT / VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY to be set;
 * otherwise it's a no-op so the app keeps working without notifications.
 * Subscriptions the push service reports as expired (404/410) are dropped.
 */
export class PushServiceImpl implements PushService {
	private readonly repository: PushSubscriptionRepository;
	private readonly configured: boolean;

	constructor(repository: PushSubscriptionRepository) {
		this.repository = repository;

		const subject = process.env.VAPID_SUBJECT ?? "";
		const publicKey = process.env.VAPID_PUBLIC_KEY ?? "";
		const privateKey = process.env.VAPID_PRIVATE_KEY ?? "";

		this.configured = Boolean(subject && publicKey && privateKey);
		if (this.configured) {
			setVapidDetails(subject, publicKey, privateKey);
		}
	}

	async sendToUser(
		userId: string,
		payload: PushNotificationPayload,
	): Promise<void> {
		if (!this.configured) return;

		const subscriptions = await this.repository.findAllForUser(userId);
		if (subscriptions.length === 0) return;

		const message = JSON.stringify(payload);
		await Promise.allSettled(
			subscriptions.map((sub) => this.sendToSubscription(sub, message)),
		);
	}

	private async sendToSubscription(
		subscription: {
			endpoint: string;
			p256dh: string;
			auth: string;
		},
		message: string,
	): Promise<void> {
		try {
			await sendNotification(
				{
					endpoint: subscription.endpoint,
					keys: { p256dh: subscription.p256dh, auth: subscription.auth },
				},
				message,
				{ TTL: 60 * 60 },
			);
		} catch (error) {
			const statusCode = (error as { statusCode?: number })?.statusCode;
			if (statusCode !== undefined && GONE_STATUS_CODES.has(statusCode)) {
				// The device uninstalled the app or revoked permission — forget it.
				await this.repository.deleteByEndpoint(subscription.endpoint);
			} else {
				console.error(
					`Push notification failed (${statusCode ?? "unknown"}):`,
					error instanceof Error ? error.message : error,
				);
			}
		}
	}
}
