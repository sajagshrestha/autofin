import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { capturePageView, identifyUser, initPostHog } from "@/lib/posthog";

/**
 * Client-only PostHog wiring: initializes the SDK once, records a pageview on
 * every route change, and identifies the signed-in Supabase user.
 *
 * Mount this inside AuthProvider (it reads auth state) but as a sibling of the
 * Outlet so it survives route transitions.
 */
export function PostHogProvider() {
	const location = useLocation();
	const { user } = useAuth();

	useEffect(() => {
		initPostHog();
	}, []);

	useEffect(() => {
		const url = `${location.pathname}${location.search}`;
		capturePageView(url);
	}, [location.pathname, location.search]);

	const userId = user?.id;
	const userEmail = userId ? user?.email : undefined;
	const userName = userId ? user?.user_metadata?.name : undefined;
	useEffect(() => {
		if (userId) {
			identifyUser({ id: userId, email: userEmail, name: userName });
		} else {
			identifyUser(null);
		}
	}, [userId, userEmail, userName]);

	return null;
}
