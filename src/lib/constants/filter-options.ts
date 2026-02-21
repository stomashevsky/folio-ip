// Filter option arrays for Select components across the app.
// Organized by entity type for easy discovery and reuse.

// Inquiry filter options

export const INQUIRY_STATUS_OPTIONS = [
  { value: "created", label: "Created" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "needs_review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "expired", label: "Expired" },
  { value: "declined", label: "Declined" },
];

export const INQUIRY_TEMPLATE_OPTIONS = [
  { value: "KYC + AML: GovID + Selfie", label: "KYC + AML: GovID + Selfie" },
  { value: "KYC: GovID Only", label: "KYC: GovID Only" },
];

// TAG_OPTIONS is dynamic (derived from mock data), so it's not included here
// It's generated in the page component using: Array.from(new Set(...)).map(...)

// Verification filter options

export const VERIFICATION_STATUS_OPTIONS = [
  { value: "initiated", label: "Initiated" },
  { value: "submitted", label: "Submitted" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "requires_retry", label: "Requires Retry" },
  { value: "canceled", label: "Canceled" },
];

export const VERIFICATION_TYPE_OPTIONS = [
  { value: "government_id", label: "Government ID" },
  { value: "selfie", label: "Selfie" },
  { value: "database", label: "Database" },
  { value: "document", label: "Document" },
  { value: "aamva", label: "AAMVA" },
  { value: "database_phone_carrier", label: "Database Phone Carrier" },
  { value: "database_ssn", label: "Database (SSN)" },
  { value: "email_address", label: "Email Address" },
  { value: "phone_number", label: "Phone Number" },
  { value: "health_insurance_card", label: "Health Insurance Card" },
  { value: "vehicle_insurance", label: "Vehicle Insurance" },
];

// Report filter options

export const REPORT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "ready", label: "Ready" },
  { value: "no_matches", label: "No Matches" },
  { value: "match", label: "Match" },
];

// REPORT_TYPE_OPTIONS is derived from REPORT_TYPE_LABELS in the page component
// It's generated using: Object.entries(REPORT_TYPE_LABELS).map(...)

export const REPORT_CREATED_BY_OPTIONS = [
  { value: "workflow", label: "Workflow" },
  { value: "manual", label: "Manual" },
  { value: "api", label: "API" },
];

// Account filter options

export const ACCOUNT_STATUS_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "closed", label: "Closed" },
];

// Check filter options (verification detail page)

export const CHECK_TYPE_OPTIONS = [
  { value: "fraud", label: "Fraud" },
  { value: "user_action_required", label: "User action required" },
  { value: "validity", label: "Validity" },
  { value: "biometrics", label: "Biometrics" },
];

export const CHECK_REQUIREMENT_OPTIONS = [
  { value: "required", label: "Required" },
  { value: "optional", label: "Optional" },
];

// Workflow filter options

export const WORKFLOW_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
  { value: "disabled", label: "Disabled" },
];

export const WORKFLOW_TRIGGER_OPTIONS = [
  { value: "inquiry.completed", label: "Inquiry completed" },
  { value: "inquiry.created", label: "Inquiry created" },
  { value: "verification.passed", label: "Verification passed" },
  { value: "verification.failed", label: "Verification failed" },
  { value: "report.ready", label: "Report ready" },
  { value: "account.created", label: "Account created" },
  { value: "manual", label: "Manual" },
];

export const WORKFLOW_RUN_STATUS_OPTIONS = [
  { value: "completed", label: "Completed" },
  { value: "running", label: "Running" },
  { value: "failed", label: "Failed" },
  { value: "canceled", label: "Canceled" },
];

// Transaction filter options

export const TRANSACTION_STATUS_OPTIONS = [
  { value: "created", label: "Created" },
  { value: "needs_review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

export const TRANSACTION_TYPE_OPTIONS = [
  { value: "payment", label: "Payment" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "transfer", label: "Transfer" },
  { value: "deposit", label: "Deposit" },
  { value: "refund", label: "Refund" },
];

// Case filter options

export const CASE_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_review", label: "In Review" },
  { value: "resolved", label: "Resolved" },
  { value: "escalated", label: "Escalated" },
  { value: "closed", label: "Closed" },
];

export const CASE_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const CASE_QUEUE_OPTIONS = [
  { value: "Fraud Review", label: "Fraud Review" },
  { value: "AML Compliance", label: "AML Compliance" },
  { value: "Document Verification", label: "Document Verification" },
  { value: "General", label: "General" },
];

// Template filter options

export const TEMPLATE_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
  { value: "disabled", label: "Disabled" },
];

// Analytics filter options

export const ANALYTICS_COUNTRY_OPTIONS = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "AU", label: "Australia" },
  { value: "JP", label: "Japan" },
  { value: "BR", label: "Brazil" },
  { value: "IN", label: "India" },
  { value: "MX", label: "Mexico" },
];

export const ANALYTICS_PLATFORM_OPTIONS = [
  { value: "web_sdk", label: "Web SDK" },
  { value: "ios_sdk", label: "iOS SDK" },
  { value: "android_sdk", label: "Android SDK" },
  { value: "api", label: "API" },
];

export const ANALYTICS_DEVICE_OPTIONS = [
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
  { value: "tablet", label: "Tablet" },
];

export const ANALYTICS_TAG_OPTIONS = [
  { value: "vip", label: "VIP" },
  { value: "high-risk", label: "High Risk" },
  { value: "manual-review", label: "Manual Review" },
  { value: "expedited", label: "Expedited" },
  { value: "re-verification", label: "Re-verification" },
];

export const ANALYTICS_FUNNEL_TEMPLATE_OPTIONS = [
  { value: "database_name_birthdate_address", label: "Database (name, birthdate, address)" },
  { value: "gov_id_autoclassification_selfie", label: "Government ID (with autoclassification) and Selfie" },
  { value: "gov_id_document_proof_address", label: "Government ID and Document Proof of Address" },
  { value: "gov_id_selfie_document_proof", label: "Government ID, Selfie and Document Proof of Address" },
];

export const ANALYTICS_FUNNEL_METRIC_OPTIONS = [
  { value: "overall", label: "Overall" },
  { value: "per_step", label: "Per Step" },
];

export const ANALYTICS_TEMPLATE_VERSION_OPTIONS = [
  { value: "v5", label: "Version 5 — Feb 18, 2026" },
  { value: "v4", label: "Version 4 — Feb 3, 2026" },
  { value: "v3", label: "Version 3 — Jan 15, 2026" },
  { value: "v2", label: "Version 2 — Jan 5, 2026" },
  { value: "v1", label: "Version 1 — Dec 12, 2025" },
];

// Analytics interval options

export const ANALYTICS_INTERVAL_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

// ANALYTICS_FUNNEL_METRIC_OPTIONS has description JSX, so it's defined in the page component
// It's generated using: [{ value: "counts", label: "Counts", description: <OptionDesc>...</OptionDesc> }, ...]
