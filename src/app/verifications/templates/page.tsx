"use client";

import { useCallback, useState, useMemo } from "react";
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
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Plus } from "@plexui/ui/components/Icon";
import { VERIFICATION_TYPE_LABELS } from "@/lib/constants/verification-type-labels";
import {
  TEMPLATE_STATUS_OPTIONS,
  VERIFICATION_TYPE_OPTIONS,
} from "@/lib/constants/filter-options";
import { VERIFICATION_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import { AVAILABLE_CHECKS } from "@/lib/constants/verification-checks";
import { TemplatePickerModal } from "@/components/shared";
import {
  VERIFICATION_TEMPLATE_COLUMN_CONFIG,
  VERIFICATION_TEMPLATE_DEFAULT_VISIBILITY,
} from "@/lib/constants/column-configs";

const STATUS_OPTIONS = TEMPLATE_STATUS_OPTIONS;
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

const CATEGORY_COLORS: Record<string, string> = {
  fraud: "danger",
  validity: "secondary",
  biometrics: "info",
  user_action_required: "warning",
};

function PresetPreview({ presetId }: { presetId: string }) {
  const preset = VERIFICATION_TEMPLATE_PRESETS.find((p) => p.id === presetId);
  if (!preset) return null;
  const type = preset.defaults.type;
  const allChecks = AVAILABLE_CHECKS[type] ?? [];
  const presetCheckNames = new Set(preset.defaults.checks.map((c) => c.name));

  return (
    <div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-3">
        {preset.description}
      </p>
      <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
        {allChecks.length} checks included
      </p>
      <div className="flex flex-col gap-1.5">
        {allChecks.map((check) => (
          <div key={check.name} className="flex items-center gap-2">
            <Badge
              color={CATEGORY_COLORS[check.category] as "danger" | "secondary" | "info" | "warning"}
              variant="soft"
              size="sm"
            >
              {check.category}
            </Badge>
            <span className={`text-sm ${presetCheckNames.has(check.name) ? "text-[var(--color-text)]" : "text-[var(--color-text-tertiary)]"}`}>
              {check.name}
            </span>
            {check.lifecycle === "beta" && (
              <Badge color="discovery" variant="soft" size="sm">Beta</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VerificationTemplatesPage() {
  const router = useRouter();
  const { verificationTemplates } = useTemplateStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const renderPreview = useCallback(
    (presetId: string) => <PresetPreview presetId={presetId} />,
    [],
  );

  const allTemplates = verificationTemplates.getAll();

  const hasActiveFilters = statusFilter.length > 0 || typeFilter.length > 0;

  const filteredData = useMemo(
    () =>
      allTemplates.filter((t) => {
        if (statusFilter.length > 0 && !statusFilter.includes(t.status)) return false;
        if (typeFilter.length > 0 && !typeFilter.includes(t.type)) return false;
        return true;
      }),
    [allTemplates, statusFilter, typeFilter],
  );

  function clearAllFilters() {
    setStatusFilter([]);
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
          initialSorting={[{ id: "updatedAt", desc: true }]}
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

      <TemplatePickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Create verification template"
        presets={VERIFICATION_TEMPLATE_PRESETS}
        onSelect={(presetId) => router.push(`/verifications/templates/new?preset=${presetId}`)}
        renderPreview={renderPreview}
      />
    </div>
  );
}
