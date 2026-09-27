import { zValidator as zv } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
	budgetInputSchema,
	budgetMonthSchema,
	currentBudgetMonth,
} from "@/lib/budgets";
import { type ApiEnv, requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";
export const budgetsRouter = new Hono<ApiEnv>()
	.use("*", requireUser)
	.get("/category-averages", async (c) =>
		c.json(
			await getContainer().budgetService.categoryAverages(c.get("user").id),
		),
	)
	.get(
		"/",
		zv("query", z.object({ month: budgetMonthSchema.optional() })),
		async (c) =>
			c.json(
				await getContainer().budgetService.list(
					c.get("user").id,
					c.req.valid("query").month ?? currentBudgetMonth(),
				),
			),
	)
	.post(
		"/",
		zv(
			"json",
			z.object({ budgets: z.array(budgetInputSchema).min(1).max(100) }),
		),
		async (c) => {
			await getContainer().budgetService.save(
				c.get("user").id,
				c.req.valid("json").budgets,
			);
			return c.json({ ok: true });
		},
	)
	.post(
		"/suggest",
		zv(
			"json",
			z.object({
				selectedCategoryIds: z
					.array(z.string().uuid())
					.min(1)
					.max(100)
					.optional(),
				savingsTarget: z
					.number()
					.nonnegative()
					.max(9999999999.99)
					.multipleOf(0.01)
					.optional(),
			}),
		),
		async (c) =>
			c.json(
				await getContainer().budgetService.suggest(
					c.get("user").id,
					c.req.valid("json").savingsTarget,
					c.req.valid("json").selectedCategoryIds,
				),
			),
	)
	.post("/:categoryId/stop", async (c) => {
		await getContainer().budgetService.stop(
			c.get("user").id,
			c.req.param("categoryId"),
		);
		return c.json({ ok: true });
	});
