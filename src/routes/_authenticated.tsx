import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdvisorChatWidget } from "@/components/ai-chat/AdvisorChatWidget";
import { AdvisorChatProvider } from "@/components/ai-chat/advisor-chat-context";
import Header from "@/components/Header";
import { getSessionUserFn } from "@/server/functions/session.fns";

/**
 * Auth guard: resolves the session on the server before rendering any
 * authenticated page, then renders the app shell around it.
 */
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
			<div className="flex min-h-screen bg-gradient-to-b from-muted/40 via-background to-background">
				<Header />
				<main className="flex-1 min-w-0 pt-16 sm:pt-0 md:ml-64 lg:ml-72 pb-16 md:pb-0 overflow-auto">
					<div className="p-4 md:p-8 max-w-[1600px] mx-auto">
						<Outlet />
					</div>
				</main>
			</div>
			<AdvisorChatWidget />
		</AdvisorChatProvider>
	),
});
