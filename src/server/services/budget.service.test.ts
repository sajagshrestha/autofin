import { PgDialect } from "drizzle-orm/pg-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BudgetRow } from "@/lib/budgets";
import type { Database } from "@/server/db/connection";
import { BudgetService } from "./budget.service";

vi.mock("ai", () => ({ generateText: vi.fn(), Output: { object: vi.fn() } }));
vi.mock("@/server/lib/ai", () => ({ getBudgetSuggestionModel: vi.fn() }));
const budget: BudgetRow = {
	categoryId: "food",
	name: "Food",
	amount: 100,
	spent: 110,
	notifications: true,
	thresholds: [80, 100],
	stopping: false,
};
afterEach(() => vi.useRealTimers());
describe("budget alert delivery", () => {
	function setup(rows = [budget]) {
		const sent = new Set<string>();
		const insert = vi.fn(() => ({
			values: (
				values: {
					userId: string;
					categoryId: string;
					month: string;
					threshold: string;
				}[],
			) => ({
				onConflictDoNothing: () => ({
					returning: async () =>
						values.filter((v) => {
							const key = JSON.stringify([
								v.userId,
								v.categoryId,
								v.month,
								v.threshold,
							]);
							if (sent.has(key)) return false;
							sent.add(key);
							return true;
						}),
				}),
			}),
		}));
		const push = { sendToUser: vi.fn().mockResolvedValue(undefined) };
		const service = new BudgetService({ insert } as unknown as Database, push);
		vi.spyOn(service, "list").mockResolvedValue({
			firstMonth: "2026-01",
			budgets: rows,
		});
		return { service, push, insert };
	}
	it("combines thresholds, deduplicates concurrent checks and isolates users", async () => {
		const { service, push } = setup();
		await Promise.all([
			service.checkAlerts("alice"),
			service.checkAlerts("alice"),
		]);
		expect(push.sendToUser).toHaveBeenCalledTimes(1);
		expect(push.sendToUser).toHaveBeenCalledWith(
			"alice",
			expect.objectContaining({
				body: expect.stringContaining("80%, 100%"),
				url: "/budgets",
			}),
		);
		await service.checkAlerts("bob");
		expect(push.sendToUser).toHaveBeenCalledTimes(2);
	});
	it("does not claim alerts for disabled categories or below-threshold spending", async () => {
		const { service, push, insert } = setup([
			{ ...budget, notifications: false },
			{ ...budget, categoryId: "other", spent: 1 },
		]);
		await service.checkAlerts("alice");
		expect(push.sendToUser).not.toHaveBeenCalled();
		expect(insert).not.toHaveBeenCalled();
	});
	it("allows thresholds again in a new Nepal calendar month", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-09-30T18:14:00Z"));
		const { service, push } = setup();
		await service.checkAlerts("alice");
		vi.setSystemTime(new Date("2026-09-30T18:15:00Z"));
		await service.checkAlerts("alice");
		expect(push.sendToUser).toHaveBeenCalledTimes(2);
	});
});
describe("AI budget eligibility", () => {
	it("rejects partial-month history before invoking AI or writing anything", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-09-27T00:00:00Z"));
		const db = {
			select: () => ({
				from: () => ({ where: async () => [{ date: "2026-08-15T00:00:00Z" }] }),
			}),
			insert: vi.fn(),
		};
		const service = new BudgetService(db as unknown as Database, {
			sendToUser: vi.fn(),
		});
		await expect(service.suggest("alice")).rejects.toThrow(
			"At least one full calendar month",
		);
		const { generateText } = await import("ai");
		expect(generateText).not.toHaveBeenCalled();
		expect(db.insert).not.toHaveBeenCalled();
	});
});

describe("AI proposal review boundary", () => {
	async function setup(
		proposals: { categoryId: string; amount: number; explanation: string }[],
	) {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-09-27T00:00:00Z"));
		const { generateText } = await import("ai");
		vi.mocked(generateText).mockResolvedValue({
			output: { proposals: proposals.map((p) => ({ ...p, bucket: "needs" })) },
		} as unknown as Awaited<ReturnType<typeof generateText>>);
		const db = {
			select: () => ({
				from: () => ({ where: async () => [{ date: "2026-01-15T00:00:00Z" }] }),
			}),
			execute: vi
				.fn()
				.mockResolvedValueOnce([
					{ categoryId: "food", name: "Food", average: "120" },
				])
				.mockResolvedValue([{ income: "250" }]),
			insert: vi.fn(),
		};
		const service = new BudgetService(db as unknown as Database, {
			sendToUser: vi.fn(),
		});
		vi.spyOn(service, "list").mockResolvedValue({
			firstMonth: "2026-01",
			budgets: [budget],
		});
		return { service, db, generateText };
	}
	it.each([
		["TimeoutError", 504, "took too long"],
		["AbortError", 504, "took too long"],
		["AI_NoObjectGeneratedError", 502, "could not generate valid"],
		["AI_APICallError", 502, "could not generate valid"],
	])(
		"returns a safe actionable response for %s",
		async (name, status, message) => {
			const { service, generateText } = await setup([]);
			const failure = new Error("sensitive provider payload");
			failure.name = name;
			vi.mocked(generateText).mockRejectedValueOnce(failure);
			const log = vi.spyOn(console, "error").mockImplementation(() => {});
			try {
				await expect(service.suggest("alice")).rejects.toMatchObject({
					status,
					message: expect.stringContaining(message),
				});
				expect(log).toHaveBeenCalledWith(
					"Budget suggestion generation failed",
					{ name },
				);
			} finally {
				log.mockRestore();
			}
		},
	);
	it("reevaluates only selected categories without changing income or restoring excluded rent", async () => {
		const { service, db, generateText } = await setup([
			{ categoryId: "food", amount: 150, explanation: "Reallocated" },
		]);
		db.execute
			.mockReset()
			.mockResolvedValueOnce([
				{ categoryId: "food", name: "Food", average: "120" },
				{
					categoryId: "rent",
					name: "Rent",
					average: "500",
					latestMonthly: "500",
				},
			])
			.mockResolvedValueOnce([{ income: "250" }]);
		const result = await service.suggest("alice", 100, ["food"]);
		expect(result.proposals.map((p) => p.categoryId)).toEqual(["food"]);
		expect(result.savingsPlan.spendingAllowance).toBe(150);
		const expenseQuery = new PgDialect().sqlToQuery(
			db.execute.mock.calls[0][0],
		);
		expect(expenseQuery.sql).toContain("c.id IN (");
		expect(expenseQuery.params).toContain("food");
		const incomeQuery = new PgDialect().sqlToQuery(db.execute.mock.calls[1][0]);
		expect(incomeQuery.sql).not.toContain("c.id IN (");
		const prompt = JSON.parse(
			vi.mocked(generateText).mock.calls.at(-1)![0].prompt as string,
		);
		expect(
			prompt.spending.map((p: { categoryId: string }) => p.categoryId),
		).toEqual(["food"]);
		expect(prompt.reevaluation).toContain("Reallocate");
		expect(db.insert).not.toHaveBeenCalled();
	});
	it.each([[[]], [["other-user-category"]], [["food", "food"]]])(
		"rejects invalid reevaluation selection %j",
		async (ids) => {
			const { service, generateText } = await setup([]);
			vi.mocked(generateText).mockClear();
			await expect(
				service.suggest("alice", undefined, ids),
			).rejects.toMatchObject({ status: 400 });
			expect(generateText).not.toHaveBeenCalled();
		},
	);
	it("fits reevaluated flexible allocations to the allowance while preserving fixed rent", async () => {
		const { service, db } = await setup([
			{ categoryId: "rent", amount: 100, explanation: "Fixed" },
			{ categoryId: "food", amount: 200, explanation: "Flexible" },
		]);
		db.execute
			.mockReset()
			.mockResolvedValueOnce([
				{
					categoryId: "rent",
					name: "Rent",
					average: "100",
					latestMonthly: "100",
				},
				{ categoryId: "food", name: "Food", average: "120" },
			])
			.mockResolvedValueOnce([{ income: "250" }]);
		const result = await service.suggest("alice", 100, ["rent", "food"]);
		expect(result.proposals.find((p) => p.categoryId === "rent")?.amount).toBe(
			100,
		);
		expect(result.proposals.find((p) => p.categoryId === "food")?.amount).toBe(
			50,
		);
	});
	it("skips selected categories without eligible history", async () => {
		const { service } = await setup([
			{ categoryId: "food", amount: 100, explanation: "Food" },
		]);
		const result = await service.suggest("alice", 100, ["food", "no-history"]);
		expect(result.proposals.map((p) => p.categoryId)).toEqual(["food"]);
	});
	it("loads category averages using the same six-month analysis window and exclusions", async () => {
		const { service, db } = await setup([]);
		const result = await service.categoryAverages("alice");
		expect(result).toEqual({
			months: 6,
			categories: [{ categoryId: "food", average: 120 }],
		});
		const query = new PgDialect().sqlToQuery(db.execute.mock.calls[0][0]);
		expect(query.sql).toContain("t.loan_id IS NULL");
		expect(query.sql).toContain("ORDER BY average DESC");
		expect(query.params).toContain("alice");
		expect(query.params).toContain("2026-02-28T18:15:00.000Z");
		expect(query.params).toContain("2026-08-31T18:15:00.000Z");
	});
	it("uses the saved category classification instead of the AI classification", async () => {
		const { service, db } = await setup([
			{ categoryId: "food", amount: 50, explanation: "Dining" },
		]);
		db.execute
			.mockReset()
			.mockResolvedValueOnce([
				{ categoryId: "food", name: "Food", average: "120", bucket: "wants" },
			])
			.mockResolvedValueOnce([{ income: "250" }]);
		const result = await service.suggest("alice");
		expect(result.proposals[0].bucket).toBe("wants");
	});
	it("returns the latest recorded month and its total separately from the average", async () => {
		const { service, db } = await setup([
			{ categoryId: "food", amount: 100, explanation: "Average" },
		]);
		db.execute
			.mockReset()
			.mockResolvedValueOnce([
				{
					categoryId: "food",
					name: "Food",
					average: "120",
					latestMonthly: "175.50",
					latestMonth: "2026-08",
				},
			])
			.mockResolvedValueOnce([{ income: "250" }]);
		const result = await service.suggest("alice");
		expect(result.proposals[0]).toMatchObject({
			average: 120,
			amount: 100,
			latestMonthly: 175.5,
			latestMonth: "2026-08",
		});
	});
	it.each([10, 190])(
		"preserves fixed budgets when AI proposes %s",
		async (amount) => {
			const { service } = await setup([
				{ categoryId: "food", amount, explanation: "AI change" },
			]);
			vi.mocked(service.list).mockResolvedValue({
				firstMonth: "2026-01",
				budgets: [{ ...budget, amount: 125, mode: "fixed" }],
			});
			const result = await service.suggest("alice", 100, ["food"]);
			expect(result.proposals[0]).toMatchObject({ amount: 125, mode: "fixed" });
		},
	);
	it("restores a fixed category omitted by AI", async () => {
		const { service } = await setup([]);
		vi.mocked(service.list).mockResolvedValue({
			firstMonth: "2026-01",
			budgets: [{ ...budget, amount: 125, mode: "fixed" }],
		});
		expect(
			(await service.suggest("alice", 100, ["food"])).proposals[0].amount,
		).toBe(125);
	});
	it("rejects goals below fixed amounts without asking AI to cut them", async () => {
		const { service, generateText } = await setup([]);
		vi.mocked(generateText).mockClear();
		vi.mocked(service.list).mockResolvedValue({
			firstMonth: "2026-01",
			budgets: [{ ...budget, amount: 175, mode: "fixed" }],
		});
		await expect(service.suggest("alice", 100, ["food"])).rejects.toMatchObject(
			{ status: 400 },
		);
		expect(generateText).not.toHaveBeenCalled();
	});
	it("returns editable proposals without writing budgets or sending pushes", async () => {
		const { service, db, generateText } = await setup([
			{ categoryId: "food", amount: 100, explanation: "Reduce dining out" },
		]);
		const result = await service.suggest("alice", 100);
		expect(result).toEqual({
			months: 6,
			savingsPlan: {
				averageIncome: 250,
				savingsTarget: 100,
				spendingAllowance: 150,
				needsTarget: 93.75,
				wantsTarget: 56.25,
			},
			proposals: [
				{
					categoryId: "food",
					name: "Food",
					bucket: "needs",
					average: 120,
					amount: 100,
					explanation: "Reduce dining out",
				},
			],
		});
		expect(db.insert).not.toHaveBeenCalled();
		expect(generateText).toHaveBeenLastCalledWith(
			expect.objectContaining({
				prompt: expect.stringContaining('"spendingAllowance":150'),
			}),
		);
	});
	it("rejects invented categories and over-target proposals", async () => {
		const { service } = await setup([
			{
				categoryId: "other-user-category",
				amount: 100,
				explanation: "invalid",
			},
		]);
		await expect(service.suggest("alice")).rejects.toThrow(
			"Invalid AI categories",
		);
		const next = await setup([
			{ categoryId: "food", amount: 160, explanation: "Too high" },
		]);
		await expect(next.service.suggest("alice", 100)).rejects.toThrow(
			"did not meet the target",
		);
	});
	it("rejects savings goals that leave no category allowance", async () => {
		const { service, db, generateText } = await setup([
			{ categoryId: "food", amount: 100, explanation: "test" },
		]);
		vi.mocked(generateText).mockClear();
		await expect(service.suggest("alice", 250)).rejects.toThrow(
			"leaves no room",
		);
		expect(generateText).not.toHaveBeenCalled();
		expect(db.insert).not.toHaveBeenCalled();
	});
	it("supports a zero savings goal", async () => {
		const { service } = await setup([
			{ categoryId: "food", amount: 100, explanation: "test" },
		]);
		expect(
			(await service.suggest("alice", 0)).savingsPlan?.spendingAllowance,
		).toBe(250);
	});
	it("keeps savings optional", async () => {
		const { service, db } = await setup([
			{ categoryId: "food", amount: 100, explanation: "test" },
		]);
		expect((await service.suggest("alice")).savingsPlan).toEqual({
			averageIncome: 250,
			savingsTarget: 50,
			spendingAllowance: 200,
			needsTarget: 125,
			wantsTarget: 75,
		});
		expect(db.execute).toHaveBeenCalledTimes(2);
	});
	it("explains missing income rather than inventing it", async () => {
		const { service, db } = await setup([
			{ categoryId: "food", amount: 100, explanation: "test" },
		]);
		db.execute
			.mockReset()
			.mockResolvedValueOnce([
				{ categoryId: "food", name: "Food", average: "120" },
			])
			.mockResolvedValueOnce([{ income: "0" }] as never);
		await expect(service.suggest("alice", 100)).rejects.toThrow(
			"needs recorded income",
		);
	});
	it("enforces recorded rent even when the AI divides it by three", async () => {
		const { service, db } = await setup([
			{ categoryId: "rent", amount: 8300, explanation: "Three-month average" },
		]);
		db.execute.mockReset().mockResolvedValueOnce([
			{
				categoryId: "rent",
				name: "Rent",
				average: "8333.33",
				latestMonthly: "25000",
				activeMonths: 1,
			},
		]);
		db.execute.mockResolvedValue([{ income: "100000" }]);
		expect((await service.suggest("alice")).proposals[0].amount).toBe(25000);
	});
	it("rejects a savings plan that only fits by reducing fixed rent", async () => {
		const { service, db } = await setup([
			{ categoryId: "rent", amount: 8300, explanation: "Cut rent" },
		]);
		db.execute
			.mockReset()
			.mockResolvedValueOnce([
				{
					categoryId: "rent",
					name: "Rent",
					average: "8333.33",
					latestMonthly: "25000",
					activeMonths: 1,
				},
			])
			.mockResolvedValueOnce([{ income: "30000" }]);
		await expect(service.suggest("alice", 10000)).rejects.toThrow(
			"preserving fixed costs",
		);
	});
	it("enforces the wants allowance rather than only the total spending limit", async () => {
		const { service, generateText } = await setup([
			{ categoryId: "food", amount: 100, explanation: "Dining out" },
		]);
		vi.mocked(generateText).mockResolvedValue({
			output: {
				proposals: [
					{
						categoryId: "food",
						amount: 100,
						bucket: "wants",
						explanation: "Dining out",
					},
				],
			},
		} as unknown as Awaited<ReturnType<typeof generateText>>);
		await expect(service.suggest("alice")).rejects.toThrow(
			"did not meet the target",
		);
	});
});
