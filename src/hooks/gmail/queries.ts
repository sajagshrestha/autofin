import { skipToken, useQuery } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";

export const GMAIL_QUERY_KEYS = {
	root: ["gmail"] as const,
	authUrl: ["gmail", "auth-url"] as const,
	status: ["gmail", "status"] as const,
	sources: ["gmail", "sources"] as const,
	watchStatus: ["gmail", "watch-status"] as const,
};

export interface EmailSource {
	id: string;
	name: string;
	email: string;
	identifier: string | null;
	aliases: string[];
	createdAt: string;
	updatedAt: string;
}

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
 * Fetches the user's email sources (bank name + sender email + optional
 * account identifier) that Gmail filters are built from.
 */
export function useGetSources(options?: { enabled?: boolean }) {
	return useQuery({
		queryKey: GMAIL_QUERY_KEYS.sources,
		queryFn:
			options?.enabled === false
				? skipToken
				: async () => {
						const res = await rpc.api.sources.$get();
						return unwrap<{ sources: EmailSource[] }>(res);
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
							hasWatch: boolean;
							historyId?: string;
							expiresAt?: string;
							expiresInHours: number;
							isExpired: boolean;
							topicName: string;
							autoRenews: true;
							resyncInterval: string;
							message: string;
						}>(res);
					},
	});
}
