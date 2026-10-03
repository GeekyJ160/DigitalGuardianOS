import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CapsuleMark } from "@/components/capsule-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { replyToGuardian } from "@/lib/guardian/local-ai";
import {
  recordSpaceSos,
  sealSpaceDemo,
  startSpaceDemo,
  type SpaceCapsule,
  type SpaceSession,
} from "@/lib/guardian/space-demo";
import { formatTime } from "@/lib/utils";

export const Route = createFileRoute("/digitalguardian")({
  component: DigitalGuardianDemo,
});

function DigitalGuardianDemo() {
  const [session, setSession] = useState<SpaceSession | null>(null);
  const [capsule, setCapsule] = useState<SpaceCapsule | null>(null);
  const [reply, setReply] = useState("");

  const onStart = () => {
    setCapsule(null);
    setReply("");
    setSession(startSpaceDemo("Public Space demo"));
  };

  const onSos = () => {
    if (!session || capsule) return;
    const next = recordSpaceSos(session);
    setSession(next);
    setReply(
      replyToGuardian("I feel unsafe", {
        title: next.title,
        active: true,
      }),
    );
  };

  const onSeal = () => {
    if (!session || capsule) return;
    setCapsule(sealSpaceDemo(session));
    setSession(null);
  };

  const events = capsule?.events ?? session?.events ?? [];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="flex items-center justify-between gap-3 px-4 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <CapsuleMark className="size-7" live={Boolean(session)} />
          <div>
            <p className="text-sm font-medium">Digital Guardian</p>
            <p className="text-[10px] tracking-[0.16em] text-subtle uppercase">
              Public demo
            </p>
          </div>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link to="/">Open app</Link>
        </Button>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-4 px-4 pb-10">
        <Card className="space-y-3 p-5">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">
            What this demo does
          </p>
          <h1 className="font-display text-3xl tracking-tight">
            Record a fact. Seal it here.
          </h1>
          <p className="text-sm text-muted">
            This preview keeps the timeline on this device. It does not record
            live location, monitor you, or contact emergency services.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onStart} disabled={Boolean(session)}>
              Start session
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onSos}
              disabled={!session || Boolean(capsule)}
            >
              Record SOS
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onSeal}
              disabled={!session || Boolean(capsule)}
            >
              End and seal
            </Button>
          </div>
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="text-sm font-medium">Timeline</h2>
          {events.length === 0 ? (
            <p className="text-sm text-muted">No session yet.</p>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li key={event.id}>
                  <p className="text-sm text-fg">{event.label}</p>
                  <p className="text-xs text-muted">{event.detail}</p>
                  <p className="text-[10px] text-subtle">{formatTime(event.at)}</p>
                </li>
              ))}
            </ul>
          )}
          {capsule ? (
            <p className="text-xs text-muted">
              Capsule {capsule.id} sealed on this device. Fingerprint{" "}
              {capsule.integrityHash.slice(0, 12)}. Location recorded: no.
              Dispatched: no.
            </p>
          ) : null}
        </Card>

        {reply ? (
          <Card className="space-y-2 p-5">
            <h2 className="text-sm font-medium">GuardianAI</h2>
            <p className="text-sm text-fg">{reply}</p>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
