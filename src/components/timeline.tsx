import type { ObservedEvent } from "@/lib/guardian/types";
import { cn, formatTime } from "@/lib/utils";

export function Timeline({
  events,
  compact = false,
}: {
  events: ObservedEvent[];
  compact?: boolean;
}) {
  const ordered = [...events].sort((a, b) => a.at - b.at);
  return (
    <ol className="relative">
      {ordered.map((ev, i) => (
        <li key={ev.id} className="flex gap-3 pb-4 last:pb-0">
          <div className="flex w-16 shrink-0 flex-col items-end pt-0.5">
            <time className="tabular text-xs text-muted">{formatTime(ev.at)}</time>
          </div>
          <div className="relative flex flex-col items-center">
            <span
              className={cn(
                "mt-1 size-2 rounded-full",
                ev.kind.includes("missed") ||
                  ev.kind === "route_deviation" ||
                  ev.kind === "sos" ||
                  ev.kind === "connectivity_lost"
                  ? "bg-live"
                  : ev.kind === "checkin_ok" || ev.kind === "session_ended"
                    ? "bg-ok"
                    : "bg-accent",
              )}
            />
            {i < ordered.length - 1 && (
              <span className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-sm text-fg">{ev.label}</p>
            {!compact && ev.detail && (
              <p className="mt-0.5 text-xs text-muted">{ev.detail}</p>
            )}
            <p className="mt-1 text-[10px] tracking-widest text-subtle uppercase">
              Observed event
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
