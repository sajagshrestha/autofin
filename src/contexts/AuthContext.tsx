import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
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
 * Password sign-in/up and sign-out go through server functions (which manage
 * the session cookies); this context only mirrors the session for UI display
 * and starts the Google OAuth redirect, which must happen in the browser.
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
		const supabase = getSupabase();
		supabase.auth
			.getSession()
			.then(({ data: { session } }: { data: { session: Session | null } }) => {
				if (!active) return;
				setSession(session);
				setUser(session?.user ?? null);
				setLoading(false);
			});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(_event: AuthChangeEvent, session: Session | null) => {
				setSession(session);
				setUser(session?.user ?? null);
				setLoading(false);
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
