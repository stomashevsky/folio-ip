/**
 * Shared status → color mapping for charts (donut, bars, etc.).
 * Uses CSS variable tokens so colors respond to theme changes.
 */
export const STATUS_COLORS: Record<string, string> = {
  Approved: "var(--color-background-success-solid)",
  Declined: "var(--color-background-danger-solid)",
  "Needs Review": "var(--color-background-warning-solid)",
  Pending: "var(--color-text-tertiary)",
  Expired: "var(--color-text-tertiary)",
  Created: "var(--color-text-tertiary)",
};
