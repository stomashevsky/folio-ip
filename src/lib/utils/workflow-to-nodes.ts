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

function collectTerminalStepIds(flow: WorkflowFlowDefinition): Set<string> {
  const allNextTargets = new Set<string>();
  const allStepIds = new Set(Object.keys(flow.steps));

  for (const step of Object.values(flow.steps)) {
    if (step.next) allNextTargets.add(step.next);
    if (step.type === "conditional") {
      for (const route of step.routes) allNextTargets.add(route.goto);
      if (step.else) allNextTargets.add(step.else);
    }
    if (step.type === "parallel") {
      for (const b of step.branches) allNextTargets.add(b);
    }
  }

  const terminals = new Set<string>();
  for (const stepId of allStepIds) {
    const step = flow.steps[stepId];
    if (!step.next && step.type !== "conditional" && step.type !== "parallel") {
      terminals.add(stepId);
    }
    if (step.type === "conditional" && !step.next) {
      for (const route of step.routes) {
        const target = flow.steps[route.goto];
        if (target && !target.next && target.type !== "conditional" && target.type !== "parallel") {
          terminals.add(route.goto);
        }
      }
      if (step.else) {
        const elseTarget = flow.steps[step.else];
        if (elseTarget && !elseTarget.next && elseTarget.type !== "conditional" && elseTarget.type !== "parallel") {
          terminals.add(step.else);
        }
      }
    }
  }

  return terminals;
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
          `${i + 1}  ${route.label}`,
          handle,
          "primary",
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
          `${step.routes.length + 1}  Else`,
          elseHandle,
          "caution",
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
    if (step.next) {
      edges.push(buildEdge(`edge__${stepId}__next__${step.next}`, stepId, step.next, undefined, "default", "primary", 1));
    }
  }
}
