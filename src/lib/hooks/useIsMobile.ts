"use client";

import { useState, useEffect } from "react";
import { BREAKPOINT_MD } from "@/lib/constants/breakpoints";

const MOBILE_QUERY = `(max-width: ${BREAKPOINT_MD - 1}px)`;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
