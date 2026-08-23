import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ApiEnv } from "@/server/hono/middleware";
import { requireUser } from "@/server/hono/middleware";
import { getContainer } from "@/server/lib/container";
import type { StatementInput } from "@/server/services/statement-extractor.service";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MEDIA_TYPES = new Set([
	"application/pdf",
	"image/png",
	"image/jpeg",
	"image/webp",
]);

function guessMediaType(filename: string): string {
	const ext = filename.toLowerCase().split(".").pop() ?? "";
	switch (ext) {
		case "pdf":
			return "application/pdf";
		case "png":
			return "image/png";
		case "jpg":
		case "jpeg":
			return "image/jpeg";
		case "webp":
			return "image/webp";
		default:
			return "";
	}
}

/**
 * Protected statement-import API.
 *
 * POST /extract accepts multipart/form-data with a `file` field (PDF or
 * image) and returns AI-extracted transactions for review. Nothing is
 * persisted — creation goes through transactions/bulk-import.
 */
export const statementsRouter = new Hono<ApiEnv>()
	.use("*", requireUser)

	.post("/extract", async (c) => {
		const user = c.get("user");
		const container = getContainer();

		const form = await c.req.formData();
		const file = form.get("file");

		if (!(file instanceof File)) {
			throw new HTTPException(400, { message: "A statement file is required" });
		}
		if (file.size === 0) {
			throw new HTTPException(400, { message: "The uploaded file is empty" });
		}
		if (file.size > MAX_FILE_BYTES) {
			throw new HTTPException(400, {
				message: "File is too large — statements must be under 10 MB",
			});
		}

		const mediaType = file.type || guessMediaType(file.name);
		if (!ALLOWED_MEDIA_TYPES.has(mediaType)) {
			throw new HTTPException(400, {
				message: "Unsupported file type — upload a PDF or a PNG/JPG/WebP image",
			});
		}

		const categories = await container.categoryRepo.findAllForUser(user.id);
		const categoryInfo = categories.map((cat) => ({
			id: cat.id,
			name: cat.name,
			icon: cat.icon,
		}));

		const input: StatementInput = {
			data: new Uint8Array(await file.arrayBuffer()),
			mediaType,
		};

		return c.json(
			await container.statementExtractor.extractFromStatement(
				input,
				categoryInfo,
			),
		);
	});
