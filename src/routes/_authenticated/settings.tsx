import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	CheckCircle2,
	Copy,
	ExternalLink,
	Filter,
	Loader2,
	Mail,
	Monitor,
	Moon,
	Palette,
	Plug,
	Radio,
	RefreshCw,
	Sparkles,
	Sun,
	XCircle,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
	THEME_NAMES,
	type ThemeMode,
	type ThemeName,
	useTheme,
} from "@/contexts/ThemeContext";
import {
	useDisconnectGmailAccount,
	useSetSenderFilters,
	useStartGmailWatch,
	useStopGmailWatch,
} from "@/hooks/gmail/mutations";
import {
	useGetGmailAuthorizationUrl,
	useGetGmailConnectionStatus,
	useGetGmailWatchStatus,
	useGetSenderFilters,
} from "@/hooks/gmail/queries";
import { useUpdatePreferences } from "@/hooks/preferences/mutations";
import { useGetPreferences } from "@/hooks/preferences/queries";
import { rpc, unwrap } from "@/lib/api-client";

const searchParamsSchema = z.object({
	gmail: z.enum(["connected", "error"]).optional(),
	detail: z.string().optional(),
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmailsFromTextarea(text: string): string[] {
	return text
		.split("\n")
		.map((line) => line.trim().toLowerCase())
		.filter((line) => line.length > 0);
}

function validateEmails(emails: string[]): {
	valid: string[];
	invalid: string[];
} {
	const valid: string[] = [];
	const invalid: string[] = [];
	for (const email of emails) {
		if (EMAIL_REGEX.test(email)) {
			valid.push(email);
		} else {
			invalid.push(email);
		}
	}
	return { valid, invalid };
}

export const Route = createFileRoute("/_authenticated/settings")({
	validateSearch: searchParamsSchema,
	component: SettingsPage,
});

function SettingsPage() {
	const { user } = useAuth();
	const { gmail: gmailCallbackStatus, detail: gmailCallbackDetail } =
		Route.useSearch();
	const filterEmailsId = useId();
	const [filterInput, setFilterInput] = useState("");
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

	const { data: authUrlData, isLoading: isAuthUrlLoading } =
		useGetGmailAuthorizationUrl();
	const {
		data: connectionStatus,
		isLoading: isStatusLoading,
		refetch: refetchStatus,
	} = useGetGmailConnectionStatus();
	const {
		data: senderFilters,
		isLoading: isFiltersLoading,
		isFetched: isFiltersFetched,
	} = useGetSenderFilters({ enabled: connectionStatus?.authorized ?? false });
	const { data: watchStatus } = useGetGmailWatchStatus({
		enabled:
			(connectionStatus?.authorized ?? false) &&
			(senderFilters?.emails?.length ?? 0) > 0,
	});

	const { data: mcpTokenData } = useQuery({
		queryKey: ["integrations", "mcp-token"],
		queryFn: async () => {
			const res = await rpc.api.integrations.mcp.token.$get();
			return unwrap<{ token: string; url: string }>(res);
		},
	});

	const copyValue = (key: string, value: string) => {
		void navigator.clipboard.writeText(value);
		setCopiedKey(key);
		setTimeout(() => setCopiedKey(null), 1500);
	};

	const disconnectMutation = useDisconnectGmailAccount();
	const setFiltersMutation = useSetSenderFilters();
	const startWatchMutation = useStartGmailWatch();
	const stopWatchMutation = useStopGmailWatch();

	const isConnected = connectionStatus?.authorized ?? false;
	const isLoading = isAuthUrlLoading || isStatusLoading;
	const emails = senderFilters?.emails ?? [];
	const hasFilters = emails.length > 0;

	// Sync filter input when data loads (only on first fetch to avoid overwriting user edits)
	const displayFilterValue =
		filterInput !== "" ? filterInput : emails.join("\n");

	const handleConnectGoogle = () => {
		if (authUrlData?.authorizationUrl) {
			window.location.href = authUrlData.authorizationUrl;
		}
	};

	const handleDisconnectGoogle = () => {
		disconnectMutation.mutate(undefined, {
			onSuccess: () => {
				refetchStatus();
				setFilterInput("");
				toast.success("Google account disconnected");
			},
			onError: (error) => {
				toast.error("Failed to disconnect", {
					description: error.message,
				});
			},
		});
	};

	const handleSaveFilters = () => {
		const parsed = parseEmailsFromTextarea(displayFilterValue);
		const { valid, invalid } = validateEmails(parsed);

		if (invalid.length > 0) {
			toast.error("Invalid email addresses", {
				description: invalid.join(", "),
			});
			return;
		}

		setFiltersMutation.mutate(
			{ emails: valid },
			{
				onSuccess: () => {
					setFilterInput("");
					toast.success("Filter list saved");
				},
				onError: (error) => {
					toast.error("Failed to save filters", {
						description: error.message,
					});
				},
			},
		);
	};

	const handleStartWatching = () => {
		startWatchMutation.mutate(undefined, {
			onSuccess: (data) => {
				toast.success("Gmail watch started", {
					description: `Watching until ${new Date(data.expiration).toLocaleString()}`,
				});
			},
			onError: (error) => {
				toast.error("Failed to start watching", {
					description: error.message,
				});
			},
		});
	};

	const handleStopWatching = () => {
		stopWatchMutation.mutate(undefined, {
			onSuccess: () => {
				toast.success("Gmail watch stopped");
			},
			onError: (error) => {
				toast.error("Failed to stop watching", {
					description: error.message,
				});
			},
		});
	};

	const step1Complete = isConnected;
	const step2Complete = hasFilters;
	const step2Current = isConnected && !hasFilters;
	const step3Complete = watchStatus?.hasWatch ?? false;
	const step3Current = hasFilters && !step3Complete;

	return (
		<div className="mx-auto max-w-2xl space-y-8">
			{/* AI Preferences state lives at page level so the tab keeps values */}
			<Tabs defaultValue="gmail" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="gmail">Gmail</TabsTrigger>
					<TabsTrigger value="ai">AI Preferences</TabsTrigger>
					<TabsTrigger value="mcp">MCP</TabsTrigger>
					<TabsTrigger value="appearance">Appearance</TabsTrigger>
				</TabsList>

				<TabsContent value="gmail" className="mt-6 space-y-8">
					{/* Welcome Section */}
					<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
							<p className="mt-1 text-muted-foreground">
								Set up Gmail integration in 3 steps.
							</p>
						</div>
						<Badge variant="outline" className="px-3 py-1">
							{user?.email}
						</Badge>
					</div>

					{/* Step Indicator */}
					<div className="flex items-center gap-2">
						<StepCircle
							step={1}
							complete={step1Complete}
							current={!step1Complete}
							label="Connect Gmail"
						/>
						<StepConnector active={step1Complete} />
						<StepCircle
							step={2}
							complete={step2Complete}
							current={step2Current}
							label="Set Filters"
						/>
						<StepConnector active={step2Complete} />
						<StepCircle
							step={3}
							complete={step3Complete}
							current={step3Current}
							label="Start Watch"
						/>
					</div>

					{/* Step 1: Connect Gmail */}
					<Card
						className={`border-l-4 transition-shadow ${
							step1Complete
								? "border-l-ds-green-700"
								: "border-l-primary shadow-sm hover:shadow-md"
						}`}
					>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2 space-y-1">
									<Mail className="h-5 w-5 shrink-0" />
									<div>
										<CardTitle>Step 1: Connect Gmail</CardTitle>
										<CardDescription>
											Securely connect your account. We only read emails from
											senders you specify.
										</CardDescription>
									</div>
								</div>
								{isConnected && (
									<Badge className="bg-ds-green-700 hover:bg-ds-green-800">
										<CheckCircle2 className="mr-1 h-3 w-3" />
										Connected
									</Badge>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
								</div>
							) : isConnected ? (
								<div className="space-y-4">
									<div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
										<div className="rounded-full bg-background p-2">
											<CheckCircle2 className="h-5 w-5 text-ds-green-700" />
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium">
												{connectionStatus?.emailAddress}
											</p>
											<p className="text-xs text-muted-foreground">
												Active Connection
											</p>
										</div>
									</div>
									<Button
										variant="destructive"
										className="w-full"
										onClick={handleDisconnectGoogle}
										disabled={disconnectMutation.isPending}
									>
										{disconnectMutation.isPending ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : null}
										Disconnect
									</Button>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center space-y-4 py-6">
									<div className="rounded-full bg-muted p-4">
										<Mail className="h-8 w-8 text-muted-foreground" />
									</div>
									<div className="max-w-xs space-y-1 text-center">
										<p className="font-medium">No Account Connected</p>
										<p className="text-sm text-muted-foreground">
											Connect your Gmail to automatically track expenses from
											bank alerts and receipts.
										</p>
									</div>
									<Button
										onClick={handleConnectGoogle}
										disabled={isLoading}
										className="w-full"
										size="lg"
									>
										{isLoading ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<RefreshCw className="mr-2 h-4 w-4" />
										)}
										Connect Gmail
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Step 2: Set Filter List */}
					<Card
						className={`border-l-4 transition-shadow ${
							step2Complete
								? "border-l-ds-green-700"
								: isConnected
									? "border-l-primary shadow-sm hover:shadow-md"
									: "border-l-muted opacity-60"
						}`}
					>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2 space-y-1">
									<Filter className="h-5 w-5 shrink-0" />
									<div>
										<CardTitle>Step 2: Set Filter List</CardTitle>
										<CardDescription>
											Add sender email addresses to monitor (e.g. bank alerts,
											noreply@yourbank.com). One per line.
										</CardDescription>
									</div>
								</div>
								{step2Complete && (
									<Badge className="bg-ds-green-700 hover:bg-ds-green-800">
										<CheckCircle2 className="mr-1 h-3 w-3" />
										{emails.length} filter{emails.length !== 1 ? "s" : ""}
									</Badge>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{!isConnected ? (
								<p className="py-4 text-center text-sm text-muted-foreground">
									Connect Gmail first to set up filters.
								</p>
							) : isFiltersLoading && !isFiltersFetched ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
								</div>
							) : (
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor={filterEmailsId}>
											Sender emails (one per line)
										</Label>
										<Textarea
											id={filterEmailsId}
											placeholder={"alerts@bank.com\nnoreply@anotherbank.com"}
											rows={5}
											value={displayFilterValue}
											onChange={(e) => setFilterInput(e.target.value)}
											className="font-mono text-sm"
										/>
									</div>
									<Button
										onClick={handleSaveFilters}
										disabled={setFiltersMutation.isPending}
										className="w-full"
									>
										{setFiltersMutation.isPending ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : null}
										Save Filters
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Step 3: Start Watch */}
					<Card
						className={`border-l-4 transition-shadow ${
							step3Complete
								? "border-l-ds-green-700"
								: hasFilters
									? "border-l-primary shadow-sm hover:shadow-md"
									: "border-l-muted opacity-60"
						}`}
					>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2 space-y-1">
									<Radio className="h-5 w-5 shrink-0" />
									<div>
										<CardTitle>Step 3: Start Watch</CardTitle>
										<CardDescription>
											Start watching for new emails. Watch expires every 7
											days—check back to renew.
										</CardDescription>
									</div>
								</div>
								{step3Complete && (
									<Badge className="bg-ds-green-700 hover:bg-ds-green-800">
										<CheckCircle2 className="mr-1 h-3 w-3" />
										Watching
									</Badge>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{!hasFilters ? (
								<p className="py-4 text-center text-sm text-muted-foreground">
									Set your filter list first, then start the watch.
								</p>
							) : (
								<div className="space-y-4">
									{step3Complete && watchStatus?.expiration && (
										<p className="text-sm text-muted-foreground">
											Expires:{" "}
											{new Date(watchStatus.expiration).toLocaleString()}
										</p>
									)}
									<div className="flex gap-3">
										<Button
											variant="outline"
											onClick={handleStartWatching}
											disabled={startWatchMutation.isPending}
											className="flex-1"
										>
											{startWatchMutation.isPending ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : (
												<Radio className="mr-2 h-4 w-4" />
											)}
											Start Watch
										</Button>
										<Button
											variant="outline"
											onClick={handleStopWatching}
											disabled={stopWatchMutation.isPending}
											className="flex-1"
										>
											{stopWatchMutation.isPending ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : (
												<XCircle className="mr-2 h-4 w-4" />
											)}
											Stop Watch
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="ai" className="mt-6">
					<AiPreferencesCard />
				</TabsContent>

				<TabsContent value="mcp" className="mt-6">
					{/* MCP Server */}
					<Card className="border-dashed">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2 space-y-1">
									<Plug className="h-5 w-5 shrink-0" />
									<div>
										<CardTitle>Connect AI assistants (MCP)</CardTitle>
										<CardDescription>
											Let Claude Desktop, Cursor, or any MCP client read your
											finances through the same tools the advisor uses.
										</CardDescription>
									</div>
								</div>
								<Badge variant="outline">Advanced</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-1.5">
								<Label htmlFor="mcp-url">Server URL</Label>
								<div className="flex gap-2">
									<Input
										id="mcp-url"
										readOnly
										value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/mcp`}
										className="font-mono text-xs"
									/>
									<Button
										variant="outline"
										size="icon"
										className="h-9 w-9 shrink-0"
										aria-label="Copy server URL"
										onClick={() =>
											copyValue("url", `${window.location.origin}/api/mcp`)
										}
									>
										{copiedKey === "url" ? (
											<Check className="h-4 w-4 text-ds-green-700" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="mcp-token">Personal access token</Label>
								<div className="flex gap-2">
									<Input
										id="mcp-token"
										readOnly
										value={mcpTokenData?.token ?? ""}
										placeholder={isLoading ? "Loading…" : ""}
										className="font-mono text-xs"
									/>
									<Button
										variant="outline"
										size="icon"
										className="h-9 w-9 shrink-0"
										disabled={!mcpTokenData?.token}
										aria-label="Copy access token"
										onClick={() =>
											copyValue("token", mcpTokenData?.token ?? "")
										}
									>
										{copiedKey === "token" ? (
											<Check className="h-4 w-4 text-ds-green-700" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
								<p className="text-xs text-muted-foreground">
									Treat it like a password — it grants read access to your
									transactions. Rotating MCP_TOKEN_SECRET revokes all tokens.
								</p>
							</div>

							<div className="space-y-1.5">
								<Label>Example client configuration</Label>
								<pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">
									{JSON.stringify(
										{
											mcpServers: {
												autofin: {
													type: "http",
													url: `${typeof window !== "undefined" ? window.location.origin : ""}/api/mcp`,
													headers: {
														Authorization: `Bearer ${mcpTokenData?.token ?? "<your-token>"}`,
													},
												},
											},
										},
										null,
										2,
									)}
								</pre>
								<a
									href="https://modelcontextprotocol.io/clients"
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
								>
									Compatible MCP clients <ExternalLink className="h-3 w-3" />
								</a>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="appearance" className="mt-6">
					<AppearanceCard />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function AiPreferencesCard() {
	const { data: preferences, isLoading } = useGetPreferences();
	const updateMutation = useUpdatePreferences();
	const [prompt, setPrompt] = useState<string | null>(null);

	const value = prompt ?? preferences?.categoryMappingPrompt ?? "";
	const dirty =
		prompt !== null && prompt !== (preferences?.categoryMappingPrompt ?? "");

	const handleSave = () => {
		updateMutation.mutate(
			{ categoryMappingPrompt: value.trim() || null },
			{
				onSuccess: () => {
					toast.success("AI preferences saved");
					setPrompt(null);
				},
				onError: (err: Error) => {
					toast.error("Failed to save preferences", {
						description: err.message,
					});
				},
			},
		);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2 space-y-1">
						<Sparkles className="h-5 w-5 shrink-0" />
						<div>
							<CardTitle>Custom category mapping</CardTitle>
							<CardDescription>
								Personal rules the AI follows when categorizing your
								transactions — across SMS/email extraction, statement imports,
								and the advisor chat.
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<>
						<div className="space-y-2">
							<Label htmlFor="category-mapping-prompt">
								Category mapping instructions
							</Label>
							<Textarea
								id="category-mapping-prompt"
								placeholder={
									"Examples:\n- Treat every SWIGGY or PATHAO charge as Food & Delivery\n- AWS and Google Cloud charges are always Business Expenses\n- Ignore anything from my landlord (track manually)"
								}
								rows={7}
								maxLength={4000}
								value={value}
								onChange={(e) => setPrompt(e.target.value)}
								className="font-mono text-sm"
							/>
							<p className="text-right text-xs text-muted-foreground">
								{value.length}/4000 characters
							</p>
						</div>
						<div className="flex justify-end gap-2">
							{dirty && (
								<Button variant="ghost" onClick={() => setPrompt(null)}>
									Discard
								</Button>
							)}
							<Button
								onClick={handleSave}
								disabled={updateMutation.isPending || !dirty}
							>
								{updateMutation.isPending ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : null}
								Save preferences
							</Button>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}

const MODE_OPTIONS: ReadonlyArray<{
	value: ThemeMode;
	label: string;
	icon: typeof Sun;
}> = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "System", icon: Monitor },
];

/** Representative light-mode palette per theme, used for preview swatches. */
const THEME_PREVIEWS: Record<ThemeName, string[]> = {
	default: ["hsl(0 0% 100%)", "hsl(212 100% 48%)", "hsl(0 0% 9%)"],
	midnight: ["hsl(0 0% 100%)", "hsl(262 83% 58%)", "hsl(245 25% 15%)"],
	ocean: ["hsl(0 0% 100%)", "hsl(187 75% 38%)", "hsl(210 25% 15%)"],
	forest: ["hsl(0 0% 100%)", "hsl(142 60% 42%)", "hsl(150 25% 15%)"],
};

function AppearanceCard() {
	const { mode, setMode, theme, setTheme } = useTheme();

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2 space-y-1">
						<Palette className="h-5 w-5 shrink-0" />
						<div>
							<CardTitle>Appearance</CardTitle>
							<CardDescription>
								Pick a color theme and whether to use light or dark mode.
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-8">
				<div className="space-y-3">
					<Label>Themes</Label>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{THEME_NAMES.map(({ name, label, description }) => (
							<button
								key={name}
								type="button"
								onClick={() => setTheme(name)}
								className={`group relative flex flex-col gap-3 rounded-lg border p-4 text-left transition-colors ${
									theme === name
										? "border-primary ring-2 ring-ring/50"
										: "border-border hover:border-primary/50"
								}`}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-1.5">
										{THEME_PREVIEWS[name].map((color) => (
											<span
												key={color}
												className="h-4 w-4 rounded-full border border-border"
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
									{theme === name && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</div>
								<div>
									<p className="text-sm font-semibold">{label}</p>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{description}
									</p>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className="space-y-3">
					<Label>Mode</Label>
					<div className="grid grid-cols-3 gap-2">
						{MODE_OPTIONS.map(({ value, label, icon: Icon }) => (
							<Button
								key={value}
								type="button"
								variant={mode === value ? "default" : "outline"}
								onClick={() => setMode(value)}
								className="justify-center"
							>
								<Icon className="mr-2 h-4 w-4" />
								{label}
							</Button>
						))}
					</div>
					<p className="text-xs text-muted-foreground">
						System follows your device&apos;s light or dark preference.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

function StepCircle({
	step,
	complete,
	current,
	label,
}: {
	step: number;
	complete: boolean;
	current: boolean;
	label: string;
}) {
	return (
		<div className="flex flex-col items-center gap-1">
			<div
				className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-medium transition-colors ${
					complete
						? "border-ds-green-700 bg-ds-green-700 text-white"
						: current
							? "border-primary bg-primary text-primary-foreground"
							: "border-muted bg-muted text-muted-foreground"
				}`}
			>
				{complete ? <CheckCircle2 className="h-5 w-5" /> : step}
			</div>
			<span className="text-xs font-medium text-muted-foreground">{label}</span>
		</div>
	);
}

function StepConnector({ active }: { active: boolean }) {
	return (
		<div
			className={`h-0.5 flex-1 min-w-[24px] rounded transition-colors ${
				active ? "bg-ds-green-700" : "bg-muted"
			}`}
		/>
	);
}
