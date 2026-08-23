import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { env } from "@/env";
import { queryClient } from "@/lib/query-client";
import appStyles from "./__root.css?url";

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
		],
		links: [{ rel: "stylesheet", href: appStyles }],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<AuthProvider>
						<QueryClientProvider client={queryClient}>
							<Outlet />
						</QueryClientProvider>
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
