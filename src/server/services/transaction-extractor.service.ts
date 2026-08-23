import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import { getAIModel } from "@/server/lib/ai";
import type { DiscordService } from "@/server/services/discord.service";
import type { LoggerService } from "@/server/services/logger.service";

/**
 * Category info from the database
 */
export interface CategoryInfo {
	id: string;
	name: string;
	icon: string | null;
}

function normalizeCategoryName(value: string): string {
	return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function findCategoryByName(
	value: string,
	categories: Iterable<CategoryInfo>,
): CategoryInfo | undefined {
	const normalizedValue = normalizeCategoryName(value);
	if (!normalizedValue) return undefined;

	return Array.from(categories).find(
		(category) => normalizeCategoryName(category.name) === normalizedValue,
	);
}

/**
 * Resolve a category reference (ID or name) from the model to a valid category ID.
 * The model sometimes returns category name instead of ID; we accept either and resolve here.
 */
function resolveCategoryId(
	value: string,
	categoryMap: Map<string, CategoryInfo>,
	uncategorized: CategoryInfo | undefined,
): string | null {
	if (!value || typeof value !== "string") return uncategorized?.id ?? null;
	const trimmed = value.trim();
	if (categoryMap.has(trimmed)) return trimmed;
	const byName = findCategoryByName(trimmed, categoryMap.values());
	if (byName) return byName.id;
	return uncategorized?.id ?? null;
}

/**
 * Schema for extracted transaction data with category selection or creation.
 * categoryId is accepted as string (not strict enum) so we can tolerate the model
 * returning category name or malformed ID and resolve it in code.
 */
/**
 * Tool-calling models frequently omit the discriminant or pass a bare
 * category id/name. Accept all of those shapes and normalize centrally.
 */
export function normalizeCategoryAction(value: unknown): CategoryAction {
	if (typeof value === "string") {
		return { action: "select_existing", categoryId: value };
	}
	const candidate = value as {
		action?: CategoryAction["action"];
		categoryId?: string;
		id?: string;
		newCategoryName?: string;
		newCategoryIcon?: string;
	} | null;

	if (!candidate || typeof candidate !== "object") {
		return { action: "uncategorized", categoryId: "" };
	}

	if (
		candidate.action === "select_existing" ||
		candidate.action === "uncategorized"
	) {
		return {
			action: candidate.action,
			categoryId: candidate.categoryId ?? candidate.id ?? "",
		};
	}

	if (candidate.action === "create_new" || candidate.newCategoryName) {
		return {
			action: "create_new",
			newCategoryName:
				candidate.newCategoryName ??
				(candidate as unknown as { name?: string }).name ??
				"",
			newCategoryIcon: candidate.newCategoryIcon ?? "📁",
		};
	}

	// Action-less object with an id → treat as selecting that category.
	const id = candidate.categoryId ?? candidate.id;
	if (id) return { action: "select_existing", categoryId: id };

	return { action: "uncategorized", categoryId: "" };
}

/**
 * Tolerant, JSON-Schema-safe category input for the submit tool.
 * Accepts: bare id/name string · full action object · action-less object.
 */
const categoryInput = z.union([
	z.string(),
	z.object({
		action: z
			.enum(["select_existing", "create_new", "uncategorized"])
			.optional(),
		categoryId: z.string().optional(),
		id: z.string().optional(),
		newCategoryName: z.string().optional(),
		name: z.string().optional(),
		newCategoryIcon: z.string().optional(),
		icon: z.string().optional(),
		reason: z.string().optional(),
	}),
	z.null(),
]);

function createExtractionSchema(_categoryIds: string[]) {
	return z.object({
		isTransaction: z
			.boolean()
			.describe("Whether this email is a bank transaction notification"),
		transaction: z
			.object({
				amount: z.number().describe("Transaction amount as a positive number"),
				type: z
					.enum(["debit", "credit"])
					.describe("Whether money was debited or credited"),
				merchant: z
					.string()
					.nullable()
					.describe("Merchant/payee name if identifiable, null otherwise"),
				accountLastFour: z
					.string()
					.nullable()
					.describe("Last 4 digits of the account/card number if present"),
				bankName: z
					.string()
					.nullable()
					.describe(
						'Full official bank name with proper spacing (e.g., "HDFC Bank", "ICICI Bank", "State Bank of India"). Extract the complete name as it appears in the email, ensuring proper spacing between words. Do not use abbreviations or short forms.',
					),
				date: z
					.string()
					.nullable()
					.describe("Transaction date in ISO format (YYYY-MM-DD) if present"),
				time: z
					.string()
					.nullable()
					.describe("Transaction time if present (HH:MM:SS)"),
				remarks: z
					.string()
					.nullable()
					.describe(
						"Transaction remarks/description extracted from the email. This field often contains detailed merchant information, location, transaction reference numbers, and other details. Extract the complete remarks text as it appears in the email.",
					),
				category: categoryInput.describe(
					"Either the exact category id from search_categories (string), or an object {action:'create_new', newCategoryName, newCategoryIcon}. Omit/null when uncategorized.",
				),
				confidence: z
					.number()
					.min(0)
					.max(1)
					.describe("Confidence score for the extraction (0-1)"),
			})
			.nullable()
			.describe("Extracted transaction data, null if not a transaction email"),
	});
}

const SUBMIT_TOOL_NAME = "submit_extraction";
const SEARCH_CATEGORIES_TOOL_NAME = "search_categories";

/**
 * Read-only helper the model can call mid-extraction to find exact category
 * ids/names from the user's list instead of guessing.
 */
function buildSearchCategoriesTool(availableCategories: CategoryInfo[]) {
	return tool({
		description:
			"Search the user's available categories by name (case-insensitive substring) before submitting.",
		inputSchema: z.object({
			query: z
				.string()
				.describe(
					'Case-insensitive name substring, e.g. "food" or "transport"',
				),
		}),
		execute: async ({ query }) => {
			const needle = query.trim().toLowerCase();
			const matches = availableCategories
				.filter((category) => category.name.toLowerCase().includes(needle))
				.slice(0, 10)
				.map(({ id, name, icon }) => ({ id, name, icon }));
			return { matches };
		},
	});
}

export type TransactionData = {
	amount: number;
	type: "debit" | "credit";
	merchant: string | null;
	accountLastFour: string | null;
	bankName: string | null;
	date: string | null;
	time: string | null;
	remarks: string | null;
	confidence: number;
};

/**
 * Category action from AI: either select existing or create new
 */
export type CategoryAction =
	| { action: "select_existing"; categoryId: string; reason?: string }
	| {
			action: "create_new";
			newCategoryName: string;
			newCategoryIcon: string;
			reason?: string;
	  }
	| { action: "uncategorized"; categoryId: string };

/**
 * Final extraction result including the selected/new category
 */
export interface TransactionExtractionResult {
	isTransaction: boolean;
	transaction:
		| (TransactionData & {
				categoryId: string | null;
				categoryName: string | null;
				// If AI wants to create a new category
				newCategory: { name: string; icon: string } | null;
		  })
		| null;
}

export interface EmailInput {
	subject: string | undefined;
	body: string;
	from: string | undefined;
}

export interface SmsInput {
	body: string;
	sender: string | undefined;
}

/**
 * Build system prompt with available categories
 */
function buildSystemPrompt(categories: CategoryInfo[]): string {
	const categoryList = categories
		.map((c) => `- "${c.name}" (id: ${c.id})${c.icon ? ` ${c.icon}` : ""}`)
		.join("\n");

	return `You are a financial message parser specialized in extracting transaction information from bank notification emails and SMS messages.

Your task is to:
1. Determine if the message (email or SMS) is a bank transaction notification (debit/credit alert)
2. If it is, extract all relevant transaction details
3. Categorize the transaction using the category field

CATEGORY SELECTION RULES:
- CRITICAL: Use the REMARKS field as the PRIMARY source for determining the category
- The remarks field contains detailed transaction information including merchant details, location, transaction type, and other context
- DO NOT rely primarily on the merchant name - use the remarks field instead
- The remarks field may contain additional merchant information that is more descriptive than the merchant name
- FIRST, extract the remarks field completely from the email
- THEN, analyze the remarks to determine the most appropriate category from the AVAILABLE CATEGORIES list
- If an existing category fits well based on the remarks, use action: "select_existing" with the category ID
- ONLY if NO existing category fits the transaction based on remarks AND you can identify a clear, specific category:
  - Use action: "create_new" to suggest a new category
  - New category names should be specific but reusable (e.g., "Subscriptions", "Pet Care", "Education")
  - Avoid creating one-off categories for specific merchants (don't create "Amazon" category, use "Shopping")
  - NEVER create a category called "Other" or "Others" – use action: "uncategorized" instead
- If you cannot determine a category from the remarks, use action: "uncategorized" with the Uncategorized category ID from the list

IMPORTANT GUIDELINES:
- Only mark isTransaction=true for actual bank transaction alerts (not promotional messages, statements, or other notifications)
- For SMS, look for specific patterns like "withdrawn by", "debited by", "credited with", "deposited", etc.
- Extract the exact amount as a positive number (regardless of debit/credit)
- Determine if it's a 'debit' (money spent/withdrawn) or 'credit' (money received/deposited)
- For remarks: Extract the COMPLETE remarks/description text from the email
  - Look for fields labeled "Remarks", "Description", "Transaction Details", "Narration", or similar
  - Include all text in the remarks field - it may contain merchant information, location, reference numbers, etc.
  - Do not truncate or summarize - extract the full remarks text as it appears
  - The remarks field is the PRIMARY source for category determination
- For bankName: Extract the FULL official bank name with proper spacing as it appears in the email
  - Examples: "HDFC Bank" (not "HDFC" or "HDFCBank"), "ICICI Bank" (not "ICICI"), "State Bank of India" (not "SBI")
  - Look for phrases like "Bank Name:", "from", or bank name in email headers/subject
  - Ensure proper spacing between words (e.g., "HDFC Bank" not "HDFCBank")
  - Use the complete official name, not abbreviations
- Set confidence between 0 and 1 based on how certain you are about the extraction
- Be conservative - if you're not sure it's a transaction email, mark isTransaction=false

AVAILABLE CATEGORIES:
${categoryList}

CATEGORY HINTS FOR EXISTING CATEGORIES:
- Food and Dining: restaurants, cafes, food delivery apps
- Transportation: uber, ola, fuel, metro, parking, taxi
- Shopping: retail stores, online shopping, amazon, flipkart
- Bills and Utilities: electricity, water, gas, internet, phone bills
- Entertainment: movies, games, streaming services, spotify, netflix, buying musical euqipments
- Healthcare: pharmacy, hospital, doctor, medical expenses
- Travel: hotels, flights, booking.com, travel agencies
- Groceries: supermarkets, grocery stores, raw food items (chicken, bread, eggs)
- Transfers: person-to-person transfers, NEFT, IMPS, UPI transfers
- Salary/Income: salary credits, refunds, cashback, invoices from Zoho Invoice, Upstem technologies, etc.

EXAMPLES OF WHEN TO CREATE NEW CATEGORIES:
- Gym membership → Create "Fitness" if not in list
- Tuition payment → Create "Education" if not in list
- Pet store purchase → Create "Pet Care" if not in list
- Charity donation → Create "Donations" if not in list`;
}

/**
 * TransactionExtractorService
 *
 * Uses AI to extract transaction data from bank email notifications
 * and select or create categories.
 */
export class TransactionExtractorService {
	constructor(
		private readonly loggerService: LoggerService,
		private readonly discordService: DiscordService,
	) {}

	/**
	 * Extract transaction data from a bank notification email.
	 *
	 * Runs a tool-call loop: the model may search the user's categories via
	 * search_categories and must finish by calling submit_extraction with the
	 * complete structured result.
	 */
	async extractFromEmail(
		email: EmailInput,
		availableCategories: CategoryInfo[],
	): Promise<TransactionExtractionResult> {
		return this.runExtraction(
			this.formatEmailForPrompt(email),
			availableCategories,
			"email",
		);
	}

	/**
	 * Extract transaction data from an SMS using AI tool calls.
	 */
	async extractFromSms(
		sms: SmsInput,
		availableCategories: CategoryInfo[],
	): Promise<TransactionExtractionResult> {
		return this.runExtraction(
			this.formatSmsForPrompt(sms),
			availableCategories,
			"sms",
		);
	}

	isValidTransaction(result: TransactionExtractionResult): boolean {
		return (
			result.isTransaction &&
			result.transaction !== null &&
			result.transaction.amount > 0 &&
			(result.transaction.type === "debit" ||
				result.transaction.type === "credit")
		);
	}

	private async runExtraction(
		content: string,
		availableCategories: CategoryInfo[],
		source: "email" | "sms",
	): Promise<TransactionExtractionResult> {
		const categoryMap = new Map(availableCategories.map((c) => [c.id, c]));
		const uncategorized = availableCategories.find(
			(c) => c.name.toLowerCase() === "uncategorized",
		);
		const categoryIds = availableCategories.map((c) => c.id);

		if (categoryIds.length === 0) {
			console.warn("No categories available for extraction");
			return { isTransaction: false, transaction: null };
		}

		const notATransaction = (): TransactionExtractionResult => ({
			isTransaction: false,
			transaction: null,
		});

		try {
			const result = await generateText({
				model: getAIModel(),
				system: buildSystemPrompt(availableCategories),
				prompt: content,
				tools: {
					[SEARCH_CATEGORIES_TOOL_NAME]:
						buildSearchCategoriesTool(availableCategories),
					[SUBMIT_TOOL_NAME]: tool({
						description:
							"Submit the final extraction result. Call this exactly once when you are done analyzing the message.",
						inputSchema: createExtractionSchema(categoryIds),
						execute: async (args) => args,
					}),
				},
				stopWhen: stepCountIs(6),
				// After the result was successfully submitted, no more tool calls
				// are needed. (Gate on results — a failed validation attempt must
				// still allow the model to retry.)
				prepareStep: ({ steps }) =>
					steps.some((step) =>
						step.toolResults.some((res) => res.toolName === SUBMIT_TOOL_NAME),
					)
						? { toolChoice: "none" as const }
						: {},
			});

			// NOTE: result.toolCalls only exposes the FINAL step — with a
			// multi-step loop the submit happens earlier, so scan all steps.
			// v6 runtime exposes arguments as `input` on tool-call parts.
			const submitCall = result.steps
				.flatMap((step) => step.toolCalls)
				.find((call) => call.toolName === SUBMIT_TOOL_NAME) as
				| {
						input?: z.infer<ReturnType<typeof createExtractionSchema>>;
						args?: z.infer<ReturnType<typeof createExtractionSchema>>;
				  }
				| undefined;
			const extracted = submitCall?.input ?? submitCall?.args;
			if (!extracted) {
				console.warn(
					`[${source}] No successful ${SUBMIT_TOOL_NAME} call.`,
					result.toolCalls.map((call) => call.toolName),
				);
				return notATransaction();
			}
			if (!extracted.isTransaction || !extracted.transaction) {
				return notATransaction();
			}

			const txn = extracted.transaction;
			const categoryAction = normalizeCategoryAction(txn.category);

			let categoryId: string | null = null;
			let categoryName: string | null = null;
			let newCategory: { name: string; icon: string } | null = null;

			if (categoryAction.action === "select_existing") {
				const resolvedId = resolveCategoryId(
					categoryAction.categoryId,
					categoryMap,
					uncategorized,
				);
				const selectedCategory = resolvedId
					? categoryMap.get(resolvedId)
					: null;
				categoryId = selectedCategory?.id || uncategorized?.id || null;
				categoryName = selectedCategory?.name || uncategorized?.name || null;

				if (categoryAction.reason) {
					console.log(
						`[${source}] Category "${categoryName}": ${categoryAction.reason}`,
					);
				}
			} else if (categoryAction.action === "uncategorized") {
				const resolvedId = resolveCategoryId(
					categoryAction.categoryId,
					categoryMap,
					uncategorized,
				);
				categoryId = resolvedId || uncategorized?.id || null;
				categoryName =
					categoryMap.get(categoryId ?? "")?.name ?? "Uncategorized";
			} else if (categoryAction.action === "create_new") {
				const name = categoryAction.newCategoryName?.trim();
				if (!name) {
					categoryId = uncategorized?.id ?? null;
					categoryName = uncategorized?.name ?? "Uncategorized";
				} else {
					const existingCategory = findCategoryByName(
						name,
						availableCategories,
					);
					if (existingCategory) {
						categoryId = existingCategory.id;
						categoryName = existingCategory.name;
					} else {
						newCategory = {
							name,
							icon: categoryAction.newCategoryIcon || "📁",
						};
						categoryName = name;
					}
				}
			}

			return {
				isTransaction: true,
				transaction: {
					amount: txn.amount,
					type: txn.type,
					merchant: txn.merchant,
					accountLastFour: txn.accountLastFour,
					bankName: txn.bankName,
					date: txn.date,
					time: txn.time,
					remarks: txn.remarks,
					confidence: txn.confidence,
					categoryId,
					categoryName,
					newCategory,
				},
			};
		} catch (error) {
			this.loggerService.error("AI extraction failed", error);
			void this.discordService.notifyExtractorFailed(source, error);
			return notATransaction();
		}
	}

	/**
	 * Format SMS content for the AI prompt
	 */
	private formatSmsForPrompt(sms: SmsInput): string {
		const parts: string[] = [];

		if (sms.sender) {
			parts.push(`From/Sender: ${sms.sender}`);
		}

		parts.push("");
		parts.push("SMS Message:");
		parts.push(sms.body);

		return parts.join("\n");
	}

	/**
	 * Format email content for the AI prompt
	 */
	private formatEmailForPrompt(email: EmailInput): string {
		const parts: string[] = [];

		if (email.from) {
			parts.push(`From: ${email.from}`);
		}

		if (email.subject) {
			parts.push(`Subject: ${email.subject}`);
		}

		parts.push("");
		parts.push("Email Body:");
		parts.push(email.body);

		return parts.join("\n");
	}
}

// Export a basic schema for reference (not used directly, schema is generated dynamically)
export const transactionDataSchema = z.object({
	amount: z.number(),
	type: z.enum(["debit", "credit"]),
	merchant: z.string().nullable(),
	accountLastFour: z.string().nullable(),
	bankName: z.string().nullable(),
	date: z.string().nullable(),
	time: z.string().nullable(),
	remarks: z.string().nullable(),
	confidence: z.number().min(0).max(1),
});
