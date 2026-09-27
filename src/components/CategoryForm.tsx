import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Category } from "@/hooks";
import { categorySchema } from "@/schemas/category";

export type CategoryFormBody = {
	name: string;
	icon?: string;
	bucket?: "needs" | "wants" | "unassigned";
};

export function CategoryForm({
	category,
	open,
	onOpenChange,
	onSubmit,
	isPending,
	onCancel,
	mode,
}: {
	category?: Category | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (body: CategoryFormBody) => void;
	isPending: boolean;
	onCancel: () => void;
	mode: "create" | "edit";
}) {
	const form = useForm({
		defaultValues: {
			name: category?.name ?? "",
			icon: category?.icon ?? "",
			bucket: category?.bucket ?? "unassigned",
		},
		onSubmit: async ({ value }) => {
			onSubmit({
				bucket: value.bucket,
				name: value.name.trim(),
				icon: value.icon?.trim() || undefined,
			});
		},
		validators: {
			onChange: categorySchema,
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "Add Category" : "Edit Category"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Create a new custom category. Name is required."
							: "Update the category name and optional icon."}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field name="name">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Groceries"
											aria-invalid={isInvalid}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="icon">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Icon (optional)</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. 🛒"
									/>
								</Field>
							)}
						</form.Field>
						<form.Field name="bucket">
							{(field) => (
								<Field>
									<FieldLabel htmlFor="category-bucket">
										Need or want
									</FieldLabel>
									<select
										id="category-bucket"
										className="h-10 rounded-md border border-input bg-background px-3 text-sm"
										value={field.state.value}
										onChange={(event) =>
											field.handleChange(
												event.target.value as "needs" | "wants" | "unassigned",
											)
										}
									>
										<option value="unassigned">Unassigned</option>
										<option value="needs">Need</option>
										<option value="wants">Want</option>
									</select>
								</Field>
							)}
						</form.Field>
					</FieldGroup>

					<DialogFooter className="pt-4">
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : mode === "create" ? "Create" : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
