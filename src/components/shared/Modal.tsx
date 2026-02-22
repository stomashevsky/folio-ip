"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/lib/hooks/useScrollLock";
import { Button } from "@plexui/ui/components/Button";
import { CloseBold } from "@plexui/ui/components/Icon";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Max-width class, defaults to "max-w-md" */
  maxWidth?: string;
}

/**
 * Generic modal shell — overlay, Escape key, scroll lock, centered content.
 * Follows the same pattern as TagEditModal.
 */
export function Modal({
  open,
  onOpenChange,
  children,
  maxWidth = "max-w-md",
}: ModalProps) {
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Lock body scroll
  useScrollLock(open);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* Content */}
      <div
        className={`relative z-10 w-full ${maxWidth} rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* Sub-components for consistent layout */

interface ModalHeaderProps {
  children: ReactNode;
  /** When provided, renders a close ✕ button in the top-right corner */
  onClose?: () => void;
}

export function ModalHeader({ children, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-start gap-4 px-5 pt-5 pb-4">
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <Button
          color="secondary"
          variant="ghost"
          size="xs"
          uniform
          onClick={onClose}
          aria-label="Close"
        >
          <CloseBold className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5 px-5 pb-4">{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end gap-2 px-5 py-4">{children}</div>
  );
}

/* ─── OpenAI-pattern modal — use this for ALL settings/config modals ─── */

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Modal title (rendered as heading-md, 18px/600) */
  title: string;
  /** Optional subtitle below title */
  description?: ReactNode;
  /** Footer content — typically Cancel + Save buttons */
  footer: ReactNode;
  children: ReactNode;
  /** Max-width class, defaults to "max-w-lg" */
  maxWidth?: string;
}

/**
 * Reusable modal following the OpenAI settings pattern.
 *
 * Extracted from platform.openai.com — exact computed values:
 * - Dialog: 12px border-radius, no border, shadow-lg
 * - Body padding: 16px 20px (py-4 px-5)
 * - Title: 18px/600 (heading-md), margin-bottom 8px
 * - Title → content gap: mt-4 (16px)
 * - Content fields gap: gap-4 (16px) between field groups
 * - Footer: separate section, padding 16px 20px, flex justify-end, gap-2 (8px)
 * - Buttons: 32px height (md), 8px border-radius (no pill)
 * - Cancel: color="primary" variant="soft"
 * - Action: color="primary" (solid)
 * - Labels: 14px/500 (text-sm font-medium)
 * - Label → input gap: gap-1 (4px)
 */
export function SettingsModal({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  maxWidth = "max-w-lg",
}: SettingsModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} maxWidth={maxWidth}>
      <div className="px-5 py-4">
        <h2 className="heading-md">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
        )}
        <div className="mt-4">{children}</div>
      </div>
      <div className="flex items-center justify-end gap-2 px-5 py-4">{footer}</div>
    </Modal>
  );
}
