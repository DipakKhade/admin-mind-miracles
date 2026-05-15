"use client";

import {
  useState,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Check,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  width?: number;
  frozen?: boolean;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  getRowId?: (row: T) => string | number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize: defaultPageSize = 10,
  searchable = true,
  sortable = true,
  getRowId,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(
    columns.map((c) => c.key)
  );
  const [showColumns, setShowColumns] = useState(false);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        columnsRef.current &&
        !columnsRef.current.contains(e.target as Node)
      ) {
        setShowColumns(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const visibleColumns = useMemo(
    () => columns.filter((c) => visibleKeys.includes(c.key)),
    [columns, visibleKeys]
  );

  const frozenColumns = useMemo(
    () => visibleColumns.filter((c) => c.frozen),
    [visibleColumns]
  );
  const scrollColumns = useMemo(
    () => visibleColumns.filter((c) => !c.frozen),
    [visibleColumns]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleColumn(key: string) {
    setVisibleKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const rowId = getRowId ?? ((row: T, i: number) => String(i));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-200">
        {searchable && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20 focus:border-[#1B5E3A] transition-colors"
            />
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative" ref={columnsRef}>
            <button
              onClick={() => setShowColumns(!showColumns)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Columns3 className="w-4 h-4" />
              Columns
            </button>
            {showColumns && (
              <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-1 max-h-64 overflow-y-auto">
                {columns.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => toggleColumn(col.key)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        visibleKeys.includes(col.key)
                          ? "bg-[#0D2B1F] border-[#0D2B1F]"
                          : "border-gray-300"
                      }`}
                    >
                      {visibleKeys.includes(col.key) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    {col.header}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {frozenColumns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    minWidth: col.width,
                    position: "sticky",
                    left: getFrozenOffset(frozenColumns, col.key),
                    zIndex: 10,
                  }}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50"
                >
                  <HeaderCell
                    col={col}
                    sortable={sortable}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onToggle={toggleSort}
                  />
                </th>
              ))}
              {scrollColumns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width, minWidth: col.width }}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50"
                >
                  <HeaderCell
                    col={col}
                    sortable={sortable}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onToggle={toggleSort}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={rowId(row, i)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {frozenColumns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        width: col.width,
                        minWidth: col.width,
                        position: "sticky",
                        left: getFrozenOffset(frozenColumns, col.key),
                        zIndex: 1,
                      }}
                      className="px-4 py-3 text-sm text-gray-700 bg-white"
                    >
                      {col.render
                        ? col.render(row)
                        : highlightText(formatCell(row[col.key]), search)}
                    </td>
                  ))}
                  {scrollColumns.map((col) => (
                    <td
                      key={col.key}
                      style={{ width: col.width, minWidth: col.width }}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {col.render
                        ? col.render(row)
                        : highlightText(formatCell(row[col.key]), search)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="bg-white border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]/20"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="ml-2">
            {sorted.length === 0
              ? "0 entries"
              : `${safePage * pageSize + 1}–${Math.min(
                  (safePage + 1) * pageSize,
                  sorted.length
                )} of ${sorted.length}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(0)}
            disabled={safePage === 0}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const start = Math.max(
              0,
              Math.min(safePage - 2, totalPages - 5)
            );
            const n = start + i;
            if (n >= totalPages) return null;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`min-w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  n === safePage
                    ? "bg-[#0D2B1F] text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {n + 1}
              </button>
            );
          })}
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={safePage === totalPages - 1}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- helpers ---- */

function getFrozenOffset<T>(cols: Column<T>[], key: string): number {
  let offset = 0;
  for (const c of cols) {
    if (c.key === key) return offset;
    offset += c.width ?? 150;
  }
  return offset;
}

function HeaderCell<T>({
  col,
  sortable,
  sortKey,
  sortDir,
  onToggle,
}: {
  col: Column<T>;
  sortable: boolean;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  onToggle: (key: string) => void;
}) {
  const canSort = sortable && col.sortable !== false;
  const active = sortKey === col.key;

  return (
    <button
      onClick={() => canSort && onToggle(col.key)}
      className={`flex items-center gap-1.5 w-full text-left ${
        canSort ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <span className="truncate">{col.header}</span>
      {canSort && (
        <span className="shrink-0">
          {active ? (
            sortDir === "asc" ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#0D2B1F]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#0D2B1F]" />
            )
          ) : (
            <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />
          )}
        </span>
      )}
    </button>
  );
}

function formatCell(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return formatDateTime(str);
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return formatDate(str);
  return str;
}

function highlightText(text: string, query: string): ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-[#1B5E3A]/20 text-inherit rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
