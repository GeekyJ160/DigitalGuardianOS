import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Contact } from "./types.ts";
import {
  applyCheckIn,
  applySos,
  createSession,
  notifyCircle,
  observed,
  sealCapsule,
} from "./session-ops.ts";

const CONTACTS: Contact[] = [
  {
    id: "contact-maya",
    name: "Maya Chen",
    relation: "Sister",
    phone: "+1",
    notifyOn: ["missed_checkin", "offline", "sos", "escrow"],
  },
  {
    id: "contact-jordan",
    name: "Jordan Hale",
    relation: "Partner",
    phone: "+1",
    notifyOn: ["missed_checkin", "deviation", "sos"],
  },
  {
    id: "contact-alex",
    name: "Alex Rivera",
    relation: "Roommate",
    phone: "+1",
    notifyOn: ["sos", "escrow"],
  },
];

describe("guardian session ops", () => {
  it("starts a session and records a check-in", () => {
    const session = createSession({
      kind: "date",
      destination: "West 7th",
      meetingWith: "Alex",
      durationMs: 8 * 60_000,
      checkInEveryMs: 90_000,
      escrowEnabled: true,
      escrowContactId: "contact-maya",
    });
    const next = applyCheckIn(session);
    assert.equal(next.status, "active");
    assert.equal(next.events.some((e) => e.kind === "checkin_ok"), true);
  });

  it("records a missed check-in as an observed event, not a verdict", () => {
    const session = createSession({
      kind: "date",
      destination: "West 7th",
      meetingWith: "",
      durationMs: 8 * 60_000,
      checkInEveryMs: 90_000,
      escrowEnabled: false,
      escrowContactId: "",
    });
    const missed = observed(
      "checkin_missed",
      "Scheduled check-in missed",
      "No response within the authorized window.",
    );
    assert.match(missed.label, /missed/i);
    assert.equal(/abduct|danger/i.test(missed.label), false);
    assert.equal(session.status, "active");
  });

  it("notifies authorized Circle members on route deviation", () => {
    const notices = notifyCircle(
      CONTACTS,
      "route_deviation",
      "Route deviation on Guardian Date — West 7th.",
    );
    assert.ok(notices.some((n) => n.contactName === "Jordan Hale"));
    assert.equal(
      notices.some((n) => n.contactName === "Alex Rivera"),
      false,
    );
  });

  it("seals a capsule with per-event fingerprints", () => {
    const session = createSession({
      kind: "custom",
      destination: "",
      meetingWith: "",
      durationMs: 8 * 60_000,
      checkInEveryMs: 90_000,
      escrowEnabled: false,
      escrowContactId: "",
    });
    const capsule = sealCapsule(session, session.escrow);
    assert.equal(capsule.eventHashes.length, capsule.events.length);
    assert.equal(capsule.integrityHash.length, 64);
  });

  it("records SOS without claiming dispatch", () => {
    const session = createSession({
      kind: "nightlife",
      destination: "Near Southside",
      meetingWith: "",
      durationMs: 8 * 60_000,
      checkInEveryMs: 90_000,
      escrowEnabled: true,
      escrowContactId: "contact-maya",
    });
    const { session: next } = applySos(session, CONTACTS);
    const sos = next.events.find((e) => e.kind === "sos");
    assert.ok(sos);
    assert.match(sos.detail ?? "", /does not dispatch/i);
  });
});
