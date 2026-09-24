import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";
import { type EmailSource, GMAIL_QUERY_KEYS } from "./queries";

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

function invalidateSources(queryClient: ReturnType<typeof useQueryClient>) {
	queryClient.invalidateQueries({ queryKey: GMAIL_QUERY_KEYS.sources });
}

export interface UpsertSourceInput {
	name: string;
	email: string;
	identifier?: string | null;
	aliases?: string[];
}

/**
 * Adds an email source (bank name + sender email + optional account id).
 * Re-syncs the Gmail sender filters.
 */
export function useCreateSource() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: UpsertSourceInput) => {
			const res = await rpc.api.sources.$post({
				json: {
					name: input.name,
					email: input.email,
					identifier: input.identifier ?? undefined,
					aliases: input.aliases,
				},
			});
			return unwrap<{ source: EmailSource }>(res);
		},
		onSettled: () => invalidateSources(queryClient),
	});
}

/**
 * Updates an email source. Changing the email re-syncs Gmail filters.
 */
export function useUpdateSource() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { id: string } & Partial<UpsertSourceInput>) => {
			const { id, ...body } = input;
			const res = await rpc.api.sources[":id"].$patch({
				param: { id },
				json: body,
			});
			return unwrap<{ source: EmailSource }>(res);
		},
		onSettled: () => invalidateSources(queryClient),
	});
}

/**
 * Removes an email source and its Gmail filter.
 */
export function useDeleteSource() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { id: string }) => {
			const res = await rpc.api.sources[":id"].$delete({
				param: { id: input.id },
			});
			return unwrap<SuccessResult>(res);
		},
		onSettled: () => invalidateSources(queryClient),
	});
}
