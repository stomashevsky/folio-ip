import { mockInquiries } from "@/lib/data";

export function getAllKnownTags(): string[] {
  return Array.from(new Set(mockInquiries.flatMap((i) => i.tags)))
    .filter(Boolean)
    .sort();
}
