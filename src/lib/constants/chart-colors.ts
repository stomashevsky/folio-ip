/**
 * Shared chart color tokens using CSS variables.
 * Colors respond to theme changes (light/dark mode).
 */
export const CHART_COLORS = {
  primary: "var(--color-chart-primary)",
  secondary: "var(--color-chart-secondary)",
  muted: "var(--color-chart-muted)",
  textMuted: "var(--color-chart-text-muted)",
  accent: "var(--color-chart-accent)",
  success: "var(--color-chart-success)",
  danger: "var(--color-chart-danger)",
  neutral: "var(--color-chart-neutral)",
} as const;

export const CHART_LEGEND = {
  fontSize: 13,
  iconSize: 8,
  /** row-gap  column-gap */
  gap: "10px 24px",
  paddingBottom: 16,
  color: "var(--color-text-secondary)",
} as const;

export const TYPE_CHART_PALETTE = [
  "#0073e6",
  "#30a46c",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#ef4444",
  "#14b8a6",
  "#6366f1",
] as const;
