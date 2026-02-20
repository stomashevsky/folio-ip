"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";

interface CaseAction {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actionType: "email" | "webhook" | "status_change" | "assign";
  type: "manual" | "automated";
  enabled: boolean;
  createdAt: string;
}

const TYPE_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "automated", label: "Automated" },
];

const MOCK_ACTIONS: CaseAction[] = [
  {
    id: "act_001",
    name: "Send Fraud Alert Email",
    description: "Send email notification when fraud is detected",
    trigger: "status_change:fraud_detected",
    actionType: "email",
    type: "manual",
    enabled: true,
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "act_002",
    name: "Webhook to External System",
    description: "Post case data to external compliance system",
    trigger: "case_created",
    actionType: "webhook",
    type: "automated",
    enabled: true,
    createdAt: "2025-01-15T09:30:00Z",
  },
  {
    id: "act_003",
    name: "Auto-escalate High Priority",
    description: "Automatically escalate high priority cases",
    trigger: "priority:high",
    actionType: "status_change",
    type: "automated",
    enabled: true,
    createdAt: "2025-01-20T10:15:00Z",
  },
  {
    id: "act_004",
    name: "Assign to VIP Queue",
    description: "Assign VIP account cases to VIP queue",
    trigger: "account_type:vip",
    actionType: "assign",
    type: "manual",
    enabled: true,
    createdAt: "2025-01-25T11:00:00Z",
  },
  {
    id: "act_005",
    name: "Compliance Notification",
    description: "Notify compliance team of regulatory cases",
    trigger: "case_type:compliance",
    actionType: "email",
    type: "automated",
    enabled: false,
    createdAt: "2025-02-01T12:45:00Z",
  },
  {
    id: "act_006",
    name: "SLA Breach Alert",
    description: "Alert when SLA is about to breach",
    trigger: "sla_threshold:80%",
    actionType: "email",
    type: "manual",
    enabled: true,
    createdAt: "2025-02-05T14:20:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "trigger", label: "Trigger" },
  { id: "actionType", label: "Action Type" },
  { id: "enabled", label: "Status" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  trigger: true,
  actionType: true,
  enabled: true,
  createdAt: true,
};

const columns: ColumnDef<CaseAction, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 250,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "trigger",
    header: "Trigger",
    size: 180,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.trigger}
      </span>
    ),
  },
  {
    accessorKey: "actionType",
    header: "Action Type",
    size: 140,
    cell: ({ row }) => {
      const type = row.original.actionType;
      const colorMap: Record<string, "discovery" | "secondary" | "warning" | "info"> = {
        email: "discovery",
        webhook: "secondary",
        status_change: "warning",
        assign: "info",
      };
      return (
        <Badge color={colorMap[type] ?? "secondary"} size="sm">
          {type.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "enabled",
    header: "Status",
    size: 120,
    cell: ({ row }) => (
      <Badge
        color={row.original.enabled ? "success" : "secondary"}
        size="sm"
      >
        {row.original.enabled ? "Active" : "Disabled"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<CaseAction>((r) => r.createdAt),
  },
];

export default function CaseActionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    let result = MOCK_ACTIONS;

    if (typeFilter.length > 0) {
      result = result.filter((a) => typeFilter.includes(a.type));
    }

    if (!search) return result;

    const lowerSearch = search.toLowerCase();
    return result.filter(
      (a) =>
        a.name.toLowerCase().includes(lowerSearch) ||
        a.description.toLowerCase().includes(lowerSearch) ||
        a.trigger.toLowerCase().includes(lowerSearch)
    );
  }, [search, typeFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Case Actions"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              <Plus />
              <span className="hidden md:inline">Create Action</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search actions..."
            />
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
            description: false,
            trigger: false,
          }}
        />
      </div>
    </div>
  );
}
