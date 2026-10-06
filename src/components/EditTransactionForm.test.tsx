// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useUpdateTransaction } from "@/hooks/transactions/mutations";
import { TRANSACTIONS_QUERY_KEYS } from "@/hooks/transactions/queries";
import type { Transaction } from "@/hooks/transactions/types";
import { EditTransactionForm } from "./EditTransactionForm";

const transaction: Transaction = {
	id: "transaction",
	userId: "owner",
	type: "debit",
	amount: "100.00",
	merchant: "Store",
	categoryId: null,
	currency: "NPR",
	accountNumber: null,
	bankName: null,
	transactionDate: null,
	remarks: null,
	notes: null,
	isAiCreated: false,
	createdAt: "2026-10-06T00:00:00.000Z",
	updatedAt: "2026-10-06T00:00:00.000Z",
};
let root: Root;
let host: HTMLDivElement;
const onSubmit = vi.fn();
const onCancel = vi.fn();

beforeEach(() => {
	vi.clearAllMocks();
	vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
	Object.defineProperty(Element.prototype, "scrollIntoView", {
		configurable: true,
		value: vi.fn(),
	});
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
});
afterEach(async () => {
	await act(async () => root.unmount());
	host.remove();
	delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView;
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

const render = (type: Transaction["type"], open = true) =>
	act(async () => {
		root.render(
			<EditTransactionForm
				transaction={{ ...transaction, type }}
				categories={[]}
				open={open}
				onOpenChange={() => {}}
				onSubmit={onSubmit}
				onCancel={onCancel}
				isPending={false}
			/>,
		);
	});
function required<T>(value: T | null | undefined): T {
	if (value == null) throw new Error("Expected element to exist");
	return value;
}
const typeTrigger = () =>
	required(document.querySelector<HTMLButtonElement>("#type"));
const selectType = async (label: string) => {
	await act(async () => {
		typeTrigger().dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
		);
	});
	const option = required(
		[...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
			(item) => item.textContent === label,
		),
	);
	await act(async () => option.click());
};

it.each([
	["debit", "Credit", "credit"],
	["credit", "Debit", "debit"],
] as const)(
	"changes %s to %s and loads the saved type on reopening",
	async (initial, label, saved) => {
		await render(initial);
		expect(typeTrigger().textContent).toContain(
			initial === "debit" ? "Debit" : "Credit",
		);
		expect(document.querySelector('label[for="type"]')?.textContent).toBe(
			"Type",
		);
		await selectType(label);
		await act(async () => {
			required(document.querySelector("form")).dispatchEvent(
				new Event("submit", { bubbles: true, cancelable: true }),
			);
		});
		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({ type: saved, merchant: "Store" }),
		);
		expect(onSubmit.mock.calls[0][0]).not.toHaveProperty("amount");
		await render(saved, false);
		await render(saved);
		expect(typeTrigger().textContent).toContain(label);
	},
);

it("discards a canceled type change when reopened", async () => {
	await render("debit");
	await selectType("Credit");
	await act(async () => {
		required(
			[...document.querySelectorAll("button")].find(
				(button) => button.textContent === "Cancel",
			),
		).click();
	});
	expect(onCancel).toHaveBeenCalledOnce();
	expect(onSubmit).not.toHaveBeenCalled();
	await render("debit", false);
	await render("debit");
	expect(typeTrigger().textContent).toContain("Debit");
});

it("invalidates filtered lists, detail, summary, and budgets after saving type", async () => {
	const client = new QueryClient({
		defaultOptions: { mutations: { retry: false } },
	});
	const keys = [
		TRANSACTIONS_QUERY_KEYS.list({ type: "debit" }),
		TRANSACTIONS_QUERY_KEYS.list({ type: "credit" }),
		TRANSACTIONS_QUERY_KEYS.detail(transaction.id),
		TRANSACTIONS_QUERY_KEYS.summary(),
		["budgets"],
	];
	for (const key of keys) client.setQueryData(key, { existing: true });
	const fetchMock = vi.fn(async () =>
		Response.json({ transaction: { ...transaction, type: "credit" } }),
	);
	vi.stubGlobal("fetch", fetchMock);
	let save: (() => Promise<unknown>) | undefined;
	function Harness() {
		const mutation = useUpdateTransaction();
		save = () => mutation.mutateAsync({ id: transaction.id, type: "credit" });
		return null;
	}
	await act(async () => {
		root.render(
			<QueryClientProvider client={client}>
				<Harness />
			</QueryClientProvider>,
		);
	});
	await act(async () => {
		await required(save)();
	});
	expect(fetchMock).toHaveBeenCalledOnce();
	for (const key of keys)
		expect(client.getQueryState(key)?.isInvalidated).toBe(true);
	client.clear();
});
