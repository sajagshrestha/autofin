import { createFileRoute } from "@tanstack/react-router";
import { apiApp } from "@/server/hono/app";

/**
 * Single entry point for the Hono API. Every request under /api/* is
 * delegated to the Hono app, which owns routing, validation, auth and
 * responses. RPC calls from the browser hit this same origin.
 */
export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			GET: ({ request }) => apiApp.fetch(request),
			POST: ({ request }) => apiApp.fetch(request),
			PATCH: ({ request }) => apiApp.fetch(request),
			PUT: ({ request }) => apiApp.fetch(request),
			DELETE: ({ request }) => apiApp.fetch(request),
		},
	},
});
