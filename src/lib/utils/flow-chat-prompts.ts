import type { FlowDefinition, FlowReviewStep, FlowStep, FlowTarget, VerificationType } from "@/lib/types";
import {
  FLOW_CHAT_EXAMPLE_COUNTRY_CODE,
  FLOW_CHAT_EXAMPLE_PROMPTS_LIMIT,
  FLOW_CHAT_EXAMPLE_RETRY_MAX,
} from "@/lib/constants";
import { parseFlowYaml } from "./flow-parser";

interface StepEntry {
  stepId: string;
  step: FlowStep;
}

const VERIFICATION_PROMPT_LABELS: Record<VerificationType, string> = {
  government_id: "government id",
  selfie: "selfie verification",
  database: "database check",
  document: "document check",
  aamva: "aamva check",
  database_phone_carrier: "phone carrier check",
  database_ssn: "ssn database check",
  email_address: "email check",
  phone_number: "phone check",
  health_insurance_card: "health insurance check",
  vehicle_insurance: "vehicle insurance check",
};

function isReviewStep(step: FlowStep | FlowReviewStep): step is FlowReviewStep {
  return "outcomes" in step;
}

function getVerificationSteps(flow: FlowDefinition): StepEntry[] {
  return Object.entries(flow.steps)
    .filter(([, step]) => !isReviewStep(step))
    .map(([stepId, step]) => ({ stepId, step: step as FlowStep }))
    .filter(({ step }) => step.type === "verification");
}

function normalizeLabel(label: string): string {
  return label.trim().replace(/\s+/g, " ").toLowerCase();
}

function getStepPromptLabel(step: FlowStep, stepId: string): string {
  if (step.label) return normalizeLabel(step.label);
  if (step.verification) return VERIFICATION_PROMPT_LABELS[step.verification];
  return normalizeLabel(stepId.replace(/_/g, " "));
}

function getTargetIds(target: FlowTarget): string[] {
  if (typeof target === "string") return [target];
  return target.branch.map((condition) => condition.goto);
}

function collectTargetReferenceCounts(flow: FlowDefinition): Map<string, number> {
  const counts = new Map<string, number>();
  const addTarget = (targetId: string) => {
    const normalizedTargetId = toSnakeCase(targetId);
    counts.set(normalizedTargetId, (counts.get(normalizedTargetId) ?? 0) + 1);
  };

  for (const step of Object.values(flow.steps)) {
    if (isReviewStep(step)) {
      for (const target of Object.values(step.outcomes)) {
        addTarget(target);
      }
      continue;
    }

    for (const target of getTargetIds(step.on_pass)) addTarget(target);
    for (const target of getTargetIds(step.on_fail)) addTarget(target);
  }

  return counts;
}

function toSnakeCase(value: string): string {
  return value.trim().replace(/\s+/g, "_").toLowerCase();
}

function getNextRetryMax(current?: number): number {
  if (typeof current === "number" && Number.isFinite(current)) {
    return Math.max(1, Math.floor(current) + 1);
  }
  return FLOW_CHAT_EXAMPLE_RETRY_MAX;
}

function targetHasCountryBranch(target: FlowTarget): boolean {
  if (typeof target === "string") return false;
  return target.branch.some((condition) => (condition.when ?? "").toLowerCase().includes("country"));
}

function targetCountryBranchHasCode(target: FlowTarget, countryCode: string): boolean {
  if (typeof target === "string") return false;
  const codePattern = new RegExp(`\\b${countryCode.toLowerCase()}\\b`);
  return target.branch.some((condition) => {
    const when = (condition.when ?? "").toLowerCase();
    return when.includes("country") && codePattern.test(when);
  });
}

function getCountryBranchStepLabel(steps: StepEntry[]): string | null {
  const countryCode = FLOW_CHAT_EXAMPLE_COUNTRY_CODE.toLowerCase();
  const entry = steps.find(({ step }) => {
    const hasCountryBranch = targetHasCountryBranch(step.on_pass) || targetHasCountryBranch(step.on_fail);
    if (!hasCountryBranch) return false;
    const hasCountryCodeAlready =
      targetCountryBranchHasCode(step.on_pass, countryCode)
      || targetCountryBranchHasCode(step.on_fail, countryCode);
    return !hasCountryCodeAlready;
  });
  if (!entry) return null;
  return getStepPromptLabel(entry.step, entry.stepId);
}

export function getFlowChatExamplePromptsFromYaml(yaml: string): string[] {
  try {
    const flow = parseFlowYaml(yaml);
    const verificationSteps = getVerificationSteps(flow);
    const prompts: string[] = [];
    const terminalIds = new Set(Object.keys(flow.terminals).map((id) => toSnakeCase(id)));
    const targetReferenceCounts = collectTargetReferenceCounts(flow);

    const countryStepLabel = getCountryBranchStepLabel(verificationSteps);
    if (countryStepLabel) {
      prompts.push(`Add ${FLOW_CHAT_EXAMPLE_COUNTRY_CODE} to the ${countryStepLabel}`);
    }

    const governmentIdStep = verificationSteps.find(({ step }) => step.verification === "government_id");
    const hasSelfieStep = verificationSteps.some(({ step }) => step.verification === "selfie");
    if (governmentIdStep) {
      const passTarget = typeof governmentIdStep.step.on_pass === "string"
        ? toSnakeCase(governmentIdStep.step.on_pass)
        : "";
      if (!hasSelfieStep) {
        prompts.push(`Add a selfie verification after ${getStepPromptLabel(governmentIdStep.step, governmentIdStep.stepId)}`);
      } else if (passTarget && passTarget !== "selfie" && (targetReferenceCounts.get(passTarget) ?? 0) > 1) {
        prompts.push(`Route pass from ${getStepPromptLabel(governmentIdStep.step, governmentIdStep.stepId)} to selfie`);
      }
    } else if (!hasSelfieStep) {
      const anchor = verificationSteps[0];
      if (anchor) {
        prompts.push(`Add a selfie verification after ${getStepPromptLabel(anchor.step, anchor.stepId)}`);
      }
    }

    const retryStep = verificationSteps.find(({ step }) => step.retry?.max !== undefined) ?? verificationSteps[0];
    if (retryStep) {
      const nextRetryMax = getNextRetryMax(retryStep.step.retry?.max);
      prompts.push(`Set retry max to ${nextRetryMax} for ${getStepPromptLabel(retryStep.step, retryStep.stepId)}`);
    }

    const rerouteStep = verificationSteps.find(({ step }) => {
      if (typeof step.on_fail !== "string") return false;
      const currentFailTarget = toSnakeCase(step.on_fail);
      if ((targetReferenceCounts.get(currentFailTarget) ?? 0) <= 1) {
        // Avoid suggestions that orphan a node/terminal in the current flow.
        return false;
      }
      if (terminalIds.has("needs_review") && currentFailTarget !== "needs_review") return true;
      if (terminalIds.has("decline") && currentFailTarget !== "decline") return true;
      if (terminalIds.has("declined") && currentFailTarget !== "declined") return true;
      return false;
    });
    if (rerouteStep) {
      const currentFailTarget = typeof rerouteStep.step.on_fail === "string" ? toSnakeCase(rerouteStep.step.on_fail) : "";
      const target =
        terminalIds.has("needs_review") && currentFailTarget !== "needs_review"
          ? "needs_review"
          : terminalIds.has("decline") && currentFailTarget !== "decline"
            ? "decline"
            : "declined";
      prompts.push(`Route failures from ${getStepPromptLabel(rerouteStep.step, rerouteStep.stepId)} to ${target}`);
    }

    const uniquePrompts = prompts.filter((prompt, index) => prompts.indexOf(prompt) === index);
    if (uniquePrompts.length >= FLOW_CHAT_EXAMPLE_PROMPTS_LIMIT) {
      return uniquePrompts.slice(0, FLOW_CHAT_EXAMPLE_PROMPTS_LIMIT);
    }
    if (uniquePrompts.length > 0) {
      return uniquePrompts.slice(0, FLOW_CHAT_EXAMPLE_PROMPTS_LIMIT);
    }
  } catch {
    // Return no suggestions when YAML is invalid.
  }

  return [];
}
