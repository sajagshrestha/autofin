// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProgressiveList } from "./useProgressiveList";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let root: Root;
let host: HTMLDivElement;
let list: ReturnType<typeof useProgressiveList>;
const observers: {
	intersect: () => void;
	disconnect: ReturnType<typeof vi.fn>;
}[] = [];
function Harness({ total = 55, resetKey = "initial", enabled = true }) {
	list = useProgressiveList({ total, resetKey, enabled });
	return <div ref={list.sentinelRef}>{list.visibleCount}</div>;
}
async function render(props: Parameters<typeof Harness>[0] = {}) {
	await act(async () => root.render(<Harness {...props} />));
}
beforeEach(() => {
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
	observers.length = 0;
	vi.stubGlobal(
		"IntersectionObserver",
		class {
			disconnect = vi.fn();
			observe = vi.fn();
			constructor(callback: IntersectionObserverCallback) {
				observers.push({
					intersect: () =>
						callback(
							[{ isIntersecting: true } as IntersectionObserverEntry],
							this as unknown as IntersectionObserver,
						),
					disconnect: this.disconnect,
				});
			}
		},
	);
});
afterEach(async () => {
	await act(async () => root.unmount());
	host.remove();
	vi.unstubAllGlobals();
});
describe("mobile progressive list", () => {
	it("appends batches once per observer and stops at the end", async () => {
		await render();
		expect(list.visibleCount).toBe(20);
		const first = observers[0];
		await act(async () => {
			first.intersect();
			first.intersect();
		});
		expect(list.visibleCount).toBe(40);
		expect(first.disconnect).toHaveBeenCalled();
		await act(async () => observers[1].intersect());
		expect(list.visibleCount).toBe(55);
		expect(list.hasMore).toBe(false);
		expect(observers).toHaveLength(2);
	});
	it("resets when filters change and does not retain an old filter's count", async () => {
		await render();
		await act(async () => list.loadMore());
		await render({ resetKey: "search" });
		expect(list.visibleCount).toBe(20);
		await render({ resetKey: "initial" });
		expect(list.visibleCount).toBe(20);
	});
	it("never observes desktop or empty lists", async () => {
		await render({ enabled: false });
		expect(observers).toHaveLength(0);
		await render({ total: 0 });
		expect(observers).toHaveLength(0);
		expect(list.visibleCount).toBe(0);
	});
	it("supports the button fallback without IntersectionObserver", async () => {
		vi.stubGlobal("IntersectionObserver", undefined);
		await render();
		await act(async () => list.loadMore());
		expect(list.visibleCount).toBe(40);
	});
	it("disconnects when switching to desktop", async () => {
		await render();
		await render({ enabled: false });
		expect(observers[0].disconnect).toHaveBeenCalled();
	});
});
