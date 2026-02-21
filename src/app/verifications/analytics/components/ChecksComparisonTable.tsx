"use client";

import { useState } from "react";
import type { VerificationTypeCheckRow } from "@/lib/data";
import { TYPE_CHART_PALETTE } from "@/lib/constants/chart-colors";
import { SortIcon, SortableTh, TrendIndicator, type SortDir } from "./table-primitives";

type SortKey = "label" | "passRate" | "failRate" | "avgProcessing";

interface ChecksComparisonTableProps {
  rows: VerificationTypeCheckRow[];
  typeKeys: string[];
}

export function ChecksComparisonTable({ rows, typeKeys }: ChecksComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("passRate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "string" && typeof bv === "string") {
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const colorMap = new Map(typeKeys.map((k, i) => [k, TYPE_CHART_PALETTE[i % TYPE_CHART_PALETTE.length]]));

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
      <div className="overflow-hidden">
        <table className="-mb-px w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <SortableTh onClick={() => handleSort("label")} sortIcon={<SortIcon active={sortKey === "label"} dir={sortDir} />}>Type</SortableTh>
              <SortableTh onClick={() => handleSort("passRate")} align="right" sortIcon={<SortIcon active={sortKey === "passRate"} dir={sortDir} />}>Pass Rate</SortableTh>
              <SortableTh onClick={() => handleSort("failRate")} align="right" sortIcon={<SortIcon active={sortKey === "failRate"} dir={sortDir} />}>Fail Rate</SortableTh>
              <SortableTh onClick={() => handleSort("avgProcessing")} align="right" sortIcon={<SortIcon active={sortKey === "avgProcessing"} dir={sortDir} />}>Avg Processing</SortableTh>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.typeKey} className="border-b border-[var(--color-border)]">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: colorMap.get(row.typeKey) }}
                    />
                    <span className="text-sm text-[var(--color-text)]">{row.label}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-sm text-[var(--color-text)]">{row.passRate}%</span>
                  <span className="ml-1.5"><TrendIndicator value={row.passRateTrend} /></span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-sm text-[var(--color-text)]">{row.failRate}%</span>
                  <span className="ml-1.5"><TrendIndicator value={row.failRateTrend} invert /></span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-sm text-[var(--color-text)]">{row.avgProcessing}s</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
