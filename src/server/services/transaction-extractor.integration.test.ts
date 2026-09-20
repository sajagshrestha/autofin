import { beforeAll, describe, expect, it } from "vitest";
import { getDefaultModelId } from "@/server/lib/ai";
import type {
	ExtractionStep,
	ExtractionTiming,
	TimingObserver,
} from "@/server/lib/extraction-timing";
import { DiscordServiceImpl } from "./discord.service";
import { LoggerServiceImpl } from "./logger.service";
import { categorizeTransaction } from "./transaction-categorizer.service";
import { TransactionExtractorService } from "./transaction-extractor.service";

// Real implementations; the explicit empty webhook disables notifications.
const extractor = new TransactionExtractorService(
	new LoggerServiceImpl(),
	new DiscordServiceImpl(""),
);
const steps: ExtractionStep[] = [
	"llm_extraction",
	"jev_remarks_eligibility",
	"jev_classification",
	"llm_category_proposal",
];

async function timed<T>(
	label: string,
	operation: (observe: TimingObserver) => Promise<T>,
) {
	const timings: ExtractionTiming[] = [];
	const started = performance.now();
	try {
		const result = await operation((timing) => timings.push(timing));
		// The extractor intentionally catches service errors; fail the test on those errors.
		expect(timings.filter(({ status }) => status === "error")).toEqual([]);
		return { result, timings };
	} finally {
		console.log(`\n[live integration] ${label}`);
		console.table([
			...steps.map((step) => {
				const timing = timings.find((entry) => entry.step === step);
				return {
					step,
					status: timing?.status ?? "skipped",
					milliseconds: timing ? timing.durationMs.toFixed(1) : "—",
				};
			}),
			{
				step: "total",
				status: "elapsed",
				milliseconds: (performance.now() - started).toFixed(1),
			},
		]);
	}
}

beforeAll(() => {
	const provider = process.env.AI_PROVIDER || "openai";
	const keys: Record<string, string> = {
		openai: "OPENAI_API_KEY",
		anthropic: "ANTHROPIC_API_KEY",
		google: "GOOGLE_GENERATIVE_AI_API_KEY",
	};
	const providerKey = keys[provider];
	if (!providerKey) throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
	const missing = ["TYPESAFE_API_KEY", providerKey].filter(
		(key) => !process.env[key]?.trim(),
	);
	if (missing.length)
		throw new Error(
			`Live integration tests require: ${missing.join(", ")}. Set them in the environment or .env.local.`,
		);
	console.log(
		`[live integration] LLM provider: ${provider}; LLM model: ${getDefaultModelId()}; JEV model: ${process.env.TYPESAFE_MODEL || "jev-latest"}`,
	);
});

describe.sequential("real transaction extraction and categorization", () => {
	it("extracts SMS facts and uses an existing category without an LLM proposal", async () => {
		const { result, timings } = await timed(
			"SMS → existing Groceries",
			(onStepTiming) =>
				extractor.extractFromSms(
					{
						sender: "Example Bank",
						body: "Your account ending 1234 was debited NPR 1250.00 on 2026-09-15 at 14:30:00. Merchant: Fresh Market. Remarks: Grocery purchase of vegetables, rice, milk and eggs at Fresh Market. Transaction successful.",
					},
					[
						{ id: "groceries", name: "Groceries", icon: "🥬" },
						{ id: "salary", name: "Salary", icon: "💰" },
					],
					{ onStepTiming },
				),
		);
		expect(result.isTransaction).toBe(true);
		expect(result.transaction).toMatchObject({
			amount: 1250,
			type: "debit",
			accountLastFour: "1234",
			date: "2026-09-15",
			categoryId: "groceries",
			categoryName: "Groceries",
			newCategory: null,
		});
		expect(timings.map(({ step }) => step)).toEqual([
			"llm_extraction",
			"jev_remarks_eligibility",
			"jev_classification",
		]);
	});

	it("creates a new category through the real LLM after JEV returns uncategorized", async () => {
		const { result, timings } = await timed(
			"Email → uncategorized → Fitness proposal",
			(onStepTiming) =>
				extractor.extractFromEmail(
					{
						from: "alerts@example.test",
						subject: "Successful debit transaction",
						body: "Example Bank: Account ending 9876 was debited NPR 3000.00 on 2026-09-15 at 08:00:00. Merchant: Active Gym. Remarks: Monthly gym membership for fitness training. Transaction completed successfully.",
					},
					[{ id: "salary", name: "Salary", icon: "💰" }],
					{
						onStepTiming,
						customCategoryPrompt:
							"Gym membership payments belong to Fitness. If Fitness is missing, use uncategorized and propose a new category named Fitness.",
					},
				),
		);
		expect(result.isTransaction).toBe(true);
		expect(result.transaction).toMatchObject({
			amount: 3000,
			type: "debit",
			categoryId: null,
			categoryName: "Fitness",
			newCategory: { name: "Fitness" },
		});
		expect(result.transaction?.newCategory?.icon).toBeTruthy();
		expect(timings.map(({ step }) => step)).toEqual(steps);
	});

	it("does not categorize a promotional SMS", async () => {
		const { result, timings } = await timed(
			"Promotional SMS → no transaction",
			(onStepTiming) =>
				extractor.extractFromSms(
					{
						sender: "Example Bank",
						body: "Apply for our new credit card and get up to 20% cashback on dining. This is a promotional offer. No transaction has occurred.",
					},
					[{ id: "dining", name: "Dining", icon: "🍽️" }],
					{ onStepTiming },
				),
		);
		expect(result).toEqual({ isTransaction: false, transaction: null });
		expect(timings.map(({ step }) => step)).toEqual(["llm_extraction"]);
	});

	it("keeps an unclear transaction uncategorized rather than inventing a category", async () => {
		const { result, timings } = await timed(
			"Unknown purpose → no category proposal",
			(onTiming) =>
				categorizeTransaction(
					{
						amount: 42,
						type: "debit",
						merchant: null,
						remarks: "Reference 839201. No description or purpose provided.",
					},
					[{ id: "salary", name: "Salary", icon: "💰" }],
					undefined,
					onTiming,
				),
		);
		expect(result).toEqual({
			categoryId: null,
			categoryName: null,
			newCategory: null,
		});
		expect(timings.map(({ step }) => step)).toEqual([
			"jev_remarks_eligibility",
		]);
	});
});
