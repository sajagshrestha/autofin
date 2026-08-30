import { db } from "@/server/db/connection";
import { inngest } from "@/server/inngest/client";
import { createContainer } from "@/server/lib/container";

/**
 * Hourly catch-up poll that re-scans Gmail history for every connected user.
 *
 * Pub/Sub push can miss notifications (webhook down, subscription misconfigured,
 * transient failures), so this cron uses the stored `historyId` cursor to fetch
 * any changes since the last processed point and feeds them through the same
 * `processNotification` path as the webhook — including emailId + amount/date
 * dedup — so missed emails still get turned into transactions.
 *
 * If a user's stored cursor has expired (Gmail returns 404 for history older
 * than its retention window), the poll falls back to a label-query backfill of
 * unread labeled messages and only advances the cursor once it fully drains, so
 * no emails are skipped while recovering.
 *
 * Triggered by: cron `0 * * * *` (hourly)
 */
export const gmailHistoryPoll = inngest.createFunction(
	{
		id: "gmail-history-poll",
		name: "Gmail history catch-up poll",
		concurrency: {
			limit: 1,
		},
		onFailure: async ({ error }) => {
			console.error("gmail-history-poll failed:", error);
		},
		retries: 2,
	},
	{ cron: "0 * * * *" },
	async ({ step }) => {
		const container = createContainer(db);

		// List every connected Gmail token so we can poll each user's history.
		const tokens = await step.run("list-connected-tokens", async () =>
			container.gmailOAuthRepo.findAll(),
		);

		const results = [];
		for (const token of tokens) {
			if (!token.historyId) continue;

			const result = await step.run(`poll-${token.userId}`, async () => {
				try {
					const notification = {
						emailAddress: token.emailAddress,
						historyId: token.historyId as string,
					};

					let processResult = await container.gmailService.processNotification(
						token.userId,
						notification,
						token.historyId,
					);

					// The stored cursor was too old for the history API. Recover by
					// querying labeled unread messages directly so emails missed by
					// both Pub/Sub and the (expired) history window are still caught.
					let backfilled = false;
					if (processResult.success && processResult.expired) {
						const backfillResult =
							await container.gmailService.processNotification(
								token.userId,
								notification,
								token.historyId,
								{ backfill: true },
							);
						backfilled = true;
						processResult = backfillResult;
						processResult.expired = true;
					}

					// Only advance the stored cursor once processing succeeded and any
					// backfill fully drained, so a failed user is retried on the next
					// run instead of skipped.
					const canAdvance =
						processResult.success &&
						(!backfilled || processResult.backfillComplete);
					if (canAdvance) {
						await container.gmailOAuthRepo.updateHistoryId(
							token.userId,
							processResult.historyId,
						);
					}

					return {
						email: token.emailAddress,
						processed: processResult.processedCount,
						failed: processResult.failedCount,
						backfilled,
						errors: processResult.errors,
					};
				} catch (error) {
					return {
						email: token.emailAddress,
						processed: 0,
						failed: 1,
						errors: [
							{
								messageId: "poll",
								error: error instanceof Error ? error.message : "Unknown error",
							},
						],
					};
				}
			});
			results.push(result);
		}

		return {
			polledUsers: results.length,
			results,
		};
	},
);
