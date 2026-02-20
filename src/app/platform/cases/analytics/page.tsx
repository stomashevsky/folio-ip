"use client";

import { TopBar } from "@/components/layout/TopBar";
import { SummaryCard } from "@/components/shared";

export default function CaseAnalyticsPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Case Analytics" />

      <div className="space-y-6 px-4 py-6 md:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryCard label="Total Cases">
            <div className="text-2xl font-semibold">156</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              +12 this month
            </div>
          </SummaryCard>
          <SummaryCard label="Open Cases">
            <div className="text-2xl font-semibold">42</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              +5 this week
            </div>
          </SummaryCard>
          <SummaryCard label="Avg Resolution Time">
            <div className="text-2xl font-semibold">2.4 days</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              -0.3 days
            </div>
          </SummaryCard>
          <SummaryCard label="SLA Compliance">
            <div className="text-2xl font-semibold">94%</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              +2% this month
            </div>
          </SummaryCard>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="heading-sm mb-4">Status Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Open</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">42</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    26.9%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Review</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">38</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    24.4%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resolved</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">65</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    41.7%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Escalated</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">8</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    5.1%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Closed</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">3</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    1.9%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="heading-sm mb-4">Priority Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Critical</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">18</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    11.5%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">High</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">45</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    28.8%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">72</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    46.2%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">21</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    13.5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
