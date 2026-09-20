// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

const auth = vi.hoisted(() => ({
	getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
	unsubscribe: vi.fn(),
	signOut: vi.fn(),
	signInWithOAuth: vi.fn(),
	onAuthStateChange: vi.fn(),
	getClient: vi.fn(),
}));
vi.mock("@/lib/supabase-browser", () => ({ getSupabase: auth.getClient }));

beforeEach(() => vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true));
afterEach(() => {
	vi.clearAllMocks();
	vi.unstubAllGlobals();
});

describe("demo session isolation", () => {
	it("does not initialize auth or invoke session mutations while disabled", async () => {
		let context: ReturnType<typeof useAuth> | undefined;
		function Probe() {
			context = useAuth();
			return null;
		}
		const element = document.createElement("div");
		const root = createRoot(element);
		await act(async () => {
			root.render(
				<AuthProvider enabled={false}>
					<Probe />
				</AuthProvider>,
			);
		});
		expect(context?.loading).toBe(false);
		expect(context?.user).toBeNull();
		await context?.signOut();
		expect((await context?.signInWithGoogle())?.error).toBeInstanceOf(Error);
		expect(auth.getClient).not.toHaveBeenCalled();
		await act(async () => root.unmount());
	});

	it("still initializes the normal app session and cleans up its subscription", async () => {
		auth.onAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: auth.unsubscribe } },
		});
		auth.getClient.mockReturnValue({ auth });
		const element = document.createElement("div");
		const root = createRoot(element);
		await act(async () => {
			root.render(
				<AuthProvider>
					<span>App</span>
				</AuthProvider>,
			);
		});
		expect(auth.getSession).toHaveBeenCalledOnce();
		expect(auth.onAuthStateChange).toHaveBeenCalledOnce();
		await act(async () => root.unmount());
		expect(auth.unsubscribe).toHaveBeenCalledOnce();
	});
});
