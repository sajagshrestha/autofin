// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MOBILE_LAYOUT_QUERY } from "@/lib/responsive-layout";
import { useMobileViewport } from "./useMobileViewport";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let root: Root;
let host: HTMLDivElement;
let viewport: EventTarget & {
	height: number;
	offsetTop: number;
	scale: number;
};
let mobile: EventTarget & { matches: boolean };
const style = () => document.documentElement.style;
const flush = () => act(() => vi.advanceTimersByTime(20));
function Harness() {
	useMobileViewport();
	return (
		<section data-slot="dialog-content">
			<input aria-label="Notes" />
		</section>
	);
}
beforeEach(async () => {
	vi.useFakeTimers();
	viewport = Object.assign(new EventTarget(), {
		height: 844,
		offsetTop: 0,
		scale: 1,
	});
	mobile = Object.assign(new EventTarget(), { matches: true });
	vi.stubGlobal("visualViewport", viewport);
	vi.stubGlobal("innerHeight", 844);
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => mobile),
	);
	vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
		setTimeout(callback, 16),
	);
	vi.stubGlobal("cancelAnimationFrame", clearTimeout);
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
	await act(async () => root.render(<Harness />));
	flush();
});
afterEach(async () => {
	await act(async () => root.unmount());
	host.remove();
	vi.unstubAllGlobals();
	vi.useRealTimers();
});
it("fits above an overlay keyboard, accounts for viewport panning, and restores on dismiss", () => {
	viewport.height = 480;
	viewport.dispatchEvent(new Event("resize"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-height")).toBe("480px");
	expect(style().getPropertyValue("--mobile-viewport-bottom")).toBe("364px");
	viewport.offsetTop = 80;
	viewport.dispatchEvent(new Event("scroll"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-top")).toBe("80px");
	expect(style().getPropertyValue("--mobile-viewport-bottom")).toBe("284px");
	Object.assign(viewport, { height: 844, offsetTop: 0 });
	viewport.dispatchEvent(new Event("resize"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-bottom")).toBe("0px");
});
it("does not add a double keyboard offset when the layout viewport also shrinks", () => {
	vi.stubGlobal("innerHeight", 480);
	viewport.height = 480;
	window.dispatchEvent(new Event("resize"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-bottom")).toBe("0px");
});
it("reveals obscured focused fields on resize without fighting manual scrolling", () => {
	const input = host.querySelector("input");
	const section = host.querySelector("section");
	if (!input || !section) throw new Error("Missing form fixture");
	input.scrollIntoView = vi.fn();
	input.getBoundingClientRect = () => ({ top: 600, bottom: 644 }) as DOMRect;
	section.getBoundingClientRect = () => ({ top: 16, bottom: 480 }) as DOMRect;
	input.focus();
	viewport.height = 480;
	viewport.dispatchEvent(new Event("resize"));
	flush();
	expect(input.scrollIntoView).toHaveBeenCalledTimes(1);
	viewport.dispatchEvent(new Event("scroll"));
	flush();
	expect(input.scrollIntoView).toHaveBeenCalledTimes(1);
});
it("leaves desktop and pinch zoom alone and cleans up on unmount", async () => {
	mobile.matches = false;
	mobile.dispatchEvent(new Event("change"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-height")).toBe("");
	mobile.matches = true;
	viewport.scale = 2;
	viewport.dispatchEvent(new Event("resize"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-height")).toBe("");
	viewport.scale = 1;
	viewport.dispatchEvent(new Event("resize"));
	flush();
	await act(async () => root.render(null));
	expect(style().getPropertyValue("--mobile-viewport-height")).toBe("");
	viewport.dispatchEvent(new Event("resize"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-height")).toBe("");
});

it("uses the shared tablet query and clears keyboard offsets on rotation", () => {
	expect(window.matchMedia).toHaveBeenCalledWith(MOBILE_LAYOUT_QUERY);
	viewport.height = 480;
	viewport.dispatchEvent(new Event("resize"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-bottom")).toBe("364px");
	mobile.matches = false;
	mobile.dispatchEvent(new Event("change"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-bottom")).toBe("");
	mobile.matches = true;
	mobile.dispatchEvent(new Event("change"));
	flush();
	expect(style().getPropertyValue("--mobile-viewport-bottom")).toBe("364px");
});
