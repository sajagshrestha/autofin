import { createContext, useContext } from "react";

const DARK_THEME = { resolvedTheme: "dark" as const };
const ThemeContext = createContext(DARK_THEME);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<ThemeContext.Provider value={DARK_THEME}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}
