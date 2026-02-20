"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { SparklesFilled, CloseBold, ArrowRightSm } from "@plexui/ui/components/Icon";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const CONTEXT_HINTS: Record<string, string> = {
  "/inquiries": "I can help you understand inquiry statuses, filter data, or explain verification flows.",
  "/verifications": "I can help you with verification checks, document requirements, or status meanings.",
  "/reports": "I can help you understand report types, screening results, or match explanations.",
  "/accounts": "I can help you manage accounts, understand KYC status, or review linked inquiries.",
  "/platform/cases": "I can help you with case management, queue assignments, or escalation workflows.",
  "/platform/graph": "I can help you explore entity relationships, detect clusters, or understand graph connections.",
  "/settings": "I can help you configure settings, manage API keys, or set up webhooks.",
};

function getContextHint(pathname: string): string {
  for (const [prefix, hint] of Object.entries(CONTEXT_HINTS)) {
    if (pathname.startsWith(prefix)) return hint;
  }
  return "I can help you navigate the dashboard, explain features, or answer questions about KYC workflows.";
}

const SAMPLE_RESPONSES: Record<string, string> = {
  status: "Inquiry statuses flow as: **created** → **pending** → **completed** → **approved** / **declined** / **needs_review**. Each status triggers different actions and notifications.",
  filter: "You can combine multiple filters — use the dropdowns in the toolbar above the table. Filters stack (AND logic). Use **Clear filters** to reset all at once.",
  export: "Select rows using checkboxes, then use the bulk action bar to export. You can also use the API for programmatic data export.",
  help: "Here are some things I can help with:\n\n• Explain entity statuses and transitions\n• Guide you through filter and search features\n• Explain verification check types\n• Help configure workflows and templates\n• Answer questions about the API",
};

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("status") || lower.includes("flow")) return SAMPLE_RESPONSES.status;
  if (lower.includes("filter") || lower.includes("search")) return SAMPLE_RESPONSES.filter;
  if (lower.includes("export") || lower.includes("download")) return SAMPLE_RESPONSES.export;
  return SAMPLE_RESPONSES.help;
}

export function CopilotButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        color="secondary"
        variant="ghost"
        size="sm"
        uniform
        pill={false}
        onClick={() => setOpen(true)}
        aria-label="Copilot"
      >
        <SparklesFilled style={{ width: 18, height: 18 }} />
      </Button>
      {open && <CopilotPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function CopilotPanel({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useScrollLock(true);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(trimmed);
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  }, [input]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <SparklesFilled style={{ width: 18, height: 18, color: "var(--color-text-primary-solid)" }} />
            <h2 className="heading-sm">Copilot</h2>
          </div>
          <Button
            color="secondary"
            variant="ghost"
            size="xs"
            uniform
            pill={false}
            onClick={onClose}
            aria-label="Close Copilot"
          >
            <CloseBold style={{ width: 16, height: 16 }} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <SparklesFilled
                style={{ width: 32, height: 32, color: "var(--color-text-tertiary)" }}
              />
              <p className="text-sm text-[var(--color-text-secondary)]">
                {getContextHint(pathname)}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Try asking about statuses, filters, or workflows.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 ${msg.role === "user" ? "flex justify-end" : ""}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-[var(--color-primary-solid-bg)] text-[var(--color-text-inverse)]"
                    : "bg-[var(--color-surface-secondary)] text-[var(--color-text)]"
                }`}
              >
                {msg.content.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-1" : ""}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="mb-3">
              <div className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-surface-secondary)] px-3 py-2">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-text-tertiary)] [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-text-tertiary)] [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-text-tertiary)] [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-[var(--color-border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this page..."
                size="sm"
                pill
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>
            <Button
              color="primary"
              size="sm"
              uniform
              pill
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send"
            >
              <ArrowRightSm style={{ width: 16, height: 16 }} />
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
