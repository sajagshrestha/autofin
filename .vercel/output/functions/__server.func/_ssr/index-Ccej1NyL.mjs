import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useForm } from "../_libs/tanstack__react-form.mjs";
import { l as Route$2, g as getDateRangeForPeriod, D as DateFilter, B as Button, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem, c as cn, f as buttonVariants } from "./router-DlfOSAQe.mjs";
import { I as Input } from "./input-Bu41d3aM.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-IRlRKAVT.mjs";
import { F as FieldGroup, a as Field, b as FieldLabel, c as FieldError } from "./field-CkkvKn4z.mjs";
import { u as useUpdateTransaction, a as useDeleteTransaction, b as useCreateTransaction, c as useCreateTransactionFromSms, E as EditTransactionForm, d as createFromSmsSchema, e as createTransactionSchema, m as mapCreateFormToCreateBody } from "./mutations-CqWMY8_d.mjs";
import { T as Textarea } from "./textarea-BFyzlqzD.mjs";
import { B as Badge } from "./badge-CqYiD4HK.mjs";
import { C as Card, a as CardContent } from "./card-D5BfrGuE.mjs";
import { D as DataTable, S as Search, N as NoData } from "./data-table-DOxjke_T.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-Bnw94AOm.mjs";
import { L as Label } from "./label-B3fiQjWQ.mjs";
import { D as Dialog$1, a as DialogContent$1, b as DialogClose, c as DialogTitle$1, d as DialogDescription$1, e as DialogPortal, f as DialogOverlay } from "../_libs/radix-ui__react-dialog.mjs";
import { S as Skeleton } from "./skeleton-CnCLv9Na.mjs";
import { u as useGetAllCategories } from "./queries-DVQ55Cfx.mjs";
import { a as useCreateLoan, c as useSettleLoan, u as useGetLoans } from "./mutations-CIoOcxBL.mjs";
import { u as useGetAllTransactions } from "./queries-PZPiYPZ4.mjs";
import { f as formatCurrency } from "./formatCurrency-ChKkaUtT.mjs";
import "./index-CH6UTATS.mjs";
import "./index.mjs";
import "../_libs/hono.mjs";
import "./session-B9_AFGgo.mjs";
import "../_libs/dotenv.mjs";
import "../_libs/postgres.mjs";
import "./api-client-CFEv0PPX.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { Z as SlidersHorizontal, _ as FileText, D as Plus, W as Wallet, $ as MessageSquarePlus, G as EllipsisVertical, J as Eye, K as Pencil, Y as HandCoins, N as Trash2, X, a0 as ChevronsUpDown, d as Check, L as LoaderCircle, a1 as Calendar$1, a2 as Clock3, a as ChevronLeft, b as ChevronRight, c as ChevronDown } from "../_libs/lucide-react.mjs";
import { H as Ht, k as ko, B as Bo, U as Uo, a as Ho } from "../_libs/headlessui__react.mjs";
import { g as getDefaultClassNames, D as DayPicker } from "../_libs/react-day-picker.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__form-core.mjs";
import "../_libs/tanstack__store.mjs";
import "../_libs/tanstack__pacer-lite.mjs";
import "../_libs/@tanstack/devtools-event-client+[...].mjs";
import "../_libs/tanstack__react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/t3-oss__env-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/hono__zod-validator.mjs";
import "../_libs/ai.mjs";
import "../_libs/ai-sdk__gateway.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/zod.mjs";
import "../_libs/vercel__oidc.mjs";
import "path";
import "fs";
import "os";
import "../_libs/opentelemetry__api.mjs";
import "../_libs/unpdf.mjs";
import "../_libs/ai-sdk__anthropic.mjs";
import "../_libs/ai-sdk__google.mjs";
import "../_libs/ai-sdk__openai.mjs";
import "../_libs/inngest.mjs";
import "../_libs/inngest__ai.mjs";
import "../_libs/chalk.mjs";
import "../_libs/ansi-styles.mjs";
import "../_libs/color-convert.mjs";
import "../_libs/color-name.mjs";
import "../_libs/supports-color.mjs";
import "tty";
import "../_libs/has-flag.mjs";
import "../_libs/hash.js.mjs";
import "../_libs/minimalistic-assert.mjs";
import "../_libs/inherits.mjs";
import "../_libs/json-stringify-safe.mjs";
import "../_libs/ms.mjs";
import "../_libs/serialize-error-cjs.mjs";
import "../_libs/strip-ansi.mjs";
import "../_libs/ansi-regex.mjs";
import "../_libs/debug.mjs";
import "../_libs/canonicalize.mjs";
import "node:crypto";
import "../_libs/date-fns-tz.mjs";
import "../_libs/drizzle-orm.mjs";
import "node:async_hooks";
import "net";
import "tls";
import "perf_hooks";
import "../_libs/tanstack__react-table.mjs";
import "../_libs/tanstack__table-core.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/react-aria.mjs";
import "../_libs/react-stately.mjs";
import "../_libs/tanstack__react-virtual.mjs";
import "../_libs/tanstack__virtual-core.mjs";
import "../_libs/floating-ui__react.mjs";
import "../_libs/date-fns__tz.mjs";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          props.showWeekNumber ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md" : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-slot": "calendar",
              ref: rootRef,
              className: cn(className2),
              ...props2
            }
          );
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChevronRight,
              {
                className: cn("size-4", className2),
                ...props2
              }
            );
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { ...props2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
function isValidDate(value) {
  return !!value && Number.isFinite(value.getTime());
}
function toTimeString(date) {
  return format(date, "HH:mm");
}
function mergeDateAndTime(date, timeValue) {
  const [hoursRaw, minutesRaw] = timeValue.split(":");
  const hours = Number.parseInt(hoursRaw ?? "0", 10);
  const minutes = Number.parseInt(minutesRaw ?? "0", 10);
  const next = new Date(date);
  next.setHours(
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    0,
    0
  );
  return next;
}
function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  disabled,
  className
}) {
  const safeValue = isValidDate(value) ? value : void 0;
  const safeValueMs = safeValue?.getTime();
  const timeInputId = reactExports.useId();
  const [timeValue, setTimeValue] = reactExports.useState(
    () => safeValue ? toTimeString(safeValue) : toTimeString(/* @__PURE__ */ new Date())
  );
  reactExports.useEffect(() => {
    if (safeValueMs != null) {
      setTimeValue(toTimeString(new Date(safeValueMs)));
    }
  }, [safeValueMs]);
  const label = reactExports.useMemo(
    () => safeValue ? format(safeValue, "PPP p") : placeholder,
    [safeValue, placeholder]
  );
  const handleDateSelect = (selectedDate) => {
    if (!isValidDate(selectedDate)) {
      onChange(void 0);
      return;
    }
    onChange(mergeDateAndTime(selectedDate, timeValue));
  };
  const handleTimeChange = (nextTimeValue) => {
    setTimeValue(nextTimeValue);
    if (!safeValue) return;
    onChange(mergeDateAndTime(safeValue, nextTimeValue));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        disabled,
        className: cn(
          "w-full justify-start text-left font-normal",
          !safeValue && "text-muted-foreground",
          className
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "mr-2 h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: label })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Calendar,
        {
          mode: "single",
          selected: safeValue,
          onSelect: handleDateSelect,
          initialFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 border-t pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: timeInputId,
            className: "mb-1 flex items-center gap-2 text-sm text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-4 w-4" }),
              "Time"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: timeInputId,
            type: "time",
            value: timeValue,
            onChange: (event) => handleTimeChange(event.target.value),
            className: "h-8 w-full"
          }
        )
      ] })
    ] }) })
  ] });
}
function CreateTransactionForm({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  onCancel,
  categories
}) {
  const form = useForm({
    defaultValues: {
      amount: "",
      type: "debit",
      categoryId: "",
      merchant: "",
      remarks: "",
      transactionDate: (/* @__PURE__ */ new Date()).toISOString()
    },
    onSubmit: async ({ value }) => {
      onSubmit(mapCreateFormToCreateBody(value));
    },
    validators: {
      onChange: createTransactionSchema
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Transaction" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Add a transaction manually when you do not want to use SMS parsing." })
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "amount", children: (field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Amount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: field.name,
                      name: field.name,
                      type: "number",
                      inputMode: "decimal",
                      step: "0.01",
                      placeholder: "0.00",
                      value: field.state.value,
                      onBlur: field.handleBlur,
                      onChange: (e) => field.handleChange(e.target.value),
                      "aria-invalid": isInvalid
                    }
                  ),
                  isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
                ] });
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "type", children: (field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: field.state.value,
                      onValueChange: (value) => field.handleChange(value),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "debit", children: "Debit" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "credit", children: "Credit" })
                        ] })
                      ]
                    }
                  ),
                  isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
                ] });
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "categoryId", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { children: [
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
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "merchant", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Merchant (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: field.name,
                    name: field.name,
                    placeholder: "e.g. BhatBhateni",
                    value: field.state.value,
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value)
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "transactionDate", children: (field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Transaction Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DateTimePicker,
                    {
                      value: field.state.value ? new Date(field.state.value) : void 0,
                      onChange: (date) => field.handleChange(date ? date.toISOString() : "")
                    }
                  ),
                  isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
                ] });
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "remarks", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Remarks (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: field.name,
                  name: field.name,
                  placeholder: "Add notes",
                  value: field.state.value,
                  onBlur: field.handleBlur,
                  onChange: (e) => field.handleChange(e.target.value)
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isPending, children: isPending ? "Creating..." : "Create Transaction" })
          ] })
        ]
      }
    )
  ] }) });
}
function CreateTransactionFromSmsForm({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  onCancel
}) {
  const form = useForm({
    defaultValues: {
      smsBody: "",
      sender: ""
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        smsBody: value.smsBody.trim(),
        ...value.sender?.trim() && { sender: value.sender.trim() }
      });
    },
    validators: {
      onChange: createFromSmsSchema
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create transaction from SMS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Paste an SMS message (e.g. from your bank) and we'll extract the transaction details using AI." })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "smsBody", children: (field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { "data-invalid": isInvalid, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "SMS message" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: field.name,
                    name: field.name,
                    placeholder: "e.g. Your debit card xxx1234 was used for Rs 500 at MERCHANT on 01 Jan 2025",
                    value: field.state.value,
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value),
                    rows: 4,
                    className: "resize-none",
                    "aria-invalid": isInvalid
                  }
                ),
                isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { errors: field.state.meta.errors })
              ] });
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "sender", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: field.name, children: "Sender (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: field.name,
                  name: field.name,
                  placeholder: "e.g. AD-BANK",
                  value: field.state.value,
                  onBlur: field.handleBlur,
                  onChange: (e) => field.handleChange(e.target.value)
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isPending, children: isPending ? "Creating..." : "Create" })
          ] })
        ]
      }
    )
  ] }) });
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog$1, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogOverlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent$1,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogClose, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogTitle$1,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogDescription$1,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
const ALL_CATEGORIES_FILTER = "all";
const UNCATEGORIZED_FILTER = "uncategorized";
const sortOptions = [{
  value: "none",
  label: "No sorting"
}, {
  value: "transactionDate",
  label: "Date & time"
}, {
  value: "amount",
  label: "Amount"
}, {
  value: "merchant",
  label: "Merchant"
}, {
  value: "category",
  label: "Category"
}, {
  value: "bankName",
  label: "Bank"
}, {
  value: "remarks",
  label: "Remarks"
}];
function TransactionsPage() {
  const {
    period,
    startDate,
    endDate
  } = Route$2.useSearch();
  const [sorting, setSorting] = reactExports.useState([]);
  const [globalFilter, setGlobalFilter] = reactExports.useState("");
  const [pagination, setPagination] = reactExports.useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [categoryFilter, setCategoryFilter] = reactExports.useState(ALL_CATEGORIES_FILTER);
  const [categoryQuery, setCategoryQuery] = reactExports.useState("");
  const [editingTransaction, setEditingTransaction] = reactExports.useState(null);
  const [deletingTransaction, setDeletingTransaction] = reactExports.useState(null);
  const [filtersSheetOpen, setFiltersSheetOpen] = reactExports.useState(false);
  const [createOptionsOpen, setCreateOptionsOpen] = reactExports.useState(false);
  const [loanTrackingTarget, setLoanTrackingTarget] = reactExports.useState(null);
  const [settlementTarget, setSettlementTarget] = reactExports.useState(null);
  const [manualDialogOpen, setManualDialogOpen] = reactExports.useState(false);
  const [smsDialogOpen, setSmsDialogOpen] = reactExports.useState(false);
  const navigate = useNavigate();
  const searchNavigate = Route$2.useNavigate();
  const {
    data: transactionsData,
    isLoading
  } = useGetAllTransactions({
    startDate,
    endDate
  });
  const {
    data: categoriesData
  } = useGetAllCategories();
  const handlePeriodChange = reactExports.useCallback((newPeriod) => {
    const range = getDateRangeForPeriod(newPeriod);
    searchNavigate({
      search: {
        period: newPeriod,
        startDate: range.startDate,
        endDate: range.endDate
      }
    });
  }, [searchNavigate]);
  const handleDateRangeChange = reactExports.useCallback((range) => {
    searchNavigate({
      search: (prev) => ({
        ...prev,
        startDate: range.startDate,
        endDate: range.endDate
      })
    });
  }, [searchNavigate]);
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const createLoanMutation = useCreateLoan();
  const settleByTxnMutation = useSettleLoan();
  const {
    data: loansData
  } = useGetLoans();
  const outstandingLoans = (loansData?.loans ?? []).filter((loan) => loan.status === "outstanding");
  const createMutation = useCreateTransaction();
  const createFromSmsMutation = useCreateTransactionFromSms();
  const transactions = transactionsData?.transactions || [];
  const categories = categoriesData?.categories || [];
  const sortedCategories = reactExports.useMemo(() => [...categories].sort((a, b) => a.name.localeCompare(b.name)), [categories]);
  const categoryFilterOptions = reactExports.useMemo(() => [{
    id: ALL_CATEGORIES_FILTER,
    label: "All categories",
    searchLabel: "all categories"
  }, {
    id: UNCATEGORIZED_FILTER,
    label: "Uncategorized",
    searchLabel: "uncategorized"
  }, ...sortedCategories.map((category) => ({
    id: category.id,
    label: `${category.icon ? `${category.icon} ` : ""}${category.name}`,
    searchLabel: `${category.name} ${category.icon ?? ""}`.toLowerCase()
  }))], [sortedCategories]);
  const visibleCategoryOptions = reactExports.useMemo(() => {
    const normalizedQuery = categoryQuery.trim().toLowerCase();
    if (!normalizedQuery) return categoryFilterOptions;
    return categoryFilterOptions.filter((option) => option.searchLabel.includes(normalizedQuery));
  }, [categoryFilterOptions, categoryQuery]);
  const selectedCategoryOption = reactExports.useMemo(() => categoryFilterOptions.find((option) => option.id === categoryFilter) ?? categoryFilterOptions[0], [categoryFilter, categoryFilterOptions]);
  const filteredTransactions = reactExports.useMemo(() => {
    if (categoryFilter === ALL_CATEGORIES_FILTER) {
      return transactions;
    }
    if (categoryFilter === UNCATEGORIZED_FILTER) {
      return transactions.filter((transaction) => !transaction.category?.id && !transaction.categoryId);
    }
    return transactions.filter((transaction) => transaction.category?.id === categoryFilter || transaction.categoryId === categoryFilter);
  }, [transactions, categoryFilter]);
  const noDataDescription = categoryFilter === ALL_CATEGORIES_FILTER ? "Get started by adding a transaction or creating one from SMS." : "Try a different category filter, or add/create a transaction.";
  const handleCategoryFilterChange = reactExports.useCallback((value) => {
    if (!value) return;
    setCategoryFilter(value);
    setCategoryQuery("");
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0
    }));
  }, []);
  const handleSearchChange = reactExports.useCallback((value) => {
    setGlobalFilter(value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0
    }));
  }, []);
  const handleSortingChange = reactExports.useCallback((updater) => {
    setSorting((prev) => typeof updater === "function" ? updater(prev) : updater);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0
    }));
  }, []);
  const handleFiltersSheetOpenChange = reactExports.useCallback((open) => {
    setFiltersSheetOpen(open);
    if (!open) {
      setCategoryQuery("");
    }
  }, []);
  const clearFilters = reactExports.useCallback(() => {
    handleCategoryFilterChange(ALL_CATEGORIES_FILTER);
    handleSortingChange([]);
  }, [handleCategoryFilterChange, handleSortingChange]);
  const openCreateManual = reactExports.useCallback(() => {
    setCreateOptionsOpen(false);
    setManualDialogOpen(true);
  }, []);
  const openCreateFromSms = reactExports.useCallback(() => {
    setCreateOptionsOpen(false);
    setSmsDialogOpen(true);
  }, []);
  const openImportStatement = reactExports.useCallback(() => {
    setCreateOptionsOpen(false);
    navigate({
      to: "/transactions/import"
    });
  }, [navigate]);
  const handleSortOptionChange = reactExports.useCallback((value) => {
    if (value === "none") {
      handleSortingChange([]);
      return;
    }
    handleSortingChange((prev) => {
      const existing = prev[0];
      const defaultDesc = value === "transactionDate" || value === "amount";
      return [{
        id: value,
        desc: existing?.id === value ? existing.desc : defaultDesc
      }];
    });
  }, [handleSortingChange]);
  const toggleSortDirection = reactExports.useCallback(() => {
    handleSortingChange((prev) => {
      if (!prev[0]) {
        return [{
          id: "transactionDate",
          desc: true
        }];
      }
      return [{
        ...prev[0],
        desc: !prev[0].desc
      }];
    });
  }, [handleSortingChange]);
  const mobileSearchFilteredTransactions = reactExports.useMemo(() => {
    const normalizedSearch = globalFilter.trim().toLowerCase();
    if (!normalizedSearch) return filteredTransactions;
    return filteredTransactions.filter((transaction) => {
      const searchText = [transaction.merchant ?? "", transaction.category?.name ?? "Uncategorized", transaction.bankName ?? "", transaction.remarks ?? "", transaction.amount ?? "", transaction.currency ?? "", transaction.type ?? "", transaction.transactionDate ? format(new Date(transaction.transactionDate), "PPp") : ""].join(" ").toLowerCase();
      return searchText.includes(normalizedSearch);
    });
  }, [filteredTransactions, globalFilter]);
  const mobileSortedTransactions = reactExports.useMemo(() => {
    const sorted = [...mobileSearchFilteredTransactions];
    const sortState = sorting[0];
    if (!sortState) return sorted;
    const getSortableValue = (transaction) => {
      switch (sortState.id) {
        case "transactionDate":
          return transaction.transactionDate ? new Date(transaction.transactionDate).getTime() : 0;
        case "amount":
          return Number(transaction.amount ?? "0");
        case "merchant":
          return (transaction.merchant ?? "").toLowerCase();
        case "category":
          return (transaction.category?.name ?? "Uncategorized").toLowerCase();
        case "bankName":
          return (transaction.bankName ?? "").toLowerCase();
        case "remarks":
          return (transaction.remarks ?? "").toLowerCase();
        default:
          return "";
      }
    };
    sorted.sort((a, b) => {
      const left = getSortableValue(a);
      const right = getSortableValue(b);
      if (typeof left === "number" && typeof right === "number") {
        return left - right;
      }
      return String(left).localeCompare(String(right));
    });
    if (sortState.desc) {
      sorted.reverse();
    }
    return sorted;
  }, [mobileSearchFilteredTransactions, sorting]);
  const mobilePageCount = Math.max(1, Math.ceil(mobileSortedTransactions.length / pagination.pageSize));
  const mobilePageIndex = Math.min(pagination.pageIndex, mobilePageCount - 1);
  reactExports.useEffect(() => {
    if (pagination.pageIndex !== mobilePageIndex) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: mobilePageIndex
      }));
    }
  }, [pagination.pageIndex, mobilePageIndex]);
  const mobilePageTransactions = reactExports.useMemo(() => {
    const start = mobilePageIndex * pagination.pageSize;
    return mobileSortedTransactions.slice(start, start + pagination.pageSize);
  }, [mobilePageIndex, mobileSortedTransactions, pagination.pageSize]);
  const renderCategoryFilterCombobox = (widthClassName) => /* @__PURE__ */ jsxRuntimeExports.jsx(Ht, { value: categoryFilter, onChange: handleCategoryFilterChange, immediate: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${widthClassName}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ko, { className: "h-8 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", placeholder: "Filter by category", displayValue: () => selectedCategoryOption?.label ?? "", onChange: (event) => setCategoryQuery(event.target.value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Bo, { className: "absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Uo, { className: "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md empty:invisible", children: visibleCategoryOptions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1.5 text-sm text-muted-foreground", children: "No categories found" }) : visibleCategoryOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Ho, { value: option.id, className: "group flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm data-[focus]:bg-accent data-[focus]:text-accent-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: option.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 opacity-0 group-data-[selected]:opacity-100" })
    ] }, option.id)) })
  ] }) });
  const renderTransactionActions = (transaction, align = "end") => /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Open menu" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/transactions/$transactionId", params: {
        transactionId: transaction.id
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-2 h-4 w-4" }),
        "View details"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setEditingTransaction(transaction), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-2 h-4 w-4" }),
        "Edit"
      ] }),
      !transaction.loanId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setLoanTrackingTarget(transaction), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HandCoins, { className: "mr-2 h-4 w-4" }),
          "Track as loan"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setSettlementTarget(transaction), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "mr-2 h-4 w-4" }),
          "Track as settlement"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setDeletingTransaction(transaction), className: "text-red-600 focus:text-red-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-2 h-4 w-4" }),
        "Delete"
      ] })
    ] })
  ] });
  const columns = [{
    id: "transactionDate",
    accessorFn: (row) => row.transactionDate ? new Date(row.transactionDate).getTime() : 0,
    header: "Date & time",
    cell: ({
      row
    }) => {
      const date = row.original.transactionDate;
      return date ? format(new Date(date), "PPp") : "N/A";
    }
  }, {
    accessorKey: "merchant",
    header: "Merchant",
    cell: ({
      row
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 font-medium", children: [
      row.original.loanId && /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 shrink-0 text-primary", "aria-label": "Part of a tracked loan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: row.getValue("merchant") || "Unknown" })
    ] })
  }, {
    id: "category",
    accessorFn: (row) => row.category?.name || "Uncategorized",
    header: "Category",
    cell: ({
      row
    }) => {
      const category = row.original.category;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: category ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "font-normal", children: [
        category.icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: category.icon }),
        category.name
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "Uncategorized" }) });
    }
  }, {
    accessorKey: "bankName",
    header: "Bank",
    cell: ({
      row
    }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: row.getValue("bankName") || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "-" }) })
  }, {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({
      row
    }) => {
      const remarks = row.getValue("remarks");
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[200px] truncate", title: remarks || void 0, children: remarks || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "-" }) });
    }
  }, {
    accessorKey: "amount",
    header: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: "Amount" }),
    sortingFn: (rowA, rowB, columnId) => Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId)),
    cell: ({
      row
    }) => {
      const amount = parseFloat(row.getValue("amount") || "0");
      const formatted = formatCurrency(amount, row.original.currency || "NPR");
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right font-medium", children: formatted });
    }
  }, {
    id: "actions",
    cell: ({
      row
    }) => {
      const transaction = row.original;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), role: "presentation", children: renderTransactionActions(transaction) });
    }
  }];
  const handleDelete = () => {
    if (!deletingTransaction) return;
    deleteMutation.mutate({
      id: deletingTransaction.id
    }, {
      onSuccess: () => {
        toast.success("Transaction deleted");
        setDeletingTransaction(null);
      },
      onError: (error) => {
        toast.error("Failed to delete transaction", {
          description: error.message
        });
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto space-y-8 min-w-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Transactions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "View and manage your tracked expenses." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DateFilter, { period, startDate, endDate, onPeriodChange: handlePeriodChange, onDateRangeChange: handleDateRangeChange })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { columns, data: filteredTransactions, isLoading, sorting: {
        state: sorting,
        onSortingChange: handleSortingChange
      }, pagination: {
        state: pagination,
        options: {
          onPaginationChange: setPagination,
          rowCount: filteredTransactions.length
        }
      }, search: {
        value: globalFilter,
        onChange: handleSearchChange
      }, headerClassName: "w-full sm:w-full justify-between", headerButtons: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setFiltersSheetOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "mr-2 h-4 w-4" }),
          "Filters"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => navigate({
          to: "/transactions/import"
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-2 h-4 w-4" }),
          "Import"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setCreateOptionsOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Create transaction"
        ] })
      ] }), noData: {
        title: isLoading ? "Loading transactions..." : "No transactions found",
        description: noDataDescription
      }, onRowClick: (row) => navigate({
        to: "/transactions/$transactionId",
        params: {
          transactionId: row.original.id
        }
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 md:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { value: globalFilter, onChange: (event) => handleSearchChange(event.target.value), placeholder: "Search...", className: "h-9 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setFiltersSheetOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "mr-2 h-4 w-4" }),
              "Filters"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => navigate({
              to: "/transactions/import"
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-2 h-4 w-4" }),
              "Import"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setCreateOptionsOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "Create transaction"
            ] })
          ] })
        ] }) }),
        isLoading ? new Array(pagination.pageSize).fill(null).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" })
        ] }) }, index)) : mobilePageTransactions.length ? mobilePageTransactions.map((transaction) => {
          const amount = Number(transaction.amount ?? "0");
          const formattedAmount = formatCurrency(amount, transaction.currency || "NPR");
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "cursor-pointer", onClick: () => navigate({
            to: "/transactions/$transactionId",
            params: {
              transactionId: transaction.id
            }
          }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 truncate font-medium", children: [
                  transaction.loanId && /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3 shrink-0 text-primary", "aria-label": "Part of a tracked loan" }),
                  transaction.merchant || "Unknown"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: transaction.transactionDate ? format(new Date(transaction.transactionDate), "PPp") : "N/A" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: formattedAmount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: (event) => event.stopPropagation(), onKeyDown: (event) => event.stopPropagation(), role: "presentation", children: renderTransactionActions(transaction, "end") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              transaction.category ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "font-normal", children: [
                transaction.category.icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: transaction.category.icon }),
                transaction.category.name
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm italic", children: "Uncategorized" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "uppercase", children: transaction.type })
            ] }),
            transaction.bankName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Bank: ",
              transaction.bankName
            ] }) : null,
            transaction.remarks ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: transaction.remarks }) : null
          ] }) }, transaction.id);
        }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NoData, { title: "No transactions found", description: noDataDescription, isSearchResults: !!globalFilter }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-evenly border rounded-xl px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setPagination((prev) => ({
            ...prev,
            pageIndex: Math.max(0, mobilePageIndex - 1)
          })), disabled: mobilePageIndex === 0, children: "Previous" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 text-center text-sm font-semibold text-muted-foreground", children: [
            "Page ",
            mobilePageIndex + 1,
            " of ",
            mobilePageCount.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setPagination((prev) => ({
            ...prev,
            pageIndex: Math.min(mobilePageCount - 1, mobilePageIndex + 1)
          })), disabled: mobilePageIndex >= mobilePageCount - 1, children: "Next" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: filtersSheetOpen, onOpenChange: handleFiltersSheetOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "sm:max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Filter by category and control sorting for transactions." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Category" }),
            renderCategoryFilterCombobox("w-full")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Sort by" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sorting[0]?.id ?? "none", onValueChange: handleSortOptionChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort by" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sortOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Direction" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: toggleSortDirection, disabled: !sorting[0], className: "w-full justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: sorting[0]?.desc ? "Descending" : "Ascending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: sorting[0] ? "Tap to toggle" : "Select sort first" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: clearFilters, children: "Clear filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleFiltersSheetOpenChange(false), children: "Apply" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOptionsOpen, onOpenChange: setCreateOptionsOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create transaction" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Choose how you want to add a transaction." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "justify-start", onClick: openCreateManual, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Add manually"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "justify-start", onClick: openCreateFromSms, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquarePlus, { className: "mr-2 h-4 w-4" }),
            "Create from SMS"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "justify-start", onClick: openImportStatement, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-2 h-4 w-4" }),
            "Import from statement (PDF/image)"
          ] })
        ] })
      ] }) }),
      editingTransaction && /* @__PURE__ */ jsxRuntimeExports.jsx(EditTransactionForm, { transaction: editingTransaction, categories, open: !!editingTransaction, onOpenChange: (open) => !open && setEditingTransaction(null), onSubmit: (body) => {
        updateMutation.mutate({
          id: editingTransaction.id,
          ...body
        }, {
          onSuccess: () => {
            toast.success("Transaction updated");
            setEditingTransaction(null);
          },
          onError: (error) => {
            toast.error("Failed to update transaction", {
              description: error.message
            });
          }
        });
      }, isPending: updateMutation.isPending, onCancel: () => setEditingTransaction(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreateTransactionFromSmsForm, { open: smsDialogOpen, onOpenChange: setSmsDialogOpen, onSubmit: (body) => {
        createFromSmsMutation.mutate(body, {
          onSuccess: (data) => {
            toast.success("Transaction created from SMS");
            if (data?.duplicateOf) {
              toast.warning("Possible duplicate", {
                description: `Matches an existing ${data.duplicateOf.amount} NPR transaction from ${data.duplicateOf.transactionDate ? new Date(data.duplicateOf.transactionDate).toLocaleDateString() : "an unknown date"}.`
              });
            }
            setSmsDialogOpen(false);
          },
          onError: (error) => {
            toast.error("Failed to create transaction", {
              description: error.message
            });
          }
        });
      }, isPending: createFromSmsMutation.isPending, onCancel: () => setSmsDialogOpen(false) }, String(smsDialogOpen)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreateTransactionForm, { open: manualDialogOpen, onOpenChange: setManualDialogOpen, categories, onSubmit: (body) => {
        createMutation.mutate(body, {
          onSuccess: (data) => {
            toast.success("Transaction created");
            if (data?.duplicateOf) {
              toast.warning("Possible duplicate", {
                description: `Matches an existing ${data.duplicateOf.amount} NPR transaction from ${data.duplicateOf.transactionDate ? new Date(data.duplicateOf.transactionDate).toLocaleDateString() : "an unknown date"}.`
              });
            }
            setManualDialogOpen(false);
          },
          onError: (error) => {
            toast.error("Failed to create transaction", {
              description: error.message
            });
          }
        });
      }, isPending: createMutation.isPending, onCancel: () => setManualDialogOpen(false) }, String(manualDialogOpen)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!loanTrackingTarget, onOpenChange: (o) => !o && setLoanTrackingTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Track as loan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            loanTrackingTarget?.type === "debit" ? "This debit becomes money you GAVE." : "This credit becomes money you TOOK.",
            " ",
            "Amount:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: formatCurrency(Number(loanTrackingTarget?.amount ?? "0")) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoanTrackingFields, { defaultCounterparty: loanTrackingTarget?.merchant || void 0, onSubmit: (fields) => {
          if (!loanTrackingTarget) return;
          createLoanMutation.mutate({
            counterpartyName: fields.counterpartyName,
            direction: loanTrackingTarget.type === "debit" ? "given" : "taken",
            principalAmount: Number(loanTrackingTarget.amount),
            originTransactionId: loanTrackingTarget.id,
            dueDate: fields.dueDate || void 0
          }, {
            onSuccess: () => {
              toast.success("Tracked as a loan");
              setLoanTrackingTarget(null);
            },
            onError: (err) => {
              toast.error("Failed to track loan", {
                description: err.message
              });
            }
          });
        }, isPending: createLoanMutation.isPending })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!settlementTarget, onOpenChange: (o) => !o && setSettlementTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Track as settlement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            "Link this",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
              formatCurrency(Number(settlementTarget?.amount ?? "0")),
              " ",
              settlementTarget?.type
            ] }),
            " ",
            "transaction to an outstanding loan as a repayment."
          ] })
        ] }),
        outstandingLoans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-2 text-sm text-muted-foreground", children: "No outstanding loans to settle. Track one first from the Loans page or via “Track as loan”." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LoanSelectFields, { loans: outstandingLoans, onSubmit: (loanId) => {
          if (!settlementTarget) return;
          settleByTxnMutation.mutate({
            id: loanId,
            transactionId: settlementTarget.id
          }, {
            onSuccess: () => {
              toast.success("Tracked as settlement");
              setSettlementTarget(null);
            },
            onError: (err) => {
              toast.error("Failed to link settlement", {
                description: err.message
              });
            }
          });
        }, isPending: settleByTxnMutation.isPending })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deletingTransaction, onOpenChange: (open) => !open && setDeletingTransaction(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Are you sure?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            "This action cannot be undone. This will permanently delete the transaction for",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: deletingTransaction?.merchant }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeletingTransaction(null), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: deleteMutation.isPending, children: deleteMutation.isPending ? "Deleting..." : "Delete" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
function LoanTrackingFields({
  defaultCounterparty,
  onSubmit,
  isPending
}) {
  const [counterpartyName, setCounterpartyName] = reactExports.useState(defaultCounterparty ?? "");
  const [dueDate, setDueDate] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "track-loan-counterparty", children: "Counterparty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "track-loan-counterparty", placeholder: "Who is this with?", value: counterpartyName, onChange: (e) => setCounterpartyName(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "track-loan-due", children: "Due date (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "track-loan-due", type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => onSubmit({
      counterpartyName,
      dueDate
    }), disabled: isPending, children: [
      isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
      "Track loan"
    ] }) })
  ] });
}
function LoanSelectFields({
  loans,
  onSubmit,
  isPending
}) {
  const [loanId, setLoanId] = reactExports.useState(loans[0]?.id ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "settle-loan-select", children: "Outstanding loan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "settle-loan-select", value: loanId, onChange: (e) => setLoanId(e.target.value), className: "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40", children: loans.map((loan) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: loan.id, children: [
        loan.counterpartyName,
        " — ",
        formatCurrency(loan.remainingAmount),
        " ",
        "remaining (",
        loan.direction,
        ")"
      ] }, loan.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => onSubmit(loanId), disabled: isPending || !loanId, children: [
      isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
      "Link as repayment"
    ] }) })
  ] });
}
export {
  TransactionsPage as component
};
