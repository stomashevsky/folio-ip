"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@plexui/ui/components/Input";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { Search, InfoCircle } from "@plexui/ui/components/Icon";
import { InlineEmpty, SectionHeading } from "@/components/shared";
import { toTitleCase, getMatchTypeColor, getMatchStatusColor, getMatchScoreColor } from "@/lib/utils/format";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import type { Report, ReportMatch } from "@/lib/types";

type BadgeColor = BadgeProps["color"];

const matchStatusLabels: Record<string, string> = {
  pending_review: "Pending Review",
  confirmed: "Confirmed",
  dismissed: "Dismissed",
};

interface AggregatedMatch extends ReportMatch {
  reportId: string;
  reportType: string;
}

function aggregateMatches(reports: Report[]): AggregatedMatch[] {
  const results: AggregatedMatch[] = [];
  for (const report of reports) {
    if (!report.matches) continue;
    for (const match of report.matches) {
      results.push({
        ...match,
        reportId: report.id,
        reportType: REPORT_TYPE_LABELS[report.type] ?? report.type,
      });
    }
  }
  return results;
}

const thClass =
  "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]";

export function ListMatchesTab({ reports }: { reports: Report[] }) {
  const [search, setSearch] = useState("");
  const allMatches = aggregateMatches(reports);

  const filtered = search
    ? allMatches.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.source.toLowerCase().includes(search.toLowerCase()) ||
          (m.country ?? "").toLowerCase().includes(search.toLowerCase()) ||
          m.reportId.toLowerCase().includes(search.toLowerCase()),
      )
    : allMatches;

  if (allMatches.length === 0) {
    return <InlineEmpty>No matches found across linked reports.</InlineEmpty>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeading badge={allMatches.length}>
          All matches
        </SectionHeading>
        <div className="w-60">
          <Input
            placeholder="Search matches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={search ? () => setSearch("") : undefined}
            startAdornment={<Search style={{ width: 16, height: 16 }} />}
            size="sm"
            pill
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="-mb-px w-full table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[18%]" />
              <col className="w-[80px]" />
              <col className="w-[10%]" />
              <col className="w-[90px]" />
              <col className="w-[120px]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className={thClass}>
                  <span className="inline-flex items-center gap-1">
                    Matched Name
                    <Tooltip
                      content="Name or alias found in the screening database that matches the report subject"
                      side="top"
                      maxWidth={260}
                    >
                      <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                        <InfoCircle style={{ width: 14, height: 14 }} />
                      </span>
                    </Tooltip>
                  </span>
                </th>
                <th className={thClass}>Source</th>
                <th className={thClass}>
                  <span className="inline-flex items-center gap-1">
                    Score
                    <Tooltip
                      content="Match confidence score (0-100%). Higher scores indicate a stronger match."
                      side="top"
                      maxWidth={260}
                    >
                      <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                        <InfoCircle style={{ width: 14, height: 14 }} />
                      </span>
                    </Tooltip>
                  </span>
                </th>
                <th className={thClass}>Country</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Report</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((match) => (
                <tr
                  key={`${match.reportId}-${match.id}`}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {toTitleCase(match.name)}
                      </p>
                      {match.aliases && match.aliases.length > 0 && (
                        <p className="mt-0.5 truncate text-xs text-[var(--color-text-tertiary)]">
                          aka {match.aliases.map((a) => toTitleCase(a)).join(", ")}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                    {match.source}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={getMatchScoreColor(match.score) as BadgeColor} size="sm">
                      {match.score}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                    {match.country ?? "\u2014"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      color={getMatchTypeColor(match.matchType) as BadgeColor}
                      size="sm"
                    >
                      {match.matchType.charAt(0).toUpperCase() + match.matchType.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      color={getMatchStatusColor(match.status) as BadgeColor}
                      size="sm"
                      variant="outline"
                    >
                      {matchStatusLabels[match.status] ?? match.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <Link
                        href={`/reports/${match.reportId}`}
                        className="block truncate font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-background-primary-solid)] hover:underline"
                        title={match.reportId}
                      >
                        {match.reportId}
                      </Link>
                      <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                        {match.reportType}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <InlineEmpty>{`No matches matching "${search}"`}</InlineEmpty>
      )}
    </div>
  );
}
