"use client";

import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { MetricCard, SectionHeading, TableSearch } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import { Input } from "@plexui/ui/components/Input";
import { Switch } from "@plexui/ui/components/Switch";
import { Tabs } from "@plexui/ui/components/Tabs";
import {
  CloseBold,
  CollapseLg,
  ExpandMd,
  PlayCircle,
  Reload,
  SettingsCog,
  Warning,
} from "@plexui/ui/components/Icon";
import { formatDateTime } from "@/lib/utils/format";

interface GraphConnection {
  id: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationship: string;
  strength: number;
  riskLevel?: "low" | "medium" | "high";
  clusterId?: string;
  createdAt: string;
}

interface GraphEntity {
  type: string;
  id: string;
  riskLevel?: "low" | "medium" | "high";
  clusterId?: string;
  createdAt?: string;
}

const NODE_STYLES: Record<string, { background: string; border: string; color: string }> = {
  account: { background: "var(--color-primary-soft-bg)", border: "var(--color-primary-soft-border)", color: "var(--color-primary-soft-text)" },
  inquiry: { background: "var(--color-discovery-soft-bg)", border: "var(--color-discovery-soft-border)", color: "var(--color-discovery-soft-text)" },
  verification: { background: "var(--color-success-soft-bg)", border: "var(--color-success-soft-border)", color: "var(--color-success-soft-text)" },
  device: { background: "var(--color-warning-soft-bg)", border: "var(--color-warning-soft-border)", color: "var(--color-warning-soft-text)" },
  ip_address: { background: "var(--color-caution-soft-bg)", border: "var(--color-caution-soft-border)", color: "var(--color-caution-soft-text)" },
  email: { background: "var(--color-info-soft-bg)", border: "var(--color-info-soft-border)", color: "var(--color-info-soft-text)" },
};

type BadgeColor = "info" | "discovery" | "success" | "warning" | "caution" | "secondary" | "danger";

const BADGE_COLORS: Record<string, BadgeColor> = {
  account: "info",
  inquiry: "discovery",
  verification: "success",
  device: "warning",
  ip_address: "caution",
  email: "info",
};

function badgeColor(key: string): BadgeColor {
  return BADGE_COLORS[key] ?? "secondary";
}

const ENTITY_TYPE_OPTIONS = [
  { value: "account", label: "Account" },
  { value: "inquiry", label: "Inquiry" },
  { value: "verification", label: "Verification" },
  { value: "device", label: "Device" },
  { value: "ip_address", label: "IP Address" },
  { value: "email", label: "Email" },
];

const RELATIONSHIP_TYPE_OPTIONS = [
  { value: "owns", label: "Owns" },
  { value: "submitted", label: "Submitted" },
  { value: "verified_by", label: "Verified by" },
  { value: "same_device", label: "Same Device" },
  { value: "same_ip", label: "Same IP" },
  { value: "same_email", label: "Same Email" },
  { value: "linked_to", label: "Linked to" },
  { value: "flagged_by", label: "Flagged by" },
  { value: "similar_document", label: "Similar Document" },
];

const RISK_COLORS: Record<string, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const MOCK_CONNECTIONS: GraphConnection[] = [
  { id: "conn_001", sourceType: "account", sourceId: "act_001", targetType: "inquiry", targetId: "inq_101", relationship: "owns", strength: 0.95, riskLevel: "low", clusterId: "cluster_1", createdAt: "2025-02-20T14:30:00Z" },
  { id: "conn_002", sourceType: "inquiry", sourceId: "inq_101", targetType: "verification", targetId: "ver_201", relationship: "submitted", strength: 0.92, riskLevel: "low", clusterId: "cluster_1", createdAt: "2025-02-20T14:29:15Z" },
  { id: "conn_003", sourceType: "inquiry", sourceId: "inq_101", targetType: "verification", targetId: "ver_202", relationship: "submitted", strength: 0.88, riskLevel: "low", clusterId: "cluster_1", createdAt: "2025-02-20T14:28:45Z" },
  { id: "conn_004", sourceType: "device", sourceId: "dev_301", targetType: "account", targetId: "act_001", relationship: "same_device", strength: 0.90, riskLevel: "low", clusterId: "cluster_1", createdAt: "2025-02-20T14:27:30Z" },
  { id: "conn_005", sourceType: "email", sourceId: "eml_401", targetType: "account", targetId: "act_001", relationship: "same_email", strength: 0.99, riskLevel: "low", clusterId: "cluster_1", createdAt: "2025-02-20T14:26:00Z" },

  { id: "conn_006", sourceType: "account", sourceId: "act_002", targetType: "inquiry", targetId: "inq_102", relationship: "owns", strength: 0.93, riskLevel: "medium", clusterId: "cluster_2", createdAt: "2025-02-20T13:10:00Z" },
  { id: "conn_007", sourceType: "inquiry", sourceId: "inq_102", targetType: "verification", targetId: "ver_203", relationship: "submitted", strength: 0.85, riskLevel: "medium", clusterId: "cluster_2", createdAt: "2025-02-20T13:09:00Z" },
  { id: "conn_008", sourceType: "ip_address", sourceId: "ip_501", targetType: "account", targetId: "act_002", relationship: "same_ip", strength: 0.72, riskLevel: "medium", clusterId: "cluster_2", createdAt: "2025-02-20T13:08:00Z" },
  { id: "conn_009", sourceType: "ip_address", sourceId: "ip_501", targetType: "account", targetId: "act_003", relationship: "same_ip", strength: 0.68, riskLevel: "medium", clusterId: "cluster_2", createdAt: "2025-02-20T13:07:30Z" },
  { id: "conn_010", sourceType: "account", sourceId: "act_003", targetType: "inquiry", targetId: "inq_103", relationship: "owns", strength: 0.91, riskLevel: "medium", clusterId: "cluster_2", createdAt: "2025-02-20T13:06:00Z" },
  { id: "conn_011", sourceType: "device", sourceId: "dev_302", targetType: "account", targetId: "act_002", relationship: "same_device", strength: 0.82, riskLevel: "medium", clusterId: "cluster_2", createdAt: "2025-02-20T13:05:00Z" },
  { id: "conn_012", sourceType: "device", sourceId: "dev_302", targetType: "account", targetId: "act_003", relationship: "same_device", strength: 0.79, riskLevel: "high", clusterId: "cluster_2", createdAt: "2025-02-20T13:04:00Z" },

  { id: "conn_013", sourceType: "account", sourceId: "act_004", targetType: "account", targetId: "act_005", relationship: "same_ip", strength: 0.91, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:15:00Z" },
  { id: "conn_014", sourceType: "account", sourceId: "act_005", targetType: "account", targetId: "act_006", relationship: "same_device", strength: 0.87, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:14:00Z" },
  { id: "conn_015", sourceType: "account", sourceId: "act_006", targetType: "account", targetId: "act_007", relationship: "same_ip", strength: 0.93, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:13:00Z" },
  { id: "conn_016", sourceType: "account", sourceId: "act_007", targetType: "account", targetId: "act_004", relationship: "same_device", strength: 0.85, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:12:00Z" },
  { id: "conn_017", sourceType: "device", sourceId: "dev_303", targetType: "account", targetId: "act_004", relationship: "same_device", strength: 0.96, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:11:00Z" },
  { id: "conn_018", sourceType: "device", sourceId: "dev_303", targetType: "account", targetId: "act_006", relationship: "same_device", strength: 0.94, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:10:00Z" },
  { id: "conn_019", sourceType: "ip_address", sourceId: "ip_502", targetType: "account", targetId: "act_004", relationship: "same_ip", strength: 0.89, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:09:00Z" },
  { id: "conn_020", sourceType: "ip_address", sourceId: "ip_502", targetType: "account", targetId: "act_005", relationship: "same_ip", strength: 0.88, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:08:00Z" },
  { id: "conn_021", sourceType: "ip_address", sourceId: "ip_502", targetType: "account", targetId: "act_007", relationship: "same_ip", strength: 0.87, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:07:00Z" },
  { id: "conn_022", sourceType: "account", sourceId: "act_004", targetType: "inquiry", targetId: "inq_104", relationship: "owns", strength: 0.95, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:06:00Z" },
  { id: "conn_023", sourceType: "account", sourceId: "act_005", targetType: "inquiry", targetId: "inq_105", relationship: "owns", strength: 0.94, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:05:00Z" },
  { id: "conn_024", sourceType: "inquiry", sourceId: "inq_104", targetType: "inquiry", targetId: "inq_105", relationship: "similar_document", strength: 0.91, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:04:00Z" },
  { id: "conn_025", sourceType: "email", sourceId: "eml_402", targetType: "account", targetId: "act_004", relationship: "same_email", strength: 0.98, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:03:00Z" },
  { id: "conn_026", sourceType: "email", sourceId: "eml_402", targetType: "account", targetId: "act_006", relationship: "same_email", strength: 0.97, riskLevel: "high", clusterId: "fraud_ring_1", createdAt: "2025-02-19T22:02:00Z" },

  { id: "conn_027", sourceType: "account", sourceId: "act_003", targetType: "account", targetId: "act_007", relationship: "linked_to", strength: 0.55, riskLevel: "medium", createdAt: "2025-02-20T10:00:00Z" },

  { id: "conn_028", sourceType: "account", sourceId: "act_008", targetType: "inquiry", targetId: "inq_106", relationship: "owns", strength: 0.94, riskLevel: "low", createdAt: "2025-02-20T09:00:00Z" },
  { id: "conn_029", sourceType: "inquiry", sourceId: "inq_106", targetType: "verification", targetId: "ver_204", relationship: "submitted", strength: 0.90, riskLevel: "low", createdAt: "2025-02-20T08:55:00Z" },
  { id: "conn_030", sourceType: "verification", sourceId: "ver_204", targetType: "verification", targetId: "ver_203", relationship: "flagged_by", strength: 0.60, riskLevel: "medium", createdAt: "2025-02-20T08:50:00Z" },
];

const SAMPLE_QUERIES = [
  { label: "Find fraud rings", query: "MATCH (a1:Account)-[:SAME_IP|SAME_DEVICE]-(a2:Account) WHERE a1 <> a2 RETURN CLUSTER" },
  { label: "Shared devices", query: "MATCH (d:Device)-[:SAME_DEVICE]-(a:Account) WHERE COUNT(a) > 1 RETURN d, a" },
  { label: "High risk nodes", query: "MATCH (n) WHERE n.risk_level = 'high' RETURN n WITH CONNECTIONS" },
  { label: "Cross-cluster links", query: "MATCH (a1)-[r]-(a2) WHERE a1.cluster <> a2.cluster RETURN a1, r, a2" },
];

interface GraphLayoutConfig {
  clusterSpacing: number;
  nodeRadiusBase: number;
  nodeRadiusMult: number;
  edgeType: string;
}

const DEFAULT_LAYOUT: GraphLayoutConfig = {
  clusterSpacing: 700,
  nodeRadiusBase: 160,
  nodeRadiusMult: 20,
  edgeType: "smoothstep",
};

function buildGraph(
  connections: GraphConnection[],
  highlightCluster?: string | null,
  layout: GraphLayoutConfig = DEFAULT_LAYOUT,
): { nodes: Node[]; edges: Edge[]; entities: Map<string, GraphEntity> } {
  const entityMap = new Map<string, GraphEntity>();

  for (const conn of connections) {
    const srcKey = `${conn.sourceType}:${conn.sourceId}`;
    const tgtKey = `${conn.targetType}:${conn.targetId}`;
    if (!entityMap.has(srcKey)) {
      entityMap.set(srcKey, {
        type: conn.sourceType,
        id: conn.sourceId,
        riskLevel: conn.riskLevel,
        clusterId: conn.clusterId,
        createdAt: conn.createdAt,
      });
    }
    if (!entityMap.has(tgtKey)) {
      entityMap.set(tgtKey, {
        type: conn.targetType,
        id: conn.targetId,
        riskLevel: conn.riskLevel,
        clusterId: conn.clusterId,
        createdAt: conn.createdAt,
      });
    }
  }

  const entities = Array.from(entityMap.entries());

  const clusterMap = new Map<string, string[]>();
  for (const [key, entity] of entities) {
    const cluster = entity.clusterId ?? "unclustered";
    if (!clusterMap.has(cluster)) clusterMap.set(cluster, []);
    clusterMap.get(cluster)!.push(key);
  }

  const clusterCenters: Record<string, { x: number; y: number }> = {};
  const clusters = Array.from(clusterMap.keys());
  clusters.forEach((cluster, ci) => {
    const col = ci % 3;
    const row = Math.floor(ci / 3);
    clusterCenters[cluster] = {
      x: col * layout.clusterSpacing + 350,
      y: row * layout.clusterSpacing + 300,
    };
  });

  const nodes: Node[] = entities.map(([key, entity]) => {
    const cluster = entity.clusterId ?? "unclustered";
    const clusterMembers = clusterMap.get(cluster) ?? [];
    const idx = clusterMembers.indexOf(key);
    const center = clusterCenters[cluster] ?? { x: 400, y: 300 };
    const radius = layout.nodeRadiusBase + clusterMembers.length * layout.nodeRadiusMult;
    const angle = (2 * Math.PI * idx) / clusterMembers.length - Math.PI / 2;

    const style = NODE_STYLES[entity.type] ?? NODE_STYLES.account;
    const isFraudRing = cluster.startsWith("fraud_ring");
    const isHighlighted = highlightCluster ? cluster === highlightCluster : false;
    const isDimmed = highlightCluster ? !isHighlighted : false;

    return {
      id: key,
      position: {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      },
      data: {
        label: `${entity.type}\n${entity.id}`,
        entityType: entity.type,
        entityId: entity.id,
        riskLevel: entity.riskLevel,
        clusterId: cluster,
      },
      style: {
        background: style.background,
        color: style.color,
        borderWidth: isFraudRing ? "2.5px" : "1.5px",
        borderStyle: "solid",
        borderColor: isFraudRing ? "var(--color-danger-solid-bg)" : style.border,
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12px",
        fontWeight: 500,
        width: 140,
        textAlign: "center" as const,
        lineHeight: "1.5",
        opacity: isDimmed ? 0.15 : 1,
        boxShadow: isFraudRing && isHighlighted ? "0 0 12px var(--color-danger-solid-bg)" : undefined,
        transition: "opacity 200ms, box-shadow 200ms",
      },
    };
  });

  const edges: Edge[] = connections.map((conn) => {
    const isFraud = conn.clusterId?.startsWith("fraud_ring");
    const isDimmed = highlightCluster
      ? conn.clusterId !== highlightCluster
      : false;

    return {
      id: conn.id,
      source: `${conn.sourceType}:${conn.sourceId}`,
      target: `${conn.targetType}:${conn.targetId}`,
      type: layout.edgeType,
      label: conn.relationship,
      animated: conn.strength > 0.85 || !!isFraud,
      style: {
        stroke: isFraud
          ? "var(--color-danger-solid-bg)"
          : "var(--color-text-tertiary)",
        strokeWidth: Math.max(1, conn.strength * 2.5),
        opacity: isDimmed ? 0.1 : 1,
        transition: "opacity 200ms",
      },
      labelStyle: {
        fontSize: 10,
        fill: isFraud ? "var(--color-text-danger-ghost)" : "var(--color-text-secondary)",
      },
      labelBgStyle: { fill: "var(--color-surface)", opacity: 1 },
      labelBgPadding: [4, 6] as [number, number],
      labelBgBorderRadius: 4,
    };
  });

  return { nodes, edges, entities: entityMap };
}

function detectClusters(connections: GraphConnection[]): {
  id: string;
  nodeCount: number;
  edgeCount: number;
  avgRisk: string;
  isFraudRing: boolean;
}[] {
  const clusterNodes = new Map<string, Set<string>>();
  const clusterEdges = new Map<string, number>();
  const clusterRisks = new Map<string, string[]>();

  for (const conn of connections) {
    const cluster = conn.clusterId ?? "unclustered";
    if (!clusterNodes.has(cluster)) clusterNodes.set(cluster, new Set());
    clusterNodes.get(cluster)!.add(`${conn.sourceType}:${conn.sourceId}`);
    clusterNodes.get(cluster)!.add(`${conn.targetType}:${conn.targetId}`);
    clusterEdges.set(cluster, (clusterEdges.get(cluster) ?? 0) + 1);
    if (conn.riskLevel) {
      if (!clusterRisks.has(cluster)) clusterRisks.set(cluster, []);
      clusterRisks.get(cluster)!.push(conn.riskLevel);
    }
  }

  return Array.from(clusterNodes.entries()).map(([id, nodes]) => {
    const risks = clusterRisks.get(id) ?? [];
    const highCount = risks.filter((r) => r === "high").length;
    const medCount = risks.filter((r) => r === "medium").length;
    const avgRisk = highCount > risks.length / 2 ? "high" : medCount > risks.length / 2 ? "medium" : "low";

    return {
      id,
      nodeCount: nodes.size,
      edgeCount: clusterEdges.get(id) ?? 0,
      avgRisk,
      isFraudRing: id.startsWith("fraud_ring"),
    };
  });
}

const EDGE_TYPE_OPTIONS = [
  { value: "smoothstep", label: "Smooth Step" },
  { value: "default", label: "Bezier" },
  { value: "straight", label: "Straight" },
  { value: "step", label: "Step" },
];

const BG_VARIANT_OPTIONS = [
  { value: "dots", label: "Dots" },
  { value: "lines", label: "Lines" },
  { value: "cross", label: "Cross" },
];

const BG_VARIANT_MAP: Record<string, BackgroundVariant> = {
  dots: BackgroundVariant.Dots,
  lines: BackgroundVariant.Lines,
  cross: BackgroundVariant.Cross,
};

export default function GraphPage() {
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [entityTypeFilter, setEntityTypeFilter] = useState<string[]>([]);
  const [relationshipFilter, setRelationshipFilter] = useState<string[]>([]);
  const [highlightCluster, setHighlightCluster] = useState<string | null>(null);
  const [queryText, setQueryText] = useState("");
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("explorer");

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [edgeType, setEdgeType] = useState("smoothstep");
  const [bgVariant, setBgVariant] = useState("dots");
  const [bgGap, setBgGap] = useState(16);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [clusterSpacing, setClusterSpacing] = useState(700);
  const [nodeRadiusBase, setNodeRadiusBase] = useState(160);
  const [nodeRadiusMult, setNodeRadiusMult] = useState(20);

  const layoutConfig = useMemo<GraphLayoutConfig>(
    () => ({ clusterSpacing, nodeRadiusBase, nodeRadiusMult, edgeType }),
    [clusterSpacing, nodeRadiusBase, nodeRadiusMult, edgeType],
  );

  const filteredConnections = useMemo(() => {
    return MOCK_CONNECTIONS.filter((conn) => {
      if (entityTypeFilter.length > 0) {
        if (!entityTypeFilter.includes(conn.sourceType) && !entityTypeFilter.includes(conn.targetType)) {
          return false;
        }
      }
      if (relationshipFilter.length > 0) {
        if (!relationshipFilter.includes(conn.relationship)) return false;
      }
      return true;
    });
  }, [entityTypeFilter, relationshipFilter]);

  const { nodes: allNodes, edges: allEdges, entities } = useMemo(
    () => buildGraph(filteredConnections, highlightCluster, layoutConfig),
    [filteredConnections, highlightCluster, layoutConfig],
  );

  const clusters = useMemo(() => detectClusters(filteredConnections), [filteredConnections]);
  const fraudRings = clusters.filter((c) => c.isFraudRing);

  const nodes = useMemo(() => {
    if (!search.trim()) return allNodes;
    const q = search.toLowerCase();
    const matchingIds = new Set(
      allNodes.filter((n) => n.id.toLowerCase().includes(q)).map((n) => n.id),
    );
    return allNodes.map((n) => ({
      ...n,
      style: {
        ...n.style,
        opacity: matchingIds.has(n.id) ? 1 : 0.15,
      },
    }));
  }, [allNodes, search]);

  const selectedEntity = useMemo(() => {
    if (!selectedNode) return null;
    const entity = entities.get(selectedNode);
    if (!entity) return null;
    const connectedEdges = filteredConnections.filter(
      (c) =>
        `${c.sourceType}:${c.sourceId}` === selectedNode ||
        `${c.targetType}:${c.targetId}` === selectedNode,
    );
    return { ...entity, key: selectedNode, connections: connectedEdges };
  }, [selectedNode, entities, filteredConnections]);

  const hasActiveFilters = entityTypeFilter.length > 0 || relationshipFilter.length > 0;

  const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNode(node.id);
  }, []);

  function clearAllFilters() {
    setEntityTypeFilter([]);
    setRelationshipFilter([]);
    setHighlightCluster(null);
  }

  function handleRunQuery() {
    const lowerQuery = queryText.toLowerCase();
    if (lowerQuery.includes("fraud") || lowerQuery.includes("ring") || lowerQuery.includes("cluster")) {
      setHighlightCluster("fraud_ring_1");
      setActiveTab("explorer");
      setQueryResult("Found 1 fraud ring with 8 nodes and 14 connections. Cluster highlighted in the graph.");
    } else if (lowerQuery.includes("same_ip") || lowerQuery.includes("shared")) {
      setRelationshipFilter(["same_ip"]);
      setActiveTab("explorer");
      setQueryResult(`Filtered to ${MOCK_CONNECTIONS.filter((c) => c.relationship === "same_ip").length} same_ip connections.`);
    } else if (lowerQuery.includes("high") || lowerQuery.includes("risk")) {
      setHighlightCluster("fraud_ring_1");
      setActiveTab("explorer");
      setQueryResult(`Found ${MOCK_CONNECTIONS.filter((c) => c.riskLevel === "high").length} high-risk connections across ${fraudRings.length} fraud ring(s).`);
    } else {
      setQueryResult(`Query executed. ${filteredConnections.length} connections matched across ${clusters.length} clusters.`);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Graph Explorer"
        actions={
          <div className="flex items-center gap-2">
            {fraudRings.length > 0 && (
              <Button
                color="danger"
                variant={highlightCluster === "fraud_ring_1" ? "solid" : "outline"}
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
                onClick={() =>
                  setHighlightCluster((prev) =>
                    prev === "fraud_ring_1" ? null : "fraud_ring_1",
                  )
                }
              >
                <Warning />
                <span className="hidden md:inline">
                  {fraudRings.length} Fraud Ring{fraudRings.length > 1 ? "s" : ""}
                </span>
              </Button>
            )}
            <Button
              color="secondary"
              variant="outline"
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_ACTION_PILL}
              onClick={() => {
                clearAllFilters();
                setSearch("");
                setSelectedNode(null);
                setQueryResult(null);
                setQueryText("");
              }}
            >
              <Reload />
              <span className="hidden md:inline">Reset</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search nodes..." />

            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={ENTITY_TYPE_OPTIONS}
                value={entityTypeFilter}
                onChange={(opts) => setEntityTypeFilter(opts.map((o) => o.value))}
                placeholder="Entity type"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            <div className="w-44">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={200}
                options={RELATIONSHIP_TYPE_OPTIONS}
                value={relationshipFilter}
                onChange={(opts) => setRelationshipFilter(opts.map((o) => o.value))}
                placeholder="Relationship"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            {hasActiveFilters && (
              <Button
                color="secondary"
                variant="soft"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_TOOLBAR_PILL}
                onClick={clearAllFilters}
              >
                Clear filters
              </Button>
            )}
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div className="shrink-0 px-4 pt-6 md:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total Nodes" value={allNodes.length.toLocaleString()} trend={{ value: 12 }} />
            <MetricCard label="Total Edges" value={allEdges.length.toLocaleString()} trend={{ value: 8 }} />
            <MetricCard label="Clusters" value={clusters.length.toString()} trend={{ value: 3 }} />
            <MetricCard
              label="Fraud Rings"
              value={fraudRings.length.toString()}
              trend={{ value: fraudRings.length }}
            />
          </div>
        </div>

        <div className="shrink-0 overflow-x-auto px-4 pt-4 md:px-6" style={{ "--color-ring": "transparent" } as React.CSSProperties}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="underline"
            aria-label="Graph sections"
            size="lg"
          >
            <Tabs.Tab value="explorer">Explorer</Tabs.Tab>
            <Tabs.Tab value="query">Query</Tabs.Tab>
            <Tabs.Tab value="clusters" badge={{ content: clusters.length, pill: true }}>Clusters</Tabs.Tab>
          </Tabs>
          <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
            Visualize connections between accounts, inquiries, verifications, and devices. Click on a node to see its details and connections.
          </p>
        </div>

        <div className="min-h-0 flex-1 px-4 py-6 md:px-6">
          {activeTab === "explorer" && (
            <div
              className={
                isFullscreen
                  ? "fixed inset-0 z-50 bg-[var(--color-surface)]"
                  : "relative overflow-hidden rounded-xl border border-[var(--color-border)]"
              }
              style={isFullscreen ? undefined : { height: "calc(100vh - 280px)", minHeight: 500 }}
            >
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={allEdges}
                  fitView
                  fitViewOptions={{ padding: 0.15 }}
                  proOptions={{ hideAttribution: true }}
                  minZoom={0.2}
                  maxZoom={2.5}
                  snapToGrid={snapToGrid}
                  snapGrid={[bgGap, bgGap]}
                  onNodeClick={handleNodeClick}
                  onPaneClick={() => setSelectedNode(null)}
                  nodesDraggable
                >
                  <Background gap={bgGap} size={1} color="var(--color-border)" variant={BG_VARIANT_MAP[bgVariant] ?? BackgroundVariant.Dots} />
                  <Controls showInteractive={false} position="bottom-right" />
                  {showMiniMap && (
                    <MiniMap
                      position="bottom-left"
                      pannable
                      zoomable
                      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                    />
                  )}
                </ReactFlow>
              </ReactFlowProvider>

              <div className="absolute left-3 top-3 z-10">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-100 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
                    onClick={() => setShowSettings((v) => !v)}
                  >
                    <SettingsCog style={{ width: 16, height: 16 }} />
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-100 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
                    onClick={() => setIsFullscreen((v) => !v)}
                  >
                    {isFullscreen
                      ? <CollapseLg style={{ width: 16, height: 16 }} />
                      : <ExpandMd style={{ width: 16, height: 16 }} />
                    }
                  </button>
                </div>

                {showSettings && (
                  <div className="mt-2 w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-200">
                    <p className="text-xs font-medium text-[var(--color-text)]">Graph Settings</p>

                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Edge Type</label>
                        <div className="mt-1">
                          <Select
                            block
                            size="sm"
                            options={EDGE_TYPE_OPTIONS}
                            value={edgeType}
                            onChange={(opt) => setEdgeType(opt.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Background</label>
                        <div className="mt-1">
                          <Select
                            block
                            size="sm"
                            options={BG_VARIANT_OPTIONS}
                            value={bgVariant}
                            onChange={(opt) => setBgVariant(opt.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Grid Gap</label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            size="sm"
                            value={bgGap}
                            onChange={(e) => setBgGap(Number(e.target.value) || 8)}
                            min={4}
                            max={100}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Cluster Spacing</label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            size="sm"
                            value={clusterSpacing}
                            onChange={(e) => setClusterSpacing(Number(e.target.value) || 400)}
                            min={200}
                            max={2000}
                            step={50}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Node Radius Base</label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            size="sm"
                            value={nodeRadiusBase}
                            onChange={(e) => setNodeRadiusBase(Number(e.target.value) || 100)}
                            min={50}
                            max={500}
                            step={10}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Node Radius Multiplier</label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            size="sm"
                            value={nodeRadiusMult}
                            onChange={(e) => setNodeRadiusMult(Number(e.target.value) || 10)}
                            min={0}
                            max={100}
                            step={5}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xs text-[var(--color-text-secondary)]">Snap to Grid</span>
                        <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xs text-[var(--color-text-secondary)]">Mini Map</span>
                        <Switch checked={showMiniMap} onCheckedChange={setShowMiniMap} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedEntity && (
                <div className="absolute right-3 top-3 z-10 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-200">
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge color={badgeColor(selectedEntity.type)} variant="soft" size="sm">
                        {selectedEntity.type}
                      </Badge>
                      {selectedEntity.riskLevel && (
                        <Badge color={RISK_COLORS[selectedEntity.riskLevel]} variant="outline" size="sm">
                          {selectedEntity.riskLevel} risk
                        </Badge>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
                      onClick={() => setSelectedNode(null)}
                    >
                      <CloseBold style={{ width: 14, height: 14 }} />
                    </button>
                  </div>

                  <div className="px-4 py-3">
                    <p className="font-mono text-sm text-[var(--color-text)]">{selectedEntity.id}</p>
                    {selectedEntity.clusterId && (
                      <p className="mt-1 text-2xs text-[var(--color-text-tertiary)]">
                        Cluster: {selectedEntity.clusterId}
                        {selectedEntity.clusterId.startsWith("fraud_ring") && (
                          <Badge color="danger" variant="soft" size="sm" className="ml-2">
                            Fraud Ring
                          </Badge>
                        )}
                      </p>
                    )}
                    {selectedEntity.createdAt && (
                      <p className="mt-1 text-2xs text-[var(--color-text-tertiary)]">
                        First seen: {formatDateTime(selectedEntity.createdAt)}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[var(--color-border)] px-4 py-3">
                    <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                      Connections ({selectedEntity.connections.length})
                    </p>
                    <div className="mt-2 max-h-48 space-y-1.5 overflow-auto">
                      {selectedEntity.connections.map((conn) => {
                        const isSource = `${conn.sourceType}:${conn.sourceId}` === selectedEntity.key;
                        const otherType = isSource ? conn.targetType : conn.sourceType;
                        const otherId = isSource ? conn.targetId : conn.sourceId;
                        return (
                          <button
                            key={conn.id}
                            type="button"
                            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs hover:bg-[var(--color-nav-hover-bg)]"
                            onClick={() => setSelectedNode(`${otherType}:${otherId}`)}
                          >
                            <span className="flex items-center gap-1.5">
                              <Badge color={badgeColor(otherType)} variant="soft" size="sm">
                                {otherType}
                              </Badge>
                              <span className="text-[var(--color-text-secondary)]">{otherId}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="text-2xs text-[var(--color-text-tertiary)]">{conn.relationship}</span>
                              <span className="font-mono text-2xs text-[var(--color-text-tertiary)]">
                                {conn.strength.toFixed(2)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "query" && (
            <div className="space-y-6">
              <div>
                <SectionHeading size="xs">Graph Query</SectionHeading>
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                  Use Graph Query Language to search for patterns, clusters, and anomalies.
                </p>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder="MATCH (a:Account)-[:SAME_IP]-(b:Account) RETURN a, b"
                      size="md"

                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRunQuery();
                      }}
                    />
                  </div>
                  <Button
                    color="primary"
                    size="md"
                    onClick={handleRunQuery}
                    disabled={!queryText.trim()}
                  >
                    <PlayCircle />
                    Run Query
                  </Button>
                </div>
              </div>

              {queryResult && (
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div className="flex items-start gap-2">
                    <Badge color="success" variant="soft" size="sm">Result</Badge>
                    <p className="text-sm text-[var(--color-text)]">{queryResult}</p>
                  </div>
                </div>
              )}

              <div>
                <SectionHeading size="xs">Sample Queries</SectionHeading>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {SAMPLE_QUERIES.map((sq) => (
                    <button
                      key={sq.label}
                      type="button"
                      className="rounded-lg border border-[var(--color-border)] p-3 text-left transition-colors hover:border-[var(--color-primary-soft-border)] hover:bg-[var(--color-primary-soft-bg)]"
                      onClick={() => {
                        setQueryText(sq.query);
                      }}
                    >
                      <p className="text-sm font-medium text-[var(--color-text)]">{sq.label}</p>
                      <p className="mt-1 truncate font-mono text-2xs text-[var(--color-text-tertiary)]">
                        {sq.query}
                      </p>
                    </button>
                  ))}
                </div>
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
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Risk</th>
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Strength</th>
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConnections.slice(0, 15).map((conn) => (
                        <tr key={conn.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-nav-hover-bg)]">
                          <td className="px-4 py-3">
                            <Badge color={badgeColor(conn.sourceType)} variant="soft" size="sm">
                              {conn.sourceType}:{conn.sourceId}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge color={badgeColor(conn.targetType)} variant="soft" size="sm">
                              {conn.targetType}:{conn.targetId}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text)]">{conn.relationship}</td>
                          <td className="px-4 py-3">
                            {conn.riskLevel && (
                              <Badge color={RISK_COLORS[conn.riskLevel]} variant="outline" size="sm">
                                {conn.riskLevel}
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-[var(--color-text)]">{conn.strength.toFixed(2)}</span>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                            {formatDateTime(conn.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clusters" && (
            <div className="space-y-4">
              <SectionHeading size="xs">Detected Clusters</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clusters.map((cluster) => (
                  <button
                    key={cluster.id}
                    type="button"
                    className={`rounded-lg border p-4 text-left transition-all ${
                      highlightCluster === cluster.id
                        ? "border-[var(--color-primary-solid-bg)] bg-[var(--color-primary-soft-bg)]"
                        : cluster.isFraudRing
                          ? "border-[var(--color-danger-soft-border)] hover:border-[var(--color-danger-solid-bg)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary-soft-border)]"
                    }`}
                    onClick={() => {
                      setHighlightCluster((prev) =>
                        prev === cluster.id ? null : cluster.id,
                      );
                      setActiveTab("explorer");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {cluster.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      {cluster.isFraudRing && (
                        <Badge color="danger" variant="soft" size="sm">
                          <Warning style={{ width: 10, height: 10 }} />
                          Fraud Ring
                        </Badge>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-2xs text-[var(--color-text-tertiary)]">Nodes</p>
                        <p className="heading-xs">{cluster.nodeCount}</p>
                      </div>
                      <div>
                        <p className="text-2xs text-[var(--color-text-tertiary)]">Edges</p>
                        <p className="heading-xs">{cluster.edgeCount}</p>
                      </div>
                      <div>
                        <p className="text-2xs text-[var(--color-text-tertiary)]">Risk</p>
                        <Badge color={RISK_COLORS[cluster.avgRisk] ?? "secondary"} variant="outline" size="sm">
                          {cluster.avgRisk}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
