import { cn } from "@/lib/utils";

export function CapsuleMark({
  className,
  live = false,
}: {
  className?: string;
  live?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <rect
        x="10"
        y="3"
        width="12"
        height="26"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="13" y="8" width="6" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="13" y="22.5" width="6" height="1.5" rx="0.75" fill="currentColor" />
      <circle
        cx="16"
        cy="16"
        r="2.2"
        fill={live ? "var(--color-live)" : "currentColor"}
      />
    </svg>
  );
}

export function CapsuleObject({
  serial,
  sealed,
  live,
}: {
  serial: string;
  sealed?: boolean;
  live?: boolean;
}) {
  return (
    <div className="relative mx-auto flex h-44 w-24 items-center justify-center">
      <div className="absolute inset-y-2 left-1/2 w-16 -translate-x-1/2 rounded-[28px] bg-elevated shadow-[var(--shadow-border)]" />
      <div className="absolute top-6 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-border" />
      <div className="absolute bottom-6 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-border" />
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
        <span
          className={cn(
            "size-2.5 rounded-full",
            live ? "bg-live live-dot" : sealed ? "bg-ok" : "bg-accent",
          )}
        />
        <span className="mt-2 max-w-14 truncate font-mono text-[9px] tracking-widest text-subtle uppercase">
          {serial.slice(0, 8)}
        </span>
      </div>
    </div>
  );
}
