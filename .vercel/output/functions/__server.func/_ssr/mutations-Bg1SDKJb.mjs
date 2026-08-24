import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useForm } from "../_libs/tanstack__react-form.mjs";
import { B as Button } from "./router-CvFqzVfm.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QKc3FBts.mjs";
import { F as FieldGroup, a as Field, b as FieldLabel, c as FieldError } from "./field-BBmN2oLs.mjs";
import { I as Input } from "./input-DNKpjK_Q.mjs";
import { a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as rpc, u as unwrap } from "./api-client-CFEv0PPX.mjs";
import { T as TRANSACTIONS_QUERY_KEYS } from "./queries-PZPiYPZ4.mjs";
import { H as Ht, k as ko, B as Bo, U as Uo, a as Ho } from "../_libs/headlessui__react.mjs";
import { a0 as ChevronsUpDown, d as Check } from "../_libs/lucide-react.mjs";
import { o as object, b as string, _ as _enum } from "../_libs/zod.mjs";
function mapEditFormToUpdateBody(values) {
  return {
    merchant: values.merchant || void 0,
    categoryId: values.categoryId || void 0,
    remarks: values.remarks || void 0
  };
}
function mapCreateFormToCreateBody(values) {
  return {
    amount: Number(values.amount),
    type: values.type,
    categoryId: values.categoryId || void 0,
    merchant: values.merchant.trim() || void 0,
    remarks: values.remarks.trim() || void 0,
    transactionDate: values.transactionDate ? new Date(values.transactionDate).toISOString() : void 0
  };
}
const editTransactionSchema = object({
  merchant: string().min(1, "Merchant name is required"),
  categoryId: string(),
  remarks: string()
});
const createFromSmsSchema = object({
  smsBody: string().min(1, "SMS message is required").refine(
    (s) => s.trim().length > 0,
    "SMS message cannot be only whitespace"
  ),
  sender: string()
});
const createTransactionSchema = object({
  amount: string().min(1, "Amount is required").refine(
    (value) => Number.isFinite(Number(value)),
    "Amount must be a number"
  ).refine((value) => Number(value) > 0, "Amount must be greater than 0"),
  type: _enum(["debit", "credit"]),
  categoryId: string(),
  merchant: string(),
  remarks: string(),
  transactionDate: string().refine(
    (value) => value.length === 0 || Number.isFinite(new Date(value).getTime()),
    "Transaction date is invalid"
  )
});
function EditTransactionForm({
  transaction,
  categories,
  onSubmit,
  isPending,
  onCancel,
  open,
  onOpenChange
}) {
  const form = useForm({
    defaultValues: {
      merchant: transaction.merchant || "",
      categoryId: transaction.category?.id ?? transaction.categoryId ?? "",
      remarks: transaction.remarks || ""
    },
    onSubmit: async ({ value }) => {
      onSubmit(mapEditFormToUpdateBody(value));
    },
    validators: {
      onChange: editTransactionSchema
    }
  });
  const [categoryQuery, setCategoryQuery] = reactExports.useState("");
  const categoryOptions = reactExports.useMemo(
    () => [
      {
        id: "",
        label: "Uncategorized",
        searchLabel: "uncategorized no category"
      },
      ...[...categories].sort((a, b) => a.name.localeCompare(b.name)).map((category) => ({
        id: category.id,
        label: `${category.icon ? `${category.icon} ` : ""}${category.name}`,
        searchLabel: `${category.name} ${category.icon ?? ""}`.toLowerCase()
      }))
    ],
    [categories]
  );
  const visibleCategoryOptions = reactExports.useMemo(() => {
    const normalizedQuery = categoryQuery.trim().toLowerCase();
    if (!normalizedQuery) return categoryOptions;
    return categoryOptions.filter(
      (option) => option.searchLabel.includes(normalizedQuery)
    );
  }, [categoryOptions, categoryQuery]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Transaction" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Make changes to your transaction here. Click save when you're done." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldGroup, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "merchant", children: (field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Merchant" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: field.name,
                    name: field.name,
                    value: field.state.value,
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value),
                    "aria-invalid": isInvalid
                  }
                ),
                isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
              ] });
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "categoryId", children: (field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Ht,
                  {
                    value: field.state.value,
                    onChange: (value) => {
                      if (value == null) return;
                      field.handleChange(value);
                      setCategoryQuery("");
                    },
                    immediate: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ko,
                        {
                          id: field.name,
                          name: field.name,
                          className: "h-9 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          placeholder: "Select a category",
                          displayValue: () => categoryOptions.find(
                            (option) => option.id === field.state.value
                          )?.label ?? "",
                          onChange: (event) => setCategoryQuery(event.target.value),
                          onBlur: field.handleBlur
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Bo, { className: "absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-4 w-4" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Uo, { className: "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md empty:invisible", children: visibleCategoryOptions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1.5 text-sm text-muted-foreground", children: "No categories found" }) : visibleCategoryOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Ho,
                        {
                          value: option.id,
                          className: "group flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm data-[focus]:bg-accent data-[focus]:text-accent-foreground",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: option.label }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 opacity-0 group-data-[selected]:opacity-100" })
                          ]
                        },
                        option.id || "uncategorized"
                      )) })
                    ] })
                  }
                ),
                isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
              ] });
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "remarks", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Remarks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: field.name,
                  name: field.name,
                  value: field.state.value,
                  onBlur: field.handleBlur,
                  onChange: (e) => field.handleChange(e.target.value)
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isPending, children: isPending ? "Saving..." : "Save Changes" })
          ] })
        ]
      }
    )
  ] }) });
}
function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.transactions.$post({
        json: input
      });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.root });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
}
function useCreateTransactionFromSms() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.transactions.sms.$post({ json: input });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.root });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
}
function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { id, ...body } = input;
      const res = await rpc.api.transactions[":id"].$patch({
        param: { id },
        json: body
      });
      return unwrap(res);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.root });
    }
  });
}
function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.transactions[":id"].$delete({
        param: { id: input.id }
      });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.root });
    }
  });
}
export {
  EditTransactionForm as E,
  useDeleteTransaction as a,
  useCreateTransaction as b,
  useCreateTransactionFromSms as c,
  createFromSmsSchema as d,
  createTransactionSchema as e,
  mapCreateFormToCreateBody as m,
  useUpdateTransaction as u
};
