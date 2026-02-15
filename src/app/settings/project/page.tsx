"use client";

import { useRef, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";

const INITIAL_PROJECT_NAME = "Default project";

export default function ProjectGeneralPage() {
  const [projectName, setProjectName] = useState(INITIAL_PROJECT_NAME);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasChanges =
    projectName.trim() !== "" && projectName !== INITIAL_PROJECT_NAME;

  const handleSave = () => {
    if (!hasChanges) return;
    setSaveState("saving");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveState("saved");
      timerRef.current = setTimeout(() => setSaveState("idle"), 1500);
    }, 600);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Project settings" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        {/* Project details */}
        <SectionHeading size="xs">Details</SectionHeading>

        <div className="mb-6">
          <Field label="Project name" description="A friendly name for this project, visible across dashboards and reports">
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Field>
          <div className="mt-3">
            <Button
              color="primary"
              pill={false}
              size="sm"
              onClick={handleSave}
              loading={saveState === "saving"}
              disabled={!hasChanges || saveState !== "idle"}
            >
              {saveState === "saved" ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Field label="Project ID" description="Unique identifier for API requests scoped to this project">
            <Input defaultValue="proj_default_2026_aBcDe" disabled />
          </Field>
        </div>

        {/* Configuration */}
        <SectionHeading size="xs">Configuration</SectionHeading>

        <div className="mb-6">
          <Field label="Default inquiry template" description="The template used when creating new inquiries without specifying one">
            <Input defaultValue="Government ID + Selfie" disabled />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Data source" description="Where verification data is sourced from for this project">
            <Input defaultValue="API" disabled />
          </Field>
        </div>
      </div>
    </div>
  );
}
