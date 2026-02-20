"use client";

import { useState } from "react";
import { Input } from "@plexui/ui/components/Input";
import { Search } from "@plexui/ui/components/Icon";
import { InlineEmpty, SectionHeading } from "@/components/shared";
import type { Report } from "@/lib/types";
import { MatchTable } from "./MatchEntry";

export function MatchesTab({ report }: { report: Report }) {
  const [search, setSearch] = useState("");
  const matches = report.matches ?? [];

  const filtered = search
    ? matches.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.source.toLowerCase().includes(search.toLowerCase()) ||
          (m.country ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : matches;

  if (matches.length === 0) {
    return (
      <InlineEmpty>
        No matches found for this report.
      </InlineEmpty>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeading badge={matches.length}>Match entries</SectionHeading>
        <div className="w-60">
          <Input
            placeholder="Search matches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={search ? () => setSearch("") : undefined}
            startAdornment={<Search style={{ width: 16, height: 16 }} />}
            size="sm"
            pill
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <MatchTable matches={filtered} />
      ) : (
        <InlineEmpty>{`No matches matching "${search}"`}</InlineEmpty>
      )}
    </div>
  );
}
