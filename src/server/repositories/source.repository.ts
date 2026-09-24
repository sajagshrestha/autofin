import { and, asc, eq, inArray, sql } from "drizzle-orm";
import {
	type NewSource,
	type Source,
	type SourceAlias,
	sourceAliases,
	sources,
} from "@/server/db/schema";
import { BaseRepository } from "./base.repository";

/** Lowercase + trim + collapse whitespace — the shared name/alias key. */
export function normalizeSourceName(value: string | null | undefined): string {
	return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

/** Split a `From: "Name" <addr>` header into address + display name. */
export function parseFromHeader(from: string | null | undefined): {
	address: string | null;
	displayName: string | null;
} {
	if (!from) return { address: null, displayName: null };
	const bracketed = /<([^<>]+)>/.exec(from);
	if (bracketed) {
		return {
			address: bracketed[1].trim().toLowerCase() || null,
			displayName:
				from
					.slice(0, bracketed.index)
					.trim()
					.replace(/^["']|["']$/g, "")
					.trim() || null,
		};
	}
	const trimmed = from.trim();
	return {
		address: trimmed.includes("@") ? trimmed.toLowerCase() : null,
		displayName: trimmed.includes("@") ? null : trimmed || null,
	};
}

export class SourceRepository extends BaseRepository {
	async findAllForUser(userId: string): Promise<Source[]> {
		return this.db
			.select()
			.from(sources)
			.where(eq(sources.userId, userId))
			.orderBy(asc(sql`lower(${sources.name})`));
	}

	async findById(userId: string, id: string): Promise<Source | null> {
		const rows = await this.db
			.select()
			.from(sources)
			.where(and(eq(sources.id, id), eq(sources.userId, userId)))
			.limit(1);
		return rows[0] ?? null;
	}

	/**
	 * Case-insensitive email lookup scoped to the user, so
	 * "Alerts@x.com" and "alerts@x.com" resolve to the same source.
	 */
	async findByEmailForUser(
		userId: string,
		email: string,
	): Promise<Source | null> {
		const normalized = email.trim().toLowerCase();
		if (!normalized) return null;
		const rows = await this.db
			.select()
			.from(sources)
			.where(
				and(
					eq(sources.userId, userId),
					sql`lower(trim(${sources.email})) = ${normalized}`,
				),
			)
			.limit(1);
		return rows[0] ?? null;
	}

	async create(data: NewSource): Promise<Source> {
		const rows = await this.db.insert(sources).values(data).returning();
		return rows[0];
	}

	async update(
		userId: string,
		id: string,
		data: Partial<Pick<NewSource, "name" | "email" | "identifier">>,
	): Promise<Source | null> {
		const rows = await this.db
			.update(sources)
			.set({ ...data, updatedAt: new Date() })
			.where(and(eq(sources.id, id), eq(sources.userId, userId)))
			.returning();
		return rows[0] ?? null;
	}

	async setGmailFilterId(
		userId: string,
		id: string,
		gmailFilterId: string | null,
	): Promise<void> {
		await this.db
			.update(sources)
			.set({ gmailFilterId, updatedAt: new Date() })
			.where(and(eq(sources.id, id), eq(sources.userId, userId)));
	}

	async delete(userId: string, id: string): Promise<boolean> {
		const rows = await this.db
			.delete(sources)
			.where(and(eq(sources.id, id), eq(sources.userId, userId)))
			.returning({ id: sources.id });
		return rows.length > 0;
	}

	/* ── Aliases ─────────────────────────────────────────────────────── */

	async getAliasesForUser(userId: string): Promise<SourceAlias[]> {
		return this.db
			.select()
			.from(sourceAliases)
			.where(eq(sourceAliases.userId, userId));
	}

	async getAliasesForSources(
		userId: string,
		sourceIds: string[],
	): Promise<SourceAlias[]> {
		if (sourceIds.length === 0) return [];
		return this.db
			.select()
			.from(sourceAliases)
			.where(
				and(
					eq(sourceAliases.userId, userId),
					inArray(sourceAliases.sourceId, [...new Set(sourceIds)]),
				),
			);
	}

	/**
	 * Case-insensitive value lookup across this user's aliases. Used to
	 * detect clashes and to resolve bank names at import time.
	 */
	async findAliasForUser(
		userId: string,
		value: string,
	): Promise<SourceAlias | null> {
		const normalized = normalizeSourceName(value);
		if (!normalized) return null;
		const rows = await this.db
			.select()
			.from(sourceAliases)
			.where(
				and(
					eq(sourceAliases.userId, userId),
					sql`lower(trim(${sourceAliases.value})) = ${normalized}`,
				),
			)
			.limit(1);
		return rows[0] ?? null;
	}

	async addAlias(
		userId: string,
		sourceId: string,
		value: string,
	): Promise<SourceAlias> {
		const trimmed = value.trim();
		if (!trimmed) throw new Error("Alias value is required");
		const rows = await this.db
			.insert(sourceAliases)
			.values({
				id: crypto.randomUUID(),
				userId,
				sourceId,
				value: trimmed,
			})
			.returning();
		return rows[0];
	}

	async removeAlias(
		userId: string,
		sourceId: string,
		aliasId: string,
	): Promise<boolean> {
		const rows = await this.db
			.delete(sourceAliases)
			.where(
				and(
					eq(sourceAliases.id, aliasId),
					eq(sourceAliases.sourceId, sourceId),
					eq(sourceAliases.userId, userId),
				),
			)
			.returning({ id: sourceAliases.id });
		return rows.length > 0;
	}

	async replaceAliases(
		userId: string,
		sourceId: string,
		values: string[],
	): Promise<SourceAlias[]> {
		await this.db
			.delete(sourceAliases)
			.where(
				and(
					eq(sourceAliases.sourceId, sourceId),
					eq(sourceAliases.userId, userId),
				),
			);
		const deduped = [
			...new Set(values.map((v) => v.trim()).filter((v) => v.length > 0)),
		];
		if (deduped.length === 0) return [];
		return this.db
			.insert(sourceAliases)
			.values(
				deduped.map((value) => ({
					id: crypto.randomUUID(),
					userId,
					sourceId,
					value,
				})),
			)
			.returning();
	}

	/**
	 * Resolve the source for an incoming transaction, when available:
	 * 1. sender email → source email (exact, case-insensitive)
	 * 2. each candidate name in order → source name, then alias
	 * (normalized comparison). Returns null when nothing matches.
	 */
	async resolveForTransaction(
		userId: string,
		input: {
			email?: string | null;
			names?: Array<string | null | undefined>;
		},
	): Promise<Source | null> {
		const [sourceList, aliases] = await Promise.all([
			this.findAllForUser(userId),
			this.getAliasesForUser(userId),
		]);
		if (sourceList.length === 0) return null;

		const email = (input.email ?? "").trim().toLowerCase();
		if (email) {
			const byEmail = sourceList.find(
				(source) => source.email.toLowerCase() === email,
			);
			if (byEmail) return byEmail;
		}

		for (const raw of input.names ?? []) {
			const normalized = normalizeSourceName(raw);
			if (!normalized) continue;
			const byName = sourceList.find(
				(source) => normalizeSourceName(source.name) === normalized,
			);
			if (byName) return byName;
			const aliasHit = aliases.find(
				(alias) => normalizeSourceName(alias.value) === normalized,
			);
			if (aliasHit) {
				return (
					sourceList.find((source) => source.id === aliasHit.sourceId) ?? null
				);
			}
		}
		return null;
	}
}
