import { skipToken, useQuery } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";

export const GMAIL_QUERY_KEYS = {
	root: ["gmail"] as const,
	authUrl: ["gmail", "auth-url"] as const,
	status: ["gmail", "status"] as const,
	senderFilters: ["gmail", "sender-filters"] as const,
	watchStatus: ["gmail", "watch-status"] as const,
};

export interface GmailConnectionStatus {
	authorized: boolean;
	message?: string;
	emailAddress?: string;
	expiresAt?: string;
	isExpired?: boolean;
	isValid?: boolean;
	scope?: string;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Fetches the Gmail OAuth authorization URL to redirect the user.
 */
export function useGetGmailAuthorizationUrl() {
	return useQuery({
		queryKey: GMAIL_QUERY_KEYS.authUrl,
		queryFn: async () => {
			const res = await rpc.api.gmail.authorize.$get();
			return unwrap<{ authorizationUrl: string; state: string }>(res);
		},
	});
}

/**
 * Fetches the current Gmail OAuth connection status for the user.
 */
export function useGetGmailConnectionStatus() {
	return useQuery({
		queryKey: GMAIL_QUERY_KEYS.status,
		queryFn: async () => {
			const res = await rpc.api.gmail.status.$get();
			return unwrap<GmailConnectionStatus>(res);
		},
	});
}

/**
 * Fetches the current sender filter config (emails being filtered).
 */
export function useGetSenderFilters(options?: { enabled?: boolean }) {
	return useQuery({
		queryKey: GMAIL_QUERY_KEYS.senderFilters,
		queryFn:
			options?.enabled === false
				? skipToken
				: async () => {
						const res = await rpc.api.gmail.filters.senders.$get();
						return unwrap<{ filterId: string; emails: string[] }>(res);
					},
	});
}

/**
 * Fetches the Gmail watch status (whether watch is active, expiration, etc.).
 */
export function useGetGmailWatchStatus(options?: { enabled?: boolean }) {
	return useQuery({
		queryKey: GMAIL_QUERY_KEYS.watchStatus,
		queryFn:
			options?.enabled === false
				? skipToken
				: async () => {
						const res = await rpc.api.gmail.watch.status.$get();
						return unwrap<{
							hasWatch: true;
							historyId?: string;
							expiration: string;
							expiresAt: string;
							expiresInHours: number;
							isExpired: boolean;
							topicName: string;
							message: string;
						}>(res);
					},
	});
}
