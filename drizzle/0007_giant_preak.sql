CREATE TABLE "loan_counterparties" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "counterparty_id" text;--> statement-breakpoint
ALTER TABLE "loan_counterparties" ADD CONSTRAINT "loan_counterparties_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "loan_counterparties_user_name_unique" ON "loan_counterparties" USING btree ("user_id","name");--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_counterparty_id_loan_counterparties_id_fk" FOREIGN KEY ("counterparty_id") REFERENCES "public"."loan_counterparties"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
-- Backfill: one counterparty per user per name, grouped case-insensitively
-- (first-seen casing wins; blank names become '(Unknown)').
INSERT INTO "loan_counterparties" ("id", "user_id", "name", "created_at", "updated_at")
SELECT gen_random_uuid(), "user_id",
	MIN(COALESCE(NULLIF(TRIM("counterparty_name"), ''), '(Unknown)')),
	NOW(), NOW()
FROM "loans"
GROUP BY "user_id", LOWER(COALESCE(NULLIF(TRIM("counterparty_name"), ''), '(Unknown)'));--> statement-breakpoint
UPDATE "loans" AS "l" SET "counterparty_id" = "c"."id"
FROM "loan_counterparties" AS "c"
WHERE "c"."user_id" = "l"."user_id"
	AND LOWER("c"."name") = LOWER(COALESCE(NULLIF(TRIM("l"."counterparty_name"), ''), '(Unknown)'));