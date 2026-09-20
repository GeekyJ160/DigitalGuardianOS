import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGuardianStore } from "@/lib/guardian/store";

export const Route = createFileRoute("/protocol")({
  component: Protocol,
});

function Protocol() {
  const protocol = useGuardianStore((s) => s.protocol);
  const triggers = useGuardianStore((s) => s.triggers);
  const setTriggers = useGuardianStore((s) => s.setTriggers);
  const contacts = useGuardianStore((s) => s.contacts);

  return (
    <div className="stagger-in mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.2em] text-subtle uppercase">Rules</p>
        <h1 className="font-display text-3xl tracking-tight">Protocol</h1>
        <p className="text-sm text-muted">
          Guardian executes only what you authorize. It will not invent a next
          step, and it will not accuse.
        </p>
      </header>

      <ol className="space-y-3">
        {protocol.map((step, i) => (
          <li key={step.id}>
            <Card className="flex gap-4 p-5">
              <span className="tabular text-xs text-subtle">{i + 1}</span>
              <div>
                <h2 className="text-sm font-medium">{step.title}</h2>
                <p className="mt-1 text-sm text-muted">{step.detail}</p>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-medium">Missed-response window</h2>
        <p className="text-xs text-muted">
          After a scheduled check-in is due, Guardian waits this long before
          treating it as missed.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="miss">Seconds</Label>
          <Input
            id="miss"
            type="number"
            min={10}
            max={120}
            value={Math.round(triggers.missedResponseMs / 1000)}
            onChange={(e) =>
              setTriggers({
                missedResponseMs: Math.max(10, Number(e.target.value) || 30) * 1000,
              })
            }
          />
        </div>
      </Card>

      <Card className="space-y-3 p-5">
        <h2 className="text-sm font-medium">Dead-man evidence escrow</h2>
        <p className="text-sm text-muted">
          Sensitive records stay sealed. Nobody in the Circle gets automatic
          access. You define the release: two missed check-ins and the phone
          offline. This preview stores capsules on this device; the offline
          window is compressed to 20 seconds so you can see it fire.
        </p>
        <p className="text-xs text-subtle">
          Default release: {contacts[0]?.name ?? "first Circle member"}.
        </p>
      </Card>

      <Button asChild variant="secondary">
        <Link to="/triggers">Configure covert triggers</Link>
      </Button>
    </div>
  );
}
