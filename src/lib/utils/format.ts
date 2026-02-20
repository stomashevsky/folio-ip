import { DateTime } from "luxon";

export function formatDate(isoDate: string): string {
  return DateTime.fromISO(isoDate).toFormat("LLL dd, yyyy");
}

export function formatDateTime(isoDate: string): string {
  return DateTime.fromISO(isoDate).toFormat("LLL dd, yyyy HH:mm");
}

export function formatDateShort(isoDate: string): string {
  return DateTime.fromISO(isoDate).toFormat("MM/dd/yyyy");
}

export function formatRelativeTime(isoDate: string): string {
  return DateTime.fromISO(isoDate).toRelative() ?? "";
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes === 0) return `${secs}s`;
  return `${minutes}m ${secs}s`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function formatTrend(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function truncateId(id: string, showChars = 12): string {
  if (id.length <= showChars + 4) return id;
  const prefix = id.split("_")[0];
  const rest = id.slice(prefix.length + 1);
  return `${prefix}_${rest.slice(0, showChars)}...`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    approved: "success",
    declined: "danger",
    needs_review: "secondary",
    pending: "secondary",
    created: "secondary",
    completed: "success",
    expired: "secondary",
    passed: "success",
    failed: "danger",
    requires_retry: "danger",
    initiated: "secondary",
    submitted: "secondary",
    canceled: "secondary",
    no_matches: "success",
    match: "danger",
    ready: "secondary",
    open: "info",
    in_review: "discovery",
    escalated: "danger",
    resolved: "success",
    active: "success",
    suspended: "danger",
    closed: "danger",
    default: "secondary",
    draft: "secondary",
    archived: "secondary",
    disabled: "secondary",
    beta: "info",
    deprecated: "secondary",
    published: "success",
    processing: "warning",
    delivered: "success",
    retrying: "warning",
    exceeded: "danger",
  };
  return map[status] ?? "secondary";
}

export function getRiskColor(level: string): string {
  const map: Record<string, string> = {
    low: "success",
    medium: "warning",
    high: "danger",
  };
  return map[level] ?? "secondary";
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    critical: "danger",
    high: "warning",
    medium: "caution",
    low: "success",
  };
  return map[priority] ?? "secondary";
}

export function getRoleBadgeColor(role: string): string {
  const map: Record<string, string> = {
    Owner: "discovery",
    Admin: "info",
  };
  return map[role] ?? "secondary";
}

export function getActiveBadgeColor(active: boolean): string {
  return active ? "success" : "secondary";
}

// ── HTTP ──

export function getHttpMethodColor(method: string): string {
  const map: Record<string, string> = {
    GET: "secondary",
    POST: "info",
    PUT: "warning",
    PATCH: "warning",
    DELETE: "danger",
  };
  return map[method] ?? "secondary";
}

export function getHttpStatusColor(code: number): string {
  if (code >= 500) return "danger";
  if (code >= 400) return "warning";
  return "success";
}

// ── Delivery / operations ──

export function getDeliveryStatusColor(status: string): string {
  const map: Record<string, string> = {
    delivered: "success",
    failed: "danger",
    pending: "info",
    retrying: "warning",
  };
  return map[status] ?? "secondary";
}

export function getDataOpStatusColor(status: string): string {
  const map: Record<string, string> = {
    completed: "success",
    processing: "warning",
    failed: "danger",
    queued: "secondary",
  };
  return map[status] ?? "secondary";
}

// ── Lists & matching ──

export function getListTypeColor(type: string): string {
  const map: Record<string, string> = {
    allowlist: "success",
    blocklist: "danger",
    watchlist: "warning",
  };
  return map[type] ?? "secondary";
}

export function getMatchTypeColor(type: string): string {
  const map: Record<string, string> = {
    exact: "danger",
    partial: "warning",
  };
  return map[type] ?? "secondary";
}

export function getMatchStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending_review: "warning",
    confirmed: "danger",
  };
  return map[status] ?? "secondary";
}

export function getMatchScoreColor(score: number): string {
  if (score >= 85) return "danger";
  if (score >= 70) return "warning";
  return "secondary";
}

// ── Domain-specific ──

export function getNodeTypeColor(type: string): string {
  const map: Record<string, string> = {
    account: "info",
    inquiry: "discovery",
    verification: "success",
    device: "warning",
    ip_address: "caution",
    email: "info",
  };
  return map[type] ?? "secondary";
}

export function getEventLevelColor(level: string): string {
  const map: Record<string, string> = {
    info: "secondary",
    warning: "warning",
    success: "success",
    error: "danger",
    danger: "danger",
  };
  return map[level] ?? "secondary";
}

export function getFormatColor(format: string): string {
  const map: Record<string, string> = {
    csv: "secondary",
    json: "info",
    xlsx: "discovery",
    pdf: "warning",
  };
  return map[format] ?? "secondary";
}

export function getSignalCategoryColor(category: string): string {
  const map: Record<string, string> = {
    featured: "info",
    risk: "warning",
    behavioral: "discovery",
  };
  return map[category] ?? "secondary";
}

export function getActionTypeColor(type: string): string {
  const map: Record<string, string> = {
    email: "discovery",
    webhook: "secondary",
    status_change: "warning",
    assign: "info",
  };
  return map[type] ?? "secondary";
}

export function getRateLimitStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "success",
    warning: "warning",
    exceeded: "danger",
  };
  return map[status] ?? "secondary";
}

export function getMonitoringResultColor(result: string): string {
  const map: Record<string, string> = {
    clear: "success",
    match_found: "danger",
    error: "warning",
  };
  return map[result] ?? "secondary";
}

const TITLE_CASE_LOWER_WORDS = new Set([
  "de", "da", "di", "do", "dos", "das", "del", "von", "van", "le", "la", "el",
]);

/** Convert ALL CAPS or mixed text to Title Case. Keeps particles (de, von, van…) lowercase. */
export function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word, i) =>
      i > 0 && TITLE_CASE_LOWER_WORDS.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}


