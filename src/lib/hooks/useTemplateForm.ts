"use client";

import { useState } from "react";

/* ─── Types ─── */

interface UseTemplateFormOptions<TEntity, TForm> {
  /** Route param id (e.g. "new" or a real id). */
  id: string;
  /** Looks up an existing entity by id. Return undefined if not found. */
  getExisting: (id: string) => TEntity | undefined;
  /** The `?preset=...` search param value, or null. */
  presetParam: string | null;
  /** Converts a persisted entity into the local form shape. */
  toForm: (entity: TEntity) => TForm;
  /** Builds a form from a preset id. Falls back to `defaultForm` if preset not found. */
  buildFromPreset: (presetId: string) => TForm;
  /** The empty form used when creating a new template without a preset. */
  defaultForm: TForm;
}

interface UseTemplateFormReturn<TEntity, TForm> {
  /** The current form state. */
  form: TForm;
  /** Raw state setter for advanced updates (e.g. array mutations). */
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  /** Shallow-merge partial values into the form. */
  patch: (partial: Partial<TForm>) => void;
  /** Whether this is a new (unsaved) template. */
  isNew: boolean;
  /** The persisted entity, or undefined if new. */
  existing: TEntity | undefined;
}

/* ─── Hook ─── */

export function useTemplateForm<TEntity, TForm>({
  id,
  getExisting,
  presetParam,
  toForm,
  buildFromPreset,
  defaultForm,
}: UseTemplateFormOptions<TEntity, TForm>): UseTemplateFormReturn<
  TEntity,
  TForm
> {
  const isNew = id === "new";
  const existing = isNew ? undefined : getExisting(id);

  const [form, setForm] = useState<TForm>(() => {
    if (existing) return toForm(existing);
    if (presetParam) return buildFromPreset(presetParam);
    return defaultForm;
  });

  // Sync form when route param changes (e.g. navigating between templates).
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setForm(existing ? toForm(existing) : defaultForm);
  }

  function patch(partial: Partial<TForm>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  return { form, setForm, patch, isNew, existing };
}
