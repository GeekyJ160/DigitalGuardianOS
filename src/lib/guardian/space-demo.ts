import { eventCanonical, fingerprint } from "./hash.ts";

export type SpaceEventKind = "session_started" | "sos" | "session_sealed";

export type SpaceEvent = {
  id: string;
  at: number;
  kind: SpaceEventKind;
  label: string;
  detail: string;
};

export type SpaceSession = {
  id: string;
  title: string;
  startedAt: number;
  events: SpaceEvent[];
};

export type SpaceCapsule = {
  id: string;
  title: string;
  sealedAt: number;
  events: SpaceEvent[];
  integrityHash: string;
  locationRecorded: false;
  dispatched: false;
};

const SOS_DETAIL =
  "SOS recorded in this demo. Emergency services were not contacted. Call 911 or local emergency services if you need help now.";

function event(
  sessionId: string,
  at: number,
  kind: SpaceEventKind,
  label: string,
  detail: string,
): SpaceEvent {
  return {
    id: `${sessionId}-${kind}-${at}`,
    at,
    kind,
    label,
    detail,
  };
}

export function startSpaceDemo(title: string, now = Date.now()): SpaceSession {
  const clean = title.trim() || "Public Space demo";
  const id = `space-${now}`;
  return {
    id,
    title: clean,
    startedAt: now,
    events: [
      event(
        id,
        now,
        "session_started",
        "Session started",
        `${clean}. Device-local demo. Location is not recorded.`,
      ),
    ],
  };
}

export function recordSpaceSos(session: SpaceSession, now = Date.now()): SpaceSession {
  if (session.events.some((item) => item.kind === "sos")) return session;
  return {
    ...session,
    events: [
      ...session.events,
      event(session.id, now, "sos", "SOS recorded in this demo", SOS_DETAIL),
    ],
  };
}

export function sealSpaceDemo(session: SpaceSession, now = Date.now()): SpaceCapsule {
  const sealed = event(
    session.id,
    now,
    "session_sealed",
    "Session sealed",
    "Capsule stays on this device. Nothing was dispatched.",
  );
  const events = [...session.events, sealed];
  const integrityHash = fingerprint(
    session.id + events.map((item) => fingerprint(eventCanonical(item))).join(""),
  );
  return {
    id: `capsule-${session.id}`,
    title: session.title,
    sealedAt: now,
    events,
    integrityHash,
    locationRecorded: false,
    dispatched: false,
  };
}
