import { zValidator as zv } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";

const createSchema = z.object({
	name: z.string().min(1).max(50),
	icon: z.string().max(10).optional(),
});

const updateSchema = z.object({
	name: z.string().min(1).max(50).optional(),
	icon: z.string().max(10).optional(),
});

/** Protected categories API (predefined + user's custom categories). */
export const categoriesRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const categories = await container.categoryRepo.findAllForUser(user.id);

		return c.json({
			categories: categories.map((category) => ({
				...category,
				createdAt: category.createdAt.toISOString(),
			})),
		});
	})

	.get("/:id", async (c) => {
		const id = c.req.param("id");
		const container = getContainer();

		const category = await container.categoryRepo.findById(id);
		if (!category)
			throw new HTTPException(404, { message: "Category not found" });

		return c.json({
			category: {
				...category,
				createdAt: category.createdAt.toISOString(),
			},
		});
	})

	.post("/", zv("json", createSchema), async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");
		const container = getContainer();

		const existing = await container.categoryRepo.findByNameForUser(
			body.name,
			user.id,
		);
		if (existing) {
			throw new HTTPException(400, {
				message: "Category with this name already exists",
			});
		}

		try {
			const category = await container.categoryRepo.create({
				id: crypto.randomUUID(),
				userId: user.id,
				name: body.name,
				icon: body.icon || null,
				isDefault: false,
				isAiCreated: false,
			});

			return c.json(
				{
					category: {
						...category,
						createdAt: category.createdAt.toISOString(),
					},
				},
				201,
			);
		} catch {
			throw new HTTPException(400, { message: "Failed to create category" });
		}
	})

	.patch("/:id", zv("json", updateSchema), async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const container = getContainer();

		const updated = await container.categoryRepo.update(id, user.id, body);
		if (!updated) {
			throw new HTTPException(404, {
				message:
					"Category not found or cannot be updated (predefined categories are read-only)",
			});
		}

		return c.json({
			category: {
				...updated,
				createdAt: updated.createdAt.toISOString(),
			},
		});
	})

	.delete("/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const container = getContainer();

		const deleted = await container.categoryRepo.delete(id, user.id);
		if (!deleted) {
			throw new HTTPException(404, {
				message:
					"Category not found or cannot be deleted (predefined categories are protected)",
			});
		}

		return c.json({ message: "Category deleted successfully" });
	});
