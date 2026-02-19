import { describe, expect, it } from "vitest";

import { FLOW_TEMPLATES } from "@/lib/constants/flow-templates";
import { parseFlowYaml, validateFlow } from "@/lib/utils/flow-parser";

const FLOW_WITH_ORPHAN_TERMINAL = `start: government_id

steps:
  government_id:
    type: verification
    verification: government_id
    required: true
    on_pass: approve
    on_fail: approve

terminals:
  approve:
    status: approved
  decline:
    status: declined`;

describe("validateFlow", () => {
  it("keeps all built-in templates valid", () => {
    for (const [templateId, yaml] of Object.entries(FLOW_TEMPLATES)) {
      const parsed = parseFlowYaml(yaml);
      expect(validateFlow(parsed), `template ${templateId} should be valid`).toEqual([]);
    }
  });

  it("detects orphan terminals that are unreachable from start", () => {
    const parsed = parseFlowYaml(FLOW_WITH_ORPHAN_TERMINAL);
    const errors = validateFlow(parsed);
    expect(errors).toContain("orphan terminal is unreachable from start: decline");
  });
});
