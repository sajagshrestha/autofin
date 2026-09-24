ALTER TABLE "loans" ALTER COLUMN "counterparty_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN "counterparty_name";