import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import type {
	ColumnDef,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
	ChevronRight,
	Eye,
	FolderTree,
	MoreVertical,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryForm, type CategoryFormBody } from "@/components/CategoryForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
import { NoData } from "@/components/ui/no-data";
import { Search } from "@/components/ui/search";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/hooks";
import {
	useCreateCategory,
	useDeleteCategory,
	useUpdateCategory,
} from "@/hooks/categories/mutations";
import { useGetAllCategories } from "@/hooks/categories/queries";

export const Route = createFileRoute("/_authenticated/categories/")({
	component: CategoriesPage,
});

export function CategoriesPage() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [deletingCategory, setDeletingCategory] = useState<Category | null>(
		null,
	);
	const [createOpen, setCreateOpen] = useState(false);

	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isListPage = pathname === "/categories" || pathname === "/categories/";

	const { data: categoriesData, isLoading } = useGetAllCategories();
	const createMutation = useCreateCategory();
	const updateMutation = useUpdateCategory();
	const deleteMutation = useDeleteCategory();

	const categories = (categoriesData?.categories as Category[]) || [];

	const mobileCategories = categories.filter((category) =>
		`${category.name} ${category.isDefault ? "default" : category.isAiCreated ? "AI" : "custom"}`
			.toLowerCase()
			.includes(globalFilter.trim().toLowerCase()),
	);

	const columns: ColumnDef<Category>[] = [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<Link
					to="/categories/$categoryId"
					params={{ categoryId: row.original.id }}
				>
					<div className="flex items-center gap-2 font-medium">
						{row.original.icon && (
							<span className="text-lg">{row.original.icon}</span>
						)}
						{row.getValue("name")}
					</div>
				</Link>
			),
		},
		{
			id: "type",
			header: "Type",
			cell: ({ row }) => {
				const c = row.original;
				if (c.isDefault) return <Badge variant="secondary">Default</Badge>;
				if (c.isAiCreated) return <Badge variant="outline">AI</Badge>;
				return <Badge>Custom</Badge>;
			},
		},
		{
			accessorKey: "createdAt",
			header: "Created",
			cell: ({ row }) =>
				format(new Date(row.getValue("createdAt") as string), "PPP"),
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const category = row.original;
				// Editable = user-created (has userId); support snake_case from API
				const userId =
					category.userId ??
					(category as Category & { user_id?: string }).user_id;
				const isDefault =
					category.isDefault ??
					(category as Category & { is_default?: boolean }).is_default ??
					false;
				const canEdit = userId != null || !isDefault;

				return (
					<div className="flex justify-end">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild>
									<Link
										to="/categories/$categoryId"
										params={{ categoryId: category.id }}
									>
										<Eye className="mr-2 h-4 w-4" />
										View details
									</Link>
								</DropdownMenuItem>
								{canEdit && (
									<>
										<DropdownMenuItem
											data-demo-action
											onClick={() => setEditingCategory(category)}
										>
											<Pencil className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											data-demo-action
											onClick={() => setDeletingCategory(category)}
											className="text-ds-red-700 focus:text-ds-red-700"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
		},
	];

	const handleCreate = (body: CategoryFormBody) => {
		createMutation.mutate(body, {
			onSuccess: () => {
				toast.success("Category created");
				setCreateOpen(false);
			},
			onError: (err) => {
				toast.error("Failed to create category", {
					description: err.message,
				});
			},
		});
	};

	const handleUpdate = (body: CategoryFormBody) => {
		if (!editingCategory) return;
		updateMutation.mutate(
			{
				id: editingCategory.id,
				...body,
			},
			{
				onSuccess: () => {
					toast.success("Category updated");
					setEditingCategory(null);
				},
				onError: (err) => {
					toast.error("Failed to update category", {
						description: err.message,
					});
				},
			},
		);
	};

	const handleDelete = () => {
		if (!deletingCategory) return;
		deleteMutation.mutate(
			{
				id: deletingCategory.id,
			},
			{
				onSuccess: () => {
					toast.success("Category deleted");
					setDeletingCategory(null);
				},
				onError: (err) => {
					toast.error("Failed to delete category", {
						description: err.message,
					});
				},
			},
		);
	};

	return (
		<>
			{isListPage && (
				<div className="max-w-6xl mx-auto space-y-6 min-w-0 overflow-hidden">
					<div className="flex flex-col gap-4">
						<div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
							<div>
								<h1 className="flex min-h-9 items-center text-xl sm:text-2xl font-semibold tracking-tight">
									Categories
								</h1>
							</div>
							<Button
								data-demo-action
								onClick={() => setCreateOpen(true)}
								className="gap-2"
							>
								<Plus className="h-4 w-4" />
								Add category
							</Button>
						</div>
					</div>
					<div className="space-y-4 md:hidden">
						<Search
							value={globalFilter}
							onChange={(event) => setGlobalFilter(event.target.value)}
							placeholder="Search categories…"
						/>
						{isLoading ? (
							<Skeleton className="h-64 rounded-2xl" />
						) : (
							<div className="overflow-hidden rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
								{mobileCategories.map((category) => (
									<Link
										key={category.id}
										to="/categories/$categoryId"
										params={{ categoryId: category.id }}
										className="flex min-h-18 items-center gap-3 px-4 py-3 transition-colors active:bg-muted hover:bg-muted/40"
									>
										<span
											aria-hidden="true"
											className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg"
										>
											{category.icon || (
												<FolderTree className="size-5 text-muted-foreground" />
											)}
										</span>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-medium">
												{category.name}
											</span>
											<span className="mt-1 block text-xs text-muted-foreground">
												{category.isDefault
													? "Default"
													: category.isAiCreated
														? "AI"
														: "Custom"}
											</span>
										</span>
										<ChevronRight className="size-4 shrink-0 text-muted-foreground" />
									</Link>
								))}
								{mobileCategories.length === 0 && (
									<NoData
										title="No categories found"
										description={
											globalFilter
												? "Try a different search."
												: "Create your first category to get started."
										}
									/>
								)}
							</div>
						)}
					</div>
					<div className="hidden md:block">
						<DataTable
							columns={columns}
							data={categories}
							isLoading={isLoading}
							sorting={{
								state: sorting,
								onSortingChange: setSorting,
							}}
							pagination={{
								state: pagination,
								options: {
									onPaginationChange: setPagination,
									rowCount: categories.length,
								},
							}}
							search={{
								value: globalFilter,
								onChange: setGlobalFilter,
							}}
							noData={{
								title: isLoading
									? "Loading categories..."
									: "No categories found",
								description: "Get started by creating your first category.",
							}}
						/>
					</div>

					{/* Create Dialog */}
					<CategoryForm
						mode="create"
						open={createOpen}
						onOpenChange={setCreateOpen}
						onSubmit={handleCreate}
						isPending={createMutation.isPending}
						onCancel={() => setCreateOpen(false)}
					/>

					{/* Edit Dialog */}
					{editingCategory && (
						<CategoryForm
							mode="edit"
							category={editingCategory}
							open={!!editingCategory}
							onOpenChange={(open) => !open && setEditingCategory(null)}
							onSubmit={handleUpdate}
							isPending={updateMutation.isPending}
							onCancel={() => setEditingCategory(null)}
						/>
					)}

					{/* Delete Confirmation */}
					<Dialog
						open={!!deletingCategory}
						onOpenChange={(open) => !open && setDeletingCategory(null)}
					>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Delete category?</DialogTitle>
								<DialogDescription>
									This will permanently delete the category{" "}
									<span className="font-medium">
										{deletingCategory?.icon}
										{deletingCategory?.name}
									</span>
									. Transactions using this category may become uncategorized.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setDeletingCategory(null)}
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
			)}
			<Outlet />
		</>
	);
}
