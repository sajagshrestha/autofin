import { createContext, useCallback, useContext, useState } from "react";

const STORAGE_KEY = "autofin:sidebar-collapsed";

interface SidebarContextType {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function getInitialCollapsed(): boolean {
	if (typeof window === "undefined") return false;
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (stored !== null) return stored === "true";
	} catch {
		// Storage unavailable — fall through to viewport default.
	}
	// Start collapsed on tablet widths so content gets room; desktops start expanded.
	return window.innerWidth >= 768 && window.innerWidth < 1280;
}

/**
 * Desktop sidebar collapse state, shared between the sidebar itself and the
 * app-shell content margin. Persisted so the preference survives reloads.
 */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsedState] = useState(getInitialCollapsed);

	const setCollapsed = useCallback((value: boolean) => {
		setCollapsedState(value);
		try {
			window.localStorage.setItem(STORAGE_KEY, String(value));
		} catch {
			// Ignore storage failures (private mode, etc.).
		}
	}, []);

	const toggle = useCallback(() => {
		setCollapsedState((prev) => {
			try {
				window.localStorage.setItem(STORAGE_KEY, String(!prev));
			} catch {
				// Ignore storage failures.
			}
			return !prev;
		});
	}, []);

	return (
		<SidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (context === undefined) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
}
