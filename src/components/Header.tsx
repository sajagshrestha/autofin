import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
	ArrowUpRight,
	CreditCard,
	FolderTree,
	LayoutDashboard,
	LogOut,
	Menu,
	PanelLeftClose,
	PanelLeftOpen,
	Settings,
	Sparkles,
	Upload,
	Wallet,
	X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { useAdvisorChat } from "./ai-chat/advisor-chat-context";
import { Logo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "./ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from "./ui/drawer";

const NAV_ITEMS = [
	{ to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
	{ to: "/transactions", icon: CreditCard, label: "Transactions" },
	{ to: "/categories", icon: FolderTree, label: "Categories" },
	{ to: "/loans", icon: Wallet, label: "Loans" },
	{ to: "/settings", icon: Settings, label: "Settings" },
];

export default function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const { collapsed, toggle } = useSidebar();
	const { user, signOut } = useAuth();
	const { openChat } = useAdvisorChat();
	const navigate = useNavigate();
	const currentPath = useRouterState({
		select: (state) => state.location.pathname,
	});
	const active = (to: string) =>
		currentPath === to || currentPath.startsWith(`${to}/`);
	const handleSignOut = async () => {
		await signOut();
		navigate({ to: "/login" });
	};
	const navigation = (compact = false, mobile = false) =>
		NAV_ITEMS.map((item) => (
			<Link
				key={item.to}
				to={item.to}
				onClick={() => setMobileOpen(false)}
				aria-label={item.label}
				aria-current={active(item.to) ? "page" : undefined}
				title={compact ? item.label : undefined}
				className={cn(
					"group flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors",
					compact && "justify-center px-0",
					mobile && "w-full min-h-12 rounded-xl px-3.5",
					active(item.to)
						? "bg-primary/10 text-primary"
						: "text-muted-foreground hover:bg-muted hover:text-foreground",
				)}
			>
				<item.icon className="size-[18px] shrink-0" />
				{!compact && (
					<>
						<span className="flex-1">{item.label}</span>
						{!mobile && active(item.to) ? (
							<span className="size-1.5 rounded-full bg-primary" />
						) : null}
					</>
				)}
			</Link>
		));
	return (
		<>
			<a
				href="#main-content"
				className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only"
			>
				Skip to content
			</a>
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-sidebar md:flex transition-[width] duration-200",
					collapsed ? "w-20" : "w-60",
				)}
			>
				<div
					className={cn(
						"flex min-h-20 items-center px-5",
						collapsed
							? "flex-col justify-center gap-2 py-4"
							: "justify-between gap-2",
					)}
				>
					<Link to="/dashboard" aria-label="AutoFin home">
						{collapsed ? (
							<img
								src="/mini-logo-192.png"
								alt="AutoFin"
								className="size-9 rounded-lg"
							/>
						) : (
							<Logo className="h-9" />
						)}
					</Link>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={toggle}
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						aria-expanded={!collapsed}
					>
						{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
					</Button>
				</div>
				<div className="flex-1 overflow-y-auto px-3 py-5">
					{!collapsed && (
						<p className="mb-3 px-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
							Your workspace
						</p>
					)}
					<nav aria-label="Main navigation" className="space-y-1.5">
						{navigation(collapsed)}
					</nav>
					<div className="my-5 border-t" />
					<Button
						variant="ghost"
						className={cn(
							"w-full justify-start text-muted-foreground",
							collapsed && "justify-center px-0",
						)}
						onClick={openChat}
						aria-label="Ask AI advisor"
						title={collapsed ? "AI advisor" : undefined}
					>
						<Sparkles className="size-[18px]" />
						{!collapsed && "AI advisor"}
					</Button>
				</div>
				{!collapsed && (
					<div className="mx-4 mb-5 rounded-2xl border bg-card p-4">
						<div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<Upload className="size-4" />
						</div>
						<p className="text-sm font-semibold">Less manual entry.</p>
						<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
							Turn a bank statement into organized transactions.
						</p>
						<Link
							to="/transactions/import"
							className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
						>
							Import a statement <ArrowUpRight className="size-3.5" />
						</Link>
					</div>
				)}
				<div
					className={cn(
						"border-t p-3",
						collapsed && "flex flex-col items-center",
					)}
				>
					<Link
						to="/settings"
						aria-label="Account settings"
						className={cn(
							"flex min-w-0 items-center gap-3 rounded-xl p-2 hover:bg-muted",
							collapsed && "justify-center",
						)}
					>
						<span className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-card text-sm font-semibold">
							{user?.email?.charAt(0).toUpperCase() || "A"}
						</span>
						{!collapsed && (
							<span className="min-w-0">
								<span className="block text-sm font-medium">
									Personal account
								</span>
								<span className="block truncate text-xs text-muted-foreground">
									{user?.email}
								</span>
							</span>
						)}
					</Link>
					<div
						className={cn(
							"mt-2 flex items-center justify-between gap-1 px-1",
							collapsed && "flex-col",
						)}
					>
						<ThemeSwitcher />
						<Button
							variant="ghost"
							size={collapsed ? "icon-sm" : "sm"}
							onClick={handleSignOut}
							aria-label="Sign out"
							className="text-muted-foreground"
						>
							<LogOut />
							{!collapsed && "Sign out"}
						</Button>
					</div>
				</div>
			</aside>
			<header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur-xl md:hidden">
				<Link to="/dashboard" aria-label="AutoFin home">
					<Logo className="h-8" />
				</Link>
				<div className="flex items-center gap-2">
					<ThemeSwitcher />
					<Drawer
						open={mobileOpen}
						onOpenChange={setMobileOpen}
						direction="right"
					>
						<DrawerContent className="h-dvh overflow-hidden bg-card pt-[env(safe-area-inset-top)] shadow-2xl data-[vaul-drawer-direction=right]:w-[min(88vw,24rem)] data-[vaul-drawer-direction=right]:max-w-[24rem]">
							<div className="flex shrink-0 items-center justify-between gap-4 px-5 py-6">
								<div>
									<DrawerTitle className="text-xl font-semibold tracking-tight">
										Your workspace
									</DrawerTitle>
									<DrawerDescription className="mt-1 text-xs">
										Everything you need, in one place.
									</DrawerDescription>
								</div>
							</div>
							<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-5">
								<p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
									Navigate
								</p>
								<nav
									aria-label="Mobile navigation"
									className="w-full space-y-1"
								>
									{navigation(false, true)}
									<Button
										variant="ghost"
										onClick={() => {
											setMobileOpen(false);
											void handleSignOut();
										}}
										className="min-h-12 w-full justify-start gap-3 rounded-xl px-3.5 text-sm font-medium text-muted-foreground"
									>
										<LogOut className="size-[18px] shrink-0" />
										Sign out
									</Button>
								</nav>
								<div className="mt-6 space-y-2 border-t px-1 pt-5">
									<p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
										Tools
									</p>
									<Button
										variant="outline"
										className="h-auto min-h-16 w-full justify-start gap-3 rounded-xl border-primary/15 bg-primary/5 px-3 py-3 text-left whitespace-normal hover:bg-primary/10"
										onClick={() => {
											setMobileOpen(false);
											openChat();
										}}
									>
										<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
											<Sparkles className="size-4" />
										</span>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-medium">
												AI advisor
											</span>
											<span className="mt-0.5 block text-xs font-normal text-muted-foreground">
												Make sense of your spending
											</span>
										</span>
									</Button>
									<Button
										variant="ghost"
										className="h-auto min-h-16 w-full justify-start gap-3 rounded-xl px-3 py-3 text-left whitespace-normal"
										asChild
									>
										<Link
											to="/transactions/import"
											onClick={() => setMobileOpen(false)}
										>
											<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
												<Upload className="size-4" />
											</span>
											<span className="min-w-0 flex-1">
												<span className="block text-sm font-medium">
													Import statement
												</span>
												<span className="mt-0.5 block text-xs font-normal text-muted-foreground">
													Add transactions from a file
												</span>
											</span>
										</Link>
									</Button>
								</div>
							</div>
							<div className="flex shrink-0 items-center gap-3 border-t bg-muted/20 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
								<Link
									to="/settings"
									onClick={() => setMobileOpen(false)}
									aria-label="Account settings"
									className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
								>
									<span className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-card text-sm font-semibold">
										{user?.email?.charAt(0).toUpperCase() || "A"}
									</span>
									<span className="min-w-0">
										<span className="block text-xs font-semibold">
											Personal account
										</span>
										<span className="mt-0.5 block break-all text-xs text-muted-foreground">
											{user?.email}
										</span>
									</span>
								</Link>
								<DrawerClose asChild>
									<Button
										variant="ghost"
										size="icon"
										aria-label="Close menu"
										className="size-11 shrink-0 rounded-full border bg-background text-muted-foreground"
									>
										<X className="size-5" />
									</Button>
								</DrawerClose>
							</div>
						</DrawerContent>
					</Drawer>
				</div>
			</header>
			<nav
				aria-label="Quick navigation"
				className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t bg-card/95 px-2 backdrop-blur-xl md:hidden"
			>
				{[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[3]].map((item) => (
					<Link
						key={item.to}
						to={item.to}
						aria-current={active(item.to) ? "page" : undefined}
						className={cn(
							"flex min-h-16 min-w-16 flex-col items-center justify-center gap-1 text-[10px] font-medium",
							active(item.to) ? "text-primary" : "text-muted-foreground",
						)}
					>
						<span
							className={cn(
								"rounded-xl px-4 py-1",
								active(item.to) && "bg-primary/10",
							)}
						>
							<item.icon className="size-[18px]" />
						</span>
						{item.label}
					</Link>
				))}
				<Button
					variant="ghost"
					onClick={() => setMobileOpen(true)}
					aria-label="Open menu"
					className="flex min-h-16 min-w-16 flex-col items-center justify-center gap-1 rounded-none px-2 text-[10px] font-medium text-muted-foreground"
				>
					<span className="rounded-xl px-4 py-1">
						<Menu className="size-[18px]" />
					</span>
					More
				</Button>
			</nav>
		</>
	);
}
