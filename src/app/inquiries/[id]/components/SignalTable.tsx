import { Tooltip } from "@plexui/ui/components/Tooltip";
import { ExclamationMarkCircle } from "@plexui/ui/components/Icon";
import { KeyValueTable } from "@/components/shared";
import { signalDescriptions } from "@/lib/data";
import type { InquirySignal } from "@/lib/types";
import { InfoTip } from "./InfoTip";
import { SignalValue } from "./SignalValue";

export function SignalTable({
  title,
  signals,
}: {
  title: string;
  signals: InquirySignal[];
}) {
  if (signals.length === 0) return null;
  return (
    <KeyValueTable
      title={title}
      rows={signals.map((s) => {
        const desc = signalDescriptions[s.name];
        return {
          label: (
            <span className="inline-flex items-center gap-1 text-[var(--color-text)]">
              {s.name}
              {desc && <InfoTip text={desc} />}
            </span>
          ),
          value: (
            <span className="inline-flex items-center gap-1.5 text-[var(--color-text)]">
              <SignalValue signal={s} />
              {s.flagged && (
                <Tooltip content="This signal has been flagged" side="top">
                  <span className="inline-flex shrink-0 cursor-help text-[var(--color-background-danger-solid)]">
                    <ExclamationMarkCircle style={{ width: 16, height: 16 }} />
                  </span>
                </Tooltip>
              )}
            </span>
          ),
        };
      })}
    />
  );
}
