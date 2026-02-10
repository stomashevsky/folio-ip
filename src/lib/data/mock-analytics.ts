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

export const mockInquiriesTimeSeries: TimeSeriesPoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date("2026-01-12");
    date.setDate(date.getDate() + i);
    const base = 35 + Math.round(Math.sin(i * 0.3) * 10);
    const noise = Math.round(Math.random() * 8 - 4);
    return {
      date: date.toISOString().split("T")[0],
      value: Math.max(15, base + noise),
    };
  }
);

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
