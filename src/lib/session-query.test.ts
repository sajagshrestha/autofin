import { QueryClient } from "@tanstack/react-query";
import { afterEach, expect, it, vi } from "vitest";
import { getSessionUserFn } from "@/server/functions/session.fns";
import { SESSION_QUERY_KEY, sessionQueryOptions } from "./session-query";

vi.mock("@/server/functions/session.fns", () => ({
	getSessionUserFn: vi.fn(),
}));
const client = new QueryClient();
const user = { id: "user-1", email: "test@example.com" };
const navigate = () =>
	client.ensureQueryData({ ...sessionQueryOptions, revalidateIfStale: true });
afterEach(() => {
	client.clear();
	vi.resetAllMocks();
});

it("deduplicates first-load checks and reuses the verified session across tabs", async () => {
	vi.mocked(getSessionUserFn).mockResolvedValue({ user });
	await Promise.all([navigate(), navigate(), navigate()]);
	await navigate();
	expect(getSessionUserFn).toHaveBeenCalledTimes(1);
});

it("returns cached session immediately while stale verification runs in the background", async () => {
	client.setQueryData(
		SESSION_QUERY_KEY,
		{ user },
		{ updatedAt: Date.now() - 10 * 60 * 1000 },
	);
	let finish!: (value: { user: null }) => void;
	vi.mocked(getSessionUserFn).mockImplementation(
		() =>
			new Promise((resolve) => {
				finish = resolve;
			}),
	);
	expect(await navigate()).toEqual({ user });
	expect(client.isFetching({ queryKey: SESSION_QUERY_KEY })).toBe(1);
	finish({ user: null });
	await vi.waitFor(() =>
		expect(client.getQueryData(SESSION_QUERY_KEY)).toEqual({ user: null }),
	);
});

it("requires fresh verification after the auth cache is cleared", async () => {
	vi.mocked(getSessionUserFn)
		.mockResolvedValueOnce({ user })
		.mockResolvedValueOnce({ user: null });
	await navigate();
	client.clear();
	expect(await navigate()).toEqual({ user: null });
	expect(getSessionUserFn).toHaveBeenCalledTimes(2);
});
