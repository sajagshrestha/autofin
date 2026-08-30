/**
 * AutoFin service worker.
 *
 * Strategy (safe for an authenticated app on Vercel):
 *  - Navigations: network-first, falling back to the last-good page when
 *    offline. This keeps the app shell usable but never serves stale auth
 *    state as fresh.
 *  - Hashed static assets (/assets/*): stale-while-revalidate for instant
 *    repeat loads.
 *  - Everything else (API routes, auth callback, cross-origin): network-only.
 */
const CACHE_NAME = "autofin-v1";

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME)
						.map((key) => caches.delete(key)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("push", (event) => {
	let payload = {
		title: "AutoFin",
		body: "You have a new notification.",
		url: "/",
	};
	try {
		const data = event.data?.json();
		if (data) {
			payload = {
				title: data.title ?? payload.title,
				body: data.body ?? payload.body,
				url: data.url ?? payload.url,
			};
		}
	} catch {
		// Fall back to the default payload if the message isn't JSON.
	}

	event.waitUntil(
		self.registration.showNotification(payload.title, {
			body: payload.body,
			icon: "/logo192.png",
			// Android renders the status-bar icon as a monochrome silhouette using
			// only the alpha channel — a full-bleed color logo shows as a solid
			// white block. icon-badge.png is the mini-logo wordmark (white glyph
			// on transparent) so the status-bar icon echoes the app icon.
			badge: "/icon-badge.png",
			data: { url: payload.url },
		}),
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const target = new URL(
		event.notification.data?.url ?? "/",
		self.location.origin,
	);

	event.waitUntil(
		self.clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clients) => {
				for (const client of clients) {
					if (new URL(client.url).pathname === target.pathname) {
						return client.focus();
					}
				}
				return self.clients.openWindow(target);
			}),
	);
});

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	// App shell navigations: network-first with cache fallback.
	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response.ok) {
						const copy = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					}
					return response;
				})
				.catch(() =>
					caches
						.match(request)
						.then((cached) => cached ?? caches.match("/")),
				),
		);
		return;
	}

	// Hashed build assets: stale-while-revalidate.
	if (url.pathname.startsWith("/assets/")) {
		event.respondWith(
			caches.match(request).then((cached) => {
				const network = fetch(request)
					.then((response) => {
						if (response.ok) {
							const copy = response.clone();
							caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
						}
						return response;
					})
					.catch(() => cached);
				return cached ?? network;
			}),
		);
		return;
	}

	// Default: network-only.
	return;
});
