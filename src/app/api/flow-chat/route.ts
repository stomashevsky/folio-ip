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
