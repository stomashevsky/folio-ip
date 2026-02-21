import type {
  AnalyticsOverview,
  TimeSeriesPoint,
  StatusDistribution,
  FunnelStep,
  HighlightMetric,
  RateTimeSeriesPoint,
  VerificationRatePoint,
  ReportRatePoint,
  TransactionRatePoint,
  CaseRatePoint,
  FunnelTimeSeriesPoint,
  SankeyFunnelData,
  SankeyLinkType,
} from "@/lib/types";
import { STATUS_COLORS } from "@/lib/constants/status-colors";

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
  { status: "Approved", count: 1079, percentage: 87.4, color: STATUS_COLORS.Approved },
  { status: "Declined", count: 74, percentage: 6.0, color: STATUS_COLORS.Declined },
  { status: "Needs Review", count: 23, percentage: 1.9, color: STATUS_COLORS["Needs Review"] },
  { status: "Pending", count: 35, percentage: 2.8, color: STATUS_COLORS.Pending },
  { status: "Expired", count: 18, percentage: 1.5, color: STATUS_COLORS.Expired },
  { status: "Created", count: 5, percentage: 0.4, color: STATUS_COLORS.Created },
];

/** 7-step KYC funnel definition with colors for chart rendering */
export const FUNNEL_STEPS = [
  { name: "Created", key: "created", color: "#06b6d4" },
  { name: "Started", key: "started", color: "#3b82f6" },
  { name: "Doc Uploaded", key: "doc_uploaded", color: "#8b5cf6" },
  { name: "Selfie Captured", key: "selfie_captured", color: "#a855f7" },
  { name: "Processing", key: "processing", color: "#f59e0b" },
  { name: "Completed", key: "completed", color: "#22c55e" },
  { name: "Approved", key: "approved", color: "#30a46c" },
] as const;

/** Drop-off rates per step (seeded variation around these base values) */
const BASE_DROPOFF_RATES = [0, 4.4, 3.2, 1.8, 1.2, 0.5, 2.1];

/** Generate 7-step funnel data scaled to period length */
export function generateFunnelSteps(days: number): FunnelStep[] {
  const dailyRate = 42;
  const baseCount = Math.round(dailyRate * days * (0.9 + seededRandom(days) * 0.2));

  const steps: FunnelStep[] = [];
  let prevCount = baseCount;

  for (let i = 0; i < FUNNEL_STEPS.length; i++) {
    const def = FUNNEL_STEPS[i];
    const dropoffVariation = (seededRandom(days * 17 + i * 31) - 0.5) * 1.5;
    const dropoff = i === 0 ? 0 : Math.max(0.1, BASE_DROPOFF_RATES[i] + dropoffVariation);
    const count = i === 0 ? baseCount : Math.round(prevCount * (1 - dropoff / 100));
    const percentage = Math.round((count / baseCount) * 1000) / 10;

    steps.push({
      name: def.name,
      key: def.key,
      count,
      percentage: i === 0 ? 100 : percentage,
      dropoff: Math.round(dropoff * 10) / 10,
      color: def.color,
    });

    prevCount = count;
  }

  return steps;
}

/** Legacy alias — kept for backward compatibility */
export const mockFunnel = generateFunnelSteps(30);

/** Generate daily funnel time series: each day has a conversion rate per step */
export function generateFunnelTimeSeries(days: number): FunnelTimeSeriesPoint[] {
  const endDate = new Date("2026-02-10");

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));

    const point: FunnelTimeSeriesPoint = {
      date: date.toISOString().split("T")[0],
    };

    // Each step gets a rate that varies around a base value
    let cumulativeRate = 100;
    for (let s = 0; s < FUNNEL_STEPS.length; s++) {
      const step = FUNNEL_STEPS[s];
      if (s === 0) {
        point[step.key] = 100;
        continue;
      }
      const baseDropoff = BASE_DROPOFF_RATES[s];
      const noise = (seededRandom(i * 41 + s * 13 + days * 7) - 0.5) * 3;
      const dayDropoff = Math.max(0.2, baseDropoff + noise);
      cumulativeRate = cumulativeRate * (1 - dayDropoff / 100);
      point[step.key] = Math.round(cumulativeRate * 10) / 10;
    }

    return point;
  });
}

/** Derive 4 highlight metrics from funnel steps */
export function deriveFunnelHighlights(steps: FunnelStep[]): HighlightMetric[] {
  const first = steps[0];
  const last = steps[steps.length - 1];
  const overallConversion = Math.round((last.count / first.count) * 1000) / 10;

  // Find biggest drop-off step
  let maxDropoff = { name: "", dropoff: 0 };
  for (const step of steps) {
    if (step.dropoff > maxDropoff.dropoff) {
      maxDropoff = { name: step.name, dropoff: step.dropoff };
    }
  }

  // Average steps completed (weighted)
  const totalStepsCompleted = steps.reduce(
    (sum, step, i) => sum + step.count * (i + 1),
    0,
  );
  const avgSteps = Math.round((totalStepsCompleted / first.count / steps.length) * 10) / 10;

  return [
    { label: "Overall Conversion", value: `${overallConversion}%`, tooltip: "Percentage of created inquiries that were approved" },
    { label: "Biggest Drop-off", value: maxDropoff.name, trend: -maxDropoff.dropoff, tooltip: "Funnel step with the highest drop-off rate" },
    { label: "Total Inquiries", value: first.count.toLocaleString(), tooltip: "Total verification sessions in this period" },
    { label: "Avg Progress", value: `${avgSteps} steps`, tooltip: "Average number of steps completed per inquiry" },
  ];
}

// ─── Sankey Funnel Data Generator ───

/** Generate Sankey funnel data with branching success/failure/abandon paths */
export function generateSankeyFunnel(days: number): SankeyFunnelData {
  const dailyRate = 42;
  const total = Math.round(dailyRate * days * (0.9 + seededRandom(days) * 0.2));

  // Branching rates (base + seeded variation)
  const vary = (base: number, seed: number) =>
    Math.max(0.5, base + (seededRandom(days * seed) - 0.5) * 1.5);

  const abandonStartRate = vary(4.4, 17);
  const abandonDocRate = vary(3.4, 23);
  const docFailRate = vary(3.2, 29);
  const selfieFailRate = vary(1.6, 37);
  const declineRate = vary(2.1, 43);

  // Calculate counts flowing through the graph
  const created = total;
  const abandonedStart = Math.round(created * (abandonStartRate / 100));
  const started = created - abandonedStart;

  const abandonedDoc = Math.round(started * (abandonDocRate / 100));
  const docUploaded = started - abandonedDoc;

  const docFailed = Math.round(docUploaded * (docFailRate / 100));
  const docPassed = docUploaded - docFailed;

  const selfieCaptured = docPassed; // all doc-passed proceed to selfie
  const selfieFailed = Math.round(selfieCaptured * (selfieFailRate / 100));
  const selfiePassed = selfieCaptured - selfieFailed;

  const completed = selfiePassed; // all selfie-passed proceed to review
  const declined = Math.round(completed * (declineRate / 100));
  const approved = completed - declined;

  // Node indices:
  // 0: Created, 1: Started, 2: Doc Uploaded, 3: Doc Passed, 4: Doc Failed
  // 5: Selfie Captured, 6: Selfie Passed, 7: Selfie Failed
  // 8: Completed, 9: Approved, 10: Declined, 11: Abandoned
  const nodes = [
    { name: "Created", color: "#06b6d4", count: created },
    { name: "Started", color: "#3b82f6", count: started },
    { name: "Doc Uploaded", color: "#8b5cf6", count: docUploaded },
    { name: "Doc Passed", color: "#22c55e", count: docPassed },
    { name: "Doc Failed", color: "#ef4444", count: docFailed },
    { name: "Selfie Captured", color: "#a855f7", count: selfieCaptured },
    { name: "Selfie Passed", color: "#22c55e", count: selfiePassed },
    { name: "Selfie Failed", color: "#ef4444", count: selfieFailed },
    { name: "Completed", color: "#22c55e", count: completed },
    { name: "Approved", color: STATUS_COLORS.Approved, count: approved },
    { name: "Declined", color: STATUS_COLORS.Declined, count: declined },
    { name: "Abandoned", color: "#94a3b8", count: abandonedStart + abandonedDoc },
  ];

  const link = (source: number, target: number, value: number, type: SankeyLinkType) =>
    ({ source, target, value, type });

  const links = [
    // Main flow
    link(0, 1, started, "success"),           // Created → Started
    link(0, 11, abandonedStart, "abandon"),   // Created → Abandoned
    link(1, 2, docUploaded, "success"),       // Started → Doc Uploaded
    link(1, 11, abandonedDoc, "abandon"),     // Started → Abandoned
    link(2, 3, docPassed, "success"),         // Doc Uploaded → Doc Passed
    link(2, 4, docFailed, "failure"),         // Doc Uploaded → Doc Failed
    link(3, 5, selfieCaptured, "success"),    // Doc Passed → Selfie Captured
    link(5, 6, selfiePassed, "success"),      // Selfie Captured → Selfie Passed
    link(5, 7, selfieFailed, "failure"),      // Selfie Captured → Selfie Failed
    link(6, 8, completed, "success"),         // Selfie Passed → Completed
    link(8, 9, approved, "success"),          // Completed → Approved
    link(8, 10, declined, "failure"),         // Completed → Declined
  ];

  return { nodes, links };
}

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

// ─── Date-reactive analytics helpers ───

/** Derive highlight metrics from day count (seeded for stability) */
export function deriveHighlights(days: number): HighlightMetric[] {
  const dailyRate = 42;
  const total = Math.round(dailyRate * days * (0.9 + seededRandom(days) * 0.2));
  const startRate = 93 + seededRandom(days * 3) * 5; // 93–98%
  const completionRate = 86 + seededRandom(days * 5) * 7; // 86–93%
  const approvalRate = 84 + seededRandom(days * 7) * 8; // 84–92%
  const rejectionRate = 3 + seededRandom(days * 9) * 5; // 3–8%
  const medianSeconds = 200 + Math.round(seededRandom(days * 11) * 120); // 200–320s
  const mins = Math.floor(medianSeconds / 60);
  const secs = medianSeconds % 60;

  const t = (seed: number, scale = 10) => Math.round(((seededRandom(days * seed) - 0.4) * scale) * 10) / 10;

  return [
    { label: "Total Inquiries", value: total.toLocaleString(), tooltip: "Verification sessions created in this period", trend: t(31, 15) },
    { label: "Start Rate", value: `${Math.round(startRate * 10) / 10}%`, tooltip: "% of inquiries where user began verification", trend: t(33, 4) },
    { label: "Completion Rate", value: `${Math.round(completionRate * 10) / 10}%`, tooltip: "% of started inquiries that reached a decision", trend: t(37, 5) },
    { label: "Approval Rate", value: `${Math.round(approvalRate * 10) / 10}%`, tooltip: "% of completed inquiries approved", trend: t(41, 4) },
    { label: "Rejection Rate", value: `${Math.round(rejectionRate * 10) / 10}%`, tooltip: "% of completed inquiries declined", trend: t(43, 4), invertTrend: true },
    { label: "Median Completion", value: `${mins}m ${secs}s`, tooltip: "Typical time from start to decision", trend: t(47, 12), invertTrend: true },
  ];
}

/** Generate rate time series (completion + approval rates per day) */
export function generateRateTimeSeries(days: number): RateTimeSeriesPoint[] {
  const endDate = new Date("2026-02-10");

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));

    const completionNoise = (seededRandom(i * 19 + 500) - 0.5) * 12;
    const completionRate = Math.max(60, Math.min(100, 89 + completionNoise));

    const approvalNoise = (seededRandom(i * 23 + 700) - 0.5) * 14;
    const approvalRate = Math.max(55, Math.min(100, 87 + approvalNoise));

    return {
      date: date.toISOString().split("T")[0],
      completionRate: Math.round(completionRate * 10) / 10,
      approvalRate: Math.round(approvalRate * 10) / 10,
    };
  });
}

// ─── Verification Analytics ───

export function generateVerificationTimeSeries(
  periodOrDays: "all" | "3m" | "30d" | "7d" | number,
): TimeSeriesPoint[] {
  const lengths: Record<string, number> = { all: 365, "3m": 90, "30d": 30, "7d": 7 };
  const count = typeof periodOrDays === "number"
    ? Math.max(1, Math.round(periodOrDays))
    : lengths[periodOrDays];
  const endDate = new Date("2026-02-10");

  let walk = 0;
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (count - 1 - i));
    const dayOfWeek = date.getDay();

    const trend = 58 + (i / count) * 18;
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1.0;
    walk += (seededRandom(i * 11 + count * 2) - 0.5) * 8;
    walk = walk * 0.9;
    const noise = (seededRandom(i * 17 + count * 5) - 0.5) * 12;
    const spike = seededRandom(i * 37 + count * 9) > 0.94 ? 15 + seededRandom(i * 47) * 10 : 0;
    const value = Math.round((trend + walk + noise + spike) * weekendFactor);

    return {
      date: date.toISOString().split("T")[0],
      value: Math.max(8, value),
    };
  });
}

export function generateVerificationRateTimeSeries(days: number): VerificationRatePoint[] {
  const endDate = new Date("2026-02-10");

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));

    const passNoise = (seededRandom(i * 29 + 1100) - 0.5) * 10;
    const passRate = Math.max(55, Math.min(100, 82 + passNoise));

    const processedNoise = (seededRandom(i * 31 + 1300) - 0.5) * 8;
    const processedRate = Math.max(70, Math.min(100, 94 + processedNoise));

    return {
      date: date.toISOString().split("T")[0],
      passRate: Math.round(passRate * 10) / 10,
      processedRate: Math.round(processedRate * 10) / 10,
    };
  });
}

export function deriveVerificationHighlights(days: number): HighlightMetric[] {
  const dailyRate = 72;
  const total = Math.round(dailyRate * days * (0.85 + seededRandom(days * 2) * 0.3));
  const govIdCount = Math.round(total * (0.48 + seededRandom(days * 4) * 0.06));
  const selfieCount = Math.round(total * (0.46 + seededRandom(days * 6) * 0.06));
  const passRate = 78 + seededRandom(days * 8) * 12;
  const failRate = 4 + seededRandom(days * 10) * 8;
  const avgSeconds = 12 + Math.round(seededRandom(days * 12) * 25);

  const t = (seed: number, scale = 10) => Math.round(((seededRandom(days * seed) - 0.4) * scale) * 10) / 10;

  return [
    { label: "Total Verifications", value: total.toLocaleString(), tooltip: "All verifications processed in this period", trend: t(51, 12) },
    { label: "Government ID", value: govIdCount.toLocaleString(), tooltip: "Government ID verifications", trend: t(53, 10) },
    { label: "Selfie", value: selfieCount.toLocaleString(), tooltip: "Selfie verifications", trend: t(57, 10) },
    { label: "Pass Rate", value: `${Math.round(passRate * 10) / 10}%`, tooltip: "% of verifications that passed", trend: t(59, 5) },
    { label: "Fail Rate", value: `${Math.round(failRate * 10) / 10}%`, tooltip: "% of verifications that failed", trend: t(61, 4), invertTrend: true },
    { label: "Avg Processing", value: `${avgSeconds}s`, tooltip: "Average time to process a verification", trend: t(67, 8), invertTrend: true },
  ];
}

// ─── Report Analytics ───

export function generateReportTimeSeries(
  periodOrDays: "all" | "3m" | "30d" | "7d" | number,
): TimeSeriesPoint[] {
  const lengths: Record<string, number> = { all: 365, "3m": 90, "30d": 30, "7d": 7 };
  const count = typeof periodOrDays === "number"
    ? Math.max(1, Math.round(periodOrDays))
    : lengths[periodOrDays];
  const endDate = new Date("2026-02-10");

  let walk = 0;
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (count - 1 - i));
    const dayOfWeek = date.getDay();

    const trend = 18 + (i / count) * 8;
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.55 : 1.0;
    walk += (seededRandom(i * 13 + count * 3) - 0.5) * 5;
    walk = walk * 0.88;
    const noise = (seededRandom(i * 19 + count * 6) - 0.5) * 7;
    const spike = seededRandom(i * 43 + count * 11) > 0.95 ? 8 + seededRandom(i * 53) * 6 : 0;
    const value = Math.round((trend + walk + noise + spike) * weekendFactor);

    return {
      date: date.toISOString().split("T")[0],
      value: Math.max(2, value),
    };
  });
}

export function generateReportRateTimeSeries(days: number): ReportRatePoint[] {
  const endDate = new Date("2026-02-10");

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));

    const matchNoise = (seededRandom(i * 37 + 1500) - 0.5) * 10;
    const matchRate = Math.max(1, Math.min(40, 12 + matchNoise));

    const readyNoise = (seededRandom(i * 41 + 1700) - 0.5) * 8;
    const readyRate = Math.max(75, Math.min(100, 96 + readyNoise));

    return {
      date: date.toISOString().split("T")[0],
      matchRate: Math.round(matchRate * 10) / 10,
      readyRate: Math.round(readyRate * 10) / 10,
    };
  });
}

export function deriveReportHighlights(days: number): HighlightMetric[] {
  const dailyRate = 24;
  const total = Math.round(dailyRate * days * (0.8 + seededRandom(days * 3) * 0.4));
  const watchlistCount = Math.round(total * (0.55 + seededRandom(days * 5) * 0.1));
  const pepCount = total - watchlistCount;
  const matchRate = 8 + seededRandom(days * 7) * 10;
  const noMatchRate = 100 - matchRate;
  const avgSeconds = 3 + Math.round(seededRandom(days * 13) * 8);

  const t = (seed: number, scale = 10) => Math.round(((seededRandom(days * seed) - 0.4) * scale) * 10) / 10;

  return [
    { label: "Total Reports", value: total.toLocaleString(), tooltip: "All screening reports run in this period", trend: t(71, 12) },
    { label: "Watchlist", value: watchlistCount.toLocaleString(), tooltip: "Watchlist screening reports", trend: t(73, 10) },
    { label: "PEP", value: pepCount.toLocaleString(), tooltip: "Politically Exposed Persons screening reports", trend: t(79, 10) },
    { label: "Match Rate", value: `${Math.round(matchRate * 10) / 10}%`, tooltip: "% of reports with at least one match", trend: t(83, 5), invertTrend: true },
    { label: "No Match Rate", value: `${Math.round(noMatchRate * 10) / 10}%`, tooltip: "% of reports with no matches", trend: t(89, 5) },
    { label: "Avg Processing", value: `${avgSeconds}s`, tooltip: "Average time to complete a report", trend: t(97, 6), invertTrend: true },
  ];
}

// ─── Transaction Analytics ───

export function generateTransactionTimeSeries(
  periodOrDays: "all" | "3m" | "30d" | "7d" | number,
): TimeSeriesPoint[] {
  const lengths: Record<string, number> = { all: 365, "3m": 90, "30d": 30, "7d": 7 };
  const count = typeof periodOrDays === "number"
    ? Math.max(1, Math.round(periodOrDays))
    : lengths[periodOrDays];
  const endDate = new Date("2026-02-10");

  let walk = 0;
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (count - 1 - i));
    const dayOfWeek = date.getDay();

    const trend = 35 + (i / count) * 15;
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1.0;
    walk += (seededRandom(i * 14 + count * 4) - 0.5) * 7;
    walk = walk * 0.91;
    const noise = (seededRandom(i * 21 + count * 8) - 0.5) * 10;
    const spike = seededRandom(i * 39 + count * 12) > 0.94 ? 12 + seededRandom(i * 49) * 8 : 0;
    const value = Math.round((trend + walk + noise + spike) * weekendFactor);

    return {
      date: date.toISOString().split("T")[0],
      value: Math.max(4, value),
    };
  });
}

export function generateTransactionRateTimeSeries(days: number): TransactionRatePoint[] {
  const endDate = new Date("2026-02-10");

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));

    const approvalNoise = (seededRandom(i * 33 + 1900) - 0.5) * 10;
    const approvalRate = Math.max(60, Math.min(100, 88 + approvalNoise));

    const needsReviewNoise = (seededRandom(i * 39 + 2100) - 0.5) * 6;
    const needsReviewRate = Math.max(1, Math.min(25, 8 + needsReviewNoise));

    return {
      date: date.toISOString().split("T")[0],
      approvalRate: Math.round(approvalRate * 10) / 10,
      needsReviewRate: Math.round(needsReviewRate * 10) / 10,
    };
  });
}

export function deriveTransactionHighlights(days: number): HighlightMetric[] {
  const dailyRate = 38;
  const total = Math.round(dailyRate * days * (0.85 + seededRandom(days * 4) * 0.3));
  const totalVolume = Math.round(total * (120 + seededRandom(days * 6) * 80));
  const avgAmount = total > 0 ? Math.round(totalVolume / total) : 0;
  const approvalRate = 85 + seededRandom(days * 8) * 10;
  const needsReviewRate = 5 + seededRandom(days * 10) * 8;
  const avgProcessing = 1.2 + seededRandom(days * 14) * 2.5;

  const t = (seed: number, scale = 10) => Math.round(((seededRandom(days * seed) - 0.4) * scale) * 10) / 10;

  return [
    { label: "Total Transactions", value: total.toLocaleString(), tooltip: "All transactions monitored in this period", trend: t(101, 12) },
    { label: "Total Volume", value: `$${(totalVolume / 1000).toFixed(0)}k`, tooltip: "Combined dollar amount of all transactions", trend: t(103, 15) },
    { label: "Avg Amount", value: `$${avgAmount.toLocaleString()}`, tooltip: "Average transaction amount", trend: t(107, 8) },
    { label: "Approval Rate", value: `${Math.round(approvalRate * 10) / 10}%`, tooltip: "% of transactions approved", trend: t(109, 4) },
    { label: "Needs Review Rate", value: `${Math.round(needsReviewRate * 10) / 10}%`, tooltip: "% of transactions sent for review", trend: t(113, 5), invertTrend: true },
    { label: "Avg Processing", value: `${avgProcessing.toFixed(1)}s`, tooltip: "Average time to process a transaction", trend: t(127, 8), invertTrend: true },
  ];
}

// ─── Case Analytics ───

export function generateCaseTimeSeries(
  periodOrDays: "all" | "3m" | "30d" | "7d" | number,
): TimeSeriesPoint[] {
  const lengths: Record<string, number> = { all: 365, "3m": 90, "30d": 30, "7d": 7 };
  const count = typeof periodOrDays === "number"
    ? Math.max(1, Math.round(periodOrDays))
    : lengths[periodOrDays];
  const endDate = new Date("2026-02-10");

  let walk = 0;
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (count - 1 - i));
    const dayOfWeek = date.getDay();

    const trend = 8 + (i / count) * 6;
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.4 : 1.0;
    walk += (seededRandom(i * 16 + count * 5) - 0.5) * 4;
    walk = walk * 0.89;
    const noise = (seededRandom(i * 23 + count * 9) - 0.5) * 5;
    const spike = seededRandom(i * 47 + count * 14) > 0.96 ? 5 + seededRandom(i * 57) * 4 : 0;
    const value = Math.round((trend + walk + noise + spike) * weekendFactor);

    return {
      date: date.toISOString().split("T")[0],
      value: Math.max(1, value),
    };
  });
}

export function generateCaseRateTimeSeries(days: number): CaseRatePoint[] {
  const endDate = new Date("2026-02-10");

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (days - 1 - i));

    const resolutionNoise = (seededRandom(i * 43 + 2300) - 0.5) * 12;
    const resolutionRate = Math.max(50, Math.min(100, 78 + resolutionNoise));

    const slaNoise = (seededRandom(i * 47 + 2500) - 0.5) * 8;
    const slaComplianceRate = Math.max(70, Math.min(100, 94 + slaNoise));

    return {
      date: date.toISOString().split("T")[0],
      resolutionRate: Math.round(resolutionRate * 10) / 10,
      slaComplianceRate: Math.round(slaComplianceRate * 10) / 10,
    };
  });
}

export function deriveCaseHighlights(days: number): HighlightMetric[] {
  const dailyRate = 5.2;
  const total = Math.round(dailyRate * days * (0.8 + seededRandom(days * 5) * 0.4));
  const openCount = Math.round(total * (0.25 + seededRandom(days * 7) * 0.1));
  const resolvedCount = Math.round(total * (0.4 + seededRandom(days * 9) * 0.15));
  const escalatedCount = total - openCount - resolvedCount;
  const avgResolutionDays = 1.8 + seededRandom(days * 11) * 1.5;
  const slaRate = 90 + seededRandom(days * 13) * 8;

  const t = (seed: number, scale = 10) => Math.round(((seededRandom(days * seed) - 0.4) * scale) * 10) / 10;

  return [
    { label: "Total Cases", value: total.toLocaleString(), tooltip: "All cases created in this period", trend: t(131, 12), invertTrend: true },
    { label: "Open", value: openCount.toLocaleString(), tooltip: "Cases currently open", trend: t(137, 15), invertTrend: true },
    { label: "Resolved", value: resolvedCount.toLocaleString(), tooltip: "Cases resolved in this period", trend: t(139, 10) },
    { label: "Escalated", value: escalatedCount.toLocaleString(), tooltip: "Cases escalated for review", trend: t(149, 8), invertTrend: true },
    { label: "Avg Resolution", value: `${avgResolutionDays.toFixed(1)}d`, tooltip: "Average time to resolve a case", trend: t(151, 10), invertTrend: true },
    { label: "SLA Compliance", value: `${Math.round(slaRate * 10) / 10}%`, tooltip: "% of cases resolved within SLA", trend: t(157, 5) },
  ];
}
