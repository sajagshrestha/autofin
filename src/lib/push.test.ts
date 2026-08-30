// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	subscribeToPush,
	unsubscribeFromPush,
	urlBase64ToUint8Array,
} from "./push";

vi.mock("@/env", () => ({
	env: { VITE_VAPID_PUBLIC_KEY: "test-public-key" },
}));

const { postSubscriptionMock, deleteSubscriptionMock, unwrapMock } = vi.hoisted(
	() => ({
		postSubscriptionMock: vi.fn(),
		deleteSubscriptionMock: vi.fn(),
		unwrapMock: vi.fn(),
	}),
);

vi.mock("@/lib/api-client", () => ({
	rpc: {
		api: {
			push: {
				subscriptions: {
					$post: postSubscriptionMock,
					":id": { $delete: deleteSubscriptionMock },
				},
			},
		},
	},
	unwrap: unwrapMock,
}));

interface FakePushSubscription {
	endpoint: string;
	toJSON: () => { endpoint: string; keys: { p256dh: string; auth: string } };
	unsubscribe: () => Promise<boolean>;
}

function makeSubscription(
	endpoint = "https://push.example.com/sub",
): FakePushSubscription {
	return {
		endpoint,
		toJSON: () => ({
			endpoint,
			keys: { p256dh: "p256", auth: "auth" },
		}),
		unsubscribe: vi.fn().mockResolvedValue(true),
	};
}

interface StubOptions {
	permission?: NotificationPermission;
	activeSubscription?: FakePushSubscription | null;
}

/** Installs browser push API globals (jsdom lacks them) and returns the mocks. */
function stubPushGlobals(options: StubOptions = {}) {
	const { permission = "granted", activeSubscription = null } = options;

	const requestPermissionMock = vi.fn().mockResolvedValue(permission);
	const subscribeMock = vi
		.fn()
		.mockResolvedValue(activeSubscription ?? makeSubscription());
	const getSubscriptionMock = vi.fn().mockResolvedValue(activeSubscription);

	const registration = {
		pushManager: {
			subscribe: subscribeMock,
			getSubscription: getSubscriptionMock,
		},
	};

	vi.stubGlobal("PushManager", class {});
	vi.stubGlobal("Notification", { requestPermission: requestPermissionMock });
	vi.stubGlobal("navigator", {
		serviceWorker: {
			ready: Promise.resolve(registration),
			getRegistration: vi.fn().mockResolvedValue(registration),
		},
		userAgent: "test-agent",
	});

	return { requestPermissionMock, subscribeMock, getSubscriptionMock };
}

describe("urlBase64ToUint8Array", () => {
	it("decodes a base64url string back to its original bytes", () => {
		const bytes = Buffer.from([0x00, 0x01, 0xfe, 0xff, 0x7f]);
		const base64url = bytes
			.toString("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");

		expect(Array.from(urlBase64ToUint8Array(base64url))).toEqual([
			0x00, 0x01, 0xfe, 0xff, 0x7f,
		]);
	});

	it("handles the padding-less single-byte case", () => {
		expect(Array.from(urlBase64ToUint8Array("AQ"))).toEqual([1]);
	});
});

describe("subscribeToPush", () => {
	beforeEach(() => {
		postSubscriptionMock.mockReset().mockResolvedValue({ ok: true });
		deleteSubscriptionMock.mockReset().mockResolvedValue({ ok: true });
		unwrapMock.mockReset().mockResolvedValue({ id: "sub-1" });
		localStorage.clear();
		vi.unstubAllGlobals();
	});

	it("subscribes with the app VAPID key and persists the server id", async () => {
		const { requestPermissionMock, subscribeMock } = stubPushGlobals();
		const active = makeSubscription();
		subscribeMock.mockResolvedValue(active);

		await subscribeToPush();

		expect(requestPermissionMock).toHaveBeenCalled();
		expect(subscribeMock).toHaveBeenCalledWith({
			userVisibleOnly: true,
			applicationServerKey: expect.any(Uint8Array),
		});
		expect(postSubscriptionMock).toHaveBeenCalledWith({
			json: {
				endpoint: active.endpoint,
				p256dh: "p256",
				auth: "auth",
				userAgent: "test-agent",
			},
		});
		expect(localStorage.getItem("autofin:push-subscription-id")).toBe("sub-1");
	});

	it("throws when notification permission is denied", async () => {
		stubPushGlobals({ permission: "denied" });

		await expect(subscribeToPush()).rejects.toThrow(/blocked/i);
		expect(postSubscriptionMock).not.toHaveBeenCalled();
	});

	it("throws when the app has no VAPID key configured", async () => {
		stubPushGlobals();
		const envMock = await import("@/env");
		const original = envMock.env.VITE_VAPID_PUBLIC_KEY;
		Object.defineProperty(envMock.env, "VITE_VAPID_PUBLIC_KEY", {
			value: undefined,
			configurable: true,
		});

		await expect(subscribeToPush()).rejects.toThrow(/not configured/i);

		Object.defineProperty(envMock.env, "VITE_VAPID_PUBLIC_KEY", {
			value: original,
			configurable: true,
		});
	});
});

describe("unsubscribeFromPush", () => {
	beforeEach(() => {
		postSubscriptionMock.mockReset();
		deleteSubscriptionMock.mockReset().mockResolvedValue({ ok: true });
		unwrapMock.mockReset();
		localStorage.clear();
		vi.unstubAllGlobals();
	});

	it("removes the server record and unsubscribes the browser", async () => {
		const active = makeSubscription();
		stubPushGlobals({ activeSubscription: active });
		localStorage.setItem("autofin:push-subscription-id", "sub-1");

		await unsubscribeFromPush();

		expect(deleteSubscriptionMock).toHaveBeenCalledWith({
			param: { id: "sub-1" },
		});
		expect(active.unsubscribe).toHaveBeenCalled();
		expect(localStorage.getItem("autofin:push-subscription-id")).toBeNull();
	});

	it("still unsubscribes the browser when there is no stored server id", async () => {
		const active = makeSubscription();
		stubPushGlobals({ activeSubscription: active });

		await unsubscribeFromPush();

		expect(deleteSubscriptionMock).not.toHaveBeenCalled();
		expect(active.unsubscribe).toHaveBeenCalled();
	});
});
