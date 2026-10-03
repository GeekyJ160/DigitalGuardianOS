import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { uid } from "../utils";
import {
  DEVIATION_PATH,
  DEST_POINT,
  EXPECTED_PATH,
  HOME_POINT,
  RETURN_PATH,
  SEED_CONTACTS,
  SEED_PROTOCOL,
  SEED_TRIGGERS,
  seedCapsules,
} from "./seed";
import {
  applyCheckIn,
  applySos,
  createSession,
  notifyCircle,
  observed,
  sealCapsule,
  type StartSessionInput,
} from "./session-ops";
import type {
  Contact,
  EventKind,
  GuardianState,
  ObservedEvent,
  ProtocolStep,
  Session,
  TriggerConfig,
} from "./types";

type GuardianActions = {
  completeOnboarding: (name?: string) => void;
  setDisplayName: (name: string) => void;
  addContact: (c: Omit<Contact, "id">) => void;
  removeContact: (id: string) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  setTriggers: (patch: Partial<TriggerConfig>) => void;
  setProtocol: (steps: ProtocolStep[]) => void;
  startSession: (input: StartSessionInput) => string;
  addEvent: (
    sessionId: string,
    kind: EventKind,
    label: string,
    detail?: string,
    meta?: ObservedEvent["meta"],
  ) => void;
  checkIn: (sessionId?: string) => void;
  confirmOk: (sessionId?: string) => void;
  tick: (now?: number) => void;
  endSession: (sessionId?: string) => string | null;
  simulateArrival: () => void;
  simulateDeviation: () => void;
  simulateMissedCheckIn: () => void;
  simulateOffline: () => void;
  simulateOnline: () => void;
  triggerCovert: (source: "pin" | "phrase" | "gesture" | "watch") => string;
  triggerSos: (sessionId?: string) => void;
  saveChronology: (capsuleId: string, text: string) => void;
  releaseEscrow: (capsuleId: string) => void;
  addNote: (text: string) => void;
  resetPreview: () => void;
};

type Store = GuardianState & GuardianActions;

function lerpPath(
  path: [number, number][],
  t: number,
): { x: number; y: number } {
  if (path.length === 0) return HOME_POINT;
  if (path.length === 1) return { x: path[0][0], y: path[0][1] };
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (path.length - 1);
  const i = Math.min(path.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = path[i];
  const b = path[i + 1];
  return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f };
}

const initial = (): GuardianState => ({
  onboarded: false,
  displayName: "",
  contacts: SEED_CONTACTS,
  sessions: [],
  activeSessionId: null,
  capsules: seedCapsules(),
  triggers: SEED_TRIGGERS,
  protocol: SEED_PROTOCOL,
  notices: [],
  offlineSince: null,
});

export const useGuardianStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initial(),

      completeOnboarding: (name) =>
        set({
          onboarded: true,
          displayName: name?.trim() || get().displayName,
        }),

      setDisplayName: (name) => set({ displayName: name }),

      addContact: (c) =>
        set({ contacts: [...get().contacts, { ...c, id: uid() }] }),

      removeContact: (id) =>
        set({ contacts: get().contacts.filter((c) => c.id !== id) }),

      updateContact: (id, patch) =>
        set({
          contacts: get().contacts.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        }),

      setTriggers: (patch) =>
        set({ triggers: { ...get().triggers, ...patch } }),

      setProtocol: (steps) => set({ protocol: steps }),

      startSession: (input) => {
        const existing = get().activeSessionId;
        if (existing) {
          const cur = get().sessions.find((s) => s.id === existing);
          if (cur && cur.status !== "ended") {
            get().endSession(existing);
          }
        }
        const session = createSession(input);
        set({
          sessions: [session, ...get().sessions],
          activeSessionId: session.id,
        });
        return session.id;
      },

      addEvent: (sessionId, kind, label, detail, meta) => {
        const ev = observed(kind, label, detail, meta);
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId ? { ...s, events: [...s.events, ev] } : s,
          ),
        });
      },

      checkIn: (sessionId) => {
        const id = sessionId ?? get().activeSessionId;
        if (!id) return;
        set({
          sessions: get().sessions.map((s) =>
            s.id === id ? applyCheckIn(s) : s,
          ),
        });
      },

      confirmOk: (sessionId) => get().checkIn(sessionId),

      tick: (now = Date.now()) => {
        const { activeSessionId, sessions, contacts, triggers } = get();
        if (!activeSessionId) return;
        const session = sessions.find((s) => s.id === activeSessionId);
        if (!session || session.status === "ended") return;

        const elapsed = now - session.startedAt;
        const window = Math.max(1, session.expectedEndAt - session.startedAt);
        let pathProgress = Math.min(1, elapsed / (window * 0.45));
        let arrived = session.arrived;
        let departed = session.departed;
        let events = session.events;
        let breadcrumbs = session.breadcrumbs;
        let status = session.status;
        let confirmUntil = session.confirmUntil;
        let nextCheckInAt = session.nextCheckInAt;
        let missedCheckins = session.missedCheckins;
        let protocolFired = session.protocolFired;
        let notices = get().notices;
        let online = session.online;
        let sessionEscrow = session.escrow;
        const battery = Math.max(4, session.battery - 0.015);

        const push = (
          kind: EventKind,
          label: string,
          detail?: string,
        ) => {
          events = [...events, observed(kind, label, detail)];
        };

        if (!arrived && pathProgress >= 1) {
          arrived = true;
          pathProgress = 1;
          push(
            "arrived",
            "Arrived at destination",
            session.destination
              ? `Device location matched ${session.destination}.`
              : "Device location matched the session destination.",
          );
        }

        const returnStart = window * 0.7;
        if (arrived && !session.deviated && elapsed > returnStart) {
          departed = true;
        }

        let pos: { x: number; y: number };
        if (session.deviated) {
          const dElapsed = elapsed - (session.events.find((e) => e.kind === "route_deviation")?.at ?? now) + session.startedAt;
          const dt = Math.min(1, Math.max(0, dElapsed / 40_000));
          pos = lerpPath(DEVIATION_PATH, dt);
        } else if (!arrived) {
          pos = lerpPath(EXPECTED_PATH, pathProgress);
        } else if (departed) {
          const t = Math.min(1, (elapsed - returnStart) / (window * 0.28));
          pos = lerpPath(RETURN_PATH, t);
        } else {
          const wobble = Math.sin(now / 4000) * 0.008;
          pos = { x: DEST_POINT.x + wobble, y: DEST_POINT.y };
        }

        const last = breadcrumbs[breadcrumbs.length - 1];
        if (
          !last ||
          Math.hypot(pos.x - last.x, pos.y - last.y) > 0.012 ||
          now - last.t > 4000
        ) {
          breadcrumbs = [...breadcrumbs, { t: now, x: pos.x, y: pos.y }].slice(
            -80,
          );
        }

        if (
          session.online &&
          confirmUntil === null &&
          now >= nextCheckInAt
        ) {
          confirmUntil = now + triggers.missedResponseMs;
          push(
            "checkin_prompt",
            "Check-in prompt issued",
            `Confirm you are okay within ${Math.round(triggers.missedResponseMs / 1000)} seconds.`,
          );
        }

        if (confirmUntil !== null && now >= confirmUntil) {
          missedCheckins += 1;
          confirmUntil = null;
          nextCheckInAt = now + session.checkInEveryMs;
          status = "alert";
          push(
            "checkin_missed",
            "Scheduled check-in missed",
            "No response within the authorized window.",
          );
          if (!protocolFired) {
            protocolFired = true;
            const n = notifyCircle(
              contacts,
              "checkin_missed",
              `Missed check-in on ${session.title}.`,
            );
            notices = [...n, ...notices];
            if (n.length) {
              push(
                "circle_notified",
                "Guardian Circle notified",
                n.map((x) => x.contactName).join(", ") +
                  " received the missed-check-in protocol.",
              );
            }
          }
        }

        const offlineSince = get().offlineSince;
        if (!online && offlineSince) {
          const rule = session.escrow;
          if (
            rule.enabled &&
            !rule.released &&
            missedCheckins >= rule.missedCheckins &&
            now - offlineSince >= rule.offlineMs
          ) {
            const contact = contacts.find((c) => c.id === rule.contactId);
            push(
              "escrow_released",
              "Evidence escrow released",
              contact
                ? `Release rules matched. Capsule access granted to ${contact.name}.`
                : "Release rules matched.",
            );
            const n = notifyCircle(
              contacts,
              "escrow_released",
              `Escrow released for ${session.title}.`,
            );
            notices = [...n, ...notices];
            sessionEscrow = {
              ...rule,
              released: true,
              releasedAt: now,
            };
          }
        }

        if (battery < 15 && session.battery >= 15) {
          push(
            "battery_change",
            "Battery crossed 15%",
            "Device battery entered the low band.",
          );
        }

        set({
          notices,
          sessions: sessions.map((s) =>
            s.id === session.id
              ? {
                  ...s,
                  events,
                  breadcrumbs,
                  pathProgress,
                  arrived,
                  departed,
                  status,
                  confirmUntil,
                  nextCheckInAt,
                  missedCheckins,
                  protocolFired,
                  battery,
                  online,
                  escrow: sessionEscrow,
                }
              : s,
          ),
        });
      },

      endSession: (sessionId) => {
        const id = sessionId ?? get().activeSessionId;
        if (!id) return null;
        const session = get().sessions.find((s) => s.id === id);
        if (!session || session.status === "ended") return null;
        const endEv = observed(
          "session_ended",
          "Session sealed",
          "Capsule written with original observed events. No inferences attached.",
        );
        const ended: Session = {
          ...session,
          status: "ended",
          events: [...session.events, endEv],
          confirmUntil: null,
        };
        const capsule = sealCapsule(ended, session.escrow);
        set({
          sessions: get().sessions.map((s) => (s.id === id ? ended : s)),
          activeSessionId:
            get().activeSessionId === id ? null : get().activeSessionId,
          capsules: [capsule, ...get().capsules.filter((c) => c.sessionId !== id)],
        });
        return capsule.id;
      },

      simulateArrival: () => {
        const id = get().activeSessionId;
        if (!id) return;
        set({
          sessions: get().sessions.map((s) => {
            if (s.id !== id || s.arrived) return s;
            const ev = observed(
              "arrived",
              "Arrived at destination",
              s.destination
                ? `Device location matched ${s.destination}.`
                : "Device location matched the session destination.",
            );
            return {
              ...s,
              arrived: true,
              pathProgress: 1,
              breadcrumbs: [
                ...s.breadcrumbs,
                { t: Date.now(), x: DEST_POINT.x, y: DEST_POINT.y },
              ],
              events: [...s.events, ev],
            };
          }),
        });
      },

      simulateDeviation: () => {
        const id = get().activeSessionId;
        if (!id) return;
        const session = get().sessions.find((s) => s.id === id);
        if (!session || session.deviated) return;
        const move = observed(
          "location_update",
          "Device began moving north",
          "Heading changed after a stationary period.",
        );
        const dev = observed(
          "route_deviation",
          "Route deviated from expected destination",
          "Path no longer aligned with the expected route.",
        );
        const n = notifyCircle(
          get().contacts,
          "route_deviation",
          `Route deviation on ${session.title}.`,
        );
        const extra = n.length
          ? [
              observed(
                "circle_notified",
                "Guardian Circle notified",
                n.map((x) => x.contactName).join(", ") +
                  " received a route-deviation notice.",
              ),
            ]
          : [];
        set({
          notices: [...n, ...get().notices],
          sessions: get().sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  arrived: true,
                  deviated: true,
                  status: "alert",
                  events: [...s.events, move, dev, ...extra],
                }
              : s,
          ),
        });
      },

      simulateMissedCheckIn: () => {
        const id = get().activeSessionId;
        if (!id) return;
        set({
          sessions: get().sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  nextCheckInAt: Date.now() - 1000,
                  confirmUntil: Date.now() - 1000,
                }
              : s,
          ),
        });
        get().tick();
      },

      simulateOffline: () => {
        const id = get().activeSessionId;
        if (!id) return;
        const ev = observed(
          "connectivity_lost",
          "Device connectivity lost",
          "Phone reported offline.",
        );
        const n = notifyCircle(
          get().contacts,
          "connectivity_lost",
          "Device went offline during a protected session.",
        );
        set({
          offlineSince: Date.now(),
          notices: [...n, ...get().notices],
          sessions: get().sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  online: false,
                  status: "alert",
                  events: [
                    ...s.events,
                    ev,
                    ...(n.length
                      ? [
                          observed(
                            "circle_notified",
                            "Guardian Circle notified",
                            n.map((x) => x.contactName).join(", ") +
                              " received an offline notice.",
                          ),
                        ]
                      : []),
                  ],
                }
              : s,
          ),
        });
      },

      simulateOnline: () => {
        const id = get().activeSessionId;
        if (!id) return;
        const ev = observed(
          "connectivity_restored",
          "Device connectivity restored",
          "Phone reported online.",
        );
        set({
          offlineSince: null,
          sessions: get().sessions.map((s) =>
            s.id === id ? { ...s, online: true, events: [...s.events, ev] } : s,
          ),
        });
      },

      triggerCovert: (source) => {
        const sourceLabel = {
          pin: "Covert PIN accepted on decoy surface",
          phrase: "Voice phrase matched the authorized trigger",
          gesture: "Hardware gesture sequence matched",
          watch: "Wearable tap pattern matched",
        }[source];
        const existing = get().activeSessionId;
        if (existing) {
          const ev = observed(
            "covert_trigger",
            "Covert trigger activated",
            sourceLabel,
            { source },
          );
          set({
            sessions: get().sessions.map((s) =>
              s.id === existing
                ? { ...s, covert: true, status: "alert", events: [...s.events, ev] }
                : s,
            ),
          });
          return existing;
        }
        const id = get().startSession({
          kind: "custom",
          destination: "",
          meetingWith: "",
          durationMs: 12 * 60_000,
          checkInEveryMs: 90_000,
          escrowEnabled: true,
          escrowContactId: get().contacts[0]?.id ?? "",
          covert: true,
        });
        get().addEvent(id, "covert_trigger", "Covert trigger activated", sourceLabel, {
          source,
        });
        return id;
      },

      triggerSos: (sessionId) => {
        const id = sessionId ?? get().activeSessionId;
        if (!id) return;
        const session = get().sessions.find((s) => s.id === id);
        if (!session || session.status === "ended") return;
        const result = applySos(session, get().contacts);
        set({
          notices: [...result.notices, ...get().notices],
          sessions: get().sessions.map((s) =>
            s.id === id ? result.session : s,
          ),
        });
      },

      saveChronology: (capsuleId, text) =>
        set({
          capsules: get().capsules.map((c) =>
            c.id === capsuleId ? { ...c, chronology: text } : c,
          ),
        }),

      releaseEscrow: (capsuleId) => {
        const cap = get().capsules.find((c) => c.id === capsuleId);
        if (!cap || cap.escrow.released) return;
        const contact = get().contacts.find((c) => c.id === cap.escrow.contactId);
        const n = notifyCircle(
          get().contacts,
          "escrow_released",
          `Escrow released for ${cap.title}.`,
        );
        set({
          notices: [...n, ...get().notices],
          capsules: get().capsules.map((c) =>
            c.id === capsuleId
              ? {
                  ...c,
                  escrow: {
                    ...c.escrow,
                    released: true,
                    releasedAt: Date.now(),
                  },
                  events: [
                    ...c.events,
                    observed(
                      "escrow_released",
                      "Evidence escrow released",
                      contact
                        ? `Release rules matched. Capsule access granted to ${contact.name}.`
                        : "Release rules matched.",
                    ),
                  ],
                }
              : c,
          ),
        });
      },

      addNote: (text) => {
        const id = get().activeSessionId;
        if (!id || !text.trim()) return;
        const ev = observed(
          "note",
          "User-submitted note preserved",
          text.trim(),
        );
        set({
          sessions: get().sessions.map((s) =>
            s.id === id
              ? { ...s, notes: [...s.notes, text.trim()], events: [...s.events, ev] }
              : s,
          ),
        });
      },

      resetPreview: () => set(initial()),
    }),
    {
      name: "guardianos-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GuardianState>;
        return {
          ...current,
          ...p,
        };
      },
      partialize: (s) => ({
        onboarded: s.onboarded,
        displayName: s.displayName,
        contacts: s.contacts,
        sessions: s.sessions,
        activeSessionId: s.activeSessionId,
        capsules: s.capsules,
        triggers: s.triggers,
        protocol: s.protocol,
        notices: s.notices,
        offlineSince: s.offlineSince,
      }),
    },
  ),
);

export function useActiveSession(): Session | null {
  return useGuardianStore((s) => {
    if (!s.activeSessionId) return null;
    return s.sessions.find((x) => x.id === s.activeSessionId) ?? null;
  });
}
