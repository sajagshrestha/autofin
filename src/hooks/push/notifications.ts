import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";
import {
	getActiveSubscription,
	isPushSupported,
	subscribeToPush,
	unsubscribeFromPush,
} from "@/lib/push";

export const PUSH_QUERY_KEYS = {
	state: ["push", "state"] as const,
};

export interface ServerSubscription {
	id: string;
	endpoint: string;
	userAgent: string | null;
	createdAt: string;
}

export interface PushState {
	/** Whether the current device is registered for push on the server. */
	enabled: boolean;
	/** True when this browser can do push at all (SW + PushManager + Notification). */
	supported: boolean;
	subscriptions: ServerSubscription[];
}

/**
 * Loads the device's push registration state: the server-side subscription
 * list plus the active local PushSubscription, matched by endpoint.
 */
function usePushState() {
	return useQuery({
		queryKey: PUSH_QUERY_KEYS.state,
		queryFn: async (): Promise<PushState> => {
			const res = await rpc.api.push.subscriptions.$get();
			const { subscriptions } = await unwrap<{
				subscriptions: ServerSubscription[];
			}>(res);

			const local = await getActiveSubscription();
			const endpoints = new Set(subscriptions.map((s) => s.endpoint));

			return {
				enabled: local !== null && endpoints.has(local.endpoint),
				supported: isPushSupported(),
				subscriptions,
			};
		},
		staleTime: 30_000,
	});
}

/**
 * Manage PWA push notifications for the current device. `enabled` reflects
 * whether this device is subscribed; subscribe()/unsubscribe() toggle it.
 */
export function usePushNotifications() {
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = usePushState();

	const refresh = () =>
		queryClient.invalidateQueries({ queryKey: PUSH_QUERY_KEYS.state });

	const subscribe = useMutation({
		mutationFn: subscribeToPush,
		onSuccess: refresh,
	});

	const unsubscribe = useMutation({
		mutationFn: unsubscribeFromPush,
		onSuccess: refresh,
	});

	return {
		enabled: data?.enabled ?? false,
		supported: data?.supported ?? false,
		isLoading,
		isError,
		subscriptions: data?.subscriptions ?? [],
		subscribe,
		unsubscribe,
	};
}
