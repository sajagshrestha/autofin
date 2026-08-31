import { z } from "zod";
import type { Loan } from "@/server/db/schema";
import { getContainer } from "@/server/lib/container";
import { filterDateToUtc } from "@/server/lib/timezone";
import type { LoanRepository } from "@/server/repositories/loan.repository";

export interface AdvisorToolContext {
	/** Supabase user id — every query is scoped to this user. */
	userId: string;
	/** IANA timezone used to interpret YYYY-MM-DD ranges. */
	timezone: string;
}

export interface AdvisorToolDef {
	name: string;
	title: string;
	description: string;
	inputSchema: z.ZodObject<z.ZodRawShape>;
	execute: (args: unknown, ctx: AdvisorToolContext) => Promise<unknown>;
}

const dateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/)
	.describe("Date, YYYY-MM-DD");

function dayStart(date: string, timezone: string): Date {
	return filterDateToUtc(`${date}T00:00:00`, timezone);
}

function dayEnd(date: string, timezone: string): Date {
	return filterDateToUtc(`${date}T23:59:59.999`, timezone);
}

interface LoanStat {
	id: string;
	direction: "given" | "taken";
	counterpartyName: string;
	principalAmount: number;
	settledAmount: number;
	remainingAmount: number;
	settlementCount: number;
	status: "outstanding" | "settled" | "overpaid";
	isOverdue: boolean;
	issuedDate: string;
	dueDate: string | null;
	notes: string | null;
}

/**
 * Project loans into AI-facing stats. Repayments are the linked transactions
 * whose `loanId` points at the loan, excluding the loan's own origin
 * transaction so a brand-new loan starts at zero.
 */
function loanToStat(
	loan: Loan,
	totals: { settledAmount: number; settlementCount: number },
): LoanStat {
	const settled = Number(totals.settledAmount.toFixed(2));
	const principal = Number.parseFloat(loan.principalAmount);
	const remaining = Number((principal - settled).toFixed(2));
	return {
		id: loan.id,
		direction: loan.direction,
		counterpartyName: loan.counterpartyName,
		principalAmount: principal,
		settledAmount: settled,
		remainingAmount: remaining,
		settlementCount: totals.settlementCount,
		status:
			remaining < 0 ? "overpaid" : remaining === 0 ? "settled" : "outstanding",
		isOverdue:
			remaining > 0 &&
			loan.dueDate !== null &&
			loan.dueDate.getTime() < Date.now(),
		issuedDate: loan.issuedDate.toISOString(),
		dueDate: loan.dueDate?.toISOString() ?? null,
		notes: loan.notes,
	};
}

async function loadLoansWithStats(
	loanRepo: LoanRepository,
	loans: Loan[],
): Promise<LoanStat[]> {
	if (loans.length === 0) return [];
	const totals = await loanRepo.getSettlementTotals(
		loans[0].userId,
		loans.map((loan) => ({
			loanId: loan.id,
			excludeTransactionId: loan.transactionId,
		})),
	);
	return loans.map((loan) =>
		loanToStat(
			loan,
			totals.get(loan.id) ?? { settledAmount: 0, settlementCount: 0 },
		),
	);
}

/**
 * The financial-advisor tools, defined once and reused by two surfaces:
 * the in-app streaming chat (AI SDK `tool()`) and the public MCP server.
 *
 * Every execute() is scoped to ctx.userId — callers MUST resolve the user
 * from an authenticated session or bearer token, never accept a client-side id.
 */
export function getAdvisorToolDefs(): AdvisorToolDef[] {
	return [
		{
			name: "getSpendingSummary",
			title: "Get spending summary",
			description:
				"Totals for a period: expenses and income EXCLUDING loan transfers (loanOutflow/loanInflow reported separately), plus net and transaction count. Omit dates for all-time.",
			inputSchema: z.object({
				startDate: dateSchema.optional().describe("Range start (inclusive)"),
				endDate: dateSchema.optional().describe("Range end (inclusive)"),
			}),
			execute: async (args, ctx) => {
				const { startDate, endDate } = args as {
					startDate?: string;
					endDate?: string;
				};
				const container = getContainer();
				const summary = await container.transactionRepo.getSummaryForUser(
					ctx.userId,
					startDate ? dayStart(startDate, ctx.timezone) : undefined,
					endDate ? dayEnd(endDate, ctx.timezone) : undefined,
				);
				return {
					...summary,
					net: summary.totalCredit - summary.totalDebit,
					currency: "NPR",
				};
			},
		},

		{
			name: "getSpendingByCategory",
			title: "Get spending by category",
			description:
				"Spending (debits) grouped by category, largest first, for a period. Excludes loan transfers. Omit dates for all-time.",
			inputSchema: z.object({
				startDate: dateSchema.optional(),
				endDate: dateSchema.optional(),
				limit: z.number().int().min(1).max(20).default(10),
			}),
			execute: async (args, ctx) => {
				const {
					startDate,
					endDate,
					limit = 10,
				} = args as {
					startDate?: string;
					endDate?: string;
					limit?: number;
				};
				const container = getContainer();
				const rows = await container.transactionRepo.getSpendingByCategory(
					ctx.userId,
					startDate ? dayStart(startDate, ctx.timezone) : undefined,
					endDate ? dayEnd(endDate, ctx.timezone) : undefined,
				);
				const total = rows.reduce((sum, row) => sum + row.total, 0);
				return {
					currency: "NPR",
					total,
					categories: rows.slice(0, limit),
				};
			},
		},

		{
			name: "getMonthlyTrend",
			title: "Get monthly trend",
			description:
				"Monthly income vs expenses (loan transfers excluded) for the trailing N months (default 6, max 12), oldest first. Use for trends and month-over-month comparisons.",
			inputSchema: z.object({
				months: z.number().int().min(1).max(12).default(6),
			}),
			execute: async (args, ctx) => {
				const { months = 6 } = args as { months?: number };
				const container = getContainer();
				const trend = await container.transactionRepo.getMonthlyTrend(
					ctx.userId,
					months,
				);
				return { currency: "NPR", months: trend };
			},
		},

		{
			name: "renderChart",
			title: "Render a chart",
			description:
				"Visualize data you already retrieved (getMonthlyTrend, getSpendingByCategory, getSpendingSummary). Call after a data tool when a chart would help the answer. type is the chart kind; data must be an array of objects matching that kind's shape: monthlyTrend -> {month, income, expenses}; categoryPie/categoryBar -> {name, value}; bank -> {name, amount}; spending -> {label, spending}. Prefer monthlyTrend for trends and categoryPie for category breakdowns.",
			inputSchema: z.object({
				type: z.enum([
					"monthlyTrend",
					"categoryPie",
					"categoryBar",
					"bank",
					"spending",
				]),
				title: z
					.string()
					.optional()
					.describe("Short chart title; omit to use the default"),
				data: z.array(z.record(z.string(), z.unknown())).describe("Chart data points"),
			}),
			execute: async (args) => args,
		},

		{
			name: "listTransactions",
			title: "List transactions",
			description:
				"Search the user's transactions, newest first. Filter by category, type, dates, or a merchant/remarks text match.",
			inputSchema: z.object({
				limit: z.number().int().min(1).max(25).default(10),
				categoryId: z.string().optional(),
				type: z.enum(["debit", "credit"]).optional(),
				startDate: dateSchema.optional(),
				endDate: dateSchema.optional(),
				merchantSearch: z
					.string()
					.optional()
					.describe(
						"Case-insensitive substring to match against merchant or remarks",
					),
			}),
			execute: async (args, ctx) => {
				const {
					limit = 10,
					categoryId,
					type,
					startDate,
					endDate,
					merchantSearch,
				} = args as {
					limit?: number;
					categoryId?: string;
					type?: "debit" | "credit";
					startDate?: string;
					endDate?: string;
					merchantSearch?: string;
				};
				const container = getContainer();
				const rows = await container.transactionRepo.findAllForUser(
					ctx.userId,
					{
						categoryId,
						type,
						startDate: startDate
							? dayStart(startDate, ctx.timezone)
							: undefined,
						endDate: endDate ? dayEnd(endDate, ctx.timezone) : undefined,
					},
					50,
					0,
				);

				const needle = merchantSearch?.trim().toLowerCase();
				const filtered = needle
					? rows.filter(
							(row) =>
								row.merchant?.toLowerCase().includes(needle) ||
								row.remarks?.toLowerCase().includes(needle),
						)
					: rows;

				return {
					currency: "NPR",
					matched: filtered.length,
					transactions: filtered.slice(0, limit).map((row) => ({
						date: row.transactionDate?.toISOString() ?? null,
						type: row.type,
						amount: row.amount,
						merchant: row.merchant,
						category: row.category?.name ?? "Uncategorized",
						remarks: row.remarks,
					})),
				};
			},
		},

		{
			name: "searchCategories",
			title: "Search categories",
			description:
				"Search the user's spending categories by name (case-insensitive substring). Returns ids usable as categoryId in listTransactions. Empty query lists everything.",
			inputSchema: z.object({
				query: z
					.string()
					.optional()
					.describe('Case-insensitive name substring, e.g. "food"'),
				limit: z.number().int().min(1).max(25).default(15),
			}),
			execute: async (args, ctx) => {
				const { query, limit = 15 } = args as {
					query?: string;
					limit?: number;
				};
				const container = getContainer();
				const categories = await container.categoryRepo.findAllForUser(
					ctx.userId,
				);

				const needle = query?.trim().toLowerCase();
				const filtered =
					needle && needle.length > 0
						? categories.filter((category) =>
								category.name.toLowerCase().includes(needle),
							)
						: categories;

				return {
					total: filtered.length,
					categories: filtered.slice(0, limit).map((category) => ({
						id: category.id,
						name: category.name,
						icon: category.icon,
						kind:
							category.userId === null
								? ("default" as const)
								: category.isAiCreated
									? ("ai" as const)
									: ("custom" as const),
					})),
				};
			},
		},

		{
			name: "getLoans",
			title: "Get loans",
			description:
				"List tracked loans with current balances. Each entry has direction (given = money you lent, taken = money you borrowed), counterparty, principal, settled, remaining, status (outstanding/settled/overpaid) and overdue flag. Optionally filter by direction or status.",
			inputSchema: z.object({
				direction: z.enum(["given", "taken"]).optional(),
				status: z.enum(["outstanding", "settled", "overpaid"]).optional(),
			}),
			execute: async (args, ctx) => {
				const { direction, status } = args as {
					direction?: "given" | "taken";
					status?: "outstanding" | "settled" | "overpaid";
				};
				const container = getContainer();
				const loans = await container.loanRepo.findAllForUser(ctx.userId);
				const stats = await loadLoansWithStats(container.loanRepo, loans);
				const filtered = stats.filter(
					(loan) =>
						(direction ? loan.direction === direction : true) &&
						(status ? loan.status === status : true),
				);
				return {
					currency: "NPR",
					count: filtered.length,
					loans: filtered,
				};
			},
		},

		{
			name: "getLoanSummary",
			title: "Get loan summary",
			description:
				"Aggregate loan positions: total principal and outstanding remaining for money lent (given) and borrowed (taken), plus counts of active and overdue loans. No arguments.",
			inputSchema: z.object({}),
			execute: async (_args, ctx) => {
				const container = getContainer();
				const loans = await container.loanRepo.findAllForUser(ctx.userId);
				const stats = await loadLoansWithStats(container.loanRepo, loans);

				const sumRemaining = (items: LoanStat[]) =>
					items.reduce((sum, loan) => sum + loan.remainingAmount, 0);
				const sumPrincipal = (items: LoanStat[]) =>
					items.reduce((sum, loan) => sum + loan.principalAmount, 0);

				const given = stats.filter((loan) => loan.direction === "given");
				const taken = stats.filter((loan) => loan.direction === "taken");
				const outstandingGiven = given.filter(
					(loan) => loan.status === "outstanding",
				);
				const outstandingTaken = taken.filter(
					(loan) => loan.status === "outstanding",
				);

				return {
					currency: "NPR",
					totalLoans: stats.length,
					activeLoans: stats.filter(
						(loan) =>
							loan.status === "outstanding" || loan.status === "overpaid",
					).length,
					overdueLoans: stats.filter((loan) => loan.isOverdue).length,
					given: {
						count: given.length,
						totalPrincipal: sumPrincipal(given),
						outstanding: sumRemaining(outstandingGiven),
					},
					taken: {
						count: taken.length,
						totalPrincipal: sumPrincipal(taken),
						outstanding: sumRemaining(outstandingTaken),
					},
				};
			},
		},

		{
			name: "getLoanSettlements",
			title: "Get loan repayments",
			description:
				"List the repayment transactions recorded against a single loan (the loan's origin is excluded), oldest first. Requires a loan id from getLoans.",
			inputSchema: z.object({
				loanId: z.string().describe("Loan id from getLoans"),
			}),
			execute: async (args, ctx) => {
				const { loanId } = args as { loanId: string };
				const container = getContainer();
				const loan = await container.loanRepo.findById(ctx.userId, loanId);
				if (!loan) {
					return { error: `Loan not found: ${loanId}` };
				}
				const settlements = await container.loanRepo.findSettlements(
					ctx.userId,
					loan,
				);
				return {
					currency: "NPR",
					loanId,
					direction: loan.direction,
					counterpartyName: loan.counterpartyName,
					settlements,
				};
			},
		},
	];
}
