import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as BackButton } from "./BackButton-BEFNqWcj.mjs";
import { B as Badge } from "./badge-CqYiD4HK.mjs";
import { B as Button, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem } from "./router-DlfOSAQe.mjs";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-D5BfrGuE.mjs";
import { I as Input } from "./input-Bu41d3aM.mjs";
import { S as Separator } from "./separator-l7mpVri1.mjs";
import { T as Textarea } from "./textarea-BFyzlqzD.mjs";
import { u as useGetAllCategories } from "./queries-DVQ55Cfx.mjs";
import { b as useMutation, a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { T as TRANSACTIONS_QUERY_KEYS } from "./queries-PZPiYPZ4.mjs";
import { r as rpc, u as unwrap } from "./api-client-CFEv0PPX.mjs";
import { f as formatCurrency } from "./formatCurrency-ChKkaUtT.mjs";
import "./index-CH6UTATS.mjs";
import "./index.mjs";
import "../_libs/hono.mjs";
import "./session-B9_AFGgo.mjs";
import "../_libs/dotenv.mjs";
import "../_libs/postgres.mjs";
import { _ as FileText, L as LoaderCircle, a3 as Upload, C as CircleCheck, N as Trash2, s as ArrowLeft } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/t3-oss__env-core.mjs";
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
import "../_libs/date-fns.mjs";
import "../_libs/drizzle-orm.mjs";
import "node:async_hooks";
import "net";
import "tls";
import "perf_hooks";
import "../_libs/radix-ui__react-separator.mjs";
function useExtractStatement() {
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.statements.extract.$post({
        form: { file: input.file }
      });
      return unwrap(res);
    }
  });
}
function useBulkCreateTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.transactions["bulk-import"].$post({
        json: input
      });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_QUERY_KEYS.root
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
}
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
function toLocalInputValue(date, time) {
  if (!date) return "";
  const t = time ? time.slice(0, 5) : "00:00";
  return `${date}T${t}`;
}
function rowsFromExtraction(result, categories) {
  const byLowerName = new Map(categories.map((c) => [c.name.trim().toLowerCase(), c.id]));
  const uncategorizedId = categories.find((c) => c.name.toLowerCase() === "uncategorized")?.id ?? "";
  return result.transactions.map((txn, index) => {
    const matched = txn.suggestedCategoryName ? byLowerName.get(txn.suggestedCategoryName.trim().toLowerCase()) : void 0;
    return {
      id: `row-${index}-${Date.now()}`,
      include: !txn.duplicateOf,
      duplicateOf: txn.duplicateOf ?? null,
      date: toLocalInputValue(txn.date, txn.time),
      type: txn.type,
      merchant: txn.merchant ?? "",
      categoryId: matched ?? uncategorizedId,
      amount: txn.amount.toString(),
      remarks: txn.remarks ?? "",
      confidence: txn.confidence
    };
  });
}
function ImportStatementPage() {
  const navigate = useNavigate();
  const fileInputRef = reactExports.useRef(null);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [extraction, setExtraction] = reactExports.useState(null);
  const [rows, setRows] = reactExports.useState([]);
  const [dragActive, setDragActive] = reactExports.useState(false);
  const {
    data: categoriesData
  } = useGetAllCategories();
  const categories = reactExports.useMemo(() => [...categoriesData?.categories ?? []].sort((a, b) => a.name.localeCompare(b.name)), [categoriesData]);
  const extractMutation = useExtractStatement();
  const importMutation = useBulkCreateTransactions();
  const handleFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type) && !/\.(pdf|png|jpe?g|webp)$/i.test(file.name)) {
      toast.error("Unsupported file", {
        description: "Upload a PDF or a PNG/JPG/WebP image."
      });
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("File is too large", {
        description: "Statements must be under 10 MB."
      });
      return;
    }
    setSelectedFile(file);
    extractMutation.mutate({
      file
    }, {
      onSuccess: (result) => {
        if (result.transactions.length === 0) {
          toast.error("No transactions found", {
            description: "We couldn't find any transaction rows in this document. Try a clearer photo or a different file."
          });
          setSelectedFile(null);
          return;
        }
        setExtraction(result);
        setRows(rowsFromExtraction(result, categories));
        toast.success(`Found ${result.transactions.length} transaction${result.transactions.length !== 1 ? "s" : ""}`);
      },
      onError: (error) => {
        setSelectedFile(null);
        toast.error("Extraction failed", {
          description: error.message
        });
      }
    });
  };
  const reset = () => {
    setSelectedFile(null);
    setExtraction(null);
    setRows([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const updateRow = (id, patch) => {
    setRows((prev) => prev.map((row) => row.id === id ? {
      ...row,
      ...patch
    } : row));
  };
  const removeRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };
  const includedRows = rows.filter((row) => row.include);
  const totals = reactExports.useMemo(() => {
    let debit = 0;
    let credit = 0;
    for (const row of includedRows) {
      const amount = Number.parseFloat(row.amount);
      if (!Number.isFinite(amount) || amount <= 0) continue;
      if (row.type === "debit") debit += amount;
      else credit += amount;
    }
    return {
      debit,
      credit
    };
  }, [includedRows]);
  const invalidRowCount = includedRows.filter((row) => {
    const amount = Number.parseFloat(row.amount);
    return !Number.isFinite(amount) || amount <= 0;
  }).length;
  const handleConfirm = () => {
    if (invalidRowCount > 0) {
      toast.error("Some rows have invalid amounts", {
        description: "Set an amount greater than 0 or remove those rows."
      });
      return;
    }
    const hasFlaggedIncluded = includedRows.some((row) => row.duplicateOf);
    importMutation.mutate({
      allowDuplicates: hasFlaggedIncluded || void 0,
      transactions: includedRows.map((row) => ({
        amount: Number.parseFloat(row.amount),
        type: row.type,
        merchant: row.merchant.trim() || void 0,
        remarks: row.remarks.trim() || void 0,
        transactionDate: row.date ? new Date(row.date).toISOString() : void 0,
        categoryId: row.categoryId || void 0,
        confidence: row.confidence
      }))
    }, {
      onSuccess: (result) => {
        toast.success(`Imported ${result.created} transaction${result.created !== 1 ? "s" : ""}`);
        navigate({
          to: "/transactions"
        });
      },
      onError: (error) => {
        toast.error("Import failed", {
          description: error.message
        });
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BackButton, { fallback: "/transactions", variant: "ghost", size: "sm", className: "self-start", children: "Back to Transactions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Import from statement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Upload a bank statement (PDF or photo). AI reads it, you review and edit, then import everything at once." })
      ] })
    ] }),
    !extraction ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }),
          "Upload statement"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "PDF exports and photos/scans of paper statements both work. Max 10 MB." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: extractMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Reading your statement…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: selectedFile?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This can take up to a minute for long documents." })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40 cursor-pointer"}`, onDragOver: (e) => {
        e.preventDefault();
        setDragActive(true);
      }, onDragLeave: () => setDragActive(false), onDrop: (e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files?.[0]);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", className: "sr-only", accept: ".pdf,.png,.jpg,.jpeg,.webp", onChange: (e) => handleFile(e.target.files?.[0]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-7 w-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Drop your file here, or click to browse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "PDF, PNG, JPG or WebP · max 10 MB" })
        ] })
      ] }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Review & edit extracted transactions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1", children: [
              selectedFile && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedFile.name }),
              extraction.bankName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Bank: ",
                extraction.bankName
              ] }),
              extraction.accountNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Account: ••",
                extraction.accountNumber.slice(-4)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                rows.length,
                " found · ",
                includedRows.length,
                " selected"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: reset, children: "Start over" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: handleConfirm, disabled: importMutation.isPending || includedRows.length === 0 || invalidRowCount > 0, children: importMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Importing…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-2 h-4 w-4" }),
              "Import ",
              includedRows.length,
              " transaction",
              includedRows.length !== 1 ? "s" : ""
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", children: [
              "Debits ",
              formatCurrency(totals.debit)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-600 hover:bg-green-700", children: [
              "Credits ",
              formatCurrency(totals.credit)
            ] }),
            includedRows.some((row) => row.duplicateOf) && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400", children: "Includes possible duplicates" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setRows((prev) => prev.map((row) => ({
              ...row,
              include: true
            }))), children: "Select all" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setRows((prev) => prev.map((row) => ({
              ...row,
              include: false
            }))), children: "Clear selection" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[980px] text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b text-left text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-4 py-2 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", "aria-label": "Select all rows", checked: rows.length > 0 && includedRows.length === rows.length, onChange: (e) => setRows((prev) => prev.map((row) => ({
              ...row,
              include: e.target.checked
            }))) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-medium", children: "Date & time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-medium", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-medium", children: "Merchant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-medium", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-medium text-right", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-medium", children: "Remarks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-medium", children: "AI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-2 py-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row) => {
            const amountNum = Number.parseFloat(row.amount);
            const invalid = !Number.isFinite(amountNum) || amountNum <= 0;
            const lowConfidence = row.confidence !== void 0 && row.confidence < 0.6;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `border-b align-middle ${row.include ? "" : "opacity-45"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", "aria-label": `Include ${row.merchant || "transaction"}`, checked: row.include, onChange: (e) => updateRow(row.id, {
                include: e.target.checked
              }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: row.date, onChange: (e) => updateRow(row.id, {
                date: e.target.value
              }), className: "h-8 w-[190px]" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: row.type, onValueChange: (value) => updateRow(row.id, {
                type: value
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[104px] capitalize", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "debit", children: "debit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "credit", children: "credit" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: row.merchant, placeholder: "Merchant", onChange: (e) => updateRow(row.id, {
                  merchant: e.target.value
                }), className: "h-8 w-[160px]" }),
                row.duplicateOf && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "mt-1 border-amber-500/50 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400", title: `Possible duplicate of an existing transaction (${row.duplicateOf.merchant ?? "unknown"}, ${row.duplicateOf.amount} NPR)`, children: "Duplicate?" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: row.categoryId || "none", onValueChange: (value) => updateRow(row.id, {
                categoryId: value === "none" ? "" : value
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[170px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Category" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "Uncategorized" }),
                  categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: category.id, children: [
                    category.icon ? `${category.icon} ` : "",
                    category.name
                  ] }, category.id))
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", step: "0.01", "aria-invalid": invalid, value: row.amount, onChange: (e) => updateRow(row.id, {
                amount: e.target.value
              }), className: "h-8 w-[120px] text-right ml-auto" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: row.remarks, placeholder: "—", rows: 1, onChange: (e) => updateRow(row.id, {
                remarks: e.target.value
              }), className: "min-h-8 w-[200px] resize-y text-sm" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: row.confidence !== void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: lowConfidence ? "outline" : "secondary", title: "AI confidence", children: [
                Math.round(row.confidence * 100),
                "%"
              ] }) : null }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-red-600", onClick: () => removeRow(row.id), "aria-label": "Remove row", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
            ] }, row.id);
          }) })
        ] }) }),
        rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-10 text-center text-muted-foreground", children: [
          "Nothing left to review.",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "underline hover:text-foreground", onClick: reset, children: "Upload another file" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 px-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Only selected rows are saved. Dates use this device's time zone." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: reset, asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Use a different file"
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  ImportStatementPage as component
};
