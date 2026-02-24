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
  beta: "This feature is in beta. Please don't rely on it for critical checks or automation. Manual review is suggested. Please share your feedback with us.",
  sunset: "This feature is being sunset. Please reach out to support for more info and alternatives.",
};
