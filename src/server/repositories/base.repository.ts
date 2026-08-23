import type { Database } from "@/server/db/connection";

export abstract class BaseRepository {
	constructor(protected readonly db: Database) {}
}
