import { NextRequest, NextResponse } from "next/server";
import {
  FLOW_CHAT_DEFAULT_PROVIDER,
  FLOW_CHAT_EXAMPLE_PROMPTS,
  FLOW_CHAT_GEMINI_DEFAULT_MODEL,
  FLOW_CHAT_GROQ_BASE_URL,
  FLOW_CHAT_GROQ_DEFAULT_MODEL,
  FLOW_CHAT_MAX_OUTPUT_TOKENS,
  FLOW_CHAT_TEMPERATURE,
} from "@/lib/constants";
import type { FlowChatProvider } from "@/lib/constants";

const SYSTEM_PROMPT = `You are a KYC flow editor assistant. You help modify inquiry template flows defined in YAML DSL.

RULES:
1. Always respond with valid YAML following the schema provided.
2. Only output the modified YAML in a \`\`\`yaml code block.
3. Before the YAML, write a brief 1-sentence explanation of what you changed.
4. Preserve existing steps unless explicitly asked to remove them.
5. Use only these verification types: government_id, selfie, database, document.
6. Terminal statuses must be: approved, declined, or needs_review.
7. Step IDs should be snake_case.
8. Keep the YAML clean and readable.`;

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

const FLOW_CHAT_EXAMPLE_PROMPT_SET = new Set(FLOW_CHAT_EXAMPLE_PROMPTS.map((prompt) => normalizePrompt(prompt)));

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

function getFirstStepId(currentYaml: string): string | null {
  const lines = currentYaml.split("\n");
  const stepsIndex = lines.findIndex((line) => line.trim() === "steps:");
  if (stepsIndex === -1) return null;

  for (let i = stepsIndex + 1; i < lines.length; i++) {
    const match = lines[i].match(/^\s{2}([a-zA-Z0-9_]+):\s*$/);
    if (match) return match[1];
    if (lines[i].trim() === "terminals:") break;
  }

  return null;
}

function findStepRange(lines: string[], stepId: string): { start: number; end: number } | null {
  const start = lines.findIndex((line) => new RegExp(`^\\s{2}${stepId}:\\s*$`).test(line));
  if (start === -1) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\s{2}[a-zA-Z0-9_]+:\s*$/.test(lines[i]) || lines[i].trim() === "terminals:") {
      end = i;
      break;
    }
  }

  return { start, end };
}

function updateRetryMax(currentYaml: string, stepId: string, max: number): string | null {
  const lines = currentYaml.split("\n");
  const range = findStepRange(lines, stepId);
  if (!range) return null;

  let retryIndex = -1;
  for (let i = range.start + 1; i < range.end; i++) {
    if (/^\s{4}retry:\s*$/.test(lines[i])) {
      retryIndex = i;
      break;
    }
  }

  if (retryIndex === -1) {
    lines.splice(range.end, 0, "    retry:", `      max: ${max}`);
    return lines.join("\n");
  }

  for (let i = retryIndex + 1; i < range.end; i++) {
    if (/^\s{6}max:\s*\d+\s*$/.test(lines[i])) {
      lines[i] = `      max: ${max}`;
      return lines.join("\n");
    }
    if (/^\s{4}[a-zA-Z0-9_]+:\s*$/.test(lines[i])) {
      break;
    }
  }

  lines.splice(retryIndex + 1, 0, `      max: ${max}`);
  return lines.join("\n");
}

function updateCountryBranchWithEs(currentYaml: string): string | null {
  const lines = currentYaml.split("\n");
  const countryLineIndex = lines.findIndex((line) => /country in \[[^\]]+\]/.test(line));
  if (countryLineIndex === -1) return null;

  const match = lines[countryLineIndex].match(/country in \[([^\]]+)\]/);
  if (!match) return null;

  const countries = match[1]
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
  if (!countries.includes("ES")) {
    countries.push("ES");
  }

  lines[countryLineIndex] = lines[countryLineIndex].replace(
    /country in \[[^\]]+\]/,
    `country in [${countries.join(", ")}]`,
  );

  let defaultIndex = -1;
  for (let i = countryLineIndex + 1; i < Math.min(lines.length, countryLineIndex + 12); i++) {
    if (/^\s*-\s*default:\s*[a-zA-Z0-9_]+\s*$/.test(lines[i])) {
      defaultIndex = i;
      break;
    }
    if (/^\s{2}[a-zA-Z0-9_]+:\s*$/.test(lines[i]) || lines[i].trim() === "terminals:") {
      break;
    }
  }

  if (defaultIndex !== -1) {
    const indent = lines[defaultIndex].match(/^(\s*)/)?.[1] ?? "";
    lines[defaultIndex] = `${indent}- default: manual_review`;
  } else {
    const itemIndent = lines[countryLineIndex].match(/^(\s*)-/)?.[1] ?? "        ";
    lines.splice(countryLineIndex + 1, 0, `${itemIndent}- default: manual_review`);
  }

  return lines.join("\n");
}

function includesStepReference(message: string, stepId: string): boolean {
  return message.includes(stepId) || message.includes(stepId.replaceAll("_", " "));
}

function mockResponse(userMessage: string, currentYaml: string): { message: string; yaml: string | null } {
  const msg = userMessage.toLowerCase();

  if (msg.includes("selfie") && (msg.includes("add") || msg.includes("добавь"))) {
    const lines = currentYaml.split("\n");
    const stepsIndex = lines.findIndex((l) => l.trim() === "steps:");
    if (stepsIndex === -1) return { message: "Could not find steps section.", yaml: null };

    let firstStepEnd = -1;
    let firstStepOnPass = "";
    for (let i = stepsIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s{2}\w/.test(line) && i > stepsIndex + 1) {
        firstStepEnd = i;
        break;
      }
      const passMatch = line.match(/on_pass:\s*(\w+)/);
      if (passMatch) firstStepOnPass = passMatch[1];
    }

    if (firstStepEnd === -1 || !firstStepOnPass) {
      return { message: "I'll add a selfie step. Please check the result.", yaml: null };
    }

    const selfieStep = [
      "  selfie:",
      "    type: verification",
      "    verification: selfie",
      "    required: true",
      `    on_pass: ${firstStepOnPass}`,
      "    on_fail: needs_review",
      "    retry:",
      "      max: 2",
    ];

    for (let i = stepsIndex + 1; i < firstStepEnd; i++) {
      if (lines[i].includes("on_pass:")) {
        lines[i] = lines[i].replace(/on_pass:\s*\w+/, "on_pass: selfie");
        break;
      }
    }

    lines.splice(firstStepEnd, 0, ...selfieStep);
    return { message: "Added a selfie verification step.", yaml: lines.join("\n") };
  }

  if (
    (msg.includes("country") || msg.includes("spain") || /\bes\b/.test(msg)) &&
    (msg.includes("branch") || includesStepReference(msg, "document_check"))
  ) {
    const updatedYaml = updateCountryBranchWithEs(currentYaml);
    if (!updatedYaml) {
      return { message: "I couldn't find a country branch condition to update.", yaml: null };
    }
    return {
      message: "Updated country branch to include ES and kept default fallback to manual_review.",
      yaml: updatedYaml,
    };
  }

  if (msg.includes("retry")) {
    const maxMatch = msg.match(/\b(\d+)\b/);
    const max = maxMatch ? Number(maxMatch[1]) : 3;
    const targetStepId = ["document_check", "database_check", "government_id", "selfie"].find((stepId) =>
      includesStepReference(msg, stepId)
    ) ?? getFirstStepId(currentYaml);

    if (!targetStepId) {
      return { message: "I couldn't find a step to update retry settings.", yaml: null };
    }

    const updatedYaml = updateRetryMax(currentYaml, targetStepId, max);
    if (!updatedYaml) {
      return { message: `I couldn't find step ${targetStepId}.`, yaml: null };
    }

    return {
      message: `Set retry.max to ${max} for ${targetStepId}.`,
      yaml: updatedYaml,
    };
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

    // Keep example prompts deterministic to avoid model variance for quick testing.
    if (FLOW_CHAT_EXAMPLE_PROMPT_SET.has(normalizePrompt(message))) {
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

    return NextResponse.json(result ?? mockResponse(message, currentYaml));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
