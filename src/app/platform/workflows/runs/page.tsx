"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { useTemplateStore } from "@/lib/stores/template-store";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { WorkflowRun } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import {
  WORKFLOW_RUN_COLUMN_CONFIG,
  WORKFLOW_RUN_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";
import { WORKFLOW_RUN_STATUS_OPTIONS } from "@/lib/constants/filter-options";

const STATUS_OPTIONS = WORKFLOW_RUN_STATUS_OPTIONS;
const COLUMN_CONFIG: ColumnConfig[] = WORKFLOW_RUN_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = WORKFLOW_RUN_DEFAULT_VISIBILITY;

const columns: ColumnDef<WorkflowRun, unknown>[] = [
  {
    accessorKey: "id",
    header: "Run ID",
    size: 280,
    cell: idCell<WorkflowRun>((r) => r.id),
  },
  {
    accessorKey: "workflowName",
    header: "Workflow",
    size: 260,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.workflowName}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<WorkflowRun>((r) => r.status),
  },
  {
    accessorKey: "triggeredBy",
    header: "Triggered by",
    size: 180,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.triggeredBy}
      </span>
    ),
  },
  {
    accessorKey: "startedAt",
    header: "Started at (UTC)",
    size: 180,
    cell: dateTimeCell<WorkflowRun>((r) => r.startedAt),
  },
  {
    accessorKey: "completedAt",
    header: "Completed at (UTC)",
    size: 180,
    cell: dateTimeCell<WorkflowRun>((r) => r.completedAt),
  },
  {
    accessorKey: "stepsExecuted",
    header: "Steps",
    size: 100,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.stepsExecuted} / {row.original.stepsTotal}
      </span>
    ),
  },
];

export default function WorkflowRunsPage() {
  const { workflowRuns } = useTemplateStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const allRuns = workflowRuns.getAll();

  const hasActiveFilters = statusFilter.length > 0;

  const filteredData = useMemo(
    () =>
      allRuns.filter((r) => {
        if (statusFilter.length > 0 && !statusFilter.includes(r.status))
          return false;
        return true;
      }),
    [allRuns, statusFilter],
  );

  function clearAllFilters() {
    setStatusFilter([]);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Workflow Runs"
        actions={
          <ColumnSettings
            columns={COLUMN_CONFIG}
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search runs..."
            />

            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill
                listMinWidth={180}
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                placeholder="Status"
                variant="outline"
                size="sm"
              />
            </div>

            {hasActiveFilters && (
              <Button
                color="secondary"
                variant="soft"
                size="sm"
                pill
                onClick={clearAllFilters}
              >
                Clear filters
              </Button>
            )}
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6">
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "startedAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            id: true,
            workflowName: true,
            status: true,
            triggeredBy: false,
            startedAt: true,
            completedAt: false,
            stepsExecuted: true,
          }}
        />
      </div>
    </div>
  );
}
