"use client";

import { Badge } from "@plexui/ui/components/Badge";
import { SectionHeading } from "@/components/shared";
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
  return (
    <div className="space-y-6">
      <ScreeningResults report={report} />

      <div>
        <SectionHeading>Screening sources</SectionHeading>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="-mb-px w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                  Database
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                  Last checked
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {SCREENING_SOURCES.map((src) => (
                <tr
                  key={src.name}
                  className="border-b border-[var(--color-border)]"
                >
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                    {src.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {src.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {src.lastChecked}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge pill color="success" size="sm">Screened</Badge>
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
