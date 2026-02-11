import type { InquirySession } from "@/lib/types";
import { mockInquiries } from "./mock-inquiries";
import { generateId } from "./id-generator";

const devices = [
  "Mac desktop, Chrome",
  "Windows desktop, Chrome",
  "Mac desktop, Safari",
  "Windows desktop, Edge",
  "Mac desktop, Firefox",
  "iPhone, Safari",
  "Android, Chrome",
];

const locations: { lat: number; lng: number; location: string; country: string }[] = [
  { lat: 37.7510, lng: -97.8220, location: "California", country: "United States of America" },
  { lat: 40.7128, lng: -74.0060, location: "New York", country: "United States of America" },
  { lat: 51.5074, lng: -0.1278, location: "London", country: "United Kingdom" },
  { lat: 48.8566, lng: 2.3522, location: "Paris", country: "France" },
  { lat: 35.6762, lng: 139.6503, location: "Tokyo", country: "Japan" },
  { lat: 52.5200, lng: 13.4050, location: "Berlin", country: "Germany" },
  { lat: 40.4168, lng: -3.7038, location: "Madrid", country: "Spain" },
  { lat: 55.7558, lng: 37.6173, location: "Moscow", country: "Russia" },
];

const ipAddresses = [
  "62.42.98.207", "184.23.156.45", "91.108.42.33", "203.67.11.89",
  "72.134.88.201", "156.43.21.99", "88.215.77.143", "110.45.200.12",
];

export function getSessionsForInquiry(inquiryId: string): InquirySession[] {
  const inquiry = mockInquiries.find((i) => i.id === inquiryId);
  if (!inquiry) return [];

  // Deterministic index based on inquiry ID
  const idx =
    inquiryId.charCodeAt(4) +
    inquiryId.charCodeAt(5) * 7 +
    inquiryId.charCodeAt(6) * 13;

  const loc = locations[idx % locations.length];
  const sessionStart = new Date(
    new Date(inquiry.createdAt).getTime() + 3000
  );

  return [
    {
      id: generateId("ses", idx),
      inquiryId,
      deviceType: devices[idx % devices.length],
      deviceId: generateId("dev", idx + 1000),
      ipAddress: ipAddresses[idx % ipAddresses.length],
      networkThreatLevel: "Low",
      latitude: loc.lat,
      longitude: loc.lng,
      location: loc.location,
      country: loc.country,
      createdAt: sessionStart.toISOString(),
      startedAt: sessionStart.toISOString(),
      expiredAt: undefined,
    },
  ];
}
