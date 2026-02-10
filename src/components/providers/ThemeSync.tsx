"use client";

import { useTheme } from "next-themes";
import { useEffect, type ReactNode } from "react";

/**
 * Syncs next-themes (class-based) theme with PlexUI (data-theme attribute).
 * PlexUI tokens use :where([data-theme]) selectors and CSS light-dark() function.
 */
export function ThemeSync({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    const value = resolvedTheme === "dark" ? "dark" : "light";
    html.setAttribute("data-theme", value);
  }, [resolvedTheme]);

  return <>{children}</>;
}
