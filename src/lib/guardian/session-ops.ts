import { uid } from "../utils.ts";
import { eventCanonical, fingerprint } from "./hash.ts";
import { kindTitle } from "./kinds.ts";
import type {
  Capsule,
  CircleNotice,
  Contact,
  EventKind,
  ObservedEvent,
  Session,
  SessionKind,
} from "./types.ts";

const HOME = { x: 0.18, y: 0.78 };

export function observed(
  kind: EventKind,
  label: string,
  detail?: string,
  meta?: ObservedEvent["meta"],
): ObservedEvent {
  return { id: uid(), at: Date.now(), kind, label, detail, meta };
}

export function notifyCircle(
  contacts: Contact[],
  kind: EventKind,
  message: string,
): CircleNotice[] {
  const map: Record<string, Contact["notifyOn"][number] | null> = {
    checkin_missed: "missed_checkin",
    route_deviation: "deviation",
    connectivity_lost: "offline",
    sos: "sos",
    escrow_released: "escrow",
    covert_trigger: "sos",
  };
  const flag = map[kind];
  if (!flag) return [];
  return contacts
    .filter((c) => c.notifyOn.includes(flag))
    .map((c) => ({
      id: uid(),
      at: Date.now(),
      contactId: c.id,
      contactName: c.name,
      message,
      eventKind: kind,
    }));
}

export function sealCapsule(session: Session, escrow: Capsule["escrow"]): Capsule {
  const events = session.events;
  const eventHashes = events.map((e) => ({
    eventId: e.id,
    hash: fingerprint(eventCanonical(e)),
  }));
  const integrityHash = fingerprint(
    session.id + eventHashes.map((h) => h.hash).join(""),
  );
  return {
    id: `capsule-${session.id}`,
    sessionId: session.id,
    createdAt: session.startedAt,
    sealedAt: Date.now(),
    title: session.title,
    kind: session.kind,
    destination: session.destination,
    events,
    breadcrumbs: session.breadcrumbs,
    eventHashes,
    integrityHash,
    escrow,
    original: true,
  };
}

export type StartSessionInput = {
  kind: SessionKind;
  destination: string;
  meetingWith: string;
  durationMs: number;
  checkInEveryMs: number;
  escrowEnabled: boolean;
  escrowContactId: string;
  covert?: boolean;
};

export function createSession(input: StartSessionInput, now = Date.now()): Session {
  const id = uid();
  const title = input.destination
    ? `${kindTitle(input.kind)} — ${input.destination}`
    : kindTitle(input.kind);
  const startEvent = observed(
    "session_started",
    "Session started",
    `${title}. Check-in every ${Math.round(input.checkInEveryMs / 1000)}s in this preview (shortened).`,
    { covert: Boolean(input.covert) },
  );
  return {
    id,
    kind: input.kind,
    title,
    destination: input.destination,
    meetingWith: input.meetingWith,
    startedAt: now,
    expectedEndAt: now + input.durationMs,
    checkInEveryMs: input.checkInEveryMs,
    nextCheckInAt: now + input.checkInEveryMs,
    confirmUntil: null,
    missedCheckins: 0,
    status: "active",
    protocolFired: false,
    events: [startEvent],
    breadcrumbs: [{ t: now, x: HOME.x, y: HOME.y }],
    battery: 87,
    online: true,
    notes: [],
    pathProgress: 0,
    arrived: false,
    departed: false,
    deviated: false,
    covert: Boolean(input.covert),
    escrow: {
      enabled: input.escrowEnabled,
      contactId: input.escrowContactId,
      missedCheckins: 2,
      offlineMs: 20_000,
      released: false,
    },
  };
}

export function applyCheckIn(session: Session, now = Date.now()): Session {
  const ev = observed(
    "checkin_ok",
    "Check-in received",
    "User confirmed within the authorized window.",
  );
  return {
    ...session,
    events: [...session.events, ev],
    nextCheckInAt: now + session.checkInEveryMs,
    confirmUntil: null,
    status: session.status === "alert" && !session.deviated ? "active" : session.status,
  };
}

export function applySos(
  session: Session,
  contacts: Contact[],
): { session: Session; notices: CircleNotice[] } {
  const ev = observed(
    "sos",
    "SOS recorded in this preview",
    "This preview does not dispatch emergency services. Call 911 or local emergency services if you need help now.",
  );
  const notices = notifyCircle(
    contacts,
    "sos",
    `SOS recorded on ${session.title} (preview — not dispatched).`,
  );
  const extra = notices.length
    ? [
        observed(
          "circle_notified",
          "Guardian Circle notified",
          notices.map((x) => x.contactName).join(", ") +
            " received an SOS notice. Emergency services were not contacted.",
        ),
      ]
    : [];
  return {
    notices,
    session: {
      ...session,
      status: "alert",
      events: [...session.events, ev, ...extra],
    },
  };
}
