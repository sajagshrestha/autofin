import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Navigate,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { AppLoading } from "@/components/AppLoading";
import { AppShell } from "@/components/AppShell";
import { queryClient } from "@/lib/query-client";
import { sessionQueryOptions } from "@/lib/session-query";

// Demo routing is separate; authenticated pages still require a server session.
export const Route = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { user } = await queryClient.ensureQueryData({
			...sessionQueryOptions,
			revalidateIfStale: true,
		});
		if (!user)
			throw redirect({ to: "/login", search: { redirect: location.pathname } });
		return { user };
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { data } = useQuery(sessionQueryOptions);
	if (!data) return <AppLoading />;
	// A background verification or sign-out can revoke the cached UI session.
	if (data && !data.user) return <Navigate to="/login" />;
	return (
		<AppShell>
			<Outlet />
		</AppShell>
	);
}
