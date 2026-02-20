"use client";

import { useState, useCallback } from "react";
import { useSavedViews, type ViewState } from "@/lib/hooks/useSavedViews";
import {
  TOPBAR_CONTROL_SIZE,
  TOPBAR_ACTION_PILL,
} from "@/components/layout/TopBar";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { SelectControl } from "@plexui/ui/components/SelectControl";
import { CloseBold } from "@plexui/ui/components/Icon";

interface SavedViewsControlProps {
  entityType: string;
  currentState: ViewState;
  onLoadView: (state: ViewState) => void;
  onClearView: () => void;
}

export function SavedViewsControl({
  entityType,
  currentState,
  onLoadView,
  onClearView,
}: SavedViewsControlProps) {
  const { views, activeView, saveView, loadView, deleteView, clearActiveView } =
    useSavedViews(entityType);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [viewName, setViewName] = useState("");

  const handleSave = useCallback(() => {
    const trimmed = viewName.trim();
    if (!trimmed) return;
    saveView(trimmed, currentState);
    setViewName("");
    setSaveModalOpen(false);
  }, [viewName, currentState, saveView]);

  const handleLoad = useCallback(
    (id: string) => {
      const view = views.find((v) => v.id === id);
      if (!view) return;
      loadView(id);
      onLoadView({
        filters: view.filters,
        columnVisibility: view.columnVisibility,
      });
    },
    [views, loadView, onLoadView],
  );

  const handleClear = useCallback(() => {
    clearActiveView();
    onClearView();
  }, [clearActiveView, onClearView]);

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      e.preventDefault();
      deleteView(id);
    },
    [deleteView],
  );

  return (
    <>
      <Menu>
        <Menu.Trigger>
          <SelectControl
            selected={!!activeView}
            variant="outline"
            size={TOPBAR_CONTROL_SIZE}
            pill={TOPBAR_ACTION_PILL}
            block={false}
          >
            {activeView ? activeView.name : "Views"}
          </SelectControl>
        </Menu.Trigger>
        <Menu.Content align="end" minWidth={220}>
          {views.length > 0 && (
            <>
              {views.map((view) => (
                <Menu.Item
                  key={view.id}
                  onSelect={() => handleLoad(view.id)}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate">{view.name}</span>
                    <button
                      type="button"
                      className="shrink-0 rounded p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-danger-ghost)]"
                      onClick={(e) => handleDelete(e, view.id)}
                    >
                      <CloseBold className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </Menu.Item>
              ))}
              <Menu.Separator />
            </>
          )}
          <Menu.Item onSelect={() => setSaveModalOpen(true)}>
            Save current view
          </Menu.Item>
          {activeView && (
            <Menu.Item onSelect={handleClear}>Clear view</Menu.Item>
          )}
        </Menu.Content>
      </Menu>

      <Modal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        maxWidth="max-w-sm"
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">
            Save current view
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            Save the current filters and column settings as a named view.
          </p>
        </ModalHeader>
        <ModalBody>
          <Input
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            placeholder="View name"
            size="sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="outline"
            size="sm"
            pill={false}
            onClick={() => {
              setSaveModalOpen(false);
              setViewName("");
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            pill={false}
            onClick={handleSave}
            disabled={!viewName.trim()}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
