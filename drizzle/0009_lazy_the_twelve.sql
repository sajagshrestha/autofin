CREATE TABLE "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"identifier" text,
	"gmail_filter_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sources_user_email_unique" ON "sources" USING btree ("user_id","email");--> statement-breakpoint
-- Backfill: one source per previously tracked sender email. The legacy list
-- carried no names, so the email itself becomes the initial name — users can
-- rename it to the bank name in Settings. Grouped case-insensitively.
INSERT INTO "sources" ("id", "user_id", "name", "email", "created_at", "updated_at")
SELECT gen_random_uuid(), "t"."user_id", MIN(TRIM("e"."email")), MIN(LOWER(TRIM("e"."email"))), NOW(), NOW()
FROM "gmail_oauth_tokens" AS "t"
CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE("t"."filter_sender_emails", '[]'::jsonb)) AS "e"("email")
WHERE NULLIF(TRIM("e"."email"), '') IS NOT NULL
GROUP BY "t"."user_id", LOWER(TRIM("e"."email"))
ON CONFLICT ("user_id", "email") DO NOTHING;