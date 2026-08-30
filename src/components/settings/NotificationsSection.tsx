import { Bell, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
				toast.success("Notifications enabled", {
					description: "You'll be notified when a statement import completes.",
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

	const handleTest = async () => {
		try {
			const res = await rpc.api.push.test.$post();
			await unwrap(res);
			toast.success("Test notification sent", {
				description: "Check your notification center.",
			});
		} catch (error) {
			toast.error("Failed to send test notification", {
				description: error instanceof Error ? error.message : undefined,
			});
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
				) : (
					<>
						<div className="flex items-center justify-between gap-4">
							<div className="space-y-0.5">
								<p className="text-sm font-medium">Enable notifications</p>
								<p className="text-xs text-muted-foreground">
									{isLoading
										? "Checking…"
										: enabled
											? "This device is registered."
											: "This device isn't registered."}
								</p>
							</div>
							<Switch
								checked={enabled}
								disabled={isBusy || isLoading}
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

						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={!enabled || isBusy}
							onClick={handleTest}
						>
							<Send className="mr-2 h-4 w-4" />
							Send test notification
						</Button>
					</>
				)}
			</CardContent>
		</Card>
	);
}
