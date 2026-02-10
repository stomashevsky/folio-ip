import type {
  AnalyticsOverview,
  TimeSeriesPoint,
  StatusDistribution,
  FunnelStep,
} from "@/lib/types";

export const mockAnalyticsOverview: AnalyticsOverview = {
  totalInquiries: 1234,
  approvalRate: 87.5,
  avgCompletionTime: 272,
  pendingReview: 23,
  totalVerifications: 2156,
  totalReports: 1890,
  totalAccounts: 987,
  inquiriesTrend: 12.3,
  approvalTrend: 2.1,
  completionTimeTrend: -5.2,
  pendingReviewTrend: 8.7,
};

// Seeded pseudo-random for stable mock data (Mulberry32)
function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function generateTimeSeries(
  period: "all" | "3m" | "30d" | "7d",
): TimeSeriesPoint[] {
  const lengths: Record<string, number> = {
    all: 365,
    "3m": 90,
    "30d": 30,
    "7d": 7,
  };
  const count = lengths[period];
  const endDate = new Date("2026-02-10");

  // Gradual upward trend + weekday pattern + random walks
  let walk = 0;
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (count - 1 - i));
    const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

    // Upward trend: ~15% growth over the period
    const trend = 30 + (i / count) * 12;

    // Weekend dip (Sat/Sun ~30% lower)
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;

    // Random walk for organic variation
    walk += (seededRandom(i * 7 + count) - 0.5) * 6;
    walk = walk * 0.92; // mean-revert

    // Day-to-day noise
    const noise = (seededRandom(i * 13 + count * 3) - 0.5) * 10;

    // Occasional spikes (organic-looking)
    const spike = seededRandom(i * 31 + count * 7) > 0.93 ? 12 + seededRandom(i * 41) * 8 : 0;

    const value = Math.round((trend + walk + noise + spike) * weekendFactor);
    return {
      date: date.toISOString().split("T")[0],
      value: Math.max(5, value),
    };
  });
}

export const mockInquiriesTimeSeries: TimeSeriesPoint[] = generateTimeSeries("30d");

export const mockStatusDistribution: StatusDistribution[] = [
  { status: "Approved", count: 1079, percentage: 87.4, color: "#30a46c" },
  { status: "Declined", count: 74, percentage: 6.0, color: "#e5484d" },
  { status: "Needs Review", count: 23, percentage: 1.9, color: "#f5a623" },
  { status: "Pending", count: 35, percentage: 2.8, color: "#8b8d98" },
  { status: "Expired", count: 18, percentage: 1.5, color: "#63646e" },
  { status: "Created", count: 5, percentage: 0.4, color: "#505159" },
];

export const mockFunnel: FunnelStep[] = [
  { name: "Created", count: 1234, percentage: 100, dropoff: 0 },
  { name: "Started", count: 1180, percentage: 95.6, dropoff: 4.4 },
  { name: "Completed", count: 1102, percentage: 89.3, dropoff: 6.6 },
  { name: "Approved", count: 1079, percentage: 87.4, dropoff: 2.1 },
];

export const mockVerificationBreakdown: TimeSeriesPoint[] = [
  { date: "Government ID", value: 1078, label: "government_id" },
  { date: "Selfie", value: 1078, label: "selfie" },
];

export const mockTopFailureReasons = [
  { reason: "ID image tampering detected", count: 28, percentage: 29.5 },
  { reason: "Document expired", count: 19, percentage: 20.0 },
  { reason: "Selfie liveness failed", count: 15, percentage: 15.8 },
  { reason: "Blurry document photo", count: 12, percentage: 12.6 },
  { reason: "Name mismatch", count: 9, percentage: 9.5 },
  { reason: "Face not matching ID", count: 7, percentage: 7.4 },
  { reason: "Unsupported document type", count: 5, percentage: 5.3 },
];
