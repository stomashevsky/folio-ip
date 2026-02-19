import { NextRequest, NextResponse } from "next/server";
import {
  FLOW_CHAT_DEFAULT_PROVIDER,
  FLOW_CHAT_GEMINI_DEFAULT_MODEL,
  FLOW_CHAT_GROQ_BASE_URL,
  FLOW_CHAT_GROQ_DEFAULT_MODEL,
  FLOW_CHAT_MAX_OUTPUT_TOKENS,
  FLOW_CHAT_TEMPERATURE,
  VERIFICATION_TYPE_LABELS,
} from "@/lib/constants";
import type { FlowChatProvider } from "@/lib/constants";
import type { FlowDefinition, FlowReviewStep, FlowStep, FlowTarget } from "@/lib/types";
import { parseFlowYaml, serializeFlowYaml, validateFlow } from "@/lib/utils/flow-parser";
import { getFlowChatExamplePromptsFromYaml } from "@/lib/utils/flow-chat-prompts";

const SYSTEM_PROMPT = `You are a KYC flow editor assistant. You help modify inquiry template flows defined in YAML DSL.

RULES:
1. Always respond with valid YAML following the schema provided.
2. Only output the modified YAML in a \`\`\`yaml code block.
3. Before the YAML, write a brief 1-sentence explanation of what you changed.
4. Preserve existing steps unless explicitly asked to remove them.
5. Use only these verification types: government_id, selfie, database, document.
6. Terminal statuses must be: approved, declined, or needs_review.
7. Step IDs should be snake_case.
8. Keep the YAML clean and readable.
9. Step IDs and YAML keys in steps/terminals must be unique (never duplicate keys).
10. If user asks to add an existing step, update that existing step instead of creating another key with the same ID.`;

interface RequestBody {
  message: string;
  currentYaml: string;
  schema: string;
  provider?: FlowChatProvider;
  apiKey?: string;
  model?: string;
}

interface FlowChatResponse {
  message: string;
  yaml: string | null;
}

function ensureValidSuggestedYaml(result: FlowChatResponse): FlowChatResponse {
  if (!result.yaml) return result;

  try {
    const parsed = parseFlowYaml(result.yaml);
    const errors = validateFlow(parsed);
    if (errors.length > 0) {
      return {
        message: `${result.message} I generated invalid YAML (${errors[0]}). Please retry or rephrase.`,
        yaml: null,
      };
    }
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid YAML";
    return {
      message: `${result.message} I generated invalid YAML (${message}). Please retry or rephrase.`,
      yaml: null,
    };
  }
}

class AiProviderApiError extends Error {
  provider: "gemini" | "groq";
  status: number;

  constructor(provider: "gemini" | "groq", status: number, message: string) {
    super(message);
    this.name = "AiProviderApiError";
    this.provider = provider;
    this.status = status;
  }
}

function normalizePrompt(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9_\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getDeterministicPromptSet(currentYaml: string): Set<string> {
  return new Set(getFlowChatExamplePromptsFromYaml(currentYaml).map((prompt) => normalizePrompt(prompt)));
}

function extractYamlFromResponse(text: string): string | null {
  const yamlMatch = text.match(/```yaml\n([\s\S]*?)```/);
  if (yamlMatch) return yamlMatch[1].trim();

  const codeMatch = text.match(/```\n([\s\S]*?)```/);
  if (codeMatch) return codeMatch[1].trim();

  return null;
}

function extractMessageFromResponse(text: string): string {
  const beforeYaml = text.split("```")[0].trim();
  return beforeYaml || "Flow updated.";
}

async function callGemini(userMessage: string, currentYaml: string, schema: string): Promise<{ message: string; yaml: string | null }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("NO_API_KEY");
  const model = process.env.GEMINI_MODEL?.trim() || FLOW_CHAT_GEMINI_DEFAULT_MODEL;
  return callGeminiWithKey(userMessage, currentYaml, schema, apiKey, model);
}

async function callGeminiWithKey(
  userMessage: string,
  currentYaml: string,
  schema: string,
  apiKey: string,
  model: string,
): Promise<FlowChatResponse> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n${schema}\n\nCurrent flow:\n\`\`\`yaml\n${currentYaml}\n\`\`\`\n\nUser request: ${userMessage}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: FLOW_CHAT_TEMPERATURE,
          maxOutputTokens: FLOW_CHAT_MAX_OUTPUT_TOKENS,
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    let errorMessage = "Gemini API request failed.";
    try {
      const parsed = JSON.parse(err) as { error?: { message?: string } };
      if (parsed.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch {
      if (err.trim().length > 0) {
        errorMessage = err.trim();
      }
    }
    throw new AiProviderApiError("gemini", response.status, errorMessage);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return {
    message: extractMessageFromResponse(text),
    yaml: extractYamlFromResponse(text),
  };
}

async function callGroq(userMessage: string, currentYaml: string, schema: string): Promise<FlowChatResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("NO_API_KEY");

  const model = process.env.GROQ_MODEL?.trim() || FLOW_CHAT_GROQ_DEFAULT_MODEL;
  return callGroqWithKey(userMessage, currentYaml, schema, apiKey, model);
}

async function callGroqWithKey(
  userMessage: string,
  currentYaml: string,
  schema: string,
  apiKey: string,
  model: string,
): Promise<FlowChatResponse> {
  const response = await fetch(`${FLOW_CHAT_GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: FLOW_CHAT_TEMPERATURE,
      max_tokens: FLOW_CHAT_MAX_OUTPUT_TOKENS,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `${schema}\n\nCurrent flow:\n\`\`\`yaml\n${currentYaml}\n\`\`\`\n\nUser request: ${userMessage}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    let errorMessage = "Groq API request failed.";
    try {
      const parsed = JSON.parse(err) as { error?: { message?: string } };
      if (parsed.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch {
      if (err.trim().length > 0) {
        errorMessage = err.trim();
      }
    }
    throw new AiProviderApiError("groq", response.status, errorMessage);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  return {
    message: extractMessageFromResponse(text),
    yaml: extractYamlFromResponse(text),
  };
}

function normalizeOptionalValue(value?: string): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;
  return normalized;
}

function toMockFallbackResponse(userMessage: string, currentYaml: string, reason: string): FlowChatResponse {
  const fallback = mockResponse(userMessage, currentYaml);
  const cleanedFallbackMessage = fallback.message
    .replace("Set GROQ_API_KEY in Settings or .env.local for full AI capabilities. ", "")
    .replace("Set GROQ_API_KEY in .env.local for full AI capabilities. ", "")
    .replace("Set GEMINI_API_KEY in .env.local for full AI capabilities. ", "");
  return {
    message: `AI provider is unavailable (${reason}). Switched to mock mode. ${cleanedFallbackMessage}`,
    yaml: fallback.yaml,
  };
}

function normalizeTargetId(value: string): string {
  return value.trim().replace(/\s+/g, "_").toLowerCase();
}

function getFlowTargetIds(target: FlowTarget): string[] {
  if (typeof target === "string") {
    return [target];
  }

  return target.branch.map((condition) => condition.goto);
}

function isReviewStep(step: FlowStep | FlowReviewStep): step is FlowReviewStep {
  return "outcomes" in step;
}

function collectTargetReferenceCounts(flow: FlowDefinition): Map<string, number> {
  const counts = new Map<string, number>();
  const addTarget = (targetId: string) => {
    const normalizedTarget = normalizeTargetId(targetId);
    counts.set(normalizedTarget, (counts.get(normalizedTarget) ?? 0) + 1);
  };

  for (const step of Object.values(flow.steps)) {
    if (isReviewStep(step)) {
      for (const target of Object.values(step.outcomes)) {
        addTarget(target);
      }
      continue;
    }

    for (const target of getFlowTargetIds(step.on_pass)) addTarget(target);
    for (const target of getFlowTargetIds(step.on_fail)) addTarget(target);
  }

  return counts;
}

function getFirstStepId(flow: FlowDefinition): string | null {
  for (const stepId of Object.keys(flow.steps)) return stepId;
  return null;
}

function getMutableStepEntries(flow: FlowDefinition): Array<[string, FlowStep]> {
  return Object.entries(flow.steps).filter((entry): entry is [string, FlowStep] => !isReviewStep(entry[1]));
}

function resolveTargetId(flow: FlowDefinition, targetHint: string): string | null {
  const normalizedTargetId = normalizeTargetId(targetHint);
  const stepId = Object.keys(flow.steps).find((id) => normalizeTargetId(id) === normalizedTargetId);
  if (stepId) return stepId;
  const terminalId = Object.keys(flow.terminals).find((id) => normalizeTargetId(id) === normalizedTargetId);
  if (terminalId) return terminalId;
  return null;
}

function isTerminalTarget(flow: FlowDefinition, targetId: string): boolean {
  return Object.keys(flow.terminals).some((id) => normalizeTargetId(id) === normalizeTargetId(targetId));
}

function toValidatedFlowYamlResponse(flow: FlowDefinition, message: string): FlowChatResponse {
  const errors = validateFlow(flow);
  if (errors.length > 0) {
    return {
      message: `I couldn't apply this change because it would make the flow invalid: ${errors[0]}.`,
      yaml: null,
    };
  }
  return {
    message,
    yaml: serializeFlowYaml(flow),
  };
}

function insertStepAfter(
  steps: Record<string, FlowStep | FlowReviewStep>,
  anchorStepId: string,
  newStepId: string,
  newStep: FlowStep,
): Record<string, FlowStep | FlowReviewStep> {
  const updatedSteps: Record<string, FlowStep | FlowReviewStep> = {};
  for (const [stepId, step] of Object.entries(steps)) {
    updatedSteps[stepId] = step;
    if (stepId === anchorStepId) {
      updatedSteps[newStepId] = newStep;
    }
  }

  if (!(newStepId in updatedSteps)) {
    updatedSteps[newStepId] = newStep;
  }

  return updatedSteps;
}

function hasTokenSubset(sourceText: string, candidateText: string): boolean {
  const sourceTokens = new Set(normalizePrompt(sourceText).split(" ").filter(Boolean));
  const candidateTokens = normalizePrompt(candidateText).split(" ").filter(Boolean);
  if (candidateTokens.length === 0) return false;
  return candidateTokens.every((token) => sourceTokens.has(token));
}

function findStepEntryByHint(flow: FlowDefinition, sourceStepHint: string): [string, FlowStep] | null {
  const normalizedHint = normalizePrompt(sourceStepHint);

  for (const [stepId, step] of getMutableStepEntries(flow)) {
    if (includesStepReference(normalizedHint, stepId)) {
      return [stepId, step];
    }

    if (hasTokenSubset(sourceStepHint, stepId.replaceAll("_", " "))) {
      return [stepId, step];
    }

    if (step.label && normalizedHint.includes(normalizePrompt(step.label))) {
      return [stepId, step];
    }

    if (step.verification) {
      if (normalizedHint.includes(step.verification.replaceAll("_", " "))) {
        return [stepId, step];
      }
      const verificationLabel = VERIFICATION_TYPE_LABELS[step.verification] ?? step.verification;
      if (hasTokenSubset(sourceStepHint, verificationLabel) || hasTokenSubset(sourceStepHint, `${verificationLabel} check`)) {
        return [stepId, step];
      }
    }
  }

  return null;
}

function routeStepTarget(
  flow: FlowDefinition,
  sourceStepHint: string,
  targetHint: string,
  targetField: "on_pass" | "on_fail",
): FlowChatResponse {
  const stepEntry = findStepEntryByHint(flow, sourceStepHint);
  if (!stepEntry) {
    return { message: `I couldn't find a step matching "${sourceStepHint}".`, yaml: null };
  }

  const [stepId, step] = stepEntry;
  if (typeof step[targetField] !== "string") {
    return {
      message: `I couldn't route ${targetField.replace("on_", "")} for ${stepId} because ${targetField} uses a branch.`,
      yaml: null,
    };
  }

  const nextTargetId = resolveTargetId(flow, targetHint);
  if (!nextTargetId) {
    return { message: `I couldn't find target ${normalizeTargetId(targetHint)}.`, yaml: null };
  }

  const currentTargetId = step[targetField];
  if (normalizeTargetId(currentTargetId) === normalizeTargetId(nextTargetId)) {
    return { message: `${targetField} for ${stepId} already routes to ${nextTargetId}.`, yaml: null };
  }

  const targetReferenceCounts = collectTargetReferenceCounts(flow);
  if ((targetReferenceCounts.get(normalizeTargetId(currentTargetId)) ?? 0) <= 1) {
    const targetKind = isTerminalTarget(flow, currentTargetId) ? "terminal" : "step";
    return {
      message: `I couldn't apply this change because ${targetKind} ${normalizeTargetId(currentTargetId)} would become unreachable from start.`,
      yaml: null,
    };
  }

  step[targetField] = nextTargetId;

  return toValidatedFlowYamlResponse(
    flow,
    `Changed the ${targetField} target of the ${stepId} step to ${nextTargetId}.`,
  );
}

function findSelfieStepId(flow: FlowDefinition): string | null {
  const selfieEntry = getMutableStepEntries(flow).find(([, step]) => step.verification === "selfie");
  return selfieEntry?.[0] ?? null;
}

function pickPreferredTerminal(flow: FlowDefinition, preferredNormalizedIds: string[]): string | null {
  for (const preferred of preferredNormalizedIds) {
    const terminalId = Object.keys(flow.terminals).find((id) => normalizeTargetId(id) === preferred);
    if (terminalId) return terminalId;
  }
  return Object.keys(flow.terminals)[0] ?? null;
}

function addSelfieStep(flow: FlowDefinition, sourceStepHint: string): FlowChatResponse {
  const anchorEntry = findStepEntryByHint(flow, sourceStepHint);
  if (!anchorEntry) {
    return { message: `I couldn't find a step matching "${sourceStepHint}".`, yaml: null };
  }

  const [anchorStepId, anchorStep] = anchorEntry;
  if (typeof anchorStep.on_pass !== "string") {
    return { message: `I couldn't add selfie after ${anchorStepId} because on_pass uses a branch.`, yaml: null };
  }

  const existingSelfieStepId = findSelfieStepId(flow);
  if (existingSelfieStepId) {
    if (normalizeTargetId(anchorStep.on_pass) === normalizeTargetId(existingSelfieStepId)) {
      return { message: `${anchorStepId} already routes pass to ${existingSelfieStepId}.`, yaml: null };
    }

    const targetReferenceCounts = collectTargetReferenceCounts(flow);
    if ((targetReferenceCounts.get(normalizeTargetId(anchorStep.on_pass)) ?? 0) <= 1) {
      const targetKind = isTerminalTarget(flow, anchorStep.on_pass) ? "terminal" : "step";
      return {
        message: `I couldn't apply this change because ${targetKind} ${normalizeTargetId(anchorStep.on_pass)} would become unreachable from start.`,
        yaml: null,
      };
    }

    anchorStep.on_pass = existingSelfieStepId;
    return toValidatedFlowYamlResponse(
      flow,
      `Updated ${anchorStepId} so pass now routes to ${existingSelfieStepId}.`,
    );
  }

  const previousPassTarget = anchorStep.on_pass;
  const fallbackFailTarget = pickPreferredTerminal(flow, ["needs_review", "decline", "declined"]) ?? previousPassTarget;
  let selfieStepId = "selfie";
  let suffix = 2;
  while (flow.steps[selfieStepId]) {
    selfieStepId = `selfie_${suffix}`;
    suffix += 1;
  }

  anchorStep.on_pass = selfieStepId;
  const selfieStep: FlowStep = {
    type: "verification",
    verification: "selfie",
    required: true,
    on_pass: previousPassTarget,
    on_fail: fallbackFailTarget,
    retry: { max: 2 },
  };
  flow.steps = insertStepAfter(flow.steps, anchorStepId, selfieStepId, selfieStep);

  return toValidatedFlowYamlResponse(flow, `Added a ${selfieStepId} verification step.`);
}

function addEsToCountryCondition(when: string): { updatedWhen: string; changed: boolean } {
  const countryPattern = /country\s+in\s+\[([^\]]+)\]/i;
  const match = when.match(countryPattern);
  if (!match) return { updatedWhen: when, changed: false };

  const countries = match[1]
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
  const hasEs = countries.some((code) => code.toUpperCase() === "ES");
  if (hasEs) return { updatedWhen: when, changed: false };

  const nextCountries = [...countries, "ES"];
  return {
    updatedWhen: when.replace(countryPattern, `country in [${nextCountries.join(", ")}]`),
    changed: true,
  };
}

function updateCountryBranchTarget(target: FlowTarget): boolean {
  if (typeof target === "string") return false;

  let changed = false;
  for (const condition of target.branch) {
    if (!condition.when) continue;
    const result = addEsToCountryCondition(condition.when);
    if (result.changed) {
      condition.when = result.updatedWhen;
      changed = true;
    }
  }
  return changed;
}

function updateCountryBranchWithEs(flow: FlowDefinition, sourceStepHint?: string): FlowChatResponse {
  const mutableSteps = getMutableStepEntries(flow);
  const sortedSteps = sourceStepHint
    ? [
      ...mutableSteps.filter(([stepId]) => includesStepReference(sourceStepHint, stepId)),
      ...mutableSteps.filter(([stepId]) => !includesStepReference(sourceStepHint, stepId)),
    ]
    : mutableSteps;

  for (const [stepId, step] of sortedSteps) {
    const passUpdated = updateCountryBranchTarget(step.on_pass);
    const failUpdated = updateCountryBranchTarget(step.on_fail);
    if (passUpdated || failUpdated) {
      return toValidatedFlowYamlResponse(flow, `Updated country branch in ${stepId} to include ES.`);
    }
  }

  return { message: "I couldn't find a country branch condition to update.", yaml: null };
}

function includesStepReference(message: string, stepId: string): boolean {
  return message.includes(stepId) || message.includes(stepId.replaceAll("_", " "));
}

function mockResponse(userMessage: string, currentYaml: string): { message: string; yaml: string | null } {
  const msg = normalizePrompt(userMessage);
  const parseCurrentFlow = (): FlowDefinition | null => {
    try {
      return parseFlowYaml(currentYaml);
    } catch {
      return null;
    }
  };

  const routeFailuresMatch = msg.match(/route failures? from (.+?) to ([a-z0-9_]+)/);
  if (routeFailuresMatch) {
    const flow = parseCurrentFlow();
    if (!flow) return { message: "I couldn't parse the current YAML flow.", yaml: null };
    return routeStepTarget(flow, routeFailuresMatch[1].trim(), routeFailuresMatch[2], "on_fail");
  }

  const routePassMatch = msg.match(/route pass(?:es)? from (.+?) to ([a-z0-9_]+)/);
  if (routePassMatch) {
    const flow = parseCurrentFlow();
    if (!flow) return { message: "I couldn't parse the current YAML flow.", yaml: null };
    return routeStepTarget(flow, routePassMatch[1].trim(), routePassMatch[2], "on_pass");
  }

  if (msg.includes("selfie") && (msg.includes("add") || msg.includes("добавь"))) {
    const flow = parseCurrentFlow();
    if (!flow) return { message: "I couldn't parse the current YAML flow.", yaml: null };
    const afterMatch = msg.match(/after (.+)$/);
    const sourceStepHint = afterMatch?.[1]?.trim() || getFirstStepId(flow);
    if (!sourceStepHint) {
      return { message: "I couldn't find a step to attach selfie to.", yaml: null };
    }
    return addSelfieStep(flow, sourceStepHint);
  }

  if (msg.includes("retry")) {
    const flow = parseCurrentFlow();
    if (!flow) return { message: "I couldn't parse the current YAML flow.", yaml: null };

    const maxMatch = msg.match(/\b(\d+)\b/);
    const max = maxMatch ? Number(maxMatch[1]) : 3;
    const targetStepEntry = getMutableStepEntries(flow).find(([stepId]) => includesStepReference(msg, stepId))
      ?? getMutableStepEntries(flow)[0];

    if (!targetStepEntry) {
      return { message: "I couldn't find a step to update retry settings.", yaml: null };
    }

    const [targetStepId, targetStep] = targetStepEntry;
    targetStep.retry = { max };
    return toValidatedFlowYamlResponse(flow, `Set retry.max to ${max} for ${targetStepId}.`);
  }

  if (msg.includes("country") || msg.includes("spain") || /\bes\b/.test(msg)) {
    const flow = parseCurrentFlow();
    if (!flow) return { message: "I couldn't parse the current YAML flow.", yaml: null };
    const sourceStepHint = Object.keys(flow.steps).find((stepId) => includesStepReference(msg, stepId));
    return updateCountryBranchWithEs(flow, sourceStepHint);
  }

  if (msg.includes("branch") || msg.includes("condition") || msg.includes("ветвление") || msg.includes("условие")) {
    return {
      message: "To add branching, modify the on_pass or on_fail to use a branch structure with conditions. (AI model required for complex modifications — set GROQ_API_KEY in Settings or .env.local)",
      yaml: null,
    };
  }

  return {
    message: "I can help modify the flow. Set GROQ_API_KEY in Settings or .env.local for full AI capabilities. In mock mode, try: \"Add a selfie step\".",
    yaml: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, currentYaml, schema } = body;
    const provider = body.provider ?? FLOW_CHAT_DEFAULT_PROVIDER;
    const apiKeyFromBody = normalizeOptionalValue(body.apiKey);
    const modelFromBody = normalizeOptionalValue(body.model);

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const deterministicPromptSet = getDeterministicPromptSet(currentYaml);
    // Keep generated example prompts deterministic to avoid model variance for quick testing.
    if (deterministicPromptSet.has(normalizePrompt(message))) {
      return NextResponse.json(mockResponse(message, currentYaml));
    }

    let result: FlowChatResponse | null = null;

    try {
      if (provider === "groq") {
        if (apiKeyFromBody) {
          result = await callGroqWithKey(
            message,
            currentYaml,
            schema,
            apiKeyFromBody,
            modelFromBody ?? FLOW_CHAT_GROQ_DEFAULT_MODEL,
          );
        } else if (process.env.GROQ_API_KEY) {
          result = await callGroq(message, currentYaml, schema);
        } else {
          result = mockResponse(message, currentYaml);
        }
      } else if (provider === "gemini") {
        if (apiKeyFromBody) {
          result = await callGeminiWithKey(
            message,
            currentYaml,
            schema,
            apiKeyFromBody,
            modelFromBody ?? FLOW_CHAT_GEMINI_DEFAULT_MODEL,
          );
        } else if (process.env.GEMINI_API_KEY) {
          result = await callGemini(message, currentYaml, schema);
        } else {
          result = mockResponse(message, currentYaml);
        }
      } else {
        result = mockResponse(message, currentYaml);
      }
    } catch (err) {
      if (err instanceof AiProviderApiError) {
        const reason =
          err.status === 429
            ? `${err.provider} quota exceeded for this API key/project`
            : err.status === 401 || err.status === 403
              ? `${err.provider} API key is not authorized`
              : `${err.provider} request failed with status ${err.status}`;
        result = toMockFallbackResponse(message, currentYaml, reason);
      } else if (err instanceof Error && err.message === "NO_API_KEY") {
        result = mockResponse(message, currentYaml);
      } else {
        throw err;
      }
    }

    return NextResponse.json(ensureValidSuggestedYaml(result ?? mockResponse(message, currentYaml)));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
