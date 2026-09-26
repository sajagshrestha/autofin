import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { queryClient } from "@/lib/query-client";
import { SESSION_QUERY_KEY } from "@/lib/session-query";
import { getSupabase } from "@/lib/supabase-browser";

interface AuthContextType {
	user: User | null;
	session: Session | null;
	loading: boolean;
	signInWithGoogle: () => Promise<{ error: Error | null }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Client-side auth state.
 *
 * Password sign-in uses the server API. The browser SDK mirrors the cookie
 * session for UI display, starts Google OAuth, and signs out. Account changes
 * also discard cached session checks and financial data.
 */
export function AuthProvider({
	children,
	enabled = true,
}: {
	children: React.ReactNode;
	enabled?: boolean;
}) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!enabled) {
			setUser(null);
			setSession(null);
			setLoading(false);
			return;
		}
		let active = true;
		let previousUserId: string | null | undefined;
		const updateSession = (
			session: Session | null,
			event?: AuthChangeEvent,
		) => {
			if (!active) return;
			const nextUserId = session?.user.id ?? null;
			if (
				event === "SIGNED_OUT" ||
				(previousUserId !== undefined && previousUserId !== nextUserId)
			) {
				// Never reuse another account's session or financial data.
				queryClient.removeQueries({
					predicate: (query) => query.queryKey[0] !== SESSION_QUERY_KEY[0],
				});
				if (!nextUserId) {
					void queryClient.cancelQueries({ queryKey: SESSION_QUERY_KEY });
					queryClient.setQueryData(SESSION_QUERY_KEY, { user: null });
				} else {
					void queryClient.resetQueries({ queryKey: SESSION_QUERY_KEY });
				}
			}
			previousUserId = nextUserId;
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		};
		const supabase = getSupabase();
		supabase.auth
			.getSession()
			.then(({ data: { session } }: { data: { session: Session | null } }) => {
				updateSession(session);
			});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(event: AuthChangeEvent, session: Session | null) => {
				updateSession(session, event);
			},
		);

		return () => {
			active = false;
			subscription.unsubscribe();
		};
	}, [enabled]);

	const signInWithGoogle = async () => {
		if (!enabled)
			return {
				error: new Error(
					"Sign in from the login page to use your own account.",
				),
			};
		const supabase = getSupabase();
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
		return { error };
	};

	const signOut = async () => {
		if (enabled) await getSupabase().auth.signOut();
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				loading,
				signInWithGoogle,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
