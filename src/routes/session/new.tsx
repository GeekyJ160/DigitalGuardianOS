import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SESSION_KINDS } from "@/lib/guardian/kinds";
import { useGuardianStore } from "@/lib/guardian/store";
import type { SessionKind } from "@/lib/guardian/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/session/new")({
  component: NewSession,
});

export function NewSession() {
  const navigate = useNavigate();
  const start = useGuardianStore((s) => s.startSession);
  const contacts = useGuardianStore((s) => s.contacts);
  const [kind, setKind] = useState<SessionKind>("date");
  const preset = SESSION_KINDS.find((k) => k.id === kind)!;
  const [destination, setDestination] = useState(preset.defaultDestination);
  const [meetingWith, setMeetingWith] = useState("");
  const [durationMin, setDurationMin] = useState(8);
  const [checkInSec, setCheckInSec] = useState(90);
  const [escrow, setEscrow] = useState(true);
  const [escrowContact, setEscrowContact] = useState(contacts[0]?.id ?? "");

  const applyKind = (id: SessionKind) => {
    setKind(id);
    const next = SESSION_KINDS.find((k) => k.id === id);
    if (next) setDestination(next.defaultDestination);
  };

  const onStart = () => {
    const id = start({
      kind,
      destination: destination.trim(),
      meetingWith: meetingWith.trim(),
      durationMs: durationMin * 60_000,
      checkInEveryMs: checkInSec * 1000,
      escrowEnabled: escrow,
      escrowContactId: escrowContact,
    });
    void navigate({ to: "/session/$id", params: { id } });
  };

  return (
    <div className="stagger-in mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.2em] text-subtle uppercase">
          Arm a window
        </p>
        <h1 className="font-display text-3xl tracking-tight">
          Start a Guardian Session
        </h1>
        <p className="text-sm text-muted">
          Preview timers are shortened so you can experience check-ins and the
          protocol without waiting hours.
        </p>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        {SESSION_KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => applyKind(k.id)}
            className={cn(
              "rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150",
              kind === k.id
                ? "shadow-[var(--shadow-border-hover)] ring-1 ring-accent/40"
                : "hover:shadow-[var(--shadow-border-hover)]",
            )}
          >
            <div className="text-sm font-medium">{k.title}</div>
            <p className="mt-1 text-xs text-muted">{k.blurb}</p>
          </button>
        ))}
      </div>

      <Card className="space-y-4 p-5">
        <div className="space-y-1.5">
          <Label htmlFor="dest">Destination</Label>
          <Input
            id="dest"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Address or place"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="who">Meeting with</Label>
          <Input
            id="who"
            value={meetingWith}
            onChange={(e) => setMeetingWith(e.target.value)}
            placeholder="Optional name"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="dur">Expected window (minutes)</Label>
            <Input
              id="dur"
              type="number"
              min={3}
              max={30}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value) || 8)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ci">Check-in every (seconds)</Label>
            <Input
              id="ci"
              type="number"
              min={30}
              max={180}
              value={checkInSec}
              onChange={(e) => setCheckInSec(Number(e.target.value) || 90)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-elevated px-3 py-3">
          <div>
            <p className="text-sm">Dead-man evidence escrow</p>
            <p className="text-xs text-muted">
              Release the capsule if two check-ins are missed and the phone goes
              offline.
            </p>
          </div>
          <Switch checked={escrow} onCheckedChange={setEscrow} />
        </div>
        {escrow && contacts.length > 0 ? (
          <div className="space-y-1.5">
            <Label htmlFor="escrow-who">Release to</Label>
            <select
              id="escrow-who"
              className="flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
              value={escrowContact}
              onChange={(e) => setEscrowContact(e.target.value)}
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.relation}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </Card>

      <Button size="lg" className="w-full sm:w-auto" onClick={onStart}>
        Arm session
      </Button>
    </div>
  );
}
