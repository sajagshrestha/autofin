import { relations } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	jsonb,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * User profile table in public schema
 *
 * This table stores application-specific user data.
 * The `id` field should match `auth.users.id` from Supabase Auth.
 *
 * Note: Supabase Auth manages `auth.users` (authentication data).
 * This table stores your application's user profile data.
 *
 * When a user signs up via Supabase Auth, you should create a corresponding
 * record here with the same `id` as `auth.users.id`.
 *
 * You can automate this with a database trigger:
 * ```sql
 * CREATE OR REPLACE FUNCTION public.handle_new_user()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   INSERT INTO public.users (id, email)
 *   VALUES (NEW.id, NEW.email);
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 *
 * CREATE TRIGGER on_auth_user_created
 *   AFTER INSERT ON auth.users
 *   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
 * ```
 */
export const users = pgTable("users", {
	// This should match auth.users.id from Supabase Auth
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	timezone: text("timezone").notNull().default("Asia/Kathmandu"), // IANA timezone identifier
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * Gmail OAuth tokens table
 *
 * Stores OAuth2 tokens for Gmail API access per user.
 * Tokens are encrypted at rest (application-level encryption recommended).
 */
export const gmailOAuthTokens = pgTable("gmail_oauth_tokens", {
	id: text("id").primaryKey(), // UUID or similar
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	emailAddress: text("email_address").notNull(), // Gmail email address
	accessToken: text("access_token").notNull(), // Encrypted access token
	refreshToken: text("refresh_token").notNull(), // Encrypted refresh token
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), // Token expiration time
	scope: text("scope").notNull(), // OAuth scopes granted
	historyId: text("history_id"), // Last processed Gmail history ID for watch notifications
	watchExpiresAt: timestamp("watch_expires_at", { withTimezone: true }), // When the current Gmail watch expires; null when paused
	watchLabelIds: jsonb("watch_label_ids").$type<string[]>().default([]),
	autofinFilterIds: jsonb("autofin_filter_ids").$type<string[]>().default([]),
	filterSenderEmails: jsonb("filter_sender_emails")
		.$type<string[]>()
		.default([]),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type GmailOAuthToken = typeof gmailOAuthTokens.$inferSelect;
export type NewGmailOAuthToken = typeof gmailOAuthTokens.$inferInsert;

/**
 * Categories table
 *
 * Stores transaction categories (both predefined and user-defined).
 * Predefined categories have userId = null and isDefault = true.
 * Custom categories have userId set and isDefault = false.
 */
export const categories = pgTable("categories", {
	id: text("id").primaryKey(),
	userId: text("user_id").references(() => users.id, { onDelete: "cascade" }), // null for predefined categories
	name: text("name").notNull(),
	icon: text("icon"), // emoji or icon name
	isDefault: boolean("is_default").default(false).notNull(), // predefined vs custom
	isAiCreated: boolean("is_ai_created").default(false).notNull(), // true if created by AI, false if created by user
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

/**
 * Email sources to monitor for bank alerts. One row per sender email per
 * user: `name` is the display name (usually the bank), `email` is the sender
 * address Gmail filters are built from, and `identifier` optionally pins an
 * account id. `gmailFilterId` tracks the Gmail-side filter created for this
 * source so it can be replaced or removed on resync.
 */
export const sources = pgTable(
	"sources",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		email: text("email").notNull(),
		identifier: text("identifier"),
		gmailFilterId: text("gmail_filter_id"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex("sources_user_email_unique").on(table.userId, table.email),
	],
);

export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;

/**
 * Alternate names for a source (e.g. "nBank" for "Nabil Bank"). Used to
 * resolve AI-extracted bank names and sender display names to the right
 * source at import time. Values are unique per user (case-sensitively in
 * the DB; matched case-insensitively in app code, like counterparties).
 */
export const sourceAliases = pgTable(
	"source_aliases",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		sourceId: text("source_id")
			.notNull()
			.references(() => sources.id, { onDelete: "cascade" }),
		value: text("value").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex("source_aliases_user_value_unique").on(
			table.userId,
			table.value,
		),
	],
);

export type SourceAlias = typeof sourceAliases.$inferSelect;
export type NewSourceAlias = typeof sourceAliases.$inferInsert;

/**
 * Transactions table
 *
 * Stores financial transactions extracted from bank emails.
 * Each transaction is linked to a user and optionally to a category.
 * The emailId is unique to prevent duplicate processing from Pub/Sub.
 */
export const transactions = pgTable("transactions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	categoryId: text("category_id").references(() => categories.id, {
		onDelete: "set null",
	}),

	// Core transaction data
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
	type: text("type").notNull(), // 'debit' | 'credit'
	currency: text("currency").default("NPR"),

	// Extracted metadata
	merchant: text("merchant"),
	accountNumber: text("account_number"), // last 4 digits
	bankName: text("bank_name"),
	transactionDate: timestamp("transaction_date", { withTimezone: true }),
	remarks: text("remarks"),
	notes: text("notes"),

	// Source tracking - emailId is UNIQUE to prevent duplicate processing
	loanId: text("loan_id").references((): AnyPgColumn => loans.id, {
		onDelete: "set null",
	}),
	/** Email source (bank) this transaction was imported from, when known. */
	sourceId: text("source_id").references(() => sources.id, {
		onDelete: "set null",
	}),
	emailId: text("email_id").unique(), // Gmail message ID (unique constraint)
	rawEmailContent: text("raw_email_content"), // for debugging/re-extraction

	// AI metadata
	aiConfidence: numeric("ai_confidence", { precision: 3, scale: 2 }), // 0.00-1.00
	aiExtractedData: jsonb("ai_extracted_data"), // full AI response for debugging
	isAiCreated: boolean("is_ai_created").default(false).notNull(), // true if created by AI from email, false if created manually by user

	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const userPreferences = pgTable("user_preferences", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	/** Free-form instructions the AI applies when mapping transactions to categories */
	categoryMappingPrompt: text("category_mapping_prompt"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const loanDirectionEnum = pgEnum("loan_direction", ["given", "taken"]);

/**
 * People / entities the user lends to or borrows from. One row per person
 * per user (names are unique case-sensitively per user; lookups match
 * case-insensitively). Loans reference a counterparty instead of storing a
 * free-text name.
 */
export const loanCounterparties = pgTable(
	"loan_counterparties",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		notes: text("notes"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex("loan_counterparties_user_name_unique").on(
			table.userId,
			table.name,
		),
	],
);

export type LoanCounterparty = typeof loanCounterparties.$inferSelect;
export type NewLoanCounterparty = typeof loanCounterparties.$inferInsert;

/**
 * Money lent to / borrowed from a counterparty. The optional origin
 * `transactionId` records the movement that created the loan; repayments are
 * ordinary transactions referencing the loan via `transactions.loanId`.
 */
export const loans = pgTable("loans", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	direction: loanDirectionEnum("direction").notNull(), // given | taken
	counterpartyId: text("counterparty_id")
		.notNull()
		.references(() => loanCounterparties.id, { onDelete: "restrict" }),
	principalAmount: numeric("principal_amount", {
		precision: 12,
		scale: 2,
	}).notNull(),
	currency: text("currency").default("NPR"),
	issuedDate: timestamp("issued_date", { withTimezone: true })
		.defaultNow()
		.notNull(),
	dueDate: timestamp("due_date", { withTimezone: true }),
	notes: text("notes"),
	transactionId: text("transaction_id").references(() => transactions.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Loan = typeof loans.$inferSelect;
export type NewLoan = typeof loans.$inferInsert;

/**
 * Browser Web Push subscriptions (PWA notifications). `endpoint` is unique —
 * each subscription identifies exactly one installed device/browser.
 */
export const pushSubscriptions = pgTable("push_subscriptions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	endpoint: text("endpoint").notNull().unique(),
	p256dh: text("p256dh").notNull(),
	auth: text("auth").notNull(),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type NewPushSubscription = typeof pushSubscriptions.$inferInsert;

export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	gmailTokens: many(gmailOAuthTokens),
	categories: many(categories),
	transactions: many(transactions),
	loanCounterparties: many(loanCounterparties),
	loans: many(loans),
	sources: many(sources),
}));

export const sourcesRelations = relations(sources, ({ one, many }) => ({
	user: one(users, {
		fields: [sources.userId],
		references: [users.id],
	}),
	aliases: many(sourceAliases),
	transactions: many(transactions),
}));

export const sourceAliasesRelations = relations(sourceAliases, ({ one }) => ({
	user: one(users, {
		fields: [sourceAliases.userId],
		references: [users.id],
	}),
	source: one(sources, {
		fields: [sourceAliases.sourceId],
		references: [sources.id],
	}),
}));

export const loanCounterpartiesRelations = relations(
	loanCounterparties,
	({ one, many }) => ({
		user: one(users, {
			fields: [loanCounterparties.userId],
			references: [users.id],
		}),
		loans: many(loans),
	}),
);

export const loansRelations = relations(loans, ({ one }) => ({
	user: one(users, {
		fields: [loans.userId],
		references: [users.id],
	}),
	counterparty: one(loanCounterparties, {
		fields: [loans.counterpartyId],
		references: [loanCounterparties.id],
	}),
}));

export const gmailOAuthTokensRelations = relations(
	gmailOAuthTokens,
	({ one }) => ({
		user: one(users, {
			fields: [gmailOAuthTokens.userId],
			references: [users.id],
		}),
	}),
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	user: one(users, {
		fields: [categories.userId],
		references: [users.id],
	}),
	transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id],
	}),
	source: one(sources, {
		fields: [transactions.sourceId],
		references: [sources.id],
	}),
}));

export const pushSubscriptionsRelations = relations(
	pushSubscriptions,
	({ one }) => ({
		user: one(users, {
			fields: [pushSubscriptions.userId],
			references: [users.id],
		}),
	}),
);
