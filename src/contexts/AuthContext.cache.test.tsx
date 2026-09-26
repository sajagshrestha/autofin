// @vitest-environment jsdom
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { queryClient } from "@/lib/query-client";
import { SESSION_QUERY_KEY } from "@/lib/session-query";
import { AuthProvider, useAuth } from "./AuthContext";

const auth = vi.hoisted(() => ({
	getSession: vi.fn(),
	onAuthStateChange: vi.fn(),
}));
vi.mock("@/lib/supabase-browser", () => ({ getSupabase: () => ({ auth }) }));
vi.mock("@/server/functions/session.fns", () => ({
	getSessionUserFn: vi.fn(),
}));

function Probe() {
	return <span>{useAuth().user?.id ?? "signed-out"}</span>;
}

it("retains same-account data but clears it on account change and sign-out", async () => {
	vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
	const session = { user: { id: "one" } } as Session;
	let onChange!: (event: AuthChangeEvent, session: Session | null) => void;
	auth.getSession.mockResolvedValue({ data: { session } });
	auth.onAuthStateChange.mockImplementation((callback) => {
		onChange = callback;
		return { data: { subscription: { unsubscribe: vi.fn() } } };
	});
	const host = document.createElement("div");
	const root = createRoot(host);
	try {
		await act(async () =>
			root.render(
				<AuthProvider>
					<Probe />
				</AuthProvider>,
			),
		);
		queryClient.setQueryData(["transactions"], ["one's data"]);
		await act(async () => onChange("TOKEN_REFRESHED", session));
		expect(queryClient.getQueryData(["transactions"])).toEqual(["one's data"]);
		await act(async () =>
			onChange("SIGNED_IN", { user: { id: "two" } } as Session),
		);
		expect(host.textContent).toBe("two");
		expect(queryClient.getQueryData(["transactions"])).toBeUndefined();
		queryClient.setQueryData(["transactions"], ["two's data"]);
		await act(async () => onChange("SIGNED_OUT", null));
		expect(host.textContent).toBe("signed-out");
		expect(queryClient.getQueryData(["transactions"])).toBeUndefined();
		expect(queryClient.getQueryData(SESSION_QUERY_KEY)).toEqual({ user: null });
	} finally {
		await act(async () => root.unmount());
		queryClient.clear();
		vi.unstubAllGlobals();
	}
});
