import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as rpc, u as unwrap } from "./api-client-CFEv0PPX.mjs";
const TRANSACTIONS_QUERY_KEYS = {
  root: ["transactions"],
  list: (params) => ["transactions", "list", params ?? {}],
  summary: (params) => ["transactions", "summary", params ?? {}],
  detail: (id) => ["transactions", "detail", id]
};
function compactParams(params) {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== void 0 && value !== ""
    )
  );
}
function useGetAllTransactions(params) {
  const clean = compactParams(params);
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.list(clean),
    queryFn: async () => {
      const res = await rpc.api.transactions.$get({
        query: { limit: 500, offset: 0, ...clean }
      });
      return unwrap(res);
    }
  });
}
function useGetTransactionById(id) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const res = await rpc.api.transactions[":id"].$get({
        param: { id }
      });
      return unwrap(res);
    }
  });
}
export {
  TRANSACTIONS_QUERY_KEYS as T,
  useGetTransactionById as a,
  useGetAllTransactions as u
};
