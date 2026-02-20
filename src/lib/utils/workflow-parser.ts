import YAML from "yaml";

import type {
  WorkflowActionType,
  WorkflowFlowActionStep,
  WorkflowFlowConditionalStep,
  WorkflowFlowDefinition,
  WorkflowFlowParallelStep,
  WorkflowFlowRoute,
  WorkflowFlowStep,
  WorkflowFlowWaitStep,
  WorkflowTriggerType,
} from "@/lib/types";

const WORKFLOW_TRIGGER_EVENTS = new Set<WorkflowTriggerType>([
  "inquiry.completed",
  "inquiry.created",
  "inquiry.failed",
  "inquiry.expired",
  "verification.passed",
  "verification.failed",
  "report.ready",
  "account.created",
  "case.resolved",
  "manual",
]);

const WORKFLOW_ACTION_TYPES = new Set<WorkflowActionType>([
  "approve_inquiry",
  "decline_inquiry",
  "review_inquiry",
  "create_case",
  "run_report",
  "tag_object",
  "send_email",
  "send_sms",
  "send_slack",
  "make_http_request",
  "run_workflow",
  "schedule_workflow",
  "evaluate_code",
]);

const WORKFLOW_STEP_TYPES = new Set(["action", "conditional", "parallel", "wait"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRequiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${path} must be a non-empty string`);
  }
  return value;
}

function parseOptionalString(value: unknown, path: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new Error(`${path} must be a string`);
  }
  return value;
}

function parseRoute(value: unknown, path: string): WorkflowFlowRoute {
  if (!isRecord(value)) {
    throw new Error(`${path} must be an object`);
  }
  return {
    label: parseRequiredString(value.label, `${path}.label`),
    when: parseRequiredString(value.when, `${path}.when`),
    goto: parseRequiredString(value.goto, `${path}.goto`),
  };
}

function parseActionStep(stepId: string, raw: Record<string, unknown>): WorkflowFlowActionStep {
  const action = parseRequiredString(raw.action, `steps.${stepId}.action`);
  if (!WORKFLOW_ACTION_TYPES.has(action as WorkflowActionType)) {
    throw new Error(`steps.${stepId}.action "${action}" is not a known action type`);
  }
  const step: WorkflowFlowActionStep = {
    type: "action",
    action: action as WorkflowActionType,
    label: parseRequiredString(raw.label, `steps.${stepId}.label`),
  };
  if (isRecord(raw.config)) {
    step.config = raw.config as Record<string, unknown>;
  }
  const next = parseOptionalString(raw.next, `steps.${stepId}.next`);
  if (next) step.next = next;
  return step;
}

function parseConditionalStep(stepId: string, raw: Record<string, unknown>): WorkflowFlowConditionalStep {
  if (!Array.isArray(raw.routes)) {
    throw new Error(`steps.${stepId}.routes must be an array`);
  }
  const step: WorkflowFlowConditionalStep = {
    type: "conditional",
    label: parseRequiredString(raw.label, `steps.${stepId}.label`),
    routes: raw.routes.map((r, i) => parseRoute(r, `steps.${stepId}.routes[${i}]`)),
  };
  const elseTarget = parseOptionalString(raw.else, `steps.${stepId}.else`);
  if (elseTarget) step.else = elseTarget;
  const next = parseOptionalString(raw.next, `steps.${stepId}.next`);
  if (next) step.next = next;
  return step;
}

function parseParallelStep(stepId: string, raw: Record<string, unknown>): WorkflowFlowParallelStep {
  if (!Array.isArray(raw.branches) || raw.branches.length === 0) {
    throw new Error(`steps.${stepId}.branches must be a non-empty array`);
  }
  const branches = raw.branches.map((b, i) => {
    if (typeof b !== "string" || b.length === 0) {
      throw new Error(`steps.${stepId}.branches[${i}] must be a non-empty string`);
    }
    return b;
  });
  const step: WorkflowFlowParallelStep = {
    type: "parallel",
    label: parseRequiredString(raw.label, `steps.${stepId}.label`),
    branches,
  };
  const next = parseOptionalString(raw.next, `steps.${stepId}.next`);
  if (next) step.next = next;
  return step;
}

function parseWaitStep(stepId: string, raw: Record<string, unknown>): WorkflowFlowWaitStep {
  const waitFor = parseRequiredString(raw.wait_for, `steps.${stepId}.wait_for`);
  if (waitFor !== "object" && waitFor !== "time") {
    throw new Error(`steps.${stepId}.wait_for must be "object" or "time"`);
  }
  const step: WorkflowFlowWaitStep = {
    type: "wait",
    label: parseRequiredString(raw.label, `steps.${stepId}.label`),
    wait_for: waitFor as "object" | "time",
  };
  const targetObject = parseOptionalString(raw.target_object, `steps.${stepId}.target_object`);
  if (targetObject) step.target_object = targetObject;
  if (Array.isArray(raw.events)) {
    step.events = raw.events.map((e, i) => {
      if (typeof e !== "string") throw new Error(`steps.${stepId}.events[${i}] must be a string`);
      return e;
    });
  }
  if (typeof raw.timeout_seconds === "number" && Number.isFinite(raw.timeout_seconds)) {
    step.timeout_seconds = raw.timeout_seconds;
  }
  const next = parseOptionalString(raw.next, `steps.${stepId}.next`);
  if (next) step.next = next;
  return step;
}

function parseWorkflowStep(stepId: string, value: unknown): WorkflowFlowStep {
  if (!isRecord(value)) {
    throw new Error(`steps.${stepId} must be an object`);
  }
  const type = parseRequiredString(value.type, `steps.${stepId}.type`);
  if (!WORKFLOW_STEP_TYPES.has(type)) {
    throw new Error(`steps.${stepId}.type must be one of action, conditional, parallel, wait`);
  }
  switch (type) {
    case "action": return parseActionStep(stepId, value);
    case "conditional": return parseConditionalStep(stepId, value);
    case "parallel": return parseParallelStep(stepId, value);
    case "wait": return parseWaitStep(stepId, value);
    default: throw new Error(`steps.${stepId}.type "${type}" is not supported`);
  }
}

export function parseWorkflowYaml(yamlStr: string): WorkflowFlowDefinition {
  let parsed: unknown;
  try {
    parsed = YAML.parse(yamlStr);
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Invalid YAML syntax");
  }

  if (!isRecord(parsed)) {
    throw new Error("Workflow YAML root must be an object");
  }

  if (!isRecord(parsed.trigger)) {
    throw new Error("trigger must be an object");
  }

  const event = parseRequiredString(parsed.trigger.event, "trigger.event");
  if (!WORKFLOW_TRIGGER_EVENTS.has(event as WorkflowTriggerType)) {
    throw new Error(`trigger.event "${event}" is not a known event type`);
  }

  const trigger: WorkflowFlowDefinition["trigger"] = {
    event: event as WorkflowTriggerType,
  };
  if (isRecord(parsed.trigger.where)) {
    const where: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed.trigger.where)) {
      where[k] = String(v);
    }
    trigger.where = where;
  }

  const start = parseRequiredString(parsed.start, "start");

  if (!isRecord(parsed.steps)) {
    throw new Error("steps must be an object");
  }

  const steps: Record<string, WorkflowFlowStep> = {};
  for (const [stepId, stepValue] of Object.entries(parsed.steps)) {
    steps[stepId] = parseWorkflowStep(stepId, stepValue);
  }

  const output = isRecord(parsed.output) ? (parsed.output as Record<string, unknown>) : undefined;

  return { trigger, start, steps, output };
}

export function validateWorkflowFlow(flow: WorkflowFlowDefinition): string[] {
  const errors: string[] = [];
  const stepIds = new Set(Object.keys(flow.steps));

  if (!stepIds.has(flow.start)) {
    errors.push(`start references unknown step: ${flow.start}`);
  }

  for (const [stepId, step] of Object.entries(flow.steps)) {
    if (step.next && !stepIds.has(step.next)) {
      errors.push(`steps.${stepId}.next references unknown step: ${step.next}`);
    }

    if (step.type === "conditional") {
      for (const route of step.routes) {
        if (!stepIds.has(route.goto)) {
          errors.push(`steps.${stepId} route "${route.label}" references unknown step: ${route.goto}`);
        }
      }
      if (step.else && !stepIds.has(step.else)) {
        errors.push(`steps.${stepId}.else references unknown step: ${step.else}`);
      }
    }

    if (step.type === "parallel") {
      for (const branchId of step.branches) {
        if (!stepIds.has(branchId)) {
          errors.push(`steps.${stepId} branch references unknown step: ${branchId}`);
        }
      }
    }

    if (step.type === "wait" && step.target_object && !stepIds.has(step.target_object)) {
      errors.push(`steps.${stepId}.target_object references unknown step: ${step.target_object}`);
    }
  }

  const visited = new Set<string>();
  const queue = [flow.start];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const step = flow.steps[current];
    if (!step) continue;

    if (step.next && !visited.has(step.next)) queue.push(step.next);

    if (step.type === "conditional") {
      for (const route of step.routes) {
        if (!visited.has(route.goto)) queue.push(route.goto);
      }
      if (step.else && !visited.has(step.else)) queue.push(step.else);
    }

    if (step.type === "parallel") {
      for (const branchId of step.branches) {
        if (!visited.has(branchId)) queue.push(branchId);
      }
    }
  }

  for (const stepId of stepIds) {
    if (!visited.has(stepId)) {
      errors.push(`orphan step is unreachable from start: ${stepId}`);
    }
  }

  return errors;
}

export function isWorkflowYaml(yamlStr: string): boolean {
  try {
    const parsed = YAML.parse(yamlStr);
    return isRecord(parsed) && isRecord(parsed.trigger) && typeof parsed.trigger.event === "string";
  } catch {
    return false;
  }
}
