"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Tabs } from "@plexui/ui/components/Tabs";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  NotFoundPage,
  InfoRow,
  DetailPageSidebar,
  SectionHeading,
  EventTimeline,
} from "@/components/shared";
import { useTemplateStore } from "@/lib/stores/template-store";
import { formatDateTime } from "@/lib/utils/format";
import { useTabParam } from "@/lib/hooks/useTabParam";

const tabs = ["Overview", "Execution Trace"] as const;
type Tab = (typeof tabs)[number];

function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const STEP_NAMES = [
  "Evaluate trigger conditions",
  "Fetch inquiry data",
  "Check risk score",
  "Run sanction screening",
  "Evaluate decision rules",
  "Update inquiry status",
  "Create case",
  "Assign to queue",
  "Send notification",
  "Log audit event",
];

function generateMockSteps(run: { id: string; stepsExecuted: number; stepsTotal: number; status: string; startedAt: string }) {
  const seed = run.id.charCodeAt(4) * 137 + run.id.charCodeAt(8) * 31;
  return Array.from({ length: run.stepsTotal }, (_, i) => {
    const nameIdx = Math.floor(seededRandom(seed + i * 7) * STEP_NAMES.length);
    const durationMs = Math.round(200 + seededRandom(seed + i * 13) * 4800);
    const startMs = new Date(run.startedAt).getTime() + i * (durationMs + 100);
    const executed = i < run.stepsExecuted;
    const isFailed = executed && i === run.stepsExecuted - 1 && run.status === "failed";
    const isRunning = !executed && i === run.stepsExecuted && run.status === "running";

    return {
      step: i + 1,
      name: STEP_NAMES[nameIdx],
      status: isFailed ? "failed" : isRunning ? "running" : executed ? "completed" : "pending",
      startedAt: executed || isRunning ? new Date(startMs).toISOString() : undefined,
      completedAt: executed && !isRunning ? new Date(startMs + durationMs).toISOString() : undefined,
      durationMs: executed ? durationMs : undefined,
      error: isFailed ? "Step execution timed out after 5000ms" : undefined,
    };
  });
}

export default function WorkflowRunDetailPage() {
  return (
    <Suspense fallback={null}>
      <RunDetailContent />
    </Suspense>
  );
}

function RunDetailContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");
  const { workflowRuns } = useTemplateStore();

  const run = workflowRuns.getAll().find((r) => r.id === params.id);

  const steps = useMemo(() => {
    if (!run) return [];
    return generateMockSteps(run);
  }, [run]);

  const events = useMemo(() => {
    if (!run) return [];
    const stepLevel = (s: string): "success" | "error" | "warning" | "info" =>
      s === "completed" ? "success" : s === "failed" ? "error" : s === "running" ? "warning" : "info";
    const runLevel = (s: string): "success" | "error" | "warning" | "info" =>
      s === "failed" ? "error" : s === "canceled" ? "warning" : "success";
    return [
      { id: "e1", type: "workflow_run.started", level: "info" as const, timestamp: run.startedAt, description: `Run started by ${run.triggeredBy}` },
      ...steps
        .filter((s) => s.status === "completed" || s.status === "failed")
        .map((s, i) => ({
          id: `e${i + 2}`,
          type: s.status === "failed" ? "workflow_run.step_failed" : "workflow_run.step_completed",
          level: stepLevel(s.status),
          timestamp: s.completedAt ?? s.startedAt ?? run.startedAt,
          description: `Step ${s.step}: ${s.name} — ${s.status}${s.durationMs ? ` (${s.durationMs}ms)` : ""}`,
        })),
      ...(run.completedAt
        ? [{
            id: "efinal",
            type: "workflow_run.completed",
            level: runLevel(run.status),
            timestamp: run.completedAt,
            description: `Run ${run.status}`,
          }]
        : []),
    ];
  }, [run, steps]);

  if (!run) {
    return (
      <NotFoundPage
        section="Workflow Runs"
        backHref="/platform/workflows/runs"
        entity="Workflow Run"
      />
    );
  }

  const durationSec = run.completedAt
    ? ((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000).toFixed(1)
    : null;

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Workflow Run"
        backHref="/platform/workflows/runs"
        actions={
          <div className="flex items-center gap-2">
            <Button color="secondary" variant="outline" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              Re-run
            </Button>
          </div>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div className="shrink-0 px-4 pt-4 md:px-6">
            <Tabs
              value={activeTab}
              onChange={(v) => setActiveTab(v as Tab)}
              variant="underline"
              size="lg"
              aria-label="Run sections"
            >
              <Tabs.Tab value="Overview">Overview</Tabs.Tab>
              <Tabs.Tab value="Execution Trace" badge={{ content: run.stepsTotal, pill: true, variant: "soft" }}>Execution Trace</Tabs.Tab>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && (
              <div className="space-y-6">
                <div>
                  <SectionHeading size="xs">Summary</SectionHeading>
                  <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-lg border border-[var(--color-border)] p-3">
                      <div className="text-xs text-[var(--color-text-tertiary)]">Status</div>
                      <div className="mt-1"><StatusBadge status={run.status} /></div>
                    </div>
                    <div className="rounded-lg border border-[var(--color-border)] p-3">
                      <div className="text-xs text-[var(--color-text-tertiary)]">Steps</div>
                      <div className="mt-1 heading-xs">{run.stepsExecuted} / {run.stepsTotal}</div>
                    </div>
                    <div className="rounded-lg border border-[var(--color-border)] p-3">
                      <div className="text-xs text-[var(--color-text-tertiary)]">Duration</div>
                      <div className="mt-1 heading-xs">{durationSec ? `${durationSec}s` : "Running..."}</div>
                    </div>
                    <div className="rounded-lg border border-[var(--color-border)] p-3">
                      <div className="text-xs text-[var(--color-text-tertiary)]">Triggered by</div>
                      <div className="mt-1 heading-xs capitalize">{run.triggeredBy}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <SectionHeading size="xs">Activity</SectionHeading>
                  <div className="mt-2">
                    <EventTimeline events={events} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Execution Trace" && (
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.step}
                    className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] p-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-2xs font-medium text-[var(--color-text-secondary)]">
                      {step.step}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-text)]">{step.name}</span>
                        <Badge pill color={
                          step.status === "completed" ? "success" :
                          step.status === "failed" ? "danger" :
                          step.status === "running" ? "warning" :
                          "secondary"
                        }
                        size="sm">{step.status}</Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                        {step.startedAt && <span>Started: {formatDateTime(step.startedAt)}</span>}
                        {step.durationMs != null && <span>{step.durationMs}ms</span>}
                      </div>
                      {step.error && (
                        <div className="mt-1 rounded bg-[var(--color-background-danger-soft)] px-2 py-1 text-xs text-[var(--color-text-danger-soft)]">
                          {step.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DetailPageSidebar
          infoRows={
            <>
              <InfoRow label="Run ID" copyValue={run.id} mono>
                {run.id}
              </InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={run.status} />
              </InfoRow>
              <InfoRow label="Workflow" mono>
                <Link
                  href={`/platform/workflows/${run.workflowId}`}
                  className="text-[var(--color-background-primary-solid)] hover:underline"
                >
                  {run.workflowName}
                </Link>
              </InfoRow>
              <InfoRow label="Triggered by">
                <span className="capitalize">{run.triggeredBy}</span>
              </InfoRow>
              <InfoRow label="Steps">
                {run.stepsExecuted} / {run.stepsTotal}
              </InfoRow>
              <InfoRow label="Started at">
                {formatDateTime(run.startedAt)} UTC
              </InfoRow>
              {run.completedAt && (
                <InfoRow label="Completed at">
                  {formatDateTime(run.completedAt)} UTC
                </InfoRow>
              )}
              {durationSec && (
                <InfoRow label="Duration">
                  {durationSec}s
                </InfoRow>
              )}
            </>
          }
          tags={[]}
          onEditTags={() => {}}
          events={events}
        />
      </div>
    </div>
  );
}
