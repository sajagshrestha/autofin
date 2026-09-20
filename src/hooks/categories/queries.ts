import { useQuery } from "@tanstack/react-query";
import { unwrap } from "@/lib/api-client";
import { useApiClient } from "@/lib/api-context";
import type { Category } from "./types";

export const CATEGORIES_QUERY_KEYS = {
	root: ["categories"] as const,
	list: ["categories", "list"] as const,
	detail: (id: string) => ["categories", "detail", id] as const,
};

/**
 * Fetches all categories (predefined + user custom).
 */
export function useGetAllCategories() {
	const rpc = useApiClient();
	return useQuery({
		queryKey: CATEGORIES_QUERY_KEYS.list,
		queryFn: async () => {
			const res = await rpc.api.categories.$get();
			return unwrap<{ categories: Category[] }>(res);
		},
	});
}

/**
 * Fetches a specific category by its ID.
 */
export function useGetCategoryById(id: string) {
	const rpc = useApiClient();
	return useQuery({
		queryKey: CATEGORIES_QUERY_KEYS.detail(id),
		queryFn: async () => {
			const res = await rpc.api.categories[":id"].$get({ param: { id } });
			return unwrap<{ category: Category }>(res);
		},
	});
}
