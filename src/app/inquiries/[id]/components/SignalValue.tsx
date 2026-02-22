import { Badge } from "@plexui/ui/components/Badge";
import type { InquirySignal } from "@/lib/types";

export function SignalValue({ signal }: { signal: InquirySignal }) {
  const v = signal.value;
  const lowered = v.toLowerCase();

  // Threat / risk levels → colored badge
  if (lowered === "low" || lowered === "minimal") {
    return <Badge pill color="success" size="sm">{v}</Badge>;
  }
  if (lowered === "medium" || lowered === "moderate") {
    return <Badge pill color="warning" size="sm">{v}</Badge>;
  }
  if (lowered === "high" || lowered === "critical") {
    return <Badge pill color="danger" size="sm">{v}</Badge>;
  }

  // Boolean flags — sentence case
  if (lowered === "true") {
    const isBad = /proxy|tor|rooted|incognito|spoof|unrecognized/i.test(signal.name);
    return <Badge pill color={isBad ? "danger" : "success"} size="sm">True</Badge>;
  }
  if (lowered === "false") {
    return <Badge pill color="secondary" size="sm">False</Badge>;
  }

  // N/A
  if (lowered === "n/a") {
    return <span className="text-[var(--color-text-tertiary)]">{v}</span>;
  }

  // Default: plain text
  return <>{v}</>;
}
