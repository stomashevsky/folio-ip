import type { CheckCategory, CheckLifecycle } from "@/lib/types";

export const CHECK_CATEGORY_LABELS: Record<CheckCategory, string> = {
  fraud: "Fraud",
  user_action_required: "Action required",
};

export const CHECK_CATEGORY_DESCRIPTIONS: Record<CheckCategory, string> = {
  fraud: "Detects forgery, tampering, and other fraudulent manipulation of documents or identity",
  user_action_required: "Checks that depend on submission quality — photo clarity, glare, blur, or missing information",
};

export const CHECK_LIFECYCLE_HINTS: Record<Exclude<CheckLifecycle, "ga">, string> = {
  beta: "Available to the public, but may be constantly tuned by Persona with different thresholds. Geographic coverage may also be limited.",
  sunset: "Deprecated in favor of other checks.",
};
