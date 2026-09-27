import { sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

// Shared by expense and income analysis. Only explicit loan links are excluded;
// unlinked loan-category payments remain eligible fixed obligations.
export const budgetAnalysisFilter = sql`t.loan_id IS NULL AND t.category_id IS NOT NULL AND c.id IS NOT NULL AND
 btrim(c.name) <> '' AND
 COALESCE(c.name, '') !~* '(^|[^[:alnum:]])(tax(es|ation)?|vat|tds|others?|uncategori[sz]ed)([^[:alnum:]]|$)'`;

export function isFixedCostCategory(name: string) {
	return /\b(rent|rental|loan|loans|repayment|repayments)\b/i.test(name);
}

export function protectFixedCostProposals<
	T extends { categoryId: string; amount: number; explanation: string },
>(
	proposals: T[],
	rows: {
		categoryId: string;
		name: string;
		latestMonthly?: string;
		average: string;
	}[],
) {
	const result = proposals.map((p) => ({ ...p }));
	for (const row of rows) {
		if (!isFixedCostCategory(row.name)) continue;
		const minimum = Number(row.latestMonthly ?? row.average);
		if (!Number.isFinite(minimum) || minimum <= 0) continue;
		const proposal = result.find((p) => p.categoryId === row.categoryId);
		if (!proposal)
			throw new HTTPException(502, {
				message: "AI omitted a fixed rent or loan category. Please try again.",
			});
		if (proposal.amount < minimum) {
			proposal.amount = minimum;
			proposal.explanation =
				"Keeps the latest recorded monthly fixed-cost total. Missing months are not treated as zero payments. Verify this amount if this payment has changed.";
		}
	}
	return result;
}
