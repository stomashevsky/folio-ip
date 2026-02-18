"use client";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Button } from "@plexui/ui/components/Button";

interface ConfirmLeaveModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmLeaveModal({
  open,
  onConfirm,
  onCancel,
}: ConfirmLeaveModalProps) {
  return (
    <Modal open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <ModalHeader>
        <h2 className="heading-md">Unsaved changes</h2>
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-[var(--color-text-secondary)]">
          You have unsaved changes that will be lost if you leave this page.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" variant="outline" size="sm" pill={false} onClick={onCancel}>
          Stay
        </Button>
        <Button color="danger" variant="soft" size="sm" pill={false} onClick={onConfirm}>
          Leave
        </Button>
      </ModalFooter>
    </Modal>
  );
}
