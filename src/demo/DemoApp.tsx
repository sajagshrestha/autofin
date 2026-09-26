import { QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DemoContext, useDemo } from "@/contexts/DemoContext";
import { ApiClientContext } from "@/lib/api-context";
import { CategoryDetailPage } from "@/routes/_authenticated/categories/$categoryId";
import { CategoriesPage } from "@/routes/_authenticated/categories/index";
import {
	AnalyticsDashboard,
	Route as DashboardRoute,
} from "@/routes/_authenticated/dashboard";
import {
	LoansPage,
	Route as LoansRoute,
} from "@/routes/_authenticated/loans/index";
import { TransactionDetailPage } from "@/routes/_authenticated/transactions/$transactionId";
import {
	TransactionsPage,
	Route as TransactionsRoute,
} from "@/routes/_authenticated/transactions/index";
import { createDemoAdvisorTransport } from "./advisor";
import { createDemoClient, createDemoQueryClient } from "./client";
import { createDemoData } from "./data";

function AccountRequired() {
	const demo = useDemo();
	useEffect(() => {
		demo?.requestAccess();
	}, [demo]);
	return (
		<div className="mx-auto max-w-xl space-y-5 py-12">
			<BackButton fallback="/dashboard" />
			<h1 className="text-3xl font-semibold">Your own automated workspace</h1>
			<p className="text-muted-foreground">
				Create an account to connect Gmail, import your bank alerts, and let AI
				organize your transactions.
			</p>
			<Button onClick={demo?.requestAccess}>
				Get access <ArrowRight />
			</Button>
		</div>
	);
}

function createDemoRouter() {
	const root = createRootRoute({ component: Outlet });
	// Match the real route IDs so existing Route.useSearch/useParams hooks work.
	// These are new route instances: the authenticated route tree is never changed.
	const shell = createRoute({
		getParentRoute: () => root,
		id: "_authenticated",
		component: () => (
			<AppShell>
				<Outlet />
			</AppShell>
		),
	});
	const dashboard = createRoute({
		getParentRoute: () => shell,
		path: "/dashboard",
		component: AnalyticsDashboard,
		validateSearch: DashboardRoute.options.validateSearch,
	});
	const transactions = createRoute({
		getParentRoute: () => shell,
		path: "/transactions/",
		component: TransactionsPage,
		validateSearch: TransactionsRoute.options.validateSearch,
	});
	const transaction = createRoute({
		getParentRoute: () => shell,
		path: "/transactions/$transactionId",
		component: TransactionDetailPage,
	});
	const categories = createRoute({
		getParentRoute: () => shell,
		path: "/categories/",
		component: CategoriesPage,
	});
	const category = createRoute({
		getParentRoute: () => shell,
		path: "/categories/$categoryId",
		component: CategoryDetailPage,
	});
	const loans = createRoute({
		getParentRoute: () => shell,
		path: "/loans/",
		component: LoansPage,
		validateSearch: LoansRoute.options.validateSearch,
	});
	const settings = createRoute({
		getParentRoute: () => shell,
		path: "/settings",
		component: AccountRequired,
	});
	const imports = createRoute({
		getParentRoute: () => shell,
		path: "/transactions/import",
		component: AccountRequired,
	});
	return createRouter({
		routeTree: root.addChildren([
			shell.addChildren([
				dashboard,
				transactions,
				transaction,
				categories,
				category,
				loans,
				settings,
				imports,
			]),
		]),
		history: createMemoryHistory({ initialEntries: ["/dashboard"] }),
		defaultPreload: false,
	});
}

export function DemoApp() {
	const [accessOpen, setAccessOpen] = useState(false);
	const requestAccess = useCallback(() => setAccessOpen(true), []);
	const [demoNow] = useState(() => new Date());
	const [data] = useState(() => createDemoData(demoNow));
	const [demo] = useState(() => ({
		requestAccess,
		advisorTransport: createDemoAdvisorTransport(demoNow),
	}));
	const [client] = useState(() => createDemoClient(requestAccess, data));
	const [queryClient] = useState(() => createDemoQueryClient(requestAccess));
	const [router] = useState(createDemoRouter);

	useEffect(() => {
		// Capture explicit write actions even in menus/dialogs rendered via portals.
		const onClick = (event: MouseEvent) => {
			// Menu items gate their onSelect themselves so Radix still closes the menu.
			if (
				event.target instanceof Element &&
				event.target.closest('[role="menuitem"]')
			)
				return;
			if (
				event.target instanceof Element &&
				event.target.closest("[data-demo-action]")
			) {
				event.preventDefault();
				event.stopImmediatePropagation();
				requestAccess();
			}
		};
		const onSubmit = (event: SubmitEvent) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			requestAccess();
		};
		document.addEventListener("click", onClick, true);
		document.addEventListener("submit", onSubmit, true);
		return () => {
			document.removeEventListener("click", onClick, true);
			document.removeEventListener("submit", onSubmit, true);
		};
	}, [requestAccess]);

	return (
		<DemoContext.Provider value={demo}>
			<ApiClientContext.Provider value={client}>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
					<Dialog open={accessOpen} onOpenChange={setAccessOpen}>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10">
									<Sparkles className="size-5" />
								</span>
								<DialogTitle className="text-2xl">
									Sign up to put your finances on autopilot.
								</DialogTitle>
								<DialogDescription>
									Connect Gmail and let AI turn your bank alerts into organized
									transactions. This live demo uses read-only sample data.
								</DialogDescription>
							</DialogHeader>
							<p className="text-sm text-muted-foreground">
								AutoFin is in closed beta. Request access to create your own
								workspace.
							</p>
							<Button asChild>
								<a
									href="mailto:sajagshrestha0852@gmail.com?subject=AutoFin%20beta%20access"
									target="_blank"
									rel="noreferrer"
								>
									<Mail className="size-4" /> Request signup access
								</a>
							</Button>
							<Button variant="outline" asChild>
								<a href="/login" target="_top">
									Already have access? Log in
								</a>
							</Button>
							<Button variant="ghost" onClick={() => setAccessOpen(false)}>
								Keep exploring the demo
							</Button>
						</DialogContent>
					</Dialog>
				</QueryClientProvider>
			</ApiClientContext.Provider>
		</DemoContext.Provider>
	);
}
