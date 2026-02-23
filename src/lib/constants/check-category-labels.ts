import type { CheckCategory, CheckLifecycle } from "@/lib/types";

export const CHECK_CATEGORY_LABELS: Record<CheckCategory, string> = {
  fraud: "Fraud",
  user_action_required: "User Action Required",
};

export const CHECK_CATEGORY_COLORS: Record<CheckCategory, string> = {
  fraud: "danger",
  user_action_required: "caution",
};

export const CHECK_CATEGORY_DESCRIPTIONS: Record<CheckCategory, string> = {
  fraud: "The individual may be trying to verify with false or altered information. For instance, if the face portrait from the ID doesn't match the face from the selfie.",
  user_action_required: "The individual did not submit the minimum high-quality and unobstructed images needed for verification. These checks are surfaced as hints to help individuals submit better images.",
};

export const CHECK_LIFECYCLE_HINTS: Record<Exclude<CheckLifecycle, "ga">, string> = {
  beta: "Available to the public, but may be constantly tuned with different thresholds. Geographic coverage may also be limited.",
  sunset: "Deprecated in favor of other checks.",
};
