import { useState } from "react";
import Image from "next/image";
import { Avatar } from "@plexui/ui/components/Avatar";
import { SectionHeading, KeyValueTable, DocumentViewer } from "@/components/shared";
import { formatDate, toTitleCase } from "@/lib/utils/format";
import type { Account, Inquiry, Verification, DocumentViewerItem } from "@/lib/types";
import { InquiriesTab } from "./InquiriesTab";

export function OverviewTab({
  account,
  inquiries,
  verifications,
}: {
  account: Account;
  inquiries: Inquiry[];
  verifications: Verification[];
}) {
  const selfieVer = verifications.find((v) => v.type === "selfie");
  const govIdVer = verifications.find((v) => v.type === "government_id");
  const profilePhoto =
    selfieVer?.photos?.[0] ?? govIdVer?.photos?.[0] ?? null;

  const viewerItems: DocumentViewerItem[] = profilePhoto
    ? [{ photo: profilePhoto, extractedData: govIdVer?.extractedData, verificationType: selfieVer ? "Selfie" : "Government ID" }]
    : [];

  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Profile</SectionHeading>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="px-5 py-4">
            {profilePhoto ? (
              <button
                className="group cursor-pointer outline-none"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={profilePhoto.url}
                  alt={profilePhoto.label}
                  width={160}
                  height={160}
                  className="h-[160px] w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-contain transition-opacity group-hover:opacity-90"
                />
              </button>
            ) : (
              <Avatar name={account.name} size={160} color="primary" />
            )}
          </div>
          <KeyValueTable
            bare
            rows={[
              { label: "Name", value: toTitleCase(account.name) },
              { label: "Address", value: account.address ?? "—" },
              { label: "Birthdate", value: account.birthdate ? formatDate(account.birthdate) : "—" },
              { label: "Age", value: account.age ? `${account.age}` : "—" },
            ]}
          />
        </div>
      </div>

      <div>
        <SectionHeading badge={inquiries.length}>Inquiries</SectionHeading>
        <InquiriesTab inquiries={inquiries} />
      </div>

      {lightboxOpen && viewerItems.length > 0 && (
        <DocumentViewer
          items={viewerItems}
          initialIndex={0}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
