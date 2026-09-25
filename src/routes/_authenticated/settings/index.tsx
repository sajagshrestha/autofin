import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AiPreferencesSection } from "@/components/settings/AiPreferencesSection";
import { GmailSection } from "@/components/settings/GmailSection";
import { McpSection } from "@/components/settings/McpSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { SETTINGS_SECTIONS } from "@/components/settings/sections";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

const searchParamsSchema = z.object({
	gmail: z.enum(["connected", "error"]).optional(),
	detail: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/settings/")({
	validateSearch: searchParamsSchema,
	component: SettingsIndexPage,
});

function SettingsIndexPage() {
	const { user } = useAuth();
	const { gmail: gmailCallbackStatus, detail: gmailCallbackDetail } =
		Route.useSearch();

	// Toast the result of the Gmail OAuth redirect back from Google.
	useEffect(() => {
		if (gmailCallbackStatus === "connected") {
			toast.success("Gmail connected");
		} else if (gmailCallbackStatus === "error") {
			toast.error("Gmail connection failed", {
				description: gmailCallbackDetail
					? decodeURIComponent(gmailCallbackDetail)
					: "Please try again.",
			});
		}
	}, [gmailCallbackStatus, gmailCallbackDetail]);

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<div className="flex flex-wrap justify-between gap-4 items-center">
				<div>
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
						Settings
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Manage your account, integrations, and preferences.
					</p>
				</div>
				<Badge variant="outline" className="px-3 py-1 w-fit">
					{user?.email}
				</Badge>
			</div>

			{/* Desktop: tabbed interface */}
			<div className="hidden md:block">
				<Tabs
					defaultValue="gmail"
					orientation="vertical"
					className="grid items-start gap-6 md:grid-cols-[160px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)]"
				>
					<TabsList
						aria-label="Settings sections"
						className="h-auto flex-col items-stretch justify-start gap-1 border bg-card p-2"
					>
						{SETTINGS_SECTIONS.map(({ to, label, icon: Icon }) => (
							<TabsTrigger
								key={to}
								value={to.split("/").pop() || "gmail"}
								className="justify-start whitespace-normal text-left px-3 py-3"
							>
								<Icon className="size-4 shrink-0" />
								{label}
							</TabsTrigger>
						))}
					</TabsList>
					<div className="min-w-0">
						<TabsContent value="gmail" className="mt-0">
							<GmailSection />
						</TabsContent>
						<TabsContent value="ai" className="mt-0">
							<AiPreferencesSection />
						</TabsContent>
						<TabsContent value="mcp" className="mt-0">
							<McpSection />
						</TabsContent>
						<TabsContent value="notifications" className="mt-0">
							<NotificationsSection />
						</TabsContent>
					</div>
				</Tabs>
			</div>

			{/* Mobile: intermediary list of settings sections */}
			<nav aria-label="Settings sections" className="space-y-3 md:hidden">
				{SETTINGS_SECTIONS.map(({ to, label, description, icon: Icon }) => (
					<Link
						key={to}
						to={to as never}
						className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/40"
					>
						<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
							<Icon className="h-5 w-5" />
						</span>
						<span className="min-w-0 flex-1">
							<span className="block text-sm font-semibold">{label}</span>
							<span className="block truncate text-xs text-muted-foreground">
								{description}
							</span>
						</span>
						<ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
					</Link>
				))}
			</nav>
		</div>
	);
}
