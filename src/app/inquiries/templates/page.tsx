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
import type { InquiryTemplate } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import { Plus } from "@plexui/ui/components/Icon";
import { TEMPLATE_STATUS_OPTIONS } from "@/lib/constants/filter-options";
import { INQUIRY_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import { TemplatePickerModal } from "@/components/shared";
import {
  INQUIRY_TEMPLATE_COLUMN_CONFIG,
  INQUIRY_TEMPLATE_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = TEMPLATE_STATUS_OPTIONS;
const COLUMN_CONFIG: ColumnConfig[] = INQUIRY_TEMPLATE_COLUMN_CONFIG;
const DEFAULT_VISIBILITY: VisibilityState = INQUIRY_TEMPLATE_DEFAULT_VISIBILITY;

const columns: ColumnDef<InquiryTemplate, unknown>[] = [
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
    header: "Template ID",
    size: 280,
    cell: idCell<InquiryTemplate>((r) => r.id),
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
    cell: statusCell<InquiryTemplate>((r) => r.status),
  },
  {
    accessorKey: "lastPublishedAt",
    header: "Published (UTC)",
    size: 180,
    cell: dateTimeCell<InquiryTemplate>((r) => r.lastPublishedAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Last updated at (UTC)",
    size: 180,
    cell: dateTimeCell<InquiryTemplate>((r) => r.updatedAt),
  },
];

export default function InquiryTemplatesPage() {
  const router = useRouter();
  const { inquiryTemplates } = useTemplateStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const allTemplates = inquiryTemplates.getAll();

  const hasActiveFilters = statusFilter.length > 0;

  const filteredData = useMemo(
    () =>
      allTemplates.filter((t) => {
        if (statusFilter.length > 0 && !statusFilter.includes(t.status)) return false;
        return true;
      }),
    [allTemplates, statusFilter],
  );

  function clearAllFilters() {
    setStatusFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Inquiry Templates"
        actions={
          <div className="flex items-center gap-2">
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
              <span className="hidden md:inline">Create Template</span>
            </Button>
          </div>
        }
        toolbar={
          <>
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
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                placeholder="Status"
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
          initialSorting={[{ id: "lastPublishedAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onRowClick={(row) => router.push(`/inquiries/templates/${row.id}`)}
          mobileColumnVisibility={{
            id: false,
            description: false,
            lastPublishedAt: false,
            updatedAt: false,
          }}
        />
      </div>

      <TemplatePickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Create inquiry template"
        presets={INQUIRY_TEMPLATE_PRESETS}
        onSelect={(presetId) => router.push(`/inquiries/templates/new?preset=${presetId}`)}
      />
    </div>
  );
}
