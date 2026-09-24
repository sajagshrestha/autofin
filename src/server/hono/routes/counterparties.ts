import { zValidator as zv } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { LoanCounterparty } from "@/server/db/schema";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";
import type { CounterpartyWithLoanCounts } from "@/server/repositories/counterparty.repository";

const createSchema = z.object({
	name: z.string().min(1).max(120),
	notes: z.string().max(500).optional(),
});

const updateSchema = z.object({
	name: z.string().min(1).max(120).optional(),
	notes: z.string().max(500).nullable().optional(),
});

function serialize(
	counterparty:
		| CounterpartyWithLoanCounts
		| (LoanCounterparty & { totalLoans: number }),
) {
	return {
		id: counterparty.id,
		name: counterparty.name,
		notes: counterparty.notes,
		totalLoans: counterparty.totalLoans,
		createdAt: counterparty.createdAt.toISOString(),
		updatedAt: counterparty.updatedAt.toISOString(),
	};
}

/** Protected loan-counterparty API (one row per person per user). */
export const counterpartiesRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const counterparties = await container.counterpartyRepo.findAllForUser(
			user.id,
		);

		return c.json({ counterparties: counterparties.map(serialize) });
	})

	.post("/", zv("json", createSchema), async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");
		const container = getContainer();
		const name = body.name.trim();
		if (!name) {
			throw new HTTPException(400, { message: "Name is required" });
		}

		const existing = await container.counterpartyRepo.findByNameForUser(
			user.id,
			name,
		);
		if (existing) {
			throw new HTTPException(409, {
				message: "Counterparty with this name already exists",
			});
		}

		const created = await container.counterpartyRepo.create({
			id: crypto.randomUUID(),
			userId: user.id,
			name,
			notes: body.notes?.trim() || null,
		});
		const totalLoans = await container.counterpartyRepo.countLoans(
			user.id,
			created.id,
		);

		return c.json({ counterparty: serialize({ ...created, totalLoans }) }, 201);
	})

	.patch("/:id", zv("json", updateSchema), async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const container = getContainer();

		if (body.name !== undefined) {
			const name = body.name.trim();
			if (!name) {
				throw new HTTPException(400, { message: "Name is required" });
			}
			const clash = await container.counterpartyRepo.findByNameForUser(
				user.id,
				name,
			);
			if (clash && clash.id !== id) {
				throw new HTTPException(409, {
					message: "Counterparty with this name already exists",
				});
			}
			body.name = name;
		}

		const updated = await container.counterpartyRepo.update(user.id, id, {
			...(body.name !== undefined ? { name: body.name } : {}),
			...(body.notes !== undefined
				? { notes: body.notes?.trim() || null }
				: {}),
		});
		if (!updated)
			throw new HTTPException(404, { message: "Counterparty not found" });

		const totalLoans = await container.counterpartyRepo.countLoans(
			user.id,
			updated.id,
		);

		return c.json({ counterparty: serialize({ ...updated, totalLoans }) });
	})

	.delete("/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const container = getContainer();

		try {
			const deleted = await container.counterpartyRepo.delete(user.id, id);
			if (!deleted) {
				throw new HTTPException(404, { message: "Counterparty not found" });
			}
		} catch (error) {
			if (error instanceof HTTPException) throw error;
			throw new HTTPException(409, {
				message:
					error instanceof Error ? error.message : "Cannot delete counterparty",
			});
		}

		return c.json({ message: "Counterparty deleted successfully" });
	});
