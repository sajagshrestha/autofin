import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as defineChart, l as lineY, C as Chart, b as barX, p as pie, a as polar, r as radialArc, c as areaY, t as tooltip, s as scaleLinear, e as scalePoint, f as scaleBand } from "../_libs/tanstack__charts.mjs";
import { C as Card, b as CardHeader, a as CardContent, c as CardTitle } from "./card-D5BfrGuE.mjs";
import { f as formatCurrency, a as formatCurrencyShort } from "./formatCurrency-ChKkaUtT.mjs";
import { B as Badge } from "./badge-CqYiD4HK.mjs";
import { b as Route$9, g as getDateRangeForPeriod, D as DateFilter } from "./router-DlfOSAQe.mjs";
import { S as Skeleton } from "./skeleton-CnCLv9Na.mjs";
import { u as useGetAllTransactions } from "./queries-PZPiYPZ4.mjs";
import "../_libs/sonner.mjs";
import "./index-CH6UTATS.mjs";
import "./index.mjs";
import "../_libs/hono.mjs";
import "./session-B9_AFGgo.mjs";
import "../_libs/dotenv.mjs";
import "../_libs/postgres.mjs";
import "./api-client-CFEv0PPX.mjs";
import { i as eachMonthOfInterval, f as format, M as eachDayOfInterval, N as eachWeekOfInterval, F as startOfWeek } from "../_libs/date-fns.mjs";
import { t as ArrowDownRight, u as ArrowUpRight, P as PiggyBank, f as CreditCard, i as TrendingUp } from "../_libs/lucide-react.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/drizzle-orm.mjs";
import "node:async_hooks";
import "net";
import "tls";
import "perf_hooks";
const CHART_COLORS = [
  "#2563eb",
  // blue
  "#16a34a",
  // green
  "#f59e0b",
  // amber
  "#dc2626",
  // red
  "#9333ea",
  // violet
  "#0d9488",
  // teal
  "#ea580c",
  // orange
  "#db2777",
  // pink
  "#65a30d",
  // lime
  "#4f46e5"
  // indigo
];
const LINE_COLOR = "#3b82f6";
const INCOME_COLOR = "#22c55e";
const EXPENSES_COLOR = "#ef4444";
const BAR_PRIMARY = "#2563eb";
const BAR_SECONDARY = "#6366f1";
function pickChartColor(index) {
  return CHART_COLORS[index % CHART_COLORS.length];
}
function BankBarChart({ data }) {
  const definition = reactExports.useMemo(() => {
    return defineChart({
      marks: [
        barX(data, {
          x: "amount",
          y: "name",
          fill: BAR_PRIMARY,
          radius: 4,
          maxThickness: 26
        })
      ],
      x: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: {
          ticks: { format: (value) => formatCurrencyShort(Number(value)) }
        }
      },
      y: { scale: () => scaleBand().padding(0.25) },
      focus: "nearest-y",
      tooltip: {
        use: tooltip,
        items: [
          "y",
          {
            channel: "x",
            label: "Spent",
            text: (point) => formatCurrency(point.xValue)
          }
        ]
      }
    });
  }, [data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow min-w-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Spending by Bank" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Chart,
      {
        definition,
        height: 300,
        ariaLabel: "Spending by bank"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] flex items-center justify-center text-muted-foreground", children: "No bank data available" }) })
  ] });
}
function CategoryBarChart({ data }) {
  const definition = reactExports.useMemo(() => {
    return defineChart({
      marks: [
        barX(data, {
          x: "value",
          y: "name",
          fill: BAR_SECONDARY,
          radius: 4,
          maxThickness: 26
        })
      ],
      x: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: {
          ticks: { format: (value) => formatCurrencyShort(Number(value)) }
        }
      },
      y: { scale: () => scaleBand().padding(0.25) },
      focus: "nearest-y",
      tooltip: {
        use: tooltip,
        items: [
          "y",
          {
            channel: "x",
            label: "Spent",
            text: (point) => formatCurrency(point.xValue)
          }
        ]
      }
    });
  }, [data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow min-w-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Spending by Category (Bar)" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Chart,
      {
        definition,
        height: Math.max(300, data.length * 44),
        ariaLabel: "Spending by category"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] flex items-center justify-center text-muted-foreground", children: "No category data available" }) })
  ] });
}
function CategoryPieChart({ data }) {
  const definition = reactExports.useMemo(() => {
    const slices = pie(data, { value: "value" });
    return defineChart({
      marks: [
        polar({
          inset: 8,
          radiusRatio: 0.9,
          marks: [
            radialArc(slices, {
              innerRadius: ({ radius }) => radius * 0.58,
              cornerRadius: 4,
              color: "name",
              key: "name"
            })
          ]
        })
      ],
      color: {
        domain: data.map((row) => row.name),
        range: data.map((row) => row.fill)
      },
      tooltip: {
        use: tooltip,
        items: [
          {
            field: "name",
            label: "Category"
          },
          {
            channel: "y",
            label: "Spent",
            text: (point) => formatCurrency(Number(point.yValue))
          }
        ]
      }
    });
  }, [data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow min-w-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Spending by Category" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[350px] mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Chart,
        {
          definition,
          height: 350,
          ariaLabel: "Spending share by category"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: data.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "secondary",
          className: "flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "w-2 h-2 rounded-full",
                style: { backgroundColor: item.fill }
              }
            ),
            item.name
          ]
        },
        item.name
      )) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[350px] flex items-center justify-center text-muted-foreground", children: "No category data available" }) })
  ] });
}
function MonthlyTrendsChart({ data }) {
  const definition = reactExports.useMemo(() => {
    const rows = data.flatMap((d) => [
      { month: d.month, kind: "Income", amount: d.income },
      { month: d.month, kind: "Expenses", amount: d.expenses }
    ]);
    return defineChart({
      marks: [
        areaY(rows, {
          x: "month",
          y1: 0,
          y2: "amount",
          z: "kind",
          fillOpacity: 0.3
        }),
        lineY(rows, {
          x: "month",
          y: "amount",
          z: "kind",
          strokeWidth: 2
        })
      ],
      x: { scale: () => scalePoint().padding(0.35) },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: {
          ticks: { format: (value) => formatCurrencyShort(Number(value)) }
        }
      },
      color: {
        domain: ["Expenses", "Income"],
        range: [EXPENSES_COLOR, INCOME_COLOR]
      },
      focus: "group-x",
      tooltip: {
        use: tooltip,
        items: [
          {
            channel: "y",
            label: "Amount",
            text: (point) => formatCurrency(point.yValue)
          }
        ]
      }
    });
  }, [data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow min-w-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }),
      "Monthly Trends"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Chart,
      {
        definition,
        height: 300,
        ariaLabel: "Monthly income and expenses trends"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] flex items-center justify-center text-muted-foreground", children: "No transaction data available" }) })
  ] });
}
function SpendingLineChart({
  data,
  periodLabel,
  granularity = "day"
}) {
  const definition = reactExports.useMemo(() => {
    return defineChart({
      marks: [
        lineY(data, {
          x: "label",
          y: "spending",
          stroke: LINE_COLOR,
          strokeWidth: 2
        })
      ],
      x: { scale: () => scalePoint().padding(0.35) },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: {
          ticks: { format: (value) => formatCurrencyShort(Number(value)) }
        }
      },
      focus: "nearest-x",
      tooltip: {
        use: tooltip,
        items: [
          "x",
          {
            channel: "y",
            label: "Spending",
            text: (point) => formatCurrency(point.yValue)
          }
        ]
      }
    });
  }, [data]);
  const perLabel = granularity === "month" ? "per month" : "per day";
  const subtitle = periodLabel ? `Spending ${perLabel} · ${periodLabel}` : `Spending ${perLabel}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow min-w-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }),
        "Spending"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4", children: data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Chart,
      {
        definition,
        height: 300,
        ariaLabel: "Spending over time"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] flex items-center justify-center text-muted-foreground", children: "No spending data for this period" }) })
  ] });
}
function AnalyticsDashboard() {
  const {
    period,
    startDate,
    endDate
  } = Route$9.useSearch();
  const navigate = Route$9.useNavigate();
  const {
    data: transactionsData,
    isLoading
  } = useGetAllTransactions({
    startDate,
    endDate
  });
  const handlePeriodChange = reactExports.useCallback((newPeriod) => {
    const range = getDateRangeForPeriod(newPeriod);
    navigate({
      search: {
        period: newPeriod,
        startDate: range.startDate,
        endDate: range.endDate
      }
    });
  }, [navigate]);
  const handleDateRangeChange = reactExports.useCallback((range) => {
    navigate({
      search: (prev) => ({
        ...prev,
        startDate: range.startDate,
        endDate: range.endDate
      })
    });
  }, [navigate]);
  const transactions = reactExports.useMemo(() => transactionsData?.transactions || [], [transactionsData]);
  const stats = reactExports.useMemo(() => {
    if (!transactions.length) {
      return {
        totalExpenses: 0,
        totalIncome: 0,
        savings: 0,
        transactionCount: 0
      };
    }
    let totalExpenses = 0;
    let totalIncome = 0;
    transactions.forEach((t) => {
      const amount = parseFloat(t.amount || "0");
      if (t.type === "credit") {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
      }
    });
    return {
      totalExpenses,
      totalIncome,
      savings: totalIncome - totalExpenses,
      transactionCount: transactions.length
    };
  }, [transactions]);
  const monthlyData = reactExports.useMemo(() => {
    if (!transactions.length) return [];
    const monthMap = /* @__PURE__ */ new Map();
    transactions.forEach((t) => {
      const date = t.transactionDate ? new Date(t.transactionDate) : /* @__PURE__ */ new Date();
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthMap.get(monthKey) || {
        expenses: 0,
        income: 0
      };
      const amount = parseFloat(t.amount || "0");
      if (t.type === "credit") {
        existing.income += amount;
      } else {
        existing.expenses += amount;
      }
      monthMap.set(monthKey, existing);
    });
    return Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([month, data]) => ({
      month: (/* @__PURE__ */ new Date(`${month}-01`)).toLocaleDateString("en-US", {
        month: "short"
      }),
      expenses: data.expenses,
      income: data.income
    }));
  }, [transactions]);
  const categoryData = reactExports.useMemo(() => {
    if (!transactions.length) return [];
    const categoryMap = /* @__PURE__ */ new Map();
    transactions.forEach((t) => {
      if (t.type === "credit") return;
      const categoryName = t.category?.name || "Uncategorized";
      const categoryIcon = t.category?.icon || null;
      const amount = parseFloat(t.amount || "0");
      const existing = categoryMap.get(categoryName) || {
        amount: 0
      };
      categoryMap.set(categoryName, {
        amount: existing.amount + amount,
        icon: categoryIcon
      });
    });
    return Array.from(categoryMap.entries()).sort((a, b) => b[1].amount - a[1].amount).map(([name, data], index) => ({
      name,
      value: data.amount,
      icon: data.icon,
      fill: pickChartColor(index)
    }));
  }, [transactions]);
  const spendingData = reactExports.useMemo(() => {
    const rangeStart = startDate && startDate !== "" ? new Date(startDate) : null;
    const rangeEnd = endDate && endDate !== "" ? new Date(endDate) : null;
    const hasRange = rangeStart && rangeEnd && period !== "all" && Number.isFinite(rangeStart.getTime()) && Number.isFinite(rangeEnd.getTime());
    let buckets = [];
    if (hasRange && rangeStart && rangeEnd) {
      const interval = {
        start: rangeStart,
        end: rangeEnd
      };
      switch (period) {
        case "daily":
          buckets = eachDayOfInterval(interval).map((d) => ({
            key: format(d, "yyyy-MM-dd"),
            date: d,
            label: format(d, "MMM d")
          }));
          break;
        case "weekly":
          buckets = eachWeekOfInterval(interval, {
            weekStartsOn: 1
          }).map((d) => ({
            key: format(d, "yyyy-'W'ww"),
            date: d,
            label: format(d, "MMM d")
          }));
          break;
        case "monthly":
          buckets = eachDayOfInterval(interval).map((d) => ({
            key: format(d, "yyyy-MM-dd"),
            date: d,
            label: format(d, "MMM d")
          }));
          break;
        case "yearly":
          buckets = eachMonthOfInterval(interval).map((m) => ({
            key: format(m, "yyyy-MM"),
            date: m,
            label: format(m, "MMM")
          }));
          break;
        default:
          buckets = eachMonthOfInterval(interval).map((m) => ({
            key: format(m, "yyyy-MM"),
            date: m,
            label: format(m, "MMM yyyy")
          }));
      }
    } else {
      if (!transactions.length) return [];
      const dates = transactions.map((t) => t.transactionDate ? new Date(t.transactionDate) : null).filter((d) => d !== null);
      if (!dates.length) return [];
      const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      const months = eachMonthOfInterval({
        start: minDate,
        end: maxDate
      });
      buckets = months.map((m) => ({
        key: format(m, "yyyy-MM"),
        date: m,
        label: format(m, "MMM yyyy")
      }));
    }
    const keyToSpending = /* @__PURE__ */ new Map();
    for (const b of buckets) {
      keyToSpending.set(b.key, 0);
    }
    transactions.forEach((t) => {
      if (t.type === "credit") return;
      const date = t.transactionDate ? new Date(t.transactionDate) : /* @__PURE__ */ new Date();
      let key;
      if (period === "daily" || period === "monthly") key = format(date, "yyyy-MM-dd");
      else if (period === "weekly") key = format(startOfWeek(date, {
        weekStartsOn: 1
      }), "yyyy-'W'ww");
      else key = format(date, "yyyy-MM");
      if (!keyToSpending.has(key)) return;
      const amount = parseFloat(t.amount || "0");
      keyToSpending.set(key, (keyToSpending.get(key) ?? 0) + amount);
    });
    return buckets.map((b, index) => ({
      day: index + 1,
      label: b.label,
      spending: keyToSpending.get(b.key) ?? 0
    }));
  }, [transactions, period, startDate, endDate]);
  const {
    chartPeriodLabel,
    chartGranularity
  } = reactExports.useMemo(() => {
    if (period === "all" || !startDate || !endDate) {
      return {
        chartPeriodLabel: "All time",
        chartGranularity: "month"
      };
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formatRange = () => {
      if (period === "daily") return format(start, "MMM d, yyyy");
      if (period === "monthly") return format(start, "MMMM yyyy");
      if (period === "yearly") return format(start, "yyyy");
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    };
    const label = formatRange();
    const granularity = period === "daily" || period === "monthly" ? "day" : "month";
    return {
      chartPeriodLabel: label,
      chartGranularity: granularity
    };
  }, [period, startDate, endDate]);
  const bankData = reactExports.useMemo(() => {
    if (!transactions.length) return [];
    const bankMap = /* @__PURE__ */ new Map();
    transactions.forEach((t) => {
      if (t.type === "credit") return;
      const bankName = t.bankName || "Unknown Bank";
      const amount = parseFloat(t.amount || "0");
      const existing = bankMap.get(bankName) || 0;
      bankMap.set(bankName, existing + amount);
    });
    return Array.from(bankMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, amount]) => ({
      name: name.length > 12 ? `${name.slice(0, 12)}...` : name,
      amount
    }));
  }, [transactions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8 min-w-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Overview of your spending patterns and transactions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DateFilter, { period, startDate, endDate, onPeriodChange: handlePeriodChange, onDateRangeChange: handleDateRangeChange })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: Array.from({
        length: 4
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4 rounded" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-28 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-56" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[300px] w-full" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[300px] w-full" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-44" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[250px] w-[250px] rounded-full shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: Array.from({
              length: 4
            }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16" }, i)) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-52" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[300px] w-full" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-36" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[300px] w-full" }) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total Expenses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-red-500/10 p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-4 w-4 text-red-500" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-red-600", children: formatCurrency(stats.totalExpenses) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All time expenses" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total Income" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-green-500/10 p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-green-500" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-500", children: formatCurrency(stats.totalIncome) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All time income" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Savings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-emerald-500/10 p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: `h-4 w-4 ${stats.savings >= 0 ? "text-emerald-500" : "text-red-600"}` }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold ${stats.savings >= 0 ? "text-emerald-600" : "text-red-600"}`, children: formatCurrency(stats.savings) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: stats.savings >= 0 ? "Net positive" : "Net negative" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Transactions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-blue-500/10 p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-blue-500" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: stats.transactionCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total tracked" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SpendingLineChart, { data: spendingData, periodLabel: chartPeriodLabel, granularity: chartGranularity }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBarChart, { data: categoryData }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryPieChart, { data: categoryData }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyTrendsChart, { data: monthlyData }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BankBarChart, { data: bankData })
      ] })
    ] })
  ] }) });
}
export {
  AnalyticsDashboard as component
};
