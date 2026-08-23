import { u as useQuery, a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as rpc, u as unwrap } from "./api-client-CFEv0PPX.mjs";
const LOANS_QUERY_KEYS = {
  root: ["loans"],
  list: ["loans", "list"],
  detail: (id) => ["loans", "detail", id]
};
function useGetLoans() {
  return useQuery({
    queryKey: LOANS_QUERY_KEYS.list,
    queryFn: async () => {
      const res = await rpc.api.loans.$get();
      return unwrap(res);
    }
  });
}
function useGetLoan(id) {
  return useQuery({
    queryKey: LOANS_QUERY_KEYS.detail(id ?? "_"),
    queryFn: async () => {
      if (!id) return null;
      const res = await rpc.api.loans[":id"].$get({ param: { id } });
      return unwrap(res);
    },
    enabled: id !== null
  });
}
function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.loans.$post({ json: input });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEYS.root });
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_ROOT_KEY
      });
    }
  });
}
const TRANSACTIONS_ROOT_KEY = ["transactions"];
function useDeleteLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.loans[":id"].$delete({
        param: { id: input.id }
      });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEYS.root });
    }
  });
}
function useSettleLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { id, ...body } = input;
      const res = await rpc.api.loans[":id"].settle.$post({
        param: { id },
        json: body
      });
      return unwrap(res);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEYS.root });
      queryClient.invalidateQueries({
        queryKey: LOANS_QUERY_KEYS.detail(variables.id)
      });
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_ROOT_KEY
      });
    }
  });
}
export {
  useCreateLoan as a,
  useGetLoan as b,
  useSettleLoan as c,
  useDeleteLoan as d,
  useGetLoans as u
};
