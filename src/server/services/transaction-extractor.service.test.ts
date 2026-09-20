import { beforeEach, expect, it, vi } from "vitest";
import type { DiscordService } from "./discord.service";
import type { LoggerService } from "./logger.service";
import { TransactionExtractorService } from "./transaction-extractor.service";

const { generate, categorize } = vi.hoisted(() => ({
	generate: vi.fn(),
	categorize: vi.fn(),
}));
vi.mock("ai", () => ({
	generateText: generate,
	stepCountIs: vi.fn(),
	tool: (value: unknown) => value,
}));
vi.mock("@/server/lib/ai", () => ({ getAIModel: () => "test-model" }));
vi.mock("./transaction-categorizer.service", () => ({
	categorizeTransaction: categorize,
}));
const logger = { error: vi.fn() };
const discord = { notifyExtractorFailed: vi.fn() };
const service = new TransactionExtractorService(
	logger as unknown as LoggerService,
	discord as unknown as DiscordService,
);
const transaction = {
	amount: 10,
	type: "debit",
	merchant: "Shop",
	remarks: "Purchase",
	accountLastFour: null,
	bankName: null,
	date: null,
	time: null,
	confidence: 0.9,
};
function extraction(isTransaction = true) {
	generate.mockResolvedValue({
		steps: [
			{
				toolCalls: [
					{
						toolName: "submit_extraction",
						input: {
							isTransaction,
							transaction: isTransaction ? transaction : null,
						},
					},
				],
			},
		],
	});
}
beforeEach(() => vi.clearAllMocks());
it("categorizes SMS even without existing categories", async () => {
	extraction();
	categorize.mockResolvedValue({
		categoryId: null,
		categoryName: "Shopping",
		newCategory: { name: "Shopping", icon: "🛍️" },
	});
	const result = await service.extractFromSms(
		{ body: "Debited 10", sender: "Bank" },
		[],
		{ customCategoryPrompt: "Use Shopping" },
	);
	expect(result.transaction?.newCategory?.name).toBe("Shopping");
	expect(categorize).toHaveBeenCalledWith(
		transaction,
		[],
		"Use Shopping",
		undefined,
	);
	const request = generate.mock.calls[0][0];
	expect(Object.keys(request.tools)).toEqual(["submit_extraction"]);
});
it("preserves valid email transactions on categorization failure", async () => {
	extraction();
	categorize.mockRejectedValue(new Error("JEV unavailable"));
	const result = await service.extractFromEmail(
		{ body: "Debited 10", subject: "Alert", from: "Bank" },
		[],
	);
	expect(result.isTransaction).toBe(true);
	expect(result.transaction).toMatchObject({
		amount: 10,
		categoryId: null,
		newCategory: null,
	});
	expect(logger.error).toHaveBeenCalledWith(
		"Transaction categorization failed",
		expect.any(Error),
	);
});
it("does not categorize non-transaction messages", async () => {
	extraction(false);
	expect(
		await service.extractFromSms({ body: "Promotion", sender: "Bank" }, []),
	).toEqual({ isTransaction: false, transaction: null });
	expect(categorize).not.toHaveBeenCalled();
});
