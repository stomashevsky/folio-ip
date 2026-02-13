import type {
  AnalyticsOverview,
  TimeSeriesPoint,
  StatusDistribution,
  FunnelStep,
  VolumeChartSection,
  VolumeTimeSeriesPoint,
  HighlightMetric,
} from "@/lib/types";

export const mockAnalyticsOverview: AnalyticsOverview = {
  totalInquiries: 1234,
  approvalRate: 87.5,
  avgCompletionTime: 272,
  pendingReview: 23,
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
  periodOrDays: "all" | "3m" | "30d" | "7d" | number,
): TimeSeriesPoint[] {
  const lengths: Record<string, number> = {
    all: 365,
    "3m": 90,
    "30d": 30,
    "7d": 7,
  };
  const count = typeof periodOrDays === "number"
    ? Math.max(1, Math.round(periodOrDays))
    : lengths[periodOrDays];
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

// ─── Persona-style Volume Analytics ───

function generateVolumeTimeSeries(
  days: number,
  baseVolume: number,
  rateCenter: number,
  rateVariance: number,
  seed: number,
): VolumeTimeSeriesPoint[] {
  const endDate = new Date("2026-02-10");
  let walk = 0;

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));
    const dayOfWeek = date.getDay();

    // Volume with trend + weekend dips
    const trend = baseVolume + (i / days) * (baseVolume * 0.15);
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;
    walk += (seededRandom(i * 7 + seed) - 0.5) * 6;
    walk = walk * 0.92;
    const noise = (seededRandom(i * 13 + seed * 3) - 0.5) * 10;
    const spike =
      seededRandom(i * 31 + seed * 7) > 0.93
        ? 12 + seededRandom(i * 41 + seed) * 8
        : 0;
    const volume = Math.max(3, Math.round((trend + walk + noise + spike) * weekendFactor));

    // Rate fluctuating around center
    const rateNoise = (seededRandom(i * 19 + seed * 11) - 0.5) * rateVariance;
    const rate = Math.max(0, Math.min(100, rateCenter + rateNoise));

    return {
      date: date.toISOString().split("T")[0],
      volume,
      rate: Math.round(rate * 10) / 10,
    };
  });
}

export const mockVolumeChartSections: VolumeChartSection[] = [
  {
    title: "Created",
    data: generateVolumeTimeSeries(30, 35, 95, 8, 100),
    volumeLabel: "Created volume",
    rateLabel: "Started rate",
    rateSublabel: "Expiration rate",
  },
  {
    title: "Started",
    data: generateVolumeTimeSeries(30, 33, 92, 10, 200),
    volumeLabel: "Started volume",
    rateLabel: "Finished rate",
    rateSublabel: "Expiration rate (started)",
  },
  {
    title: "Finished",
    data: generateVolumeTimeSeries(30, 30, 88, 12, 300),
    volumeLabel: "Finished volume",
    rateLabel: "Success rate",
    rateSublabel: "Needs review rate",
  },
  {
    title: "Marked for Review",
    data: generateVolumeTimeSeries(30, 4, 75, 20, 400),
    volumeLabel: "Marked for review volume",
    rateLabel: "Decisioned rate",
    rateSublabel: "Approved rate",
  },
];

export const mockHighlights: HighlightMetric[] = [
  { label: "Inquiries created", value: "1,234", tooltip: "Total inquiries created in the selected period" },
  { label: "Started rate", value: "95.6%", tooltip: "% of created inquiries that were started" },
  { label: "Interacted rate", value: "93.2%", tooltip: "% of started inquiries where user interacted" },
  { label: "Finished rate", value: "89.3%", tooltip: "% of started inquiries that finished" },
  { label: "Success rate", value: "87.4%", tooltip: "% of finished inquiries that passed" },
  { label: "Rejected rate", value: "6.0%", tooltip: "% of finished inquiries that were declined" },
  { label: "Time to finish (median)", value: "4m 32s", tooltip: "Median time from creation to completion" },
];
