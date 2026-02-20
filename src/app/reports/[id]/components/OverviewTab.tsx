"use client";

import { Badge } from "@plexui/ui/components/Badge";
import { SectionHeading, KeyValueTable } from "@/components/shared";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import { formatDateTime, toTitleCase } from "@/lib/utils/format";
import type { Report } from "@/lib/types";
import { ScreeningResults } from "./ScreeningResults";

const SCREENING_SOURCES = [
  { name: "OFAC SDN List", type: "Sanctions", lastChecked: "2025-12-15" },
  { name: "EU Consolidated List", type: "Sanctions", lastChecked: "2025-12-15" },
  { name: "UN Security Council", type: "Sanctions", lastChecked: "2025-12-15" },
  { name: "PEP Databases (Global)", type: "PEP", lastChecked: "2025-12-14" },
  { name: "Adverse Media Screening", type: "Media", lastChecked: "2025-12-14" },
  { name: "Interpol Red Notices", type: "Law Enforcement", lastChecked: "2025-12-13" },
];

export function OverviewTab({ report }: { report: Report }) {
  const reportType = REPORT_TYPE_LABELS[report.type] ?? report.type;

  return (
    <div className="space-y-6">
      <ScreeningResults report={report} />

      <div>
        <SectionHeading>Report details</SectionHeading>
        <KeyValueTable
          rows={[
            { label: "Report Type", value: reportType },
            { label: "Primary Input", value: toTitleCase(report.primaryInput) },
            { label: "Template", value: report.templateName },
            { label: "Created By", value: <span className="capitalize">{report.createdBy}</span> },
            { label: "Created At", value: `${formatDateTime(report.createdAt)} UTC` },
            { label: "Completed At", value: report.completedAt ? `${formatDateTime(report.completedAt)} UTC` : "—" },
            {
              label: "Continuous Monitoring",
              value: report.continuousMonitoring ? (
                <Badge color="success" size="sm">Enabled</Badge>
              ) : "Disabled",
            },
          ]}
        />
      </div>

      <div>
        <SectionHeading>Screening sources</SectionHeading>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                  Database
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                  Last checked
                </th>
              </tr>
            </thead>
            <tbody>
              {SCREENING_SOURCES.map((src) => (
                <tr
                  key={src.name}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                    {src.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {src.type}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="success" size="sm">Screened</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {src.lastChecked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
