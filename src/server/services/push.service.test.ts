import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PushSubscription } from "@/server/db/schema";
import type { PushSubscriptionRepository } from "@/server/repositories/push-subscription.repository";
import { PushServiceImpl } from "./push.service";

const { sendNotificationMock, setVapidDetailsMock } = vi.hoisted(() => ({
	sendNotificationMock: vi.fn(),
	setVapidDetailsMock: vi.fn(),
}));

vi.mock("web-push", () => ({
	default: {
		sendNotification: sendNotificationMock,
		setVapidDetails: setVapidDetailsMock,
	},
}));

function makeSubscription(
	endpoint: string,
	overrides: Partial<PushSubscription> = {},
): PushSubscription {
	return {
		id: `id-${endpoint}`,
		userId: "user-1",
		endpoint,
		p256dh: "p256dh",
		auth: "auth",
		userAgent: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

function createRepo(overrides: Partial<PushSubscriptionRepository> = {}) {
	return {
		findAllForUser: vi.fn(),
		deleteByEndpoint: vi.fn(),
		...overrides,
	} as unknown as PushSubscriptionRepository;
}

function configureVapid() {
	process.env.VAPID_SUBJECT = "mailto:test@example.com";
	process.env.VAPID_PUBLIC_KEY = "test-public-key";
	process.env.VAPID_PRIVATE_KEY = "test-private-key";
}

function unconfigureVapid() {
	delete process.env.VAPID_SUBJECT;
	delete process.env.VAPID_PUBLIC_KEY;
	delete process.env.VAPID_PRIVATE_KEY;
}

describe("PushServiceImpl", () => {
	beforeEach(() => {
		sendNotificationMock.mockReset();
		setVapidDetailsMock.mockReset();
		unconfigureVapid();
	});

	it("is a no-op when VAPID credentials are not configured", async () => {
		const repo = createRepo();
		const service = new PushServiceImpl(repo);

		await service.sendToUser("user-1", { title: "t", body: "b" });

		expect(setVapidDetailsMock).not.toHaveBeenCalled();
		expect(repo.findAllForUser).not.toHaveBeenCalled();
		expect(sendNotificationMock).not.toHaveBeenCalled();
	});

	it("configures VAPID details once on construction", () => {
		configureVapid();
		new PushServiceImpl(createRepo());

		expect(setVapidDetailsMock).toHaveBeenCalledWith(
			"mailto:test@example.com",
			"test-public-key",
			"test-private-key",
		);
	});

	it("does nothing when the user has no subscriptions", async () => {
		configureVapid();
		const repo = createRepo({ findAllForUser: vi.fn().mockResolvedValue([]) });
		const service = new PushServiceImpl(repo);

		await service.sendToUser("user-1", { title: "t", body: "b" });

		expect(sendNotificationMock).not.toHaveBeenCalled();
	});

	it("sends the JSON payload to every device subscription", async () => {
		configureVapid();
		const repo = createRepo({
			findAllForUser: vi.fn().mockResolvedValue([
				makeSubscription("https://push.example.com/a", {
					p256dh: "p1",
					auth: "a1",
				}),
				makeSubscription("https://push.example.com/b", {
					p256dh: "p2",
					auth: "a2",
				}),
			]),
		});
		const service = new PushServiceImpl(repo);
		sendNotificationMock.mockResolvedValue({ statusCode: 201 });

		await service.sendToUser("user-1", {
			title: "Imported",
			body: "3 transactions",
			url: "/transactions",
		});

		expect(sendNotificationMock).toHaveBeenCalledTimes(2);
		expect(sendNotificationMock).toHaveBeenCalledWith(
			{
				endpoint: "https://push.example.com/a",
				keys: { p256dh: "p1", auth: "a1" },
			},
			JSON.stringify({
				title: "Imported",
				body: "3 transactions",
				url: "/transactions",
			}),
			expect.objectContaining({ TTL: 3600 }),
		);
		expect(sendNotificationMock).toHaveBeenCalledWith(
			{
				endpoint: "https://push.example.com/b",
				keys: { p256dh: "p2", auth: "a2" },
			},
			expect.any(String),
			expect.any(Object),
		);
	});

	it("drops subscriptions the push service reports as gone (404/410)", async () => {
		configureVapid();
		const repo = createRepo({
			findAllForUser: vi
				.fn()
				.mockResolvedValue([
					makeSubscription("https://push.example.com/gone-410"),
					makeSubscription("https://push.example.com/gone-404"),
					makeSubscription("https://push.example.com/ok"),
				]),
		});
		const service = new PushServiceImpl(repo);

		sendNotificationMock
			.mockRejectedValueOnce(
				Object.assign(new Error("gone"), { statusCode: 410 }),
			)
			.mockRejectedValueOnce(
				Object.assign(new Error("gone"), { statusCode: 404 }),
			)
			.mockResolvedValueOnce({ statusCode: 201 });

		await expect(
			service.sendToUser("user-1", { title: "t", body: "b" }),
		).resolves.toBeUndefined();

		expect(repo.deleteByEndpoint).toHaveBeenCalledTimes(2);
		expect(repo.deleteByEndpoint).toHaveBeenCalledWith(
			"https://push.example.com/gone-410",
		);
		expect(repo.deleteByEndpoint).toHaveBeenCalledWith(
			"https://push.example.com/gone-404",
		);
	});

	it("swallows transient push errors without dropping the subscription", async () => {
		configureVapid();
		const repo = createRepo({
			findAllForUser: vi
				.fn()
				.mockResolvedValue([
					makeSubscription("https://push.example.com/flaky"),
				]),
		});
		const service = new PushServiceImpl(repo);
		sendNotificationMock.mockRejectedValue(new Error("network timeout"));

		await expect(
			service.sendToUser("user-1", { title: "t", body: "b" }),
		).resolves.toBeUndefined();

		expect(repo.deleteByEndpoint).not.toHaveBeenCalled();
	});
});
