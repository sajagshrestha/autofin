import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
	CreditCard,
	FolderTree,
	Home,
	LogOut,
	Menu,
	Settings,
	Wallet,
	X,
} from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "./ui/button";

const NAV_ITEMS = [
	{ to: "/dashboard", icon: Home, label: "Home", exact: true },
	{
		to: "/transactions",
		icon: CreditCard,
		label: "Transactions",
		exact: false,
	},
	{
		to: "/categories",
		icon: FolderTree,
		label: "Categories",
		exact: false,
	},
	{ to: "/loans", icon: Wallet, label: "Loans", exact: true },
	{ to: "/settings", icon: Settings, label: "Settings", exact: false },
];

export default function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	const [hidden, setHidden] = useState(false);
	const lastY = useRef(0);
	const { scrollY } = useScroll();
	useMotionValueEvent(scrollY, "change", (y) => {
		const previous = lastY.current;
		lastY.current = y;
		if (y > previous && y > 96) {
			setHidden(true);
		} else if (y < previous) {
			setHidden(false);
		}
	});

	const handleSignOut = async () => {
		await signOut();
		navigate({ to: "/login" });
	};

	const isActive = (to: string, exact: boolean) => {
		if (exact) {
			return currentPath === to;
		}
		return currentPath.startsWith(to);
	};

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex fixed left-0 top-0 h-full w-64 lg:w-72 flex-col bg-background/80 backdrop-blur-xl border-r border-border z-40">
				{/* Logo */}
				<div className="px-6 py-5 border-b border-border/60">
					<Link to="/dashboard" className="gap-3">
						<Logo className="h-8" />
					</Link>
				</div>

				{/* Navigation Links */}
				<nav className="flex-1 px-3 py-4 space-y-1">
					{NAV_ITEMS.map((item) => {
						const active = isActive(item.to, item.exact);
						return (
							<Link
								key={item.to}
								to={item.to}
								className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
									active
										? "bg-primary/10 text-primary font-semibold"
										: "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
								}`}
							>
								<item.icon
									className={`h-4 w-4 ${active ? "stroke-[2.25]" : ""}`}
								/>
								<span>{item.label}</span>
							</Link>
						);
					})}
				</nav>

				{/* User Section */}
				<div className="p-4 border-t border-border/60">
					<div className="flex items-center gap-3">
						<Link
							to="/settings"
							className="flex items-center gap-3 flex-1 min-w-0 rounded-lg hover:bg-muted px-1 py-1 transition-colors"
							aria-label="Settings"
						>
							<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
								<span className="text-sm font-semibold text-primary">
									{user?.email?.charAt(0).toUpperCase() || "U"}
								</span>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">
									{user?.email}
								</p>
							</div>
						</Link>
						<div className="flex items-center gap-1 shrink-0">
							<ThemeSwitcher />
							<Button
								variant="ghost"
								size="icon"
								onClick={handleSignOut}
								aria-label="Sign out"
							>
								<LogOut className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</aside>

			{/* Mobile Header */}
			<motion.header
				initial={false}
				animate={hidden ? { y: -64 } : { y: 0 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-xl border-b border-border z-50 flex items-center justify-between px-4"
			>
				<Link to="/dashboard">
					<Logo className="h-7" />
				</Link>
				<div className="flex items-center gap-2">
					<ThemeSwitcher />
					<button
						onClick={() => setIsMobileMenuOpen(true)}
						className="p-2 hover:bg-accent rounded-lg transition-colors"
						aria-label="Open menu"
						type="button"
					>
						<Menu size={24} />
					</button>
				</div>
			</motion.header>

			{/* Mobile Slide-in Menu */}
			{isMobileMenuOpen && (
				<div
					className="md:hidden fixed inset-0 bg-black/50 z-50"
					onClick={() => setIsMobileMenuOpen(false)}
				>
					<aside
						className="fixed top-0 right-0 h-full w-72 bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between p-4 border-b border-border">
							<h2 className="text-lg font-bold">Menu</h2>
							<button
								onClick={() => setIsMobileMenuOpen(false)}
								className="p-2 hover:bg-accent rounded-lg transition-colors"
								aria-label="Close menu"
								type="button"
							>
								<X size={24} />
							</button>
						</div>

						<nav className="flex-1 p-4 space-y-1">
							{NAV_ITEMS.map((item) => {
								const active = isActive(item.to, item.exact);
								return (
									<Link
										key={item.to}
										to={item.to}
										onClick={() => setIsMobileMenuOpen(false)}
										className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
											active
												? "bg-primary text-primary-foreground"
												: "hover:bg-accent text-foreground"
										}`}
									>
										<item.icon className="h-5 w-5" />
										<span>{item.label}</span>
									</Link>
								);
							})}
						</nav>

						{user && (
							<div className="p-4 border-t border-border">
								<Link
									to="/settings"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center gap-3 mb-3 rounded-lg hover:bg-accent px-1 py-1 transition-colors"
								>
									<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
										<span className="text-sm font-semibold text-primary">
											{user?.email?.charAt(0).toUpperCase() || "U"}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{user?.email}
										</p>
									</div>
								</Link>
								<Button
									variant="outline"
									className="w-full"
									onClick={handleSignOut}
								>
									<LogOut className="mr-2 h-4 w-4" />
									Sign Out
								</Button>
							</div>
						)}
					</aside>
				</div>
			)}

			{/* Mobile Bottom Navigation */}
			<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-t border-border z-40 flex items-center justify-around px-2 safe-area-inset-bottom">
				{NAV_ITEMS.slice(0, 4).map((item) => {
					const active = isActive(item.to, item.exact);
					return (
						<Link
							key={item.to}
							to={item.to}
							className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
								active
									? "text-primary"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							<item.icon
								className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`}
							/>
							<span className="text-xs mt-1">{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Spacer for fixed header on mobile */}
			<div className="md:hidden h-14" />
		</>
	);
}
