CREATE TABLE "merchant_category_hints" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"merchant_key" text NOT NULL,
	"category_id" text NOT NULL,
	"hits" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "merchant_category_hints" ADD CONSTRAINT "merchant_category_hints_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_category_hints" ADD CONSTRAINT "merchant_category_hints_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "merchant_category_hints_user_key_unique" ON "merchant_category_hints" USING btree ("user_id","merchant_key");