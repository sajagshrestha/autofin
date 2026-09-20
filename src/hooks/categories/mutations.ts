import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api-client";
import { useApiClient } from "@/lib/api-context";
import { CATEGORIES_QUERY_KEYS } from "./queries";
import type { Category, CategoryFormBody } from "./types";

/**
 * Creates a new custom category.
 */
export function useCreateCategory() {
	const rpc = useApiClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: CategoryFormBody) => {
			const res = await rpc.api.categories.$post({
				json: { name: input.name, icon: input.icon },
			});
			return unwrap<{ category: Category }>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.root });
		},
	});
}

/**
 * Updates an existing custom category.
 */
export function useUpdateCategory() {
	const rpc = useApiClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: CategoryFormBody & { id: string }) => {
			const { id, ...body } = input;
			const res = await rpc.api.categories[":id"].$patch({
				param: { id },
				json: body,
			});
			return unwrap<{ category: Category }>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.root });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
}

/**
 * Deletes a custom category.
 */
export function useDeleteCategory() {
	const rpc = useApiClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { id: string }) => {
			const res = await rpc.api.categories[":id"].$delete({
				param: { id: input.id },
			});
			return unwrap<{ message: string }>(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.root });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
}
