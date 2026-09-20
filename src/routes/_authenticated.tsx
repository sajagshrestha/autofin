import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useRouterState,
} from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AdvisorChatWidget } from "@/components/ai-chat/AdvisorChatWidget";
import { AdvisorChatProvider } from "@/components/ai-chat/advisor-chat-context";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { getSessionUserFn } from "@/server/functions/session.fns";

/**
 * Auth guard: resolves the session on the server before rendering any
 * authenticated page, then renders the app shell around it.
 */
function AuthenticatedMain() {
	const { collapsed } = useSidebar();
	const section = useRouterState({
		select: (state) => state.location.pathname.split("/")[1] || "dashboard",
	});
	return (
		<main
			className={cn(
				"app-main flex-1 min-w-0 pt-16 md:pt-0 pb-24 md:pb-10 transition-[margin] duration-200 ease-in-out",
				collapsed ? "md:ml-20" : "md:ml-60",
			)}
		>
			<div className="hidden h-16 items-center justify-between border-b bg-card/60 px-8 md:flex">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<Link to="/dashboard" className="hover:text-foreground">
						Workspace
					</Link>
					<ChevronRight className="size-3" />
					<span className="capitalize text-foreground">
						{section === "dashboard" ? "Overview" : section}
					</span>
				</div>
			</div>
			<div
				id="main-content"
				tabIndex={-1}
				className="page-content p-4 py-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto outline-none"
			>
				<Outlet />
			</div>
		</main>
	);
}

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		const { user } = await getSessionUserFn();
		if (!user) {
			throw redirect({
				to: "/login",
				search: { redirect: location.pathname },
			});
		}
		return { user };
	},
	pendingComponent: () => (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-muted-foreground">Loading...</div>
		</div>
	),
	component: () => (
		<AdvisorChatProvider>
			<SidebarProvider>
				<div className="flex min-h-screen bg-background">
					<Header />
					<AuthenticatedMain />
				</div>
				<AdvisorChatWidget />
			</SidebarProvider>
		</AdvisorChatProvider>
	),
});
