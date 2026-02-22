// ─── Status Types ───

export type InquiryStatus =
  | "created"
  | "pending"
  | "completed"
  | "approved"
  | "declined"
  | "needs_review"
  | "expired";

export type VerificationStatus =
  | "initiated"
  | "submitted"
  | "passed"
  | "failed"
  | "requires_retry"
  | "canceled";

export type VerificationType =
  | "government_id"
  | "selfie"
  | "database"
  | "document"
  | "aamva"
  | "database_phone_carrier"
  | "database_ssn"
  | "email_address"
  | "phone_number"
  | "health_insurance_card"
  | "vehicle_insurance";

export type ReportStatus = "pending" | "ready" | "no_matches" | "match";

export type ReportType = "watchlist" | "pep" | "adverse_media";

export type AccountStatus = "default" | "active" | "suspended" | "closed";

export type CheckStatus = "passed" | "failed" | "not_applicable";

export type CheckCategory = "fraud" | "user_action_required";

export type SignalLevel = "low" | "medium" | "high";

// ─── Core Entities ───

export interface Inquiry {
  id: string; // inq_...
  referenceId?: string;
  accountId: string; // act_...
  accountName: string;
  status: InquiryStatus;
  templateName: string;
  createdAt: string; // ISO 8601
  completedAt?: string;
  timeToFinish?: number; // seconds
  verificationAttempts: {
    governmentId: number;
    selfie: number;
  };
  tags: string[];
}

export interface Verification {
  id: string; // ver_...
  inquiryId: string;
  type: VerificationType;
  status: VerificationStatus;
  createdAt: string;
  completedAt?: string;
  checks: Check[];
  extractedData?: Record<string, string>;
  photos?: VerificationPhoto[];
  countryCode?: string;
  idClass?: string;
}

export interface VerificationPhoto {
  url: string;
  label: string; // "Front", "Back", "Look ahead", etc.
  captureMethod: "manual" | "auto";
}

export interface DocumentViewerItem {
  photo: VerificationPhoto;
  extractedData?: Record<string, string>;
  verificationType: string; // "Government ID", "Selfie"
}

export interface Check {
  name: string;
  status: CheckStatus;
  category: CheckCategory;
  required: boolean;
  reasons?: string[];
}

export interface ReportMatch {
  id: string;
  name: string;
  score: number;
  source: string;
  country?: string;
  matchType: "exact" | "partial" | "fuzzy";
  listedDate?: string;
  aliases?: string[];
  status: "pending_review" | "confirmed" | "dismissed";
}

export interface Report {
  id: string; // rep_...
  inquiryId?: string;
  accountId?: string;
  type: ReportType;
  status: ReportStatus;
  primaryInput: string; // name
  templateName: string;
  createdAt: string;
  completedAt?: string;
  continuousMonitoring: boolean;
  createdBy: "workflow" | "manual" | "api";
  matchCount: number;
  matches?: ReportMatch[];
}

export interface Account {
  id: string; // act_...
  referenceId?: string;
  name: string;
  birthdate?: string;
  address?: string;
  age?: number;
  status: AccountStatus;
  type: string; // "User"
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  inquiryCount: number;
  verificationCount: number;
  reportCount: number;
  phone?: string;
  email?: string;
  nationality?: string;
  gender?: string;
  identificationNumbers?: { label: string; value: string }[];
}

// ─── Templates ───

export type TemplateStatus = "active" | "draft";

export type StepPassAction = "continue" | "approve" | "skip_next";
export type StepFailAction = "decline" | "needs_review" | "skip" | "continue";
export type StepRetryAction = "retry" | "decline" | "needs_review";

export interface InquiryTemplateStep {
  verificationType: VerificationType;
  required: boolean;
  onPass: StepPassAction;
  onFail: StepFailAction;
  onRetry: StepRetryAction;
  maxRetries: number;
}

export interface InquiryTemplate {
  id: string; // itmpl_...
  name: string;
  description?: string;
  status: TemplateStatus;
  lastPublishedAt?: string;
  createdAt: string;
  updatedAt: string;
  steps: InquiryTemplateStep[];
  settings: {
    expiresInDays: number;
    redirectUrl?: string;
  };
}

export type CheckLifecycle = "ga" | "beta" | "sunset";

// ─── Check Configuration Types ───

export type CheckConfigType =
  | "comparison"
  | "age_range"
  | "expiration"
  | "barcode"
  | "country"
  | "id_type"
  | "repeat"
  | "extracted_properties";

export type ComparisonMethod =
  | "string_similarity"
  | "string_difference"
  | "string_missing"
  | "nickname"
  | "substring"
  | "tokenization"
  | "date_similarity"
  | "date_difference_day"
  | "date_difference_month"
  | "date_difference_year"
  | "person_full_name"
  | "doing_business_as";

export type NormalizationMethodType =
  | "remove_prefixes"
  | "remove_suffixes"
  | "remove_special_characters"
  | "fold_characters"
  | "abbreviate_street_suffix"
  | "abbreviate_street_unit"
  | "abbreviate_subdivision"
  | "canonicalize_email_address"
  | "expand_city_abbreviation"
  | "expand_city_suffix"
  | "expand_street_suffix"
  | "expand_street_unit"
  | "expand_subdivision";

export type MatchLevel = "full" | "partial" | "none";

export type ComparisonAttribute =
  | "name_first"
  | "name_last"
  | "name_middle"
  | "name_full"
  | "birthdate"
  | "address_street"
  | "address_city"
  | "address_subdivision"
  | "address_postal_code"
  | "identification_number"
  | "social_security_number";

export interface NormalizationStep {
  step: "apply" | "then";
  method: NormalizationMethodType;
}

export interface MatchCondition {
  method: ComparisonMethod;
  matchLevel: MatchLevel;
  threshold?: number;
}

export interface AttributeMatchRequirement {
  attribute: ComparisonAttribute;
  normalization: NormalizationStep[];
  comparison:
    | { type: "simple"; matchLevel: MatchLevel }
    | { type: "complex"; conditions: MatchCondition[] };
}

export type ExtractedProperty =
  | "name_first"
  | "name_last"
  | "name_middle"
  | "birthdate"
  | "address_street"
  | "address_city"
  | "address_subdivision"
  | "address_postal_code"
  | "identification_number"
  | "document_number"
  | "issuing_country"
  | "expiration_date"
  | "issue_date"
  | "nationality";

export interface CheckSubConfig {
  ageRange?: { min?: number; max?: number };
  gracePeriodDays?: number;
  requireSuccessfulExtraction?: boolean;
  mapToSovereignCountry?: boolean;
  scope?: "same_account" | "all_accounts";
  matchRequirements?: AttributeMatchRequirement[];
  requiredAttributes?: ExtractedProperty[];
  passWhenPropertyMissing?: boolean;
}

export interface VerificationCheckConfig {
  name: string;
  categories: CheckCategory[];
  required: boolean;
  enabled: boolean;
  lifecycle?: CheckLifecycle;
  subConfig?: CheckSubConfig;
}

export interface VerificationTemplate {
  id: string; // vtmpl_...
  versionId?: string; // vtmplv_...
  name: string;
  type: VerificationType;
  status: TemplateStatus;
  lastPublishedAt?: string;
  createdAt: string;
  updatedAt: string;
  checks: VerificationCheckConfig[];
  settings: {
    allowedCountries: string[];
    countrySettings?: Record<string, import("@/lib/constants/countries").CountrySettings>;
    maxRetries: number;
    captureMethod: "auto" | "manual" | "both";
  };
}

export interface ReportTemplate {
  id: string; // rptp_...
  name: string;
  type: ReportType;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
  screeningSources: string[];
  settings: {
    matchThreshold: number;
    continuousMonitoring: boolean;
    monitoringFrequencyDays: number;
    enableFuzzyMatch: boolean;
  };
}

// ─── Flow DSL ───

/** Outcome target — either a step/terminal ID or a branch with conditions */
export type FlowTarget = string | FlowBranch;

export interface FlowBranch {
  branch: FlowBranchCondition[];
}

export interface FlowBranchCondition {
  when?: string; // condition expression e.g. "risk_score > 80"
  default?: boolean; // catch-all branch
  goto: string; // target step or terminal ID
}

export type FlowStepType = "verification" | "review" | "wait";

export interface FlowStep {
  type: FlowStepType;
  verification?: VerificationType; // when type=verification
  label?: string; // display label override
  required?: boolean;
  on_pass: FlowTarget;
  on_fail: FlowTarget;
  retry?: { max: number };
}

export interface FlowReviewStep {
  type: "review";
  label: string;
  outcomes: Record<string, string>; // outcome_name → target step/terminal ID
}

export interface FlowTerminal {
  status: "approved" | "declined" | "needs_review";
  label?: string;
}

export interface FlowDefinition {
  start: string; // ID of the first step
  steps: Record<string, FlowStep | FlowReviewStep>;
  terminals: Record<string, FlowTerminal>;
}

/** Node types for React Flow custom nodes */
export type FlowNodeType = "start" | "verification" | "review" | "terminal" | "branch";

export interface FlowNodeData {
  nodeType: FlowNodeType;
  label: string;
  stepId?: string;
  verificationType?: VerificationType;
  required?: boolean;
  status?: string;
  maxRetries?: number;
  outcomes?: Record<string, string>;
  terminalStatus?: string;
}

// ─── Signals ───

export interface Signal {
  name: string;
  value: string | number | boolean;
  type: "processed" | "raw";
  level?: SignalLevel;
}

export interface BehavioralRisk {
  behaviorThreatLevel: SignalLevel;
  botScore: number;
  requestSpoofAttempts: number;
  userAgentSpoofAttempts: number;
  completionTime: number; // seconds
  distractionEvents: number;
  hesitationPercent: number;
  shortcutCopies: number;
  pastes: number;
  autofillStarts: number;
  mobileSdkRestricted: number;
  apiVersionRestricted: number;
}

// ─── Analytics ───

export interface AnalyticsOverview {
  totalInquiries: number;
  approvalRate: number;
  avgCompletionTime: number; // seconds
  pendingReview: number;
  inquiriesTrend: number; // % change
  approvalTrend: number;
  completionTimeTrend: number;
  pendingReviewTrend: number;
}

export interface TimeSeriesPoint {
  date: string; // ISO 8601 date
  value: number;
  label?: string;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface FunnelStep {
  name: string;
  key: string; // machine key, e.g. "doc_uploaded"
  count: number;
  percentage: number; // relative to first step
  dropoff: number; // % dropped from previous step
  color: string; // hex color for chart rendering
}

// ─── Sankey Funnel ───

export type SankeyLinkType = "success" | "failure" | "abandon";

export interface SankeyNode {
  name: string;
  color: string;
  count: number;
}

export interface SankeyLink {
  source: number; // index into nodes array
  target: number;
  value: number; // flow count
  type: SankeyLinkType;
}

export interface SankeyFunnelData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Funnel time series: each day has a conversion rate (0-100) per funnel step
export interface FunnelTimeSeriesPoint {
  date: string; // ISO 8601 date
  [stepKey: string]: number | string; // step keys map to rates
}

// Analytics interval for chart granularity
export type AnalyticsInterval = "daily" | "weekly" | "monthly";

// Rate time series: each day has completion + approval rates
export interface RateTimeSeriesPoint {
  date: string; // ISO 8601 date
  completionRate: number; // 0-100
  approvalRate: number; // 0-100
}

// Verification rate time series: pass + processed rates per day
export interface VerificationRatePoint {
  date: string; // ISO 8601 date
  passRate: number; // 0-100
  processedRate: number; // 0-100
}

// Report rate time series: match + ready rates per day
export interface ReportRatePoint {
  date: string; // ISO 8601 date
  matchRate: number; // 0-100
  readyRate: number; // 0-100
}

// Transaction rate time series: approval + needs_review rates per day
export interface TransactionRatePoint {
  date: string; // ISO 8601 date
  approvalRate: number; // 0-100
  needsReviewRate: number; // 0-100
}

// Case rate time series: resolution + SLA compliance rates per day
export interface CaseRatePoint {
  date: string; // ISO 8601 date
  resolutionRate: number; // 0-100
  slaComplianceRate: number; // 0-100
}

// Highlights strip: compact metrics shown in a horizontal row
export interface HighlightMetric {
  label: string;
  value: string;
  description?: string;
  tooltip?: string;
  trend?: number;
  invertTrend?: boolean;
}

// ─── Table & UI Types ───

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface FilterState {
  search?: string;
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
}

// ─── Event Timeline ───

export type TimelineEventLevel = "info" | "success" | "error" | "warning";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  level: TimelineEventLevel;
  description: string;
  actor?: string; // "workflow", "system", "user"
}

// ─── Inquiry Session ───

export interface InquirySession {
  id: string;
  inquiryId: string;
  // Timestamps
  createdAt: string;
  startedAt: string;
  expiredAt?: string;
  // Network details
  ipAddress: string;
  networkThreatLevel: string; // "Low" | "Medium" | "High"
  networkCountry: string;
  networkRegion: string;
  ipLatitude: number;
  ipLongitude: number;
  torConnection: boolean;
  vpn: boolean;
  publicProxy: boolean;
  privateProxy: boolean;
  isp: string;
  ipConnectionType: string; // "residential" | "corporate" | "mobile"
  httpReferer: string;
  // Device details
  deviceToken: string;
  deviceHandoffMethod: string;
  deviceType: string; // "desktop" | "mobile"
  deviceOs: string;
  browser: string;
  browserFingerprint: string;
  gpsLatitude: number;
  gpsLongitude: number;
}

// ─── Inquiry Signal ───

export type SignalCategory = "featured" | "network" | "behavioral" | "device";

export interface InquirySignal {
  name: string;
  value: string;
  type: "Processed" | "Raw";
  flagged: boolean;
  category: SignalCategory;
}

// ─── Workflows ───

export type WorkflowStatus = "active" | "draft" | "archived" | "disabled";

export type WorkflowTriggerType =
  | "inquiry.completed"
  | "inquiry.created"
  | "inquiry.failed"
  | "inquiry.expired"
  | "verification.passed"
  | "verification.failed"
  | "report.ready"
  | "account.created"
  | "case.resolved"
  | "manual";

export interface WorkflowTrigger {
  event: WorkflowTriggerType;
  conditions?: Record<string, string>;
}

export interface WorkflowStep {
  id: string;
  type: "action" | "condition" | "delay" | "webhook";
  label: string;
  config: Record<string, unknown>;
}

export interface Workflow {
  id: string; // wfl_...
  name: string;
  description?: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  lastPublishedAt?: string;
  createdAt: string;
  updatedAt: string;
  runsCount: number;
  lastRunAt?: string;
}

// ─── Workflow Flow Definition (YAML schema) ───

export type WorkflowActionType =
  | "approve_inquiry"
  | "decline_inquiry"
  | "review_inquiry"
  | "create_case"
  | "run_report"
  | "tag_object"
  | "send_email"
  | "send_sms"
  | "send_slack"
  | "make_http_request"
  | "run_workflow"
  | "schedule_workflow"
  | "evaluate_code";

export type WorkflowFlowStepType = "action" | "conditional" | "parallel" | "wait";

export interface WorkflowFlowRoute {
  label: string;
  when: string; // condition expression
  goto: string; // step ID
  color?: "success" | "danger" | "caution" | "primary";
}

export interface WorkflowFlowActionStep {
  type: "action";
  action: WorkflowActionType;
  label: string;
  config?: Record<string, unknown>;
  next?: string; // next step ID
}

export interface WorkflowFlowConditionalStep {
  type: "conditional";
  label: string;
  routes: WorkflowFlowRoute[];
  else?: string; // fallback step ID
  next?: string; // after all routes merge
}

export interface WorkflowFlowParallelStep {
  type: "parallel";
  label: string;
  branches: string[]; // first step ID of each branch
  next?: string; // after all branches complete
}

export interface WorkflowFlowWaitStep {
  type: "wait";
  label: string;
  wait_for: "object" | "time";
  target_object?: string; // step ID that created the object
  events?: string[];
  timeout_seconds?: number;
  error_on_expiration?: boolean;
  next?: string;
}

export type WorkflowFlowStep =
  | WorkflowFlowActionStep
  | WorkflowFlowConditionalStep
  | WorkflowFlowParallelStep
  | WorkflowFlowWaitStep;

export interface WorkflowFlowDefinition {
  trigger: {
    event: WorkflowTriggerType;
    where?: Record<string, string>;
  };
  start: string; // first step ID
  steps: Record<string, WorkflowFlowStep>;
  output?: Record<string, unknown>;
}

/** Node types for workflow React Flow custom nodes */
export type WorkflowFlowNodeType =
  | "wf_trigger"
  | "wf_action"
  | "wf_conditional"
  | "wf_parallel"
  | "wf_wait"
  | "wf_output"
  | "wf_route_label";

export interface WorkflowRun {
  id: string; // wfr_...
  workflowId: string;
  workflowName: string;
  status: "completed" | "running" | "failed" | "canceled";
  triggeredBy: string;
  startedAt: string;
  completedAt?: string;
  stepsExecuted: number;
  stepsTotal: number;
}

// ─── Transactions ───

export type TransactionStatus = "created" | "needs_review" | "approved" | "declined";
export type TransactionType = "payment" | "withdrawal" | "transfer" | "deposit" | "refund";

export interface Transaction {
  id: string; // txn_...
  accountId: string;
  accountName: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description?: string;
  riskScore: number; // 0-100
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  referenceId?: string;
  tags: string[];
}

// ─── Cases ───

export type CaseStatus = "open" | "in_review" | "resolved" | "escalated" | "closed";
export type CasePriority = "low" | "medium" | "high" | "critical";

export interface Case {
  id: string; // case_...
  accountId?: string;
  accountName?: string;
  inquiryId?: string;
  status: CaseStatus;
  priority: CasePriority;
  queue?: string;
  assignee?: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type { StoredFlowChatKey } from "./flow-chat";
