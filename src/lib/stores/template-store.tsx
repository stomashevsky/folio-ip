"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  mockInquiryTemplates,
  mockReportTemplates,
  mockVerificationTemplates,
  mockWorkflows,
  mockWorkflowRuns,
  mockCases,
} from "@/lib/data";
import type {
  Case,
  InquiryTemplate,
  ReportTemplate,
  VerificationTemplate,
  Workflow,
  WorkflowRun,
} from "@/lib/types";

type InquiryTemplateCreateInput = Omit<InquiryTemplate, "id" | "createdAt" | "updatedAt">;
type VerificationTemplateCreateInput = Omit<VerificationTemplate, "id" | "createdAt" | "updatedAt">;
type ReportTemplateCreateInput = Omit<ReportTemplate, "id" | "createdAt" | "updatedAt">;
type WorkflowCreateInput = Omit<Workflow, "id" | "createdAt" | "updatedAt">;
type CaseCreateInput = Omit<Case, "id" | "createdAt" | "updatedAt">;

type InquiryTemplateUpdateInput = Partial<Omit<InquiryTemplate, "id" | "createdAt">>;
type VerificationTemplateUpdateInput = Partial<Omit<VerificationTemplate, "id" | "createdAt">>;
type ReportTemplateUpdateInput = Partial<Omit<ReportTemplate, "id" | "createdAt">>;
type WorkflowUpdateInput = Partial<Omit<Workflow, "id" | "createdAt">>;
type CaseUpdateInput = Partial<Omit<Case, "id" | "createdAt">>;

type TemplateStoreValue = {
  inquiryTemplates: {
    getAll: () => InquiryTemplate[];
    getById: (id: string) => InquiryTemplate | undefined;
    create: (input: InquiryTemplateCreateInput) => InquiryTemplate;
    update: (id: string, input: InquiryTemplateUpdateInput) => InquiryTemplate | undefined;
    delete: (id: string) => void;
  };
  verificationTemplates: {
    getAll: () => VerificationTemplate[];
    getById: (id: string) => VerificationTemplate | undefined;
    create: (input: VerificationTemplateCreateInput) => VerificationTemplate;
    update: (id: string, input: VerificationTemplateUpdateInput) => VerificationTemplate | undefined;
    delete: (id: string) => void;
  };
  reportTemplates: {
    getAll: () => ReportTemplate[];
    getById: (id: string) => ReportTemplate | undefined;
    create: (input: ReportTemplateCreateInput) => ReportTemplate;
    update: (id: string, input: ReportTemplateUpdateInput) => ReportTemplate | undefined;
    delete: (id: string) => void;
  };
  workflows: {
    getAll: () => Workflow[];
    getById: (id: string) => Workflow | undefined;
    create: (input: WorkflowCreateInput) => Workflow;
    update: (id: string, input: WorkflowUpdateInput) => Workflow | undefined;
    delete: (id: string) => void;
  };
  workflowRuns: {
    getAll: () => WorkflowRun[];
    getByWorkflowId: (workflowId: string) => WorkflowRun[];
  };
  cases: {
    getAll: () => Case[];
    getById: (id: string) => Case | undefined;
    create: (input: CaseCreateInput) => Case;
    update: (id: string, input: CaseUpdateInput) => Case | undefined;
    delete: (id: string) => void;
  };
};

const TemplateStoreContext = createContext<TemplateStoreValue | undefined>(undefined);

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function randomId(prefix: "itmpl_" | "vtmpl_" | "rptp_" | "wfl_" | "case_") {
  return `${prefix}${Math.random().toString(36).slice(2, 14)}`;
}

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [inquiryTemplates, setInquiryTemplates] = useState<InquiryTemplate[]>(() => cloneData(mockInquiryTemplates));
  const [verificationTemplates, setVerificationTemplates] = useState<VerificationTemplate[]>(() => cloneData(mockVerificationTemplates));
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>(() => cloneData(mockReportTemplates));
  const [workflows, setWorkflows] = useState<Workflow[]>(() => cloneData(mockWorkflows));
  const [workflowRuns] = useState<WorkflowRun[]>(() => cloneData(mockWorkflowRuns));
  const [cases, setCases] = useState<Case[]>(() => cloneData(mockCases));

  const value = useMemo<TemplateStoreValue>(
    () => ({
      inquiryTemplates: {
        getAll: () => inquiryTemplates,
        getById: (id) => inquiryTemplates.find((template) => template.id === id),
        create: (input) => {
          const now = new Date().toISOString();
          const template: InquiryTemplate = {
            id: randomId("itmpl_"),
            createdAt: now,
            updatedAt: now,
            ...input,
          };
          setInquiryTemplates((prev) => [template, ...prev]);
          return template;
        },
        update: (id, input) => {
          const existing = inquiryTemplates.find((template) => template.id === id);
          if (!existing) {
            return undefined;
          }

          const updated: InquiryTemplate = {
            ...existing,
            ...input,
            updatedAt: new Date().toISOString(),
          };

          setInquiryTemplates((prev) => prev.map((template) => (template.id === id ? updated : template)));
          return updated;
        },
        delete: (id) => {
          setInquiryTemplates((prev) => prev.filter((template) => template.id !== id));
        },
      },
      verificationTemplates: {
        getAll: () => verificationTemplates,
        getById: (id) => verificationTemplates.find((template) => template.id === id),
        create: (input) => {
          const now = new Date().toISOString();
          const template: VerificationTemplate = {
            id: randomId("vtmpl_"),
            createdAt: now,
            updatedAt: now,
            ...input,
          };
          setVerificationTemplates((prev) => [template, ...prev]);
          return template;
        },
        update: (id, input) => {
          const existing = verificationTemplates.find((template) => template.id === id);
          if (!existing) {
            return undefined;
          }

          const updated: VerificationTemplate = {
            ...existing,
            ...input,
            updatedAt: new Date().toISOString(),
          };

          setVerificationTemplates((prev) => prev.map((template) => (template.id === id ? updated : template)));
          return updated;
        },
        delete: (id) => {
          setVerificationTemplates((prev) => prev.filter((template) => template.id !== id));
        },
      },
      reportTemplates: {
        getAll: () => reportTemplates,
        getById: (id) => reportTemplates.find((template) => template.id === id),
        create: (input) => {
          const now = new Date().toISOString();
          const template: ReportTemplate = {
            id: randomId("rptp_"),
            createdAt: now,
            updatedAt: now,
            ...input,
          };
          setReportTemplates((prev) => [template, ...prev]);
          return template;
        },
        update: (id, input) => {
          const existing = reportTemplates.find((template) => template.id === id);
          if (!existing) {
            return undefined;
          }

          const updated: ReportTemplate = {
            ...existing,
            ...input,
            updatedAt: new Date().toISOString(),
          };

          setReportTemplates((prev) => prev.map((template) => (template.id === id ? updated : template)));
          return updated;
        },
        delete: (id) => {
          setReportTemplates((prev) => prev.filter((template) => template.id !== id));
        },
      },
      workflows: {
        getAll: () => workflows,
        getById: (id) => workflows.find((w) => w.id === id),
        create: (input) => {
          const now = new Date().toISOString();
          const w: Workflow = { id: randomId("wfl_"), createdAt: now, updatedAt: now, ...input };
          setWorkflows((prev) => [w, ...prev]);
          return w;
        },
        update: (id, input) => {
          const existing = workflows.find((w) => w.id === id);
          if (!existing) return undefined;
          const updated: Workflow = { ...existing, ...input, updatedAt: new Date().toISOString() };
          setWorkflows((prev) => prev.map((w) => (w.id === id ? updated : w)));
          return updated;
        },
        delete: (id) => {
          setWorkflows((prev) => prev.filter((w) => w.id !== id));
        },
      },
      workflowRuns: {
        getAll: () => workflowRuns,
        getByWorkflowId: (workflowId) => workflowRuns.filter((r) => r.workflowId === workflowId),
      },
      cases: {
        getAll: () => cases,
        getById: (id) => cases.find((c) => c.id === id),
        create: (input) => {
          const now = new Date().toISOString();
          const c: Case = { id: randomId("case_"), createdAt: now, updatedAt: now, ...input };
          setCases((prev) => [c, ...prev]);
          return c;
        },
        update: (id, input) => {
          const existing = cases.find((c) => c.id === id);
          if (!existing) return undefined;
          const updated: Case = { ...existing, ...input, updatedAt: new Date().toISOString() };
          setCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
          return updated;
        },
        delete: (id) => {
          setCases((prev) => prev.filter((c) => c.id !== id));
        },
      },
    }),
    [inquiryTemplates, verificationTemplates, reportTemplates, workflows, workflowRuns, cases],
  );

  return (
    <TemplateStoreContext.Provider value={value}>
      {children}
    </TemplateStoreContext.Provider>
  );
}

export function useTemplateStore() {
  const context = useContext(TemplateStoreContext);
  if (!context) {
    throw new Error("useTemplateStore must be used within a TemplateProvider");
  }
  return context;
}
