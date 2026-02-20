"use client";

import { TopBar } from "@/components/layout/TopBar";
import { SummaryCard } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";

interface ActivityRecord {
  id: string;
  action: "import" | "export";
  type: string;
  recordCount: number;
  status: "completed" | "processing" | "failed";
  createdAt: string;
  createdBy: string;
}

const mockActivity: ActivityRecord[] = [
  {
    id: "act_001",
    action: "import",
    type: "CSV Upload",
    recordCount: 15234,
    status: "completed",
    createdAt: "2025-02-20T14:30:00Z",
    createdBy: "John Smith",
  },
  {
    id: "act_002",
    action: "export",
    type: "Report Export",
    recordCount: 8456,
    status: "completed",
    createdAt: "2025-02-20T13:45:00Z",
    createdBy: "Sarah Johnson",
  },
  {
    id: "act_003",
    action: "import",
    type: "JSON Batch",
    recordCount: 3200,
    status: "processing",
    createdAt: "2025-02-20T13:15:00Z",
    createdBy: "Mike Chen",
  },
  {
    id: "act_004",
    action: "export",
    type: "Compliance Report",
    recordCount: 12500,
    status: "completed",
    createdAt: "2025-02-20T12:30:00Z",
    createdBy: "Emma Davis",
  },
  {
    id: "act_005",
    action: "import",
    type: "XLSX Import",
    recordCount: 5678,
    status: "failed",
    createdAt: "2025-02-20T11:45:00Z",
    createdBy: "Alex Rodriguez",
  },
  {
    id: "act_006",
    action: "export",
    type: "Analytics Export",
    recordCount: 9234,
    status: "completed",
    createdAt: "2025-02-20T11:00:00Z",
    createdBy: "Lisa Wong",
  },
  {
    id: "act_007",
    action: "import",
    type: "API Sync",
    recordCount: 2100,
    status: "completed",
    createdAt: "2025-02-20T10:15:00Z",
    createdBy: "James Miller",
  },
  {
    id: "act_008",
    action: "export",
    type: "Audit Trail",
    recordCount: 18900,
    status: "processing",
    createdAt: "2025-02-20T09:30:00Z",
    createdBy: "Patricia Brown",
  },
];

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string): "success" | "warning" | "danger" | "secondary" {
  switch (status) {
    case "completed":
      return "success";
    case "processing":
      return "warning";
    case "failed":
      return "danger";
    default:
      return "secondary";
  }
}

export default function DataPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar title="Data" />

      <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Records">
            <div className="heading-lg">847,293</div>
          </SummaryCard>
          <SummaryCard label="Imports">
            <div className="heading-lg">34</div>
          </SummaryCard>
          <SummaryCard label="Exports">
            <div className="heading-lg">12</div>
          </SummaryCard>
          <SummaryCard label="Storage Used">
            <div className="heading-lg">2.4 GB</div>
          </SummaryCard>
        </div>

        <div>
          <h2 className="heading-md mb-4">Recent Activity</h2>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">
                    Records
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">
                    Created By
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockActivity.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Badge
                        color={record.action === "import" ? "info" : "secondary"}
                        variant="soft"
                        size="sm"
                      >
                        {record.action === "import" ? "Import" : "Export"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{record.type}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {record.recordCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        color={getStatusColor(record.status)}
                        variant="soft"
                        size="sm"
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {record.createdBy}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {formatDateTime(record.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
