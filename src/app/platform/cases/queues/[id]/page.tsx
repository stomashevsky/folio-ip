"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading, InlineEmpty, MetricCard } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockCases } from "@/lib/data";
import { formatDateTime } from "@/lib/utils/format";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { Field } from "@plexui/ui/components/Field";

interface CaseQueue {
  id: string;
  name: string;
  description: string;
  assignedTo: string[];
  slaHours: number;
  createdAt: string;
  assignmentMode: string;
}

const ASSIGNMENT_MODE_OPTIONS = [
  { value: "round_robin", label: "Round Robin" },
  { value: "load_balanced", label: "Load Balanced" },
  { value: "manual", label: "Manual" },
];

const MOCK_QUEUES: CaseQueue[] = [
  { id: "queue_001", name: "General Review", description: "Standard case review queue", assignedTo: ["John Smith", "Sarah Johnson"], slaHours: 24, createdAt: "2025-01-10T08:00:00Z", assignmentMode: "round_robin" },
  { id: "queue_002", name: "Fraud Investigation", description: "High-priority fraud cases", assignedTo: ["Mike Chen", "Lisa Wong"], slaHours: 12, createdAt: "2025-01-15T09:30:00Z", assignmentMode: "load_balanced" },
  { id: "queue_003", name: "Compliance", description: "Regulatory compliance reviews", assignedTo: ["Emma Davis", "Robert Brown"], slaHours: 48, createdAt: "2025-01-20T10:15:00Z", assignmentMode: "round_robin" },
  { id: "queue_004", name: "VIP Accounts", description: "Premium customer cases", assignedTo: ["Alice Martinez"], slaHours: 6, createdAt: "2025-01-25T11:00:00Z", assignmentMode: "manual" },
  { id: "queue_005", name: "Escalations", description: "Escalated and urgent cases", assignedTo: ["James Wilson", "Patricia Lee", "David Garcia"], slaHours: 4, createdAt: "2025-02-01T12:45:00Z", assignmentMode: "load_balanced" },
];

const PRIORITY_COLORS: Record<string, "danger" | "warning" | "secondary"> = {
  critical: "danger",
  high: "warning",
  medium: "secondary",
  low: "secondary",
};

export default function QueueDetailPage() {
  const params = useParams();
  const queue = MOCK_QUEUES.find((q) => q.id === params.id);

  if (!queue) {
    return <NotFoundPage section="Queues" backHref="/platform/cases/queues" entity="Queue" />;
  }

  const queueCases = mockCases.filter((c) => c.queue === queue.name);
  const openCases = queueCases.filter((c) => c.status === "open" || c.status === "in_review");
  const resolvedCases = queueCases.filter((c) => c.status === "resolved" || c.status === "closed");
  const avgResolutionHrs = resolvedCases.length > 0
    ? Math.round(resolvedCases.reduce((sum, c) => {
        const created = new Date(c.createdAt).getTime();
        const resolved = new Date(c.resolvedAt ?? c.updatedAt).getTime();
        return sum + (resolved - created) / (60 * 60 * 1000);
      }, 0) / resolvedCases.length)
    : 0;
  const slaCompliance = resolvedCases.length > 0
    ? Math.round((resolvedCases.filter((c) => {
        const created = new Date(c.createdAt).getTime();
        const resolved = new Date(c.resolvedAt ?? c.updatedAt).getTime();
        return (resolved - created) / (60 * 60 * 1000) <= queue.slaHours;
      }).length / resolvedCases.length) * 100)
    : 100;

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={queue.name}
        backHref="/platform/cases/queues"
        actions={
          <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
            Save Changes
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="Open Cases" value={openCases.length} variant="compact" />
          <MetricCard label="Total Cases" value={queueCases.length} variant="compact" />
          <MetricCard label="Avg Resolution" value={`${avgResolutionHrs}h`} variant="compact" />
          <MetricCard label="SLA Compliance" value={`${slaCompliance}%`} variant="compact" />
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Details</SectionHeading>
          <div className="mt-4 space-y-4">
            <Field label="Name">
              <Input defaultValue={queue.name} size="sm" />
            </Field>
            <Field label="Description">
              <Input defaultValue={queue.description} size="sm" />
            </Field>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Configuration</SectionHeading>
          <div className="mt-4 space-y-4">
            <Field label="SLA (hours)" description="Maximum time to resolve a case in this queue">
              <Input type="number" defaultValue={String(queue.slaHours)} size="sm" />
            </Field>
            <Field label="Assignment Mode" description="How new cases are assigned to team members">
              <div className="w-48">
                <Select
                  options={ASSIGNMENT_MODE_OPTIONS}
                  value={queue.assignmentMode}
                  onChange={() => {}}
                  size="sm"
                  variant="outline"
                  pill={false}
                />
              </div>
            </Field>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Team</SectionHeading>
          <div className="mt-4 space-y-3">
            {queue.assignedTo.map((member) => (
              <div key={member} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2">
                <div className="flex items-center gap-3">
                  <Avatar name={member} size={28} color="primary" variant="soft" />
                  <span className="text-sm text-[var(--color-text)]">{member}</span>
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {queueCases.filter((c) => c.assignee === member && (c.status === "open" || c.status === "in_review")).length} active
                </span>
              </div>
            ))}
            <Button color="secondary" variant="outline" size="sm" pill={false}>
              Add member
            </Button>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs" badge={queueCases.length}>Cases in Queue</SectionHeading>
          {queueCases.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Title</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Priority</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Assignee</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {queueCases.map((c) => (
                    <tr key={c.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-secondary)]">
                      <td className="px-4 py-3">
                        <Link href={`/platform/cases/${c.id}`} className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary-solid-bg)] hover:underline">
                          {c.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        <Badge color={PRIORITY_COLORS[c.priority] ?? "secondary"} size="sm">{c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{c.assignee ?? "Unassigned"}</td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{formatDateTime(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4"><InlineEmpty>No cases in this queue.</InlineEmpty></div>
          )}
        </div>
      </div>
    </div>
  );
}
