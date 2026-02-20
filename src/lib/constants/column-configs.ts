import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import type { VisibilityState } from "@tanstack/react-table";

// Inquiry columns

export const INQUIRY_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "accountName", label: "Name" },
  { id: "id", label: "Inquiry ID" },
  { id: "templateName", label: "Template" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "referenceId", label: "Reference ID" },
  { id: "completedAt", label: "Completed at" },
  { id: "tags", label: "Tags" },
];

export const INQUIRY_DEFAULT_VISIBILITY: VisibilityState = {
  accountName: true,
  id: true,
  templateName: true,
  createdAt: true,
  status: true,
  referenceId: false,
  completedAt: false,
  tags: false,
};

// Verification columns

export const VERIFICATION_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "type", label: "Type" },
  { id: "id", label: "Verification ID" },
  { id: "inquiryId", label: "Inquiry ID" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "completedAt", label: "Completed at" },
];

export const VERIFICATION_DEFAULT_VISIBILITY: VisibilityState = {
  type: true,
  id: true,
  inquiryId: true,
  createdAt: true,
  status: true,
  completedAt: false,
};

// Report columns

export const REPORT_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "primaryInput", label: "Primary Input" },
  { id: "type", label: "Type" },
  { id: "id", label: "Report ID" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "templateName", label: "Template" },
  { id: "completedAt", label: "Completed at" },
  { id: "createdBy", label: "Created by" },
  { id: "matchCount", label: "Matches" },
  { id: "continuousMonitoring", label: "Monitoring" },
];

export const REPORT_DEFAULT_VISIBILITY: VisibilityState = {
  primaryInput: true,
  type: true,
  id: true,
  createdAt: true,
  status: true,
  templateName: false,
  completedAt: false,
  createdBy: false,
  matchCount: false,
  continuousMonitoring: false,
};

// Inquiry template columns

export const INQUIRY_TEMPLATE_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "id", label: "Template ID" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
  { id: "lastPublishedAt", label: "Published (UTC)" },
  { id: "updatedAt", label: "Last updated at" },
];

export const INQUIRY_TEMPLATE_DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  id: false,
  description: true,
  status: true,
  lastPublishedAt: true,
  updatedAt: false,
};

// Verification template columns

export const VERIFICATION_TEMPLATE_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "id", label: "Template ID" },
  { id: "type", label: "Type" },
  { id: "status", label: "Status" },
  { id: "lastPublishedAt", label: "Published (UTC)" },
  { id: "updatedAt", label: "Last updated at" },
];

export const VERIFICATION_TEMPLATE_DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  id: false,
  type: true,
  status: true,
  lastPublishedAt: true,
  updatedAt: false,
};

// Report template columns

export const REPORT_TEMPLATE_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "id", label: "Template ID" },
  { id: "type", label: "Type" },
  { id: "status", label: "Status" },
  { id: "updatedAt", label: "Last updated at" },
];

export const REPORT_TEMPLATE_DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  id: false,
  type: true,
  status: true,
  updatedAt: true,
};

// Workflow columns

export const WORKFLOW_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "id", label: "Workflow ID" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
  { id: "trigger", label: "Trigger" },
  { id: "triggerCriteria", label: "Trigger criteria" },
  { id: "runsCount", label: "Runs" },
  { id: "lastRunAt", label: "Last run" },
  { id: "updatedAt", label: "Last updated at" },
];

export const WORKFLOW_DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  id: false,
  description: true,
  status: true,
  trigger: true,
  triggerCriteria: true,
  runsCount: true,
  lastRunAt: false,
  updatedAt: true,
};

export const WORKFLOW_RUN_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "id", label: "Run ID" },
  { id: "workflowName", label: "Workflow" },
  { id: "status", label: "Status" },
  { id: "triggeredBy", label: "Triggered by" },
  { id: "startedAt", label: "Started at" },
  { id: "completedAt", label: "Completed at" },
  { id: "stepsExecuted", label: "Steps" },
];

export const WORKFLOW_RUN_DEFAULT_VISIBILITY: VisibilityState = {
  id: true,
  workflowName: true,
  status: true,
  triggeredBy: true,
  startedAt: true,
  completedAt: false,
  stepsExecuted: true,
};

// Transaction columns

export const TRANSACTION_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "accountName", label: "Account" },
  { id: "id", label: "Transaction ID" },
  { id: "type", label: "Type" },
  { id: "amount", label: "Amount" },
  { id: "status", label: "Status" },
  { id: "riskScore", label: "Risk score" },
  { id: "createdAt", label: "Created at" },
  { id: "reviewedAt", label: "Reviewed at" },
  { id: "description", label: "Description" },
  { id: "tags", label: "Tags" },
];

export const TRANSACTION_DEFAULT_VISIBILITY: VisibilityState = {
  accountName: true,
  id: true,
  type: true,
  amount: true,
  status: true,
  riskScore: true,
  createdAt: true,
  reviewedAt: false,
  description: false,
  tags: false,
};

// Case columns

export const CASE_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "id", label: "Case ID" },
  { id: "title", label: "Title" },
  { id: "accountName", label: "Account" },
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
  { id: "queue", label: "Queue" },
  { id: "assignee", label: "Assignee" },
  { id: "createdAt", label: "Created at" },
  { id: "updatedAt", label: "Updated at" },
  { id: "tags", label: "Tags" },
];

export const CASE_DEFAULT_VISIBILITY: VisibilityState = {
  id: true,
  title: true,
  accountName: true,
  status: true,
  priority: true,
  queue: true,
  assignee: true,
  createdAt: true,
  updatedAt: false,
  tags: false,
};

// Account columns

export const ACCOUNT_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "id", label: "Account ID" },
  { id: "type", label: "Type" },
  { id: "createdAt", label: "Created at" },
  { id: "status", label: "Status" },
  { id: "updatedAt", label: "Updated at" },
  { id: "referenceId", label: "Reference ID" },
  { id: "inquiryCount", label: "Inquiries" },
  { id: "verificationCount", label: "Verifications" },
  { id: "reportCount", label: "Reports" },
];

export const ACCOUNT_DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  id: true,
  type: true,
  createdAt: true,
  status: true,
  updatedAt: false,
  referenceId: false,
  inquiryCount: false,
  verificationCount: false,
  reportCount: false,
};
