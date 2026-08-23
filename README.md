# AutoFin — TanStack Start

Unified full-stack rewrite of the previous `autofin-fe` (Vite SPA) and
`autfin-BE` (Hono on Bun) repositories as a single
[TanStack Start](https://tanstack.com/start) application.

Personal finance tracking: connect Gmail, automatically import bank-transaction
emails via Pub/Sub push + AI extraction, categorize spending, visualize trends,
and generate AI insights.

## Stack

| Layer      | Tech                                                                                  |
| ---------- | ------------------------------------------------------------------------------------- |
| Framework  | TanStack Start (SSR) + TanStack Router / Query / Form / Table                          |
| API        | **Hono** mounted inside Start via one catch-all server route, consumed with **typed RPC clients** (`hc<AppType>`) |
| Charts     | **`@tanstack/charts`** (`defineChart` grammar, React SVG host, polar donut)            |
| UI         | Tailwind CSS v4 + shadcn/ui-style components, Radix primitives, sonner                 |
| Auth       | Supabase Auth with **cookie sessions** (`@supabase/ssr`) shared client ↔ server        |
| Database   | PostgreSQL (Supabase) via Drizzle ORM (`postgres-js`)                                  |
| AI         | Vercel AI SDK (Gemini by default; OpenAI/Anthropic supported)                          |
| Background | Inngest (Gmail watch renewal loop), Google Pub/Sub push webhook                        |

## Architecture

```
src/
├── routes/                  # file-based routes (pages AND server endpoints)
│   ├── api/$.ts                     catch-all delegating /api/* to the Hono app
│   ├── _authenticated*              session-guarded layout + app pages
│   └── …                            landing, login, signup, legal pages
├── server/                  # server-only code (never shipped to the client)
│   ├── hono/
│   │   ├── app.ts                   route chain — exports AppType for hc<AppType>
│   │   ├── middleware.ts            requireUser, same-origin CSRF guard, logger
│   │   └── routes/                  auth · transactions · categories · insights · statements · gmail · public-infra
│   ├── auth/                # Hono-bound Supabase cookie client, session resolver
│   ├── functions/session.fns.ts     SSR route-guard check (no HTTP hop)
│   ├── services/            # business logic (gmail, extractors, insights, discord)
│   ├── repositories/        # Drizzle data access
│   ├── inngest/             # background jobs
│   ├── lib/container.ts     # DI container (factory + lazy singleton)
│   └── db/                  # postgres.js pool + Drizzle schema
├── hooks/                   # typed data layer: queries/mutations per domain
├── components/charts/       # TanStack Charts visualizations
├── contexts/                # theme + client auth-state providers
└── lib/, schemas/, env.ts   # shared utils, zod schemas, validated env
```

### How the API works

- The entire HTTP API is a **Hono app** (`src/server/hono/app.ts`) served by a
  single catch-all server route (`src/routes/api/$.ts`).
- The browser imports `AppType` **type-only** and calls endpoints through
  `rpc = hc<AppType>("/")` (`src/lib/api-client.ts`) — fully typed paths,
  params and responses with zero codegen. `unwrap()` normalizes errors into
  thrown `ApiError`s.
- Auth is enforced by a Hono `requireUser` middleware reading the Supabase
  session cookies; mutating requests additionally pass a same-origin guard
  (CSRF). Public routes (health, inngest, Pub/Sub webhook, Gmail OAuth
  callback) are mounted before the protected domain routers.
- One exception remains a TanStack server function:
  `src/server/functions/session.fns.ts` — the `_authenticated` layout guard
  runs during SSR, so it resolves the user straight from request cookies
  instead of making an HTTP call.
- **Cookie-based auth.** Sessions are stored in cookies via `@supabase/ssr`;
  the `_authenticated` layout guard resolves the user **on the server**
  before any protected page or data loads.
- **Gmail OAuth callback is a server route** (`/api/gmail/oauth/callback`).
  Point `GMAIL_OAUTH_REDIRECT_URI` there. The `state` payload is verified
  against the signed-in session and expires after 10 minutes.
- **Charts rewritten** from Recharts to the new TanStack Charts grammar
  (`lineY`, `barX`, stacked-free overlapping `areaY` + polar donut).
- **Leaner payloads.** Transaction responses use an explicit DTO that excludes
  debug-only fields (raw email content, full AI output).
- Dropped: Swagger/OpenAPI surface, unused users CRUD endpoints,
  dead `ProtectedRoute`/`google-callback` page.

## Getting started

```bash
pnpm install
cp .env.example .env          # fill in your values
pnpm db:push                  # or db:migrate against the copied drizzle/ folder
pnpm db:seed                  # idempotent default categories
pnpm dev                      # http://localhost:3000
```

Production build: `pnpm build`, then `pnpm start` (Node) or deploy the Start
output to any Nitro-supported host (Vercel, Netlify, Cloudflare, Docker…).

## Environment variables

Client (exposed to the browser):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase project
- `VITE_APP_TITLE` — optional document title

Server:

- `SUPABASE_URL`, `SUPABASE_ANON_KEY` — used by the cookie session client
- `DATABASE_URL` — Postgres connection (Supabase pooler compatible)
- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`,
  `GMAIL_OAUTH_REDIRECT_URI` — must be `<origin>/api/gmail/oauth/callback`
- `GOOGLE_GENERATIVE_AI_API_KEY` (+ optional `AI_PROVIDER=google|openai|anthropic`)
- `DISCORD_WEBHOOK_URL` — optional transaction notifications
- `GMAIL_PUBSUB_TOPIC` — Pub/Sub topic for watch (has a default)
- `GMAIL_PUBSUB_VERIFICATION_TOKEN` — optional shared secret for the webhook
- `GMAIL_WATCH_RESYNC_INTERVAL` — watch renewal cadence for the Inngest loop

## Gmail pipeline

1. **Settings → Connect**: the app builds a Google authorization URL
   (readonly + modify + settings scopes, offline access) and redirects.
2. Google returns to `/api/gmail/oauth/callback`; tokens are stored per user.
3. **Filters**: sender addresses get a Gmail filter applying the monitor label.
4. **Watch**: a Pub/Sub watch is registered; `/api/webhooks/gmail` receives
   pushes, dedupes by email ID, runs AI extraction, stores transactions, and
   renews its history cursor. An Inngest function keeps the watch renewed.

> NOTE: verify this repo's `.env` points at a live Supabase project — the
> credentials inherited from the old backend may reference a paused/deleted
> instance (DNS will fail in `pnpm db:check`).

## Scripts

| Script            | Purpose                              |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Dev server (SSR + HMR)               |
| `pnpm build`      | Production build + typecheck         |
| `pnpm check`      | Biome lint/format check              |
| `pnpm db:*`       | drizzle-kit generate/migrate/push/studio |
| `pnpm db:seed`    | Seed default categories (idempotent) |
