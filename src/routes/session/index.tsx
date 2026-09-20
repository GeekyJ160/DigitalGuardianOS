import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { kindTitle } from "@/lib/guardian/kinds";
import { useGuardianStore } from "@/lib/guardian/store";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/session/")({
  component: SessionIndex,
});

function SessionIndex() {
  const id = useGuardianStore((s) => s.activeSessionId);
  const sessions = useGuardianStore((s) => s.sessions);
  const capsules = useGuardianStore((s) => s.capsules);
  if (id) return <Navigate to="/session/$id" params={{ id }} />;

  const past = sessions.filter((s) => s.status === "ended");

  return (
    <div className="stagger-in space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.2em] text-subtle uppercase">
          Sessions
        </p>
        <h1 className="font-display text-3xl tracking-tight">
          No live session
        </h1>
        <p className="max-w-xl text-sm text-muted">
          Arm a window to simulate check-ins, signals, and a sealed capsule.
          This preview does not share location or contact emergency services.
        </p>
      </header>
      <Button asChild>
        <Link to="/session/new">Start session</Link>
      </Button>
      {past.length > 0 ? (
        <ul className="space-y-3">
          {past.map((s) => {
            const capsule = capsules.find((c) => c.sessionId === s.id);
            return (
              <li key={s.id}>
                <Card className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <h2 className="text-sm font-medium">{s.title}</h2>
                    <p className="text-xs text-muted">
                      {kindTitle(s.kind)} · {formatDateTime(s.startedAt)}
                    </p>
                  </div>
                  {capsule ? (
                    <Button asChild size="sm" variant="secondary">
                      <Link to="/capsules/$id" params={{ id: capsule.id }}>
                        Open capsule
                      </Link>
                    </Button>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
