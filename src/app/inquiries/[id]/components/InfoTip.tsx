import { Tooltip } from "@plexui/ui/components/Tooltip";
import { InfoCircle } from "@plexui/ui/components/Icon";

export function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip content={text} side="top" maxWidth={260}>
      <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
        <InfoCircle style={{ width: 16, height: 16 }} />
      </span>
    </Tooltip>
  );
}
