import { MutationCache, QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { AppType } from "@/server/hono/app";
import { createDemoData, type DemoData } from "./data";

export class DemoReadOnlyError extends Error {
	constructor() {
		super("Create an account to make changes. The demo is read-only.");
	}
}

export function createDemoFetch(
	requestAccess: () => void,
	data: DemoData = createDemoData(),
): typeof fetch {
	return async (input, init) => {
		const url = new URL(
			input instanceof Request ? input.url : String(input),
			"https://demo.autofin.invalid",
		);
		const method = (
			init?.method ?? (input instanceof Request ? input.method : "GET")
		).toUpperCase();
		if (method !== "GET") {
			requestAccess();
			return Response.json(
				{ error: new DemoReadOnlyError().message },
				{ status: 403 },
			);
		}
		const params = url.searchParams;
		const filtered = data.transactions.filter((t) => {
			const date = Date.parse(t.transactionDate ?? "");
			return (
				(!params.get("startDate") ||
					date >= Date.parse(params.get("startDate") ?? "")) &&
				(!params.get("endDate") ||
					date <= Date.parse(params.get("endDate") ?? "")) &&
				(!params.get("type") || t.type === params.get("type")) &&
				(!params.get("categoryId") ||
					t.categoryId === params.get("categoryId")) &&
				(!params.get("minAmount") ||
					Number(t.amount) >= Number(params.get("minAmount"))) &&
				(!params.get("maxAmount") ||
					Number(t.amount) <= Number(params.get("maxAmount")))
			);
		});
		const path = url.pathname.replace(/\/$/, "");
		if (path === "/api/transactions") {
			const limit = Math.max(
				1,
				Math.min(500, Number(params.get("limit")) || 500),
			);
			const offset = Math.max(0, Number(params.get("offset")) || 0);
			return Response.json({
				transactions: filtered.slice(offset, offset + limit),
				total: filtered.length,
				limit,
				offset,
			});
		}
		if (path === "/api/transactions/summary") {
			const totalDebit = filtered
				.filter((t) => t.type === "debit")
				.reduce((n, t) => n + Number(t.amount), 0);
			const totalCredit = filtered
				.filter((t) => t.type === "credit")
				.reduce((n, t) => n + Number(t.amount), 0);
			return Response.json({
				summary: {
					totalDebit,
					totalCredit,
					transactionCount: filtered.length,
					netAmount: totalCredit - totalDebit,
				},
			});
		}
		if (path === "/api/categories")
			return Response.json({ categories: data.categories });
		if (path === "/api/sources")
			return Response.json({
				sources: [],
			});
		if (path === "/api/loans") return Response.json({ loans: data.loans });
		if (path === "/api/counterparties") {
			const seen = new Map<string, string>();
			for (const loan of data.loans) {
				if (!seen.has(loan.counterparty.id))
					seen.set(loan.counterparty.id, loan.counterparty.name);
			}
			return Response.json({
				counterparties: [...seen].map(([id, name]) => ({
					id,
					name,
					notes: null,
					totalLoans: data.loans.filter((l) => l.counterparty.id === id).length,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				})),
			});
		}
		const id = decodeURIComponent(path.split("/").pop() ?? "");
		if (path.startsWith("/api/transactions/")) {
			const transaction = data.transactions.find((t) => t.id === id);
			if (transaction) return Response.json({ transaction });
		}
		if (path.startsWith("/api/categories/")) {
			const category = data.categories.find((c) => c.id === id);
			if (category) return Response.json({ category });
		}
		if (path.startsWith("/api/loans/")) {
			const loan = data.loans.find((l) => l.id === id);
			if (loan)
				return Response.json({
					loan,
					settlements: [
						{
							id: "demo-repayment",
							amount: "4000",
							type: "credit",
							currency: "NPR",
							transactionDate: loan.issuedDate,
							merchant: "Alex",
							remarks: "Trip repayment",
							category: null,
							createdAt: loan.createdAt,
						},
					],
				});
		}
		// No fallback to fetch: even a new, unsupported screen cannot read real data.
		return Response.json(
			{ error: "This record is not part of the demo." },
			{ status: 404 },
		);
	};
}

export function createDemoClient(requestAccess: () => void) {
	return hc<AppType>("https://demo.autofin.invalid", {
		fetch: createDemoFetch(requestAccess),
	});
}

export function createDemoQueryClient(requestAccess: () => void) {
	return new QueryClient({
		defaultOptions: {
			queries: { staleTime: Infinity, retry: false },
			mutations: { retry: false },
		},
		mutationCache: new MutationCache({
			onMutate: () => {
				requestAccess();
				// Runs before per-mutation optimistic updates and before the mutationFn.
				throw new DemoReadOnlyError();
			},
		}),
	});
}
