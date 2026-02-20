import { Badge } from "@plexui/ui/components/Badge";
import { InlineEmpty } from "@/components/shared";
import type { Transaction } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";

interface ActivityEvent {
  timestamp: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "danger";
}

const typeColors: Record<string, "secondary" | "warning" | "success" | "danger"> = {
  info: "secondary",
  warning: "warning",
  success: "success",
  danger: "danger",
};

function generateEvents(txn: Transaction): ActivityEvent[] {
  const events: ActivityEvent[] = [
    { timestamp: txn.createdAt, title: "Transaction created", description: `${txn.type} of ${new Intl.NumberFormat("en-US", { style: "currency", currency: txn.currency }).format(txn.amount)} initiated`, type: "info" },
    { timestamp: new Date(new Date(txn.createdAt).getTime() + 2000).toISOString(), title: "Risk assessment completed", description: `Risk score: ${txn.riskScore}%`, type: txn.riskScore > 70 ? "danger" : txn.riskScore > 40 ? "warning" : "success" },
  ];

  if (txn.riskScore > 50) {
    events.push({ timestamp: new Date(new Date(txn.createdAt).getTime() + 5000).toISOString(), title: "Flagged for review", description: "Transaction exceeds risk threshold", type: "warning" });
  }

  if (txn.reviewedAt) {
    events.push({ timestamp: txn.reviewedAt, title: "Reviewed by analyst", description: `Reviewed by ${txn.reviewedBy ?? "System"}`, type: "info" });
  }

  if (txn.status === "approved") {
    events.push({ timestamp: txn.reviewedAt ?? txn.createdAt, title: "Transaction approved", description: "Cleared for processing", type: "success" });
  } else if (txn.status === "declined") {
    events.push({ timestamp: txn.reviewedAt ?? txn.createdAt, title: "Transaction declined", description: "Blocked due to compliance policy", type: "danger" });
  }

  return events;
}

export function ActivityTab({ transaction }: { transaction: Transaction }) {
  const events = generateEvents(transaction);

  if (events.length === 0) {
    return <InlineEmpty>No activity recorded.</InlineEmpty>;
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {i < events.length - 1 && (
            <div className="absolute left-[7px] top-4 h-full w-px bg-[var(--color-border)]" />
          )}
          <div className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)]" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[var(--color-text)]">{event.title}</p>
              <Badge color={typeColors[event.type]} size="sm">{event.type}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{event.description}</p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{formatDateTime(event.timestamp)} UTC</p>
          </div>
        </div>
      ))}
    </div>
  );
}
