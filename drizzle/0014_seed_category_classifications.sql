UPDATE categories SET bucket = CASE WHEN name = 'Gifts' THEN 'wants' ELSE 'needs' END
WHERE is_default = true AND user_id IS NULL AND bucket = 'unassigned'
AND name IN ('Rent', 'Loan', 'Internet', 'Mobile topup', 'Insurance', 'Gifts');
