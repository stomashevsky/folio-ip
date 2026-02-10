"use client";

import { ThemeProvider } from "next-themes";
import { PlexUIProvider } from "@plexui/ui/components/PlexUIProvider";
import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeSync } from "./ThemeSync";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ThemeSync>
        <PlexUIProvider linkComponent={Link}>
          <QueryProvider>{children}</QueryProvider>
        </PlexUIProvider>
      </ThemeSync>
    </ThemeProvider>
  );
}
