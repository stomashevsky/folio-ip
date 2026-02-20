"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import { getRiskColor, getSignalCategoryColor } from "@/lib/utils/format";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";

interface Signal {
  id: string;
  name: string;
  description: string;
  category: "featured" | "risk" | "behavioral" | "device";
  severity: "low" | "medium" | "high";
  enabled: boolean;
  triggeredCount: number;
  updatedAt: string;
}

const mockSignals: Signal[] = [
  {
    id: "sig_001",
    name: "Face Match Score Low",
    description: "Facial recognition confidence below threshold",
    category: "risk",
    severity: "high",
    enabled: true,
    triggeredCount: 234,
    updatedAt: "2025-02-18T10:30:00Z",
  },
  {
    id: "sig_002",
    name: "Document Tampering Detected",
    description: "Document shows signs of manipulation or forgery",
    category: "risk",
    severity: "high",
    enabled: true,
    triggeredCount: 89,
    updatedAt: "2025-02-17T14:15:00Z",
  },
  {
    id: "sig_003",
    name: "IP Geolocation Mismatch",
    description: "IP location does not match stated address",
    category: "device",
    severity: "medium",
    enabled: true,
    triggeredCount: 456,
    updatedAt: "2025-02-16T09:45:00Z",
  },
  {
    id: "sig_004",
    name: "Repeat Submission",
    description: "Multiple submissions from same user in short timeframe",
    category: "behavioral",
    severity: "medium",
    enabled: true,
    triggeredCount: 123,
    updatedAt: "2025-02-15T11:20:00Z",
  },
  {
    id: "sig_005",
    name: "Device Fingerprint Changed",
    description: "Device fingerprint differs from previous submissions",
    category: "device",
    severity: "low",
    enabled: true,
    triggeredCount: 567,
    updatedAt: "2025-02-14T16:00:00Z",
  },
  {
    id: "sig_006",
    name: "VPN Detected",
    description: "User is accessing through VPN or proxy",
    category: "device",
    severity: "medium",
    enabled: false,
    triggeredCount: 234,
    updatedAt: "2025-02-13T13:30:00Z",
  },
  {
    id: "sig_007",
    name: "Multiple Accounts Same Device",
    description: "Multiple accounts created from same device",
    category: "behavioral",
    severity: "high",
    enabled: true,
    triggeredCount: 78,
    updatedAt: "2025-02-12T10:15:00Z",
  },
  {
    id: "sig_008",
    name: "Unusual Submission Time",
    description: "Submission outside normal business hours",
    category: "behavioral",
    severity: "low",
    enabled: true,
    triggeredCount: 890,
    updatedAt: "2025-02-11T15:45:00Z",
  },
];

const CATEGORY_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "risk", label: "Risk" },
  { value: "behavioral", label: "Behavioral" },
  { value: "device", label: "Device" },
];

const SEVERITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "category", label: "Category" },
  { id: "severity", label: "Severity" },
  { id: "enabled", label: "Enabled" },
  { id: "triggeredCount", label: "Triggered" },
  { id: "updatedAt", label: "Updated at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  category: true,
  severity: true,
  enabled: true,
  triggeredCount: true,
  updatedAt: true,
};

const columns: ColumnDef<Signal, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
    cell: ({ row }) => (
      <span className="font-medium text-[var(--color-text)]">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 240,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 120,
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge color={getSignalCategoryColor(category) as BadgeProps["color"]} variant="soft">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "severity",
    header: "Severity",
    size: 110,
    cell: ({ row }) => {
      const severity = row.original.severity;
      return (
        <Badge color={getRiskColor(severity) as BadgeProps["color"]} variant="soft">
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    size: 100,
    cell: ({ row }) => {
      const enabled = row.original.enabled;
      return (
        <Badge color={enabled ? "success" : "secondary"} variant="soft">
          {enabled ? "Active" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "triggeredCount",
    header: "Triggered",
    size: 110,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">{row.original.triggeredCount.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at",
    size: 180,
    cell: dateTimeCell<Signal>((r) => r.updatedAt),
  },
];

export default function InquirySignalsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = categoryFilter.length > 0 || severityFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockSignals.filter((signal) => {
      if (categoryFilter.length > 0 && !categoryFilter.includes(signal.category)) {
        return false;
      }

      if (severityFilter.length > 0 && !severityFilter.includes(signal.severity)) {
        return false;
      }

      if (search) {
        const searchLower = search.toLowerCase();
        return (
          signal.name.toLowerCase().includes(searchLower) ||
          signal.description.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [categoryFilter, severityFilter, search]);

  function clearAllFilters() {
    setCategoryFilter([]);
    setSeverityFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Signals"
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
              placeholder="Search signals..."
            />

            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={CATEGORY_OPTIONS}
                value={categoryFilter}
                onChange={(opts) => setCategoryFilter(opts.map((o) => o.value))}
                placeholder="Category"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={SEVERITY_OPTIONS}
                value={severityFilter}
                onChange={(opts) => setSeverityFilter(opts.map((o) => o.value))}
                placeholder="Severity"
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
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            description: false,
            triggeredCount: false,
          }}
        />
      </div>
    </div>
  );
}
