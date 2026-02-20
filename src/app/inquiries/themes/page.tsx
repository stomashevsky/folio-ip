"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";

interface Theme {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft";
  primaryColor: string;
  logoUrl: string;
  usedBy: number;
  updatedAt: string;
}

const mockThemes: Theme[] = [
  {
    id: "th_001",
    name: "Default",
    description: "Standard light theme",
    status: "active",
    primaryColor: "#0066CC",
    logoUrl: "https://example.com/logo-default.png",
    usedBy: 45,
    updatedAt: "2025-02-15T10:30:00Z",
  },
  {
    id: "th_002",
    name: "Corporate Blue",
    description: "Professional blue color scheme",
    status: "active",
    primaryColor: "#003D99",
    logoUrl: "https://example.com/logo-blue.png",
    usedBy: 28,
    updatedAt: "2025-02-10T14:15:00Z",
  },
  {
    id: "th_003",
    name: "Modern Dark",
    description: "Dark mode with modern aesthetics",
    status: "active",
    primaryColor: "#1A1A1A",
    logoUrl: "https://example.com/logo-dark.png",
    usedBy: 12,
    updatedAt: "2025-02-08T09:45:00Z",
  },
  {
    id: "th_004",
    name: "Minimal Light",
    description: "Clean and minimal light theme",
    status: "draft",
    primaryColor: "#F5F5F5",
    logoUrl: "https://example.com/logo-minimal.png",
    usedBy: 0,
    updatedAt: "2025-02-05T11:20:00Z",
  },
  {
    id: "th_005",
    name: "Custom Brand",
    description: "Client-specific branding",
    status: "active",
    primaryColor: "#FF6B35",
    logoUrl: "https://example.com/logo-custom.png",
    usedBy: 8,
    updatedAt: "2025-02-01T16:00:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
  { id: "primaryColor", label: "Primary Color" },
  { id: "usedBy", label: "Used By" },
  { id: "updatedAt", label: "Updated at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  status: true,
  primaryColor: true,
  usedBy: true,
  updatedAt: true,
};

const columns: ColumnDef<Theme, unknown>[] = [
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
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const status = row.original.status;
      const color = status === "active" ? "success" : "secondary";
      const label = status === "active" ? "Active" : "Draft";
      return (
        <Badge color={color} variant="soft">
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "primaryColor",
    header: "Primary Color",
    size: 160,
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-4 w-4 rounded-full"
          style={{ backgroundColor: row.original.primaryColor }}
        />
        <span className="font-mono text-[var(--color-text-secondary)]">
          {row.original.primaryColor}
        </span>
      </span>
    ),
  },
  {
    accessorKey: "usedBy",
    header: "Used By",
    size: 100,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">{row.original.usedBy}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at",
    size: 180,
    cell: dateTimeCell<Theme>((r) => r.updatedAt),
  },
];

export default function InquiryThemesPage() {
  const [search, setSearch] = useState("");
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    if (!search) return mockThemes;
    const searchLower = search.toLowerCase();
    return mockThemes.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
    );
  }, [search]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Themes"
        actions={
          <ColumnSettings
            columns={COLUMN_CONFIG}
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
        }
        toolbar={
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search themes..."
          />
        }
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-2 md:px-6">
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
