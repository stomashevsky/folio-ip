import { NextRequest, NextResponse } from "next/server";

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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return {
    message: extractMessageFromResponse(text),
    yaml: extractYamlFromResponse(text),
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
      message: "To add branching, modify the on_pass or on_fail to use a branch structure with conditions. (AI model required for complex modifications — set GEMINI_API_KEY)",
      yaml: null,
    };
  }

  return {
    message: "I can help modify the flow. Set GEMINI_API_KEY in .env.local for full AI capabilities. In mock mode, try: \"Add a selfie step\".",
    yaml: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, currentYaml, schema } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let result: { message: string; yaml: string | null };

    try {
      result = await callGemini(message, currentYaml, schema);
    } catch (err) {
      if (err instanceof Error && err.message === "NO_API_KEY") {
        result = mockResponse(message, currentYaml);
      } else {
        throw err;
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
