import { zValidator as zv } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";
import { filterDateToUtc } from "@/server/lib/timezone";

interface InsightSummary {
	topSpendingCategories?: Array<{
		category: string;
		amount: number;
		percentage: number;
	}>;
	savingsSuggestions?: string[];
	netFlow?: string;
}

/** Protected AI insights API. */
export const insightsRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/latest", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const limitParam = Number.parseInt(c.req.query("limit") ?? "1", 10);
		const offsetParam = Number.parseInt(c.req.query("offset") ?? "0", 10);
		const limit = Number.isFinite(limitParam)
			? Math.min(Math.max(limitParam, 1), 100)
			: 1;
		const offset = Number.isFinite(offsetParam) ? Math.max(offsetParam, 0) : 0;

		const insights = await container.insightsRepo.findLatestForUser(
			user.id,
			limit,
			offset,
		);

		return c.json({
			insights: insights.map((insight) => ({
				id: insight.id,
				periodStart: insight.periodStart.toISOString(),
				periodEnd: insight.periodEnd.toISOString(),
				content: insight.content,
				summary: (insight.summary as InsightSummary | null) ?? null,
				createdAt: insight.createdAt.toISOString(),
			})),
		});
	})

	.post(
		"/generate",
		zv(
			"json",
			z.object({
				startDate: z.iso.datetime().optional(),
				endDate: z.iso.datetime().optional(),
				timezone: z.string().optional(),
			}),
		),
		async (c) => {
			const user = c.get("user");
			const body = c.req.valid("json");
			const container = getContainer();

			const userRecord = await container.userRepo.findById(user.id);
			const timezone =
				body.timezone ?? userRecord?.timezone ?? "Asia/Kathmandu";

			let periodStart: Date | undefined;
			let periodEnd: Date | undefined;
			if (body.startDate && body.endDate) {
				periodStart = filterDateToUtc(body.startDate, timezone);
				periodEnd = filterDateToUtc(body.endDate, timezone);
			}

			try {
				const insight = await container.insightsService.generateInsights(
					user.id,
					{ periodStart, periodEnd, timezone },
				);

				return c.json(
					{
						insight: {
							id: insight.id,
							periodStart: insight.periodStart.toISOString(),
							periodEnd: insight.periodEnd.toISOString(),
							content: insight.content,
							summary: (insight.summary as InsightSummary | null) ?? null,
							createdAt: insight.createdAt.toISOString(),
						},
					},
					201,
				);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Unknown error";
				if (message.includes("No transactions")) {
					throw new HTTPException(400, {
						message: `No transactions in the selected period — ${message}`,
					});
				}
				throw new HTTPException(500, {
					message: `Failed to generate insights — ${message}`,
				});
			}
		},
	);
