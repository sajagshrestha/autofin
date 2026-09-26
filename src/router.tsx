import { createRouter } from "@tanstack/react-router";
import { AppLoading } from "@/components/AppLoading";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const router = createRouter({
		routeTree,
		defaultPreload: "intent",
		defaultPendingComponent: AppLoading,
		defaultPendingMinMs: 0,
		scrollRestoration: ({ location }) => location.pathname !== "/",
		defaultStructuralSharing: true,
		defaultPreloadStaleTime: 0,
	});

	return router;
}

export type Router = ReturnType<typeof getRouter>;
