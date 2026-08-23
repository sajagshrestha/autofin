import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";

/**
 * Per-user AI preferences (currently: custom category-mapping prompt used by
 * the SMS/email extractor, statement import, and the advisor chat).
 */
export const preferencesRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const prefs = await container.userPreferenceRepo.findByUserId(user.id);

		return c.json({
			categoryMappingPrompt: prefs?.categoryMappingPrompt ?? null,
		});
	})

	.put(
		"/",
		zValidator(
			"json",
			z.object({
				categoryMappingPrompt: z.string().max(4000).nullable(),
			}),
		),
		async (c) => {
			const user = c.get("user");
			const body = c.req.valid("json");
			const container = getContainer();

			const prompt = body.categoryMappingPrompt?.trim() || null;
			const saved = await container.userPreferenceRepo.upsert(user.id, {
				categoryMappingPrompt: prompt,
			});

			return c.json({
				categoryMappingPrompt: saved.categoryMappingPrompt ?? null,
			});
		},
	);
