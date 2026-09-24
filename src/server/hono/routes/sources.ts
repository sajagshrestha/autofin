import { zValidator as zv } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { Source } from "@/server/db/schema";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";
import { normalizeSourceName } from "@/server/repositories/source.repository";

const emailSchema = z.string().trim().toLowerCase().max(255).pipe(z.email());

const aliasSchema = z.string().trim().min(1).max(120);

const createSchema = z.object({
	/** Display name — usually the bank name. */
	name: z.string().trim().min(1).max(120),
	/** Sender address Gmail filters are built from. */
	email: emailSchema,
	/** Optional account identifier (e.g. last digits of the account). */
	identifier: z.string().trim().max(120).optional(),
	/** Alternate names matched at import time (e.g. "nBank"). */
	aliases: z.array(aliasSchema).max(20).optional(),
});

const updateSchema = z.object({
	name: z.string().trim().min(1).max(120).optional(),
	email: emailSchema.optional(),
	identifier: z.string().trim().max(120).nullable().optional(),
	/** Replaces the alias set when provided. */
	aliases: z.array(aliasSchema).max(20).optional(),
});

function serialize(source: Source, aliases: string[]) {
	return {
		id: source.id,
		name: source.name,
		email: source.email,
		identifier: source.identifier,
		aliases,
		createdAt: source.createdAt.toISOString(),
		updatedAt: source.updatedAt.toISOString(),
	};
}

/**
 * Validate alias values: deduped, and clashing with no other source's name
 * or alias (case-insensitive). Returns the clean list or throws a 409.
 */
async function resolveAliases(
	userId: string,
	ignoreSourceId: string | null,
	values: string[],
): Promise<string[]> {
	const container = getContainer();
	const deduped = [...new Set(values.map((v) => v.trim()).filter(Boolean))];
	const seen = new Set<string>();
	for (const value of deduped) {
		const key = normalizeSourceName(value);
		if (seen.has(key)) {
			throw new HTTPException(409, {
				message: `Duplicate alias: "${value}"`,
			});
		}
		seen.add(key);
	}

	const [sourceList, aliases] = await Promise.all([
		container.sourceRepo.findAllForUser(userId),
		container.sourceRepo.getAliasesForUser(userId),
	]);
	for (const value of deduped) {
		const key = normalizeSourceName(value);
		const nameClash = sourceList.find(
			(source) =>
				source.id !== ignoreSourceId &&
				normalizeSourceName(source.name) === key,
		);
		if (nameClash) {
			throw new HTTPException(409, {
				message: `"${value}" is already used by "${nameClash.name}"`,
			});
		}
		const aliasClash = aliases.find(
			(alias) =>
				alias.sourceId !== ignoreSourceId &&
				normalizeSourceName(alias.value) === key,
		);
		if (aliasClash) {
			throw new HTTPException(409, {
				message: `"${value}" is already an alias of another source`,
			});
		}
	}
	return deduped;
}

/** Reconcile Gmail filters; surfaces sync failures distinctly from saves. */
async function resyncGmail(userId: string): Promise<void> {
	const container = getContainer();
	try {
		await container.gmailService.syncSourceFilters(userId);
	} catch (error) {
		throw new HTTPException(502, {
			message: `Saved, but Gmail filter sync failed — retry shortly: ${
				error instanceof Error ? error.message : "unknown error"
			}`,
		});
	}
}

/**
 * Protected email-sources API. Every mutation re-syncs the Gmail sender
 * filters so the monitored senders always match the sources list.
 */
export const sourcesRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.get("/", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const [sourceList, aliases] = await Promise.all([
			container.sourceRepo.findAllForUser(user.id),
			container.sourceRepo.getAliasesForUser(user.id),
		]);
		const bySource = new Map<string, string[]>();
		for (const alias of aliases) {
			const list = bySource.get(alias.sourceId) ?? [];
			list.push(alias.value);
			bySource.set(alias.sourceId, list);
		}

		return c.json({
			sources: sourceList.map((source) =>
				serialize(source, bySource.get(source.id) ?? []),
			),
		});
	})

	.post("/", zv("json", createSchema), async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");
		const container = getContainer();

		const existing = await container.sourceRepo.findByEmailForUser(
			user.id,
			body.email,
		);
		if (existing) {
			throw new HTTPException(409, {
				message: "A source with this email already exists",
			});
		}
		const aliasValues =
			body.aliases !== undefined
				? await resolveAliases(user.id, null, body.aliases)
				: [];

		const created = await container.sourceRepo.create({
			id: crypto.randomUUID(),
			userId: user.id,
			name: body.name,
			email: body.email,
			identifier: body.identifier?.trim() || null,
		});
		await container.sourceRepo.replaceAliases(user.id, created.id, aliasValues);

		await resyncGmail(user.id);

		return c.json({ source: serialize(created, aliasValues) }, 201);
	})

	.patch("/:id", zv("json", updateSchema), async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const container = getContainer();

		if (body.email !== undefined) {
			const clash = await container.sourceRepo.findByEmailForUser(
				user.id,
				body.email,
			);
			if (clash && clash.id !== id) {
				throw new HTTPException(409, {
					message: "A source with this email already exists",
				});
			}
		}

		const aliasValues =
			body.aliases !== undefined
				? await resolveAliases(user.id, id, body.aliases)
				: null;

		const updated = await container.sourceRepo.update(user.id, id, {
			...(body.name !== undefined ? { name: body.name } : {}),
			...(body.email !== undefined ? { email: body.email } : {}),
			...(body.identifier !== undefined
				? { identifier: body.identifier?.trim() || null }
				: {}),
		});
		if (!updated) throw new HTTPException(404, { message: "Source not found" });
		const aliases =
			aliasValues !== null
				? (
						await container.sourceRepo.replaceAliases(
							user.id,
							updated.id,
							aliasValues,
						)
					).map((row) => row.value)
				: (
						await container.sourceRepo.getAliasesForSources(user.id, [
							updated.id,
						])
					).map((row) => row.value);

		await resyncGmail(user.id);

		return c.json({ source: serialize(updated, aliases) });
	})

	.delete("/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const container = getContainer();

		const deleted = await container.sourceRepo.delete(user.id, id);
		if (!deleted) throw new HTTPException(404, { message: "Source not found" });

		await resyncGmail(user.id);

		return c.json({ message: "Source deleted successfully" });
	});
