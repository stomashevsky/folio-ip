"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, ColumnSettings } from "@/components/shared";
import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import { Button } from "@plexui/ui/components/Button";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { getRiskColor } from "@/lib/utils/format";
import { Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

interface TransactionTypeConfig {
  id: string;
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  requiresReview: boolean;
  autoApproveThreshold: number;
  createdAt: string;
  updatedAt: string;
}

const RISK_LEVEL_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const mockTransactionTypes: TransactionTypeConfig[] = [
  {
    id: "txtype_1",
    name: "Payment",
    description: "Standard payment transactions",
    riskLevel: "low",
    requiresReview: false,
    autoApproveThreshold: 5000,
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2025-12-15T14:30:00Z",
  },
  {
    id: "txtype_2",
    name: "Withdrawal",
    description: "Cash withdrawal from account",
    riskLevel: "medium",
    requiresReview: true,
    autoApproveThreshold: 2000,
    createdAt: "2025-12-02T11:00:00Z",
    updatedAt: "2025-12-16T09:15:00Z",
  },
  {
    id: "txtype_3",
    name: "Transfer",
    description: "Inter-account or international transfer",
    riskLevel: "high",
    requiresReview: true,
    autoApproveThreshold: 1000,
    createdAt: "2025-12-03T12:00:00Z",
    updatedAt: "2025-12-17T16:45:00Z",
  },
  {
    id: "txtype_4",
    name: "Deposit",
    description: "Account deposit or funding",
    riskLevel: "low",
    requiresReview: false,
    autoApproveThreshold: 10000,
    createdAt: "2025-12-04T13:00:00Z",
    updatedAt: "2025-12-18T11:20:00Z",
  },
  {
    id: "txtype_5",
    name: "Refund",
    description: "Refund or reversal transaction",
    riskLevel: "medium",
    requiresReview: true,
    autoApproveThreshold: 3000,
    createdAt: "2025-12-05T14:00:00Z",
    updatedAt: "2025-12-19T13:50:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "riskLevel", label: "Risk Level" },
  { id: "requiresReview", label: "Review Required" },
  { id: "autoApproveThreshold", label: "Auto-Approve Threshold" },
  { id: "createdAt", label: "Created At" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  riskLevel: true,
  requiresReview: true,
  autoApproveThreshold: true,
  createdAt: true,
};



const columns: ColumnDef<TransactionTypeConfig, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 150,
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
    accessorKey: "riskLevel",
    header: "Risk Level",
    size: 120,
    cell: ({ row }) => (
      <Badge
        color={getRiskColor(row.original.riskLevel) as BadgeProps["color"]}
        variant="soft"
        size="sm"
      >
        {row.original.riskLevel.charAt(0).toUpperCase() +
          row.original.riskLevel.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: "requiresReview",
    header: "Review Required",
    size: 140,
    cell: ({ row }) => (
      <Badge
        color={row.original.requiresReview ? "warning" : "secondary"}
        variant="soft"
        size="sm"
      >
        {row.original.requiresReview ? "Required" : "Auto"}
      </Badge>
    ),
  },
  {
    accessorKey: "autoApproveThreshold",
    header: "Auto-Approve Threshold",
    size: 180,
    cell: ({ row }) => (
      <span className="font-medium">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(row.original.autoApproveThreshold)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 180,
    cell: dateTimeCell<TransactionTypeConfig>((r) => r.createdAt),
  },
];

export default function TransactionTypesPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = riskFilter.length > 0;

  function clearAllFilters() {
    setRiskFilter([]);
  }

  const filteredData = useMemo(() => {
    return mockTransactionTypes.filter((type) => {
      if (riskFilter.length > 0 && !riskFilter.includes(type.riskLevel)) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          type.name.toLowerCase().includes(searchLower) ||
          type.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [search, riskFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Transaction Types"
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
              placeholder="Search types..."
            />
            <div className="w-36">
              <Select multiple clearable block pill={TOPBAR_TOOLBAR_PILL} listMinWidth={180} options={RISK_LEVEL_OPTIONS} value={riskFilter} onChange={(opts) => setRiskFilter(opts.map((o) => o.value))} placeholder="Risk Level" variant="outline" size={TOPBAR_CONTROL_SIZE} />
            </div>
            {hasActiveFilters && (
              <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_TOOLBAR_PILL} onClick={clearAllFilters}>
                Clear filters
              </Button>
            )}
            <Button
              color="primary"
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_TOOLBAR_PILL}
            >
              <Plus />
              <span className="hidden md:inline">Create Type</span>
            </Button>
          </>
        }
      />

      <div className={TABLE_PAGE_CONTENT}>
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "name", desc: false }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            description: false,
            autoApproveThreshold: false,
          }}
        />
      </div>
    </div>
  );
}
