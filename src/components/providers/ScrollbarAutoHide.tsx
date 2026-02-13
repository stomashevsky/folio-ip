"use client";

import { useEffect } from "react";

/**
 * Adds `is-scrolling` class to any element that is actively scrolling.
 * The class is removed after a short delay when scrolling stops,
 * causing the scrollbar thumb to fade out via CSS transition.
 */
export function ScrollbarAutoHide() {
  useEffect(() => {
    const timers = new WeakMap<EventTarget, ReturnType<typeof setTimeout>>();

    function handleScroll(e: Event) {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      // Add class immediately on scroll
      target.classList.add("is-scrolling");

      // Clear previous timer for this element
      const prev = timers.get(target);
      if (prev) clearTimeout(prev);

      // Remove class after 1s of no scrolling
      timers.set(
        target,
        setTimeout(() => {
          target.classList.remove("is-scrolling");
          timers.delete(target);
        }, 1000),
      );
    }

    // Use capture to catch scroll on all elements (scroll doesn't bubble)
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return null;
}
