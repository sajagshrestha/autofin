// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, Component, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TransactionsPage } from "@/routes/_authenticated/transactions";

const probe = vi.hoisted(() => ({ renders: 0 }));
vi.mock("@tanstack/react-router", () => {
	const navigate = vi.fn();
	return {
		createFileRoute: () => () => ({
			useSearch: () => ({ period: "all", type: "all", category: "all" }),
			useNavigate: () => navigate,
		}),
		useNavigate: () => navigate,
		Link: ({ children }: { children: ReactNode }) => <span>{children}</span>,
		Outlet: () => null,
	};
});

vi.mock("@/components/ui/data-table", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/components/ui/data-table")>();
	return {
		DataTable: (props: Parameters<typeof actual.DataTable>[0]) => {
			// Stop a regression before its microtask loop hangs the test worker.
			if (++probe.renders > 25) throw new Error("Table render loop");
			return <actual.DataTable {...props} />;
		},
	};
});

class Boundary extends Component<{ children: ReactNode }, { error: boolean }> {
	state = { error: false };
	static getDerivedStateFromError() {
		return { error: true };
	}
	render() {
		return this.state.error ? <p>Page crashed</p> : this.props.children;
	}
}

let root: Root;
let host: HTMLDivElement;
let client: QueryClient;
let transactionSignal: AbortSignal | undefined;
let finishTransactions: (response: Response) => void;
let mobile = false;

beforeEach(() => {
	vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
	vi.stubGlobal("matchMedia", () => ({
		matches: mobile,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	}));
	probe.renders = 0;
	transactionSignal = undefined;
	client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
	vi.stubGlobal(
		"fetch",
		vi.fn((url: string, init?: RequestInit) => {
			if (url.includes("/api/transactions")) {
				transactionSignal = init?.signal ?? undefined;
				return new Promise<Response>((resolve) => {
					finishTransactions = resolve;
				});
			}
			return Promise.resolve(Response.json({ categories: [], loans: [] }));
		}),
	);
});

afterEach(async () => {
	await act(async () => root.unmount());
	client.clear();
	host.remove();
	vi.unstubAllGlobals();
});

it.each([false, true])(
	"can leave pending transactions with a late response (mobile: %s)",
	async (isMobile) => {
		mobile = isMobile;
		const render = (children: ReactNode) =>
			act(async () => {
				root.render(
					<QueryClientProvider client={client}>
						<Boundary>{children}</Boundary>
					</QueryClientProvider>,
				);
			});
		await render(<TransactionsPage />);
		// Navigation and background query updates rerender the still-pending page.
		await render(<TransactionsPage />);
		expect(host.textContent).not.toContain("Page crashed");
		expect(probe.renders).toBeLessThan(25);
		expect(transactionSignal?.aborted).toBe(false);
		await render(<h1>Loans</h1>);
		expect(transactionSignal?.aborted).toBe(true);
		await act(async () => {
			finishTransactions(
				Response.json({ transactions: [], total: 0, limit: 500, offset: 0 }),
			);
		});
		expect(host.textContent).toBe("Loans");
	},
);
