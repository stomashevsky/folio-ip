import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { getMonitoringResultColor } from "@/lib/utils/format";
import { SectionHeading, KeyValueTable, InlineEmpty } from "@/components/shared";
import type { Report } from "@/lib/types";

interface MonitoringCheck {
  date: string;
  result: "clear" | "match_found" | "error";
  matchCount: number;
  source: string;
}

function generateMonitoringChecks(report: Report): MonitoringCheck[] {
  if (!report.continuousMonitoring) return [];
  const seed = report.id.charCodeAt(4) + report.id.charCodeAt(5);
  return [
    { date: "2025-12-15T08:00:00Z", result: seed % 3 === 0 ? "match_found" : "clear", matchCount: seed % 3 === 0 ? 1 : 0, source: "OFAC SDN List" },
    { date: "2025-12-08T08:00:00Z", result: "clear", matchCount: 0, source: "EU Consolidated List" },
    { date: "2025-12-01T08:00:00Z", result: "clear", matchCount: 0, source: "OFAC SDN List" },
    { date: "2025-11-24T08:00:00Z", result: seed % 5 === 0 ? "error" : "clear", matchCount: 0, source: "UN Security Council" },
    { date: "2025-11-17T08:00:00Z", result: "clear", matchCount: 0, source: "PEP Databases" },
  ];
}

const RESULT_LABELS: Record<string, string> = {
  clear: "Clear",
  match_found: "Match found",
  error: "Error",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MonitoringTab({ report }: { report: Report }) {
  const checks = generateMonitoringChecks(report);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Monitoring status</SectionHeading>
        <KeyValueTable
          rows={[
            {
              label: "Status",
              value: report.continuousMonitoring ? (
                <Badge color="success" size="sm">Active</Badge>
              ) : (
                <Badge color="secondary" size="sm">Disabled</Badge>
              ),
            },
            { label: "Frequency", value: report.continuousMonitoring ? "Weekly" : "—" },
            { label: "Total checks", value: report.continuousMonitoring ? checks.length : 0 },
            {
              label: "Last checked",
              value: checks.length > 0 ? formatDate(checks[0].date) : "—",
            },
            {
              label: "Next check",
              value: report.continuousMonitoring ? "Dec 22, 2025" : "—",
            },
          ]}
        />
      </div>

      <div>
        <SectionHeading badge={checks.length}>Check history</SectionHeading>
        {checks.length === 0 ? (
          <InlineEmpty>
            Continuous monitoring is not enabled for this report.
          </InlineEmpty>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="-mb-px w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    Source
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    Result
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    Matches
                  </th>
                </tr>
              </thead>
              <tbody>
                {checks.map((check, i) => {
                  const resultColor = getMonitoringResultColor(check.result) as BadgeProps["color"];
                  const resultLabel = RESULT_LABELS[check.result] ?? "Clear";
                  return (
                    <tr
                      key={i}
                      className="border-b border-[var(--color-border)]"
                    >
                      <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                        {formatDate(check.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {check.source}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={resultColor} size="sm">
                          {resultLabel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                        {check.matchCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
