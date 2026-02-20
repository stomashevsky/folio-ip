import type {
  TimeSeriesPoint,
  RateTimeSeriesPoint,
  VerificationRatePoint,
  ReportRatePoint,
  TransactionRatePoint,
  CaseRatePoint,
  FunnelTimeSeriesPoint,
  AnalyticsInterval,
} from "@/lib/types";
import { FUNNEL_STEPS } from "@/lib/data/mock-analytics";

/** Group daily volume data into weekly or monthly buckets (summed) */
export function aggregateVolume(
  data: TimeSeriesPoint[],
  interval: AnalyticsInterval,
): TimeSeriesPoint[] {
  if (interval === "daily") return data;

  const buckets = new Map<string, { sum: number; label?: string }>();

  for (const point of data) {
    const key = bucketKey(point.date, interval);
    const existing = buckets.get(key);
    if (existing) {
      existing.sum += point.value;
    } else {
      buckets.set(key, { sum: point.value, label: point.label });
    }
  }

  return Array.from(buckets.entries()).map(([date, { sum, label }]) => ({
    date,
    value: sum,
    ...(label ? { label } : {}),
  }));
}

/** Group daily rate data into weekly or monthly buckets (averaged) */
export function aggregateRates(
  data: RateTimeSeriesPoint[],
  interval: AnalyticsInterval,
): RateTimeSeriesPoint[] {
  if (interval === "daily") return data;

  const buckets = new Map<string, { completionSum: number; approvalSum: number; count: number }>();

  for (const point of data) {
    const key = bucketKey(point.date, interval);
    const existing = buckets.get(key);
    if (existing) {
      existing.completionSum += point.completionRate;
      existing.approvalSum += point.approvalRate;
      existing.count += 1;
    } else {
      buckets.set(key, {
        completionSum: point.completionRate,
        approvalSum: point.approvalRate,
        count: 1,
      });
    }
  }

  return Array.from(buckets.entries()).map(([date, b]) => ({
    date,
    completionRate: Math.round((b.completionSum / b.count) * 10) / 10,
    approvalRate: Math.round((b.approvalSum / b.count) * 10) / 10,
  }));
}

/** Group daily funnel rate data into weekly or monthly buckets (averaged per step) */
export function aggregateFunnelRates(
  data: FunnelTimeSeriesPoint[],
  interval: AnalyticsInterval,
): FunnelTimeSeriesPoint[] {
  if (interval === "daily") return data;

  const stepKeys = FUNNEL_STEPS.map((s) => s.key);
  const buckets = new Map<string, { sums: Record<string, number>; count: number }>();

  for (const point of data) {
    const key = bucketKey(point.date as string, interval);
    const existing = buckets.get(key);
    if (existing) {
      for (const sk of stepKeys) {
        existing.sums[sk] += (point[sk] as number) || 0;
      }
      existing.count += 1;
    } else {
      const sums: Record<string, number> = {};
      for (const sk of stepKeys) {
        sums[sk] = (point[sk] as number) || 0;
      }
      buckets.set(key, { sums, count: 1 });
    }
  }

  return Array.from(buckets.entries()).map(([date, b]) => {
    const result: FunnelTimeSeriesPoint = { date };
    for (const sk of stepKeys) {
      result[sk] = Math.round((b.sums[sk] / b.count) * 10) / 10;
    }
    return result;
  });
}

export function aggregateVerificationRates(
  data: VerificationRatePoint[],
  interval: AnalyticsInterval,
): VerificationRatePoint[] {
  if (interval === "daily") return data;

  const buckets = new Map<string, { passSum: number; processedSum: number; count: number }>();

  for (const point of data) {
    const key = bucketKey(point.date, interval);
    const existing = buckets.get(key);
    if (existing) {
      existing.passSum += point.passRate;
      existing.processedSum += point.processedRate;
      existing.count += 1;
    } else {
      buckets.set(key, { passSum: point.passRate, processedSum: point.processedRate, count: 1 });
    }
  }

  return Array.from(buckets.entries()).map(([date, b]) => ({
    date,
    passRate: Math.round((b.passSum / b.count) * 10) / 10,
    processedRate: Math.round((b.processedSum / b.count) * 10) / 10,
  }));
}

export function aggregateReportRates(
  data: ReportRatePoint[],
  interval: AnalyticsInterval,
): ReportRatePoint[] {
  if (interval === "daily") return data;

  const buckets = new Map<string, { matchSum: number; readySum: number; count: number }>();

  for (const point of data) {
    const key = bucketKey(point.date, interval);
    const existing = buckets.get(key);
    if (existing) {
      existing.matchSum += point.matchRate;
      existing.readySum += point.readyRate;
      existing.count += 1;
    } else {
      buckets.set(key, { matchSum: point.matchRate, readySum: point.readyRate, count: 1 });
    }
  }

  return Array.from(buckets.entries()).map(([date, b]) => ({
    date,
    matchRate: Math.round((b.matchSum / b.count) * 10) / 10,
    readyRate: Math.round((b.readySum / b.count) * 10) / 10,
  }));
}

export function aggregateTransactionRates(
  data: TransactionRatePoint[],
  interval: AnalyticsInterval,
): TransactionRatePoint[] {
  if (interval === "daily") return data;

  const buckets = new Map<string, { approvalSum: number; flaggedSum: number; count: number }>();

  for (const point of data) {
    const key = bucketKey(point.date, interval);
    const existing = buckets.get(key);
    if (existing) {
      existing.approvalSum += point.approvalRate;
      existing.flaggedSum += point.flaggedRate;
      existing.count += 1;
    } else {
      buckets.set(key, { approvalSum: point.approvalRate, flaggedSum: point.flaggedRate, count: 1 });
    }
  }

  return Array.from(buckets.entries()).map(([date, b]) => ({
    date,
    approvalRate: Math.round((b.approvalSum / b.count) * 10) / 10,
    flaggedRate: Math.round((b.flaggedSum / b.count) * 10) / 10,
  }));
}

export function aggregateCaseRates(
  data: CaseRatePoint[],
  interval: AnalyticsInterval,
): CaseRatePoint[] {
  if (interval === "daily") return data;

  const buckets = new Map<string, { resolutionSum: number; slaSum: number; count: number }>();

  for (const point of data) {
    const key = bucketKey(point.date, interval);
    const existing = buckets.get(key);
    if (existing) {
      existing.resolutionSum += point.resolutionRate;
      existing.slaSum += point.slaComplianceRate;
      existing.count += 1;
    } else {
      buckets.set(key, { resolutionSum: point.resolutionRate, slaSum: point.slaComplianceRate, count: 1 });
    }
  }

  return Array.from(buckets.entries()).map(([date, b]) => ({
    date,
    resolutionRate: Math.round((b.resolutionSum / b.count) * 10) / 10,
    slaComplianceRate: Math.round((b.slaSum / b.count) * 10) / 10,
  }));
}

function bucketKey(dateStr: string, interval: AnalyticsInterval): string {
  const d = new Date(dateStr);
  if (interval === "weekly") {
    // ISO week: Monday start
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // adjust to Monday
    d.setDate(d.getDate() + diff);
    return d.toISOString().split("T")[0];
  }
  // monthly
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
