import { InlineEmpty } from "@/components/shared";
import type { InquirySignal, SignalCategory } from "@/lib/types";
import { SignalTable } from "./SignalTable";

export function SignalsTab({ signals }: { signals: InquirySignal[] }) {
  if (signals.length === 0) {
    return (
      <InlineEmpty>
        No signals recorded for this inquiry.
      </InlineEmpty>
    );
  }

  const byCategory = (cat: SignalCategory) =>
    signals.filter((s) => s.category === cat);

  const featured = byCategory("featured");
  const network = byCategory("network");
  const behavioral = byCategory("behavioral");
  const device = byCategory("device");

  return (
    <div className="space-y-6">
      <SignalTable title="Featured" signals={featured} />
      <SignalTable title="Network" signals={network} />
      <SignalTable title="Behavioral" signals={behavioral} />
      <SignalTable title="Device" signals={device} />
      <SignalTable title="All Signals" signals={signals} />
    </div>
  );
}
