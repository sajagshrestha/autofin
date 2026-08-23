import { generateText, type ModelMessage, Output } from "ai";
import { extractText, getDocumentProxy } from "unpdf";
import { z } from "zod";
import { getAIModel } from "@/server/lib/ai";
import type { DiscordService } from "@/server/services/discord.service";
import type { LoggerService } from "@/server/services/logger.service";
import type { CategoryInfo } from "./transaction-extractor.service";

/** Hard cap on extracted rows so a runaway model can't explode the response. */
export const MAX_STATEMENT_TRANSACTIONS = 200;

export interface StatementInput {
	/** Raw file bytes */
	data: Uint8Array;
	/** IANA media type: application/pdf, image/png, image/jpeg, image/webp */
	mediaType: string;
}

export interface StatementTransaction {
	amount: number;
	type: "debit" | "credit";
	merchant: string | null;
	remarks: string | null;
	/** YYYY-MM-DD or null when the statement has no parsable date */
	date: string | null;
	/** HH:MM:SS or null */
	time: string | null;
	/**
	 * Category suggestion resolved against the user's categories (exact name).
	 * Null when nothing matched — the UI falls back to Uncategorized.
	 */
	suggestedCategoryName: string | null;
	confidence: number;
}

export interface StatementExtractionResult {
	bankName: string | null;
	accountNumber: string | null;
	/** How the document was read for extraction. */
	mode: "pdf-text" | "vision";
	pages: number | null;
	transactions: StatementTransaction[];
}

const extractionSchema = z.object({
	bankName: z.string().nullable().describe("Bank name if identifiable"),
	accountNumber: z
		.string()
		.nullable()
		.describe("Account/card number (or its last 4 digits) if present"),
	transactions: z
		.array(
			z.object({
				amount: z.number().positive().describe("Amount as a positive number"),
				type: z
					.enum(["debit", "credit"])
					.describe("debit = money out, credit = money in"),
				date: z
					.string()
					.nullable()
					.describe("Transaction date as YYYY-MM-DD if present"),
				time: z
					.string()
					.nullable()
					.describe("Transaction time as HH:MM:SS if present"),
				merchant: z
					.string()
					.nullable()
					.describe("Merchant/payee/description party if identifiable"),
				remarks: z
					.string()
					.nullable()
					.describe(
						"Full transaction narration/reference text from the statement",
					),
				category: z
					.string()
					.nullable()
					.describe(
						"The exact category name from the available categories list that best fits this transaction",
					),
				confidence: z
					.number()
					.min(0)
					.max(1)
					.describe("Extraction confidence 0-1"),
			}),
		)
		.describe("All transactions found in the statement, in statement order"),
});

function buildSystemPrompt(categories: CategoryInfo[]): string {
	const categoryList = categories.map((c) => `- ${c.name}`).join("\n");

	return `You are a financial document parser specialized in extracting transactions from bank statements (PDF exports or photos/scans of paper statements).

Extract EVERY transaction row you can find. Rules:

TRANSACTION ROWS:
- Include purchases, ATM withdrawals, transfers, fees/charges (debit) and deposits, refunds, salary, interest (credit).
- Amounts are ALWAYS positive numbers; direction goes in "type" (debit = money out, credit = money in).
- Copy dates exactly as printed and normalize to YYYY-MM-DD. Watch out for DD/MM vs MM/DD ambiguity — use the statement's stated format and surrounding rows to disambiguate.
- Normalize times to HH:MM:SS when present.
- "merchant" is the counterparty (store, person, service). "remarks" is the full narration/reference line.
- IGNORE non-transaction rows: headers, footers, page numbers, account summaries, opening/closing balances, available-balance lines, interest-rate tables, promotional text.
- If a row is partially unreadable, still include it with your best reading and a lower confidence.

CATEGORIES:
Choose the best fit by EXACT NAME from this list (return null if none fits well):
${categoryList}

OUTPUT:
Return every transaction in statement order. Do not invent rows.`;
}

function normalizeWhitespace(value: string): string {
	return value.trim().replace(/\s+/g, " ");
}

function normalizeRows(
	raw: z.infer<typeof extractionSchema>["transactions"],
	categories: CategoryInfo[],
): StatementTransaction[] {
	const byLowerName = new Map(
		categories.map((c) => [normalizeWhitespace(c.name).toLowerCase(), c.name]),
	);

	return raw
		.filter(
			(row) =>
				Number.isFinite(row.amount) &&
				Math.abs(row.amount) > 0 &&
				(row.type === "debit" || row.type === "credit"),
		)
		.slice(0, MAX_STATEMENT_TRANSACTIONS)
		.map((row) => {
			const suggested =
				row.category && typeof row.category === "string"
					? (byLowerName.get(normalizeWhitespace(row.category).toLowerCase()) ??
						null)
					: null;

			return {
				amount: Math.abs(row.amount),
				type: row.type,
				merchant: row.merchant
					? normalizeWhitespace(row.merchant).slice(0, 255)
					: null,
				remarks: row.remarks
					? normalizeWhitespace(row.remarks).slice(0, 500)
					: null,
				// YYYY-MM-DD or null — anything else the model produced is dropped
				date:
					row.date && /^\d{4}-\d{2}-\d{2}$/.test(row.date.trim())
						? row.date.trim()
						: null,
				time:
					row.time && /^\d{1,2}:\d{2}(:\d{2})?$/.test(row.time.trim())
						? row.time.trim()
						: null,
				suggestedCategoryName: suggested,
				confidence: Math.min(1, Math.max(0, row.confidence)),
			};
		});
}

/**
 * StatementExtractorService
 *
 * Reads bank-statement documents (PDF or images) and extracts all
 * transactions with category suggestions.
 *
 * PDFs are parsed locally with unpdf (PDF.js) into text and analyzed as text
 * when they carry a text layer — cheaper and more reliable than vision.
 * Scanned PDFs without a text layer, and image uploads, fall back to direct
 * multimodal analysis.
 */
export class StatementExtractorService {
	constructor(
		private readonly loggerService: LoggerService,
		private readonly discordService: DiscordService,
	) {}

	async extractFromStatement(
		input: StatementInput,
		availableCategories: CategoryInfo[],
	): Promise<StatementExtractionResult> {
		try {
			let messages: ModelMessage[];
			let mode: "pdf-text" | "vision";
			let pages: number | null = null;

			if (input.mediaType === "application/pdf") {
				const pdf = await getDocumentProxy(new Uint8Array(input.data));
				const { totalPages, text } = await extractText(pdf, {
					mergePages: true,
				});

				// Scanned/image-only PDFs yield little or no text → vision fallback.
				if (text.replace(/\s+/g, "").length > 40) {
					mode = "pdf-text";
					pages = totalPages;
					messages = [
						{
							role: "user",
							content: [
								{
									type: "text",
									text: `Bank statement content (${totalPages} page${totalPages === 1 ? "" : "s"}):\n\n${text.slice(0, 400_000)}`,
								},
							],
						},
					];
				} else {
					mode = "vision";
					pages = totalPages;
					messages = this.buildVisionMessages(input);
				}
			} else {
				mode = "vision";
				messages = this.buildVisionMessages(input);
			}

			const schema = extractionSchema;
			const result = await generateText({
				model: getAIModel(),
				output: Output.object({ schema }),
				system: buildSystemPrompt(availableCategories),
				messages,
			});

			const extracted = result.output;

			return {
				bankName: extracted.bankName ?? null,
				accountNumber: extracted.accountNumber ?? null,
				mode,
				pages,
				transactions: normalizeRows(
					extracted.transactions,
					availableCategories,
				),
			};
		} catch (error) {
			this.loggerService.error("Statement extraction failed", error);
			void this.discordService.notifyExtractorFailed("statement", error);
			throw error instanceof Error
				? error
				: new Error("Statement extraction failed");
		}
	}

	private buildVisionMessages(input: StatementInput): ModelMessage[] {
		return [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "This is a bank statement document (photo or scanned/exported PDF). Extract every transaction row it contains.",
					},
					{
						type: "file",
						data: input.data,
						mediaType: input.mediaType,
					},
				],
			},
		];
	}
}
