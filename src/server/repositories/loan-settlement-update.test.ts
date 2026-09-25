import { drizzle } from "drizzle-orm/pg-proxy";
import { describe, expect, it } from "vitest";
import type { Database } from "@/server/db/connection";
import type { Loan } from "@/server/db/schema";
import { LoanRepository } from "./loan.repository";

describe("settlement update scope", () => {
	it.each(["given", "taken"] as const)(
		"allows either transaction type for a %s loan, while guarding ownership and origin",
		async (direction) => {
			let query = "";
			let parameters: unknown[] = [];
			const db = drizzle(async (sql, params) => {
				query = sql;
				parameters = params;
				return { rows: [["repayment"]] };
			});
			const repo = new LoanRepository(db as unknown as Database);
			const loan = { id: "loan", transactionId: "origin", direction } as Loan;
			await repo.updateSettlement("owner", loan, "repayment", { loanId: null });
			expect(query).toContain('"transactions"."user_id" =');
			expect(query).toContain('"transactions"."loan_id" =');
			expect(query).toContain('"transactions"."id" <>');
			expect(query).not.toContain('"transactions"."type"');
			expect(parameters).toEqual(
				expect.arrayContaining(["owner", "loan", "repayment", "origin"]),
			);
		},
	);
});
