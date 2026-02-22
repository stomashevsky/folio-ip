import type { CheckCategory } from "@/lib/types";

export const CHECK_CATEGORY_LABELS: Record<CheckCategory, string> = {
  fraud: "Fraud",
  user_action_required: "User behavior",
};

export const CHECK_CATEGORY_DESCRIPTIONS: Record<CheckCategory, string> = {
  fraud: "Detects forgery, tampering, and other fraudulent manipulation of documents or identity",
  user_action_required: "Checks that depend on input quality — photo clarity, glare, blur, or missing information",
};
