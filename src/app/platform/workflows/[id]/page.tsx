"use client";

import { Suspense, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, ConfirmLeaveModal } from "@/components/shared";
import { FlowEditor, type FlowEditorPanel } from "@/components/flow/FlowEditor";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { useTemplateForm } from "@/lib/hooks/useTemplateForm";
import { WORKFLOW_PRESETS } from "@/lib/constants/template-presets";
import { WORKFLOW_FLOW_TEMPLATES, DEFAULT_WORKFLOW_YAML } from "@/lib/constants/flow-templates";
import { FLOW_CHAT_EMPTY_STATE_TITLE } from "@/lib/constants";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import { WORKFLOW_TRIGGER_OPTIONS } from "@/lib/constants/filter-options";
import type { Workflow, WorkflowStatus, WorkflowTriggerType } from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Select } from "@plexui/ui/components/Select";
import { Menu } from "@plexui/ui/components/Menu";
import { DotsHorizontal, Undo, Redo, PlayCircle } from "@plexui/ui/components/Icon";


interface WorkflowForm {
  name: string;
  description: string;
  status: WorkflowStatus;
  lastPublishedAt?: string;
  flowYaml: string;
  triggerEvent: WorkflowTriggerType;
  triggerConditions: string;
}

const DEFAULT_FORM: WorkflowForm = {
  name: "",
  description: "",
  status: "draft",
  flowYaml: DEFAULT_WORKFLOW_YAML,
  triggerEvent: "inquiry.completed",
  triggerConditions: "",
};

function buildFormFromPreset(presetParam: string): WorkflowForm {
  const preset = WORKFLOW_PRESETS.find((p: { id: string }) => p.id === presetParam);
  if (!preset) return DEFAULT_FORM;
  return {
    name: preset.defaults.name,
    description: preset.defaults.description ?? "",
    status: "draft",
    flowYaml: DEFAULT_WORKFLOW_YAML,
    triggerEvent: preset.defaults.triggerEvent,
    triggerConditions: preset.defaults.triggerConditions ?? "",
  };
}

function toForm(w: Workflow): WorkflowForm {
  return {
    name: w.name,
    description: w.description ?? "",
    status: w.status,
    lastPublishedAt: w.lastPublishedAt,
    flowYaml: WORKFLOW_FLOW_TEMPLATES[w.id] ?? DEFAULT_WORKFLOW_YAML,
    triggerEvent: w.trigger.event,
    triggerConditions: w.trigger.conditions
      ? Object.entries(w.trigger.conditions)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
      : "",
  };
}

export default function WorkflowDetailPage() {
  return (
    <Suspense fallback={null}>
      <WorkflowDetailContent />
    </Suspense>
  );
}

function WorkflowDetailContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { workflows } = useTemplateStore();

  const { form, setForm, patch, isNew, existing } = useTemplateForm({
    id,
    getExisting: workflows.getById,
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
  const [showSimulateMsg, setShowSimulateMsg] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setInitialForm(existing ? toForm(existing) : DEFAULT_FORM);
  }

  const isDirty = isNew || JSON.stringify(form) !== JSON.stringify(initialForm);
  const { confirmNavigation, showLeaveConfirm, confirmLeave, cancelLeave } = useUnsavedChanges(isDirty);

  if (!isNew && !existing) {
    return <NotFoundPage section="Workflows" backHref="/platform/workflows" entity="Workflow" />;
  }

  function save(formOverride?: WorkflowForm) {
    const f = formOverride ?? form;
    if (formOverride) setForm(f);
    setSaveState("saving");
    clearTimeout(saveTimerRef.current);

    const conditionsObj: Record<string, string> = {};
    if (f.triggerConditions.trim()) {
      f.triggerConditions.split(",").forEach((pair) => {
        const [key, ...rest] = pair.split(":");
        if (key?.trim()) conditionsObj[key.trim()] = rest.join(":").trim();
      });
    }

    const payload: Omit<Workflow, "id" | "createdAt" | "updatedAt"> = {
      name: f.name,
      description: f.description.trim() || undefined,
      status: f.status,
      lastPublishedAt: f.lastPublishedAt,
      trigger: {
        event: f.triggerEvent,
        conditions: Object.keys(conditionsObj).length > 0 ? conditionsObj : undefined,
      },
      steps: existing?.steps ?? [],
      runsCount: existing?.runsCount ?? 0,
      lastRunAt: existing?.lastRunAt,
    };
    if (isNew) {
      const created = workflows.create(payload);
      router.replace(`/platform/workflows/${created.id}`);
    } else {
      workflows.update(id, payload);
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
    workflows.delete(id);
    router.push("/platform/workflows");
  }

  const title = isNew ? "New workflow" : (existing?.name ?? "Workflow");
  const canPublish = form.status === "draft";
  const canUnpublish = form.status === "active";
  const backHref = "/platform/workflows";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title={
          <span className="flex items-center gap-2">
            {title}
            {!isNew && (
              <>
                <Badge color={getStatusColor(form.status) as "warning" | "success" | "secondary"} size="sm">
                  {form.status}
                </Badge>
                <Badge color={form.lastPublishedAt ? "info" : "secondary"} variant="outline" size="sm">
                  {form.lastPublishedAt ? "Version: Published" : "Version: Draft"}
                </Badge>
              </>
            )}
          </span>
        }
        backHref={backHref}
        backLabel="Workflows"
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
              <SegmentedControl.Tab value="chat">{FLOW_CHAT_EMPTY_STATE_TITLE}</SegmentedControl.Tab>
              <SegmentedControl.Tab value="code">Code</SegmentedControl.Tab>
              <SegmentedControl.Tab value="settings">Settings</SegmentedControl.Tab>
            </SegmentedControl>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                color="secondary"
                variant="soft"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
                disabled={!codeHistoryState.canUndo}
                onClick={() => codeHistoryActions?.undo()}
                className="[--button-ring-color:transparent]"
              >
                <Undo />
              </Button>
              <Button
                color="secondary"
                variant="soft"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
                disabled={!codeHistoryState.canRedo}
                onClick={() => codeHistoryActions?.redo()}
                className="[--button-ring-color:transparent]"
              >
                <Redo />
              </Button>
              {!isNew && (
                <Menu>
                  <Menu.Trigger>
                    <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL} className="[--button-ring-color:transparent]">
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
                color="secondary"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
                onClick={() => {
                  setShowSimulateMsg(true);
                  setTimeout(() => setShowSimulateMsg(false), 3000);
                }}
              >
                <PlayCircle />
                <span className="hidden md:inline">Simulate</span>
              </Button>
              <Button
                color="primary"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
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
          mode="workflow"
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
                <Input value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Auto-approve Low Risk" size="sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text)]">Description</label>
                <Textarea value={form.description} onChange={(e) => patch({ description: e.target.value })} placeholder="Optional description" rows={2} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text)]">Trigger event</label>
                <Select
                  options={WORKFLOW_TRIGGER_OPTIONS}
                  value={form.triggerEvent}
                  onChange={(opt) => {
                    if (opt) patch({ triggerEvent: opt.value as WorkflowTriggerType });
                  }}
                  block
                  pill={false}
                  size="sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text)]">Trigger conditions</label>
                <Input
                  value={form.triggerConditions}
                  onChange={(e) => patch({ triggerConditions: e.target.value })}
                  placeholder="e.g. riskScore: < 30, status: approved"
                  size="sm"
                />
              </div>
            </div>
          }
        />
      </div>

      {showSimulateMsg && (
        <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 shadow-200">
          <span className="text-sm text-[var(--color-text-secondary)]">Simulation is not yet available</span>
        </div>
      )}
      <ConfirmLeaveModal open={showLeaveConfirm} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </div>
  );
}
