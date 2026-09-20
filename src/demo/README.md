# Interactive product demo

`/demo` is a public, client-rendered app inside the homepage iframe. It uses the shared `AppShell` and the real dashboard, transactions, categories, and loans components. A separate memory router preserves the real route IDs without modifying the authenticated route tree or the enclosing page URL.

Each demo instance owns its QueryClient and a Hono client with a local fetch implementation. Reads come only from generated sample fixtures. Unknown reads return 404; there is no network fallback. Transactions span the current month and five preceding months so date filters and charts remain useful over time.

Write entry points are marked `data-demo-action`; the demo catches these events, including portalled menus, and opens the access dialog. All form submissions are gated too. As a second boundary, the demo QueryClient rejects mutations before their function or optimistic update executes. The local API transport also rejects non-GET requests. Production hooks continue using their normal API client by default.

Gmail, import, advisor, and account actions require signup/access. No live AI or Gmail service is called by the demo. The public demo skips session initialization and analytics. The authenticated routes retain their server-side session guard.

When adding demo screens, reuse the shared API-client context and add local read handlers; never introduce a fallback to the production API. Mark new write entry points to show the dialog immediately. Run `pnpm exec vitest run src/demo/client.test.ts` to verify isolation, read filtering, and mutation blocking.
