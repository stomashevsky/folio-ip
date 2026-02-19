"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@plexui/ui/components/Button";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Sparkles, ExclamationMarkCircle, ArrowUpSm } from "@plexui/ui/components/Icon";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import {
  FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY,
  FLOW_CHAT_API_KEY_STORAGE_KEY,
  FLOW_CHAT_COMPOSER_CONTROL_SIZE,
  FLOW_CHAT_DEFAULT_PROVIDER,
  FLOW_CHAT_EXAMPLES_TITLE,
  FLOW_CHAT_EXAMPLE_PROMPTS,
  FLOW_CHAT_KEYS_STORAGE_KEY,
  FLOW_CHAT_MODEL_STORAGE_KEY,
  FLOW_CHAT_PROVIDER_STORAGE_KEY,
} from "@/lib/constants";
import type { FlowChatProvider } from "@/lib/constants";
import type { StoredFlowChatKey } from "@/lib/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  yamlResult?: string;
}

const FLOW_DSL_SCHEMA = `
# Flow DSL Schema:
# start: <step_id>          — first step to execute
# steps:
#   <step_id>:
#     type: verification     — verification | review | wait
#     verification: <type>   — government_id | selfie | database | document
#     required: true/false
#     on_pass: <target>      — step_id, terminal_id, or branch
#     on_fail: <target>
#     retry: { max: <n> }
#     # branch target:
#     # on_pass:
#     #   branch:
#     #     - when: "condition"
#     #       goto: <target>
#     #     - default: <target>
#   <step_id>:
#     type: review
#     label: "Review Name"
#     outcomes:
#       approved: <target>
#       rejected: <target>
# terminals:
#   <id>: { status: approved | declined | needs_review }
`.trim();

interface FlowChatProps {
  currentYaml: string;
  onApplyYaml: (yaml: string) => void;
}

interface FlowChatRequestConfig {
  provider: FlowChatProvider;
  apiKey?: string;
  model?: string;
}

function getFlowChatRequestConfig(): FlowChatRequestConfig {
  if (typeof window === "undefined") {
    return { provider: FLOW_CHAT_DEFAULT_PROVIDER };
  }

  const storedKeysRaw = window.localStorage.getItem(FLOW_CHAT_KEYS_STORAGE_KEY);
  if (storedKeysRaw) {
    try {
      const parsed = JSON.parse(storedKeysRaw) as StoredFlowChatKey[];
      const storedActiveKeyId = window.localStorage.getItem(FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY);
      const activeKey = parsed.find((key) => key.id === storedActiveKeyId && key.active)
        ?? parsed.find((key) => key.active);
      if (activeKey?.apiKey.trim()) {
        return {
          provider: activeKey.provider,
          apiKey: activeKey.apiKey.trim(),
          model: activeKey.model?.trim() || undefined,
        };
      }
    } catch {
      // Fallback to legacy single-key storage.
    }
  }

  const providerRaw = window.localStorage.getItem(FLOW_CHAT_PROVIDER_STORAGE_KEY);
  const provider: FlowChatProvider = providerRaw === "gemini" || providerRaw === "groq"
    ? providerRaw
    : FLOW_CHAT_DEFAULT_PROVIDER;

  const apiKey = window.localStorage.getItem(FLOW_CHAT_API_KEY_STORAGE_KEY)?.trim() ?? "";
  const model = window.localStorage.getItem(FLOW_CHAT_MODEL_STORAGE_KEY)?.trim() ?? "";

  return {
    provider,
    apiKey: apiKey || undefined,
    model: model || undefined,
  };
}

function toReadableErrorMessage(error: unknown): string {
  const message = (error instanceof Error ? error.message : "Failed to get response").replace(/\s+/g, " ").trim();

  if (/quota exceeded|resource_exhausted|status 429/i.test(message)) {
    return "AI provider quota for this key is unavailable right now.";
  }

  if (/failed to fetch|network/i.test(message)) {
    return "Network error while contacting AI API.";
  }

  if (message.length > 200) {
    return `${message.slice(0, 197)}...`;
  }

  return message;
}

export function FlowChat({ currentYaml, onApplyYaml }: FlowChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const submitMessage = useCallback(async (messageOverride?: string) => {
    if (loading) return;

    const userMessage = (messageOverride ?? input).trim();
    if (!userMessage) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const requestConfig = getFlowChatRequestConfig();
      const response = await fetch("/api/flow-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          currentYaml,
          schema: FLOW_DSL_SCHEMA,
          provider: requestConfig.provider,
          apiKey: requestConfig.apiKey,
          model: requestConfig.model,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${response.status})`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.message,
        yamlResult: data.yaml,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const msg = toReadableErrorMessage(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [input, loading, currentYaml]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitMessage();
  }, [submitMessage]);

  const handleExampleClick = useCallback((prompt: string) => {
    if (loading) return;
    setInput(prompt);
    setError(null);
  }, [loading]);

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-auto px-3 py-3">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <EmptyMessage fill="none">
              <EmptyMessage.Icon><Sparkles /></EmptyMessage.Icon>
              <EmptyMessage.Title>AI Assistant</EmptyMessage.Title>
              <EmptyMessage.Description>
                Describe changes to the flow in natural language.
              </EmptyMessage.Description>
            </EmptyMessage>
          </div>
        )}

        {messages.map((msg, i) => {
          const yamlResult = msg.yamlResult;

          return (
            <div key={i} className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--color-primary-soft-bg)] text-[var(--color-primary-soft-text)]"
                  : msg.content.startsWith("Error:")
                    ? "bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)]"
                    : "bg-[var(--color-surface-secondary)] text-[var(--color-text)]"
              }`}
            >
              {msg.content}
              {yamlResult && (
                <div className="mt-2">
                  <Button
                    color="secondary"
                    variant="soft"
                    size="sm"
                    pill
                    onClick={() => onApplyYaml(yamlResult)}
                  >
                    Apply to code
                  </Button>
                </div>
              )}
            </div>
          </div>
          );
        })}

        {loading && (
          <div className="mb-2 flex justify-start">
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-secondary)] px-3 py-2 text-sm text-[var(--color-text-tertiary)]">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 border-t border-[var(--color-border)] px-3 py-1.5">
          <ExclamationMarkCircle className="h-3 w-3 shrink-0 text-[var(--color-text-danger-ghost)]" />
          <span className="text-xs text-[var(--color-text-danger-ghost)]">{error}</span>
        </div>
      )}

      <div className="h-px w-full bg-[var(--color-border)]" />

      <div>
        <div className="heading-xs px-4 pt-2 text-[var(--color-text-secondary)]">{FLOW_CHAT_EXAMPLES_TITLE}</div>
        <div className="space-y-1 px-2 py-2">
          {FLOW_CHAT_EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              type="button"
              className="block w-full cursor-pointer rounded-md px-2 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-nav-hover-bg)] hover:text-[var(--color-text)] disabled:cursor-not-allowed"
              disabled={loading}
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex items-end gap-2 px-4 py-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          placeholder="Describe a change..."
          size={FLOW_CHAT_COMPOSER_CONTROL_SIZE}
          rows={1}
          autoResize
          maxRows={8}
          disabled={loading}
          className="min-w-0 flex-1"
        />
        <Button
          color="primary"
          variant="solid"
          size={FLOW_CHAT_COMPOSER_CONTROL_SIZE}
          uniform
          pill
          type="submit"
          disabled={!input.trim() || loading}
          loading={loading}
          className="shrink-0"
        >
          <ArrowUpSm />
        </Button>
      </form>
    </div>
  );
}
