import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGuardianStore } from "@/lib/guardian/store";
import type { NotifyOn } from "@/lib/guardian/types";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/circle")({
  component: Circle,
});

const FLAGS: { id: NotifyOn; label: string }[] = [
  { id: "missed_checkin", label: "Missed check-in" },
  { id: "deviation", label: "Route deviation" },
  { id: "offline", label: "Offline" },
  { id: "sos", label: "Covert / SOS" },
  { id: "escrow", label: "Escrow release" },
];

function Circle() {
  const contacts = useGuardianStore((s) => s.contacts);
  const notices = useGuardianStore((s) => s.notices);
  const addContact = useGuardianStore((s) => s.addContact);
  const removeContact = useGuardianStore((s) => s.removeContact);
  const updateContact = useGuardianStore((s) => s.updateContact);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="stagger-in space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.2em] text-subtle uppercase">People</p>
          <h1 className="font-display text-3xl tracking-tight">
            Guardian Circle
          </h1>
          <p className="max-w-xl text-sm text-muted">
            Only the events you authorize are sent, and only to the people you
            name. Guardian never broadcasts a session by default.
          </p>
        </div>
        <Button onClick={() => setOpen((v) => !v)}>
          <Plus className="size-4" />
          Add person
        </Button>
      </header>

      {open ? (
        <Card className="space-y-3 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="cname">Name</Label>
              <Input id="cname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="crel">Relation</Label>
              <Input
                id="crel"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cph">Phone</Label>
              <Input id="cph" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              addContact({
                name: name.trim(),
                relation: relation.trim() || "Circle",
                phone: phone.trim() || "—",
                notifyOn: ["missed_checkin", "sos"],
              });
              setName("");
              setRelation("");
              setPhone("");
              setOpen(false);
            }}
          >
            Save to Circle
          </Button>
        </Card>
      ) : null}

      <ul className="space-y-3">
        {contacts.map((c) => (
          <li key={c.id}>
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium">{c.name}</h2>
                  <p className="text-xs text-muted">
                    {c.relation} · {c.phone}
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeContact(c.id)}
                  aria-label={`Remove ${c.name}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {FLAGS.map((f) => {
                  const on = c.notifyOn.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        const next = on
                          ? c.notifyOn.filter((x) => x !== f.id)
                          : [...c.notifyOn, f.id];
                        updateContact(c.id, { notifyOn: next });
                      }}
                      className={
                        on
                          ? "h-9 rounded-full bg-accent px-3 text-xs text-accent-fg"
                          : "h-9 rounded-full bg-elevated px-3 text-xs text-muted shadow-[var(--shadow-border)]"
                      }
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-medium">Notice log</h2>
        {notices.length === 0 ? (
          <p className="text-sm text-muted">No notices have been sent.</p>
        ) : (
          <ul className="space-y-3">
            {notices.map((n) => (
              <li key={n.id} className="text-sm">
                <span className="text-fg">{n.contactName}</span>
                <span className="text-muted"> — {n.message}</span>
                <div className="text-[10px] text-subtle">
                  {formatDateTime(n.at)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
