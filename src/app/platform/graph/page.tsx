"use client";

import { TopBar } from "@/components/layout/TopBar";
import { MetricCard, SectionHeading } from "@/components/shared";

interface Connection {
  id: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationship: string;
  strength: number;
  createdAt: string;
}

const mockConnections: Connection[] = [
  {
    id: "conn_001",
    sourceType: "account",
    sourceId: "act_123",
    targetType: "inquiry",
    targetId: "inq_456",
    relationship: "owns",
    strength: 0.95,
    createdAt: "2025-02-20T14:30:00Z",
  },
  {
    id: "conn_002",
    sourceType: "inquiry",
    sourceId: "inq_456",
    targetType: "verification",
    targetId: "ver_789",
    relationship: "submitted",
    strength: 0.88,
    createdAt: "2025-02-20T14:29:15Z",
  },
  {
    id: "conn_003",
    sourceType: "verification",
    sourceId: "ver_789",
    targetType: "account",
    targetId: "act_123",
    relationship: "verified_by",
    strength: 0.92,
    createdAt: "2025-02-20T14:28:45Z",
  },
  {
    id: "conn_004",
    sourceType: "device",
    sourceId: "dev_111",
    targetType: "account",
    targetId: "act_123",
    relationship: "same_device",
    strength: 0.78,
    createdAt: "2025-02-20T14:27:30Z",
  },
  {
    id: "conn_005",
    sourceType: "account",
    sourceId: "act_234",
    targetType: "account",
    targetId: "act_123",
    relationship: "same_ip",
    strength: 0.65,
    createdAt: "2025-02-20T14:26:00Z",
  },
  {
    id: "conn_006",
    sourceType: "inquiry",
    sourceId: "inq_567",
    targetType: "inquiry",
    targetId: "inq_456",
    relationship: "linked_to",
    strength: 0.72,
    createdAt: "2025-02-20T14:25:15Z",
  },
  {
    id: "conn_007",
    sourceType: "device",
    sourceId: "dev_222",
    targetType: "device",
    targetId: "dev_111",
    relationship: "same_ip",
    strength: 0.81,
    createdAt: "2025-02-20T14:24:00Z",
  },
  {
    id: "conn_008",
    sourceType: "verification",
    sourceId: "ver_890",
    targetType: "inquiry",
    targetId: "inq_567",
    relationship: "submitted",
    strength: 0.85,
    createdAt: "2025-02-20T14:23:30Z",
  },
];

export default function GraphPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Graph Explorer" />
      <div className="flex-1 px-4 py-8 md:px-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Nodes" value="2,847" trend={{ value: 12 }} />
          <MetricCard label="Total Edges" value="5,124" trend={{ value: 8 }} />
          <MetricCard label="Clusters" value="23" trend={{ value: 3 }} />
          <MetricCard label="Avg Connections" value="3.6" trend={{ value: -2 }} />
        </div>

        <div className="mb-8">
          <div
            className="flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
            style={{ height: "400px" }}
          >
            <span className="text-[var(--color-text-secondary)]">
              Graph visualization
            </span>
          </div>
        </div>

        <div>
          <SectionHeading size="xs">Recent Connections</SectionHeading>
          <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">
                    Target
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">
                    Relationship
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">
                    Strength
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockConnections.map((conn) => (
                  <tr
                    key={conn.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-[var(--color-text-secondary)]">
                        {conn.sourceType}:{conn.sourceId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[var(--color-text-secondary)]">
                        {conn.targetType}:{conn.targetId}
                      </span>
                    </td>
                    <td className="px-4 py-3">{conn.relationship}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono">{conn.strength.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {new Date(conn.createdAt).toLocaleString()}
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
