"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { mockTransactions } from "@/lib/data";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { Transaction } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import {
  TRANSACTION_STATUS_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/lib/constants/filter-options";
import {
  TRANSACTION_COLUMN_CONFIG,
  TRANSACTION_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = TRANSACTION_STATUS_OPTIONS;
const TYPE_OPTIONS = TRANSACTION_TYPE_OPTIONS;

const TAG_OPTIONS = Array.from(
  new Set(mockTransactions.flatMap((txn) => txn.tags))
)
  .filter(Boolean)
  .sort()
  .map((tag) => ({ value: tag, label: tag }));

const COLUMN_CONFIG: ColumnConfig[] = TRANSACTION_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = TRANSACTION_DEFAULT_VISIBILITY;

// ─── Column definitions ───

const columns: ColumnDef<Transaction, unknown>[] = [
  {
    accessorKey: "accountName",
    header: "Account",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.accountName}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Transaction ID",
    size: 220,
    cell: idCell<Transaction>((r) => r.id),
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 140,
    cell: ({ row }) => (
      <span className="font-medium">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: row.original.currency,
        }).format(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<Transaction>((r) => r.status),
  },
  {
    accessorKey: "riskScore",
    header: "Risk score",
    size: 120,
    cell: ({ row }) => {
      const score = row.original.riskScore;
      const color =
        score > 70
          ? "var(--color-text-danger-solid)"
          : score > 30
            ? "var(--color-text-warning-solid)"
            : "var(--color-text-success-solid)";
      return <span style={{ color }}>{score}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Transaction>((r) => r.createdAt),
  },
  {
    accessorKey: "reviewedAt",
    header: "Reviewed at (UTC)",
    size: 180,
    cell: dateTimeCell<Transaction>((r) => r.reviewedAt),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 220,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.description ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 200,
    cell: ({ row }) =>
      row.original.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.map((tag) => (
            <Badge key={tag} color="secondary" variant="soft">
              {tag}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-[var(--color-text-tertiary)]">—</span>
      ),
  },
];

// ─── Page ───

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters =
    statusFilter.length > 0 || typeFilter.length > 0 || tagFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockTransactions.filter((txn) => {
      // Status filter
      if (statusFilter.length > 0 && !statusFilter.includes(txn.status)) {
        return false;
      }

      // Type filter
      if (typeFilter.length > 0 && !typeFilter.includes(txn.type)) {
        return false;
      }

      // Tag filter
      if (tagFilter.length > 0) {
        const hasTags = tagFilter.some((tag) => txn.tags.includes(tag));
        if (!hasTags) return false;
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          txn.id.toLowerCase().includes(searchLower) ||
          txn.accountName.toLowerCase().includes(searchLower) ||
          txn.description?.toLowerCase().includes(searchLower) ||
          txn.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [statusFilter, typeFilter, tagFilter, search]);

  function clearAllFilters() {
    setStatusFilter([]);
    setTypeFilter([]);
    setTagFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Transactions"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search transactions..."
            />

            {/* ── Status filter ── */}
            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                placeholder="Status"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            {/* ── Type filter ── */}
            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={TYPE_OPTIONS}
                value={typeFilter}
                onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
                placeholder="Type"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            {/* ── Tags filter ── */}
            {columnVisibility.tags !== false && (
              <div className="w-36">
                <Select
                  multiple
                  clearable
                  block
                  pill={TOPBAR_TOOLBAR_PILL}
                  listMinWidth={180}
                  options={TAG_OPTIONS}
                  value={tagFilter}
                  onChange={(opts) => setTagFilter(opts.map((o) => o.value))}
                  placeholder="Tags"
                  variant="outline"
                  size={TOPBAR_CONTROL_SIZE}
                />
              </div>
            )}

            {/* ── Clear all filters ── */}
            {hasActiveFilters && (
              <Button
                color="secondary"
                variant="soft"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_TOOLBAR_PILL}
                onClick={clearAllFilters}
              >
                Clear filters
              </Button>
            )}
          </>
        }
      />

      <div className={TABLE_PAGE_CONTENT}>
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            id: false,
            type: false,
            riskScore: false,
            reviewedAt: false,
            description: false,
            tags: false,
          }}
        />
      </div>
    </div>
  );
}
