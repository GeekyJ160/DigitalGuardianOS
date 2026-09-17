import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CapsuleObject } from "@/components/capsule-mark";
import { kindTitle } from "@/lib/guardian/kinds";
import { useGuardianStore } from "@/lib/guardian/store";
import { formatDateTime, shortHash } from "@/lib/utils";

export const Route = createFileRoute("/capsules/")({
  component: Vault,
});

function Vault() {
  const capsules = useGuardianStore((s) => s.capsules);

  return (
    <div className="stagger-in space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.2em] text-subtle uppercase">Vault</p>
          <h1 className="font-display text-3xl tracking-tight">
            Guardian Capsules
          </h1>
          <p className="max-w-xl text-sm text-muted">
            Each protected session writes an encrypted capsule of original files —
            hashes, timestamps, and observed events. Nothing is inferred.
          </p>
        </div>
        <Link to="/verify" className="text-sm text-muted hover:text-fg">
          Guardian Verify
        </Link>
      </header>

      {capsules.length === 0 ? (
        <Card className="p-6 text-sm text-muted">
          No capsules yet. Arm a session to write the first one.
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {capsules.map((c) => (
            <li key={c.id}>
              <Link
                to="/capsules/$id"
                params={{ id: c.id }}
                className="flex gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
              >
                <CapsuleObject
                  serial={c.integrityHash}
                  sealed
                  live={c.escrow.released}
                />
                <div className="min-w-0 flex-1 py-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-sm font-medium">{c.title}</h2>
                    {c.escrow.released ? (
                      <Badge variant="live">Escrow released</Badge>
                    ) : (
                      <Badge variant="ok">Sealed</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted">{kindTitle(c.kind)}</p>
                  <p className="mt-2 text-xs text-subtle">
                    {formatDateTime(c.sealedAt)}
                  </p>
                  <p className="mt-3 font-mono text-[10px] tracking-wide text-subtle">
                    {shortHash(c.integrityHash, 6)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
