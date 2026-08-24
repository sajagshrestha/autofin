import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AiPreferencesSection } from "@/components/settings/AiPreferencesSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { GmailSection } from "@/components/settings/GmailSection";
import { McpSection } from "@/components/settings/McpSection";
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
		<div className="mx-auto max-w-2xl space-y-8">
			<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
					<p className="mt-1 text-muted-foreground">
						Manage your account, integrations, and preferences.
					</p>
				</div>
				<Badge variant="outline" className="px-3 py-1 w-fit">
					{user?.email}
				</Badge>
			</div>

			{/* Desktop: tabbed interface */}
			<div className="hidden md:block">
				<Tabs defaultValue="gmail" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="gmail">Gmail</TabsTrigger>
						<TabsTrigger value="ai">AI Preferences</TabsTrigger>
						<TabsTrigger value="mcp">MCP</TabsTrigger>
						<TabsTrigger value="appearance">Appearance</TabsTrigger>
					</TabsList>
					<TabsContent value="gmail" className="mt-6">
						<GmailSection />
					</TabsContent>
					<TabsContent value="ai" className="mt-6">
						<AiPreferencesSection />
					</TabsContent>
					<TabsContent value="mcp" className="mt-6">
						<McpSection />
					</TabsContent>
					<TabsContent value="appearance" className="mt-6">
						<AppearanceSection />
					</TabsContent>
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
