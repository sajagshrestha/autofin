// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NotificationsSection } from "./NotificationsSection";

const mocks = vi.hoisted(() => ({
	hook: vi.fn(),
	test: vi.fn(),
	success: vi.fn(),
	error: vi.fn(),
}));
vi.mock("@/hooks/push/notifications", () => ({
	usePushNotifications: mocks.hook,
}));
vi.mock("@/lib/api-client", () => ({
	rpc: { api: { push: { test: { $post: mocks.test } } } },
	unwrap: (value: unknown) => value,
}));
vi.mock("sonner", () => ({
	toast: { success: mocks.success, error: mocks.error },
}));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let root: Root;
let host: HTMLDivElement;
let state: {
	enabled: boolean;
	supported: boolean;
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	refetch: ReturnType<typeof vi.fn>;
	subscribe: { isPending: boolean; mutateAsync: ReturnType<typeof vi.fn> };
	unsubscribe: { isPending: boolean; mutateAsync: ReturnType<typeof vi.fn> };
};
const render = () => act(async () => root.render(<NotificationsSection />));
const toggle = () => {
	const input = host.querySelector("input");
	if (!input) throw new Error("Missing notification toggle");
	return input;
};
beforeEach(() => {
	vi.clearAllMocks();
	state = {
		enabled: false,
		supported: true,
		isLoading: false,
		isFetching: false,
		isError: false,
		refetch: vi.fn(),
		subscribe: {
			isPending: false,
			mutateAsync: vi.fn().mockResolvedValue(undefined),
		},
		unsubscribe: {
			isPending: false,
			mutateAsync: vi.fn().mockResolvedValue(undefined),
		},
	};
	mocks.hook.mockImplementation(() => state);
	mocks.test.mockResolvedValue({ ok: true });
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
});
afterEach(async () => {
	await act(async () => root.unmount());
	host.remove();
});
it("shows initial loading before support is known instead of a false unsupported state", async () => {
	Object.assign(state, { isLoading: true, isFetching: true, supported: false });
	await render();
	expect(host.textContent).toContain("Checking notifications…");
	expect(host.textContent).not.toContain("aren't supported");
	expect(host.textContent).not.toContain("isn't registered");
	expect(host.querySelector("input")).toBeNull();
	expect(host.querySelector('[role="status"]')?.getAttribute("aria-busy")).toBe(
		"true",
	);
});
it("shows a retryable error even when support has not been loaded", async () => {
	Object.assign(state, { isError: true, supported: false });
	await render();
	expect(host.querySelector('[role="alert"]')?.textContent).toContain(
		"Couldn't load",
	);
	await act(async () => host.querySelector("button")?.click());
	expect(state.refetch).toHaveBeenCalledOnce();
});
it("keeps cached state visible and disables interaction during background checks", async () => {
	Object.assign(state, { enabled: true, isFetching: true });
	await render();
	expect(toggle().checked).toBe(true);
	expect(toggle().disabled).toBe(true);
	expect(host.textContent).toContain("Checking this device…");
});
it("shows progress and prevents repeated toggles through registration and test delivery", async () => {
	let finishRegistration: () => void = () => {};
	let finishTest: () => void = () => {};
	state.subscribe.mutateAsync.mockImplementation(
		() =>
			new Promise<void>((resolve) => {
				finishRegistration = resolve;
			}),
	);
	mocks.test.mockImplementation(
		() =>
			new Promise<void>((resolve) => {
				finishTest = resolve;
			}),
	);
	await render();
	await act(async () => toggle().click());
	expect(host.textContent).toContain("Enabling notifications…");
	expect(host.textContent).not.toContain("isn't registered");
	expect(toggle().disabled).toBe(true);
	await act(async () => {
		state.enabled = true;
		finishRegistration();
	});
	expect(host.textContent).toContain("Sending a test notification…");
	expect(toggle().disabled).toBe(true);
	await act(async () => toggle().click());
	expect(state.subscribe.mutateAsync).toHaveBeenCalledOnce();
	await act(async () => finishTest());
	expect(toggle().disabled).toBe(false);
	expect(host.textContent).toContain("This device is registered.");
});
it("clears progress and preserves the registered state after a failed disable", async () => {
	state.enabled = true;
	let fail: (error: Error) => void = () => {};
	state.unsubscribe.mutateAsync.mockImplementation(
		() =>
			new Promise((_, reject) => {
				fail = reject;
			}),
	);
	await render();
	await act(async () => toggle().click());
	expect(host.textContent).toContain("Disabling notifications…");
	await act(async () => fail(new Error("Network unavailable")));
	expect(toggle().disabled).toBe(false);
	expect(toggle().checked).toBe(true);
	expect(mocks.error).toHaveBeenCalledWith("Couldn't disable notifications", {
		description: "Network unavailable",
	});
});
