import { m as mainExports } from "../_libs/dotenv.mjs";
import { P as Postgres } from "../_libs/postgres.mjs";
import { p as pgTable, t as timestamp, j as jsonb, a as text, b as boolean, n as numeric, d as drizzle, c as pgEnum } from "../_libs/drizzle-orm.mjs";
mainExports.config({ path: ".env" });
const client = Postgres(process.env.DATABASE_URL || "", {
  // Connection pool settings
  max: 10,
  // Maximum connections in pool
  idle_timeout: 60 * 20,
  // Close idle connections after 60 seconds (less than typical DB server timeout)
  max_lifetime: 60 * 20,
  // Recycle connections after 24 hours to prevent staleness
  connect_timeout: 10,
  // Timeout for establishing connection (seconds)
  // Required for Supabase transaction pooler (pgbouncer)
  prepare: false,
  // Disable prepared statements for pgbouncer compatibility
  // Connection options
  connection: {
    application_name: "autofin"
  },
  // Handle connection errors and retry
  onnotice: () => {
  },
  // Suppress notices
  transform: {
    undefined: null
    // Transform undefined to null for postgres compatibility
  }
  // Automatically reconnect on connection errors
  // The library handles this automatically, but we ensure it's enabled
});
const db = drizzle({ client });
const users = pgTable("users", {
  // This should match auth.users.id from Supabase Auth
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  timezone: text("timezone").notNull().default("Asia/Kathmandu"),
  // IANA timezone identifier
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
const gmailOAuthTokens = pgTable("gmail_oauth_tokens", {
  id: text("id").primaryKey(),
  // UUID or similar
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailAddress: text("email_address").notNull(),
  // Gmail email address
  accessToken: text("access_token").notNull(),
  // Encrypted access token
  refreshToken: text("refresh_token").notNull(),
  // Encrypted refresh token
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  // Token expiration time
  scope: text("scope").notNull(),
  // OAuth scopes granted
  historyId: text("history_id"),
  // Last processed Gmail history ID for watch notifications
  watchLabelIds: jsonb("watch_label_ids").$type().default([]),
  autofinFilterIds: jsonb("autofin_filter_ids").$type().default([]),
  filterSenderEmails: jsonb("filter_sender_emails").$type().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  // null for predefined categories
  name: text("name").notNull(),
  icon: text("icon"),
  // emoji or icon name
  isDefault: boolean("is_default").default(false).notNull(),
  // predefined vs custom
  isAiCreated: boolean("is_ai_created").default(false).notNull(),
  // true if created by AI, false if created by user
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null"
  }),
  // Core transaction data
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull(),
  // 'debit' | 'credit'
  currency: text("currency").default("NPR"),
  // Extracted metadata
  merchant: text("merchant"),
  accountNumber: text("account_number"),
  // last 4 digits
  bankName: text("bank_name"),
  transactionDate: timestamp("transaction_date", { withTimezone: true }),
  remarks: text("remarks"),
  // Source tracking - emailId is UNIQUE to prevent duplicate processing
  loanId: text("loan_id").references(() => loans.id, {
    onDelete: "set null"
  }),
  emailId: text("email_id").unique(),
  // Gmail message ID (unique constraint)
  rawEmailContent: text("raw_email_content"),
  // for debugging/re-extraction
  // AI metadata
  aiConfidence: numeric("ai_confidence", { precision: 3, scale: 2 }),
  // 0.00-1.00
  aiExtractedData: jsonb("ai_extracted_data"),
  // full AI response for debugging
  isAiCreated: boolean("is_ai_created").default(false).notNull(),
  // true if created by AI from email, false if created manually by user
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
const userPreferences = pgTable("user_preferences", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  /** Free-form instructions the AI applies when mapping transactions to categories */
  categoryMappingPrompt: text("category_mapping_prompt"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
const loanDirectionEnum = pgEnum("loan_direction", ["given", "taken"]);
const loans = pgTable("loans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  direction: loanDirectionEnum("direction").notNull(),
  // given | taken
  counterpartyName: text("counterparty_name").notNull(),
  principalAmount: numeric("principal_amount", {
    precision: 12,
    scale: 2
  }).notNull(),
  currency: text("currency").default("NPR"),
  issuedDate: timestamp("issued_date", { withTimezone: true }).defaultNow().notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }),
  notes: text("notes"),
  transactionId: text("transaction_id").references(() => transactions.id, {
    onDelete: "set null"
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
function parseCookieHeader(header) {
  if (!header) return {};
  const out = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    let value = part.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (name) out[name] = decodeURIComponent(value);
  }
  return out;
}
async function getSessionUserFromCookieHeader(cookieHeader) {
  try {
    const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;
    const { createServerClient } = await import("./index-CH6UTATS.mjs");
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return Object.entries(parseCookieHeader(cookieHeader)).map(
            ([name, value]) => ({ name, value })
          );
        },
        setAll() {
        }
      }
    });
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return null;
    return { id: user.id, email: user.email ?? "" };
  } catch {
    return null;
  }
}
async function ensureAppUser(user) {
  await db.insert(users).values({
    id: user.id,
    email: user.email,
    timezone: "Asia/Kathmandu"
  }).onConflictDoNothing({ target: users.id });
}
export {
  gmailOAuthTokens as a,
  userPreferences as b,
  categories as c,
  db as d,
  ensureAppUser as e,
  getSessionUserFromCookieHeader as g,
  loans as l,
  transactions as t,
  users as u
};
