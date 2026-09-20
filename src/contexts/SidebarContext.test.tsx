// @vitest-environment jsdom
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { SidebarProvider, useSidebar } from "./SidebarContext";

function SidebarProbe() {
	const { collapsed, toggle } = useSidebar();
	return (
		<button type="button" onClick={toggle}>
			{collapsed ? "Expand" : "Collapse"}
		</button>
	);
}

afterEach(() => {
	localStorage.clear();
	document.body.innerHTML = "";
	vi.unstubAllGlobals();
});

it("hydrates consistently, restores the saved sidebar state, and persists toggles", async () => {
	vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
	localStorage.setItem("autofin:sidebar-collapsed", "true");
	const app = (
		<SidebarProvider>
			<SidebarProbe />
		</SidebarProvider>
	);
	const container = document.createElement("div");
	container.innerHTML = renderToString(app);
	expect(container.textContent).toBe("Collapse");
	document.body.append(container);
	const onRecoverableError = vi.fn();
	let root: ReturnType<typeof hydrateRoot> | undefined;
	await act(async () => {
		root = hydrateRoot(container, app, { onRecoverableError });
	});
	expect(onRecoverableError).not.toHaveBeenCalled();
	expect(container.textContent).toBe("Expand");
	await act(async () => {
		container.querySelector("button")?.click();
	});
	expect(container.textContent).toBe("Collapse");
	expect(localStorage.getItem("autofin:sidebar-collapsed")).toBe("false");
	await act(async () => {
		root?.unmount();
	});
});
