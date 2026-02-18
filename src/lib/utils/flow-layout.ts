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
  "elk.layered.mergeEdges": "true",
};

function getElkPorts(node: Node) {
  const t = node.type;
  const id = node.id;
  const ports: Array<{ id: string; layoutOptions: Record<string, string> }> = [];

  if (t !== "start") {
    ports.push({ id: `${id}__target`, layoutOptions: { "port.side": "NORTH", "port.index": "0" } });
  }

  if (t !== "terminal") {
    ports.push({ id: `${id}__default`, layoutOptions: { "port.side": "SOUTH", "port.index": "0" } });
  }

  return ports;
}

/**
 * Trace the happy path by following the highest-priority edge from each node,
 * starting from __start__. Returns a set of node IDs on the happy path.
 */
function traceHappyPath(edges: Edge[]): Set<string> {
  const outgoing = new Map<string, { target: string; priority: number }[]>();
  for (const e of edges) {
    const list = outgoing.get(e.source) ?? [];
    list.push({ target: e.target, priority: (e.data?.edgePriority as number) ?? 1 });
    outgoing.set(e.source, list);
  }

  const happyIds = new Set<string>();
  let current: string | undefined = "__start__";
  const visited = new Set<string>();

  while (current && !visited.has(current)) {
    visited.add(current);
    happyIds.add(current);
    const outs = outgoing.get(current);
    if (!outs || outs.length === 0) break;
    outs.sort((a, b) => b.priority - a.priority);
    current = outs[0].target;
  }
  if (current && !happyIds.has(current)) {
    happyIds.add(current);
  }

  return happyIds;
}

/**
 * Post-process ELK layout:
 * 1. Align happy-path nodes to the same X coordinate
 * 2. Push overlapping non-happy-path nodes to the right
 */
function alignHappyPath(
  posMap: Map<string, { x: number; y: number }>,
  edges: Edge[],
): void {
  const happyIds = traceHappyPath(edges);
  if (happyIds.size < 2) return;

  const startPos = posMap.get("__start__");
  if (!startPos) return;
  const alignX = startPos.x;

  // Align all happy-path nodes to __start__'s X
  for (const id of happyIds) {
    const pos = posMap.get(id);
    if (pos) pos.x = alignX;
  }

  // Push non-happy-path nodes that now overlap
  const happyPositions = [...happyIds]
    .map((id) => posMap.get(id))
    .filter(Boolean) as { x: number; y: number }[];

  for (const [id, pos] of posMap.entries()) {
    if (happyIds.has(id)) continue;

    for (const hp of happyPositions) {
      const overlapX = pos.x < hp.x + NODE_WIDTH + 40 && pos.x + NODE_WIDTH > hp.x - 40;
      const overlapY = pos.y < hp.y + NODE_HEIGHT + 20 && pos.y + NODE_HEIGHT > hp.y - 20;
      if (overlapX && overlapY) {
        pos.x = hp.x + NODE_WIDTH + 60;
        break;
      }
    }
  }
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
      const srcHandle = edge.sourceHandle || "default";
      const priority = String(edge.data?.edgePriority ?? 1);

      return {
        id: edge.id,
        sources: [`${edge.source}__${srcHandle}`],
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

  alignHappyPath(posMap, edges);

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
    edges,
  };
}
