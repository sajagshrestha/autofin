import {
	AlertTriangle,
	CheckCircle2,
	Filter,
	Loader2,
	Mail,
	Pencil,
	Plus,
	Radio,
	RefreshCw,
	Trash2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	useCreateSource,
	useDeleteSource,
	useDisconnectGmailAccount,
	useStartGmailWatch,
	useStopGmailWatch,
	useUpdateSource,
} from "@/hooks/gmail/mutations";
import {
	type EmailSource,
	useGetGmailAuthorizationUrl,
	useGetGmailConnectionStatus,
	useGetGmailWatchStatus,
	useGetSources,
} from "@/hooks/gmail/queries";

export const SOURCE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GmailSection() {
	const [confirmDisconnect, setConfirmDisconnect] = useState(false);
	const [confirmStopWatch, setConfirmStopWatch] = useState(false);
	const [sourceDialog, setSourceDialog] = useState<
		{ mode: "create" } | { mode: "edit"; source: EmailSource } | null
	>(null);
	const [deleteTarget, setDeleteTarget] = useState<EmailSource | null>(null);

	const { data: authUrlData, isLoading: isAuthUrlLoading } =
		useGetGmailAuthorizationUrl();
	const {
		data: connectionStatus,
		isLoading: isStatusLoading,
		refetch: refetchStatus,
	} = useGetGmailConnectionStatus();
	const {
		data: sourcesData,
		isLoading: isSourcesLoading,
		isFetched: isSourcesFetched,
	} = useGetSources({ enabled: connectionStatus?.authorized ?? false });
	const { data: watchStatus, refetch: refetchWatchStatus } =
		useGetGmailWatchStatus({
			enabled: connectionStatus?.authorized ?? false,
		});

	const disconnectMutation = useDisconnectGmailAccount();
	const deleteSourceMutation = useDeleteSource();
	const startWatchMutation = useStartGmailWatch();
	const stopWatchMutation = useStopGmailWatch();

	const isConnected = connectionStatus?.authorized ?? false;
	const isLoading = isAuthUrlLoading || isStatusLoading;
	const sources = sourcesData?.sources ?? [];
	const hasFilters = sources.length > 0;

	const isWatchActive =
		(watchStatus?.hasWatch && !watchStatus.isExpired) ?? false;

	const handleConnectGoogle = () => {
		if (authUrlData?.authorizationUrl) {
			window.location.href = authUrlData.authorizationUrl;
		}
	};

	const handleDisconnectGoogle = () => {
		disconnectMutation.mutate(undefined, {
			onSuccess: () => {
				setConfirmDisconnect(false);
				refetchStatus();
				toast.success("Google account disconnected");
			},
			onError: (error) => {
				toast.error("Failed to disconnect", {
					description: error.message,
				});
			},
		});
	};

	const handleDeleteSource = () => {
		if (!deleteTarget) return;
		deleteSourceMutation.mutate(
			{ id: deleteTarget.id },
			{
				onSuccess: () => {
					setDeleteTarget(null);
					toast.success("Source removed");
				},
				onError: (error) => {
					toast.error("Failed to remove source", {
						description: error.message,
					});
				},
			},
		);
	};

	const handleStartWatching = () => {
		startWatchMutation.mutate(undefined, {
			onSuccess: (data) => {
				refetchWatchStatus();
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
				setConfirmStopWatch(false);
				refetchWatchStatus();
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
	const step3Complete = isWatchActive;
	const step3Current = isConnected && !isWatchActive;

	const isWatchPending =
		startWatchMutation.isPending || stopWatchMutation.isPending;

	const handleWatchToggle = (checked: boolean) => {
		if (checked) {
			handleStartWatching();
		} else {
			setConfirmStopWatch(true);
		}
	};

	return (
		<div className="space-y-8">
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
					label="Add Sources"
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
							<Badge variant="green">
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
								variant="outline"
								className="w-full"
								onClick={() => setConfirmDisconnect(true)}
								disabled={disconnectMutation.isPending}
							>
								{disconnectMutation.isPending ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<XCircle className="mr-2 h-4 w-4" />
								)}
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
									Connect your Gmail to automatically track expenses from bank
									alerts and receipts.
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

			{/* Step 2: Email sources */}
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
								<CardTitle>Step 2: Add email sources</CardTitle>
								<CardDescription>
									Add the bank alert senders to monitor. A Gmail filter is
									created for each source.
								</CardDescription>
							</div>
						</div>
						{step2Complete && (
							<Badge variant="green">
								<CheckCircle2 className="mr-1 h-3 w-3" />
								{sources.length} source{sources.length !== 1 ? "s" : ""}
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{!isConnected ? (
						<p className="py-4 text-center text-sm text-muted-foreground">
							Connect Gmail first to add sources.
						</p>
					) : isSourcesLoading && !isSourcesFetched ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : (
						<div className="space-y-4">
							{sources.length === 0 ? (
								<p className="py-2 text-center text-sm text-muted-foreground">
									No sources yet — add your first bank alert sender below.
								</p>
							) : (
								<ul className="space-y-2">
									{sources.map((source) => (
										<li
											key={source.id}
											className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
										>
											<div className="min-w-0">
												<p className="truncate text-sm font-medium">
													{source.name}
												</p>
												<p className="truncate text-xs text-muted-foreground">
													{source.email}
												</p>
											</div>
											<div className="flex shrink-0 items-center gap-1">
												<Button
													variant="ghost"
													size="sm"
													aria-label={`Edit ${source.name}`}
													onClick={() =>
														setSourceDialog({ mode: "edit", source })
													}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													aria-label={`Remove ${source.name}`}
													className="text-ds-red-700 hover:text-ds-red-800"
													onClick={() => setDeleteTarget(source)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</li>
									))}
								</ul>
							)}

							<Button
								variant="outline"
								className="w-full"
								onClick={() => setSourceDialog({ mode: "create" })}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add source
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Step 3: Watch */}
			<Card
				className={`border-l-4 transition-shadow ${
					step3Complete
						? "border-l-ds-green-700"
						: isConnected
							? "border-l-primary shadow-sm hover:shadow-md"
							: "border-l-muted opacity-60"
				}`}
			>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-2 space-y-1">
							<Radio className="h-5 w-5 shrink-0" />
							<div>
								<CardTitle>Step 3: Watch your emails</CardTitle>
								<CardDescription>
									Automatically import new emails from your monitored senders.
								</CardDescription>
							</div>
						</div>
						{watchStatus && (
							<Badge variant={isWatchActive ? "green" : "gray"}>
								{isWatchActive ? (
									<CheckCircle2 className="mr-1 h-3 w-3" />
								) : null}
								{isWatchActive ? "Watching" : "Paused"}
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{!isConnected ? (
						<p className="py-4 text-center text-sm text-muted-foreground">
							Connect Gmail first to start watching.
						</p>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between gap-4 rounded-lg border p-4">
								<div className="space-y-1">
									<p className="text-sm font-medium">Email watching</p>
									<p className="text-xs text-muted-foreground">
										{isWatchActive
											? "On — new emails from monitored senders are imported automatically."
											: "Paused — new emails won't be imported. Turn it back on anytime."}
									</p>
								</div>
								<Switch
									checked={isWatchActive}
									onChange={(e) => handleWatchToggle(e.target.checked)}
									disabled={isWatchPending}
									aria-label="Toggle email watching"
								/>
							</div>

							{watchStatus?.isExpired && (
								<div className="flex items-start gap-3 rounded-lg border border-ds-amber-200 bg-ds-amber-100/40 p-4">
									<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ds-amber-1000" />
									<div>
										<p className="text-sm font-medium text-ds-amber-1000">
											Something went wrong
										</p>
										<p className="text-xs text-muted-foreground">
											Watching isn't running. Toggle it off and on to restart.
										</p>
									</div>
								</div>
							)}

							{isWatchPending && (
								<p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
									{startWatchMutation.isPending
										? "Starting watch..."
										: "Stopping watch..."}
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Confirm: Disconnect */}
			<Dialog open={confirmDisconnect} onOpenChange={setConfirmDisconnect}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Disconnect Gmail?</DialogTitle>
						<DialogDescription>
							You'll stop tracking expenses from this email and will need to
							reconnect to start again. Your existing transactions won't be
							deleted.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setConfirmDisconnect(false)}
							disabled={disconnectMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDisconnectGoogle}
							disabled={disconnectMutation.isPending}
						>
							{disconnectMutation.isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<XCircle className="mr-2 h-4 w-4" />
							)}
							Disconnect
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add / edit source */}
			{sourceDialog && (
				<SourceDialog
					key={sourceDialog.mode === "edit" ? sourceDialog.source.id : "new"}
					initial={sourceDialog.mode === "edit" ? sourceDialog.source : null}
					onClose={() => setSourceDialog(null)}
				/>
			)}

			{/* Confirm: Remove source */}
			<Dialog
				open={!!deleteTarget}
				onOpenChange={(o) => !o && setDeleteTarget(null)}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Remove source?</DialogTitle>
						<DialogDescription>
							This stops monitoring{" "}
							<span className="font-medium">{deleteTarget?.email}</span> and
							removes its Gmail filter. Existing transactions are kept.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteTarget(null)}
							disabled={deleteSourceMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteSource}
							disabled={deleteSourceMutation.isPending}
						>
							{deleteSourceMutation.isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="mr-2 h-4 w-4" />
							)}
							{deleteSourceMutation.isPending ? "Removing…" : "Remove"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Confirm: Stop watch */}
			<Dialog open={confirmStopWatch} onOpenChange={setConfirmStopWatch}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Stop watching?</DialogTitle>
						<DialogDescription>
							New emails from your monitored senders will stop being imported
							until you start the watch again.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setConfirmStopWatch(false)}
							disabled={stopWatchMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleStopWatching}
							disabled={stopWatchMutation.isPending}
						>
							{stopWatchMutation.isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<XCircle className="mr-2 h-4 w-4" />
							)}
							Stop Watch
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function SourceDialog({
	initial,
	onClose,
}: {
	initial: EmailSource | null;
	onClose: () => void;
}) {
	const [name, setName] = useState(initial?.name ?? "");
	const [email, setEmail] = useState(initial?.email ?? "");
	const [identifier, setIdentifier] = useState(initial?.identifier ?? "");
	const [aliases, setAliases] = useState((initial?.aliases ?? []).join(", "));
	const [error, setError] = useState<string | null>(null);
	const createMutation = useCreateSource();
	const updateMutation = useUpdateSource();
	const isPending = createMutation.isPending || updateMutation.isPending;

	const submit = () => {
		setError(null);
		if (!name.trim()) {
			setError("Bank name is required");
			return;
		}
		if (!SOURCE_EMAIL_REGEX.test(email.trim().toLowerCase())) {
			setError("Enter a valid email address");
			return;
		}
		const input = {
			name: name.trim(),
			email: email.trim().toLowerCase(),
			identifier: identifier.trim() || null,
			aliases: aliases
				.split(",")
				.map((a) => a.trim())
				.filter((a) => a.length > 0),
		};
		if (initial) {
			updateMutation.mutate(
				{ id: initial.id, ...input },
				{
					onSuccess: () => {
						toast.success("Source updated");
						onClose();
					},
					onError: (err) => {
						toast.error("Failed to update source", {
							description: err.message,
						});
					},
				},
			);
		} else {
			createMutation.mutate(input, {
				onSuccess: () => {
					toast.success("Source added");
					onClose();
				},
				onError: (err) => {
					toast.error("Failed to add source", {
						description: err.message,
					});
				},
			});
		}
	};

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{initial ? "Edit source" : "Add source"}</DialogTitle>
					<DialogDescription>
						{initial
							? "Update the bank name, email, or account identifier."
							: "Monitor a new bank alert sender. A Gmail filter is created for it."}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-1">
					{error && (
						<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
							{error}
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="source-name">Bank name</Label>
						<Input
							id="source-name"
							placeholder="e.g. Nabil Bank"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="source-email">Sender email</Label>
						<Input
							id="source-email"
							type="email"
							placeholder="alerts@nabilbank.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="font-mono text-sm"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="source-identifier">
							Account identifier{" "}
							<span className="text-muted-foreground">(optional)</span>
						</Label>
						<Input
							id="source-identifier"
							placeholder="e.g. last digits of the account"
							value={identifier}
							onChange={(e) => setIdentifier(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="source-aliases">
							Alternate names{" "}
							<span className="text-muted-foreground">
								(optional, comma-separated)
							</span>
						</Label>
						<Input
							id="source-aliases"
							placeholder="e.g. nBank, Nabil"
							value={aliases}
							onChange={(e) => setAliases(e.target.value)}
						/>
						<p className="text-xs text-muted-foreground">
							Other spellings the bank uses — matched to transactions at import.
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isPending}>
						Cancel
					</Button>
					<Button onClick={submit} disabled={isPending}>
						{isPending ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						{isPending
							? "Syncing Gmail filters…"
							: initial
								? "Save changes"
								: "Add source"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
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
