ALTER TABLE "categories" ADD COLUMN "bucket" text DEFAULT 'unassigned' NOT NULL;
--> statement-breakpoint
UPDATE categories SET bucket = CASE
 WHEN name IN ('Transportation', 'Bills and Utilities', 'Healthcare', 'Groceries') THEN 'needs'
 WHEN name IN ('Food and Dining', 'Shopping', 'Entertainment', 'Travel') THEN 'wants'
 ELSE 'unassigned' END
WHERE is_default = true AND user_id IS NULL;
