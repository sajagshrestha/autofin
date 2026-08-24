import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as skipToken } from "../_libs/tanstack__query-core.mjs";
import { u as useQuery, a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Badge } from "./badge-uZ57TULk.mjs";
import { u as useAuth, d as Route$8, B as Button, c as cn } from "./router-CvFqzVfm.mjs";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-jswmrxmG.mjs";
import { I as Input } from "./input-DNKpjK_Q.mjs";
import { L as Label } from "./label-DIypfdbq.mjs";
import { T as Textarea } from "./textarea-DnqjHpL7.mjs";
import { r as rpc, u as unwrap } from "./api-client-CFEv0PPX.mjs";
import "./index-CH6UTATS.mjs";
import "./index.mjs";
import "../_libs/hono.mjs";
import "./session-B9_AFGgo.mjs";
import "../_libs/dotenv.mjs";
import "../_libs/postgres.mjs";
import { M as Mail, C as CircleCheck, L as LoaderCircle, R as RefreshCw, v as Funnel, w as Radio, x as CircleX, y as Plug, d as Check, z as Copy, E as ExternalLink, h as Sparkles } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
const TabsContext = reactExports.createContext(null);
const Tabs = reactExports.forwardRef(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = reactExports.useState(
      defaultValue ?? ""
    );
    const currentValue = value ?? internalValue;
    const handleValueChange = reactExports.useCallback(
      (newValue) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [onValueChange]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsContext.Provider,
      {
        value: { value: currentValue, onValueChange: handleValueChange },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("w-full", className), ...props, children })
      }
    );
  }
);
Tabs.displayName = "Tabs";
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = "TabsList";
const TabsTrigger = reactExports.forwardRef(({ className, value, ...props }, ref) => {
  const parent = reactExports.useContext(TabsContext);
  const isActive = parent?.value === value;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      ref,
      type: "button",
      className: cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow" : "hover:bg-background/50",
        className
      ),
      onClick: () => parent?.onValueChange?.(value),
      ...props
    }
  );
});
TabsTrigger.displayName = "TabsTrigger";
const TabsContent = reactExports.forwardRef(({ className, value, ...props }, ref) => {
  const parent = reactExports.useContext(TabsContext);
  if (!parent || parent.value !== value) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      ),
      ...props
    }
  );
});
TabsContent.displayName = "TabsContent";
const GMAIL_QUERY_KEYS = {
  root: ["gmail"],
  authUrl: ["gmail", "auth-url"],
  status: ["gmail", "status"],
  senderFilters: ["gmail", "sender-filters"],
  watchStatus: ["gmail", "watch-status"]
};
function useGetGmailAuthorizationUrl() {
  return useQuery({
    queryKey: GMAIL_QUERY_KEYS.authUrl,
    queryFn: async () => {
      const res = await rpc.api.gmail.authorize.$get();
      return unwrap(res);
    }
  });
}
function useGetGmailConnectionStatus() {
  return useQuery({
    queryKey: GMAIL_QUERY_KEYS.status,
    queryFn: async () => {
      const res = await rpc.api.gmail.status.$get();
      return unwrap(res);
    }
  });
}
function useGetSenderFilters(options) {
  return useQuery({
    queryKey: GMAIL_QUERY_KEYS.senderFilters,
    queryFn: options?.enabled === false ? skipToken : async () => {
      const res = await rpc.api.gmail.filters.senders.$get();
      return unwrap(res);
    }
  });
}
function useGetGmailWatchStatus(options) {
  return useQuery({
    queryKey: GMAIL_QUERY_KEYS.watchStatus,
    queryFn: options?.enabled === false ? skipToken : async () => {
      const res = await rpc.api.gmail.watch.status.$get();
      return unwrap(res);
    }
  });
}
function useDisconnectGmailAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await rpc.api.gmail.revoke.$post();
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GMAIL_QUERY_KEYS.root });
    }
  });
}
function useStartGmailWatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await rpc.api.gmail.watch.start.$post();
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GMAIL_QUERY_KEYS.watchStatus });
    }
  });
}
function useStopGmailWatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await rpc.api.gmail.watch.stop.$post();
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GMAIL_QUERY_KEYS.watchStatus });
    }
  });
}
function useSetSenderFilters() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.gmail.filters.senders.$post({ json: input });
      return unwrap(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GMAIL_QUERY_KEYS.senderFilters
      });
    }
  });
}
const PREFERENCES_QUERY_KEYS = {
  current: ["preferences", "current"]
};
function useGetPreferences() {
  return useQuery({
    queryKey: PREFERENCES_QUERY_KEYS.current,
    queryFn: async () => {
      const res = await rpc.api.preferences.$get();
      return unwrap(res);
    }
  });
}
function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await rpc.api.preferences.$put({ json: input });
      return unwrap(res);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PREFERENCES_QUERY_KEYS.current, data);
    }
  });
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function parseEmailsFromTextarea(text) {
  return text.split("\n").map((line) => line.trim().toLowerCase()).filter((line) => line.length > 0);
}
function validateEmails(emails) {
  const valid = [];
  const invalid = [];
  for (const email of emails) {
    if (EMAIL_REGEX.test(email)) {
      valid.push(email);
    } else {
      invalid.push(email);
    }
  }
  return {
    valid,
    invalid
  };
}
function SettingsPage() {
  const {
    user
  } = useAuth();
  const {
    gmail: gmailCallbackStatus,
    detail: gmailCallbackDetail
  } = Route$8.useSearch();
  const filterEmailsId = reactExports.useId();
  const [filterInput, setFilterInput] = reactExports.useState("");
  const [copiedKey, setCopiedKey] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (gmailCallbackStatus === "connected") {
      toast.success("Gmail connected");
    } else if (gmailCallbackStatus === "error") {
      toast.error("Gmail connection failed", {
        description: gmailCallbackDetail ? decodeURIComponent(gmailCallbackDetail) : "Please try again."
      });
    }
  }, [gmailCallbackStatus, gmailCallbackDetail]);
  const {
    data: authUrlData,
    isLoading: isAuthUrlLoading
  } = useGetGmailAuthorizationUrl();
  const {
    data: connectionStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus
  } = useGetGmailConnectionStatus();
  const {
    data: senderFilters,
    isLoading: isFiltersLoading,
    isFetched: isFiltersFetched
  } = useGetSenderFilters({
    enabled: connectionStatus?.authorized ?? false
  });
  const {
    data: watchStatus
  } = useGetGmailWatchStatus({
    enabled: (connectionStatus?.authorized ?? false) && (senderFilters?.emails?.length ?? 0) > 0
  });
  const {
    data: mcpTokenData
  } = useQuery({
    queryKey: ["integrations", "mcp-token"],
    queryFn: async () => {
      const res = await rpc.api.integrations.mcp.token.$get();
      return unwrap(res);
    }
  });
  const copyValue = (key, value) => {
    void navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };
  const disconnectMutation = useDisconnectGmailAccount();
  const setFiltersMutation = useSetSenderFilters();
  const startWatchMutation = useStartGmailWatch();
  const stopWatchMutation = useStopGmailWatch();
  const isConnected = connectionStatus?.authorized ?? false;
  const isLoading = isAuthUrlLoading || isStatusLoading;
  const emails = senderFilters?.emails ?? [];
  const hasFilters = emails.length > 0;
  const displayFilterValue = filterInput !== "" ? filterInput : emails.join("\n");
  const handleConnectGoogle = () => {
    if (authUrlData?.authorizationUrl) {
      window.location.href = authUrlData.authorizationUrl;
    }
  };
  const handleDisconnectGoogle = () => {
    disconnectMutation.mutate(void 0, {
      onSuccess: () => {
        refetchStatus();
        setFilterInput("");
        toast.success("Google account disconnected");
      },
      onError: (error) => {
        toast.error("Failed to disconnect", {
          description: error.message
        });
      }
    });
  };
  const handleSaveFilters = () => {
    const parsed = parseEmailsFromTextarea(displayFilterValue);
    const {
      valid,
      invalid
    } = validateEmails(parsed);
    if (invalid.length > 0) {
      toast.error("Invalid email addresses", {
        description: invalid.join(", ")
      });
      return;
    }
    setFiltersMutation.mutate({
      emails: valid
    }, {
      onSuccess: () => {
        setFilterInput("");
        toast.success("Filter list saved");
      },
      onError: (error) => {
        toast.error("Failed to save filters", {
          description: error.message
        });
      }
    });
  };
  const handleStartWatching = () => {
    startWatchMutation.mutate(void 0, {
      onSuccess: (data) => {
        toast.success("Gmail watch started", {
          description: `Watching until ${new Date(data.expiration).toLocaleString()}`
        });
      },
      onError: (error) => {
        toast.error("Failed to start watching", {
          description: error.message
        });
      }
    });
  };
  const handleStopWatching = () => {
    stopWatchMutation.mutate(void 0, {
      onSuccess: () => {
        toast.success("Gmail watch stopped");
      },
      onError: (error) => {
        toast.error("Failed to stop watching", {
          description: error.message
        });
      }
    });
  };
  const step1Complete = isConnected;
  const step2Complete = hasFilters;
  const step2Current = isConnected && !hasFilters;
  const step3Complete = watchStatus?.hasWatch ?? false;
  const step3Current = hasFilters && !step3Complete;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-2xl space-y-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "gmail", className: "w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "gmail", children: "Gmail" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "ai", children: "AI Preferences" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "mcp", children: "MCP" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "gmail", className: "mt-6 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between gap-4 md:flex-row md:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Set up Gmail integration in 3 steps." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "px-3 py-1", children: user?.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepCircle, { step: 1, complete: step1Complete, current: !step1Complete, label: "Connect Gmail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepConnector, { active: step1Complete }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepCircle, { step: 2, complete: step2Complete, current: step2Current, label: "Set Filters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepConnector, { active: step2Complete }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepCircle, { step: 3, complete: step3Complete, current: step3Current, label: "Start Watch" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `border-l-4 transition-shadow ${step1Complete ? "border-l-green-500" : "border-l-primary shadow-sm hover:shadow-md"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Step 1: Connect Gmail" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Securely connect your account. We only read emails from senders you specify." })
            ] })
          ] }),
          isConnected && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500 hover:bg-green-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
            "Connected"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg bg-muted/50 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-background p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-green-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: connectionStatus?.emailAddress }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active Connection" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", className: "w-full", onClick: handleDisconnectGoogle, disabled: disconnectMutation.isPending, children: [
            disconnectMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
            "Disconnect"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center space-y-4 py-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-8 w-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xs space-y-1 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No Account Connected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Connect your Gmail to automatically track expenses from bank alerts and receipts." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleConnectGoogle, disabled: isLoading, className: "w-full", size: "lg", children: [
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
            "Connect Gmail"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `border-l-4 transition-shadow ${step2Complete ? "border-l-green-500" : isConnected ? "border-l-primary shadow-sm hover:shadow-md" : "border-l-muted opacity-60"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-5 w-5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Step 2: Set Filter List" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Add sender email addresses to monitor (e.g. bank alerts, noreply@yourbank.com). One per line." })
            ] })
          ] }),
          step2Complete && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500 hover:bg-green-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
            emails.length,
            " filter",
            emails.length !== 1 ? "s" : ""
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-sm text-muted-foreground", children: "Connect Gmail first to set up filters." }) : isFiltersLoading && !isFiltersFetched ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: filterEmailsId, children: "Sender emails (one per line)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: filterEmailsId, placeholder: "alerts@bank.com\nnoreply@anotherbank.com", rows: 5, value: displayFilterValue, onChange: (e) => setFilterInput(e.target.value), className: "font-mono text-sm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSaveFilters, disabled: setFiltersMutation.isPending, className: "w-full", children: [
            setFiltersMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
            "Save Filters"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `border-l-4 transition-shadow ${step3Complete ? "border-l-green-500" : hasFilters ? "border-l-primary shadow-sm hover:shadow-md" : "border-l-muted opacity-60"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-5 w-5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Step 3: Start Watch" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Start watching for new emails. Watch expires every 7 days—check back to renew." })
            ] })
          ] }),
          step3Complete && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500 hover:bg-green-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
            "Watching"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !hasFilters ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-sm text-muted-foreground", children: "Set your filter list first, then start the watch." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          step3Complete && watchStatus?.expiration && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Expires:",
            " ",
            new Date(watchStatus.expiration).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleStartWatching, disabled: startWatchMutation.isPending, className: "flex-1", children: [
              startWatchMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "mr-2 h-4 w-4" }),
              "Start Watch"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleStopWatching, disabled: stopWatchMutation.isPending, className: "flex-1", children: [
              stopWatchMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "mr-2 h-4 w-4" }),
              "Stop Watch"
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "ai", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AiPreferencesCard, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "mcp", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-dashed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { className: "h-5 w-5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Connect AI assistants (MCP)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Let Claude Desktop, Cursor, or any MCP client read your finances through the same tools the advisor uses." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "Advanced" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mcp-url", children: "Server URL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mcp-url", readOnly: true, value: `${typeof window !== "undefined" ? window.location.origin : ""}/api/mcp`, className: "font-mono text-xs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "h-9 w-9 shrink-0", "aria-label": "Copy server URL", onClick: () => copyValue("url", `${window.location.origin}/api/mcp`), children: copiedKey === "url" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mcp-token", children: "Personal access token" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mcp-token", readOnly: true, value: mcpTokenData?.token ?? "", placeholder: isLoading ? "Loading…" : "", className: "font-mono text-xs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "h-9 w-9 shrink-0", disabled: !mcpTokenData?.token, "aria-label": "Copy access token", onClick: () => copyValue("token", mcpTokenData?.token ?? ""), children: copiedKey === "token" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Treat it like a password — it grants read access to your transactions. Rotating MCP_TOKEN_SECRET revokes all tokens." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Example client configuration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed", children: JSON.stringify({
            mcpServers: {
              autofin: {
                type: "http",
                url: `${typeof window !== "undefined" ? window.location.origin : ""}/api/mcp`,
                headers: {
                  Authorization: `Bearer ${mcpTokenData?.token ?? "<your-token>"}`
                }
              }
            }
          }, null, 2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://modelcontextprotocol.io/clients", target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 text-xs text-primary hover:underline", children: [
            "Compatible MCP clients ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
          ] })
        ] })
      ] })
    ] }) })
  ] }) });
}
function AiPreferencesCard() {
  const {
    data: preferences,
    isLoading
  } = useGetPreferences();
  const updateMutation = useUpdatePreferences();
  const [prompt, setPrompt] = reactExports.useState(null);
  const value = prompt ?? preferences?.categoryMappingPrompt ?? "";
  const dirty = prompt !== null && prompt !== (preferences?.categoryMappingPrompt ?? "");
  const handleSave = () => {
    updateMutation.mutate({
      categoryMappingPrompt: value.trim() || null
    }, {
      onSuccess: () => {
        toast.success("AI preferences saved");
        setPrompt(null);
      },
      onError: (err) => {
        toast.error("Failed to save preferences", {
          description: err.message
        });
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Custom category mapping" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Personal rules the AI follows when categorizing your transactions — across SMS/email extraction, statement imports, and the advisor chat." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category-mapping-prompt", children: "Category mapping instructions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "category-mapping-prompt", placeholder: "Examples:\n- Treat every SWIGGY or PATHAO charge as Food & Delivery\n- AWS and Google Cloud charges are always Business Expenses\n- Ignore anything from my landlord (track manually)", rows: 7, maxLength: 4e3, value, onChange: (e) => setPrompt(e.target.value), className: "font-mono text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-right text-xs text-muted-foreground", children: [
          value.length,
          "/4000 characters"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
        dirty && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setPrompt(null), children: "Discard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSave, disabled: updateMutation.isPending || !dirty, children: [
          updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
          "Save preferences"
        ] })
      ] })
    ] }) })
  ] });
}
function StepCircle({
  step,
  complete,
  current,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-medium transition-colors ${complete ? "border-green-500 bg-green-500 text-white" : current ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted text-muted-foreground"}`, children: complete ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }) : step }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label })
  ] });
}
function StepConnector({
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-0.5 flex-1 min-w-[24px] rounded transition-colors ${active ? "bg-green-500" : "bg-muted"}` });
}
export {
  SettingsPage as component
};
