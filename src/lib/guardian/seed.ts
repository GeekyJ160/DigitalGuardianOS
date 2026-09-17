import { fingerprint, eventCanonical } from "./hash";
import { uid } from "../utils";
import type {
  Capsule,
  Contact,
  ObservedEvent,
  ProtocolStep,
  TriggerConfig,
} from "./types";

const MAYA = "contact-maya";
const JORDAN = "contact-jordan";
const ALEX = "contact-alex";

export const SEED_CONTACTS: Contact[] = [
  {
    id: MAYA,
    name: "Maya Chen",
    relation: "Sister",
    phone: "+1 ··· ··· 4412",
    notifyOn: ["missed_checkin", "offline", "sos", "escrow"],
  },
  {
    id: JORDAN,
    name: "Jordan Hale",
    relation: "Partner",
    phone: "+1 ··· ··· 8801",
    notifyOn: ["missed_checkin", "deviation", "sos"],
  },
  {
    id: ALEX,
    name: "Alex Rivera",
    relation: "Roommate",
    phone: "+1 ··· ··· 2290",
    notifyOn: ["sos", "escrow"],
  },
];

export const SEED_TRIGGERS: TriggerConfig = {
  voicePhrase: "Tell Maya I'm running late.",
  pin: "9117",
  volumeGesture: true,
  watchTap: true,
  missedResponseMs: 30_000,
};

export const SEED_PROTOCOL: ProtocolStep[] = [
  {
    id: "confirm",
    title: "Confirm you are okay",
    detail: "A silent prompt waits for the missed-response window you set.",
  },
  {
    id: "record",
    title: "Keep recording facts",
    detail: "Location, connectivity, battery, and check-in history continue.",
  },
  {
    id: "circle",
    title: "Notify the Guardian Circle",
    detail: "Only contacts you authorized for that event type are messaged.",
  },
  {
    id: "escrow",
    title: "Arm evidence escrow",
    detail: "If release rules match, the capsule is shared with the named person.",
  },
];

function event(
  at: number,
  kind: ObservedEvent["kind"],
  label: string,
  detail?: string,
): ObservedEvent {
  const id = uid();
  return { id, at, kind, label, detail };
}

function seal(events: ObservedEvent[], extra: string): {
  eventHashes: { eventId: string; hash: string }[];
  integrityHash: string;
} {
  const eventHashes = events.map((e) => ({
    eventId: e.id,
    hash: fingerprint(eventCanonical(e)),
  }));
  const integrityHash = fingerprint(
    extra + eventHashes.map((h) => h.hash).join(""),
  );
  return { eventHashes, integrityHash };
}

export function seedCapsules(now = Date.now()): Capsule[] {
  const dateNight = now - 1000 * 60 * 60 * 18;
  const start = dateNight;
  const nightlifeStart = now - 1000 * 60 * 60 * 72;

  const dateEvents: ObservedEvent[] = [
    event(start, "session_started", "Session started", "Guardian Date — West 7th, Fort Worth. Expected check-in 11:30 PM."),
    event(start + 15 * 60_000, "arrived", "Arrived at destination", "Device location matched the session destination."),
    event(start + 22 * 60_000, "note", "User-submitted note preserved", "At the bar, table near the window."),
    event(start + 28 * 60_000, "checkin_ok", "Check-in received", "User confirmed on time."),
    event(start + 56 * 60_000, "checkin_missed", "Scheduled check-in missed", "No response within the authorized window."),
    event(start + 59 * 60_000, "location_update", "Device began moving north", "Heading changed after a stationary period."),
    event(start + 64 * 60_000, "route_deviation", "Route deviated from expected destination", "Path no longer aligned with the return route home."),
    event(start + 67 * 60_000, "circle_notified", "Guardian Circle notified", "Maya Chen and Jordan Hale received the missed-check-in protocol."),
    event(start + 70 * 60_000, "session_ended", "Session sealed", "Capsule written with original files. No inferences attached."),
  ];

  const dateSeal = seal(dateEvents, "date-west7th");

  const nightEvents: ObservedEvent[] = [
    event(nightlifeStart, "session_started", "Session started", "Nightlife — Near Southside. Expected home by 12:15 AM."),
    event(nightlifeStart + 8 * 60_000, "arrived", "Arrived at destination", "Device location matched the session destination."),
    event(nightlifeStart + 40 * 60_000, "checkin_ok", "Check-in received", "User confirmed on time."),
    event(nightlifeStart + 80 * 60_000, "checkin_ok", "Check-in received", "User confirmed on time."),
    event(nightlifeStart + 110 * 60_000, "location_update", "Device moving toward home", "Path aligned with the expected return route."),
    event(nightlifeStart + 128 * 60_000, "session_ended", "Session sealed", "All authorized check-ins were received. Capsule archived."),
  ];
  const nightSeal = seal(nightEvents, "nightlife-southside");

  return [
    {
      id: "capsule-date-west7th",
      sessionId: "session-date-west7th",
      createdAt: start,
      sealedAt: start + 70 * 60_000,
      title: "Guardian Date — West 7th",
      kind: "date",
      destination: "West 7th, Fort Worth",
      events: dateEvents,
      breadcrumbs: samplePath(start, true),
      ...dateSeal,
      chronology: [
        "10:42 PM — Session started",
        "10:57 PM — Arrived at destination",
        "11:04 PM — User-submitted note preserved",
        "11:10 PM — Check-in received",
        "11:38 PM — Scheduled check-in missed",
        "11:41 PM — Device began moving north",
        "11:46 PM — Route deviated from expected destination",
        "11:49 PM — Guardian Circle notified",
        "11:52 PM — Session sealed",
      ].join("\n"),
      escrow: {
        enabled: true,
        contactId: MAYA,
        missedCheckins: 2,
        offlineMs: 6 * 60 * 60_000,
        released: false,
      },
      original: true,
    },
    {
      id: "capsule-nightlife-southside",
      sessionId: "session-nightlife-southside",
      createdAt: nightlifeStart,
      sealedAt: nightlifeStart + 128 * 60_000,
      title: "Nightlife — Near Southside",
      kind: "nightlife",
      destination: "Near Southside",
      events: nightEvents,
      breadcrumbs: samplePath(nightlifeStart, false),
      ...nightSeal,
      chronology: [
        "9:14 PM — Session started",
        "9:22 PM — Arrived at destination",
        "9:54 PM — Check-in received",
        "10:34 PM — Check-in received",
        "11:04 PM — Device moving toward home",
        "11:22 PM — Session sealed",
      ].join("\n"),
      escrow: {
        enabled: false,
        contactId: MAYA,
        missedCheckins: 2,
        offlineMs: 6 * 60 * 60_000,
        released: false,
      },
      original: true,
    },
  ];
}

function samplePath(start: number, deviate: boolean) {
  const pts = [
    [0.18, 0.78],
    [0.26, 0.7],
    [0.34, 0.62],
    [0.46, 0.55],
    [0.58, 0.48],
    [0.66, 0.42],
    [0.72, 0.38],
  ];
  if (deviate) {
    pts.push([0.7, 0.28], [0.68, 0.18], [0.74, 0.12]);
  } else {
    pts.push([0.6, 0.5], [0.42, 0.62], [0.22, 0.74]);
  }
  return pts.map(([x, y], i) => ({
    t: start + i * 7 * 60_000,
    x,
    y,
  }));
}

export const HOME_POINT = { x: 0.18, y: 0.78 };
export const DEST_POINT = { x: 0.72, y: 0.38 };

export const EXPECTED_PATH: [number, number][] = [
  [0.18, 0.78],
  [0.26, 0.7],
  [0.34, 0.62],
  [0.46, 0.55],
  [0.58, 0.48],
  [0.66, 0.42],
  [0.72, 0.38],
];

export const DEVIATION_PATH: [number, number][] = [
  [0.72, 0.38],
  [0.7, 0.28],
  [0.68, 0.18],
  [0.74, 0.12],
];

export const RETURN_PATH: [number, number][] = [
  [0.72, 0.38],
  [0.6, 0.5],
  [0.42, 0.62],
  [0.22, 0.74],
  [0.18, 0.78],
];
