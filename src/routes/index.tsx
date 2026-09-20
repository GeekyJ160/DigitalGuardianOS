import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  Film,
  Fingerprint,
  Lock,
  Radio,
  ScrollText,
  Users,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/timeline";
import { useActiveSession, useGuardianStore } from "@/lib/guardian/store";
import { formatDateTime, formatDuration } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const session = useActiveSession();
  const capsules = useGuardianStore((s) => s.capsules);
  const contacts = useGuardianStore((s) => s.contacts);
  const notices = useGuardianStore((s) => s.notices);
  const name = useGuardianStore((s) => s.displayName);
  const latest = capsules[0];

  return (
    <div className="stagger-in space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.2em] text-subtle uppercase">
          {session ? "Protected session" : "Command"}
        </p>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          {session
            ? session.title
            : name
              ? `${name}, stay protected.`
              : "Stay protected. Preserve the truth."}
        </h1>
        <p className="max-w-xl text-sm text-muted">
          GuardianOS is a prototype black box for the hours that look ordinary
          until they are not. It records facts you authorize. It does not
          decide what they mean, monitor you live, or dispatch help.
        </p>
      </header>

      {session ? (
        <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="relative mt-1 flex size-3">
              <span className="absolute inset-0 rounded-full bg-live live-ring" />
              <span className="relative size-3 rounded-full bg-live live-dot" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="live">Session active</Badge>
                {session.covert ? <Badge>Covert</Badge> : null}
              </div>
              <p className="mt-2 text-sm text-muted">
                Next check-in in{" "}
                <span className="tabular text-fg">
                  {formatDuration(Math.max(0, session.nextCheckInAt - Date.now()))}
                </span>
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/session/$id" params={{ id: session.id }}>
              Open live session
            </Link>
          </Button>
        </Card>
      ) : (
        <Card className="p-5">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">
            Arm a window
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">
            Start a Guardian Session
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Date, ride, showing, nightlife, or custom. From that moment this
            preview simulates the context you authorized, then writes a capsule
            of observed events if the plan diverges.
          </p>
          <Button asChild className="mt-5">
            <Link to="/session/new">Start session</Link>
          </Button>
        </Card>
      )}

      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">
            GuardianAI
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">
            Prepare, explain, coordinate
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Ask about a session, a signal, or a next step. GuardianAI organizes
            facts. It will not infer danger or call emergency services.
          </p>
        </div>
        <Button asChild>
          <Link to="/ai">Open GuardianAI</Link>
        </Button>
      </Card>

      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">
            Campaign
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">
            The briefing
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Nine-slide pitch and a vertical reel. Stay protected. Preserve the
            truth.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link to="/campaign">
            <Film className="size-4" />
            Watch / present
          </Link>
        </Button>
      </Card>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <QuickLink to="/circle" icon={Users} label="Circle" meta={`${contacts.length} people`} />
        <QuickLink
          to="/capsules"
          icon={Lock}
          label="Vault"
          meta={`${capsules.length} capsules`}
        />
        <QuickLink to="/triggers" icon={Fingerprint} label="Triggers" meta="PIN · phrase · gesture" />
        <QuickLink to="/protocol" icon={ScrollText} label="Protocol" meta="Escrow rules" />
        <QuickLink to="/ai" icon={Bot} label="GuardianAI" meta="Ask in facts" />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium">Latest observed</h2>
            {latest ? (
              <Link
                to="/capsules/$id"
                params={{ id: latest.id }}
                className="text-xs text-muted hover:text-fg"
              >
                Open capsule
              </Link>
            ) : null}
          </div>
          {latest ? (
            <Timeline events={latest.events.slice(-5)} compact />
          ) : (
            <p className="text-sm text-muted">No capsules yet.</p>
          )}
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-medium">Circle notices</h2>
          {notices.length === 0 ? (
            <p className="text-sm text-muted">
              No protocol messages have been sent. Notices appear only after an
              authorized event.
            </p>
          ) : (
            <ul className="space-y-3">
              {notices.slice(0, 5).map((n) => (
                <li key={n.id} className="text-sm">
                  <p className="text-fg">{n.contactName}</p>
                  <p className="text-xs text-muted">{n.message}</p>
                  <p className="mt-0.5 text-[10px] text-subtle">
                    {formatDateTime(n.at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <p className="text-xs text-subtle">
        Prototype · not monitored. Capsules stay on this device. SOS does not
        dispatch 911 or any emergency service.
      </p>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
  meta,
}: {
  to: "/circle" | "/capsules" | "/triggers" | "/protocol" | "/ai";
  icon: typeof Radio;
  label: string;
  meta: string;
}) {
  return (
    <Link
      to={to}
      className="group flex min-h-24 flex-col justify-between rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
    >
      <Icon className="size-4 text-muted" />
      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-subtle">{meta}</div>
        </div>
        <ChevronRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
