"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@plexui/ui/components/Button";
import { Textarea } from "@plexui/ui/components/Textarea";
import { ExclamationMarkCircle, ArrowUpSm, Reply } from "@plexui/ui/components/Icon";
import { CopyButton } from "@/components/shared";
import {
  FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY,
  FLOW_CHAT_API_KEY_STORAGE_KEY,
  FLOW_CHAT_COMPOSER_ACTION_SIZE,
  FLOW_CHAT_COMPOSER_ACTION_INSET_PX,
  FLOW_CHAT_COMPOSER_BOTTOM_ROW_HEIGHT_PX,
  FLOW_CHAT_COMPOSER_MAX_ROWS,
  FLOW_CHAT_COMPOSER_MIN_HEIGHT_PX,
  FLOW_CHAT_COMPOSER_RADIUS_PX,
  FLOW_CHAT_COMPOSER_SEND_ICON_SIZE_PX,
  FLOW_CHAT_COMPOSER_SEND_RADIUS_PX,
  FLOW_CHAT_COMPOSER_ROWS,
  FLOW_CHAT_COMPOSER_TEXT_BOTTOM_PADDING_PX,
  FLOW_CHAT_COMPOSER_TEXT_RIGHT_PADDING_PX,
  FLOW_CHAT_COMPOSER_TEXT_SIDE_PADDING_PX,
  FLOW_CHAT_COMPOSER_TEXT_TOP_PADDING_PX,
  FLOW_CHAT_COMPOSER_TEXTAREA_SIZE,
  FLOW_CHAT_COMPOSER_TEXTAREA_VARIANT,
  FLOW_CHAT_DEFAULT_PROVIDER,
  FLOW_CHAT_EXAMPLE_ICON_SIZE_PX,
  FLOW_CHAT_EXAMPLE_ICON_VERTICAL_PADDING_PX,
  FLOW_CHAT_EXAMPLE_ROW_GAP_PX,
  FLOW_CHAT_EXAMPLE_ROW_PADDING_X_PX,
  FLOW_CHAT_EXAMPLE_ROW_PADDING_Y_PX,
  FLOW_CHAT_EXAMPLE_ROW_RADIUS_PX,
  FLOW_CHAT_EXAMPLE_TEXT_LINE_HEIGHT_PX,
  FLOW_CHAT_FRAME_PADDING_PX,
  FLOW_CHAT_FRAME_SECTION_GAP_PX,
  FLOW_CHAT_INPUT_PLACEHOLDER,
  FLOW_CHAT_KEYS_STORAGE_KEY,
  FLOW_CHAT_MESSAGE_ACTION_GAP_PX,
  FLOW_CHAT_MESSAGE_LINE_HEIGHT_PX,
  FLOW_CHAT_MESSAGE_VERTICAL_PADDING_PX,
  FLOW_CHAT_MODEL_STORAGE_KEY,
  FLOW_CHAT_PROVIDER_STORAGE_KEY,
} from "@/lib/constants";
import type { FlowChatProvider } from "@/lib/constants";
import type { StoredFlowChatKey } from "@/lib/types";
import { MATCH_REQUIREMENTS_SCHEMA_TEXT } from "@/lib/schemas/match-requirements-schema";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  jsonResult?: string;
}

interface CheckChatProps {
  currentJson: string;
  onApplyJson: (json: string) => { ok: true } | { ok: false; error: string };
}

interface FlowChatRequestConfig {
  provider: FlowChatProvider;
  apiKey?: string;
  model?: string;
}

const CHECK_EXAMPLE_PROMPTS = [
  "Add name matching with 85% similarity",
  "Add address comparison with street normalization",
  "Make birthdate an exact match",
  "Add all standard KYC fields",
] as const;

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
    } catch {}
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

function extractJsonFromResponse(text: string): string | null {
  const jsonMatch = text.match(/```json\n([\s\S]*?)```/i);
  if (jsonMatch?.[1]) return jsonMatch[1].trim();

  const codeMatch = text.match(/```\n([\s\S]*?)```/);
  if (codeMatch?.[1]) return codeMatch[1].trim();

  return null;
}

export function CheckChat({ currentJson, onApplyJson }: CheckChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(null);
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
      const response = await fetch("/api/check-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          currentJson,
          schema: MATCH_REQUIREMENTS_SCHEMA_TEXT,
          provider: requestConfig.provider,
          apiKey: requestConfig.apiKey,
          model: requestConfig.model,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${response.status})`);
      }

      const data = await response.json() as { message: string; json?: string | null };
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.message,
        jsonResult: data.json ?? extractJsonFromResponse(data.message) ?? undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(toReadableErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentJson, input, loading]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitMessage();
  }, [submitMessage]);

  const handleExampleClick = useCallback((prompt: string) => {
    if (loading) return;
    setInput(prompt);
    setError(null);
  }, [loading]);

  const handleApplyClick = useCallback((nextJson: string) => {
    const result = onApplyJson(nextJson);
    if (!result.ok) {
      setError(result.error);
    } else {
      setError(null);
    }
  }, [onApplyJson]);

  const hasMessages = messages.length > 0;
  const canSubmit = input.trim().length > 0;
  const sendButtonActive = canSubmit || loading;
  const showExamples = !hasMessages && !canSubmit;

  const renderError = (className?: string) => {
    if (!error) return null;

    return (
      <div className={className}>
        <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-background-danger-soft)] px-2 py-1.5">
          <ExclamationMarkCircle className="h-3 w-3 shrink-0 text-[var(--color-text-danger-ghost)]" />
          <span className="text-xs text-[var(--color-text-danger-ghost)]">{error}</span>
        </div>
      </div>
    );
  };

  const renderExamples = () => {
    if (!showExamples) return null;

    return (
      <div
        className="flex flex-col"
        style={{
          gap: FLOW_CHAT_EXAMPLE_ROW_GAP_PX,
        }}
      >
        {CHECK_EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example}
            type="button"
            className="flex w-full cursor-pointer items-start text-left text-[var(--color-text)] transition-colors hover:bg-[var(--color-nav-hover-bg)] disabled:cursor-not-allowed"
            disabled={loading}
            onClick={() => handleExampleClick(example)}
            style={{
              borderRadius: FLOW_CHAT_EXAMPLE_ROW_RADIUS_PX,
              gap: FLOW_CHAT_EXAMPLE_ROW_GAP_PX,
              paddingTop: FLOW_CHAT_EXAMPLE_ROW_PADDING_Y_PX,
              paddingBottom: FLOW_CHAT_EXAMPLE_ROW_PADDING_Y_PX,
              paddingLeft: FLOW_CHAT_EXAMPLE_ROW_PADDING_X_PX,
              paddingRight: FLOW_CHAT_EXAMPLE_ROW_PADDING_X_PX,
            }}
          >
            <span
              className="shrink-0"
              style={{
                paddingTop: FLOW_CHAT_EXAMPLE_ICON_VERTICAL_PADDING_PX,
                paddingBottom: FLOW_CHAT_EXAMPLE_ICON_VERTICAL_PADDING_PX,
              }}
            >
              <Reply
                className="text-[var(--color-text)]"
                style={{ width: FLOW_CHAT_EXAMPLE_ICON_SIZE_PX, height: FLOW_CHAT_EXAMPLE_ICON_SIZE_PX }}
              />
            </span>
            <span className="text-sm font-medium" style={{ lineHeight: `${FLOW_CHAT_EXAMPLE_TEXT_LINE_HEIGHT_PX}px` }}>
              {example}
            </span>
          </button>
        ))}
      </div>
    );
  };

  const renderComposer = () => (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div
        className="relative"
        style={{
          ["--flow-chat-composer-radius" as string]: `${FLOW_CHAT_COMPOSER_RADIUS_PX}px`,
          minHeight: FLOW_CHAT_COMPOSER_MIN_HEIGHT_PX,
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          placeholder={FLOW_CHAT_INPUT_PLACEHOLDER}
          variant={FLOW_CHAT_COMPOSER_TEXTAREA_VARIANT}
          size={FLOW_CHAT_COMPOSER_TEXTAREA_SIZE}
          rows={FLOW_CHAT_COMPOSER_ROWS}
          autoResize
          maxRows={FLOW_CHAT_COMPOSER_MAX_ROWS}
          disabled={loading}
          className="min-w-0 w-full [--textarea-radius:var(--flow-chat-composer-radius)] [--input-outline-border-color:var(--color-border)] [--input-outline-border-color-hover:var(--color-border)] [--input-outline-border-color-focus:var(--color-border)]"
          style={{
            minHeight: FLOW_CHAT_COMPOSER_MIN_HEIGHT_PX,
            paddingTop: FLOW_CHAT_COMPOSER_TEXT_TOP_PADDING_PX,
            paddingBottom: FLOW_CHAT_COMPOSER_TEXT_BOTTOM_PADDING_PX,
            paddingLeft: FLOW_CHAT_COMPOSER_TEXT_SIDE_PADDING_PX,
            paddingRight: FLOW_CHAT_COMPOSER_TEXT_RIGHT_PADDING_PX,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end"
          style={{
            height: FLOW_CHAT_COMPOSER_BOTTOM_ROW_HEIGHT_PX,
            padding: FLOW_CHAT_COMPOSER_ACTION_INSET_PX,
            paddingTop: 0,
          }}
        >
          <Button
            color={sendButtonActive ? "primary" : "secondary"}
            variant={sendButtonActive ? "solid" : "soft"}
            size={FLOW_CHAT_COMPOSER_ACTION_SIZE}
            uniform
            pill={false}
            type="submit"
            disabled={!canSubmit || loading}
            loading={loading}
            className="pointer-events-auto [--button-ring-color:transparent]"
            style={{ borderRadius: FLOW_CHAT_COMPOSER_SEND_RADIUS_PX }}
          >
            <ArrowUpSm
              style={{
                width: FLOW_CHAT_COMPOSER_SEND_ICON_SIZE_PX,
                height: FLOW_CHAT_COMPOSER_SEND_ICON_SIZE_PX,
              }}
            />
          </Button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {hasMessages && (
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-3 py-3">
          {messages.map((msg, i) => {
            const jsonResult = msg.jsonResult;
            const isUser = msg.role === "user";
            const isErrorMessage = msg.content.startsWith("Error:");
            const showCopyButton = hoveredMessageIndex === i;

            return (
              <div
                key={i}
                className={`group mb-2 flex items-start ${isUser ? "justify-end" : "justify-start"}`}
                style={{ gap: FLOW_CHAT_MESSAGE_ACTION_GAP_PX }}
                onMouseEnter={() => setHoveredMessageIndex(i)}
                onMouseLeave={() => setHoveredMessageIndex((prev) => (prev === i ? null : prev))}
              >
                {isUser && (
                  <CopyButton value={msg.content} className={showCopyButton ? "opacity-100" : "opacity-0 pointer-events-none"} />
                )}
                <div
                  className={`max-w-[90%] rounded-lg text-sm ${
                    isUser
                      ? "bg-[var(--color-surface-secondary)] pl-3 pr-2 text-[var(--color-text)]"
                      : isErrorMessage
                        ? "bg-[var(--color-background-danger-soft)] px-3 text-[var(--color-text-danger-soft)]"
                        : "bg-transparent px-0 text-[var(--color-text)]"
                  }`}
                  style={{
                    lineHeight: `${FLOW_CHAT_MESSAGE_LINE_HEIGHT_PX}px`,
                    paddingTop: FLOW_CHAT_MESSAGE_VERTICAL_PADDING_PX,
                    paddingBottom: FLOW_CHAT_MESSAGE_VERTICAL_PADDING_PX,
                  }}
                >
                  {msg.content}
                  {jsonResult && (
                    <div className="mt-2">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        pill={false}
                        onClick={() => handleApplyClick(jsonResult)}
                      >
                        Apply to code
                      </Button>
                    </div>
                  )}
                </div>
                {!isUser && (
                  <CopyButton value={msg.content} className={showCopyButton ? "opacity-100" : "opacity-0 pointer-events-none"} />
                )}
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
      )}

      <div className={hasMessages ? "" : "mt-auto"}>
        <div
          className="flex flex-col"
          style={{
            padding: FLOW_CHAT_FRAME_PADDING_PX,
            gap: FLOW_CHAT_FRAME_SECTION_GAP_PX,
          }}
        >
          {renderError()}
          {renderExamples()}
          {renderComposer()}
        </div>
      </div>
    </div>
  );
}
