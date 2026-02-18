import { MarkerType, type Edge, type Node } from "@xyflow/react";

import type {
  FlowDefinition,
  FlowReviewStep,
  FlowStep,
  FlowTarget,
} from "@/lib/types";

type FlowEdgeStyle = "start" | "pass" | "fail" | "branch" | "outcome";
type EdgeColorScheme = "primary" | "success" | "danger" | "caution";

const EDGE_SCHEME: Record<string, EdgeColorScheme> = {
  start: "primary",
  pass: "success",
  fail: "danger",
  approved: "success",
  rejected: "danger",
  declined: "danger",
  needs_review: "caution",
  outcome: "primary",
};

function titleCase(str: string): string {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function isReviewStep(step: FlowStep | FlowReviewStep): step is FlowReviewStep {
  return step.type === "review" && "outcomes" in step;
}

function getEdgeScheme(style: FlowEdgeStyle, label?: string): EdgeColorScheme {
  if (style === "outcome" && label) {
    const key = label.toLowerCase();
    if (key in EDGE_SCHEME) return EDGE_SCHEME[key];
  }
  return EDGE_SCHEME[style] ?? "primary";
}

function buildEdge(
  id: string,
  source: string,
  target: string,
  style: FlowEdgeStyle,
  label?: string,
  sourceHandle?: string,
  priority?: number,
): Edge {
  const stroke = "var(--color-text-tertiary)";
  const colorScheme = getEdgeScheme(style, label);

  return {
    id,
    source,
    target,
    type: "flowEdge" as const,
    markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 20, height: 20 },
    data: { edgeStyle: style, edgePriority: priority ?? 1, colorScheme },
    style: { stroke },
    ...(label ? { label } : {}),
    ...(sourceHandle ? { sourceHandle } : {}),
  };
}

function getStepLabel(stepId: string, step: FlowStep): string {
  if (step.label) return step.label;
  if (step.verification) return step.verification;
  return stepId;
}

function getReviewStepLabel(stepId: string, step: FlowReviewStep): string {
  return step.label || stepId;
}

function createStepNode(stepId: string, step: FlowStep | FlowReviewStep): Node {
  if (isReviewStep(step)) {
    return {
      id: stepId,
      type: "review",
      position: { x: 0, y: 0 },
      data: {
        nodeType: "review",
        label: getReviewStepLabel(stepId, step),
        stepId,
        outcomes: step.outcomes,
      },
    };
  }

  return {
    id: stepId,
    type: step.type,
    position: { x: 0, y: 0 },
    data: {
      nodeType: step.type === "review" ? "review" : "verification",
      label: getStepLabel(stepId, step),
      stepId,
      ...(step.verification ? { verificationType: step.verification } : {}),
      ...(step.required !== undefined ? { required: step.required } : {}),
      ...(step.retry ? { maxRetries: step.retry.max } : {}),
    },
  };
}

function addTargetEdges(
  edges: Edge[],
  stepId: string,
  outcome: "pass" | "fail",
  target: FlowTarget,
): void {
  if (typeof target === "string") {
    const priority = outcome === "pass" ? 100 : 1;
    const handle = outcome === "fail" ? "left" : "default";
    edges.push(buildEdge(`edge__${stepId}__${outcome}__${target}`, stepId, target, outcome, titleCase(outcome), handle, priority));
    return;
  }

  for (const [index, condition] of target.branch.entries()) {
    const label = condition.when ?? titleCase(outcome);
    const priority = outcome === "pass" ? (index === 0 ? 50 : 10) : 1;
    const handle = outcome === "fail" ? "left" : (index === 0 ? "default" : "right");
    edges.push(
      buildEdge(
        `edge__${stepId}__${outcome}__${index}__${condition.goto}`,
        stepId,
        condition.goto,
        outcome,
        label,
        handle,
        priority,
      ),
    );
  }
}

export function flowToElements(flow: FlowDefinition): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  nodes.push({
    id: "__start__",
    type: "start",
    position: { x: 0, y: 0 },
    data: { nodeType: "start", label: "Start" },
  });

  edges.push(buildEdge(`edge__start__${flow.start}`, "__start__", flow.start, "start", undefined, "default", 100));

  for (const [stepId, step] of Object.entries(flow.steps)) {
    nodes.push(createStepNode(stepId, step));
  }

  for (const [terminalId, terminal] of Object.entries(flow.terminals)) {
    nodes.push({
      id: terminalId,
      type: "terminal",
      position: { x: 0, y: 0 },
      data: {
        nodeType: "terminal",
        label: terminal.label ?? titleCase(terminal.status),
        status: terminal.status,
        terminalStatus: terminal.status,
      },
    });
  }

  for (const [stepId, step] of Object.entries(flow.steps)) {
    if (isReviewStep(step)) {
      const outcomeEntries = Object.entries(step.outcomes);
      const handles = ["default", "right", "left"];
      for (const [idx, [outcomeName, target]] of outcomeEntries.entries()) {
        edges.push(
          buildEdge(
            `edge__${stepId}__outcome__${outcomeName}__${target}`,
            stepId,
            target,
            "outcome",
            titleCase(outcomeName),
            handles[idx] ?? "right",
            5,
          ),
        );
      }
      continue;
    }

    addTargetEdges(edges, stepId, "pass", step.on_pass);
    addTargetEdges(edges, stepId, "fail", step.on_fail);
  }

  return { nodes, edges };
}
