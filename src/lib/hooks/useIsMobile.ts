"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { BREAKPOINT_MD } from "@/lib/constants/breakpoints";

/**
 * Returns `true` when viewport is narrower than the given breakpoint.
 * Defaults to `BREAKPOINT_MD` (768 px — Tailwind `md:`).
 * Pass `BREAKPOINT_LG` (1024 px) or `BREAKPOINT_XL` (1280 px) for
 * multi-column layouts that need more room before switching to stacked
 * mobile view.
 */
export function useIsMobile(breakpoint = BREAKPOINT_MD) {
  const query = useMemo(() => `(max-width: ${breakpoint - 1}px)`, [breakpoint]);

  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
