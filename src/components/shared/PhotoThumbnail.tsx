import Image from "next/image";

export function PhotoThumbnail({
  src,
  label,
  subtitle,
  onClick,
}: {
  src: string;
  label: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`View ${label}`}
      className="group flex cursor-pointer flex-col gap-1.5 outline-none"
      onClick={onClick}
    >
      <Image
        src={src}
        alt={label}
        width={160}
        height={160}
        className="h-[160px] w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-contain transition-opacity group-hover:opacity-90"
      />
      <span className="w-full truncate text-left text-xs text-[var(--color-text-tertiary)]">
        {label}
      </span>
      {subtitle && (
        <span className="-mt-0.5 text-xs text-[var(--color-text-tertiary)]">
          {subtitle}
        </span>
      )}
    </button>
  );
}
