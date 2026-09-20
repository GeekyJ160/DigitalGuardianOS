import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Battery, Wifi, WifiOff, MapPin, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BreadcrumbMap } from "@/components/breadcrumb-map";
import { CheckInRing } from "@/components/check-in-ring";
import { Timeline } from "@/components/timeline";
import { assessSession } from "@/lib/guardian/ai";
import { useGuardianStore } from "@/lib/guardian/store";
import { formatDateTime, formatDuration } from "@/lib/utils";

export const Route = createFileRoute("/session/$id")({
  component: LiveSession,
});

function useNow(interval: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (interval === null) return;
    const id = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  return now;
}

export function LiveSession() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const session = useGuardianStore((s) => s.sessions.find((x) => x.id === id));
  const checkIn = useGuardianStore((s) => s.checkIn);
  const endSession = useGuardianStore((s) => s.endSession);
  const addNote = useGuardianStore((s) => s.addNote);
  const simulateArrival = useGuardianStore((s) => s.simulateArrival);
  const simulateDeviation = useGuardianStore((s) => s.simulateDeviation);
  const simulateMissedCheckIn = useGuardianStore((s) => s.simulateMissedCheckIn);
  const simulateOffline = useGuardianStore((s) => s.simulateOffline);
  const simulateOnline = useGuardianStore((s) => s.simulateOnline);
  const triggerSos = useGuardianStore((s) => s.triggerSos);
  const [note, setNote] = useState("");
  const [assessment, setAssessment] = useState<string | null>(null);
  const [assessing, setAssessing] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const now = useNow(session && session.status !== "ended" ? 500 : null);

  if (!session) {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl">Session not found</h1>
        <Button asChild variant="secondary">
          <Link to="/session/new">Start a session</Link>
        </Button>
      </div>
    );
  }

  const missedMs = useGuardianStore((s) => s.triggers.missedResponseMs);
  const remaining = session.confirmUntil
    ? session.confirmUntil - now
    : session.nextCheckInAt - now;
  const total = session.confirmUntil ? missedMs : session.checkInEveryMs;
  const prompting = Boolean(session.confirmUntil);

  const onEnd = () => {
    const capId = endSession(session.id);
    if (capId) {
      toast("Capsule sealed");
      void navigate({ to: "/capsules/$id", params: { id: capId } });
    }
  };

  const onAssess = async () => {
    setAssessing(true);
    setAssessment(null);
    const facts = [
      `Status: ${session.status}`,
      `Destination: ${session.destination || "unspecified"}`,
      `Arrived: ${session.arrived ? "yes" : "no"}`,
      `Route deviation: ${session.deviated ? "yes" : "no"}`,
      `Missed check-ins: ${session.missedCheckins}`,
      `Online: ${session.online ? "yes" : "no"}`,
      `Battery: ${Math.round(session.battery)}%`,
      `Elapsed: ${formatDuration(now - session.startedAt)}`,
    ];
    try {
      const res = await assessSession({
        data: {
          title: session.title,
          expectedEnd: formatDateTime(session.expectedEndAt),
          facts,
        },
      });
      if (res.ok) setAssessment(res.text);
      else setAssessment("GuardianAI could not complete the assessment.");
    } catch {
      setAssessment("GuardianAI could not complete the assessment.");
    } finally {
      setAssessing(false);
    }
  };

  if (session.status === "ended") {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl">Session sealed</h1>
        <Button asChild>
          <Link to="/capsules">Open vault</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-subtle uppercase">Live</p>
          <h1 className="font-display text-3xl tracking-tight">{session.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {session.meetingWith ? `Meeting ${session.meetingWith}. ` : null}
            Expected window ends {formatDateTime(session.expectedEndAt)}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={session.status === "alert" ? "live" : "ok"}>
            {session.status === "alert" ? "Protocol armed" : "Active"}
          </Badge>
          {session.covert ? <Badge>Covert</Badge> : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <CheckInRing
            remainingMs={Math.max(0, remaining)}
            totalMs={total}
            alert={prompting}
          />
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={() => checkIn(session.id)}>
              {prompting ? "I'm okay" : "Check in"}
            </Button>
            <Button variant="danger" onClick={onEnd}>
              End and seal capsule
            </Button>
            <Button variant="outline" onClick={() => setSosOpen((v) => !v)}>
              <ShieldAlert className="size-4" />
              Need help now
            </Button>
          </div>
          {sosOpen ? (
            <div className="mt-3 rounded-md bg-elevated p-3 text-xs text-muted">
              <p>
                This preview does not dispatch 911 or any emergency service. If
                you need help now, call local emergency services or a trusted
                person.
              </p>
              <Button
                size="sm"
                className="mt-3"
                variant="danger"
                onClick={() => {
                  triggerSos(session.id);
                  setSosOpen(false);
                  toast("SOS recorded in this preview. Help was not dispatched.");
                }}
              >
                Record SOS in this demo
              </Button>
            </div>
          ) : null}
          <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-md bg-elevated px-2 py-3">
              <dt className="text-subtle">Battery</dt>
              <dd className="mt-1 flex items-center justify-center gap-1 tabular text-fg">
                <Battery className="size-3.5" />
                {Math.round(session.battery)}%
              </dd>
            </div>
            <div className="rounded-md bg-elevated px-2 py-3">
              <dt className="text-subtle">Link</dt>
              <dd className="mt-1 flex items-center justify-center gap-1 text-fg">
                {session.online ? (
                  <Wifi className="size-3.5" />
                ) : (
                  <WifiOff className="size-3.5 text-live" />
                )}
                {session.online ? "Online" : "Offline"}
              </dd>
            </div>
            <div className="rounded-md bg-elevated px-2 py-3">
              <dt className="text-subtle">Missed</dt>
              <dd className="mt-1 tabular text-fg">{session.missedCheckins}</dd>
            </div>
          </dl>
        </Card>

        <Card className="overflow-hidden p-0 lg:col-span-3">
          <BreadcrumbMap crumbs={session.breadcrumbs} className="h-64 md:h-80" />
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-xs text-muted">
            <MapPin className="size-3.5" />
            {session.destination || "No destination set"}
            {session.deviated ? (
              <Badge variant="live">Route deviation observed</Badge>
            ) : session.arrived ? (
              <Badge variant="ok">At destination</Badge>
            ) : (
              <Badge>En route</Badge>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-medium">Preserve a note</h2>
        <p className="mt-1 text-xs text-muted">
          Notes stay as you wrote them. GuardianAI never rewrites them.
        </p>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addNote(note);
            setNote("");
          }}
        >
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What should be on the record?"
          />
          <Button type="submit" variant="secondary" disabled={!note.trim()}>
            Preserve
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium">Observed events</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={onAssess}
            disabled={assessing}
          >
            {assessing ? "Reading facts…" : "Ask GuardianAI"}
          </Button>
        </div>
        {assessment ? (
          <p className="mb-4 rounded-md bg-elevated p-3 text-sm text-muted">
            {assessment}
          </p>
        ) : null}
        <Timeline events={session.events} />
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-medium">Preview tools</h2>
        <p className="mt-1 text-xs text-muted">
          Compressed events so you can see prevent, detect, preserve, and
          escalate without waiting for a real night out.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={simulateArrival}>
            Simulate arrival
          </Button>
          <Button size="sm" variant="secondary" onClick={simulateDeviation}>
            Simulate deviation
          </Button>
          <Button size="sm" variant="secondary" onClick={simulateMissedCheckIn}>
            Miss check-in
          </Button>
          {session.online ? (
            <Button size="sm" variant="secondary" onClick={simulateOffline}>
              Go offline
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={simulateOnline}>
              Restore link
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
