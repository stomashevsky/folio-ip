"use client";

import { useMemo } from "react";
import { ReactFlow, Background, Controls, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TopBar } from "@/components/layout/TopBar";
import { MetricCard, SectionHeading } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";

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
  { id: "conn_001", sourceType: "account", sourceId: "act_123", targetType: "inquiry", targetId: "inq_456", relationship: "owns", strength: 0.95, createdAt: "2025-02-20T14:30:00Z" },
  { id: "conn_002", sourceType: "inquiry", sourceId: "inq_456", targetType: "verification", targetId: "ver_789", relationship: "submitted", strength: 0.88, createdAt: "2025-02-20T14:29:15Z" },
  { id: "conn_003", sourceType: "verification", sourceId: "ver_789", targetType: "account", targetId: "act_123", relationship: "verified_by", strength: 0.92, createdAt: "2025-02-20T14:28:45Z" },
  { id: "conn_004", sourceType: "device", sourceId: "dev_111", targetType: "account", targetId: "act_123", relationship: "same_device", strength: 0.78, createdAt: "2025-02-20T14:27:30Z" },
  { id: "conn_005", sourceType: "account", sourceId: "act_234", targetType: "account", targetId: "act_123", relationship: "same_ip", strength: 0.65, createdAt: "2025-02-20T14:26:00Z" },
  { id: "conn_006", sourceType: "inquiry", sourceId: "inq_567", targetType: "inquiry", targetId: "inq_456", relationship: "linked_to", strength: 0.72, createdAt: "2025-02-20T14:25:15Z" },
  { id: "conn_007", sourceType: "device", sourceId: "dev_222", targetType: "device", targetId: "dev_111", relationship: "same_ip", strength: 0.81, createdAt: "2025-02-20T14:24:00Z" },
  { id: "conn_008", sourceType: "verification", sourceId: "ver_890", targetType: "inquiry", targetId: "inq_567", relationship: "submitted", strength: 0.85, createdAt: "2025-02-20T14:23:30Z" },
];

const NODE_STYLES: Record<string, { background: string; border: string; color: string }> = {
  account: { background: "var(--color-primary-soft-bg)", border: "var(--color-primary-soft-border)", color: "var(--color-primary-soft-text)" },
  inquiry: { background: "var(--color-discovery-soft-bg)", border: "var(--color-discovery-soft-border)", color: "var(--color-discovery-soft-text)" },
  verification: { background: "var(--color-success-soft-bg)", border: "var(--color-success-soft-border)", color: "var(--color-success-soft-text)" },
  device: { background: "var(--color-warning-soft-bg)", border: "var(--color-warning-soft-border)", color: "var(--color-warning-soft-text)" },
};

const BADGE_COLORS: Record<string, "info" | "discovery" | "success" | "warning"> = {
  account: "info",
  inquiry: "discovery",
  verification: "success",
  device: "warning",
};

function buildGraph(connections: Connection[]): { nodes: Node[]; edges: Edge[] } {
  const entityMap = new Map<string, { type: string; id: string }>();

  for (const conn of connections) {
    const srcKey = `${conn.sourceType}:${conn.sourceId}`;
    const tgtKey = `${conn.targetType}:${conn.targetId}`;
    if (!entityMap.has(srcKey)) entityMap.set(srcKey, { type: conn.sourceType, id: conn.sourceId });
    if (!entityMap.has(tgtKey)) entityMap.set(tgtKey, { type: conn.targetType, id: conn.targetId });
  }

  const entities = Array.from(entityMap.entries());
  const radius = 220;
  const centerX = 350;
  const centerY = 260;

  const nodes: Node[] = entities.map(([key, entity], i) => {
    const angle = (2 * Math.PI * i) / entities.length - Math.PI / 2;
    const style = NODE_STYLES[entity.type] ?? NODE_STYLES.account;

    return {
      id: key,
      position: { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) },
      data: { label: `${entity.type}\n${entity.id}` },
      style: {
        ...style,
        borderWidth: "1.5px",
        borderStyle: "solid",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12px",
        fontWeight: 500,
        width: 140,
        textAlign: "center" as const,
        lineHeight: "1.5",
      },
    };
  });

  const edges: Edge[] = connections.map((conn) => ({
    id: conn.id,
    source: `${conn.sourceType}:${conn.sourceId}`,
    target: `${conn.targetType}:${conn.targetId}`,
    label: conn.relationship,
    animated: conn.strength > 0.85,
    style: { stroke: "var(--color-text-tertiary)", strokeWidth: Math.max(1, conn.strength * 2.5) },
    labelStyle: { fontSize: 10, fill: "var(--color-text-secondary)" },
    labelBgStyle: { fill: "var(--color-surface)", opacity: 0.9 },
    labelBgPadding: [4, 6] as [number, number],
    labelBgBorderRadius: 4,
  }));

  return { nodes, edges };
}

export default function GraphPage() {
  const { nodes, edges } = useMemo(() => buildGraph(mockConnections), []);

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

        <div className="mb-8 overflow-hidden rounded-xl border border-[var(--color-border)]" style={{ height: 520 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            proOptions={{ hideAttribution: true }}
            minZoom={0.3}
            maxZoom={2}
          >
            <Background gap={16} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        <div>
          <SectionHeading size="xs">Recent Connections</SectionHeading>
          <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Target</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Relationship</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Strength</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Created</th>
                </tr>
              </thead>
              <tbody>
                {mockConnections.map((conn) => (
                  <tr key={conn.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface)]">
                    <td className="px-4 py-3">
                      <Badge color={BADGE_COLORS[conn.sourceType] ?? "secondary"} variant="soft" size="sm">
                        {conn.sourceType}:{conn.sourceId}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={BADGE_COLORS[conn.targetType] ?? "secondary"} variant="soft" size="sm">
                        {conn.targetType}:{conn.targetId}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text)]">{conn.relationship}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[var(--color-text)]">{conn.strength.toFixed(2)}</span>
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
