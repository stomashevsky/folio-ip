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
import type { VerificationTemplate } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Menu } from "@plexui/ui/components/Menu";
import { Plus } from "@plexui/ui/components/Icon";
import { VERIFICATION_TYPE_LABELS } from "@/lib/constants/verification-type-labels";
import { VERIFICATION_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import {
  VERIFICATION_TYPE_OPTIONS,
} from "@/lib/constants/filter-options";
import {
  VERIFICATION_TEMPLATE_COLUMN_CONFIG,
  VERIFICATION_TEMPLATE_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_TABS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
];
const TYPE_OPTIONS = VERIFICATION_TYPE_OPTIONS;
const COLUMN_CONFIG: ColumnConfig[] = VERIFICATION_TEMPLATE_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = VERIFICATION_TEMPLATE_DEFAULT_VISIBILITY;

const columns: ColumnDef<VerificationTemplate, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 240,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Template ID",
    size: 280,
    cell: idCell<VerificationTemplate>((r) => r.id),
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 160,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {VERIFICATION_TYPE_LABELS[row.original.type] ?? row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<VerificationTemplate>((r) => r.status),
  },
  {
    accessorKey: "lastPublishedAt",
    header: "Published (UTC)",
    size: 180,
    cell: dateTimeCell<VerificationTemplate>((r) => r.lastPublishedAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Last updated at (UTC)",
    size: 180,
    cell: dateTimeCell<VerificationTemplate>((r) => r.updatedAt),
  },
];

export default function VerificationTemplatesPage() {
  const router = useRouter();
  const { verificationTemplates } = useTemplateStore();

  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("active");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const allTemplates = verificationTemplates.getAll();

  const hasActiveFilters = typeFilter.length > 0;

  const filteredData = useMemo(
    () =>
      allTemplates.filter((t) => {
        if (t.status !== statusTab) return false;
        if (typeFilter.length > 0 && !typeFilter.includes(t.type)) return false;
        return true;
      }),
    [allTemplates, statusTab, typeFilter],
  );

  function clearAllFilters() {
    setTypeFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Verification Templates"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Menu>
              <Menu.Trigger>
                <Button
                  color="primary"
                  size={TOPBAR_CONTROL_SIZE}
                  pill={TOPBAR_ACTION_PILL}
                >
                  <Plus />
                  <span className="hidden md:inline">Create Template</span>
                </Button>
              </Menu.Trigger>
              <Menu.Content align="end" minWidth="auto" width={300}>
                {VERIFICATION_TEMPLATE_PRESETS.map((preset) => (
                    <Menu.Item
                      key={preset.id}
                      onSelect={() => router.push(`/verifications/templates/new?preset=${preset.id}`)}
                    >
                      <div>
                        <p className="font-semibold">{preset.name}</p>
                        <p className="font-normal text-secondary text-[0.935em] leading-[1.45]">{preset.description}</p>
                      </div>
                    </Menu.Item>
                ))}
              </Menu.Content>
            </Menu>
          </div>
        }
        toolbar={
          <>
            <SegmentedControl
              aria-label="Template status"
              value={statusTab}
              onChange={setStatusTab}
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_TOOLBAR_PILL}
            >
              {STATUS_TABS.map((tab) => (
                <SegmentedControl.Tab key={tab.value} value={tab.value}>
                  {tab.label}
                </SegmentedControl.Tab>
              ))}
            </SegmentedControl>

            <div className="mx-1 h-5 w-px bg-[var(--color-border)]" />

            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search templates..."
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
          initialSorting={[{ id: "name", desc: false }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onRowClick={(row) => router.push(`/verifications/templates/${row.id}`)}
          mobileColumnVisibility={{
            id: false,
            lastPublishedAt: false,
            updatedAt: false,
          }}
        />
      </div>
    </div>
  );
}
