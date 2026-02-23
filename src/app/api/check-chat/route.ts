import { NextRequest, NextResponse } from "next/server";
import {
  FLOW_CHAT_DEFAULT_PROVIDER,
  FLOW_CHAT_GEMINI_DEFAULT_MODEL,
  FLOW_CHAT_GROQ_BASE_URL,
  FLOW_CHAT_GROQ_DEFAULT_MODEL,
  FLOW_CHAT_MAX_OUTPUT_TOKENS,
  FLOW_CHAT_TEMPERATURE,
} from "@/lib/constants";
import type { FlowChatProvider } from "@/lib/constants";
import type { AttributeMatchRequirement } from "@/lib/types";

const SYSTEM_PROMPT = `You are a verification check match-requirements editor assistant.

RULES:
1. Always respond with valid JSON for an array of match requirement objects.
2. Each array item must include: attribute, normalization, comparison.
3. comparison must be either { type: "simple", matchLevel } or { type: "complex", conditions }.
4. Only output the modified JSON in a \`\`\`json code block.
5. Before the JSON, write a brief 1-sentence explanation of what changed.
6. Preserve existing requirements unless the user explicitly asks to remove them.
7. Keep output deterministic and cleanly formatted.`;

interface RequestBody {
  message: string;
  currentJson: string;
  schema: string;
  provider?: FlowChatProvider;
  apiKey?: string;
  model?: string;
}

interface CheckChatResponse {
  message: string;
  json: string | null;
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

function extractJsonFromResponse(text: string): string | null {
  const jsonMatch = text.match(/```json\n([\s\S]*?)```/i);
  if (jsonMatch?.[1]) return jsonMatch[1].trim();

  const codeMatch = text.match(/```\n([\s\S]*?)```/);
  if (codeMatch?.[1]) return codeMatch[1].trim();

  return null;
}

function extractMessageFromResponse(text: string): string {
  const beforeJson = text.split("```")[0]?.trim();
  return beforeJson || "Match requirements updated.";
}

function isRequirementShape(value: unknown): value is AttributeMatchRequirement {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (typeof record.attribute !== "string") return false;
  if (!Array.isArray(record.normalization)) return false;
  if (!record.comparison || typeof record.comparison !== "object") return false;
  return true;
}

function isValidRequirementsArray(value: unknown): value is AttributeMatchRequirement[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => isRequirementShape(item));
}

function ensureValidSuggestedJson(result: CheckChatResponse): CheckChatResponse {
  if (!result.json) return result;

  try {
    const parsed = JSON.parse(result.json) as unknown;
    if (!isValidRequirementsArray(parsed)) {
      return {
        message: `${result.message} I generated invalid JSON (must be an array of requirements with attribute, normalization, and comparison). Please retry or rephrase.`,
        json: null,
      };
    }
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    return {
      message: `${result.message} I generated invalid JSON (${message}). Please retry or rephrase.`,
      json: null,
    };
  }
}

function parseCurrentRequirements(currentJson: string): AttributeMatchRequirement[] {
  try {
    const parsed = JSON.parse(currentJson) as unknown;
    if (isValidRequirementsArray(parsed)) return parsed;
  } catch {}
  return [];
}

function upsertRequirement(
  requirements: AttributeMatchRequirement[],
  nextRequirement: AttributeMatchRequirement,
): AttributeMatchRequirement[] {
  const index = requirements.findIndex((item) => item.attribute === nextRequirement.attribute);
  if (index < 0) return [...requirements, nextRequirement];
  const copy = [...requirements];
  copy[index] = nextRequirement;
  return copy;
}

function toJsonResult(requirements: AttributeMatchRequirement[]): string {
  return JSON.stringify(requirements, null, 2);
}

function mockResponse(userMessage: string, currentJson: string): CheckChatResponse {
  const msg = normalizePrompt(userMessage);
  let requirements = parseCurrentRequirements(currentJson);

  if (msg.includes("name") && msg.includes("85")) {
    requirements = upsertRequirement(requirements, {
      attribute: "name_first",
      normalization: [{ step: "apply", method: "fold_characters" }],
      comparison: {
        type: "complex",
        conditions: [{ method: "string_similarity", matchLevel: "full", threshold: 85 }],
      },
    });
    requirements = upsertRequirement(requirements, {
      attribute: "name_last",
      normalization: [{ step: "apply", method: "fold_characters" }],
      comparison: {
        type: "complex",
        conditions: [{ method: "string_similarity", matchLevel: "full", threshold: 85 }],
      },
    });
    return {
      message: "Added 85% similarity matching for first and last name.",
      json: toJsonResult(requirements),
    };
  }

  if (msg.includes("address") || msg.includes("street")) {
    requirements = upsertRequirement(requirements, {
      attribute: "address_street",
      normalization: [
        { step: "apply", method: "expand_street_suffix" },
        { step: "then", method: "expand_street_unit" },
        { step: "then", method: "fold_characters" },
      ],
      comparison: {
        type: "complex",
        conditions: [{ method: "string_similarity", matchLevel: "full", threshold: 80 }],
      },
    });
    return {
      message: "Added address street comparison with normalization.",
      json: toJsonResult(requirements),
    };
  }

  if (msg.includes("birthdate") && (msg.includes("exact") || msg.includes("simple"))) {
    requirements = upsertRequirement(requirements, {
      attribute: "birthdate",
      normalization: [],
      comparison: { type: "simple", matchLevel: "full" },
    });
    return {
      message: "Set birthdate to exact matching.",
      json: toJsonResult(requirements),
    };
  }

  if (msg.includes("standard") && msg.includes("kyc")) {
    requirements = [
      {
        attribute: "name_first",
        normalization: [
          { step: "apply", method: "remove_prefixes" },
          { step: "then", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [
            { method: "string_similarity", matchLevel: "full", threshold: 85 },
            { method: "nickname", matchLevel: "full" },
          ],
        },
      },
      {
        attribute: "name_last",
        normalization: [
          { step: "apply", method: "remove_prefixes" },
          { step: "then", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [{ method: "string_similarity", matchLevel: "full", threshold: 85 }],
        },
      },
      {
        attribute: "birthdate",
        normalization: [],
        comparison: {
          type: "complex",
          conditions: [{ method: "date_similarity", matchLevel: "full", threshold: 2 }],
        },
      },
      {
        attribute: "address_street",
        normalization: [
          { step: "apply", method: "expand_street_suffix" },
          { step: "then", method: "expand_street_unit" },
          { step: "then", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [{ method: "string_similarity", matchLevel: "full", threshold: 80 }],
        },
      },
      {
        attribute: "address_city",
        normalization: [
          { step: "apply", method: "expand_city_abbreviation" },
          { step: "then", method: "fold_characters" },
        ],
        comparison: {
          type: "complex",
          conditions: [{ method: "string_similarity", matchLevel: "full", threshold: 90 }],
        },
      },
    ];
    return {
      message: "Replaced requirements with a standard KYC baseline set.",
      json: toJsonResult(requirements),
    };
  }

  return {
    message: "I can update match requirements. Try one of: add 85% name similarity, add address normalization, make birthdate exact, or add standard KYC fields.",
    json: null,
  };
}

async function callGemini(userMessage: string, currentJson: string, schema: string): Promise<CheckChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("NO_API_KEY");
  const model = process.env.GEMINI_MODEL?.trim() || FLOW_CHAT_GEMINI_DEFAULT_MODEL;
  return callGeminiWithKey(userMessage, currentJson, schema, apiKey, model);
}

async function callGeminiWithKey(
  userMessage: string,
  currentJson: string,
  schema: string,
  apiKey: string,
  model: string,
): Promise<CheckChatResponse> {
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
                text: `${SYSTEM_PROMPT}\n\n${schema}\n\nCurrent match requirements:\n\`\`\`json\n${currentJson}\n\`\`\`\n\nUser request: ${userMessage}`,
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
    json: extractJsonFromResponse(text),
  };
}

async function callGroq(userMessage: string, currentJson: string, schema: string): Promise<CheckChatResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("NO_API_KEY");
  const model = process.env.GROQ_MODEL?.trim() || FLOW_CHAT_GROQ_DEFAULT_MODEL;
  return callGroqWithKey(userMessage, currentJson, schema, apiKey, model);
}

async function callGroqWithKey(
  userMessage: string,
  currentJson: string,
  schema: string,
  apiKey: string,
  model: string,
): Promise<CheckChatResponse> {
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
          content: `${schema}\n\nCurrent match requirements:\n\`\`\`json\n${currentJson}\n\`\`\`\n\nUser request: ${userMessage}`,
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
    json: extractJsonFromResponse(text),
  };
}

function normalizeOptionalValue(value?: string): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;
  return normalized;
}

function toMockFallbackResponse(userMessage: string, currentJson: string, reason: string): CheckChatResponse {
  const fallback = mockResponse(userMessage, currentJson);
  return {
    message: `AI provider is unavailable (${reason}). Switched to mock mode. ${fallback.message}`,
    json: fallback.json,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, currentJson, schema } = body;
    const provider = body.provider ?? FLOW_CHAT_DEFAULT_PROVIDER;
    const apiKeyFromBody = normalizeOptionalValue(body.apiKey);
    const modelFromBody = normalizeOptionalValue(body.model);

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let result: CheckChatResponse | null = null;

    try {
      if (provider === "groq") {
        if (apiKeyFromBody) {
          result = await callGroqWithKey(
            message,
            currentJson,
            schema,
            apiKeyFromBody,
            modelFromBody ?? FLOW_CHAT_GROQ_DEFAULT_MODEL,
          );
        } else if (process.env.GROQ_API_KEY) {
          result = await callGroq(message, currentJson, schema);
        } else {
          result = mockResponse(message, currentJson);
        }
      } else if (provider === "gemini") {
        if (apiKeyFromBody) {
          result = await callGeminiWithKey(
            message,
            currentJson,
            schema,
            apiKeyFromBody,
            modelFromBody ?? FLOW_CHAT_GEMINI_DEFAULT_MODEL,
          );
        } else if (process.env.GEMINI_API_KEY) {
          result = await callGemini(message, currentJson, schema);
        } else {
          result = mockResponse(message, currentJson);
        }
      } else {
        result = mockResponse(message, currentJson);
      }
    } catch (err) {
      if (err instanceof AiProviderApiError) {
        const reason =
          err.status === 429
            ? `${err.provider} quota exceeded for this API key/project`
            : err.status === 401 || err.status === 403
              ? `${err.provider} API key is not authorized`
              : `${err.provider} request failed with status ${err.status}`;
        result = toMockFallbackResponse(message, currentJson, reason);
      } else if (err instanceof Error && err.message === "NO_API_KEY") {
        result = mockResponse(message, currentJson);
      } else {
        throw err;
      }
    }

    return NextResponse.json(ensureValidSuggestedJson(result ?? mockResponse(message, currentJson)));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
