"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Sync a tab value with the `?tab=xxx` URL search param.
 *
 * - Reads the active tab from the URL (falls back to `defaultTab` if missing/invalid)
 * - Updates the URL on tab change via `router.replace` (no history spam)
 * - Omits `?tab` when the active tab equals the default (clean URLs)
 * - Case-insensitive matching between URL lowercase and component-cased values
 */
export function useTabParam<T extends string>(
  tabs: readonly T[],
  defaultTab: T,
): [T, (tab: T) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = useMemo(() => {
    const raw = searchParams.get("tab");
    if (!raw) return defaultTab;
    const match = tabs.find((t) => t.toLowerCase() === raw.toLowerCase());
    return match ?? defaultTab;
  }, [searchParams, tabs, defaultTab]);

  const setActiveTab = useCallback(
    (tab: T) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === defaultTab) {
        params.delete("tab");
      } else {
        params.set("tab", tab.toLowerCase());
      }
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.replace(url, { scroll: false });
    },
    [searchParams, pathname, router, defaultTab],
  );

  return [activeTab, setActiveTab];
}
