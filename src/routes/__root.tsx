import { QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { PageLoadingBar } from "@/components/PageLoadingBar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { env } from "@/env";
import { queryClient } from "@/lib/query-client";
import appStyles from "./__root.css?url";

/**
 * Runs before first paint so the correct theme class is on <html> from the
 * very first frame — no flash of the wrong theme during SSR hydration.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";var n=localStorage.getItem("theme-name");if(n)e.setAttribute("data-theme",n);}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: env.VITE_APP_TITLE ?? "AutoFin",
			},
			{
				name: "description",
				content:
					"Connect your Gmail to automatically track transactions, manage categories, and understand your spending patterns.",
			},
			{ name: "theme-color", content: "#0a0a0a" },
			{ name: "mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent",
			},
			{ name: "apple-mobile-web-app-title", content: "AutoFin" },
		],
		links: [
			{ rel: "stylesheet", href: appStyles },
			{ rel: "manifest", href: "/manifest.json" },
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
			{
				rel: "icon",
				href: "/mini-logo-192.png",
				type: "image/png",
				sizes: "192x192",
			},
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
		],
		scripts: [{ children: themeInitScript }],
	}),
	component: RootComponent,
});

function RootComponent() {
	useEffect(() => {
		if (import.meta.env.PROD && "serviceWorker" in navigator) {
			navigator.serviceWorker.register("/sw.js").catch(() => {});
		}
	}, []);

	return (
		// suppressHydrationWarning: the theme script mutates <html>'s class and
		// style before React hydrates — that difference is intentional.
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="antialiased">
				<PageLoadingBar />
				<ThemeProvider>
					<AuthProvider>
						<QueryClientProvider client={queryClient}>
							<Outlet />
						</QueryClientProvider>
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
