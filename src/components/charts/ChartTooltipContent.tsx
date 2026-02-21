"use client";

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "var(--color-surface-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
};

const LABEL_STYLE: React.CSSProperties = {
  margin: "0 0 6px",
  color: "var(--color-text)",
  fontWeight: 500,
};

const ITEM_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "2px 0",
  color: "var(--color-text)",
};

const DOT_BASE: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  flexShrink: 0,
};

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
  valueFormatter?: (value: number, entry?: Record<string, unknown>) => string;
  nameFormatter?: (name: string) => string;
  rawLabel?: boolean;
  hideLabel?: boolean;
}

function formatDateLabel(label: string): string {
  const d = new Date(label);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  valueFormatter,
  nameFormatter,
  rawLabel,
  hideLabel,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  const displayLabel = hideLabel
    ? null
    : rawLabel
      ? String(label)
      : formatDateLabel(String(label));

  return (
    <div style={TOOLTIP_STYLE}>
      {displayLabel && <p style={LABEL_STYLE}>{displayLabel}</p>}
      {payload.map((entry, i) => {
        const name = nameFormatter
          ? nameFormatter(String(entry.name))
          : String(entry.name);
        const value =
          valueFormatter && typeof entry.value === "number"
            ? valueFormatter(entry.value, entry.payload)
            : entry.value;

        return (
          <div key={i} style={ITEM_STYLE}>
            <span style={{ ...DOT_BASE, backgroundColor: entry.color }} />
            <span>
              {name} : {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
