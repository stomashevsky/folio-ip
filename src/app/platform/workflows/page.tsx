"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { useTemplateStore } from "@/lib/stores/template-store";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { Workflow } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import { Tabs } from "@plexui/ui/components/Tabs";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Plus } from "@plexui/ui/components/Icon";
import { WORKFLOW_STATUS_OPTIONS, WORKFLOW_TRIGGER_OPTIONS } from "@/lib/constants/filter-options";
import { TemplatePickerModal } from "@/components/shared";
import { WORKFLOW_PRESETS } from "@/lib/constants/template-presets";
import {
  WORKFLOW_COLUMN_CONFIG,
  WORKFLOW_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = WORKFLOW_STATUS_OPTIONS;
const COLUMN_CONFIG: ColumnConfig[] = WORKFLOW_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = WORKFLOW_DEFAULT_VISIBILITY;

const columns: ColumnDef<Workflow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 260,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Workflow ID",
    size: 280,
    cell: idCell<Workflow>((r) => r.id),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 340,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.description ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<Workflow>((r) => r.status),
  },
  {
    accessorKey: "trigger",
    header: "Trigger",
    size: 180,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.trigger.event}
      </span>
    ),
  },
  {
    id: "triggerCriteria",
    header: "Trigger criteria",
    size: 280,
    cell: ({ row }) => {
      const conds = row.original.trigger.conditions;
      if (!conds || Object.keys(conds).length === 0) return <span className="text-[var(--color-text-tertiary)]">—</span>;
      const parts = Object.entries(conds).map(([k, v]) => `${k} ${v}`);
      return (
        <span className="text-2xs text-[var(--color-text-secondary)]">
          Where {parts.join(", ")}
        </span>
      );
    },
  },
  {
    accessorKey: "runsCount",
    header: "Runs",
    size: 100,
    cell: ({ row }) => <span>{row.original.runsCount}</span>,
  },
  {
    accessorKey: "lastRunAt",
    header: "Last run",
    size: 180,
    cell: dateTimeCell<Workflow>((r) => r.lastRunAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Last updated at (UTC)",
    size: 180,
    cell: dateTimeCell<Workflow>((r) => r.updatedAt),
  },
];

export default function WorkflowsPage() {
  const router = useRouter();
  const { workflows } = useTemplateStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [triggerFilter, setTriggerFilter] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [activeTab, setActiveTab] = useState("workflows");

  const allWorkflows = workflows.getAll();

  const hasActiveFilters = statusFilter.length > 0 || triggerFilter.length > 0;

  const filteredData = useMemo(
    () =>
      allWorkflows.filter((w) => {
        if (statusFilter.length > 0 && !statusFilter.includes(w.status)) return false;
        if (triggerFilter.length > 0 && !triggerFilter.includes(w.trigger.event)) return false;
        return true;
      }),
    [allWorkflows, statusFilter, triggerFilter],
  );

  function clearAllFilters() {
    setStatusFilter([]);
    setTriggerFilter([]);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Workflows"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "workflows" && (
              <>
                <ColumnSettings
                  columns={COLUMN_CONFIG}
                  visibility={columnVisibility}
                  onVisibilityChange={setColumnVisibility}
                />
                <Button
                  color="primary"
                  size="md"
                  pill={false}
                  onClick={() => setPickerOpen(true)}
                >
                  <Plus />
                  <span className="hidden md:inline">Create Workflow</span>
                </Button>
              </>
            )}
          </div>
        }
        toolbar={
          activeTab === "workflows" ? (
            <>
              <TableSearch
                value={search}
                onChange={setSearch}
                placeholder="Search workflows..."
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

              <div className="w-48">
                <Select
                  multiple
                  clearable
                  block
                  pill
                  listMinWidth={220}
                  options={WORKFLOW_TRIGGER_OPTIONS}
                  value={triggerFilter}
                  onChange={(opts) => setTriggerFilter(opts.map((o) => o.value))}
                  placeholder="Trigger"
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
          ) : undefined
        }
      />

      <div className="border-b border-[var(--color-border)] px-4 md:px-6">
        <Tabs aria-label="Workflow sections" value={activeTab} onChange={setActiveTab} size="md">
          <Tabs.Tab value="workflows">Workflows</Tabs.Tab>
          <Tabs.Tab value="modules">Modules</Tabs.Tab>
        </Tabs>
      </div>

      {activeTab === "workflows" ? (
        <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6">
          <DataTable
            data={filteredData}
            columns={columns}
            globalFilter={search}
            pageSize={50}
            initialSorting={[{ id: "updatedAt", desc: true }]}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            onRowClick={(row) => router.push(`/platform/workflows/${row.id}`)}
            mobileColumnVisibility={{
              id: false,
              description: false,
              trigger: false,
              triggerCriteria: false,
              lastRunAt: false,
              updatedAt: false,
            }}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <EmptyMessage>
            <EmptyMessage.Title>No modules yet</EmptyMessage.Title>
            <EmptyMessage.Description>
              Modules are reusable workflow fragments that can be shared across workflows.
            </EmptyMessage.Description>
          </EmptyMessage>
        </div>
      )}

      <TemplatePickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Create workflow"
        presets={WORKFLOW_PRESETS}
        onSelect={(presetId) => router.push(`/platform/workflows/new?preset=${presetId}`)}
      />
    </div>
  );
}
