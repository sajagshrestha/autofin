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
- `TYPESAFE_API_KEY` — JEV category selection for email/SMS transactions
- `TYPESAFE_MODEL` — optional JEV model override (default: `jev-latest`)
- `DISCORD_WEBHOOK_URL` — optional transaction notifications
- `GMAIL_PUBSUB_TOPIC` — Pub/Sub topic for watch (has a default)
- `GMAIL_PUBSUB_VERIFICATION_TOKEN` — optional shared secret for the webhook
- `GMAIL_WATCH_RESYNC_INTERVAL` — watch renewal cadence for the Inngest loop

Email/SMS extraction uses the configured LLM to extract transaction facts, then
JEV checks whether the remarks contain enough evidence to identify a category.
Ineligible or ambiguous remarks go straight to uncategorized, skipping category
selection and the LLM. Blank remarks skip all categorization API calls.
For eligible remarks, [JEV Choice](https://docs.typesafe.ai/primitives/choice)
selects an existing category. Only its internal `uncategorized` result triggers
an LLM category proposal; the existing save flow reuses or creates that category.
Custom mapping rules apply to selection, eligibility, and category proposals.
JEV errors are logged and leave the extracted transaction
intact without invoking category creation. The internal option is never saved as
a category. JEV supports up to 254 existing categories plus the internal option.

## Live extraction integration tests

Run `pnpm test:integration` to exercise the real configured LLM and JEV APIs
using synthetic transaction messages. This suite is separate from `pnpm test`,
which stays offline. It loads `.env.local`, then `.env`, without overriding shell
or CI variables. Set `TYPESAFE_API_KEY` and the key for `AI_PROVIDER` (defaults to
`openai` / `OPENAI_API_KEY`; also supports `anthropic` / `ANTHROPIC_API_KEY` and
`google` / `GOOGLE_GENERATIVE_AI_API_KEY`). Missing keys fail the suite explicitly.

The four cases cover an existing category, a new Fitness category proposal after
JEV returns uncategorized, a promotional message, and an unclear transaction.
Each case prints milliseconds and success/error/skipped status for LLM extraction,
remarks eligibility, JEV classification, LLM category proposal, and total elapsed time. Step timings
include SDK retries and response parsing; total time also includes local work.
Real API calls incur provider usage and require network access. Tests run serially
with no test retries and a 180-second timeout per case. Model or network failures
fail the tests, including errors that the extractor normally catches.

No database writes or Discord messages are made. New-category tests verify the
real LLM proposal, not persistence. Model outputs and timings may vary between runs.

Run `pnpm test:comparison` for a live JEV-versus-LLM categorization benchmark.
It gives both providers identical synthetic transactions, categories, and guidance,
without extraction or category creation. Three fixtures run twice each by default
(12 API calls), alternating provider order. Set `CATEGORIZATION_BENCHMARK_ROUNDS`
to an integer from 1 to 10 to change the sample size. The comparison also runs as
part of `pnpm test:integration`.

Output includes requested and returned model IDs, each category decision and its
correctness, milliseconds per request, and mean/median latency for successful
responses. Network time and cold requests are included; retries are disabled for
both providers. Errors fail the test and are excluded from latency aggregates.
This small live sample is diagnostic, not a performance guarantee; tests assert
correctness rather than requiring either provider to be faster.

## MCP server

The advisor tools are also exposed as a **stateless MCP server** at
`POST /api/mcp` (Streamable-HTTP flavor: `initialize`, `tools/list`,
`tools/call`; notifications answered with 202).

Auth is a per-user deterministic bearer token (`Settings → Connect AI
assistants` shows the URL, token, and a ready-to-paste client config).
Rotating `MCP_TOKEN_SECRET` revokes every token. The four tools mirror the
in-app chat: `getSpendingSummary`, `getSpendingByCategory`,
`getMonthlyTrend`, `listTransactions`.

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
