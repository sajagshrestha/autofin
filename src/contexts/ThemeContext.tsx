import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light" | "system";
export type ThemeName = "default" | "midnight" | "ocean" | "forest";

export const THEME_NAMES: ReadonlyArray<{
	name: ThemeName;
	label: string;
	description: string;
}> = [
	{
		name: "default",
		label: "Default",
		description: "Geist neutral with a blue accent.",
	},
	{
		name: "midnight",
		label: "Midnight",
		description: "Deep indigo surfaces with a violet accent.",
	},
	{
		name: "ocean",
		label: "Ocean",
		description: "Cool blue-tinted surfaces with a teal accent.",
	},
	{
		name: "forest",
		label: "Forest",
		description: "Warm neutral surfaces with a green accent.",
	},
];

interface ThemeContextType {
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
	resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const MODE_STORAGE_KEY = "theme";
const THEME_STORAGE_KEY = "theme-name";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mode, setModeState] = useState<ThemeMode>(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem(MODE_STORAGE_KEY) as
				| ThemeMode
				| null;
			return stored ?? "system";
		}
		return "system";
	});

	const [theme, setThemeState] = useState<ThemeName>(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem(THEME_STORAGE_KEY) as
				| ThemeName
				| null;
			return stored ?? "default";
		}
		return "default";
	});

	const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
		"light",
	);

	useEffect(() => {
		const getSystemTheme = (): "dark" | "light" => {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		};

		const applyTheme = () => {
			const effectiveTheme =
				mode === "system" ? getSystemTheme() : mode;
			setResolvedTheme(effectiveTheme);

			const root = window.document.documentElement;
			root.classList.toggle("dark", effectiveTheme === "dark");
			// Keep native controls (inputs, scrollbars) in sync with the theme.
			root.style.colorScheme = effectiveTheme;
			root.dataset.theme = theme;
		};

		applyTheme();

		// Listen for system theme changes
		if (mode === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleChange = () => applyTheme();
			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, [mode, theme]);

	const setMode = (newMode: ThemeMode) => {
		setModeState(newMode);
		if (typeof window !== "undefined") {
			localStorage.setItem(MODE_STORAGE_KEY, newMode);
		}
	};

	const setTheme = (newTheme: ThemeName) => {
		setThemeState(newTheme);
		if (typeof window !== "undefined") {
			localStorage.setItem(THEME_STORAGE_KEY, newTheme);
		}
	};

	return (
		<ThemeContext.Provider
			value={{ mode, setMode, theme, setTheme, resolvedTheme }}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
