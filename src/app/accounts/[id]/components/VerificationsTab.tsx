"use client";

import { useState } from "react";
import { InlineEmpty, DocumentViewer } from "@/components/shared";
import { VerificationCard } from "@/components/shared/VerificationCard";
import type { Verification, DocumentViewerItem } from "@/lib/types";


export function VerificationsTab({
  verifications,
}: {
  verifications: Verification[];
}) {
  const [lightboxVerId, setLightboxVerId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  if (verifications.length === 0) {
    return (
      <InlineEmpty>No verifications for this account.</InlineEmpty>
    );
  }

  const lightboxVer = lightboxVerId
    ? verifications.find((vv) => vv.id === lightboxVerId)
    : null;
  const lightboxItems: DocumentViewerItem[] = lightboxVer
    ? (lightboxVer.photos ?? []).map((photo) => ({
        photo,
        extractedData: lightboxVer.extractedData,
        verificationType:
          lightboxVer.type === "government_id"
            ? "Government ID"
            : lightboxVer.type === "selfie"
              ? "Selfie"
              : lightboxVer.type,
      }))
    : [];

  return (
    <div className="space-y-6">
      {verifications.map((v) => (
        <VerificationCard
          key={v.id}
          verification={v}
          onOpenLightbox={(verId, index) => {
            setLightboxVerId(verId);
            setLightboxIndex(index);
          }}
        />
      ))}

      {lightboxVerId !== null && lightboxItems.length > 0 && (
        <DocumentViewer
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxVerId(null)}
        />
      )}
    </div>
  );
}
