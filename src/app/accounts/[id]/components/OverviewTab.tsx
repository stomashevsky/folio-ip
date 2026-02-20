import { useState } from "react";
import Image from "next/image";
import { Avatar } from "@plexui/ui/components/Avatar";
import { SectionHeading, KeyValueTable, DocumentViewer } from "@/components/shared";
import { formatDate, formatDateTime, toTitleCase } from "@/lib/utils/format";
import type { Account, Inquiry, Verification, DocumentViewerItem } from "@/lib/types";

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
  const profilePhoto = selfieVer?.photos?.[0] ?? null;

  const viewerItems: DocumentViewerItem[] = profilePhoto
    ? [{ photo: profilePhoto, verificationType: "Selfie" }]
    : [];

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const latestInquiry = inquiries.length > 0
    ? inquiries.reduce((latest, inq) => (inq.createdAt > latest.createdAt ? inq : latest))
    : null;

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Profile</SectionHeading>
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
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
          <div className="-mb-px">
            <KeyValueTable
              bare
              rows={[
                { label: "Name", value: toTitleCase(account.name) },
                { label: "Address", value: account.address ?? "—" },
                { label: "Birthdate", value: account.birthdate ? formatDate(account.birthdate) : "—" },
                { label: "Age", value: account.age ? `${account.age}` : "—" },
                { label: "Gender", value: account.gender ?? "—" },
                { label: "Nationality", value: account.nationality ?? "—" },
                { label: "Email", value: account.email ?? "—" },
                { label: "Phone", value: account.phone ?? "—" },
              ]}
            />
          </div>
        </div>
      </div>

      <div>
        <SectionHeading>Summary</SectionHeading>
        <KeyValueTable
          rows={[
            { label: "Total Inquiries", value: inquiries.length },
            { label: "Total Verifications", value: verifications.length },
            { label: "Latest Inquiry", value: latestInquiry ? `${formatDateTime(latestInquiry.createdAt)} UTC` : "—" },
          ]}
        />
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
