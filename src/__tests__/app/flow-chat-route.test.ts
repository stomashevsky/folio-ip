import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/flow-chat/route";
import { FLOW_TEMPLATES } from "@/lib/constants/flow-templates";
import { parseFlowYaml, validateFlow } from "@/lib/utils/flow-parser";
import { getFlowChatExamplePromptsFromYaml } from "@/lib/utils/flow-chat-prompts";

const FLOW_DSL_SCHEMA = "schema";

async function sendPrompt(message: string, currentYaml: string) {
  const request = new NextRequest("http://localhost/api/flow-chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      currentYaml,
      schema: FLOW_DSL_SCHEMA,
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await POST(request);
  expect(response.status).toBe(200);
  return response.json() as Promise<{ message: string; yaml: string | null }>;
}

describe("flow-chat deterministic examples", () => {
  it("every generated example prompt is actionable and keeps YAML valid", async () => {
    for (const [templateId, yaml] of Object.entries(FLOW_TEMPLATES)) {
      const prompts = getFlowChatExamplePromptsFromYaml(yaml);
      for (const prompt of prompts) {
        const result = await sendPrompt(prompt, yaml);
        expect(result.yaml, `Template ${templateId} prompt "${prompt}" should return YAML`).toBeTruthy();
        const nextYaml = result.yaml as string;
        const parsed = parseFlowYaml(nextYaml);
        expect(validateFlow(parsed), `Template ${templateId} prompt "${prompt}" should remain valid`).toEqual([]);
      }
    }
  });
});
