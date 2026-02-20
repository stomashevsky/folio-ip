"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { useTemplateStore } from "@/lib/stores/template-store";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import type { Workflow } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Plus } from "@plexui/ui/components/Icon";
import { WORKFLOW_STATUS_OPTIONS, WORKFLOW_TRIGGER_OPTIONS } from "@/lib/constants/filter-options";
import { TemplatePickerModal } from "@/components/shared";
import { WORKFLOW_PRESETS } from "@/lib/constants/template-presets";
import {
  WORKFLOW_COLUMN_CONFIG,
  WORKFLOW_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

interface WorkflowModule {
  id: string;
  name: string;
  description: string;
  status: "published" | "draft";
  stepsCount: number;
  usedByCount: number;
}

const MOCK_MODULES: WorkflowModule[] = [
  { id: "mod_001", name: "Risk Score Evaluation", description: "Evaluate risk score and route based on thresholds", status: "published", stepsCount: 3, usedByCount: 4 },
  { id: "mod_002", name: "PEP & Sanctions Check", description: "Run PEP and sanctions screening with match handling", status: "published", stepsCount: 5, usedByCount: 3 },
  { id: "mod_003", name: "Document Retry Logic", description: "Retry failed document verifications with exponential backoff", status: "published", stepsCount: 4, usedByCount: 2 },
  { id: "mod_004", name: "Email Notification", description: "Send templated email notifications with variable substitution", status: "draft", stepsCount: 2, usedByCount: 0 },
  { id: "mod_005", name: "Case Creation", description: "Create a case with auto-assignment and SLA configuration", status: "published", stepsCount: 3, usedByCount: 5 },
];

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
    <div className={TABLE_PAGE_WRAPPER}>
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
                   size={TOPBAR_CONTROL_SIZE}
                   pill={TOPBAR_ACTION_PILL}
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
          <>
             <SegmentedControl
               aria-label="Workflow sections"
               value={activeTab}
               onChange={setActiveTab}
               size={TOPBAR_CONTROL_SIZE}
               pill={TOPBAR_TOOLBAR_PILL}
             >
              <SegmentedControl.Tab value="workflows">Workflows</SegmentedControl.Tab>
              <SegmentedControl.Tab value="modules">Modules</SegmentedControl.Tab>
            </SegmentedControl>

            {activeTab === "workflows" && (
              <>
                <div className="mx-1 h-5 w-px bg-[var(--color-border)]" />

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

                 <div className="w-48">
                   <Select
                     multiple
                     clearable
                     block
                     pill={TOPBAR_TOOLBAR_PILL}
                     listMinWidth={220}
                     options={WORKFLOW_TRIGGER_OPTIONS}
                     value={triggerFilter}
                     onChange={(opts) => setTriggerFilter(opts.map((o) => o.value))}
                     placeholder="Trigger"
                     variant="outline"
                     size={TOPBAR_CONTROL_SIZE}
                   />
                 </div>

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
            )}
          </>
        }
      />

      {activeTab === "workflows" ? (
        <div className={TABLE_PAGE_CONTENT}>
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
        <div className={TABLE_PAGE_CONTENT}>
          <div className="space-y-3">
            {MOCK_MODULES.map((mod) => (
              <div
                key={mod.id}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--color-text)]">{mod.name}</span>
                    <Badge color={mod.status === "published" ? "success" : "secondary"} size="sm">{mod.status}</Badge>
                  </div>
                  <p className="mt-1 text-2xs text-[var(--color-text-secondary)]">{mod.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-2xs text-[var(--color-text-tertiary)]">
                    <span>{mod.stepsCount} steps</span>
                    <span>Used in {mod.usedByCount} workflows</span>
                  </div>
                </div>
                <Button color="secondary" variant="outline" size="sm">Edit</Button>
              </div>
            ))}
          </div>
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
