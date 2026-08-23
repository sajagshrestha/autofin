import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";
import { GMAIL_QUERY_KEYS } from "./queries";

interface SuccessResult {
	success: true;
	message: string;
}

/** Gmail API watch response (epoch-ms expiration as a string). */
interface GmailWatchResponse {
	historyId: string;
	expiration: string;
	[key: string]: unknown;
}

/**
 * Refreshes the Gmail OAuth access token.
 */
export function useRefreshGmailAccessToken() {
	return useMutation({
		mutationFn: async () => {
			const res = await rpc.api.gmail.refresh.$post();
			return unwrap<SuccessResult>(res);
		},
	});
}

/**
 * Revokes and disconnects the Gmail OAuth connection.
 */
export function useDisconnectGmailAccount() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const res = await rpc.api.gmail.revoke.$post();
			return unwrap<SuccessResult>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GMAIL_QUERY_KEYS.root });
		},
	});
}

/**
 * Starts watching Gmail for push notifications via Pub/Sub.
 */
export function useStartGmailWatch() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const res = await rpc.api.gmail.watch.start.$post();
			return unwrap<GmailWatchResponse>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GMAIL_QUERY_KEYS.watchStatus });
		},
	});
}

/**
 * Stops watching Gmail push notifications.
 */
export function useStopGmailWatch() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const res = await rpc.api.gmail.watch.stop.$post();
			return unwrap<SuccessResult>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GMAIL_QUERY_KEYS.watchStatus });
		},
	});
}

/**
 * Sets the sender filter (emails to monitor, e.g. bank alerts).
 * Creates a Gmail filter that auto-applies the monitor label to emails from
 * the given senders.
 */
export function useSetSenderFilters() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { emails: string[] }) => {
			const res = await rpc.api.gmail.filters.senders.$post({ json: input });
			return unwrap<{ filterId: string; emails: string[] }>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: GMAIL_QUERY_KEYS.senderFilters,
			});
		},
	});
}

/**
 * Removes the sender filter and clears stored config.
 */
export function useDeleteSenderFilters() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const res = await rpc.api.gmail.filters.senders.$delete();
			return unwrap<SuccessResult>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: GMAIL_QUERY_KEYS.senderFilters,
			});
		},
	});
}
