"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";

interface AccountType {
  id: string;
  name: string;
  description: string;
  accountsCount: number;
  requiredFields: string[];
  autoApprove: boolean;
  createdAt: string;
}

const APPROVAL_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
];

const mockAccountTypes: AccountType[] = [
  {
    id: "at_001",
    name: "Individual",
    description: "Personal account for individual users",
    accountsCount: 1245,
    requiredFields: ["firstName", "lastName", "dateOfBirth", "ssn"],
    autoApprove: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "at_002",
    name: "Business",
    description: "Account for small to medium businesses",
    accountsCount: 342,
    requiredFields: ["businessName", "ein", "businessAddress", "ownerInfo"],
    autoApprove: false,
    createdAt: "2024-02-20T14:15:00Z",
  },
  {
    id: "at_003",
    name: "Corporate",
    description: "Enterprise-level corporate accounts",
    accountsCount: 89,
    requiredFields: ["corporateName", "ein", "boardMembers", "complianceOfficer"],
    autoApprove: true,
    createdAt: "2024-03-10T09:45:00Z",
  },
  {
    id: "at_004",
    name: "Trust",
    description: "Trust and fiduciary accounts",
    accountsCount: 156,
    requiredFields: ["trustName", "trusteeInfo", "beneficiaries", "trustDocument"],
    autoApprove: false,
    createdAt: "2024-04-05T11:20:00Z",
  },
  {
    id: "at_005",
    name: "Non-Profit",
    description: "Non-profit organization accounts",
    accountsCount: 78,
    requiredFields: ["orgName", "ein", "501c3Status", "boardMembers"],
    autoApprove: true,
    createdAt: "2024-05-12T16:00:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "accountsCount", label: "Accounts" },
  { id: "requiredFields", label: "Required Fields" },
  { id: "autoApprove", label: "Auto Approve" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  accountsCount: true,
  requiredFields: true,
  autoApprove: true,
  createdAt: true,
};

const columns: ColumnDef<AccountType, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 140,
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
    accessorKey: "accountsCount",
    header: "Accounts",
    size: 100,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">{row.original.accountsCount.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "requiredFields",
    header: "Required Fields",
    size: 200,
    cell: ({ row }) => {
      const fields = row.original.requiredFields;
      const displayed = fields.slice(0, 3).join(", ");
      const remaining = fields.length > 3 ? ` +${fields.length - 3}` : "";
      return (
        <span className="text-[var(--color-text-secondary)]">
          {displayed}
          {remaining}
        </span>
      );
    },
  },
  {
    accessorKey: "autoApprove",
    header: "Auto Approve",
    size: 120,
    cell: ({ row }) => {
      const autoApprove = row.original.autoApprove;
      return (
        <Badge color={autoApprove ? "success" : "secondary"} variant="soft">
          {autoApprove ? "Auto" : "Manual"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    size: 180,
    cell: dateTimeCell<AccountType>((r) => r.createdAt),
  },
];

export default function AccountTypesPage() {
  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = approvalFilter.length > 0;

  function clearAllFilters() {
    setApprovalFilter([]);
  }

  const filteredData = useMemo(() => {
    return mockAccountTypes.filter((item) => {
      if (approvalFilter.length > 0) {
        const val = item.autoApprove ? "auto" : "manual";
        if (!approvalFilter.includes(val)) return false;
      }
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [search, approvalFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Account Types"
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
              placeholder="Search account types..."
            />
            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={APPROVAL_OPTIONS}
                value={approvalFilter}
                onChange={(opts) => setApprovalFilter(opts.map((o) => o.value))}
                placeholder="Approval"
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
        />
      </div>
    </div>
  );
}
