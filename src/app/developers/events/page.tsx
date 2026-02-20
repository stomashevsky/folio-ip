"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, Modal, ModalHeader, ModalBody, KeyValueTable } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { idCell, dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";

interface Event {
  id: string;
  type: string;
  resourceType: string;
  resourceId: string;
  actorType: "user" | "api" | "system";
  actorId: string;
  createdAt: string;
  metadata?: Record<string, string>;
}

const mockEvents: Event[] = [
  {
    id: "evt_001",
    type: "inquiry.created",
    resourceType: "Inquiry",
    resourceId: "inq_001",
    actorType: "user",
    actorId: "user_123",
    createdAt: "2025-02-20T14:30:00Z",
  },
  {
    id: "evt_002",
    type: "inquiry.completed",
    resourceType: "Inquiry",
    resourceId: "inq_002",
    actorType: "system",
    actorId: "system",
    createdAt: "2025-02-20T14:29:15Z",
  },
  {
    id: "evt_003",
    type: "verification.passed",
    resourceType: "Verification",
    resourceId: "ver_001",
    actorType: "system",
    actorId: "system",
    createdAt: "2025-02-20T14:28:45Z",
  },
  {
    id: "evt_004",
    type: "verification.failed",
    resourceType: "Verification",
    resourceId: "ver_002",
    actorType: "system",
    actorId: "system",
    createdAt: "2025-02-20T14:27:30Z",
  },
  {
    id: "evt_005",
    type: "report.ready",
    resourceType: "Report",
    resourceId: "rep_001",
    actorType: "system",
    actorId: "system",
    createdAt: "2025-02-20T14:26:00Z",
  },
  {
    id: "evt_006",
    type: "account.created",
    resourceType: "Account",
    resourceId: "act_001",
    actorType: "user",
    actorId: "user_456",
    createdAt: "2025-02-20T14:25:15Z",
  },
  {
    id: "evt_007",
    type: "case.opened",
    resourceType: "Case",
    resourceId: "case_001",
    actorType: "user",
    actorId: "user_789",
    createdAt: "2025-02-20T14:24:00Z",
  },
  {
    id: "evt_008",
    type: "case.resolved",
    resourceType: "Case",
    resourceId: "case_002",
    actorType: "user",
    actorId: "user_456",
    createdAt: "2025-02-20T14:23:30Z",
  },
  {
    id: "evt_009",
    type: "workflow.triggered",
    resourceType: "Workflow",
    resourceId: "wf_001",
    actorType: "api",
    actorId: "api_key_123",
    createdAt: "2025-02-20T14:22:45Z",
  },
  {
    id: "evt_010",
    type: "inquiry.created",
    resourceType: "Inquiry",
    resourceId: "inq_003",
    actorType: "api",
    actorId: "api_key_456",
    createdAt: "2025-02-20T14:21:00Z",
  },
  {
    id: "evt_011",
    type: "verification.passed",
    resourceType: "Verification",
    resourceId: "ver_003",
    actorType: "system",
    actorId: "system",
    createdAt: "2025-02-20T14:20:15Z",
  },
  {
    id: "evt_012",
    type: "report.ready",
    resourceType: "Report",
    resourceId: "rep_002",
    actorType: "system",
    actorId: "system",
    createdAt: "2025-02-20T14:19:30Z",
  },
];

const RESOURCE_TYPE_OPTIONS = [
  { value: "Inquiry", label: "Inquiry" },
  { value: "Verification", label: "Verification" },
  { value: "Report", label: "Report" },
  { value: "Account", label: "Account" },
  { value: "Case", label: "Case" },
  { value: "Workflow", label: "Workflow" },
];

const ACTOR_TYPE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "api", label: "API" },
  { value: "system", label: "System" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "type", label: "Type" },
  { id: "resourceType", label: "Resource Type" },
  { id: "resourceId", label: "Resource ID" },
  { id: "actorType", label: "Actor Type" },
  { id: "actorId", label: "Actor ID" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  type: true,
  resourceType: true,
  resourceId: true,
  actorType: true,
  actorId: false,
  createdAt: true,
};

const columns: ColumnDef<Event, unknown>[] = [
  {
    accessorKey: "type",
    header: "Type",
    size: 220,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.type}</span>
    ),
  },
  {
    accessorKey: "resourceType",
    header: "Resource Type",
    size: 140,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.resourceType}
      </span>
    ),
  },
  {
    accessorKey: "resourceId",
    header: "Resource ID",
    size: 160,
    cell: idCell<Event>((r) => r.resourceId),
  },
  {
    accessorKey: "actorType",
    header: "Actor Type",
    size: 120,
    cell: ({ row }) => {
      const actorType = row.original.actorType;
      const colorMap: Record<string, "info" | "secondary" | "warning"> = {
        user: "info",
        api: "secondary",
        system: "warning",
      };
      return (
        <Badge color={colorMap[actorType]} variant="soft">
          {actorType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actorId",
    header: "Actor ID",
    size: 160,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.actorId}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Event>((r) => r.createdAt),
  },
];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string[]>([]);
  const [actorTypeFilter, setActorTypeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const hasActiveFilters = resourceTypeFilter.length > 0 || actorTypeFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockEvents.filter((event) => {
      if (resourceTypeFilter.length > 0 && !resourceTypeFilter.includes(event.resourceType)) {
        return false;
      }

      if (actorTypeFilter.length > 0 && !actorTypeFilter.includes(event.actorType)) {
        return false;
      }

      if (search) {
        const searchLower = search.toLowerCase();
        return (
          event.type.toLowerCase().includes(searchLower) ||
          event.resourceId.toLowerCase().includes(searchLower) ||
          event.actorId.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [resourceTypeFilter, actorTypeFilter, search]);

  function clearAllFilters() {
    setResourceTypeFilter([]);
    setActorTypeFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Events"
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
              placeholder="Search events..."
            />

            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={200}
                options={RESOURCE_TYPE_OPTIONS}
                value={resourceTypeFilter}
                onChange={(opts) => setResourceTypeFilter(opts.map((o) => o.value))}
                placeholder="Resource Type"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={ACTOR_TYPE_OPTIONS}
                value={actorTypeFilter}
                onChange={(opts) => setActorTypeFilter(opts.map((o) => o.value))}
                placeholder="Actor Type"
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
          onRowClick={setSelectedEvent}
          mobileColumnVisibility={{
            actorId: false,
            resourceId: false,
          }}
        />
      </div>

      <Modal open={!!selectedEvent} onOpenChange={(open) => { if (!open) setSelectedEvent(null); }} maxWidth="max-w-lg">
        {selectedEvent && (
          <>
            <ModalHeader>
              <h2 className="heading-sm">{selectedEvent.type}</h2>
            </ModalHeader>
            <ModalBody>
              <KeyValueTable
                rows={[
                  { label: "Event ID", value: selectedEvent.id },
                  { label: "Type", value: selectedEvent.type },
                  { label: "Resource Type", value: selectedEvent.resourceType },
                  { label: "Resource ID", value: selectedEvent.resourceId },
                  { label: "Actor Type", value: selectedEvent.actorType },
                  { label: "Actor ID", value: selectedEvent.actorId },
                  { label: "Timestamp", value: new Date(selectedEvent.createdAt).toLocaleString() },
                ]}
              />
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  );
}
