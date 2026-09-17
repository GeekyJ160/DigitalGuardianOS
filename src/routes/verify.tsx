import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGuardianStore } from "@/lib/guardian/store";
import { formatDateTime, shortHash } from "@/lib/utils";

export const Route = createFileRoute("/verify")({
  component: Verify,
});

function Verify() {
  const capsules = useGuardianStore((s) => s.capsules);

  return (
    <div className="stagger-in mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.2em] text-subtle uppercase">
          Guardian Verify
        </p>
        <h1 className="font-display text-3xl tracking-tight">
          Portable authenticated incident records
        </h1>
        <p className="text-sm text-muted">
          Not a police report. Not an accusation. A fact package: location,
          hashes, timestamps, check-ins, Circle events, file integrity.
        </p>
      </header>

      {capsules.length === 0 ? (
        <Card className="p-5 text-sm text-muted">No sealed capsules yet.</Card>
      ) : (
        <ul className="space-y-3">
          {capsules.map((c) => {
            const checks = [
              c.breadcrumbs.length > 0,
              c.eventHashes.length > 0,
              true,
              c.events.some((e) => e.kind.startsWith("checkin")),
              c.events.some((e) => e.kind === "circle_notified"),
              Boolean(c.integrityHash),
            ];
            const score = checks.filter(Boolean).length;
            return (
              <li key={c.id}>
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-medium">{c.title}</h2>
                      <p className="text-xs text-muted">
                        {formatDateTime(c.sealedAt)} · {shortHash(c.integrityHash, 6)}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-ok">
                      <Check className="size-3.5" />
                      {score}/6
                    </span>
                  </div>
                  <Button asChild size="sm" variant="secondary" className="mt-4">
                    <Link to="/capsules/$id" params={{ id: c.id }}>
                      Open verified timeline
                    </Link>
                  </Button>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
