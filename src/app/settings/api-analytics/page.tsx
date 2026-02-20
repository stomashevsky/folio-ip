"use client";

import { TopBar } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER } from "@/lib/constants/page-layout";
import { MetricCard, SectionHeading, DataTable, ChartCard } from "@/components/shared";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import type { ColumnDef } from "@tanstack/react-table";
import type { TimeSeriesPoint } from "@/lib/types";
import { Badge } from "@plexui/ui/components/Badge";

interface EndpointMetric {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  requestCount: number;
  avgLatency: number;
  errorRate: number;
}

interface StatusCodeBreakdown {
  id: string;
  statusRange: string;
  count: number;
  percentage: number;
}

const mockEndpointMetrics: EndpointMetric[] = [
  {
    id: "ep_001",
    path: "/api/v1/inquiries",
    method: "GET",
    requestCount: 45230,
    avgLatency: 42,
    errorRate: 1.2,
  },
  {
    id: "ep_002",
    path: "/api/v1/inquiries",
    method: "POST",
    requestCount: 28910,
    avgLatency: 58,
    errorRate: 2.8,
  },
  {
    id: "ep_003",
    path: "/api/v1/verifications",
    method: "POST",
    requestCount: 32450,
    avgLatency: 45,
    errorRate: 1.5,
  },
  {
    id: "ep_004",
    path: "/api/v1/reports",
    method: "GET",
    requestCount: 12340,
    avgLatency: 38,
    errorRate: 0.8,
  },
  {
    id: "ep_005",
    path: "/api/v1/accounts",
    method: "GET",
    requestCount: 5647,
    avgLatency: 35,
    errorRate: 0.5,
  },
];

const mockStatusCodeBreakdown: StatusCodeBreakdown[] = [
  { id: "sc_001", statusRange: "2xx Success", count: 121890, percentage: 97.6 },
  { id: "sc_002", statusRange: "3xx Redirect", count: 456, percentage: 0.4 },
  { id: "sc_003", statusRange: "4xx Client Error", count: 1876, percentage: 1.5 },
  { id: "sc_004", statusRange: "5xx Server Error", count: 345, percentage: 0.3 },
];

const endpointColumns: ColumnDef<EndpointMetric, unknown>[] = [
  {
    accessorKey: "path",
    header: "Endpoint",
    size: 240,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.path}
      </span>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
    size: 100,
    cell: ({ row }) => {
      const method = row.original.method;
      const colorMap: Record<string, "info" | "secondary" | "warning" | "danger"> = {
        GET: "secondary",
        POST: "info",
        PUT: "warning",
        PATCH: "warning",
        DELETE: "danger",
      };
      return (
        <Badge color={colorMap[method]} variant="soft">
          {method}
        </Badge>
      );
    },
  },
  {
    accessorKey: "requestCount",
    header: "Requests",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">
        {row.original.requestCount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "avgLatency",
    header: "Avg Latency (ms)",
    size: 140,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">{row.original.avgLatency}</span>
    ),
  },
  {
    accessorKey: "errorRate",
    header: "Error Rate (%)",
    size: 130,
    cell: ({ row }) => {
      const rate = row.original.errorRate;
      const color = rate > 2 ? "danger" : rate > 1 ? "warning" : "success";
      return (
        <Badge color={color} variant="soft">
          {rate.toFixed(1)}%
        </Badge>
      );
    },
  },
];

const statusCodeColumns: ColumnDef<StatusCodeBreakdown, unknown>[] = [
  {
    accessorKey: "statusRange",
    header: "Status Code Range",
    size: 200,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">{row.original.statusRange}</span>
    ),
  },
  {
    accessorKey: "count",
    header: "Count",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">
        {row.original.count.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">{row.original.percentage.toFixed(1)}%</span>
    ),
  },
];

// Generate 30 days of mock API request volume data
function generateRequestVolumeData(): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Seeded random: use date as seed for consistent values
    const seed = date.getTime();
    const random = Math.sin(seed) * 10000 % 1;
    const value = Math.floor(3000 + random * 3000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value,
    });
  }
  
  return data;
}

export default function ApiAnalyticsPage() {
  const requestVolumeData = generateRequestVolumeData();

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar title="API Analytics" />

      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 py-6 md:px-6">
        {/* Metrics Row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Requests" value="124,567" variant="compact" />
          <MetricCard label="Avg Latency" value="45ms" variant="compact" />
          <MetricCard label="Error Rate" value="2.1%" variant="compact" />
          <MetricCard label="Active Keys" value="8" variant="compact" />
        </div>

        {/* Request Volume Chart */}
        <div className="mb-8">
          <ChartCard title="API Request Volume" description="30-day trend">
            <SimpleBarChart data={requestVolumeData} label="Requests" />
          </ChartCard>
        </div>

        {/* Endpoint Breakdown */}
        <div className="mb-8">
          <SectionHeading size="xs">Endpoint Breakdown</SectionHeading>
          <DataTable
            data={mockEndpointMetrics}
            columns={endpointColumns}
            pageSize={50}
            initialSorting={[{ id: "requestCount", desc: true }]}
          />
        </div>

        {/* Status Code Breakdown */}
        <div>
          <SectionHeading size="xs">Status Code Breakdown</SectionHeading>
          <DataTable
            data={mockStatusCodeBreakdown}
            columns={statusCodeColumns}
            pageSize={50}
          />
        </div>
      </div>
    </div>
  );
}
