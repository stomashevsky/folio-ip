"use client";

import { useState } from "react";
import { InlineEmpty, DocumentViewer, KeyValueTable, SectionHeading, PhotoThumbnail } from "@/components/shared";
import { COUNTRY_LABEL_MAP } from "@/lib/constants/countries";
import { DOCUMENT_SECTION_TITLES, ID_CLASS_LABELS } from "@/lib/constants/document-labels";
import { toTitleCase, formatDateTime } from "@/lib/utils/format";
import type { Verification, VerificationType, DocumentViewerItem } from "@/lib/types";

const DOCUMENT_TYPES: VerificationType[] = ["government_id", "document", "health_insurance_card", "vehicle_insurance"];

function getDocVerifications(verifications: Verification[]): Map<string, Verification[]> {
  const groups = new Map<string, Verification[]>();
  for (const v of verifications) {
    if (!DOCUMENT_TYPES.includes(v.type) || !v.photos?.length) continue;
    const section = DOCUMENT_SECTION_TITLES[v.type] ?? v.type;
    const list = groups.get(section) ?? [];
    list.push(v);
    groups.set(section, list);
  }
  return groups;
}

export function DocumentsTab({ verifications }: { verifications: Verification[] }) {
  const groups = getDocVerifications(verifications);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (groups.size === 0) {
    return <InlineEmpty>No documents for this account.</InlineEmpty>;
  }

  const allPhotos: DocumentViewerItem[] = [];
  for (const entries of groups.values()) {
    for (const v of entries) {
      for (const photo of v.photos ?? []) {
        allPhotos.push({
          photo,
          extractedData: v.extractedData,
          verificationType: DOCUMENT_SECTION_TITLES[v.type] ?? v.type,
        });
      }
    }
  }

  let photoOffset = 0;

  return (
    <>
      <div className="space-y-6">
        {Array.from(groups.entries()).map(([section, entries]) => (
          <div key={section}>
            <SectionHeading>{section}</SectionHeading>
            <div className="space-y-4">
              {entries.map((v) => {
                const startIdx = photoOffset;
                photoOffset += v.photos?.length ?? 0;

                return (
                  <div
                    key={v.id}
                    className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                  >
                    {v.photos && v.photos.length > 0 && (
                      <div className="border-b border-[var(--color-border)] px-4 py-4">
                        <div className="flex flex-wrap gap-6">
                          {v.photos.map((photo, i) => (
                            <PhotoThumbnail
                              key={photo.label + i}
                              src={photo.url}
                              label={photo.label}
                              onClick={() => setLightboxIndex(startIdx + i)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="-mb-px">
                      <KeyValueTable
                        bare
                        rows={[
                          ...(v.countryCode
                            ? [{ label: "Country", value: COUNTRY_LABEL_MAP[v.countryCode] ?? v.countryCode }]
                            : []),
                          ...(v.idClass
                            ? [{ label: "ID class", value: ID_CLASS_LABELS[v.idClass] ?? v.idClass }]
                            : []),
                          ...(v.completedAt
                            ? [{ label: "Date processed", value: `${formatDateTime(v.completedAt)} UTC` }]
                            : []),
                          ...Object.entries(v.extractedData ?? {}).map(([key, val]) => ({
                            label: key,
                            value:
                              (key === "Full name" || key === "Address") && typeof val === "string"
                                ? toTitleCase(val)
                                : val,
                          })),
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <DocumentViewer
          items={allPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
