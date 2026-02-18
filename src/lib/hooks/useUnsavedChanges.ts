"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function useUnsavedChanges(isDirty: boolean) {
  const router = useRouter();
  const dirtyRef = useRef(isDirty);
  useEffect(() => {
    dirtyRef.current = isDirty;
  }, [isDirty]);

  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const confirmNavigation = useCallback((href: string) => {
    if (!dirtyRef.current) {
      router.push(href);
    } else {
      setPendingHref(href);
    }
  }, [router]);

  const confirmLeave = useCallback(() => {
    if (pendingHref) {
      setPendingHref(null);
      router.push(pendingHref);
    }
  }, [pendingHref, router]);

  const cancelLeave = useCallback(() => {
    setPendingHref(null);
  }, []);

  return {
    confirmNavigation,
    showLeaveConfirm: pendingHref !== null,
    confirmLeave,
    cancelLeave,
  };
}
