import { j as jsxRuntimeExports, R as React } from "../_libs/react.mjs";
import { u as useReactTable, f as flexRender } from "../_libs/tanstack__react-table.mjs";
import { c as cn, B as Button } from "./router-CdED92sw.mjs";
import { C as Card } from "./card-CsLX1gsd.mjs";
import { I as Input } from "./input-Cph6uzM7.mjs";
import { S as Skeleton } from "./skeleton-Bl4xYHo5.mjs";
import { e as ChevronUp, Q as Search$1 } from "../_libs/lucide-react.mjs";
import { g as getFilteredRowModel, a as getPaginationRowModel, b as getExpandedRowModel, d as getSortedRowModel, e as getCoreRowModel } from "../_libs/tanstack__table-core.mjs";
function NoData({
  title,
  description,
  isSearchResults,
  className,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: title }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: description }),
          isSearchResults && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Try adjusting your search terms or filters." })
        ] }),
        children && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children })
      ]
    }
  );
}
function Search({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Search$1, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: cn("pl-8", className), ...props })
  ] });
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function DataTable({
  columns,
  data,
  title,
  tabNavs,
  isLoading,
  pagination,
  search,
  noData,
  sorting,
  columnPinning,
  expanding,
  enableSelect,
  headerButtons,
  headerClassName,
  onRowClick
}) {
  const tableConfig = {
    data,
    columns,
    state: {
      ...pagination && { pagination: pagination.state },
      ...sorting && { sorting: sorting.state },
      ...columnPinning && { columnPinning: columnPinning.state },
      ...expanding && { expanded: expanding.state },
      ...search && { globalFilter: search.value }
    },
    manualPagination: !!pagination,
    manualSorting: sorting?.manualSorting ?? false,
    manualExpanding: expanding?.manualExpanding || false,
    enableColumnPinning: !!columnPinning,
    // Pagination options
    ...pagination && {
      ...pagination.options
    },
    // Sorting options
    ...sorting && {
      onSortingChange: sorting.onSortingChange
    },
    // Filtering options
    ...search && {
      onGlobalFilterChange: search.onChange
    },
    enableMultiRowSelection: enableSelect,
    enableSortingRemoval: true,
    defaultColumn: {
      sortDescFirst: false
    },
    // Expanding options
    onExpandedChange: expanding?.onExpandedChange || void 0,
    // Explicitly add expanding functions
    getSubRows: expanding?.getSubRows || void 0,
    getRowCanExpand: expanding?.getRowCanExpand || void 0,
    // Other expanding options
    paginateExpandedRows: expanding?.paginateExpandedRows !== void 0 ? expanding.paginateExpandedRows : true,
    filterFromLeafRows: expanding?.filterFromLeafRows || false,
    maxLeafRowFilterDepth: expanding?.maxLeafRowFilterDepth || 0,
    // Models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  };
  const table = useReactTable(tableConfig);
  const renderLoading = () => {
    return new Array(pagination?.state.pageSize || 10).fill(null).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: columns.map((_2, colIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "h-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-lg" }) }, colIndex)) }, index));
  };
  const renderNoResults = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: columns.length, className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoData,
      {
        title: noData?.title || "No data found",
        description: noData?.description || "",
        isSearchResults: !!search?.value,
        className: "min-h-[50vh]",
        children: noData?.actionButtons && noData.actionButtons
      }
    ) }) });
  };
  const renderRows = () => {
    const rows = table.getRowModel().rows;
    return rows.map((row) => {
      const isChildRow = row.depth > 0;
      const isExpanded = row.getIsExpanded();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableRow,
          {
            "data-state": row.getIsSelected() && "selected",
            className: cn(
              isChildRow && "bg-muted/30",
              isExpanded && "bg-muted/50",
              onRowClick && "cursor-pointer hover:bg-muted/50"
            ),
            onClick: () => onRowClick?.(row),
            onKeyDown: (e) => {
              if ((e.key === "Enter" || e.key === " ") && onRowClick) {
                e.preventDefault();
                onRowClick(row);
              }
            },
            role: onRowClick ? "button" : void 0,
            tabIndex: onRowClick ? 0 : void 0,
            children: row.getVisibleCells().map((cell) => {
              const isPinned = cell.column.getIsPinned();
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                TableCell,
                {
                  className: cn(
                    isPinned && "backdrop-blur-xs sticky z-10 bg-background/90 shadow-lg",
                    isPinned === "left" && "left-0",
                    isPinned === "right" && "right-0",
                    isChildRow && isPinned && "bg-muted/80",
                    isExpanded && cell.column.getIndex() === 0 && "shadow-[inset_4px_0_0_0_hsl(var(--primary))]",
                    isChildRow && cell.column.getIndex() === 0 && "shadow-[inset_4px_0_0_0_hsl(var(--primary))]"
                  ),
                  style: {
                    width: `${cell.column.getSize()}px`,
                    ...isPinned === "left" && {
                      left: cell.column.getStart("left")
                    },
                    ...isPinned === "right" && {
                      right: cell.column.getAfter("right")
                    }
                  },
                  children: flexRender(cell.column.columnDef.cell, cell.getContext())
                },
                cell.id
              );
            })
          }
        ),
        expanding?.renderExpandedContent && row.getIsExpanded() && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: row.getAllCells().length, className: "p-0", children: expanding.renderExpandedContent(row) }) })
      ] }, row.id);
    });
  };
  const renderTableBody = () => {
    if (isLoading) {
      return renderLoading();
    }
    if (table.getRowModel().rows?.length) {
      return renderRows();
    }
    return renderNoResults();
  };
  const renderPagination = () => {
    if (!pagination) {
      return null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-evenly border-t px-4 py-4 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => table.previousPage(),
          disabled: !table.getCanPreviousPage(),
          children: "Previous"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 text-center text-sm font-semibold text-muted-foreground", children: [
        "Page ",
        table.getState().pagination.pageIndex + 1,
        " of",
        " ",
        table.getPageCount().toLocaleString()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => table.nextPage(),
          disabled: !table.getCanNextPage(),
          children: "Next"
        }
      )
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full overflow-hidden rounded-xl border p-0 shadow min-w-0", children: [
    (title || search || headerButtons || tabNavs) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      title && /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: title }),
      tabNavs && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: tabNavs }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex items-center gap-2 sm:gap-4 w-full sm:w-auto",
            headerClassName
          ),
          children: [
            search && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Search,
              {
                value: search.value,
                onChange: (e) => search.onChange(e.target.value),
                className: "flex-1 sm:flex-none sm:w-[20rem]",
                placeholder: "Search..."
              }
            ),
            headerButtons && headerButtons
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[calc(100vh-264px)] min-h-[calc(100vh-264px)] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { className: "sticky top-0 z-20 bg-muted/50", children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { className: "bg-muted/50", children: headerGroup.headers.map((header) => {
        const isPinned = header.column.getIsPinned();
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableHead,
          {
            className: cn(
              "space-x-2",
              isPinned && "sticky z-6 bg-muted/80 shadow-sm",
              isPinned === "left" && "left-0",
              isPinned === "right" && "right-0"
            ),
            style: {
              width: `${header.getSize()}px`,
              ...isPinned === "left" && {
                left: header.column.getStart("left")
              },
              ...isPinned === "right" && {
                right: header.column.getAfter("right")
              }
            },
            children: header.isPlaceholder ? null : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: header.column.getToggleSortingHandler(),
                className: cn(
                  "inline-flex items-center gap-2",
                  header.column.getCanSort() && "cursor-pointer",
                  header.column.getIsSorted() === "desc" && "[&>svg]:rotate-180"
                ),
                children: [
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ChevronUp,
                    {
                      className: cn(
                        "pointer-events-none size-4 min-w-4 transition-all duration-200 text-muted-foreground",
                        header.column.getIsSorted() === "asc" || header.column.getIsSorted() === "desc" ? "opacity-100" : "opacity-0"
                      )
                    }
                  )
                ]
              }
            ) })
          },
          header.id
        );
      }) }, headerGroup.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: renderTableBody() })
    ] }) }) }),
    renderPagination()
  ] });
}
export {
  DataTable as D,
  NoData as N,
  Search as S
};
