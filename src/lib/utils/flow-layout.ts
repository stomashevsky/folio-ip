import ELK from "elkjs/lib/elk.bundled.js";
import { Position, type Edge, type Node } from "@xyflow/react";

const elk = new ELK();

const NODE_WIDTH = 200;
const NODE_HEIGHT = 44;

const LAYOUT_OPTIONS: Record<string, string> = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.spacing.nodeNode": "60",
  "elk.spacing.edgeEdge": "20",
  "elk.spacing.edgeNode": "30",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.layered.spacing.edgeNodeBetweenLayers": "30",
  "elk.layered.spacing.edgeEdgeBetweenLayers": "20",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.greedySwitch.type": "TWO_SIDED",
  "elk.layered.thoroughness": "100",
  "elk.layered.mergeEdges": "false",
};

interface ElkPoint {
  x: number;
  y: number;
}

interface ElkSection {
  startPoint: ElkPoint;
  endPoint: ElkPoint;
  bendPoints?: ElkPoint[];
}

function getElkPorts(node: Node) {
  const t = node.type;
  const id = node.id;
  const ports: Array<{ id: string; layoutOptions: Record<string, string> }> = [];

  if (t !== "start") {
    ports.push({ id: `${id}__target`, layoutOptions: { "port.side": "NORTH", "port.index": "0" } });
  }

  if (t !== "terminal") {
    ports.push({ id: `${id}__source_default`, layoutOptions: { "port.side": "SOUTH", "port.index": "0" } });
    ports.push({ id: `${id}__source_left`, layoutOptions: { "port.side": "WEST", "port.index": "1" } });
    ports.push({ id: `${id}__source_right`, layoutOptions: { "port.side": "EAST", "port.index": "2" } });
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

export async function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  if (nodes.length === 0) return { nodes, edges };

  const graph = {
    id: "root",
    layoutOptions: LAYOUT_OPTIONS,
    children: nodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      ports: getElkPorts(node),
      layoutOptions: {
        "org.eclipse.elk.portConstraints": "FIXED_SIDE",
      },
    })),
    edges: edges.map((edge) => {
      const priority = String(edge.data?.edgePriority ?? 1);

      return {
        id: edge.id,
        sources: [getEdgeSourcePortId(edge)],
        targets: [`${edge.target}__target`],
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
      edgePathMap.set(e.id, buildPathFromSections(sections));
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
