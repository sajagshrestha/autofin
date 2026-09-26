// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
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

it("restores the saved sidebar state on client startup and persists toggles", async () => {
	vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
	localStorage.setItem("autofin:sidebar-collapsed", "true");
	const app = (
		<SidebarProvider>
			<SidebarProbe />
		</SidebarProvider>
	);
	const container = document.createElement("div");
	document.body.append(container);
	const root = createRoot(container);
	await act(async () => {
		root.render(app);
	});
	expect(container.textContent).toBe("Expand");
	await act(async () => {
		container.querySelector("button")?.click();
	});
	expect(container.textContent).toBe("Collapse");
	expect(localStorage.getItem("autofin:sidebar-collapsed")).toBe("false");
	await act(async () => {
		root.unmount();
	});
});
