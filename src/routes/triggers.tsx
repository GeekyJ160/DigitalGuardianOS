import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, Keyboard, Mic, Watch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGuardianStore } from "@/lib/guardian/store";

export const Route = createFileRoute("/triggers")({
  component: Triggers,
});

function Triggers() {
  const triggers = useGuardianStore((s) => s.triggers);
  const setTriggers = useGuardianStore((s) => s.setTriggers);
  const triggerCovert = useGuardianStore((s) => s.triggerCovert);

  return (
    <div className="stagger-in mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.2em] text-subtle uppercase">Covert</p>
        <h1 className="font-display text-3xl tracking-tight">Triggers</h1>
        <p className="text-sm text-muted">
          The phone does not need a giant red panic button. Guardian can arm from
          a phrase, a decoy surface, a key sequence, or a missed response.
        </p>
      </header>

      <Card className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Mic className="size-4 text-muted" />
          Voice phrase
        </div>
        <Label htmlFor="phrase">Authorized phrase</Label>
        <Input
          id="phrase"
          value={triggers.voicePhrase}
          onChange={(e) => setTriggers({ voicePhrase: e.target.value })}
        />
        <p className="text-xs text-muted">
          Typing this phrase anywhere in the preview silently arms Guardian. On a
          phone it would be a spoken line.
        </p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            triggerCovert("phrase");
            toast("Covert session armed");
          }}
        >
          Test phrase
        </Button>
      </Card>

      <Card className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calculator className="size-4 text-muted" />
          Decoy calculator
        </div>
        <Label htmlFor="pin">PIN</Label>
        <Input
          id="pin"
          value={triggers.pin}
          onChange={(e) => setTriggers({ pin: e.target.value.replace(/\D/g, "").slice(0, 8) })}
          inputMode="numeric"
        />
        <p className="text-xs text-muted">
          Open what looks like a calculator. Enter the PIN. Guardian arms
          silently and the decoy stays on screen.
        </p>
        <Button asChild size="sm" variant="secondary">
          <Link to="/decoy">Open decoy</Link>
        </Button>
      </Card>

      <Card className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Keyboard className="size-4 text-muted" />
            Hardware gesture
          </div>
          <Switch
            checked={triggers.volumeGesture}
            onCheckedChange={(v) => setTriggers({ volumeGesture: v })}
          />
        </div>
        <p className="text-xs text-muted">
          Volume up, down, up, then hold. In this preview: ↑ ↓ ↑ and hold ↑.
        </p>
      </Card>

      <Card className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Watch className="size-4 text-muted" />
            Wearable tap pattern
          </div>
          <Switch
            checked={triggers.watchTap}
            onCheckedChange={(v) => setTriggers({ watchTap: v })}
          />
        </div>
        <p className="text-xs text-muted">
          Three taps on a paired watch would arm the same protocol. Preview
          uses the test control.
        </p>
        <Button
          size="sm"
          variant="secondary"
          disabled={!triggers.watchTap}
          onClick={() => {
            triggerCovert("watch");
            toast("Covert session armed");
          }}
        >
          Test watch pattern
        </Button>
      </Card>
    </div>
  );
}
