import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useForm } from "../_libs/tanstack__react-form.mjs";
import { B as Button } from "./router-CdED92sw.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-5BUrS7Jk.mjs";
import { F as FieldGroup, a as Field, b as FieldLabel, c as FieldError } from "./field-6_P4ZqLT.mjs";
import { I as Input } from "./input-Cph6uzM7.mjs";
import { a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as rpc, u as unwrap } from "./api-client-CFEv0PPX.mjs";
import { C as CATEGORIES_QUERY_KEYS } from "./queries-DVQ55Cfx.mjs";
import { o as object, b as string } from "../_libs/zod.mjs";
const categorySchema = object({
  name: string().min(1, "Name is required"),
  icon: string()
});
function CategoryForm({
  category,
  open,
  onOpenChange,
  onSubmit,
  isPending,
  onCancel,
  mode
}) {
  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
      icon: category?.icon ?? ""
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        name: value.name.trim(),
        icon: value.icon?.trim() || void 0
      });
    },
    validators: {
      onChange: categorySchema
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: mode === "create" ? "Add Category" : "Edit Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: mode === "create" ? "Create a new custom category. Name is required." : "Update the category name and optional icon." })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "name", children: (field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: field.name,
                    name: field.name,
                    value: field.state.value,
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value),
                    placeholder: "e.g. Groceries",
                    "aria-invalid": isInvalid
                  }
                ),
                isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
              ] });
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "icon", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Icon (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: field.name,
                  name: field.name,
                  value: field.state.value,
                  onBlur: field.handleBlur,
                  onChange: (e) => field.handleChange(e.target.value),
                  placeholder: "e.g. 🛒"
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isPending, children: isPending ? "Saving..." : mode === "create" ? "Create" : "Save" })
          ] })
        ]
      }
    )
  ] }) });
}
function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.categories.$post({
        json: { name: input.name, icon: input.icon }
      });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.root });
    }
  });
}
function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { id, ...body } = input;
      const res = await rpc.api.categories[":id"].$patch({
        param: { id },
        json: body
      });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.root });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  });
}
function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.categories[":id"].$delete({
        param: { id: input.id }
      });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.root });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  });
}
export {
  CategoryForm as C,
  useUpdateCategory as a,
  useDeleteCategory as b,
  useCreateCategory as u
};
