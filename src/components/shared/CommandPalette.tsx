"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Search } from "@plexui/ui/components/Icon";
import { globalSections } from "@/lib/constants/nav-config";

interface CommandItem {
  title: string;
  href: string;
  section: string;
  group: string;
}

function buildCommandItems(): CommandItem[] {
  const items: CommandItem[] = [];
  for (const section of globalSections) {
    for (const group of section.sidebarGroups) {
      for (const item of group.items) {
        items.push({
          title: item.title,
          href: item.href,
          section: section.label,
          group: group.label,
        });
      }
    }
  }
  return items;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => buildCommandItems(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  useEffect(() => {
    setActiveIndex(0);
  }, [filtered]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      handleClose();
      router.push(href);
    },
    [handleClose, router]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      handleSelect(filtered[activeIndex].href);
    }
  };

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector("[data-active='true']");
    if (active) {
      active.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-300">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-3">
          <Search style={{ width: 18, height: 18, color: "var(--color-text-tertiary)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search pages..."
            className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none"
          />
        </div>
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
              No results found.
            </div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.href}
                type="button"
                data-active={index === activeIndex}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  index === activeIndex
                    ? "bg-[var(--color-nav-active-bg)] text-[var(--color-text)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-nav-hover-bg)]"
                }`}
                onClick={() => handleSelect(item.href)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className="font-medium">{item.title}</span>
                <span className="text-2xs text-[var(--color-text-tertiary)]">
                  {item.section} › {item.group}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="border-t border-[var(--color-border)] px-3 py-2">
          <div className="flex items-center gap-3 text-2xs text-[var(--color-text-tertiary)]">
            <span>
              <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono">↵</kbd> Open
            </span>
            <span>
              <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono">Esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
