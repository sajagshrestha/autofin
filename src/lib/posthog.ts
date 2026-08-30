import posthog from "posthog-js";
import { env } from "@/env";

let initialized = false;

/**
 * Initializes PostHog in the browser. Safe to call multiple times (no-op after
 * the first call). Never touches `window` on the server, so it is SSR-safe.
 */
export function initPostHog() {
	if (initialized || typeof window === "undefined") return;
	if (!env.VITE_POSTHOG_KEY) return;

	posthog.init(env.VITE_POSTHOG_KEY, {
		api_host: env.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com",
		capture_pageview: false,
		capture_pageleave: true,
		person_profiles: "identified_only",
		autocapture: false,
	});
	initialized = true;
}

export function getPostHog() {
	if (typeof window === "undefined" || !env.VITE_POSTHOG_KEY) return null;
	initPostHog();
	return posthog;
}

/**
 * Captures a pageview for the current route. Call from router change handlers
 * so SPA navigations are recorded (pageview autocapture is disabled).
 */
export function capturePageView(route: string) {
	getPostHog()?.capture("$pageview", { current_url: route });
}

/**
 * Associates the current browser session with a user. Pass `null` to reset
 * (e.g. on sign-out).
 */
export function identifyUser(
	user: { id: string; email?: string | null; name?: string | null } | null,
) {
	if (!user) {
		getPostHog()?.reset();
		return;
	}
	getPostHog()?.identify(user.id, {
		email: user.email ?? undefined,
		name: user.name ?? undefined,
	});
}
