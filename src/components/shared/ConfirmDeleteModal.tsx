import { Button } from "@plexui/ui/components/Button";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./Modal";
import type { ReactNode } from "react";

/* ─── Types ─── */

interface ConfirmDeleteModalProps {
  /** Whether the modal is open. */
  open: boolean;
  /** Called when the modal wants to close. */
  onOpenChange: (open: boolean) => void;
  /** Modal heading text. */
  title: string;
  /** Descriptive body content. */
  children: ReactNode;
  /** Label for the confirm button (e.g. "Remove", "Revoke", "Delete"). */
  confirmLabel: string;
  /** Called when the user confirms the action. */
  onConfirm: () => void;
}

/* ─── Component ─── */

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <h2 className="heading-sm text-[var(--color-text)]">{title}</h2>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          variant="soft"
          size="md"
          pill={false}
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button color="danger" size="md" pill={false} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
