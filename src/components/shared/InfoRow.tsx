import { CopyButton } from "./CopyButton";

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
  copyValue?: string;
  mono?: boolean;
}

export function InfoRow({ label, children, copyValue, mono }: InfoRowProps) {
  return (
    <div className="py-2">
      <div className="text-sm text-[var(--color-text-tertiary)]">{label}</div>
      <div
        className={`mt-1 flex items-center gap-1.5 text-md text-[var(--color-text)]${mono ? " font-mono" : ""}`}
      >
        <span className="min-w-0 break-all">{children}</span>
        {copyValue && <CopyButton value={copyValue} />}
      </div>
    </div>
  );
}
