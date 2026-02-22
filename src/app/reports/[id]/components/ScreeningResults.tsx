import { Badge } from "@plexui/ui/components/Badge";
import { ExclamationMarkCircleFilled } from "@plexui/ui/components/Icon";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { SectionHeading, KeyValueTable, CardHeader } from "@/components/shared";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import { formatDateTime, toTitleCase } from "@/lib/utils/format";
import type { Report } from "@/lib/types";
import { MatchTable } from "./MatchEntry";

export function ScreeningResults({ report }: { report: Report }) {
  const reportType = REPORT_TYPE_LABELS[report.type] ?? report.type;
  const hasMatches = report.matchCount > 0 && report.matches && report.matches.length > 0;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <CardHeader
          title="Screening results"
          badge={
            hasMatches ? (
              <Badge pill color="danger" size="sm">{report.matchCount} match{report.matchCount > 1 ? "es" : ""}</Badge>
            ) : (
              <Badge pill color="success" size="sm">
                Clear
              </Badge>
            )
          }
        />

        <div className="px-4 py-6">
          {!hasMatches ? (
            <EmptyMessage fill="none">
              <EmptyMessage.Title>No matches found</EmptyMessage.Title>
              <EmptyMessage.Description>
                The subject was screened against all available databases. No
                matches were identified.
              </EmptyMessage.Description>
            </EmptyMessage>
          ) : (
            <EmptyMessage fill="none">
              <EmptyMessage.Icon size="sm" color="danger">
                <ExclamationMarkCircleFilled />
              </EmptyMessage.Icon>
              <EmptyMessage.Title color="danger">
                {report.matchCount} match{report.matchCount > 1 ? "es" : ""}{" "}
                found
              </EmptyMessage.Title>
              <EmptyMessage.Description>
                Review required. Potential matches identified during screening.
              </EmptyMessage.Description>
            </EmptyMessage>
          )}
        </div>
      </div>

      <div>
        <SectionHeading>Report details</SectionHeading>
        <KeyValueTable
          rows={[
            { label: "Report Type", value: reportType },
            {
              label: "Primary Input",
              value: toTitleCase(report.primaryInput),
            },
            { label: "Template", value: report.templateName },
            {
              label: "Created By",
              value: (
                <span className="capitalize">{report.createdBy}</span>
              ),
            },
            {
              label: "Created At",
              value: `${formatDateTime(report.createdAt)} UTC`,
            },
            {
              label: "Completed At",
              value: report.completedAt
                ? `${formatDateTime(report.completedAt)} UTC`
                : "—",
            },
            {
              label: "Continuous Monitoring",
              value: report.continuousMonitoring ? "Enabled" : "Disabled",
            },
          ]}
        />
      </div>

      {hasMatches && report.matches && (
        <div>
          <SectionHeading badge={report.matches.length}>
            Match entries
          </SectionHeading>
          <MatchTable matches={report.matches} />
        </div>
      )}
    </div>
  );
}
