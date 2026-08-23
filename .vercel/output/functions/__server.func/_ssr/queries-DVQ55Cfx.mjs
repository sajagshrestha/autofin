import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as rpc, u as unwrap } from "./api-client-CFEv0PPX.mjs";
const CATEGORIES_QUERY_KEYS = {
  root: ["categories"],
  list: ["categories", "list"],
  detail: (id) => ["categories", "detail", id]
};
function useGetAllCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEYS.list,
    queryFn: async () => {
      const res = await rpc.api.categories.$get();
      return unwrap(res);
    }
  });
}
function useGetCategoryById(id) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const res = await rpc.api.categories[":id"].$get({ param: { id } });
      return unwrap(res);
    }
  });
}
export {
  CATEGORIES_QUERY_KEYS as C,
  useGetCategoryById as a,
  useGetAllCategories as u
};
