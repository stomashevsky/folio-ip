import YAML from "yaml";

import type {
  FlowBranch,
  FlowBranchCondition,
  FlowDefinition,
  FlowReviewStep,
  FlowStep,
  FlowStepType,
  FlowTarget,
  FlowTerminal,
  VerificationType,
} from "@/lib/types";

const TERMINAL_STATUSES = new Set<FlowTerminal["status"]>([
  "approved",
  "declined",
  "needs_review",
]);

const VERIFICATION_TYPES = new Set<VerificationType>([
  "government_id",
  "selfie",
  "database",
  "document",
  "aamva",
  "database_phone_carrier",
  "database_ssn",
  "email_address",
  "phone_number",
  "health_insurance_card",
  "vehicle_insurance",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFlowStepType(value: string): value is FlowStepType {
  return value === "verification" || value === "review" || value === "wait";
}

function isTerminalStatus(value: string): value is FlowTerminal["status"] {
  return TERMINAL_STATUSES.has(value as FlowTerminal["status"]);
}

function isVerificationType(value: string): value is VerificationType {
  return VERIFICATION_TYPES.has(value as VerificationType);
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

function parseOptionalBoolean(value: unknown, path: string): boolean | undefined {
  if (value === undefined) return undefined;

  if (typeof value !== "boolean") {
    throw new Error(`${path} must be a boolean`);
  }

  return value;
}

function parseBranchCondition(value: unknown, path: string): FlowBranchCondition {
  if (!isRecord(value)) {
    throw new Error(`${path} must be an object`);
  }

  // Handle shorthand: `- default: target_id` → { default: true, goto: target_id }
  if (typeof value.default === "string") {
    return { default: true, goto: value.default };
  }

  const when = parseOptionalString(value.when, `${path}.when`);
  const isDefault = parseOptionalBoolean(value.default, `${path}.default`);
  const goto = parseRequiredString(value.goto, `${path}.goto`);

  const condition: FlowBranchCondition = { goto };
  if (when !== undefined) condition.when = when;
  if (isDefault !== undefined) condition.default = isDefault;

  return condition;
}

function parseFlowTarget(value: unknown, path: string): FlowTarget {
  if (typeof value === "string") {
    return value;
  }

  if (!isRecord(value) || !Array.isArray(value.branch)) {
    throw new Error(`${path} must be a string target or branch definition`);
  }

  const branch: FlowBranch = {
    branch: value.branch.map((condition, index) =>
      parseBranchCondition(condition, `${path}.branch[${index}]`)
    ),
  };

  return branch;
}

function parseReviewStep(stepId: string, raw: Record<string, unknown>): FlowReviewStep {
  const label = parseRequiredString(raw.label, `steps.${stepId}.label`);

  if (!isRecord(raw.outcomes)) {
    throw new Error(`steps.${stepId}.outcomes must be an object`);
  }

  const outcomes: Record<string, string> = {};
  for (const [outcomeName, target] of Object.entries(raw.outcomes)) {
    outcomes[outcomeName] = parseRequiredString(target, `steps.${stepId}.outcomes.${outcomeName}`);
  }

  return {
    type: "review",
    label,
    outcomes,
  };
}

function parseFlowStep(stepId: string, value: unknown): FlowStep | FlowReviewStep {
  if (!isRecord(value)) {
    throw new Error(`steps.${stepId} must be an object`);
  }

  const type = parseRequiredString(value.type, `steps.${stepId}.type`);
  if (!isFlowStepType(type)) {
    throw new Error(`steps.${stepId}.type must be one of verification, review, wait`);
  }

  if (type === "review" && "outcomes" in value) {
    return parseReviewStep(stepId, value);
  }

  const onPass = parseFlowTarget(value.on_pass, `steps.${stepId}.on_pass`);
  const onFail = parseFlowTarget(value.on_fail, `steps.${stepId}.on_fail`);

  const step: FlowStep = {
    type,
    on_pass: onPass,
    on_fail: onFail,
  };

  if (value.verification !== undefined) {
    const verification = parseRequiredString(value.verification, `steps.${stepId}.verification`);
    if (!isVerificationType(verification)) {
      throw new Error(
        `steps.${stepId}.verification must be one of government_id, selfie, database, document`
      );
    }
    step.verification = verification;
  }

  const label = parseOptionalString(value.label, `steps.${stepId}.label`);
  if (label !== undefined) {
    step.label = label;
  }

  const required = parseOptionalBoolean(value.required, `steps.${stepId}.required`);
  if (required !== undefined) {
    step.required = required;
  }

  if (value.retry !== undefined) {
    if (!isRecord(value.retry) || typeof value.retry.max !== "number" || !Number.isFinite(value.retry.max)) {
      throw new Error(`steps.${stepId}.retry.max must be a finite number`);
    }

    step.retry = { max: value.retry.max };
  }

  return step;
}

function parseTerminal(terminalId: string, value: unknown): FlowTerminal {
  if (!isRecord(value)) {
    throw new Error(`terminals.${terminalId} must be an object`);
  }

  const status = parseRequiredString(value.status, `terminals.${terminalId}.status`);
  if (!isTerminalStatus(status)) {
    throw new Error(`terminals.${terminalId}.status must be approved, declined, or needs_review`);
  }

  const label = parseOptionalString(value.label, `terminals.${terminalId}.label`);

  const terminal: FlowTerminal = { status };
  if (label !== undefined) {
    terminal.label = label;
  }

  return terminal;
}

function isReviewStep(step: FlowStep | FlowReviewStep): step is FlowReviewStep {
  return step.type === "review" && "outcomes" in step;
}

function getBranchTargets(branch: FlowBranch): string[] {
  return branch.branch.map((condition) => condition.goto);
}

function getTargetIds(target: FlowTarget): string[] {
  if (typeof target === "string") {
    return [target];
  }

  return getBranchTargets(target);
}

function isKnownTarget(
  target: string,
  stepIds: Set<string>,
  terminalIds: Set<string>
): boolean {
  return stepIds.has(target) || terminalIds.has(target);
}

function validateTarget(
  target: FlowTarget,
  context: string,
  stepIds: Set<string>,
  terminalIds: Set<string>,
  errors: string[]
): void {
  if (typeof target === "string") {
    if (!isKnownTarget(target, stepIds, terminalIds)) {
      errors.push(`${context} references unknown target: ${target}`);
    }
    return;
  }

  if (target.branch.length === 0) {
    errors.push(`${context} branch must define at least one condition`);
  }

  for (const condition of target.branch) {
    if (!isKnownTarget(condition.goto, stepIds, terminalIds)) {
      errors.push(`${context} branch references unknown target: ${condition.goto}`);
    }
  }
}

interface FlowReachability {
  steps: Set<string>;
  terminals: Set<string>;
}

function collectReachability(flow: FlowDefinition): FlowReachability {
  const stepIds = new Set(Object.keys(flow.steps));
  const terminalIds = new Set(Object.keys(flow.terminals));
  const visitedSteps = new Set<string>();
  const visitedTerminals = new Set<string>();
  const queue: string[] = [];

  if (stepIds.has(flow.start)) {
    queue.push(flow.start);
  }

  while (queue.length > 0) {
    const currentStepId = queue.shift();
    if (!currentStepId || visitedSteps.has(currentStepId)) {
      continue;
    }

    visitedSteps.add(currentStepId);

    const step = flow.steps[currentStepId];
    if (!step) {
      continue;
    }

    if (isReviewStep(step)) {
      for (const target of Object.values(step.outcomes)) {
        if (stepIds.has(target) && !visitedSteps.has(target)) {
          queue.push(target);
        } else if (terminalIds.has(target)) {
          visitedTerminals.add(target);
        }
      }
      continue;
    }

    for (const target of getTargetIds(step.on_pass)) {
      if (stepIds.has(target) && !visitedSteps.has(target)) {
        queue.push(target);
      } else if (terminalIds.has(target)) {
        visitedTerminals.add(target);
      }
    }

    for (const target of getTargetIds(step.on_fail)) {
      if (stepIds.has(target) && !visitedSteps.has(target)) {
        queue.push(target);
      } else if (terminalIds.has(target)) {
        visitedTerminals.add(target);
      }
    }
  }

  return {
    steps: visitedSteps,
    terminals: visitedTerminals,
  };
}

export function parseFlowYaml(yamlStr: string): FlowDefinition {
  let parsed: unknown;

  try {
    parsed = YAML.parse(yamlStr);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Invalid YAML syntax");
  }

  if (!isRecord(parsed)) {
    throw new Error("Flow YAML root must be an object");
  }

  const start = parseRequiredString(parsed.start, "start");

  if (!isRecord(parsed.steps)) {
    throw new Error("steps must be an object");
  }

  if (!isRecord(parsed.terminals)) {
    throw new Error("terminals must be an object");
  }

  const steps: Record<string, FlowStep | FlowReviewStep> = {};
  for (const [stepId, stepValue] of Object.entries(parsed.steps)) {
    steps[stepId] = parseFlowStep(stepId, stepValue);
  }

  const terminals: Record<string, FlowTerminal> = {};
  for (const [terminalId, terminalValue] of Object.entries(parsed.terminals)) {
    terminals[terminalId] = parseTerminal(terminalId, terminalValue);
  }

  return {
    start,
    steps,
    terminals,
  };
}

export function serializeFlowYaml(flow: FlowDefinition): string {
  return YAML.stringify(flow);
}

export function validateFlow(flow: FlowDefinition): string[] {
  const errors: string[] = [];
  const stepIds = new Set(Object.keys(flow.steps));
  const terminalIds = new Set(Object.keys(flow.terminals));

  if (!stepIds.has(flow.start)) {
    errors.push(`start references unknown step: ${flow.start}`);
  }

  for (const [terminalId, terminal] of Object.entries(flow.terminals)) {
    if (!TERMINAL_STATUSES.has(terminal.status)) {
      errors.push(`terminal ${terminalId} has invalid status: ${terminal.status}`);
    }
  }

  for (const [stepId, step] of Object.entries(flow.steps)) {
    if (isReviewStep(step)) {
      const outcomeEntries = Object.entries(step.outcomes);
      if (outcomeEntries.length === 0) {
        errors.push(`review step ${stepId} must define at least one outcome`);
      }

      for (const [outcomeName, target] of outcomeEntries) {
        if (!isKnownTarget(target, stepIds, terminalIds)) {
          errors.push(`steps.${stepId}.outcomes.${outcomeName} references unknown target: ${target}`);
        }
      }

      continue;
    }

    validateTarget(step.on_pass, `steps.${stepId}.on_pass`, stepIds, terminalIds, errors);
    validateTarget(step.on_fail, `steps.${stepId}.on_fail`, stepIds, terminalIds, errors);
  }

  const reachable = collectReachability(flow);
  for (const stepId of stepIds) {
    if (!reachable.steps.has(stepId)) {
      errors.push(`orphan step is unreachable from start: ${stepId}`);
    }
  }

  for (const terminalId of terminalIds) {
    if (!reachable.terminals.has(terminalId)) {
      errors.push(`orphan terminal is unreachable from start: ${terminalId}`);
    }
  }

  return errors;
}
