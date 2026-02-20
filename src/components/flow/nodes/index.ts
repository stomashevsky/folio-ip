import { BranchNode } from "./BranchNode";
import { ReviewNode } from "./ReviewNode";
import { StartNode } from "./StartNode";
import { TerminalNode } from "./TerminalNode";
import { VerificationNode } from "./VerificationNode";
import { WfTriggerNode } from "./WfTriggerNode";
import { WfActionNode } from "./WfActionNode";
import { WfConditionalNode } from "./WfConditionalNode";
import { WfParallelNode } from "./WfParallelNode";
import { WfWaitNode } from "./WfWaitNode";
import { WfOutputNode } from "./WfOutputNode";

export { StartNode };
export { VerificationNode };
export { ReviewNode };
export { TerminalNode };
export { BranchNode };

export const nodeTypes = {
  start: StartNode,
  verification: VerificationNode,
  review: ReviewNode,
  terminal: TerminalNode,
  branch: BranchNode,
  wf_trigger: WfTriggerNode,
  wf_action: WfActionNode,
  wf_conditional: WfConditionalNode,
  wf_parallel: WfParallelNode,
  wf_wait: WfWaitNode,
  wf_output: WfOutputNode,
};
