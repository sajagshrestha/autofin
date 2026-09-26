// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PageLoadingBar } from "./PageLoadingBar";

const state = vi.hoisted(() => ({ isLoading: false }));
vi.mock("@tanstack/react-router", () => ({
	useRouterState: () => state.isLoading,
}));
let root: Root;
let host: HTMLDivElement;
async function render(loading: boolean) {
	state.isLoading = loading;
	await act(async () => root.render(<PageLoadingBar />));
}
beforeEach(() => {
	vi.useFakeTimers();
	vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
	host = document.createElement("div");
	root = createRoot(host);
});
afterEach(async () => {
	await act(async () => root.unmount());
	vi.useRealTimers();
	vi.unstubAllGlobals();
});
it("does not flash a loading bar on startup or a cached tab switch", async () => {
	await render(false);
	expect(host.childElementCount).toBe(0);
	await render(true);
	await act(async () => vi.advanceTimersByTime(100));
	await render(false);
	await act(async () => vi.advanceTimersByTime(300));
	expect(host.childElementCount).toBe(0);
});
it("shows progress for a genuinely slow navigation and cleans up", async () => {
	await render(true);
	await act(async () => vi.advanceTimersByTime(200));
	expect(host.childElementCount).toBe(1);
	await render(false);
	await act(async () => vi.advanceTimersByTime(250));
	expect(host.childElementCount).toBe(0);
	expect(vi.getTimerCount()).toBe(0);
});
