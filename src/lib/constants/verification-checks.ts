import type { CheckCategory, VerificationType } from "@/lib/types";

export interface AvailableCheck {
  name: string;
  category: CheckCategory;
  defaultRequired: boolean;
  defaultEnabled: boolean;
}

export const AVAILABLE_CHECKS: Record<VerificationType, AvailableCheck[]> = {
  government_id: [
    { name: "ID Document Authenticity", category: "fraud", defaultRequired: true, defaultEnabled: true },
    { name: "ID Not Expired", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Barcode Detection", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "ID Tampering Detection", category: "fraud", defaultRequired: true, defaultEnabled: true },
    { name: "Face Clarity", category: "biometrics", defaultRequired: false, defaultEnabled: true },
    { name: "Country Supported", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Hologram Presence", category: "fraud", defaultRequired: false, defaultEnabled: false },
    { name: "Passport MRZ Validation", category: "validity", defaultRequired: false, defaultEnabled: false },
  ],
  selfie: [
    { name: "Liveness Detection", category: "biometrics", defaultRequired: true, defaultEnabled: true },
    { name: "Face Match to ID", category: "biometrics", defaultRequired: true, defaultEnabled: true },
    { name: "Face Clarity", category: "biometrics", defaultRequired: false, defaultEnabled: true },
    { name: "Glasses Detection", category: "biometrics", defaultRequired: false, defaultEnabled: false },
    { name: "Head Movement Challenge", category: "biometrics", defaultRequired: false, defaultEnabled: false },
  ],
  database: [
    { name: "Name Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Date of Birth Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Address Match", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "SSN/TIN Match", category: "validity", defaultRequired: false, defaultEnabled: false },
    { name: "Phone Ownership Match", category: "validity", defaultRequired: false, defaultEnabled: false },
    { name: "Carrier Risk Score", category: "fraud", defaultRequired: false, defaultEnabled: false },
  ],
  document: [
    { name: "Document Readable", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Document Not Expired", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Document Tampering", category: "fraud", defaultRequired: true, defaultEnabled: true },
    { name: "Name Matches ID", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "Address Line Extraction", category: "validity", defaultRequired: false, defaultEnabled: false },
    { name: "Issue Date Window", category: "validity", defaultRequired: false, defaultEnabled: false },
  ],
  aamva: [
    { name: "Name Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Date of Birth Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "License Number Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Issuing Authority Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Expiration Date Check", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Address Match", category: "validity", defaultRequired: false, defaultEnabled: true },
  ],
  database_phone_carrier: [
    { name: "Phone Number Active", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Carrier Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Name Match", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "Address Match", category: "validity", defaultRequired: false, defaultEnabled: false },
    { name: "Carrier Risk Score", category: "fraud", defaultRequired: false, defaultEnabled: true },
  ],
  database_ssn: [
    { name: "Name Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Date of Birth Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Address Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "SSN Match", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "SSN Issuance Check", category: "fraud", defaultRequired: false, defaultEnabled: true },
  ],
  email_address: [
    { name: "Email Deliverable", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Email Domain Valid", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Email Not Disposable", category: "fraud", defaultRequired: true, defaultEnabled: true },
    { name: "Email Age Check", category: "fraud", defaultRequired: false, defaultEnabled: true },
    { name: "Email Breach Database", category: "fraud", defaultRequired: false, defaultEnabled: false },
  ],
  phone_number: [
    { name: "Phone Number Valid", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "OTP Verified", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Phone Not VoIP", category: "fraud", defaultRequired: false, defaultEnabled: true },
    { name: "Carrier Lookup", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "Phone Country Match", category: "validity", defaultRequired: false, defaultEnabled: false },
  ],
  health_insurance_card: [
    { name: "Card Readable", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Card Not Expired", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Issuer Recognized", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Member ID Extraction", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Card Tampering Detection", category: "fraud", defaultRequired: false, defaultEnabled: true },
  ],
  vehicle_insurance: [
    { name: "Card Readable", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Policy Not Expired", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Insurer Recognized", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "VIN Extraction", category: "validity", defaultRequired: false, defaultEnabled: true },
    { name: "Policy Number Extraction", category: "validity", defaultRequired: true, defaultEnabled: true },
    { name: "Card Tampering Detection", category: "fraud", defaultRequired: false, defaultEnabled: true },
  ],
};
