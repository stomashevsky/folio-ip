"use client";

import { Suspense, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { NotFoundPage, ConfirmLeaveModal } from "@/components/shared";
import { FlowEditor, type FlowEditorPanel } from "@/components/flow/FlowEditor";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { useTemplateForm } from "@/lib/hooks/useTemplateForm";
import { INQUIRY_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import { FLOW_TEMPLATES, DEFAULT_FLOW_YAML } from "@/lib/constants/flow-templates";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import type { InquiryTemplate, TemplateStatus } from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { DotsHorizontal, Undo, Redo } from "@plexui/ui/components/Icon";

interface InquiryFlowForm {
  name: string;
  description: string;
  status: TemplateStatus;
  lastPublishedAt?: string;
  flowYaml: string;
  settings: {
    expiresInDays: number;
    redirectUrl: string;
  };
}

const DEFAULT_FORM: InquiryFlowForm = {
  name: "",
  description: "",
  status: "draft",
  flowYaml: DEFAULT_FLOW_YAML,
  settings: { expiresInDays: 30, redirectUrl: "" },
};

function buildFormFromPreset(presetParam: string): InquiryFlowForm {
  const preset = INQUIRY_TEMPLATE_PRESETS.find((p) => p.id === presetParam);
  if (!preset) return DEFAULT_FORM;
  return {
    name: preset.defaults.name,
    description: preset.defaults.description,
    status: "draft",
    flowYaml: DEFAULT_FLOW_YAML,
    settings: {
      expiresInDays: preset.defaults.settings.expiresInDays,
      redirectUrl: preset.defaults.settings.redirectUrl ?? "",
    },
  };
}

function toForm(t: InquiryTemplate): InquiryFlowForm {
  return {
    name: t.name,
    description: t.description ?? "",
    status: t.status,
    lastPublishedAt: t.lastPublishedAt,
    flowYaml: FLOW_TEMPLATES[t.id] ?? DEFAULT_FLOW_YAML,
    settings: {
      expiresInDays: t.settings.expiresInDays,
      redirectUrl: t.settings.redirectUrl ?? "",
    },
  };
}

export default function InquiryTemplateDetailPage() {
  return (
    <Suspense fallback={null}>
      <InquiryTemplateDetailContent />
    </Suspense>
  );
}

function InquiryTemplateDetailContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { inquiryTemplates } = useTemplateStore();

  const { form, setForm, patch, isNew, existing } = useTemplateForm({
    id,
    getExisting: inquiryTemplates.getById,
    presetParam: searchParams.get("preset"),
    toForm,
    buildFromPreset: buildFormFromPreset,
    defaultForm: DEFAULT_FORM,
  });
  const [initialForm, setInitialForm] = useState(form);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [editorPanel, setEditorPanel] = useState<FlowEditorPanel>("chat");
  const [codeHistoryState, setCodeHistoryState] = useState({ canUndo: false, canRedo: false });
  const [codeHistoryActions, setCodeHistoryActions] = useState<{ undo: () => void; redo: () => void } | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setInitialForm(existing ? toForm(existing) : DEFAULT_FORM);
  }

  const isDirty = isNew || JSON.stringify(form) !== JSON.stringify(initialForm);
  const { confirmNavigation, showLeaveConfirm, confirmLeave, cancelLeave } = useUnsavedChanges(isDirty);

  if (!isNew && !existing) {
    return <NotFoundPage section="Inquiry Templates" backHref="/templates/inquiries" entity="Inquiry template" />;
  }
  function patchSettings(p: Partial<InquiryFlowForm["settings"]>) {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }));
  }

  function save(formOverride?: InquiryFlowForm) {
    const f = formOverride ?? form;
    if (formOverride) setForm(f);
    setSaveState("saving");
    clearTimeout(saveTimerRef.current);
    const payload: Omit<InquiryTemplate, "id" | "createdAt" | "updatedAt"> = {
      name: f.name,
      description: f.description.trim() || undefined,
      status: f.status,
      lastPublishedAt: f.lastPublishedAt,
      steps: [],
      settings: { ...f.settings, redirectUrl: f.settings.redirectUrl.trim() || undefined },
    };
    if (isNew) {
      const created = inquiryTemplates.create(payload);
      router.replace(`/templates/inquiries/${created.id}`);
    } else {
      inquiryTemplates.update(id, payload);
    }
    setInitialForm(f);
    saveTimerRef.current = setTimeout(() => {
      setSaveState("saved");
      saveTimerRef.current = setTimeout(() => setSaveState("idle"), 1500);
    }, 600);
  }

  function handleDelete() {
    if (!existing) return;
    setInitialForm(form);
    inquiryTemplates.delete(id);
    router.push("/templates/inquiries");
  }

  const title = isNew ? "New inquiry template" : (existing?.name ?? "Inquiry template");
  const canPublish = form.status === "draft";
  const canUnpublish = form.status === "active";
  const backHref = "/templates/inquiries";

  const hasSettings = true;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title={
          <span className="flex items-center gap-2">
            {title}
            {!isNew && (
              <Badge color={getStatusColor(form.status) as "warning" | "success" | "secondary"} size="sm">
                {form.status}
              </Badge>
            )}
          </span>
        }
        backHref={backHref}
        backLabel="Inquiry Templates"
        onBackClick={() => confirmNavigation(backHref)}
        toolbar={
          <div className="flex w-full items-center justify-between">
            <SegmentedControl
              aria-label="Editor panel"
              value={editorPanel}
              onChange={(v) => setEditorPanel(v as FlowEditorPanel)}
              size="sm"
              pill={false}
            >
              <SegmentedControl.Tab value="chat">AI Chat</SegmentedControl.Tab>
              <SegmentedControl.Tab value="code">Code</SegmentedControl.Tab>
              {hasSettings && <SegmentedControl.Tab value="settings">Settings</SegmentedControl.Tab>}
            </SegmentedControl>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                color="secondary"
                variant="soft"
                size="sm"
                pill={false}
                disabled={!codeHistoryState.canUndo}
                onClick={() => codeHistoryActions?.undo()}
                className="[--button-ring-color:transparent]"
              >
                <Undo />
              </Button>
              <Button
                color="secondary"
                variant="soft"
                size="sm"
                pill={false}
                disabled={!codeHistoryState.canRedo}
                onClick={() => codeHistoryActions?.redo()}
                className="[--button-ring-color:transparent]"
              >
                <Redo />
              </Button>
              {!isNew && (
                <Menu>
                  <Menu.Trigger>
                    <Button color="secondary" variant="soft" size="sm" pill={false} className="[--button-ring-color:transparent]">
                      <DotsHorizontal />
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content minWidth="auto">
                    {canPublish && (
                      <Menu.Item onSelect={() => save({ ...form, status: "active", lastPublishedAt: new Date().toISOString() })}>
                        Publish
                      </Menu.Item>
                    )}
                    {canUnpublish && (
                      <Menu.Item onSelect={() => save({ ...form, status: "draft" })}>Unpublish</Menu.Item>
                    )}
                    <Menu.Separator />
                    <Menu.Item onSelect={handleDelete} className="text-[var(--color-text-danger-ghost)]">
                      Delete
                    </Menu.Item>
                  </Menu.Content>
                </Menu>
              )}
              <Button
                color="primary"
                size="sm"
                pill={false}
                onClick={() => save()}
                loading={saveState === "saving"}
                disabled={!isDirty || saveState !== "idle"}
              >
                {saveState === "saved" ? "Saved!" : "Save"}
              </Button>
            </div>
          </div>
        }
      />

      <div className="min-h-0 flex-1">
        <FlowEditor
          initialYaml={form.flowYaml}
          onChange={(yaml) => patch({ flowYaml: yaml })}
          panel={editorPanel}
          onPanelChange={setEditorPanel}
          onCodeHistoryChange={setCodeHistoryState}
          onCodeHistoryActionsReady={setCodeHistoryActions}
          settingsPanel={
            <div className="flex flex-col gap-4 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text)]">Name</label>
                <Input value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. KYC + AML Standard" size="sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text)]">Description</label>
                <Input value={form.description} onChange={(e) => patch({ description: e.target.value })} placeholder="Optional description" size="sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text)]">Expires in (days)</label>
                <Input type="number" value={String(form.settings.expiresInDays)} onChange={(e) => patchSettings({ expiresInDays: Number(e.target.value) || 0 })} size="sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text)]">Redirect URL</label>
                <Input value={form.settings.redirectUrl} onChange={(e) => patchSettings({ redirectUrl: e.target.value })} placeholder="https://..." size="sm" />
              </div>
            </div>
          }
        />
      </div>

      <ConfirmLeaveModal open={showLeaveConfirm} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </div>
  );
}
