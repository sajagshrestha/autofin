ALTER TABLE "gmail_oauth_tokens" ADD COLUMN "watch_label_ids" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "gmail_oauth_tokens" ADD COLUMN "autofin_filter_ids" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "gmail_oauth_tokens" ADD COLUMN "filter_sender_emails" jsonb DEFAULT '[]'::jsonb;