import { afterEach, describe, expect, it, vi } from "vitest";
import {
	createDemoFetch,
	createDemoQueryClient,
	DemoReadOnlyError,
} from "./client";
import { createDemoData } from "./data";

afterEach(() => vi.unstubAllGlobals());

describe("read-only app demo", () => {
	const data = createDemoData(new Date(2026, 8, 20, 12));
	it("filters and paginates sample transactions without making a network request", async () => {
		const network = vi.fn();
		vi.stubGlobal("fetch", network);
		const fetchDemo = createDemoFetch(vi.fn(), data);
		const response = await fetchDemo(
			"/api/transactions?startDate=2026-09-01T00:00:00Z&endDate=2026-09-30T23:59:59Z&type=debit&categoryId=groceries&limit=2&offset=1",
		);
		const result = await response.json();
		expect(result.total).toBe(4);
		expect(result.transactions).toHaveLength(2);
		expect(
			result.transactions.every(
				(t: { categoryId: string; type: string; userId: string }) =>
					t.categoryId === "groceries" &&
					t.type === "debit" &&
					t.userId === "demo",
			),
		).toBe(true);
		expect(network).not.toHaveBeenCalled();
	});

	it("serves detail pages and returns isolated copies of the fixtures", async () => {
		const fetchDemo = createDemoFetch(vi.fn(), data);
		const first = data.transactions[0];
		const detail = await (
			await fetchDemo(`/api/transactions/${first.id}`)
		).json();
		expect(detail.transaction.id).toBe(first.id);
		detail.transaction.amount = "0";
		expect(data.transactions[0].amount).not.toBe("0");
		expect(
			(await (await fetchDemo("/api/categories/groceries")).json()).category
				.name,
		).toBe("Groceries");
		expect(
			(await (await fetchDemo("/api/loans/demo-loan")).json()).settlements,
		).toHaveLength(1);
		expect((await fetchDemo("/api/transactions/not-a-sample-id")).status).toBe(
			404,
		);
	});

	it.each(["POST", "PATCH", "DELETE", "PUT"])(
		"blocks %s, opens signup, and leaves fixtures unchanged",
		async (method) => {
			const network = vi.fn();
			vi.stubGlobal("fetch", network);
			const requestAccess = vi.fn();
			const before = JSON.stringify(data);
			const response = await createDemoFetch(requestAccess, data)(
				"/api/transactions",
				{ method, body: JSON.stringify({ amount: 999 }) },
			);
			expect(response.status).toBe(403);
			expect(requestAccess).toHaveBeenCalledOnce();
			expect(network).not.toHaveBeenCalled();
			expect(JSON.stringify(data)).toBe(before);
		},
	);

	it("does not fall back to real services for unsupported reads", async () => {
		const network = vi.fn();
		vi.stubGlobal("fetch", network);
		expect(
			(await createDemoFetch(vi.fn(), data)("/api/settings/gmail")).status,
		).toBe(404);
		expect(network).not.toHaveBeenCalled();
	});

	it("blocks a mutation before its function or optimistic update can execute", async () => {
		const requestAccess = vi.fn();
		const client = createDemoQueryClient(requestAccess);
		const mutationFn = vi.fn();
		const onMutate = vi.fn();
		const mutation = client
			.getMutationCache()
			.build(client, { mutationFn, onMutate });
		await expect(mutation.execute(undefined)).rejects.toBeInstanceOf(
			DemoReadOnlyError,
		);
		expect(requestAccess).toHaveBeenCalledOnce();
		expect(mutationFn).not.toHaveBeenCalled();
		expect(onMutate).not.toHaveBeenCalled();
		client.clear();
	});
});
