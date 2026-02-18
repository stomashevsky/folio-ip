"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Sparkles, ExclamationMarkCircle, ArrowRightSm } from "@plexui/ui/components/Icon";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";

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

export function FlowChat({ currentYaml, onApplyYaml }: FlowChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || loading) return;

      const userMessage = input.trim();
      setInput("");
      setError(null);
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setLoading(true);

      try {
        const response = await fetch("/api/flow-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            currentYaml,
            schema: FLOW_DSL_SCHEMA,
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

        if (data.yaml) {
          onApplyYaml(data.yaml);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to get response";
        setError(msg);
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${msg}` }]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, currentYaml, onApplyYaml],
  );

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-auto px-3 py-3">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <EmptyMessage fill="none">
              <EmptyMessage.Icon><Sparkles /></EmptyMessage.Icon>
              <EmptyMessage.Title>AI Assistant</EmptyMessage.Title>
              <EmptyMessage.Description>
                Describe changes to the flow in natural language, e.g. &quot;Add a selfie step after government_id&quot;
              </EmptyMessage.Description>
            </EmptyMessage>
          </div>
        )}

        {messages.map((msg, i) => (
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
              {msg.yamlResult && (
                <span className="mt-1 block text-xs text-[var(--color-text-tertiary)]">Flow updated</span>
              )}
            </div>
          </div>
        ))}

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

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a change..."
          size="lg"
          pill
          disabled={loading}
          className="flex-1"
        />
        <Button color="primary" size="lg" uniform pill type="submit" disabled={!input.trim() || loading} loading={loading}>
          <ArrowRightSm />
        </Button>
      </form>
    </div>
  );
}
