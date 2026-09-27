import { afterEach, describe, expect, it, vi } from "vitest";
import type { BudgetRow } from "@/lib/budgets";
import type { Database } from "@/server/db/connection";
import { BudgetService } from "./budget.service";

vi.mock("ai", () => ({ generateText: vi.fn(), Output: { object: vi.fn() } }));
vi.mock("@/server/lib/ai", () => ({ getAIModel: vi.fn() }));
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
			output: { proposals },
		} as unknown as Awaited<ReturnType<typeof generateText>>);
		const db = {
			select: () => ({
				from: () => ({ where: async () => [{ date: "2026-01-15T00:00:00Z" }] }),
			}),
			execute: vi
				.fn()
				.mockResolvedValue([
					{ categoryId: "food", name: "Food", average: "120" },
				]),
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
	it("returns editable proposals without writing budgets or sending pushes", async () => {
		const { service, db, generateText } = await setup([
			{ categoryId: "food", amount: 100, explanation: "Reduce dining out" },
		]);
		const result = await service.suggest("alice", 100);
		expect(result).toEqual({
			months: 3,
			proposals: [
				{
					categoryId: "food",
					name: "Food",
					average: 120,
					amount: 100,
					explanation: "Reduce dining out",
				},
			],
		});
		expect(db.insert).not.toHaveBeenCalled();
		expect(generateText).toHaveBeenLastCalledWith(
			expect.objectContaining({
				prompt: expect.stringContaining('"totalTarget":100'),
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
			{ categoryId: "food", amount: 120, explanation: "Too high" },
		]);
		await expect(next.service.suggest("alice", 100)).rejects.toThrow(
			"did not meet the target",
		);
	});
});
