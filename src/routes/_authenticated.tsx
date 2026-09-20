import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { getSessionUserFn } from "@/server/functions/session.fns";

// Demo routing is separate; authenticated pages still require a server session.
export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		const { user } = await getSessionUserFn();
		if (!user)
			throw redirect({ to: "/login", search: { redirect: location.pathname } });
		return { user };
	},
	pendingComponent: () => (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-muted-foreground">Loading...</div>
		</div>
	),
	component: () => (
		<AppShell>
			<Outlet />
		</AppShell>
	),
});
