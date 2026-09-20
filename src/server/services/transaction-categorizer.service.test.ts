import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { categorizeTransaction } from "./transaction-categorizer.service";

const { generate } = vi.hoisted(() => ({ generate: vi.fn() }));
vi.mock("ai", () => ({ generateText: generate, Output: { object: vi.fn() } }));
vi.mock("@/server/lib/ai", () => ({ getAIModel: () => "test-model" }));
const fetchMock = vi.fn();
const transaction = {
	amount: 500,
	type: "debit" as const,
	merchant: "Gym",
	remarks: "Monthly gym membership",
};
const categories = [{ id: "food-id", name: "Food", icon: "🍲" }];
function answer(choice: string, eligibility = "eligible") {
	fetchMock.mockResolvedValueOnce(
		new Response(
			JSON.stringify({
				answers: { eligibility: { type: "choice", choice: eligibility } },
			}),
		),
	);
	fetchMock.mockResolvedValueOnce(
		new Response(
			JSON.stringify({ answers: { category: { type: "choice", choice } } }),
		),
	);
}
beforeEach(() => {
	vi.resetAllMocks();
	vi.stubEnv("TYPESAFE_API_KEY", "test-key");
	vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
});

describe("JEV transaction categorization", () => {
	it("selects only a provided category and never calls the LLM on a match", async () => {
		answer("category_0");
		expect(
			await categorizeTransaction(
				transaction,
				categories,
				"Gym belongs to Food",
			),
		).toEqual({
			categoryId: "food-id",
			categoryName: "Food",
			newCategory: null,
		});
		expect(generate).not.toHaveBeenCalled();
		expect(fetchMock).toHaveBeenCalledTimes(2);
		const [url, request] = fetchMock.mock.calls[1];
		expect(url).toBe("https://api.typesafe.ai/v1/systemone");
		const body = JSON.parse(request.body);
		expect(body.state).toEqual(transaction);
		expect(body.questions.category.criteria).toEqual({
			category_0: "Food",
			uncategorized: expect.any(String),
		});
		expect(body.questions.category.instructions.userMappingRules).toBe(
			"Gym belongs to Food",
		);
	});
	it("calls the configured LLM to propose a missing category only after uncategorized", async () => {
		answer("uncategorized");
		generate.mockResolvedValue({
			output: { category: { name: "Fitness", icon: "🏋️" } },
		});
		expect(await categorizeTransaction(transaction, categories)).toEqual({
			categoryId: null,
			categoryName: "Fitness",
			newCategory: { name: "Fitness", icon: "🏋️" },
		});
		expect(generate).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
	it("skips classification and the LLM when remarks are ineligible and forwards mapping rules", async () => {
		answer("uncategorized", "ineligible");
		const timing = vi.fn();
		expect(
			await categorizeTransaction(
				{ ...transaction, remarks: "REF 12345" },
				categories,
				"Gym fees → Fitness",
				timing,
			),
		).toEqual({ categoryId: null, categoryName: null, newCategory: null });
		expect(generate).not.toHaveBeenCalled();
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const body = JSON.parse(fetchMock.mock.calls[0][1].body);
		expect(body.state).toEqual({ remarks: "REF 12345" });
		expect(body.questions.eligibility.instructions.userMappingRules).toBe(
			"Gym fees → Fitness",
		);
		expect(timing.mock.calls.map(([entry]) => entry.step)).toEqual([
			"jev_remarks_eligibility",
		]);
	});
	it.each([null, "", "   "])(
		"skips all APIs for empty remarks: %s",
		async (remarks) => {
			answer("uncategorized");
			expect(
				(await categorizeTransaction({ ...transaction, remarks }, categories))
					.newCategory,
			).toBeNull();
			expect(fetchMock).not.toHaveBeenCalled();
			expect(generate).not.toHaveBeenCalled();
		},
	);
	it("rejects invalid eligibility responses without calling the LLM", async () => {
		answer("uncategorized", "maybe");
		await expect(
			categorizeTransaction(transaction, categories),
		).rejects.toThrow();
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(generate).not.toHaveBeenCalled();
	});
	it("does not call the LLM if eligibility fails", async () => {
		fetchMock.mockResolvedValueOnce(
			new Response("unavailable", { status: 503 }),
		);
		await expect(
			categorizeTransaction(transaction, categories),
		).rejects.toThrow("remarks eligibility failed");
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(generate).not.toHaveBeenCalled();
	});
	it("supports users without categories and does not persist the sentinel", async () => {
		answer("uncategorized");
		generate.mockResolvedValue({ output: { category: null } });
		expect(await categorizeTransaction(transaction, [])).toEqual({
			categoryId: null,
			categoryName: null,
			newCategory: null,
		});
	});
	it("reuses normalized duplicate names", async () => {
		answer("uncategorized");
		generate.mockResolvedValue({
			output: { category: { name: " FOOD ", icon: "🍲" } },
		});
		expect(
			(await categorizeTransaction(transaction, categories)).categoryId,
		).toBe("food-id");
	});
	it.each(["Other", "Others", "Uncategorized"])(
		"rejects catch-all proposal %s",
		async (name) => {
			answer("uncategorized");
			generate.mockResolvedValue({
				output: { category: { name, icon: "📁" } },
			});
			expect(
				(await categorizeTransaction(transaction, categories)).newCategory,
			).toBeNull();
		},
	);
	it("excludes a database Uncategorized category from real choices", async () => {
		answer("category_0");
		await categorizeTransaction(transaction, [
			...categories,
			{ id: "uncat-id", name: " Uncategorized ", icon: null },
		]);
		expect(
			Object.keys(
				JSON.parse(fetchMock.mock.calls[1][1].body).questions.category.criteria,
			),
		).toEqual(["category_0", "uncategorized"]);
	});
	it.each(["unknown-id", "Food"])(
		"rejects unknown answer %s without invoking the LLM",
		async (choice) => {
			answer(choice);
			await expect(
				categorizeTransaction(transaction, categories),
			).rejects.toThrow("unknown category");
			expect(generate).not.toHaveBeenCalled();
		},
	);
	it("does not interpret API failures as uncategorized", async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					answers: { eligibility: { type: "choice", choice: "eligible" } },
				}),
			),
		);
		fetchMock.mockResolvedValue(new Response("unavailable", { status: 503 }));
		await expect(
			categorizeTransaction(transaction, categories),
		).rejects.toThrow("HTTP 503");
		expect(generate).not.toHaveBeenCalled();
	});
	it("requires the server API key", async () => {
		vi.stubEnv("TYPESAFE_API_KEY", "");
		await expect(
			categorizeTransaction(transaction, categories),
		).rejects.toThrow("TYPESAFE_API_KEY");
		expect(fetchMock).not.toHaveBeenCalled();
		expect(generate).not.toHaveBeenCalled();
	});
});
