import { MarkerType, type Edge, type Node } from "@xyflow/react";

import type { WorkflowFlowDefinition, WorkflowFlowStep } from "@/lib/types";

type EdgeColorScheme = "primary" | "success" | "danger" | "caution";

function titleCase(str: string): string {
  return str
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildEdge(
  id: string,
  source: string,
  target: string,
  label?: string,
  sourceHandle?: string,
  colorScheme: EdgeColorScheme = "primary",
  priority: number = 1,
): Edge {
  const stroke = "var(--color-text-tertiary)";
  return {
    id,
    source,
    target,
    type: "flowEdge" as const,
    markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 20, height: 20 },
    data: { edgeStyle: "branch", edgePriority: priority, colorScheme },
    style: { stroke },
    ...(label ? { label } : {}),
    ...(sourceHandle ? { sourceHandle } : {}),
  };
}

function buildParallelParentMap(flow: WorkflowFlowDefinition): Map<string, string> {
  const map = new Map<string, string>();

  function walkBranch(stepId: string, parallelId: string) {
    if (map.has(stepId)) return;
    map.set(stepId, parallelId);
    const step = flow.steps[stepId];
    if (!step) return;
    if (step.next) walkBranch(step.next, parallelId);
    if (step.type === "conditional") {
      for (const route of step.routes) walkBranch(route.goto, parallelId);
      if (step.else) walkBranch(step.else, parallelId);
    }
    if (step.type === "parallel") {
      for (const b of step.branches) walkBranch(b, stepId);
    }
  }

  for (const [stepId, step] of Object.entries(flow.steps)) {
    if (step.type === "parallel") {
      for (const b of step.branches) walkBranch(b, stepId);
    }
  }

  return map;
}

function collectTerminalStepIds(flow: WorkflowFlowDefinition): Set<string> {
  const parallelParentMap = buildParallelParentMap(flow);
  const insideJoinedParallel = new Set<string>();
  for (const [stepId, parallelId] of parallelParentMap) {
    const parallel = flow.steps[parallelId];
    if (parallel.type === "parallel" && parallel.next) {
      insideJoinedParallel.add(stepId);
    }
  }

  const terminals = new Set<string>();
  for (const [stepId, step] of Object.entries(flow.steps)) {
    if (insideJoinedParallel.has(stepId)) continue;

    if (!step.next && step.type !== "conditional" && step.type !== "parallel") {
      terminals.add(stepId);
    }
    if (step.type === "conditional" && !step.next) {
      for (const route of step.routes) {
        if (insideJoinedParallel.has(route.goto)) continue;
        const target = flow.steps[route.goto];
        if (target && !target.next && target.type !== "conditional" && target.type !== "parallel") {
          terminals.add(route.goto);
        }
      }
      if (step.else) {
        if (!insideJoinedParallel.has(step.else)) {
          const elseTarget = flow.steps[step.else];
          if (elseTarget && !elseTarget.next && elseTarget.type !== "conditional" && elseTarget.type !== "parallel") {
            terminals.add(step.else);
          }
        }
      }
    }
  }

  return terminals;
}

function collectBranchLeaves(
  branchEntries: string[],
  steps: Record<string, WorkflowFlowStep>,
): string[] {
  const leaves: string[] = [];
  const visited = new Set<string>();

  function walk(stepId: string) {
    if (visited.has(stepId)) return;
    visited.add(stepId);

    const step = steps[stepId];
    if (!step) return;

    const outgoing: string[] = [];
    if (step.next) outgoing.push(step.next);
    if (step.type === "conditional") {
      for (const route of step.routes) outgoing.push(route.goto);
      if (step.else) outgoing.push(step.else);
    }
    if (step.type === "parallel") {
      for (const b of step.branches) outgoing.push(b);
    }

    if (outgoing.length === 0) {
      leaves.push(stepId);
    } else {
      for (const id of outgoing) walk(id);
    }
  }

  for (const id of branchEntries) walk(id);
  return leaves;
}

export function workflowFlowToElements(flow: WorkflowFlowDefinition): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const triggerId = "__wf_trigger__";
  const outputId = "__wf_output__";

  const eventLabel = titleCase(flow.trigger.event.replace(/\./g, " "));
  nodes.push({
    id: triggerId,
    type: "wf_trigger",
    position: { x: 0, y: 0 },
    data: {
      label: `On ${eventLabel}`,
      event: flow.trigger.event,
      where: flow.trigger.where,
    },
  });

  edges.push(buildEdge(`edge__trigger__${flow.start}`, triggerId, flow.start, undefined, "default", "primary", 100));

  for (const [stepId, step] of Object.entries(flow.steps)) {
    nodes.push(createStepNode(stepId, step));
    addStepEdges(edges, stepId, step);
  }

  const parallelParentMap = buildParallelParentMap(flow);

  for (const [, parallelStep] of Object.entries(flow.steps)) {
    if (parallelStep.type === "parallel" && parallelStep.next) {
      const leaves = collectBranchLeaves(parallelStep.branches, flow.steps);
      for (const leafId of leaves) {
        edges.push(buildEdge(`edge__${leafId}__join__${parallelStep.next}`, leafId, parallelStep.next, undefined, "default", "primary", 1));
      }
    }
  }

  const ELSE_HANDLES = ["default", "right", "left"];
  for (const [stepId, step] of Object.entries(flow.steps)) {
    if (step.type !== "conditional" || step.else) continue;
    const parallelId = parallelParentMap.get(stepId);
    if (parallelId) {
      const parallel = flow.steps[parallelId];
      if (parallel.type === "parallel" && parallel.next) {
        const elseHandle = ELSE_HANDLES[step.routes.length] ?? "left";
        edges.push(
          buildEdge(
            `edge__${stepId}__implicit_else__${parallel.next}`,
            stepId,
            parallel.next,
            "Else",
            elseHandle,
            "primary",
            5,
          ),
        );
      }
    } else if (flow.output !== undefined) {
      const elseHandle = ELSE_HANDLES[step.routes.length] ?? "left";
      edges.push(
        buildEdge(
          `edge__${stepId}__implicit_else__${outputId}`,
          stepId,
          outputId,
          "Else",
          elseHandle,
          "primary",
          5,
        ),
      );
    }
  }

  if (flow.output !== undefined) {
    nodes.push({
      id: outputId,
      type: "wf_output",
      position: { x: 0, y: 0 },
      data: { label: "Output Data" },
    });

    const terminalIds = collectTerminalStepIds(flow);
    for (const termId of terminalIds) {
      edges.push(buildEdge(`edge__${termId}__output`, termId, outputId, undefined, "default", "primary", 1));
    }
  }

  return { nodes, edges };
}

function createStepNode(stepId: string, step: WorkflowFlowStep): Node {
  switch (step.type) {
    case "action":
      return {
        id: stepId,
        type: "wf_action",
        position: { x: 0, y: 0 },
        data: {
          label: step.label,
          action: step.action,
          stepId,
        },
      };
    case "conditional":
      return {
        id: stepId,
        type: "wf_conditional",
        position: { x: 0, y: 0 },
        data: {
          label: step.label,
          routeCount: step.routes.length + (step.else ? 1 : 0),
          stepId,
        },
      };
    case "parallel":
      return {
        id: stepId,
        type: "wf_parallel",
        position: { x: 0, y: 0 },
        data: {
          label: step.label,
          branchCount: step.branches.length,
          stepId,
        },
      };
    case "wait":
      return {
        id: stepId,
        type: "wf_wait",
        position: { x: 0, y: 0 },
        data: {
          label: step.label,
          waitFor: step.wait_for,
          events: step.events,
          stepId,
        },
      };
  }
}

function addStepEdges(edges: Edge[], stepId: string, step: WorkflowFlowStep): void {
  if (step.type === "action" || step.type === "wait") {
    if (step.next) {
      edges.push(buildEdge(`edge__${stepId}__next__${step.next}`, stepId, step.next, undefined, "default", "primary", 50));
    }
    return;
  }

  if (step.type === "conditional") {
    const handles = ["default", "right", "left"];
    for (const [i, route] of step.routes.entries()) {
      const handle = handles[i] ?? "right";
      edges.push(
        buildEdge(
          `edge__${stepId}__route_${i}__${route.goto}`,
          stepId,
          route.goto,
          route.label,
          handle,
          route.color ?? "primary",
          10,
        ),
      );
    }
    if (step.else) {
      const elseHandle = handles[step.routes.length] ?? "left";
      edges.push(
        buildEdge(
          `edge__${stepId}__else__${step.else}`,
          stepId,
          step.else,
          "Else",
          elseHandle,
          "primary",
          5,
        ),
      );
    }
    if (step.next) {
      edges.push(buildEdge(`edge__${stepId}__next__${step.next}`, stepId, step.next, undefined, "default", "primary", 1));
    }
    return;
  }

  if (step.type === "parallel") {
    const handles = ["default", "right", "left"];
    for (const [i, branchId] of step.branches.entries()) {
      const handle = handles[i] ?? "right";
      edges.push(
        buildEdge(
          `edge__${stepId}__branch_${i}__${branchId}`,
          stepId,
          branchId,
          undefined,
          handle,
          "primary",
          10,
        ),
      );
    }
  }
}
