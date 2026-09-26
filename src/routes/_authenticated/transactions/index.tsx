import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import type {
	ColumnDef,
	OnChangeFn,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
	Eye,
	FileText,
	HandCoins,
	Landmark,
	Loader2,
	MessageSquarePlus,
	MoreVertical,
	Pencil,
	Plus,
	SlidersHorizontal,
	Trash2,
	TrendingDown,
	TrendingUp,
	Wallet,
	X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CreateTransactionForm } from "@/components/CreateTransactionForm";
import { CreateTransactionFromSmsForm } from "@/components/CreateTransactionFromSmsForm";
import { EditTransactionForm } from "@/components/EditTransactionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	CategoryCombobox,
	type CategoryComboboxOption,
} from "@/components/ui/category-combobox";
import {
	CounterpartySelect,
	type CounterpartySelection,
} from "@/components/ui/counterparty-select";
import { DataTable } from "@/components/ui/data-table";
import {
	DateFilter,
	type DatePeriod,
	type DateRange,
	getDateRangeForPeriod,
} from "@/components/ui/date-filter";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoData } from "@/components/ui/no-data";
import { Search } from "@/components/ui/search";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/hooks";
import { useGetAllCategories } from "@/hooks/categories/queries";
import {
	type Loan,
	useCreateLoan,
	useGetLoans,
	useSettleLoan,
} from "@/hooks/loans";
import {
	useCreateTransaction,
	useCreateTransactionFromSms,
	useDeleteTransaction,
	useUpdateTransaction,
} from "@/hooks/transactions/mutations";
import { useGetTransactionHistory } from "@/hooks/transactions/queries";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useProgressiveList } from "@/hooks/useProgressiveList";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

const defaultRange = getDateRangeForPeriod("last7d");
const ALL_CATEGORIES_FILTER = "all";
const UNCATEGORIZED_FILTER = "uncategorized";
const ALL_BANKS_FILTER = "all";
type CategoryFilterOption = CategoryComboboxOption;
const sortOptions = [
	{ value: "none", label: "No sorting" },
	{ value: "transactionDate", label: "Date & time" },
	{ value: "amount", label: "Amount" },
	{ value: "merchant", label: "Merchant" },
	{ value: "category", label: "Category" },
	{ value: "bankName", label: "Bank" },
	{ value: "remarks", label: "Remarks" },
	{ value: "notes", label: "Notes" },
] as const;

const searchParamsSchema = z.object({
	period: z
		.enum(["daily", "last7d", "weekly", "monthly", "yearly", "all"])
		.optional()
		.default("last7d"),
	startDate: z
		.string()
		.optional()
		.default(defaultRange.startDate ?? ""),
	endDate: z
		.string()
		.optional()
		.default(defaultRange.endDate ?? ""),
	type: z.enum(["all", "debit", "credit"]).optional().default("all"),
	category: z.string().optional().default(ALL_CATEGORIES_FILTER),
	bank: z.string().optional().default(""),
	excludeLoans: z.boolean().optional().default(false),
});

export const Route = createFileRoute("/_authenticated/transactions/")({
	validateSearch: searchParamsSchema,
	component: TransactionsPage,
});

export function TransactionsPage() {
	const { period, startDate, endDate, type, category, bank, excludeLoans } =
		Route.useSearch();
	const typeFilter = type ?? "all";
	const categoryFilter = category ?? ALL_CATEGORIES_FILTER;
	const bankFilter = bank ?? "";
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [editingTransaction, setEditingTransaction] =
		useState<Transaction | null>(null);
	const [deletingTransaction, setDeletingTransaction] =
		useState<Transaction | null>(null);
	const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);
	const [createOptionsOpen, setCreateOptionsOpen] = useState(false);
	const [loanTrackingTarget, setLoanTrackingTarget] =
		useState<Transaction | null>(null);
	const [settlementTarget, setSettlementTarget] = useState<Transaction | null>(
		null,
	);
	const [manualDialogOpen, setManualDialogOpen] = useState(false);
	const [smsDialogOpen, setSmsDialogOpen] = useState(false);

	const navigate = useNavigate();
	const searchNavigate = Route.useNavigate();
	const {
		data: transactionsData,
		isLoading,
		isError,
		refetch,
	} = useGetTransactionHistory({
		startDate,
		endDate,
	});
	const { data: categoriesData } = useGetAllCategories();

	const handlePeriodChange = useCallback(
		(newPeriod: DatePeriod) => {
			const range = getDateRangeForPeriod(newPeriod);
			searchNavigate({
				search: {
					period: newPeriod,
					startDate: range.startDate ?? "",
					endDate: range.endDate ?? "",
				},
			});
		},
		[searchNavigate],
	);

	const handleDateRangeChange = useCallback(
		(range: DateRange) => {
			searchNavigate({
				search: (prev) => ({
					...prev,
					startDate: range.startDate ?? "",
					endDate: range.endDate ?? "",
				}),
			});
		},
		[searchNavigate],
	);

	const updateMutation = useUpdateTransaction();
	const deleteMutation = useDeleteTransaction();
	const createLoanMutation = useCreateLoan();
	const settleByTxnMutation = useSettleLoan();
	const { data: loansData } = useGetLoans();
	const outstandingLoans = (loansData?.loans ?? []).filter(
		(loan) => loan.status === "outstanding",
	);
	const createMutation = useCreateTransaction();
	const createFromSmsMutation = useCreateTransactionFromSms();

	// Keep the empty loading state stable: a fresh array causes the table's
	// automatic pagination reset to rerender this page indefinitely.
	const transactions = useMemo(
		() => transactionsData?.transactions ?? [],
		[transactionsData?.transactions],
	);
	const categories = useMemo(
		() => categoriesData?.categories ?? [],
		[categoriesData?.categories],
	);
	const sortedCategories = useMemo(
		() => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
		[categories],
	);
	const categoryFilterOptions = useMemo<CategoryFilterOption[]>(
		() => [
			{
				id: ALL_CATEGORIES_FILTER,
				label: "All categories",
				searchLabel: "all categories",
			},
			{
				id: UNCATEGORIZED_FILTER,
				label: "Uncategorized",
				searchLabel: "uncategorized",
			},
			...sortedCategories.map((category) => ({
				id: category.id,
				label: `${category.icon ? `${category.icon} ` : ""}${category.name}`,
				searchLabel: `${category.name} ${category.icon ?? ""}`.toLowerCase(),
			})),
		],
		[sortedCategories],
	);
	const bankOptions = useMemo(() => {
		const banks = new Map<string, string>();
		for (const transaction of transactions) {
			if (transaction.bankName)
				banks.set(transaction.bankName, transaction.bankName);
		}
		return Array.from(banks.keys()).sort();
	}, [transactions]);
	const filteredTransactions = useMemo(() => {
		const typeFiltered =
			typeFilter === "all"
				? transactions
				: transactions.filter((transaction) => transaction.type === typeFilter);

		let categoryFiltered: typeof transactions;
		if (categoryFilter === ALL_CATEGORIES_FILTER) {
			categoryFiltered = typeFiltered;
		} else if (categoryFilter === UNCATEGORIZED_FILTER) {
			categoryFiltered = typeFiltered.filter(
				(transaction) => !transaction.category?.id && !transaction.categoryId,
			);
		} else {
			categoryFiltered = typeFiltered.filter(
				(transaction) =>
					transaction.category?.id === categoryFilter ||
					transaction.categoryId === categoryFilter,
			);
		}

		return categoryFiltered.filter(
			(transaction) =>
				(bankFilter === "" || transaction.bankName === bankFilter) &&
				(!excludeLoans || !transaction.loanId),
		);
	}, [transactions, categoryFilter, typeFilter, bankFilter, excludeLoans]);
	const noDataDescription =
		categoryFilter === ALL_CATEGORIES_FILTER &&
		typeFilter === "all" &&
		bankFilter === "" &&
		!excludeLoans
			? "Get started by adding a transaction or creating one from SMS."
			: "Try changing your filters, or add/create a transaction.";

	const handleCategoryFilterChange = useCallback(
		(value: string | null) => {
			if (!value) return;
			searchNavigate({
				search: (prev) => ({ ...prev, category: value }),
			});
			setPagination((prev) => ({
				...prev,
				pageIndex: 0,
			}));
		},
		[searchNavigate],
	);
	const handleBankFilterChange = useCallback(
		(value: string) => {
			searchNavigate({
				search: (prev) => ({ ...prev, bank: value }),
			});
			setPagination((prev) => ({
				...prev,
				pageIndex: 0,
			}));
		},
		[searchNavigate],
	);
	const handleTypeFilterChange = useCallback(
		(value: "all" | "debit" | "credit") => {
			searchNavigate({
				search: (prev) => ({ ...prev, type: value }),
			});
			setPagination((prev) => ({
				...prev,
				pageIndex: 0,
			}));
		},
		[searchNavigate],
	);
	const handleSearchChange = useCallback((value: string) => {
		setGlobalFilter(value);
		setPagination((prev) => ({
			...prev,
			pageIndex: 0,
		}));
	}, []);
	const handleSortingChange = useCallback<OnChangeFn<SortingState>>(
		(updater) => {
			setSorting((prev) =>
				typeof updater === "function" ? updater(prev) : updater,
			);
			setPagination((prev) => ({
				...prev,
				pageIndex: 0,
			}));
		},
		[],
	);
	const handleFiltersSheetOpenChange = useCallback((open: boolean) => {
		setFiltersSheetOpen(open);
	}, []);
	const clearFilters = useCallback(() => {
		handleSortingChange([]);
		searchNavigate({
			search: (prev) => ({
				...prev,
				type: "all",
				category: ALL_CATEGORIES_FILTER,
				bank: "",
				excludeLoans: false,
			}),
		});
		setPagination((prev) => ({
			...prev,
			pageIndex: 0,
		}));
	}, [handleSortingChange, searchNavigate]);
	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (categoryFilter !== ALL_CATEGORIES_FILTER) count++;
		if (typeFilter !== "all") count++;
		if (bankFilter !== "") count++;
		if (sorting[0]) count++;
		if (excludeLoans) count++;
		return count;
	}, [categoryFilter, typeFilter, bankFilter, sorting, excludeLoans]);
	const categoryLabel = useMemo(
		() =>
			categoryFilterOptions.find((option) => option.id === categoryFilter)
				?.label ?? categoryFilter,
		[categoryFilterOptions, categoryFilter],
	);
	const openCreateManual = useCallback(() => {
		setCreateOptionsOpen(false);
		setManualDialogOpen(true);
	}, []);
	const openCreateFromSms = useCallback(() => {
		setCreateOptionsOpen(false);
		setSmsDialogOpen(true);
	}, []);
	const openImportStatement = useCallback(() => {
		setCreateOptionsOpen(false);
		navigate({ to: "/transactions/import" });
	}, [navigate]);
	const handleSortOptionChange = useCallback(
		(value: string) => {
			if (value === "none") {
				handleSortingChange([]);
				return;
			}
			handleSortingChange((prev) => {
				const existing = prev[0];
				const defaultDesc = value === "transactionDate" || value === "amount";
				return [
					{
						id: value,
						desc: existing?.id === value ? existing.desc : defaultDesc,
					},
				];
			});
		},
		[handleSortingChange],
	);
	const toggleSortDirection = useCallback(() => {
		handleSortingChange((prev) => {
			if (!prev[0]) {
				return [{ id: "transactionDate", desc: true }];
			}
			return [{ ...prev[0], desc: !prev[0].desc }];
		});
	}, [handleSortingChange]);
	const mobileSearchFilteredTransactions = useMemo(() => {
		const normalizedSearch = globalFilter.trim().toLowerCase();
		if (!normalizedSearch) return filteredTransactions;

		return filteredTransactions.filter((transaction) => {
			const searchText = [
				transaction.merchant ?? "",
				transaction.category?.name ?? "Uncategorized",
				transaction.bankName ?? "",
				transaction.remarks ?? "",
				transaction.notes ?? "",
				transaction.amount ?? "",
				transaction.currency ?? "",
				transaction.type ?? "",
				transaction.transactionDate
					? format(new Date(transaction.transactionDate), "PPp")
					: "",
			]
				.join(" ")
				.toLowerCase();

			return searchText.includes(normalizedSearch);
		});
	}, [filteredTransactions, globalFilter]);
	const mobileSortedTransactions = useMemo(() => {
		const sorted = [...mobileSearchFilteredTransactions];
		const sortState = sorting[0];
		if (!sortState) return sorted;

		const getSortableValue = (transaction: Transaction) => {
			switch (sortState.id) {
				case "transactionDate":
					return transaction.transactionDate
						? new Date(transaction.transactionDate).getTime()
						: 0;
				case "amount":
					return Number(transaction.amount ?? "0");
				case "merchant":
					return (transaction.merchant ?? "").toLowerCase();
				case "category":
					return (transaction.category?.name ?? "Uncategorized").toLowerCase();
				case "bankName":
					return (transaction.bankName ?? "").toLowerCase();
				case "remarks":
					return (transaction.remarks ?? "").toLowerCase();
				case "notes":
					return (transaction.notes ?? "").toLowerCase();
				default:
					return "";
			}
		};

		sorted.sort((a, b) => {
			const left = getSortableValue(a);
			const right = getSortableValue(b);
			if (typeof left === "number" && typeof right === "number") {
				return left - right;
			}
			return String(left).localeCompare(String(right));
		});

		if (sortState.desc) {
			sorted.reverse();
		}

		return sorted;
	}, [mobileSearchFilteredTransactions, sorting]);
	const isMobile = useMediaQuery("(max-width: 767px)");
	const { visibleCount, hasMore, sentinelRef, loadMore } = useProgressiveList({
		total: mobileSortedTransactions.length,
		enabled: isMobile && !isLoading && !isError,
		resetKey: JSON.stringify([
			period,
			startDate,
			endDate,
			typeFilter,
			categoryFilter,
			bankFilter,
			excludeLoans,
			globalFilter,
			sorting,
		]),
	});
	const mobileVisibleTransactions = useMemo(
		() => mobileSortedTransactions.slice(0, visibleCount),
		[mobileSortedTransactions, visibleCount],
	);

	const mobileTransactionGroups = useMemo(() => {
		const groups: { date: string; transactions: Transaction[] }[] = [];
		for (const transaction of mobileVisibleTransactions) {
			const date = transaction.transactionDate
				? format(new Date(transaction.transactionDate), "EEEE, MMM d, yyyy")
				: "No date";
			const last = groups[groups.length - 1];
			if (last?.date === date) last.transactions.push(transaction);
			else groups.push({ date, transactions: [transaction] });
		}
		return groups;
	}, [mobileVisibleTransactions]);

	const renderCategoryFilterCombobox = (widthClassName: string) => (
		<CategoryCombobox
			value={categoryFilter}
			onChange={handleCategoryFilterChange}
			options={categoryFilterOptions}
			placeholder="Filter by category"
			className={widthClassName}
		/>
	);
	const renderTransactionActions = (
		transaction: Transaction,
		align: "end" | "start" = "end",
	) => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-11 w-11 p-0 md:h-8 md:w-8">
					<span className="sr-only">Open menu</span>
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={align}>
				<DropdownMenuItem asChild>
					<Link
						to="/transactions/$transactionId"
						params={{ transactionId: transaction.id }}
					>
						<Eye className="mr-2 h-4 w-4" />
						View details
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					data-demo-action
					onClick={() => setEditingTransaction(transaction)}
				>
					<Pencil className="mr-2 h-4 w-4" />
					Edit
				</DropdownMenuItem>
				{!transaction.loanId && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							data-demo-action
							onClick={() => setLoanTrackingTarget(transaction)}
						>
							<HandCoins className="mr-2 h-4 w-4" />
							Track as loan
						</DropdownMenuItem>
						<DropdownMenuItem
							data-demo-action
							onClick={() => setSettlementTarget(transaction)}
						>
							<Wallet className="mr-2 h-4 w-4" />
							Track as settlement
						</DropdownMenuItem>
					</>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					data-demo-action
					onClick={() => setDeletingTransaction(transaction)}
					className="text-ds-red-700 focus:text-ds-red-700"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	const columns: ColumnDef<Transaction>[] = [
		{
			accessorKey: "amount",
			header: () => <div className="text-left">Amount</div>,
			sortingFn: (rowA, rowB, columnId) =>
				Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId)),
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue("amount") || "0");
				const formatted = formatCurrency(
					amount,
					row.original.currency || "NPR",
				);
				const isDebit = row.original.type === "debit";
				return (
					<div
						className={`flex items-center gap-1.5 font-medium ${isDebit ? "text-ds-red-700 dark:text-ds-red-900" : "text-ds-green-700 dark:text-ds-green-900"}`}
					>
						{isDebit ? (
							<TrendingDown className="h-4 w-4 shrink-0" />
						) : (
							<TrendingUp className="h-4 w-4 shrink-0" />
						)}
						{formatted}
					</div>
				);
			},
		},
		{
			id: "transactionDate",
			accessorFn: (row) =>
				row.transactionDate ? new Date(row.transactionDate).getTime() : 0,
			header: "Date & time",
			cell: ({ row }) => {
				const date = row.original.transactionDate;
				return date ? format(new Date(date), "PPp") : "N/A";
			},
		},
		{
			accessorKey: "merchant",
			header: "Merchant",
			cell: ({ row }) => (
				<div className="flex items-center gap-1.5 font-medium">
					{row.original.loanId && (
						<Wallet
							className="h-3.5 w-3.5 shrink-0 text-primary"
							aria-label="Part of a tracked loan"
						/>
					)}
					<span className="truncate">
						{row.getValue("merchant") || "Unknown"}
					</span>
				</div>
			),
		},
		{
			id: "category",
			accessorFn: (row) => row.category?.name || "Uncategorized",
			header: "Category",
			cell: ({ row }) => {
				const category = row.original.category;
				return (
					<div>
						{category ? (
							<Badge variant="secondary" className="font-normal">
								{category.icon && <span className="mr-1">{category.icon}</span>}
								{category.name}
							</Badge>
						) : (
							<span className="text-muted-foreground italic">
								Uncategorized
							</span>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "remarks",
			header: "Remarks",
			cell: ({ row }) => {
				const remarks = row.getValue("remarks") as string | null;
				return (
					<div className="max-w-[200px] truncate" title={remarks || undefined}>
						{remarks || <span className="text-muted-foreground">-</span>}
					</div>
				);
			},
		},
		{
			accessorKey: "notes",
			header: "Notes",
			cell: ({ row }) => {
				const notes = row.getValue("notes") as string | null;
				return (
					<div className="max-w-[200px] truncate" title={notes || undefined}>
						{notes || <span className="text-muted-foreground">-</span>}
					</div>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const transaction = row.original;

				return (
					<div
						className="flex justify-end"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="presentation"
					>
						{renderTransactionActions(transaction)}
					</div>
				);
			},
		},
	];

	const handleDelete = () => {
		if (!deletingTransaction) return;

		deleteMutation.mutate(
			{ id: deletingTransaction.id },
			{
				onSuccess: () => {
					toast.success("Transaction deleted");
					setDeletingTransaction(null);
				},
				onError: (error) => {
					toast.error("Failed to delete transaction", {
						description: error.message,
					});
				},
			},
		);
	};

	return (
		<>
			<div className="max-w-6xl mx-auto space-y-6 min-w-0 overflow-hidden">
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
						<div className="flex items-center justify-between gap-3 max-md:w-full">
							<div className="flex min-w-0 items-center gap-2">
								<h1 className="flex min-h-11 items-center text-xl sm:text-2xl font-semibold tracking-tight">
									Transactions
								</h1>
								<span
									className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground md:hidden"
									aria-live="polite"
								>
									{mobileSortedTransactions.length.toLocaleString()}
									<span className="sr-only"> transactions</span>
								</span>
							</div>
							<Button
								className="h-11 shrink-0 md:hidden"
								aria-label="Add transaction"
								onClick={() => setCreateOptionsOpen(true)}
							>
								<Plus className="size-4" />
								<span className="min-[480px]:hidden">Add</span>
								<span className="hidden min-[480px]:inline">
									Add transaction
								</span>
							</Button>
						</div>
						<DateFilter
							period={period}
							startDate={startDate}
							endDate={endDate}
							onPeriodChange={handlePeriodChange}
							onDateRangeChange={handleDateRangeChange}
						/>
					</div>
				</div>
				{activeFilterCount > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-muted-foreground">
							Active filters:
						</span>
						{excludeLoans && (
							<FilterChip
								label="Excludes loan-linked transactions"
								onClear={() => {
									searchNavigate({
										search: (prev) => ({ ...prev, excludeLoans: false }),
										resetScroll: false,
									});
									setPagination((prev) => ({ ...prev, pageIndex: 0 }));
								}}
							/>
						)}
						{typeFilter !== "all" && (
							<FilterChip
								label={typeFilter === "debit" ? "Debit" : "Credit"}
								onClear={() => handleTypeFilterChange("all")}
							/>
						)}
						{categoryFilter !== ALL_CATEGORIES_FILTER && (
							<FilterChip
								label={categoryLabel}
								onClear={() =>
									handleCategoryFilterChange(ALL_CATEGORIES_FILTER)
								}
							/>
						)}
						{bankFilter !== "" && (
							<FilterChip
								label={bankFilter}
								onClear={() => handleBankFilterChange("")}
							/>
						)}
					</div>
				)}
				<div className="hidden md:block">
					<DataTable
						columns={columns}
						data={filteredTransactions}
						isLoading={isLoading}
						columnPinning={{
							state: { left: ["amount"], right: ["actions"] },
						}}
						sorting={{
							state: sorting,
							onSortingChange: handleSortingChange,
						}}
						pagination={{
							state: pagination,
							options: {
								onPaginationChange: setPagination,
								rowCount: filteredTransactions.length,
							},
						}}
						search={{
							value: globalFilter,
							onChange: handleSearchChange,
						}}
						headerClassName="w-full sm:w-full justify-between"
						headerButtons={
							<div className="flex flex-wrap items-center gap-2">
								<Select
									value={typeFilter}
									onValueChange={(value) =>
										handleTypeFilterChange(value as "all" | "debit" | "credit")
									}
								>
									<SelectTrigger
										aria-label="Transaction type"
										size="sm"
										className="w-32"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All types</SelectItem>
										<SelectItem value="debit">Debit</SelectItem>
										<SelectItem value="credit">Credit</SelectItem>
									</SelectContent>
								</Select>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setFiltersSheetOpen(true)}
									className={cn(
										activeFilterCount > 0 && "border-primary/60 text-primary",
									)}
								>
									<SlidersHorizontal className="mr-2 h-4 w-4" />
									Filters
									{activeFilterCount > 0 && (
										<span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
											{activeFilterCount}
										</span>
									)}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => navigate({ to: "/transactions/import" })}
								>
									<FileText className="mr-2 h-4 w-4" />
									Import
								</Button>
								<Button
									variant="default"
									size="sm"
									data-demo-action
									onClick={() => setCreateOptionsOpen(true)}
								>
									<Plus className="mr-2 h-4 w-4" />
									Create transaction
								</Button>
							</div>
						}
						noData={{
							title: isLoading
								? "Loading transactions..."
								: "No transactions found",
							description: noDataDescription,
						}}
						onRowClick={(row) =>
							navigate({
								to: "/transactions/$transactionId",
								params: { transactionId: row.original.id },
							})
						}
					/>
				</div>

				<div className="space-y-3 md:hidden">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Search
								value={globalFilter}
								onChange={(event) => handleSearchChange(event.target.value)}
								placeholder="Search transactions…"
								className="flex-1 [&_input]:h-11"
							/>
							<Button
								variant="outline"
								className="h-11 shrink-0 gap-2"
								onClick={() => setFiltersSheetOpen(true)}
							>
								<SlidersHorizontal className="size-4" /> Filters
								{activeFilterCount > 0 && (
									<span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
										{activeFilterCount}
									</span>
								)}
							</Button>
						</div>
					</div>

					{isLoading ? (
						new Array(5).fill(null).map((_, index) => (
							<Card key={index}>
								<CardContent className="space-y-3 p-4">
									<Skeleton className="h-5 w-1/2" />
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-4 w-full" />
								</CardContent>
							</Card>
						))
					) : isError ? (
						<Card className="space-y-3 p-6 text-center">
							<p role="alert" className="text-sm">
								Could not load transactions.
							</p>
							<Button variant="outline" onClick={() => void refetch()}>
								Try again
							</Button>
						</Card>
					) : mobileVisibleTransactions.length ? (
						mobileTransactionGroups.map((group) => (
							<section
								key={group.transactions[0].id}
								className="space-y-2 pt-2"
								aria-label={group.date}
							>
								<h2 className="px-1 text-xs font-medium text-muted-foreground">
									{group.date}
								</h2>
								<div className="overflow-hidden rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
									{group.transactions.map((transaction) => (
										<div
											key={transaction.id}
											className="relative transition-colors active:bg-muted/70"
										>
											<Link
												to="/transactions/$transactionId"
												params={{ transactionId: transaction.id }}
												className="flex min-w-0 items-center gap-3 p-3 pr-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
											>
												<span
													aria-hidden="true"
													className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg"
												>
													{transaction.category?.icon || (
														<Wallet className="size-4 text-muted-foreground" />
													)}
												</span>
												<div className="min-w-0 flex-1 space-y-1">
													<p className="truncate text-sm font-medium">
														{transaction.merchant || "Unknown merchant"}
													</p>
													<p
														className={cn(
															"break-words text-base font-semibold tabular-nums",
															transaction.type === "debit"
																? "text-foreground"
																: "text-ds-green-700 dark:text-ds-green-900",
														)}
													>
														{transaction.type === "debit" ? "−" : "+"}
														{formatCurrency(
															Number(transaction.amount ?? "0"),
															transaction.currency || "NPR",
														)}
													</p>
													<p className="truncate text-xs text-muted-foreground">
														{transaction.category?.name || "Uncategorized"}
														{transaction.bankName
															? ` · ${transaction.bankName}`
															: ""}
													</p>
													<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
														<time
															dateTime={
																transaction.transactionDate ?? undefined
															}
														>
															{transaction.transactionDate
																? format(
																		new Date(transaction.transactionDate),
																		"h:mm a",
																	)
																: "No time"}
														</time>
														{transaction.loanId && (
															<>
																<span aria-hidden="true">·</span>
																<Wallet className="size-3" />
																<span>Loan</span>
															</>
														)}
													</div>
												</div>
											</Link>
											<div className="absolute right-0.5 top-1">
												{renderTransactionActions(transaction, "end")}
											</div>
										</div>
									))}
								</div>
							</section>
						))
					) : (
						<Card>
							<NoData
								title="No transactions found"
								description={noDataDescription}
								isSearchResults={!!globalFilter}
							/>
						</Card>
					)}

					{!isLoading && !isError && mobileSortedTransactions.length > 0 && (
						<div
							ref={sentinelRef}
							className="flex min-h-20 flex-col items-center justify-center gap-2 py-4"
						>
							<p className="text-xs text-muted-foreground" role="status">
								{hasMore
									? `Showing ${visibleCount} of ${mobileSortedTransactions.length} transactions`
									: `All ${mobileSortedTransactions.length} transactions shown`}
							</p>
							{hasMore && (
								<Button variant="outline" onClick={loadMore}>
									Show more transactions
								</Button>
							)}
						</div>
					)}
				</div>

				<Sheet
					open={filtersSheetOpen}
					onOpenChange={handleFiltersSheetOpenChange}
				>
					<SheetContent
						side="right"
						className="w-full overflow-hidden sm:max-w-md"
						// Don't steal focus into the category combobox on open —
						// with Headless UI's `immediate`, focusing it would pop
						// the dropdown open before the user interacts with it.
						onOpenAutoFocus={(event) => event.preventDefault()}
					>
						<SheetHeader className="shrink-0 pr-14">
							<SheetTitle>Filters</SheetTitle>
							<SheetDescription>
								Filter by category and control sorting for transactions.
							</SheetDescription>
						</SheetHeader>
						<div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 [&_button]:min-h-11 [&_input]:min-h-11">
							<div className="space-y-2">
								<p className="text-sm font-medium">Category</p>
								{renderCategoryFilterCombobox("w-full")}
							</div>
							<div className="space-y-2">
								<p className="text-sm font-medium">Type</p>
								<Select
									value={typeFilter}
									onValueChange={(value) =>
										handleTypeFilterChange(value as "all" | "debit" | "credit")
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Filter by type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All types</SelectItem>
										<SelectItem value="debit">Debit (expense)</SelectItem>
										<SelectItem value="credit">Credit (income)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<p className="flex items-center gap-1.5 text-sm font-medium">
									<Landmark className="h-3.5 w-3.5 text-muted-foreground" />
									Bank
								</p>
								<Select
									value={bankFilter === "" ? ALL_BANKS_FILTER : bankFilter}
									onValueChange={(value) =>
										handleBankFilterChange(
											value === ALL_BANKS_FILTER ? "" : value,
										)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Filter by bank" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={ALL_BANKS_FILTER}>All banks</SelectItem>
										{bankOptions.map((name) => (
											<SelectItem key={name} value={name}>
												{name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<p className="text-sm font-medium">Sort by</p>
								<Select
									value={sorting[0]?.id ?? "none"}
									onValueChange={handleSortOptionChange}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										{sortOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<p className="text-sm font-medium">Direction</p>
								<Button
									type="button"
									variant="outline"
									onClick={toggleSortDirection}
									disabled={!sorting[0]}
									className="w-full justify-between"
								>
									<span>{sorting[0]?.desc ? "Descending" : "Ascending"}</span>
									<span className="text-xs text-muted-foreground">
										{sorting[0] ? "Tap to toggle" : "Select sort first"}
									</span>
								</Button>
							</div>
						</div>
						<SheetFooter className="shrink-0 border-t pb-[max(1rem,env(safe-area-inset-bottom))] [&_button]:min-h-11">
							<Button variant="outline" onClick={clearFilters}>
								Clear filters
							</Button>
							<Button onClick={() => handleFiltersSheetOpenChange(false)}>
								Show results
							</Button>
						</SheetFooter>
					</SheetContent>
				</Sheet>

				<Dialog open={createOptionsOpen} onOpenChange={setCreateOptionsOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create transaction</DialogTitle>
							<DialogDescription>
								Choose how you want to add a transaction.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-2">
							<Button
								className="min-h-12 justify-start whitespace-normal text-left"
								data-demo-action
								onClick={openCreateManual}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add manually
							</Button>
							<Button
								variant="outline"
								className="min-h-12 justify-start whitespace-normal text-left"
								data-demo-action
								onClick={openCreateFromSms}
							>
								<MessageSquarePlus className="mr-2 h-4 w-4" />
								Create from SMS
							</Button>
							<Button
								variant="outline"
								className="min-h-12 justify-start whitespace-normal text-left"
								data-demo-action
								onClick={openImportStatement}
							>
								<FileText className="mr-2 h-4 w-4" />
								Import from statement (PDF/image)
							</Button>
						</div>
					</DialogContent>
				</Dialog>

				{/* Edit Dialog */}
				{editingTransaction && (
					<EditTransactionForm
						transaction={editingTransaction}
						categories={categories}
						open={!!editingTransaction}
						onOpenChange={(open) => !open && setEditingTransaction(null)}
						onSubmit={(body) => {
							updateMutation.mutate(
								{
									id: editingTransaction.id,
									...body,
								},
								{
									onSuccess: () => {
										toast.success("Transaction updated");
										setEditingTransaction(null);
									},
									onError: (error) => {
										toast.error("Failed to update transaction", {
											description: error.message,
										});
									},
								},
							);
						}}
						isPending={updateMutation.isPending}
						onCancel={() => setEditingTransaction(null)}
					/>
				)}

				{/* Create from SMS Dialog */}
				<CreateTransactionFromSmsForm
					key={String(smsDialogOpen)}
					open={smsDialogOpen}
					onOpenChange={setSmsDialogOpen}
					onSubmit={(body) => {
						createFromSmsMutation.mutate(body, {
							onSuccess: (data) => {
								toast.success("Transaction created from SMS");
								if (data?.duplicateOf) {
									toast.warning("Possible duplicate", {
										description: `Matches an existing ${data.duplicateOf.amount} NPR transaction from ${data.duplicateOf.transactionDate ? new Date(data.duplicateOf.transactionDate).toLocaleDateString() : "an unknown date"}.`,
									});
								}
								setSmsDialogOpen(false);
							},
							onError: (error) => {
								toast.error("Failed to create transaction", {
									description: error.message,
								});
							},
						});
					}}
					isPending={createFromSmsMutation.isPending}
					onCancel={() => setSmsDialogOpen(false)}
				/>

				{/* Create Transaction Dialog */}
				<CreateTransactionForm
					key={String(manualDialogOpen)}
					open={manualDialogOpen}
					onOpenChange={setManualDialogOpen}
					categories={categories}
					onSubmit={(body) => {
						createMutation.mutate(body, {
							onSuccess: (data) => {
								toast.success("Transaction created");
								if (data?.duplicateOf) {
									toast.warning("Possible duplicate", {
										description: `Matches an existing ${data.duplicateOf.amount} NPR transaction from ${data.duplicateOf.transactionDate ? new Date(data.duplicateOf.transactionDate).toLocaleDateString() : "an unknown date"}.`,
									});
								}
								setManualDialogOpen(false);
							},
							onError: (error) => {
								toast.error("Failed to create transaction", {
									description: error.message,
								});
							},
						});
					}}
					isPending={createMutation.isPending}
					onCancel={() => setManualDialogOpen(false)}
				/>

				{/* Track as Loan */}
				<Dialog
					open={!!loanTrackingTarget}
					onOpenChange={(o) => !o && setLoanTrackingTarget(null)}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Track as loan</DialogTitle>
							<DialogDescription>
								{loanTrackingTarget?.type === "debit"
									? "This debit becomes money you GAVE."
									: "This credit becomes money you TOOK."}{" "}
								Amount:{" "}
								<b>
									{formatCurrency(Number(loanTrackingTarget?.amount ?? "0"))}
								</b>
							</DialogDescription>
						</DialogHeader>
						<LoanTrackingFields
							defaultCounterparty={loanTrackingTarget?.merchant || undefined}
							onSubmit={(fields) => {
								if (!loanTrackingTarget) return;
								createLoanMutation.mutate(
									{
										...(fields.counterparty.kind === "existing"
											? { counterpartyId: fields.counterparty.id }
											: {
													counterpartyName: fields.counterparty.name.trim(),
												}),
										direction:
											loanTrackingTarget.type === "debit" ? "given" : "taken",
										principalAmount: Number(loanTrackingTarget.amount),
										originTransactionId: loanTrackingTarget.id,
										dueDate: fields.dueDate || undefined,
									},
									{
										onSuccess: () => {
											toast.success("Tracked as a loan");
											setLoanTrackingTarget(null);
										},
										onError: (err) => {
											toast.error("Failed to track loan", {
												description: err.message,
											});
										},
									},
								);
							}}
							isPending={createLoanMutation.isPending}
						/>
					</DialogContent>
				</Dialog>

				{/* Track as Settlement */}
				<Dialog
					open={!!settlementTarget}
					onOpenChange={(o) => !o && setSettlementTarget(null)}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Track as settlement</DialogTitle>
							<DialogDescription>
								Link this{" "}
								<b>
									{formatCurrency(Number(settlementTarget?.amount ?? "0"))}{" "}
									{settlementTarget?.type}
								</b>{" "}
								transaction to an outstanding loan as a repayment.
							</DialogDescription>
						</DialogHeader>
						{outstandingLoans.length === 0 ? (
							<p className="py-2 text-sm text-muted-foreground">
								No outstanding loans to settle. Track one first from the Loans
								page or via “Track as loan”.
							</p>
						) : (
							<LoanSelectFields
								loans={outstandingLoans}
								onSubmit={(loanId) => {
									if (!settlementTarget) return;
									settleByTxnMutation.mutate(
										{
											id: loanId,
											transactionId: settlementTarget.id,
										},
										{
											onSuccess: () => {
												toast.success("Tracked as settlement");
												setSettlementTarget(null);
											},
											onError: (err) => {
												toast.error("Failed to link settlement", {
													description: err.message,
												});
											},
										},
									);
								}}
								isPending={settleByTxnMutation.isPending}
							/>
						)}
					</DialogContent>
				</Dialog>

				{/* Delete Confirmation */}
				<Dialog
					open={!!deletingTransaction}
					onOpenChange={(open) => !open && setDeletingTransaction(null)}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete the
								transaction for{" "}
								<span className="font-medium">
									{deletingTransaction?.merchant}
								</span>
								.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setDeletingTransaction(null)}
							>
								Cancel
							</Button>
							<Button
								variant="destructive"
								data-demo-action
								onClick={handleDelete}
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending ? "Deleting..." : "Delete"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			<Outlet />
		</>
	);
}

/* ── Active filter chip ─────────────────────────────────────────────────── */

function FilterChip({
	label,
	onClear,
}: {
	label: string;
	onClear: () => void;
}) {
	return (
		<Badge variant="secondary" className="gap-1 py-0.5 pl-2.5 pr-1">
			<span className="max-w-[180px] truncate">{label}</span>
			<button
				type="button"
				onClick={onClear}
				aria-label={`Remove ${label} filter`}
				className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				<X className="h-3 w-3" />
			</button>
		</Badge>
	);
}

/* ── Loan tracking dialogs' fields ─────────────────────────────────────── */

function LoanTrackingFields({
	defaultCounterparty,
	onSubmit,
	isPending,
}: {
	defaultCounterparty?: string;
	onSubmit: (fields: {
		counterparty: CounterpartySelection;
		dueDate: string;
	}) => void;
	isPending: boolean;
}) {
	const [counterparty, setCounterparty] =
		useState<CounterpartySelection | null>(
			defaultCounterparty?.trim()
				? { kind: "new", name: defaultCounterparty.trim() }
				: null,
		);
	const [dueDate, setDueDate] = useState("");
	const [error, setError] = useState<string | null>(null);

	return (
		<div className="space-y-4 py-1">
			<div className="space-y-2">
				<Label htmlFor="track-loan-counterparty">Counterparty</Label>
				<CounterpartySelect
					id="track-loan-counterparty"
					defaultName={defaultCounterparty?.trim()}
					value={counterparty}
					onChange={(next) => {
						setCounterparty(next);
						setError(null);
					}}
				/>
				{error && <p className="text-sm text-destructive">{error}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="track-loan-due">Due date (optional)</Label>
				<Input
					id="track-loan-due"
					type="date"
					value={dueDate}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setDueDate(e.target.value)
					}
				/>
			</div>
			<DialogFooter>
				<Button
					onClick={() => {
						const name =
							counterparty?.kind === "new" ? counterparty.name.trim() : null;
						if (!counterparty || (counterparty.kind === "new" && !name)) {
							setError("Select an existing counterparty or create a new one");
							return;
						}
						onSubmit({ counterparty, dueDate });
					}}
					disabled={isPending}
				>
					{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
					Track loan
				</Button>
			</DialogFooter>
		</div>
	);
}

function LoanSelectFields({
	loans,
	onSubmit,
	isPending,
}: {
	loans: Loan[];
	onSubmit: (loanId: string) => void;
	isPending: boolean;
}) {
	const [loanId, setLoanId] = useState(loans[0]?.id ?? "");

	return (
		<div className="space-y-4 py-1">
			<div className="space-y-2">
				<Label htmlFor="settle-loan-select">Outstanding loan</Label>
				<select
					id="settle-loan-select"
					value={loanId}
					onChange={(e) => setLoanId(e.target.value)}
					className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
				>
					{loans.map((loan) => (
						<option key={loan.id} value={loan.id}>
							{loan.counterpartyName} — {formatCurrency(loan.remainingAmount)}{" "}
							remaining ({loan.direction})
						</option>
					))}
				</select>
			</div>
			<DialogFooter>
				<Button
					onClick={() => onSubmit(loanId)}
					disabled={isPending || !loanId}
				>
					{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
					Link as repayment
				</Button>
			</DialogFooter>
		</div>
	);
}
