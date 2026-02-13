/**
 * Shared status → color mapping for charts (donut, bars, etc.).
 * Uses CSS variable tokens so colors respond to theme changes.
 */
export const STATUS_COLORS: Record<string, string> = {
  Approved: "#30a46c",
  Declined: "#e5484d",
  "Needs Review": "#f5a623",
  Pending: "#3b82f6",
  Expired: "#8b5cf6",
  Created: "#06b6d4",
};
