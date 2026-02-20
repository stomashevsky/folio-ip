"use client";

import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Field } from "@plexui/ui/components/Field";
import { Switch } from "@plexui/ui/components/Switch";
import { Checkbox } from "@plexui/ui/components/Checkbox";

interface AccountType {
  id: string;
  name: string;
  description: string;
  accountsCount: number;
  requiredFields: string[];
  autoApprove: boolean;
  createdAt: string;
}

const ALL_FIELDS = [
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "dateOfBirth", label: "Date of Birth" },
  { id: "ssn", label: "SSN / Tax ID" },
  { id: "businessName", label: "Business Name" },
  { id: "ein", label: "EIN" },
  { id: "businessAddress", label: "Business Address" },
  { id: "ownerInfo", label: "Owner Info" },
  { id: "corporateName", label: "Corporate Name" },
  { id: "boardMembers", label: "Board Members" },
  { id: "complianceOfficer", label: "Compliance Officer" },
  { id: "trustName", label: "Trust Name" },
  { id: "trusteeInfo", label: "Trustee Info" },
  { id: "beneficiaries", label: "Beneficiaries" },
  { id: "trustDocument", label: "Trust Document" },
  { id: "orgName", label: "Organization Name" },
  { id: "501c3Status", label: "501(c)(3) Status" },
];

const MOCK_ACCOUNT_TYPES: AccountType[] = [
  { id: "at_001", name: "Individual", description: "Personal account for individual users", accountsCount: 1245, requiredFields: ["firstName", "lastName", "dateOfBirth", "ssn"], autoApprove: false, createdAt: "2024-01-15T10:30:00Z" },
  { id: "at_002", name: "Business", description: "Account for small to medium businesses", accountsCount: 342, requiredFields: ["businessName", "ein", "businessAddress", "ownerInfo"], autoApprove: false, createdAt: "2024-02-20T14:15:00Z" },
  { id: "at_003", name: "Corporate", description: "Enterprise-level corporate accounts", accountsCount: 89, requiredFields: ["corporateName", "ein", "boardMembers", "complianceOfficer"], autoApprove: true, createdAt: "2024-03-10T09:45:00Z" },
  { id: "at_004", name: "Trust", description: "Trust and fiduciary accounts", accountsCount: 156, requiredFields: ["trustName", "trusteeInfo", "beneficiaries", "trustDocument"], autoApprove: false, createdAt: "2024-04-05T11:20:00Z" },
  { id: "at_005", name: "Non-Profit", description: "Non-profit organization accounts", accountsCount: 78, requiredFields: ["orgName", "ein", "501c3Status", "boardMembers"], autoApprove: true, createdAt: "2024-05-12T16:00:00Z" },
];

export default function AccountTypeDetailPage() {
  const params = useParams();
  const accountType = MOCK_ACCOUNT_TYPES.find((t) => t.id === params.id);

  if (!accountType) {
    return <NotFoundPage section="Account Types" backHref="/accounts/types" entity="Account Type" />;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={accountType.name}
        backHref="/accounts/types"
        actions={
          <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
            Save Changes
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Details</SectionHeading>
        <div className="mt-4 space-y-4">
          <Field label="Name">
            <Input defaultValue={accountType.name} size="sm" />
          </Field>
          <Field label="Description">
            <Textarea defaultValue={accountType.description} rows={2} />
          </Field>
          <Field label="Active Accounts">
            <div className="py-1">
              <Badge color="info" variant="soft" size="sm">
                {accountType.accountsCount.toLocaleString()}
              </Badge>
            </div>
          </Field>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Approval</SectionHeading>
          <div className="mt-4">
            <Switch
              checked={accountType.autoApprove}
              onCheckedChange={() => {}}
              label="Auto-approve accounts of this type"
            />
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Required Fields</SectionHeading>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            Select the fields required for this account type.
          </p>
          <div className="mt-4 space-y-3">
            {ALL_FIELDS.map((field) => (
              <Checkbox
                key={field.id}
                checked={accountType.requiredFields.includes(field.id)}
                onCheckedChange={() => {}}
                label={field.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
