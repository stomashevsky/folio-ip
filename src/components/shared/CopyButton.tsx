"use client";

import { useRef, useState } from "react";
import { Button } from "@plexui/ui/components/Button";
import { Check, Copy } from "@plexui/ui/components/Icon";
import {
  COPY_BUTTON_FEEDBACK_TIMEOUT_MS,
  COPY_BUTTON_ICON_SIZE_PX,
  COPY_BUTTON_VERTICAL_PADDING_PX,
} from "@/lib/constants";

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), COPY_BUTTON_FEEDBACK_TIMEOUT_MS);
  };

  return (
    <span
      className={`inline-flex ${className ?? ""}`}
      style={{
        paddingTop: COPY_BUTTON_VERTICAL_PADDING_PX,
        paddingBottom: COPY_BUTTON_VERTICAL_PADDING_PX,
      }}
    >
      <Button
        color="secondary"
        variant="ghost"
        size="3xs"
        uniform
        pill={false}
        onClick={handleCopy}
      >
        {copied ? (
          <Check style={{ width: COPY_BUTTON_ICON_SIZE_PX, height: COPY_BUTTON_ICON_SIZE_PX }} />
        ) : (
          <Copy style={{ width: COPY_BUTTON_ICON_SIZE_PX, height: COPY_BUTTON_ICON_SIZE_PX }} />
        )}
      </Button>
    </span>
  );
}
