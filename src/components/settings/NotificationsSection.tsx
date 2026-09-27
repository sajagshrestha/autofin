import { Bell, Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/hooks/push/notifications";
import { rpc, unwrap } from "@/lib/api-client";

export function NotificationsSection() {
	const {
		enabled,
		supported,
		isLoading,
		isFetching,
		isError,
		refetch,
		subscribe,
		unsubscribe,
	} = usePushNotifications();

	const statusId = useId();
	const [operation, setOperation] = useState<
		"enabling" | "disabling" | "testing" | null
	>(null);
	const isBusy =
		operation !== null || subscribe.isPending || unsubscribe.isPending;
	const status =
		operation === "testing"
			? "Sending a test notification…"
			: operation === "enabling" || subscribe.isPending
				? "Enabling notifications… Allow access if your browser asks."
				: operation === "disabling" || unsubscribe.isPending
					? "Disabling notifications…"
					: isFetching
						? "Checking this device…"
						: enabled
							? "This device is registered."
							: "This device isn't registered.";

	const handleToggle = async (next: boolean) => {
		if (isBusy || isFetching) return;
		setOperation(next ? "enabling" : "disabling");
		try {
			if (next) {
				await subscribe.mutateAsync();
				setOperation("testing");
				let testSent = false;
				// Fire one immediately so the user sees it working without hunting
				// for a button. Failures here are non-fatal — the sub is already saved.
				try {
					const res = await rpc.api.push.test.$post();
					await unwrap(res);
					testSent = true;
				} catch {
					/* test notification is best-effort */
				}
				toast.success("Notifications enabled", {
					description: testSent
						? "A test notification should have just appeared."
						: "This device is registered, but the test notification could not be sent.",
				});
			} else {
				await unsubscribe.mutateAsync();
				toast.success("Notifications disabled");
			}
		} catch (error) {
			toast.error(
				next
					? "Couldn't enable notifications"
					: "Couldn't disable notifications",
				{
					description: error instanceof Error ? error.message : undefined,
				},
			);
		} finally {
			setOperation(null);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2 space-y-1">
						<Bell className="h-5 w-5 shrink-0" />
						<div>
							<CardTitle>Push Notifications</CardTitle>
							<CardDescription>
								Get a notification on your phone when a statement import
								finishes.
							</CardDescription>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{isLoading ? (
					<div
						className="flex min-h-11 items-center justify-between gap-4"
						role="status"
						aria-busy="true"
					>
						<div className="flex min-w-0 items-center gap-3">
							<Loader2
								className="size-4 shrink-0 animate-spin text-muted-foreground"
								aria-hidden="true"
							/>
							<div className="space-y-1">
								<p className="text-sm font-medium">Checking notifications…</p>
								<p className="text-xs text-muted-foreground">
									Checking this device’s registration.
								</p>
							</div>
						</div>
						<Skeleton
							className="h-5 w-9 shrink-0 rounded-full"
							aria-hidden="true"
						/>
					</div>
				) : isError ? (
					<div className="space-y-3">
						<p role="alert" className="text-sm text-muted-foreground">
							Couldn't load your notification settings.
						</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => void refetch()}
							disabled={isFetching}
						>
							{isFetching && (
								<Loader2 className="size-4 animate-spin" aria-hidden="true" />
							)}
							{isFetching ? "Retrying…" : "Try again"}
						</Button>
					</div>
				) : !supported ? (
					<p className="text-sm text-muted-foreground">
						Push notifications aren't supported in this browser. Add the app to
						your home screen and open it from there (required on iOS).
					</p>
				) : (
					<div
						className="flex min-h-11 items-center justify-between gap-4"
						aria-busy={isBusy || isFetching}
					>
						<div className="min-w-0 space-y-1">
							<p className="text-sm font-medium">Enable notifications</p>
							<p
								id={statusId}
								role="status"
								className="text-xs text-muted-foreground"
							>
								{status}
							</p>
						</div>
						<div className="flex shrink-0 items-center gap-2">
							{(isBusy || isFetching) && (
								<Loader2
									className="size-4 animate-spin text-muted-foreground"
									aria-hidden="true"
								/>
							)}
							<Switch
								aria-label="Enable notifications"
								aria-describedby={statusId}
								checked={enabled}
								disabled={isBusy || isFetching}
								onChange={(e) => handleToggle(e.target.checked)}
							/>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
