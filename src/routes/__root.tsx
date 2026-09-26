import { QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { PageLoadingBar } from "@/components/PageLoadingBar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { PostHogProvider } from "@/contexts/PostHogProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { env } from "@/env";
import { queryClient } from "@/lib/query-client";
import appStyles from "./__root.css?url";

export const Route = createRootRoute({
	// Render the shared document on the server so the homepage can opt into SSR.
	ssr: true,
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
	}),
	component: RootComponent,
});

function RootComponent() {
	const isDemo = useRouterState({
		select: (state) => state.location.pathname === "/demo",
	});
	useEffect(() => {
		if (import.meta.env.PROD && "serviceWorker" in navigator) {
			navigator.serviceWorker.register("/sw.js").catch(() => {});
		}
	}, []);

	return (
		<html
			lang="en"
			className="dark"
			data-theme="default"
			style={{ colorScheme: "dark" }}
		>
			<head>
				<HeadContent />
			</head>
			<body className="antialiased">
				<PageLoadingBar />
				<ThemeProvider>
					<AuthProvider enabled={!isDemo}>
						<QueryClientProvider client={queryClient}>
							{!isDemo && <PostHogProvider />}
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
