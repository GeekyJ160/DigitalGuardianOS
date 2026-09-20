import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Download } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BreadcrumbMap } from "@/components/breadcrumb-map";
import { CapsuleObject } from "@/components/capsule-mark";
import { Timeline } from "@/components/timeline";
import { reconstructChronology } from "@/lib/guardian/ai";
import { useGuardianStore } from "@/lib/guardian/store";
import { formatDateTime, formatTime, shortHash } from "@/lib/utils";

export const Route = createFileRoute("/capsules/$id")({
  component: CapsuleDetail,
});

export function CapsuleDetail() {
  const { id } = Route.useParams();
  const capsule = useGuardianStore((s) => s.capsules.find((c) => c.id === id));
  const contacts = useGuardianStore((s) => s.contacts);
  const saveChronology = useGuardianStore((s) => s.saveChronology);
  const releaseEscrow = useGuardianStore((s) => s.releaseEscrow);
  const [working, setWorking] = useState(false);

  if (!capsule) {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl">Capsule not found</h1>
        <Button asChild variant="secondary">
          <Link to="/capsules">Back to vault</Link>
        </Button>
      </div>
    );
  }

  const escrowName =
    contacts.find((c) => c.id === capsule.escrow.contactId)?.name ?? "named contact";

  const onReconstruct = async () => {
    setWorking(true);
    try {
      const res = await reconstructChronology({
        data: {
          title: capsule.title,
          destination: capsule.destination,
          events: capsule.events.map((e) => ({
            at: formatTime(e.at),
            kind: e.kind,
            label: e.label,
            detail: e.detail,
          })),
        },
      });
      if (res.ok) {
        saveChronology(capsule.id, res.text);
        toast(
          res.source === "local"
            ? "Chronology written from original records on this device"
            : "Chronology written from original records",
        );
      } else {
        toast("GuardianAI could not complete the chronology.");
      }
    } catch {
      toast("GuardianAI could not complete the chronology.");
    } finally {
      setWorking(false);
    }
  };

  const onExport = () => {
    const pkg = {
      product: "Guardian Verify",
      notice:
        "Fact package. Not a police report. Not an accusation. Original records only.",
      capsule: {
        id: capsule.id,
        title: capsule.title,
        sealedAt: new Date(capsule.sealedAt).toISOString(),
        destination: capsule.destination,
        integrityHash: capsule.integrityHash,
        original: true,
      },
      checks: {
        locationData: capsule.breadcrumbs.length > 0,
        eventFingerprints: capsule.eventHashes.length > 0,
        deviceTimestamps: true,
        checkInRecords: capsule.events.some((e) =>
          e.kind.startsWith("checkin"),
        ),
        emergencyContactEvents: capsule.events.some(
          (e) => e.kind === "circle_notified",
        ),
        fileIntegrity: Boolean(capsule.integrityHash),
      },
      events: capsule.events.map((e) => ({
        at: new Date(e.at).toISOString(),
        kind: e.kind,
        label: e.label,
        detail: e.detail ?? null,
        hash: capsule.eventHashes.find((h) => h.eventId === e.id)?.hash ?? null,
      })),
    };
    const blob = new Blob([JSON.stringify(pkg, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${capsule.id}.guardian.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const checks = [
    { label: "Location data", ok: capsule.breadcrumbs.length > 0 },
    { label: "Event fingerprints", ok: capsule.eventHashes.length > 0 },
    { label: "Device timestamps", ok: true },
    {
      label: "Check-in records",
      ok: capsule.events.some((e) => e.kind.startsWith("checkin")),
    },
    {
      label: "Emergency-contact events",
      ok: capsule.events.some((e) => e.kind === "circle_notified"),
    },
    { label: "File integrity", ok: Boolean(capsule.integrityHash) },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <CapsuleObject
          serial={capsule.integrityHash}
          sealed
          live={capsule.escrow.released}
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-[0.2em] text-subtle uppercase">
            Capsule
          </p>
          <h1 className="font-display text-3xl tracking-tight">{capsule.title}</h1>
          <p className="mt-1 text-sm text-muted">
            Sealed {formatDateTime(capsule.sealedAt)}
          </p>
          <p className="mt-2 font-mono text-xs text-subtle">
            {shortHash(capsule.integrityHash, 10)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onExport}>
            <Download className="size-4" />
            Export fact package
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden p-0">
        <BreadcrumbMap crumbs={capsule.breadcrumbs} className="h-52" />
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium">GuardianAI chronology</h2>
          <Button size="sm" variant="outline" onClick={onReconstruct} disabled={working}>
            {working ? "Writing…" : capsule.chronology ? "Rewrite from originals" : "Reconstruct"}
          </Button>
        </div>
        {capsule.chronology ? (
          <pre className="overflow-x-auto font-sans text-sm leading-relaxed whitespace-pre-wrap text-fg">
            {capsule.chronology}
          </pre>
        ) : (
          <p className="text-sm text-muted">
            Reconstruct a human-readable chronology from the original records.
            GuardianAI will not add inferences. If the model is unavailable, the
            chronology is written from the event labels on this device.
          </p>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h2 className="mb-4 text-sm font-medium">Observed events</h2>
          <Timeline events={capsule.events} />
        </Card>
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <h2 className="text-sm font-medium">Guardian Verify</h2>
            <p className="mt-1 text-xs text-muted">
              A fact package. Not a police report. Not an accusation.
            </p>
            <ul className="mt-4 space-y-2">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{c.label}</span>
                  {c.ok ? (
                    <span className="flex items-center gap-1 text-ok">
                      <Check className="size-3.5" />
                    </span>
                  ) : (
                    <span className="text-subtle">—</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium">Evidence escrow</h2>
              {capsule.escrow.released ? (
                <Badge variant="live">Released</Badge>
              ) : capsule.escrow.enabled ? (
                <Badge>Armed</Badge>
              ) : (
                <Badge>Off</Badge>
              )}
            </div>
            <p className="mt-2 text-xs text-muted">
              If two check-ins fail and the device stays offline, access goes to{" "}
              {escrowName}. In production, an escrow copy would outlive the
              phone. This preview keeps the capsule on this device.
            </p>
            {capsule.escrow.enabled && !capsule.escrow.released ? (
              <Button
                className="mt-4 w-full"
                variant="secondary"
                onClick={() => {
                  releaseEscrow(capsule.id);
                  toast(`Capsule released to ${escrowName}`);
                }}
              >
                Simulate release
              </Button>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
