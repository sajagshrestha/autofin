import {
	AlertTriangle,
	CheckCircle2,
	Filter,
	Loader2,
	Mail,
	Radio,
	RefreshCw,
	Trash2,
	X,
	XCircle,
} from "lucide-react";
import { useId, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	useDeleteSenderFilters,
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

export function GmailSection() {
	const filterEmailsId = useId();
	const [filterInput, setFilterInput] = useState("");
	const [confirmDisconnect, setConfirmDisconnect] = useState(false);
	const [confirmStopWatch, setConfirmStopWatch] = useState(false);
	const [confirmClearFilters, setConfirmClearFilters] = useState(false);

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
	const { data: watchStatus, refetch: refetchWatchStatus } =
		useGetGmailWatchStatus({
			enabled: connectionStatus?.authorized ?? false,
		});

	const disconnectMutation = useDisconnectGmailAccount();
	const setFiltersMutation = useSetSenderFilters();
	const deleteFiltersMutation = useDeleteSenderFilters();
	const startWatchMutation = useStartGmailWatch();
	const stopWatchMutation = useStopGmailWatch();

	const isConnected = connectionStatus?.authorized ?? false;
	const isLoading = isAuthUrlLoading || isStatusLoading;
	const emails = senderFilters?.emails ?? [];
	const hasFilters = emails.length > 0;

	// Sync filter input when data loads (only on first fetch to avoid overwriting user edits)
	const displayFilterValue =
		filterInput !== "" ? filterInput : emails.join("\n");

	// Live validation of what the user has typed (only while actively editing)
	const hasEdits = filterInput !== "";
	const liveParsed = hasEdits ? parseEmailsFromTextarea(filterInput) : [];
	const liveValid = hasEdits ? validateEmails(liveParsed) : null;

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
		const { valid, invalid } = validateEmails(
			parseEmailsFromTextarea(displayFilterValue),
		);

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

	const handleRemoveEmail = (email: string) => {
		const next = emails.filter((e) => e !== email);
		setFiltersMutation.mutate(
			{ emails: next },
			{
				onSuccess: () => {
					toast.success("Filter removed");
				},
				onError: (error) => {
					toast.error("Failed to remove filter", {
						description: error.message,
					});
				},
			},
		);
	};

	const handleClearFilters = () => {
		deleteFiltersMutation.mutate(undefined, {
			onSuccess: () => {
				setConfirmClearFilters(false);
				setFilterInput("");
				toast.success("All filters cleared");
			},
			onError: (error) => {
				toast.error("Failed to clear filters", {
					description: error.message,
				});
			},
		});
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
							<Badge variant="green">
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
							{hasFilters && (
								<div className="flex flex-wrap gap-2">
									{emails.map((email) => (
										<Badge
											key={email}
											variant="gray"
											contrast="low"
											className="py-1 pr-1 pl-2"
										>
											{email}
											<button
												type="button"
												aria-label={`Remove ${email}`}
												onClick={() => handleRemoveEmail(email)}
												disabled={setFiltersMutation.isPending}
												className="rounded-full p-0.5 transition-colors hover:bg-ds-red-100 hover:text-ds-red-1000 disabled:opacity-50"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									))}
								</div>
							)}

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
								{liveValid && liveValid.invalid.length > 0 && (
									<p className="flex items-center gap-1 text-xs font-medium text-ds-red-1000">
										<AlertTriangle className="h-3.5 w-3.5" />
										{liveValid.invalid.length} invalid email
										{liveValid.invalid.length !== 1 ? "s" : ""}:{" "}
										{liveValid.invalid.join(", ")}
									</p>
								)}
								{liveValid &&
									liveValid.invalid.length === 0 &&
									liveParsed.length > 0 && (
										<p className="text-xs text-muted-foreground">
											{liveValid.valid.length} valid email
											{liveValid.valid.length !== 1 ? "s" : ""} ready to save.
										</p>
									)}
							</div>

							<div className="flex gap-3">
								<Button
									onClick={handleSaveFilters}
									disabled={
										!hasEdits ||
										(liveValid?.invalid.length ?? 0) > 0 ||
										setFiltersMutation.isPending
									}
									className="flex-1"
								>
									{setFiltersMutation.isPending ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : null}
									Save Filters
								</Button>
								{hasFilters && (
									<Button
										variant="outline"
										onClick={() => setConfirmClearFilters(true)}
										disabled={
											deleteFiltersMutation.isPending ||
											setFiltersMutation.isPending
										}
									>
										{deleteFiltersMutation.isPending ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<Trash2 className="mr-2 h-4 w-4" />
										)}
										Clear All
									</Button>
								)}
							</div>
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

			{/* Confirm: Clear filters */}
			<Dialog open={confirmClearFilters} onOpenChange={setConfirmClearFilters}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Clear all filters?</DialogTitle>
						<DialogDescription>
							This removes all {emails.length} sender email
							{emails.length !== 1 ? "s" : ""} from your monitoring list.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setConfirmClearFilters(false)}
							disabled={deleteFiltersMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleClearFilters}
							disabled={deleteFiltersMutation.isPending}
						>
							{deleteFiltersMutation.isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="mr-2 h-4 w-4" />
							)}
							Clear All
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
