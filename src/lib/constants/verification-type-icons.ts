import type { ComponentType, SVGProps } from "react";
import {
  CreditCard,
  User,
  FileDocument,
  Storage,
  Email,
  Phone,
  ShieldCheck,
  Card,
} from "@plexui/ui/components/Icon";
import type { VerificationType } from "@/lib/types";

export const VERIFICATION_TYPE_ICONS: Record<
  VerificationType,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  government_id: CreditCard,
  selfie: User,
  document: FileDocument,
  database: Storage,
  aamva: CreditCard,
  database_phone_carrier: Phone,
  database_ssn: Storage,
  email_address: Email,
  phone_number: Phone,
  health_insurance_card: ShieldCheck,
  vehicle_insurance: Card,
};
