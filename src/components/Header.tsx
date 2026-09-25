import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
	ChevronsUpDown,
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
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { useAdvisorChat } from "./ai-chat/advisor-chat-context";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from "./ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NAV_ITEMS = [
	{ to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
	{ to: "/transactions", icon: CreditCard, label: "Transactions" },
	{ to: "/categories", icon: FolderTree, label: "Categories" },
	{ to: "/loans", icon: Wallet, label: "Loans" },
	{ to: "/settings", icon: Settings, label: "Settings" },
];

export default function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [signOutOpen, setSignOutOpen] = useState(false);
	const [signingOut, setSigningOut] = useState(false);
	const cancelSignOutRef = useRef<HTMLButtonElement>(null);
	const { collapsed, toggle } = useSidebar();
	const reduceMotion = useReducedMotion();
	const { user, signOut } = useAuth();
	const demo = useDemo();
	const accountEmail = demo ? "demo@autofin.app" : user?.email;
	const { openChat } = useAdvisorChat();
	const navigate = useNavigate();
	const currentPath = useRouterState({
		select: (state) => state.location.pathname,
	});
	const active = (to: string) =>
		currentPath === to || currentPath.startsWith(`${to}/`);
	const handleSignOut = () => {
		if (demo) {
			demo.requestAccess();
			return;
		}
		setSignOutOpen(true);
	};
	const confirmSignOut = async () => {
		if (signingOut) return;
		setSigningOut(true);
		try {
			await signOut();
			setSignOutOpen(false);
			await navigate({ to: "/login" });
		} catch {
			toast.error("Could not sign out. Please try again.");
		} finally {
			setSigningOut(false);
		}
	};

	const navigation = (compact = false, mobile = false, items = NAV_ITEMS) =>
		items.map((item) => (
			<Link
				key={item.to}
				to={item.to}
				data-demo-action={demo && item.to === "/settings" ? "" : undefined}
				onClick={() => setMobileOpen(false)}
				aria-label={item.label}
				aria-current={active(item.to) ? "page" : undefined}
				title={compact ? item.label : undefined}
				className={cn(
					"group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					compact && "justify-center px-0",
					mobile && "w-full min-h-12 rounded-xl px-3.5",
					active(item.to)
						? mobile
							? "bg-primary/10 text-primary"
							: "bg-background text-foreground shadow-xs ring-1 ring-border"
						: "text-muted-foreground hover:bg-muted hover:text-foreground",
				)}
			>
				<item.icon className="size-[18px] shrink-0" />
				{!compact && (
					<>
						<span className="flex-1">{item.label}</span>
						{!mobile && active(item.to) ? (
							<span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-primary" />
						) : null}
					</>
				)}
			</Link>
		));
	return (
		<>
			<Dialog
				open={signOutOpen}
				onOpenChange={(open) => {
					if (!signingOut) setSignOutOpen(open);
				}}
			>
				<DialogContent
					className="sm:max-w-sm"
					onOpenAutoFocus={(event) => {
						event.preventDefault();
						cancelSignOutRef.current?.focus();
					}}
				>
					<DialogHeader>
						<DialogTitle>Sign out of AutoFin?</DialogTitle>
						<DialogDescription>
							You’ll need to log in again to access your account.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							ref={cancelSignOutRef}
							variant="outline"
							disabled={signingOut}
							onClick={() => setSignOutOpen(false)}
						>
							Cancel
						</Button>
						<Button disabled={signingOut} onClick={confirmSignOut}>
							{signingOut ? "Signing out…" : "Sign out"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<a
				href="#main-content"
				className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only"
			>
				Skip to content
			</a>
			<motion.aside
				initial={false}
				animate={{ width: collapsed ? 80 : 240 }}
				transition={
					reduceMotion
						? { duration: 0 }
						: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
				}
				className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border/70 bg-sidebar md:flex"
			>
				<div
					className={cn(
						"flex min-h-16 items-center px-5",
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
							<Logo className="h-7" />
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
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-5">
					<nav aria-label="Main navigation" className="space-y-1">
						{navigation(
							collapsed,
							false,
							NAV_ITEMS.filter((item) => item.to !== "/settings"),
						)}
					</nav>
					<div className="min-h-8 flex-1" />
					<Button
						variant="ghost"
						className={cn(
							"h-auto min-h-11 w-full justify-start gap-3 rounded-xl border border-border/70 bg-background/50 p-3 text-foreground hover:bg-background",
							collapsed && "justify-center px-0",
						)}
						onClick={demo?.requestAccess ?? openChat}
						aria-label="Ask AI advisor"
						title={collapsed ? "AI advisor" : undefined}
					>
						<Sparkles className="size-[18px]" />
						{!collapsed && (
							<span className="min-w-0 text-left">
								<span className="block text-sm font-medium">AI advisor</span>
								<span className="mt-0.5 block text-xs font-normal text-muted-foreground">
									Ask about your money
								</span>
							</span>
						)}
					</Button>
				</div>

				<div
					className={cn(
						"border-t border-border/70 p-3",
						collapsed && "flex flex-col items-center",
					)}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								aria-label="Account menu"
								title={collapsed ? "Account menu" : undefined}
								className={cn(
									"flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted",
									collapsed && "justify-center",
								)}
							>
								<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-sm font-semibold">
									{accountEmail?.charAt(0).toUpperCase() || "A"}
								</span>
								{!collapsed && (
									<>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-medium">
												{demo ? "Demo account" : "Personal account"}
											</span>
											<span
												title={accountEmail}
												className="block truncate text-xs text-muted-foreground"
											>
												{accountEmail}
											</span>
										</span>
										<ChevronsUpDown
											aria-hidden="true"
											className="size-4 shrink-0 text-muted-foreground"
										/>
									</>
								)}
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							side="top"
							align="start"
							sideOffset={12}
							className="w-64 rounded-xl p-1.5"
						>
							<DropdownMenuLabel className="px-2 py-2">
								<span className="block text-sm">
									{demo ? "Demo account" : "Personal account"}
								</span>
								<span className="mt-1 block break-all text-xs font-normal text-muted-foreground">
									{accountEmail}
								</span>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link to="/settings" data-demo-action>
									<Settings aria-hidden="true" className="mr-2 size-4" />
									Settings
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={handleSignOut}>
								<LogOut aria-hidden="true" className="mr-2 size-4" />
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</motion.aside>
			<header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur-xl md:hidden">
				<Link to="/dashboard" aria-label="AutoFin home">
					<Logo className="h-8" />
				</Link>
				<div className="flex items-center gap-2">
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
											if (demo) demo.requestAccess();
											else openChat();
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
										{accountEmail?.charAt(0).toUpperCase() || "A"}
									</span>
									<span className="min-w-0">
										<span className="block text-xs font-semibold">
											{demo ? "Demo account" : "Personal account"}
										</span>
										<span className="mt-0.5 block break-all text-xs text-muted-foreground">
											{accountEmail}
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
				className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-sidebar/95 px-3 pt-2 shadow-[0_-8px_24px_-16px_#0005] backdrop-blur-xl md:hidden"
			>
				<div className="mx-auto grid w-full max-w-lg grid-cols-4 gap-1 pb-2">
					{[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[3]].map((item) => (
						<Link
							key={item.to}
							to={item.to}
							aria-current={active(item.to) ? "page" : undefined}
							className={cn(
								"relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								active(item.to)
									? "font-semibold text-foreground before:pointer-events-none before:absolute before:-top-2 before:left-1/2 before:h-0.5 before:w-8 before:-translate-x-1/2 before:rounded-full before:bg-foreground"
									: "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<item.icon
								aria-hidden="true"
								className="size-5"
								strokeWidth={active(item.to) ? 2.2 : 1.7}
							/>
							<span>{item.label}</span>
						</Link>
					))}
					<button
						type="button"
						onClick={() => setMobileOpen(true)}
						aria-label="More navigation options"
						aria-haspopup="dialog"
						aria-expanded={mobileOpen}
						className={cn(
							"relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							mobileOpen || active("/categories") || active("/settings")
								? "font-semibold text-foreground before:pointer-events-none before:absolute before:-top-2 before:left-1/2 before:h-0.5 before:w-8 before:-translate-x-1/2 before:rounded-full before:bg-foreground"
								: "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						<Menu aria-hidden="true" className="size-5" strokeWidth={1.7} />
						<span>More</span>
					</button>
				</div>
			</nav>
		</>
	);
}
