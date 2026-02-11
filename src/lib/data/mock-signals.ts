import type { InquirySignal } from "@/lib/types";
import { mockInquiries } from "./mock-inquiries";

const featuredSignals: Omit<InquirySignal, "value" | "flagged">[] = [
  { name: "Behavior Threat Level", type: "Processed", category: "featured" },
  { name: "Geolocation To Residency Delta", type: "Raw", category: "featured" },
  { name: "Proxy Detected", type: "Raw", category: "featured" },
  { name: "Rooted Device Detected", type: "Raw", category: "featured" },
  { name: "Sessions Geolocation Delta", type: "Raw", category: "featured" },
  { name: "Network Threat Level", type: "Raw", category: "featured" },
  { name: "User Agent Spoof Attempts", type: "Raw", category: "featured" },
];

const networkSignals: Omit<InquirySignal, "value" | "flagged">[] = [
  { name: "IP Address Risk Score", type: "Processed", category: "network" },
  { name: "VPN Detected", type: "Raw", category: "network" },
  { name: "Tor Exit Node", type: "Raw", category: "network" },
  { name: "ISP Name", type: "Raw", category: "network" },
];

const behavioralSignals: Omit<InquirySignal, "value" | "flagged">[] = [
  { name: "Completion Time", type: "Processed", category: "behavioral" },
  { name: "Distraction Events", type: "Raw", category: "behavioral" },
  { name: "Hesitation Percent", type: "Raw", category: "behavioral" },
  { name: "Copy Paste Events", type: "Raw", category: "behavioral" },
];

const deviceSignals: Omit<InquirySignal, "value" | "flagged">[] = [
  { name: "Browser Language", type: "Raw", category: "device" },
  { name: "Screen Resolution", type: "Raw", category: "device" },
  { name: "Timezone Offset", type: "Raw", category: "device" },
  { name: "Platform", type: "Raw", category: "device" },
];

function generateValue(
  signal: Omit<InquirySignal, "value" | "flagged">,
  idx: number
): { value: string; flagged: boolean } {
  switch (signal.name) {
    case "Behavior Threat Level":
      return { value: idx % 5 === 0 ? "Medium" : "Low", flagged: idx % 5 === 0 };
    case "Geolocation To Residency Delta":
      const dist = (idx * 317) % 5000;
      return {
        value: dist > 1000 ? `${(dist / 1000).toFixed(1)} km` : `${dist} m`,
        flagged: dist > 2000,
      };
    case "Proxy Detected":
      return { value: idx % 7 === 0 ? "true" : "false", flagged: idx % 7 === 0 };
    case "Rooted Device Detected":
      return { value: "false", flagged: false };
    case "Sessions Geolocation Delta":
      return { value: `${(idx * 13) % 100} m`, flagged: false };
    case "Network Threat Level":
      return { value: idx % 4 === 0 ? "Medium" : "Low", flagged: idx % 4 === 0 };
    case "User Agent Spoof Attempts":
      return { value: String((idx * 3) % 2), flagged: (idx * 3) % 2 > 0 };
    case "IP Address Risk Score":
      const score = (idx * 23) % 100;
      return { value: String(score), flagged: score > 70 };
    case "VPN Detected":
      return { value: idx % 8 === 0 ? "true" : "false", flagged: idx % 8 === 0 };
    case "Tor Exit Node":
      return { value: "false", flagged: false };
    case "ISP Name":
      const isps = ["Comcast", "AT&T", "Verizon", "Deutsche Telekom", "BT Group", "Orange"];
      return { value: isps[idx % isps.length], flagged: false };
    case "Completion Time":
      return { value: `${120 + (idx * 17) % 300}s`, flagged: false };
    case "Distraction Events":
      return { value: String((idx * 7) % 5), flagged: (idx * 7) % 5 > 3 };
    case "Hesitation Percent":
      return { value: `${(idx * 11) % 30}%`, flagged: false };
    case "Copy Paste Events":
      return { value: String((idx * 5) % 3), flagged: false };
    case "Browser Language":
      const langs = ["en-US", "es-ES", "fr-FR", "de-DE", "ja-JP", "zh-CN"];
      return { value: langs[idx % langs.length], flagged: false };
    case "Screen Resolution":
      const res = ["1920x1080", "2560x1440", "1440x900", "3840x2160"];
      return { value: res[idx % res.length], flagged: false };
    case "Timezone Offset":
      const offsets = ["-8", "-5", "0", "+1", "+9", "+8"];
      return { value: `UTC${offsets[idx % offsets.length]}`, flagged: false };
    case "Platform":
      const platforms = ["macOS", "Windows", "iOS", "Android", "Linux"];
      return { value: platforms[idx % platforms.length], flagged: false };
    default:
      return { value: "—", flagged: false };
  }
}

export function getSignalsForInquiry(inquiryId: string): InquirySignal[] {
  const inquiry = mockInquiries.find((i) => i.id === inquiryId);
  if (!inquiry) return [];

  // No signals for very early statuses
  if (inquiry.status === "created") return [];

  const idx =
    inquiryId.charCodeAt(4) +
    inquiryId.charCodeAt(5) * 3 +
    inquiryId.charCodeAt(6) * 7;

  const allSignalDefs = [
    ...featuredSignals,
    ...networkSignals,
    ...behavioralSignals,
    ...deviceSignals,
  ];

  return allSignalDefs.map((def) => {
    const { value, flagged } = generateValue(def, idx);
    return { ...def, value, flagged };
  });
}
