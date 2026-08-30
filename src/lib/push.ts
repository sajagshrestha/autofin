import { env } from "@/env";
import { rpc, unwrap } from "@/lib/api-client";

const SW_PATH = "/sw.js";
const SUBSCRIPTION_STORAGE_KEY = "autofin:push-subscription-id";

/** The PushSubscription is stored with a URL-safe base64 VAPID key — convert
 * it to the raw bytes PushManager expects. */
export function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
	const padding = "=".repeat((4 - (base64.length % 4)) % 4);
	const raw = atob(`${base64}${padding}`.replace(/-/g, "+").replace(/_/g, "/"));
	const bytes = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
	return bytes;
}

export function isPushSupported(): boolean {
	return (
		typeof window !== "undefined" &&
		"serviceWorker" in navigator &&
		"PushManager" in window &&
		"Notification" in window
	);
}

/** The active PushSubscription for this origin, if any. */
export async function getActiveSubscription(): Promise<PushSubscription | null> {
	if (!isPushSupported()) return null;
	const registration = await navigator.serviceWorker
		.getRegistration(SW_PATH)
		.catch(() => null);
	if (!registration) return null;
	return registration.pushManager.getSubscription();
}

/**
 * Opt this device into push notifications: request permission, subscribe with
 * the app's VAPID key, and persist the subscription on the server.
 */
export async function subscribeToPush(): Promise<void> {
	if (!isPushSupported()) {
		throw new Error("Push notifications are not supported in this browser.");
	}
	const publicKey = env.VITE_VAPID_PUBLIC_KEY;
	if (!publicKey) {
		throw new Error("Push notifications are not configured for this app.");
	}

	const permission = await Notification.requestPermission();
	if (permission !== "granted") {
		throw new Error(
			permission === "denied"
				? "Notifications are blocked. Enable them in your browser settings."
				: "Notification permission was not granted.",
		);
	}

	const registration = await navigator.serviceWorker.ready;
	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicKey),
	});

	const keys = subscription.toJSON().keys;
	const res = await rpc.api.push.subscriptions.$post({
		json: {
			endpoint: subscription.endpoint,
			p256dh: keys?.p256dh ?? "",
			auth: keys?.auth ?? "",
			userAgent: navigator.userAgent,
		},
	});
	const saved = await unwrap<{ id: string }>(res);

	try {
		localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, saved.id);
	} catch {
		/* private mode etc. — best effort */
	}
}

/** Opt this device out: remove the server record and unsubscribe the browser. */
export async function unsubscribeFromPush(): Promise<void> {
	const subscription = await getActiveSubscription();
	const id = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);

	if (id) {
		try {
			await rpc.api.push.subscriptions[":id"].$delete({ param: { id } });
		} catch {
			/* already gone — ignore */
		}
		try {
			localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
		} catch {
			/* ignore */
		}
	}

	if (subscription) {
		await subscription.unsubscribe().catch(() => {});
	}
}
