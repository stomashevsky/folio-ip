"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, SavedViewsControl } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { useTemplateStore } from "@/lib/stores/template-store";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { Case } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Plus } from "@plexui/ui/components/Icon";
import { getPriorityColor } from "@/lib/utils/format";
import {
  CASE_STATUS_OPTIONS,
  CASE_PRIORITY_OPTIONS,
  CASE_QUEUE_OPTIONS,
} from "@/lib/constants/filter-options";
import {
  CASE_COLUMN_CONFIG,
  CASE_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const COLUMN_CONFIG: ColumnConfig[] = CASE_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = CASE_DEFAULT_VISIBILITY;

// ─── Column definitions ───

const columns: ColumnDef<Case, unknown>[] = [
  {
    accessorKey: "id",
    header: "Case ID",
    size: 220,
    cell: idCell<Case>((r) => r.id),
  },
  {
    accessorKey: "title",
    header: "Title",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "accountName",
    header: "Account",
    size: 180,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.accountName ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<Case>((r) => r.status),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 120,
    cell: ({ row }) => {
      const p = row.original.priority;
      return <Badge pill color={getPriorityColor(p) as BadgeProps["color"]} variant="soft" size="sm">{p.charAt(0).toUpperCase() + p.slice(1)}</Badge>;
    },
  },
  {
    accessorKey: "queue",
    header: "Queue",
    size: 140,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.queue ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    size: 140,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.assignee ?? "Unassigned"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Case>((r) => r.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at (UTC)",
    size: 180,
    cell: dateTimeCell<Case>((r) => r.updatedAt),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 200,
    cell: ({ row }) =>
      row.original.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.map((tag) => (
            <Badge pill key={tag} color="secondary" variant="soft">{tag}</Badge>
          ))}
        </div>
      ) : (
        <span className="text-[var(--color-text-tertiary)]">—</span>
      ),
  },
];

// ─── Page ───

export default function CasesPage() {
  const router = useRouter();
  const { cases: caseStore } = useTemplateStore();
  const allCases = caseStore.getAll();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [queueFilter, setQueueFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);
  const hasActiveFilters = statusFilter.length > 0 || priorityFilter.length > 0 || queueFilter.length > 0;

  const filteredData = useMemo(() => {
    let result = allCases;

    if (statusFilter.length > 0) {
      result = result.filter((c) => statusFilter.includes(c.status));
    }

    if (priorityFilter.length > 0) {
      result = result.filter((c) => priorityFilter.includes(c.priority));
    }

    if (queueFilter.length > 0) {
      result = result.filter((c) => c.queue != null && queueFilter.includes(c.queue));
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(lowerSearch) ||
          c.title.toLowerCase().includes(lowerSearch) ||
          (c.accountName?.toLowerCase().includes(lowerSearch) ?? false) ||
          (c.queue?.toLowerCase().includes(lowerSearch) ?? false) ||
          (c.assignee?.toLowerCase().includes(lowerSearch) ?? false)
      );
    }

    return result;
  }, [allCases, statusFilter, priorityFilter, queueFilter, search]);

  function clearAllFilters() {
    setStatusFilter([]);
    setPriorityFilter([]);
    setQueueFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Cases"
        actions={
          <div className="flex items-center gap-2">
            <SavedViewsControl
              entityType="cases"
              currentState={{
                filters: {
                  status: statusFilter,
                  priority: priorityFilter,
                  queue: queueFilter,
                },
                columnVisibility,
              }}
              onLoadView={(state) => {
                setStatusFilter(state.filters.status ?? []);
                setPriorityFilter(state.filters.priority ?? []);
                setQueueFilter(state.filters.queue ?? []);
                setColumnVisibility(state.columnVisibility);
              }}
              onClearView={() => {
                clearAllFilters();
                setColumnVisibility(DEFAULT_VISIBILITY);
              }}
            />
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              <Plus />
              <span className="hidden md:inline">Create Case</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search cases..."
            />

            {/* ── Status filter ── */}
            <div className="w-36">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={180}
                 options={CASE_STATUS_OPTIONS}
                 value={statusFilter}
                 onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                 placeholder="Status"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
            </div>

            {/* ── Priority filter ── */}
            <div className="w-36">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={180}
                 options={CASE_PRIORITY_OPTIONS}
                 value={priorityFilter}
                 onChange={(opts) => setPriorityFilter(opts.map((o) => o.value))}
                 placeholder="Priority"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
            </div>

            {/* ── Queue filter ── */}
            <div className="w-36">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={200}
                 options={CASE_QUEUE_OPTIONS}
                 value={queueFilter}
                 onChange={(opts) => setQueueFilter(opts.map((o) => o.value))}
                 placeholder="Queue"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
            </div>

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
          onRowClick={(row) => router.push(`/platform/cases/${row.id}`)}
          mobileColumnVisibility={{
            id: true,
            queue: false,
            assignee: false,
            updatedAt: false,
            tags: false,
          }}
        />
      </div>
    </div>
  );
}
