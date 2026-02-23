import type {
  InquiryTemplateStep,
  ReportType,
  VerificationType,
  VerificationCheckConfig,
  WorkflowTriggerType,
} from "@/lib/types";

// ─── Shared types ───

export interface TemplatePreset<T extends "inquiry" | "verification" | "report"> {
  id: string;
  name: string;
  description: string;
  icon: string;
  templateType: T;
  defaults: T extends "inquiry"
    ? InquiryPresetDefaults
    : T extends "verification"
      ? VerificationPresetDefaults
      : ReportPresetDefaults;
}

export interface InquiryPresetDefaults {
  name: string;
  description: string;
  steps: InquiryTemplateStep[];
  settings: {
    expiresInDays: number;
    redirectUrl?: string;
  };
}

export interface VerificationPresetDefaults {
  name: string;
  type: VerificationType;
  checks: VerificationCheckConfig[];
  settings: {
    allowedCountries: string[];
    maxRetries: number;
    captureMethod: "auto" | "manual" | "both";
  };
}

export interface ReportPresetDefaults {
  name: string;
  type: ReportType;
  screeningSources: string[];
  settings: {
    matchThreshold: number;
    continuousMonitoring: boolean;
    monitoringFrequencyDays: number;
    enableFuzzyMatch: boolean;
  };
}

// ─── Inquiry Template Presets ───
// Matches the 24 presets from the "Choose a template" dialog.

export const INQUIRY_TEMPLATE_PRESETS: TemplatePreset<"inquiry">[] = [
  {
    id: "inq_preset_aamva",
    name: "AAMVA",
    description: "Use this template as a starting point for AAMVA driver's license data verifications. Standalone AAMVA verifications are recommended for internal Cases use only.",
    icon: "🪪",
    templateType: "inquiry",
    defaults: {
      name: "AAMVA",
      description: "AAMVA driver's license data verification",
      steps: [
        { verificationType: "aamva", required: true, onPass: "approve", onFail: "decline", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_database",
    name: "Database (name, birthdate, address)",
    description: "Use this template as a starting point for Database identity verifications using name, birthdate, and address.",
    icon: "🗄️",
    templateType: "inquiry",
    defaults: {
      name: "Database (name, birthdate, address)",
      description: "Database identity verification using name, birthdate, and address",
      steps: [
        { verificationType: "database", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 1 },
      ],
      settings: { expiresInDays: 7 },
    },
  },
  {
    id: "inq_preset_database_or_gov_id",
    name: "Database Or Government ID (Front side only)",
    description: "Use this template as a starting point for Database or Government ID identity verifications based on the country.",
    icon: "🔀",
    templateType: "inquiry",
    defaults: {
      name: "Database Or Government ID (Front side only)",
      description: "Database or Government ID verification based on the country",
      steps: [
        { verificationType: "database", required: false, onPass: "approve", onFail: "continue", onRetry: "retry", maxRetries: 1 },
        { verificationType: "government_id", required: true, onPass: "approve", onFail: "decline", onRetry: "retry", maxRetries: 3 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_database_or_gov_id_selfie",
    name: "Database Or Government ID (Front side only) and Selfie",
    description: "Use this template as a starting point for Database or Government ID and live Selfie identity verifications based on the country.",
    icon: "🔀",
    templateType: "inquiry",
    defaults: {
      name: "Database Or Government ID (Front side only) and Selfie",
      description: "Database or Government ID and live Selfie verification based on the country",
      steps: [
        { verificationType: "database", required: false, onPass: "continue", onFail: "continue", onRetry: "retry", maxRetries: 1 },
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "selfie", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_database_phone_carrier",
    name: "Database Phone Carrier",
    description: "Use this template as a starting point for Database Phone Carrier verifications in the United States.",
    icon: "📱",
    templateType: "inquiry",
    defaults: {
      name: "Database Phone Carrier",
      description: "Database Phone Carrier verification in the United States",
      steps: [
        { verificationType: "database_phone_carrier", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 1 },
      ],
      settings: { expiresInDays: 7 },
    },
  },
  {
    id: "inq_preset_database_ssn",
    name: "Database (name, birthdate, address, social security number)",
    description: "Use this template as a starting point for Database identity verifications using name, birthdate, address and social security number.",
    icon: "🗄️",
    templateType: "inquiry",
    defaults: {
      name: "Database (name, birthdate, address, SSN)",
      description: "Database identity verification using name, birthdate, address and social security number",
      steps: [
        { verificationType: "database_ssn", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 1 },
      ],
      settings: { expiresInDays: 7 },
    },
  },
  {
    id: "inq_preset_document",
    name: "Document",
    description: "Use this template as a starting point to process non-government-issued documents. Additional configuration required.",
    icon: "📄",
    templateType: "inquiry",
    defaults: {
      name: "Document",
      description: "Non-government-issued document verification",
      steps: [
        { verificationType: "document", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 21 },
    },
  },
  {
    id: "inq_preset_email_address",
    name: "Email Address",
    description: "Use this template as a starting point for Email Address verifications.",
    icon: "✉️",
    templateType: "inquiry",
    defaults: {
      name: "Email Address",
      description: "Email address verification",
      steps: [
        { verificationType: "email_address", required: true, onPass: "approve", onFail: "decline", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 3 },
    },
  },
  {
    id: "inq_preset_gov_id_front_database",
    name: "Government ID (Front side only) and Database",
    description: "Use this template as a starting point for Government ID front side and Database identity verifications.",
    icon: "🪪",
    templateType: "inquiry",
    defaults: {
      name: "Government ID (Front side only) and Database",
      description: "Government ID front side and Database identity verification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "database", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 1 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_gov_id_front_database_selfie",
    name: "Government ID (Front side only) and Database and Selfie",
    description: "Use this template as a starting point for Government ID front side, Database, and live Selfie identity verifications.",
    icon: "🪪",
    templateType: "inquiry",
    defaults: {
      name: "Government ID (Front side only) and Database and Selfie",
      description: "Government ID front side, Database, and live Selfie identity verification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "database", required: true, onPass: "continue", onFail: "needs_review", onRetry: "retry", maxRetries: 1 },
        { verificationType: "selfie", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_gov_id_front_document",
    name: "Government ID (Front side only) and Document",
    description: "Use this template as a starting point to verify a government-issued ID (front side only) along with a supporting document. Additional configuration required.",
    icon: "🪪",
    templateType: "inquiry",
    defaults: {
      name: "Government ID (Front side only) and Document",
      description: "Government ID front side and supporting document verification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "document", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 21 },
    },
  },
  {
    id: "inq_preset_gov_id_proof_of_address",
    name: "Government ID and Proof of Address",
    description: "Use this template to verify a government-issued ID along with proof of address documentation. No additional configuration required.",
    icon: "🏠",
    templateType: "inquiry",
    defaults: {
      name: "Government ID and Proof of Address",
      description: "Government ID and proof of address documentation verification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "document", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 30 },
    },
  },
  {
    id: "inq_preset_gov_id_front_form_selfie",
    name: "Government ID (Front side only) and pre-filled form and Selfie",
    description: "Use this template as a starting point for Government ID front side and a prefilled form and live Selfie identity verifications.",
    icon: "📝",
    templateType: "inquiry",
    defaults: {
      name: "Government ID (Front side only) and pre-filled form and Selfie",
      description: "Government ID front side, pre-filled form, and live Selfie identity verification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "selfie", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_gov_id_selfie_document",
    name: "Government ID, Selfie, and Document",
    description: "Use this template as a starting point to verify a government-issued ID, capture a live selfie, and validate a supporting document. Additional configuration required.",
    icon: "🪪",
    templateType: "inquiry",
    defaults: {
      name: "Government ID, Selfie, and Document",
      description: "Government ID, live selfie, and supporting document verification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "selfie", required: true, onPass: "continue", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
        { verificationType: "document", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 21 },
    },
  },
  {
    id: "inq_preset_gov_id_selfie_proof_of_address",
    name: "Government ID, Selfie and Proof of Address",
    description: "Use this template to verify a government-issued ID, capture a live selfie, and validate proof of address documentation. No additional configuration required.",
    icon: "🏠",
    templateType: "inquiry",
    defaults: {
      name: "Government ID, Selfie and Proof of Address",
      description: "Government ID, live selfie, and proof of address documentation verification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "selfie", required: true, onPass: "continue", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
        { verificationType: "document", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 30 },
    },
  },
  {
    id: "inq_preset_gov_id_both_sides",
    name: "Government ID (Both sides)",
    description: "Use this template as a starting point for Government ID front and back side identity verifications.",
    icon: "🆔",
    templateType: "inquiry",
    defaults: {
      name: "Government ID (Both sides)",
      description: "Government ID front and back side identity verification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "approve", onFail: "decline", onRetry: "retry", maxRetries: 3 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_gov_id_front_only",
    name: "Government ID (Front side only)",
    description: "Use this template as a starting point for Government ID front side identity verifications. The submitted ID is auto-classified, users are not required to input their country and ID type before capture or upload.",
    icon: "🆔",
    templateType: "inquiry",
    defaults: {
      name: "Government ID (Front side only)",
      description: "Government ID front side identity verification with auto-classification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "approve", onFail: "decline", onRetry: "retry", maxRetries: 3 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_gov_id_selfie",
    name: "Government ID and Selfie",
    description: "Use this template as a starting point for combined Government ID and live Selfie identity verifications. The submitted ID is auto-classified, users are not required to input their country and ID type before capture or upload.",
    icon: "🪪",
    templateType: "inquiry",
    defaults: {
      name: "Government ID and Selfie",
      description: "Combined Government ID and live Selfie identity verification with auto-classification",
      steps: [
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "selfie", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 30 },
    },
  },
  {
    id: "inq_preset_health_insurance_card",
    name: "Health Insurance Card (US Only)",
    description: "Use this template to verify health insurance cards, specifically for health insurance providers in the United States. No additional configuration required.",
    icon: "🏥",
    templateType: "inquiry",
    defaults: {
      name: "Health Insurance Card (US Only)",
      description: "Health insurance card verification for US providers",
      steps: [
        { verificationType: "health_insurance_card", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 30 },
    },
  },
  {
    id: "inq_preset_phone_number",
    name: "Phone Number",
    description: "Use this template as a starting point for Phone Number verifications.",
    icon: "📱",
    templateType: "inquiry",
    defaults: {
      name: "Phone Number",
      description: "Phone number verification via OTP",
      steps: [
        { verificationType: "phone_number", required: true, onPass: "approve", onFail: "decline", onRetry: "retry", maxRetries: 3 },
      ],
      settings: { expiresInDays: 3 },
    },
  },
  {
    id: "inq_preset_phone_number_database",
    name: "Phone Number and Database",
    description: "Use this template as a starting point for Phone Number and Database identity verifications.",
    icon: "📱",
    templateType: "inquiry",
    defaults: {
      name: "Phone Number and Database",
      description: "Phone number and database identity verification",
      steps: [
        { verificationType: "phone_number", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "database", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 1 },
      ],
      settings: { expiresInDays: 7 },
    },
  },
  {
    id: "inq_preset_phone_gov_id_selfie",
    name: "Phone Number and Government ID and Selfie",
    description: "Use this template as a starting point for Phone Number, Government ID, and live Selfie identity verifications.",
    icon: "📱",
    templateType: "inquiry",
    defaults: {
      name: "Phone Number and Government ID and Selfie",
      description: "Phone Number, Government ID, and live Selfie identity verification",
      steps: [
        { verificationType: "phone_number", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "government_id", required: true, onPass: "continue", onFail: "decline", onRetry: "retry", maxRetries: 3 },
        { verificationType: "selfie", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 14 },
    },
  },
  {
    id: "inq_preset_selfie",
    name: "Selfie",
    description: "Use this template as a starting point for live Selfie identity verifications.",
    icon: "🤳",
    templateType: "inquiry",
    defaults: {
      name: "Selfie",
      description: "Live Selfie identity verification",
      steps: [
        { verificationType: "selfie", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 3 },
    },
  },
  {
    id: "inq_preset_vehicle_insurance",
    name: "Vehicle Insurance (US Only)",
    description: "Use this template to verify vehicle insurance policies, limited to vehicle insurance providers in the United States. No additional configuration required.",
    icon: "🚗",
    templateType: "inquiry",
    defaults: {
      name: "Vehicle Insurance (US Only)",
      description: "Vehicle insurance policy verification for US providers",
      steps: [
        { verificationType: "vehicle_insurance", required: true, onPass: "approve", onFail: "needs_review", onRetry: "retry", maxRetries: 2 },
      ],
      settings: { expiresInDays: 30 },
    },
  },
];

// ─── Workflow Presets ───

export interface WorkflowPresetDefaults {
  name: string;
  description?: string;
  triggerEvent: WorkflowTriggerType;
  triggerConditions?: string;
}

export interface WorkflowPreset {
  id: string;
  name: string;
  description: string;
  defaults: WorkflowPresetDefaults;
}

export const WORKFLOW_PRESETS: WorkflowPreset[] = [
  {
    id: "wfl_preset_auto_approve",
    name: "Auto-approve Low Risk",
    description: "Automatically approve inquiries when the risk score is below a configured threshold.",
    defaults: {
      name: "Auto-approve Low Risk",
      description: "Automatically approve inquiries with risk score below threshold",
      triggerEvent: "inquiry.completed",
      triggerConditions: "riskScore: < 30",
    },
  },
  {
    id: "wfl_preset_escalate_failed",
    name: "Escalate Failed Verifications",
    description: "Route failed verifications to a manual review queue and notify the review team.",
    defaults: {
      name: "Escalate Failed Verifications",
      description: "Route failed verifications to manual review queue",
      triggerEvent: "verification.failed",
    },
  },
  {
    id: "wfl_preset_pep_screening",
    name: "PEP Screening on Account Creation",
    description: "Automatically run PEP screening when a new account is created and alert compliance on matches.",
    defaults: {
      name: "PEP Screening on Account Creation",
      description: "Run PEP screening when new account is created",
      triggerEvent: "account.created",
    },
  },
  {
    id: "wfl_preset_custom",
    name: "Custom Workflow",
    description: "Start from scratch with a blank workflow and configure your own trigger and steps.",
    defaults: {
      name: "",
      triggerEvent: "inquiry.completed",
    },
  },
];

// ─── Verification Template Presets ───

export const VERIFICATION_TEMPLATE_PRESETS: TemplatePreset<"verification">[] = [
  {
    id: "ver_preset_gov_id",
    name: "Government ID",
    description: "Standard government ID verification with authenticity and expiry checks",
    icon: "🪪",
    templateType: "verification",
    defaults: {
      name: "Government ID",
      type: "government_id",
      checks: [
        { name: "Allowed country", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Allowed ID type", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Barcode", categories: ["user_action_required"], required: false, enabled: true },
        { name: "Compromised submission", categories: ["fraud"], required: true, enabled: true },
        { name: "Expiration", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Fabrication", categories: ["fraud"], required: true, enabled: true },
        { name: "Government ID", categories: ["user_action_required"], required: true, enabled: true },
        { name: "ID image tampering", categories: ["fraud"], required: true, enabled: true },
        { name: "Portrait clarity", categories: ["user_action_required"], required: false, enabled: true },
        { name: "Processable submission", categories: ["user_action_required"], required: true, enabled: true },
      ],
      settings: { allowedCountries: ["US", "CA", "GB"], maxRetries: 3, captureMethod: "auto" },
    },
  },
  {
    id: "ver_preset_selfie",
    name: "Selfie",
    description: "Biometric selfie verification with liveness detection and face matching",
    icon: "🤳",
    templateType: "verification",
    defaults: {
      name: "Selfie",
      type: "selfie",
      checks: [
        { name: "Liveness", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Face comparison", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Center present", categories: ["user_action_required"], required: false, enabled: true },
        { name: "Selfie pose", categories: ["user_action_required"], required: false, enabled: true },
        { name: "Selfie suspicious", categories: ["fraud"], required: false, enabled: true },
      ],
      settings: { allowedCountries: ["US", "CA", "AU", "NZ"], maxRetries: 2, captureMethod: "both" },
    },
  },
  {
    id: "ver_preset_document",
    name: "Document",
    description: "Document upload verification for proof of address and similar documents",
    icon: "📄",
    templateType: "verification",
    defaults: {
      name: "Document Upload",
      type: "document",
      checks: [
        { name: "Document extraction", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Document tampering", categories: ["fraud"], required: true, enabled: true },
        { name: "Document type detection", categories: ["user_action_required"], required: false, enabled: true },
        { name: "Document valid", categories: ["user_action_required"], required: true, enabled: true },
      ],
      settings: { allowedCountries: ["US", "GB", "IE"], maxRetries: 2, captureMethod: "manual" },
    },
  },
  {
    id: "ver_preset_database",
    name: "Database",
    description: "Automated database verification against identity records",
    icon: "🗄️",
    templateType: "verification",
    defaults: {
      name: "Database Verification",
      type: "database",
      checks: [
        { name: "Database name match", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Database date of birth match", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Database address match", categories: ["user_action_required"], required: false, enabled: true },
        { name: "Database SSN match", categories: ["user_action_required"], required: false, enabled: false },
      ],
      settings: { allowedCountries: ["US"], maxRetries: 2, captureMethod: "auto" },
    },
  },
  {
    id: "ver_preset_aamva",
    name: "AAMVA",
    description: "AAMVA driver's license data verification against DMV records",
    icon: "🪪",
    templateType: "verification",
    defaults: {
      name: "AAMVA",
      type: "aamva",
      checks: [
        { name: "AAMVA name match", categories: ["user_action_required"], required: true, enabled: true },
        { name: "AAMVA date of birth match", categories: ["user_action_required"], required: true, enabled: true },
        { name: "AAMVA license number match", categories: ["user_action_required"], required: true, enabled: true },
        { name: "AAMVA issuing authority match", categories: ["user_action_required"], required: true, enabled: true },
        { name: "AAMVA expiration check", categories: ["user_action_required"], required: true, enabled: true },
      ],
      settings: { allowedCountries: ["US"], maxRetries: 2, captureMethod: "auto" },
    },
  },
  {
    id: "ver_preset_email_address",
    name: "Email Address",
    description: "Email address verification including deliverability and risk checks",
    icon: "✉️",
    templateType: "verification",
    defaults: {
      name: "Email Address",
      type: "email_address",
      checks: [
        { name: "Email deliverable", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Email domain valid", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Email not disposable", categories: ["fraud"], required: true, enabled: true },
        { name: "Email age check", categories: ["fraud"], required: false, enabled: true },
      ],
      settings: { allowedCountries: ["US", "CA", "GB"], maxRetries: 2, captureMethod: "auto" },
    },
  },
  {
    id: "ver_preset_phone_number",
    name: "Phone Number",
    description: "Phone number verification via OTP with carrier and fraud checks",
    icon: "📱",
    templateType: "verification",
    defaults: {
      name: "Phone Number",
      type: "phone_number",
      checks: [
        { name: "Phone number valid", categories: ["user_action_required"], required: true, enabled: true },
        { name: "OTP verified", categories: ["user_action_required"], required: true, enabled: true },
        { name: "Phone not VoIP", categories: ["fraud"], required: false, enabled: true },
        { name: "Carrier lookup", categories: ["user_action_required"], required: false, enabled: true },
      ],
      settings: { allowedCountries: ["US", "CA"], maxRetries: 3, captureMethod: "auto" },
    },
  },
];

// ─── Report Template Presets ───

export const REPORT_TEMPLATE_PRESETS: TemplatePreset<"report">[] = [
  {
    id: "rep_preset_watchlist",
    name: "Watchlist",
    description: "Screen against global sanctions and watchlists including OFAC, UN, and EU",
    icon: "🔍",
    templateType: "report",
    defaults: {
      name: "Watchlist Screening",
      type: "watchlist",
      screeningSources: [
        "OFAC SDN List",
        "UN Consolidated List",
        "EU Sanctions List",
        "UK HMT Sanctions",
        "Australia DFAT Sanctions",
        "Canada OSFI",
      ],
      settings: {
        matchThreshold: 85,
        continuousMonitoring: true,
        monitoringFrequencyDays: 1,
        enableFuzzyMatch: true,
      },
    },
  },
  {
    id: "rep_preset_pep",
    name: "Politically Exposed Person",
    description: "Identify politically exposed persons and their close associates",
    icon: "🏛️",
    templateType: "report",
    defaults: {
      name: "PEP Report",
      type: "pep",
      screeningSources: [
        "Global PEP Database",
        "National PEP Lists",
        "Relatives & Close Associates",
        "State-Owned Enterprises",
      ],
      settings: {
        matchThreshold: 82,
        continuousMonitoring: true,
        monitoringFrequencyDays: 7,
        enableFuzzyMatch: true,
      },
    },
  },
  {
    id: "rep_preset_adverse_media",
    name: "Adverse Media",
    description: "Monitor for negative news coverage including financial crime and regulatory actions",
    icon: "📰",
    templateType: "report",
    defaults: {
      name: "Adverse Media Monitoring",
      type: "adverse_media",
      screeningSources: [
        "Financial Crime News",
        "Regulatory Actions",
        "Court Records",
        "Negative News Screening",
      ],
      settings: {
        matchThreshold: 68,
        continuousMonitoring: true,
        monitoringFrequencyDays: 2,
        enableFuzzyMatch: true,
      },
    },
  },
];
