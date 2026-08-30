import { Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
	const { enabled, supported, isLoading, isError, subscribe, unsubscribe } =
		usePushNotifications();

	const isBusy = subscribe.isPending || unsubscribe.isPending;

	const handleToggle = async (next: boolean) => {
		try {
			if (next) {
				await subscribe.mutateAsync();
				// Fire one immediately so the user sees it working without hunting
				// for a button. Failures here are non-fatal — the sub is already saved.
				try {
					const res = await rpc.api.push.test.$post();
					await unwrap(res);
				} catch {
					/* test notification is best-effort */
				}
				toast.success("Notifications enabled", {
					description: "A test notification should have just appeared.",
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
				{!supported ? (
					<p className="text-sm text-muted-foreground">
						Push notifications aren't supported in this browser. Add the app to
						your home screen and open it from there (required on iOS).
					</p>
				) : isError ? (
					<p className="text-sm text-muted-foreground">
						Couldn't load your notification settings. Try again in a moment.
					</p>
				) : isLoading ? (
					<div
						className="flex items-center justify-between gap-4"
						role="status"
						aria-busy="true"
						aria-label="Loading notification settings"
					>
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-48" />
						</div>
						<Skeleton className="h-5 w-9 rounded-full" />
					</div>
				) : (
					<>
						<div className="flex items-center justify-between gap-4">
							<div className="space-y-0.5">
								<p className="text-sm font-medium">Enable notifications</p>
								<p className="text-xs text-muted-foreground">
									{enabled
										? "This device is registered."
										: "This device isn't registered."}
								</p>
							</div>
							<Switch
								checked={enabled}
								disabled={isBusy}
								onChange={(e) => handleToggle(e.target.checked)}
							/>
						</div>

						{isBusy && (
							<p className="flex items-center gap-2 text-xs text-muted-foreground">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								{subscribe.isPending
									? "Requesting permission…"
									: "Unsubscribing…"}
							</p>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
