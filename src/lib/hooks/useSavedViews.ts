"use client";

import { useState, useCallback, useMemo, useSyncExternalStore } from "react";

export interface SavedView {
  id: string;
  name: string;
  entityType: string;
  filters: Record<string, string[]>;
  columnVisibility: Record<string, boolean>;
  createdAt: string;
}

export interface ViewState {
  filters: Record<string, string[]>;
  columnVisibility: Record<string, boolean>;
}

const STORAGE_KEY = "folio-saved-views";

function readAll(): SavedView[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as SavedView[];
  } catch {
    return [];
  }
}

function writeAll(views: SavedView[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
  // Dispatch storage event so useSyncExternalStore re-reads in the same tab
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

export function useSavedViews(entityType: string) {
  const allViews = useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    () => localStorage.getItem(STORAGE_KEY) ?? "[]",
    () => "[]",
  );
  const views = useMemo(
    () => (JSON.parse(allViews) as SavedView[]).filter((v) => v.entityType === entityType),
    [allViews, entityType],
  );
  const [activeViewId, setActiveViewId] = useState<string | null>(null);

  const saveView = useCallback(
    (name: string, state: ViewState): SavedView => {
      const newView: SavedView = {
        id: crypto.randomUUID(),
        name,
        entityType,
        filters: state.filters,
        columnVisibility: state.columnVisibility,
        createdAt: new Date().toISOString(),
      };
      const all = readAll();
      all.push(newView);
      writeAll(all);
      setActiveViewId(newView.id);
      return newView;
    },
    [entityType],
  );

  const loadView = useCallback((id: string) => {
    setActiveViewId(id);
  }, []);

  const deleteView = useCallback(
    (id: string) => {
      const all = readAll().filter((v) => v.id !== id);
      writeAll(all);
      if (activeViewId === id) setActiveViewId(null);
    },
    [activeViewId],
  );

  const clearActiveView = useCallback(() => {
    setActiveViewId(null);
  }, []);

  const activeView = views.find((v) => v.id === activeViewId) ?? null;

  return {
    views,
    activeView,
    activeViewId,
    saveView,
    loadView,
    deleteView,
    clearActiveView,
  };
}
