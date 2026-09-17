import { DEST_POINT, HOME_POINT } from "@/lib/guardian/seed";
import type { Breadcrumb } from "@/lib/guardian/types";
import { cn } from "@/lib/utils";

function streets() {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 1; i <= 8; i++) {
    const v = (i / 9) * 100;
    lines.push({ x1: v, y1: 0, x2: v, y2: 100 });
    lines.push({ x1: 0, y1: v, x2: 100, y2: v });
  }
  return lines;
}

export function BreadcrumbMap({
  crumbs,
  className,
  expected = true,
}: {
  crumbs: Breadcrumb[];
  className?: string;
  expected?: boolean;
}) {
  const pts = crumbs
    .map((c) => `${(c.x * 100).toFixed(2)},${(c.y * 100).toFixed(2)}`)
    .join(" ");
  const last = crumbs[crumbs.length - 1];
  const grid = streets();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-bg shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden>
        {grid.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="currentColor"
            className="text-border"
            strokeWidth={i % 3 === 0 ? 0.45 : 0.25}
          />
        ))}
        {expected && (
          <polyline
            points="18,78 26,70 34,62 46,55 58,48 66,42 72,38"
            fill="none"
            stroke="currentColor"
            className="text-subtle"
            strokeWidth="0.7"
            strokeDasharray="1.4 1.4"
          />
        )}
        {pts && (
          <polyline
            points={pts}
            fill="none"
            stroke="currentColor"
            className="text-accent"
            strokeWidth="1.15"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        <circle
          cx={HOME_POINT.x * 100}
          cy={HOME_POINT.y * 100}
          r="1.6"
          className="fill-muted"
        />
        <circle
          cx={DEST_POINT.x * 100}
          cy={DEST_POINT.y * 100}
          r="1.8"
          className="fill-accent"
        />
        {last && (
          <g>
            <circle
              cx={last.x * 100}
              cy={last.y * 100}
              r="3.2"
              className="fill-live/25"
            />
            <circle
              cx={last.x * 100}
              cy={last.y * 100}
              r="1.5"
              className="fill-live"
            />
          </g>
        )}
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-3 py-2 text-[10px] tracking-wide text-subtle uppercase">
        <span>Home</span>
        <span>Destination</span>
      </div>
    </div>
  );
}
