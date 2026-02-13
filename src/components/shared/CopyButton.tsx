"use client";

import { useRef, useState } from "react";
import { Button } from "@plexui/ui/components/Button";
import { CheckCircle, Copy } from "@plexui/ui/components/Icon";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      color="secondary"
      variant="ghost"
      size="sm"
      uniform
      pill={false}
      onClick={handleCopy}
    >
      {copied ? (
        <CheckCircle className="h-4 w-4 text-[var(--color-background-success-solid)]" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
