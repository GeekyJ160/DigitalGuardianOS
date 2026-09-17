import { cn, formatDuration } from "@/lib/utils";

export function CheckInRing({
  remainingMs,
  totalMs,
  alert,
}: {
  remainingMs: number;
  totalMs: number;
  alert?: boolean;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const t = Math.min(1, Math.max(0, remainingMs / Math.max(1, totalMs)));
  const dash = c * t;
  return (
    <div className="relative mx-auto size-36">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          className={alert ? "text-live" : "text-accent"}
          strokeWidth="4"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "tabular font-display text-2xl tracking-tight",
            alert ? "text-live" : "text-fg",
          )}
        >
          {formatDuration(remainingMs)}
        </span>
        <span className="text-[10px] tracking-widest text-subtle uppercase">
          {alert ? "Confirm" : "Check-in"}
        </span>
      </div>
    </div>
  );
}
