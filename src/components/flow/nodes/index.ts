import { BranchNode } from "./BranchNode";
import { ReviewNode } from "./ReviewNode";
import { StartNode } from "./StartNode";
import { TerminalNode } from "./TerminalNode";
import { VerificationNode } from "./VerificationNode";

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
};
