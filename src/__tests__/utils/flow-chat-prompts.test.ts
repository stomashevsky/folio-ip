import { describe, expect, it } from "vitest";

import { FLOW_TEMPLATES } from "@/lib/constants/flow-templates";
import { getFlowChatExamplePromptsFromYaml } from "@/lib/utils/flow-chat-prompts";

const FLOW_WITH_SINGLE_DECLINE_REFERENCE = `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: selfie
    on_fail: decline
    retry:
      max: 3

  selfie:
    type: verification
    verification: selfie
    required: true
    on_pass: approve
    on_fail: needs_review
    retry:
      max: 2

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`;

const FLOW_WITH_MULTIPLE_DECLINE_REFERENCES = `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: database_check
    on_fail: decline
    retry:
      max: 2

  database_check:
    type: verification
    verification: database
    required: true
    on_pass: approve
    on_fail: decline
    retry:
      max: 1

terminals:
  approve:
    status: approved
  decline:
    status: declined
  needs_review:
    status: needs_review`;

describe("getFlowChatExamplePromptsFromYaml", () => {
  it("does not suggest rerouting failures when it would orphan a terminal", () => {
    const prompts = getFlowChatExamplePromptsFromYaml(FLOW_WITH_SINGLE_DECLINE_REFERENCE);
    expect(prompts.some((prompt) => prompt.startsWith("Route failures from"))).toBe(false);
  });

  it("can suggest rerouting failures when old terminal remains referenced", () => {
    const prompts = getFlowChatExamplePromptsFromYaml(FLOW_WITH_MULTIPLE_DECLINE_REFERENCES);
    expect(prompts).toContain("Route failures from government id to needs_review");
  });

  it("returns no prompts for invalid yaml", () => {
    expect(getFlowChatExamplePromptsFromYaml("start: [")).toEqual([]);
  });

  it("does not generate orphaning reroute prompt for govid+selfie template", () => {
    const templateYaml = FLOW_TEMPLATES.itmpl_kkVEMjLsjv5g3YhSDjzqb44Ac5Fe;
    const prompts = getFlowChatExamplePromptsFromYaml(templateYaml);
    expect(prompts).not.toContain("Route failures from government id to needs_review");
  });

  it("does not suggest route-pass prompt when it would orphan an intermediate step", () => {
    const templateYaml = FLOW_TEMPLATES.itmpl_3dFgH8jKlMn5oPqRsTuVwXyZ1a2B;
    const prompts = getFlowChatExamplePromptsFromYaml(templateYaml);
    expect(prompts).not.toContain("Route pass from government id to selfie");
  });
});
