import type { CheckCategory, CheckLifecycle } from "@/lib/types";

export const CHECK_CATEGORY_LABELS: Record<CheckCategory, string> = {
  fraud: "Fraud",
  user_action_required: "User Action Required",
};

export const BIOMETRIC_DESCRIPTION = "Biometric processing is required to use this feature. We recommend consulting with your legal team and compliance advisors to ensure that your business meets the proper requirements to process this biometric data.";

export const CHECK_CATEGORY_COLORS: Record<CheckCategory, string> = {
  fraud: "danger",
  user_action_required: "caution",
};

export const CHECK_CATEGORY_DESCRIPTIONS: Record<CheckCategory, string> = {
  fraud: "Fraud",
  user_action_required: "User Action Required",
};

export const CHECK_LIFECYCLE_HINTS: Record<Exclude<CheckLifecycle, "ga">, string> = {
  beta: "Available to the public, but may be constantly tuned with different thresholds. Geographic coverage may also be limited.",
  sunset: "Deprecated in favor of other checks.",
};
