interface InlineEmptyProps {
  /** Description text (e.g. "No verifications for this account.") */
  children: string;
}

export function InlineEmpty({ children }: InlineEmptyProps) {
  return (
    <p className="px-4 py-6 text-sm text-[var(--color-text-tertiary)]">
      {children}
    </p>
  );
}
