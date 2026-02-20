import ELK from "elkjs/lib/elk.bundled.js";
import { Position, type Edge, type Node } from "@xyflow/react";

const elk = new ELK();

const NODE_WIDTH = 250;
const NODE_HEIGHT = 44;

const DEFAULT_LAYOUT_OPTIONS: Record<string, string> = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.spacing.nodeNode": "200",
  "elk.spacing.edgeEdge": "80",
  "elk.spacing.edgeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "30",
  "elk.layered.spacing.edgeNodeBetweenLayers": "30",
  "elk.layered.spacing.edgeEdgeBetweenLayers": "30",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.greedySwitch.type": "TWO_SIDED",
  "elk.layered.thoroughness": "191",
  "elk.layered.mergeEdges": "false",
  "elk.edgeLabels.inline": "true",
  "elk.edgeLabels.placement": "CENTER",
  "elk.layered.edgeLabels.sideSelection": "DIRECTION_UP",
  "elk.layered.edgeLabels.centerLabelPlacementStrategy": "SPACE_EFFICIENT_LAYER",
  "elk.spacing.edgeLabel": "8",
  "elk.spacing.labelLabel": "8",
  "elk.spacing.labelNode": "8",
};

export type ElkLayoutOverrides = Record<string, string>;

export const ELK_OPTION_DEFS = {
  "elk.spacing.nodeNode": { label: "Node ↔ Node", min: 10, max: 200, step: 10, default: "200" },
  "elk.spacing.edgeEdge": { label: "Edge ↔ Edge", min: 5, max: 200, step: 5, default: "80" },
  "elk.spacing.edgeNode": { label: "Edge ↔ Node", min: 5, max: 200, step: 5, default: "100" },
  "elk.layered.spacing.nodeNodeBetweenLayers": { label: "Layers gap", min: 30, max: 250, step: 10, default: "30" },
  "elk.layered.spacing.edgeNodeBetweenLayers": { label: "Edge↔Node layers", min: 5, max: 100, step: 5, default: "30" },
  "elk.layered.spacing.edgeEdgeBetweenLayers": { label: "Edge↔Edge layers", min: 5, max: 100, step: 5, default: "30" },
  "elk.layered.nodePlacement.strategy": {
    label: "Node placement",
    options: ["NETWORK_SIMPLEX", "BRANDES_KOEPF", "LINEAR_SEGMENTS", "SIMPLE"],
    default: "NETWORK_SIMPLEX",
  },
  "elk.layered.crossingMinimization.strategy": {
    label: "Crossing min.",
    options: ["LAYER_SWEEP", "INTERACTIVE"],
    default: "LAYER_SWEEP",
  },
  "elk.layered.crossingMinimization.greedySwitch.type": {
    label: "Greedy switch",
    options: ["TWO_SIDED", "ONE_SIDED", "OFF"],
    default: "TWO_SIDED",
  },
  "elk.edgeRouting": {
    label: "Edge routing",
    options: ["ORTHOGONAL", "POLYLINE", "SPLINES"],
    default: "ORTHOGONAL",
  },
  "elk.layered.mergeEdges": {
    label: "Merge edges",
    options: ["false", "true"],
    default: "false",
  },
  "elk.layered.thoroughness": { label: "Thoroughness", min: 1, max: 200, step: 10, default: "191" },
  "elk.edgeLabels.inline": {
    label: "Inline labels",
    options: ["false", "true"],
    default: "true",
  },
  "elk.edgeLabels.placement": {
    label: "Label placement",
    options: ["CENTER", "HEAD", "TAIL"],
    default: "CENTER",
  },
  "elk.layered.edgeLabels.sideSelection": {
    label: "Label side",
    options: ["SMART_DOWN", "SMART_UP", "ALWAYS_UP", "ALWAYS_DOWN", "DIRECTION_UP", "DIRECTION_DOWN"],
    default: "DIRECTION_UP",
  },
  "elk.layered.edgeLabels.centerLabelPlacementStrategy": {
    label: "Center strategy",
    options: ["MEDIAN_LAYER", "TAIL_LAYER", "HEAD_LAYER", "SPACE_EFFICIENT_LAYER"],
    default: "SPACE_EFFICIENT_LAYER",
  },
  "elk.spacing.edgeLabel": { label: "Edge ↔ Label", min: 0, max: 30, step: 1, default: "8" },
  "elk.spacing.labelLabel": { label: "Label ↔ Label", min: 0, max: 30, step: 1, default: "8" },
  "elk.spacing.labelNode": { label: "Label ↔ Node", min: 0, max: 30, step: 1, default: "8" },
} as const;

export type ElkOptionKey = keyof typeof ELK_OPTION_DEFS;

interface ElkPoint {
  x: number;
  y: number;
}

interface ElkSection {
  startPoint: ElkPoint;
  endPoint: ElkPoint;
  bendPoints?: ElkPoint[];
}

function getElkPorts(
  node: Node,
  sourceLeftSide: string = "EAST",
  sourceRightSide: string = "EAST",
) {
  const t = node.type;
  const id = node.id;
  const ports: Array<{ id: string; layoutOptions: Record<string, string> }> = [];

  if (t !== "start") {
    ports.push({ id: `${id}__target`, layoutOptions: { "port.side": "NORTH", "port.index": "0" } });
  }

  if (t !== "terminal") {
    ports.push({ id: `${id}__source_default`, layoutOptions: { "port.side": "SOUTH", "port.index": "0" } });
    ports.push({ id: `${id}__source_left`, layoutOptions: { "port.side": sourceLeftSide, "port.index": "1" } });
    ports.push({ id: `${id}__source_right`, layoutOptions: { "port.side": sourceRightSide, "port.index": "2" } });
  }

  return ports;
}

function getEdgeSourcePortId(edge: Edge): string {
  const handle = edge.sourceHandle === "left" || edge.sourceHandle === "right" ? edge.sourceHandle : "default";
  return `${edge.source}__source_${handle}`;
}

/**
 * Convert ELK edge sections (orthogonal segments) into an SVG path
 * with small rounded corners at each bend.
 */
function buildPathFromSections(sections: ElkSection[]): {
  path: string;
  labelX: number;
  labelY: number;
} {
  const pts: ElkPoint[] = [];
  for (const s of sections) {
    pts.push(s.startPoint);
    if (s.bendPoints) pts.push(...s.bendPoints);
    pts.push(s.endPoint);
  }

  if (pts.length < 2) return { path: "", labelX: 0, labelY: 0 };

  const R = 6;
  let d = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const next = pts[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const r = Math.min(R, len1 / 2, len2 / 2);

    if (r > 0.5 && len1 > 0 && len2 > 0) {
      const bx = curr.x - (dx1 / len1) * r;
      const by = curr.y - (dy1 / len1) * r;
      const ax = curr.x + (dx2 / len2) * r;
      const ay = curr.y + (dy2 / len2) * r;
      d += ` L ${bx} ${by} Q ${curr.x} ${curr.y} ${ax} ${ay}`;
    } else {
      d += ` L ${curr.x} ${curr.y}`;
    }
  }

  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;

  let bestIdx = 1;
  let bestLen = 0;
  const minSegmentLengthSquared = 36 * 36;
  let firstHorizontalIdx: number | null = null;
  let firstLongIdx: number | null = null;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    const len = dx * dx + dy * dy;
    const isHorizontal = Math.abs(dy) < 0.5;
    if (isHorizontal && firstHorizontalIdx === null && len >= minSegmentLengthSquared) {
      firstHorizontalIdx = i;
    }
    if (firstLongIdx === null && len >= minSegmentLengthSquared) {
      firstLongIdx = i;
    }
    if (len > bestLen) {
      bestLen = len;
      bestIdx = i;
    }
  }
  const labelSegmentIdx = firstHorizontalIdx ?? firstLongIdx ?? bestIdx;
  const labelX = (pts[labelSegmentIdx - 1].x + pts[labelSegmentIdx].x) / 2;
  const labelY = (pts[labelSegmentIdx - 1].y + pts[labelSegmentIdx].y) / 2;

  return { path: d, labelX, labelY };
}

export interface ElkLayoutSettings {
  overrides?: ElkLayoutOverrides;
  portConstraint?: "FIXED_SIDE" | "FIXED_ORDER" | "FIXED_POS" | "FREE";
  sourceLeftSide?: "SOUTH" | "WEST" | "EAST";
  sourceRightSide?: "SOUTH" | "EAST" | "WEST";
  useElkLabelPositions?: boolean;
}

export async function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  settings?: ElkLayoutSettings,
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  if (nodes.length === 0) return { nodes, edges };

  const layoutOptions = { ...DEFAULT_LAYOUT_OPTIONS, ...settings?.overrides };
  const portConstraint = settings?.portConstraint ?? "FIXED_SIDE";
  const sourceLeftSide = settings?.sourceLeftSide ?? "EAST";
  const sourceRightSide = settings?.sourceRightSide ?? "EAST";
  const useElkLabelPositions = settings?.useElkLabelPositions ?? true;

  const graph = {
    id: "root",
    layoutOptions,
    children: nodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      ports: getElkPorts(node, sourceLeftSide, sourceRightSide),
      layoutOptions: {
        "org.eclipse.elk.portConstraints": portConstraint,
      },
    })),
    edges: edges.map((edge) => {
      const priority = String(edge.data?.edgePriority ?? 1);
      const labels: Array<{
        text: string;
        width: number;
        height: number;
        layoutOptions?: Record<string, string>;
      }> = [];

      if (edge.label && typeof edge.label === "string") {
        // Label-level layout options (placement & inline apply per-label)
        const labelLayoutOptions: Record<string, string> = {};
        const placementVal = layoutOptions["elk.edgeLabels.placement"];
        if (placementVal) labelLayoutOptions["elk.edgeLabels.placement"] = placementVal;
        const inlineVal = layoutOptions["elk.edgeLabels.inline"];
        if (inlineVal) labelLayoutOptions["elk.edgeLabels.inline"] = inlineVal;

        labels.push({
          text: edge.label,
          width: Math.ceil(edge.label.length * 6.5) + 16,
          height: 19,
          ...(Object.keys(labelLayoutOptions).length > 0
            ? { layoutOptions: labelLayoutOptions }
            : {}),
        });
      }

      return {
        id: edge.id,
        sources: [getEdgeSourcePortId(edge)],
        targets: [`${edge.target}__target`],
        labels,
        layoutOptions: {
          "org.eclipse.elk.priority": priority,
        },
      };
    }),
  };

  const result = await elk.layout(graph);

  const posMap = new Map<string, { x: number; y: number }>();
  for (const child of result.children ?? []) {
    posMap.set(child.id, { x: child.x ?? 0, y: child.y ?? 0 });
  }

  const edgePathMap = new Map<string, { path: string; labelX: number; labelY: number }>();
  for (const e of result.edges ?? []) {
    const sections = (e as unknown as { sections?: ElkSection[] }).sections;
    if (sections && sections.length > 0) {
      const pathInfo = buildPathFromSections(sections);

      if (useElkLabelPositions) {
        const elkLabel = (e as unknown as { labels?: Array<{ x?: number; y?: number; width?: number; height?: number }> }).labels?.[0];
        if (elkLabel && typeof elkLabel.x === "number" && typeof elkLabel.y === "number") {
          pathInfo.labelX = elkLabel.x + (elkLabel.width ?? 0) / 2;
          pathInfo.labelY = elkLabel.y + (elkLabel.height ?? 0) / 2;
        }
      }

      edgePathMap.set(e.id, pathInfo);
    }
  }

  return {
    nodes: nodes.map((node) => {
      const pos = posMap.get(node.id) ?? { x: 0, y: 0 };
      return {
        ...node,
        position: pos,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      };
    }),
    edges: edges.map((edge) => {
      const route = edgePathMap.get(edge.id);
      return {
        ...edge,
        data: {
          ...edge.data,
          ...(route
            ? { elkPath: route.path, elkLabelX: route.labelX, elkLabelY: route.labelY }
            : {}),
        },
      };
    }),
  };
}
