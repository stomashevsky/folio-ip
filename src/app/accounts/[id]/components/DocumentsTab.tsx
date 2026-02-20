"use client";

import { useState } from "react";
import Image from "next/image";
import { InlineEmpty, DocumentViewer } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { VERIFICATION_TYPE_LABELS } from "@/lib/constants/verification-type-labels";
import { formatDateTime } from "@/lib/utils/format";
import type { Verification, DocumentViewerItem } from "@/lib/types";

interface DocumentEntry {
  label: string;
  url: string;
  type: string;
  capturedAt: string;
  status: string;
  verificationId: string;
}

function extractDocuments(verifications: Verification[]): DocumentEntry[] {
  const docs: DocumentEntry[] = [];
  for (const v of verifications) {
    if (!v.photos) continue;
    const typeLabel = VERIFICATION_TYPE_LABELS[v.type] ?? v.type;
    for (const photo of v.photos) {
      docs.push({
        label: `${typeLabel} — ${photo.label}`,
        url: photo.url,
        type: typeLabel,
        capturedAt: v.createdAt,
        status: v.status,
        verificationId: v.id,
      });
    }
  }
  return docs;
}

export function DocumentsTab({ verifications }: { verifications: Verification[] }) {
  const documents = extractDocuments(verifications);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (documents.length === 0) {
    return <InlineEmpty>No documents for this account.</InlineEmpty>;
  }

  const viewerItems: DocumentViewerItem[] = documents.map((doc) => ({
    photo: { url: doc.url, label: doc.label, captureMethod: "auto" as const },
    verificationType: doc.type,
  }));

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((doc, i) => (
          <button
            key={`${doc.verificationId}-${doc.label}`}
            type="button"
            className="group flex cursor-pointer gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left outline-none transition-colors hover:bg-[var(--color-surface-secondary)]"
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={doc.url}
              alt={doc.label}
              width={80}
              height={80}
              className="h-20 w-20 shrink-0 rounded-lg border border-[var(--color-border)] object-contain transition-opacity group-hover:opacity-90"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-text)]">{doc.label}</p>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{formatDateTime(doc.capturedAt)} UTC</p>
              <div className="mt-2">
                <StatusBadge status={doc.status} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <DocumentViewer
          items={viewerItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
