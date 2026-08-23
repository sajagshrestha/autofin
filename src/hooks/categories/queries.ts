import { useQuery } from "@tanstack/react-query";
import { rpc, unwrap } from "@/lib/api-client";
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
	return useQuery({
		queryKey: CATEGORIES_QUERY_KEYS.detail(id),
		queryFn: async () => {
			const res = await rpc.api.categories[":id"].$get({ param: { id } });
			return unwrap<{ category: Category }>(res);
		},
	});
}
