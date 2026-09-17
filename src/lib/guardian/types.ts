export type SessionKind =
  | "date"
  | "ride"
  | "showing"
  | "travel"
  | "nightlife"
  | "work"
  | "custom";

export type EventKind =
  | "session_started"
  | "arrived"
  | "checkin_ok"
  | "checkin_missed"
  | "checkin_prompt"
  | "location_update"
  | "route_deviation"
  | "battery_change"
  | "connectivity_lost"
  | "connectivity_restored"
  | "circle_notified"
  | "sos"
  | "covert_trigger"
  | "note"
  | "session_ended"
  | "escrow_armed"
  | "escrow_released"
  | "media_preserved";

export type NotifyOn =
  | "missed_checkin"
  | "deviation"
  | "offline"
  | "sos"
  | "escrow";

export type SessionStatus = "armed" | "active" | "alert" | "ended";

export type Contact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  notifyOn: NotifyOn[];
};

export type ObservedEvent = {
  id: string;
  at: number;
  kind: EventKind;
  label: string;
  detail?: string;
  meta?: Record<string, string | number | boolean>;
};

export type Breadcrumb = {
  t: number;
  x: number;
  y: number;
};

export type EscrowRule = {
  enabled: boolean;
  contactId: string;
  missedCheckins: number;
  offlineMs: number;
  released: boolean;
  releasedAt?: number;
};

export type Session = {
  id: string;
  kind: SessionKind;
  title: string;
  destination: string;
  meetingWith: string;
  startedAt: number;
  expectedEndAt: number;
  checkInEveryMs: number;
  nextCheckInAt: number;
  confirmUntil: number | null;
  missedCheckins: number;
  status: SessionStatus;
  protocolFired: boolean;
  events: ObservedEvent[];
  breadcrumbs: Breadcrumb[];
  battery: number;
  online: boolean;
  notes: string[];
  pathProgress: number;
  arrived: boolean;
  departed: boolean;
  deviated: boolean;
  covert: boolean;
  escrow: EscrowRule;
};

export type Capsule = {
  id: string;
  sessionId: string;
  createdAt: number;
  sealedAt: number;
  title: string;
  kind: SessionKind;
  destination: string;
  events: ObservedEvent[];
  breadcrumbs: Breadcrumb[];
  eventHashes: { eventId: string; hash: string }[];
  integrityHash: string;
  chronology?: string;
  escrow: EscrowRule;
  original: true;
};

export type TriggerConfig = {
  voicePhrase: string;
  pin: string;
  volumeGesture: boolean;
  watchTap: boolean;
  missedResponseMs: number;
};

export type ProtocolStep = {
  id: string;
  title: string;
  detail: string;
};

export type CircleNotice = {
  id: string;
  at: number;
  contactId: string;
  contactName: string;
  message: string;
  eventKind: EventKind;
};

export type GuardianState = {
  onboarded: boolean;
  displayName: string;
  contacts: Contact[];
  sessions: Session[];
  activeSessionId: string | null;
  capsules: Capsule[];
  triggers: TriggerConfig;
  protocol: ProtocolStep[];
  notices: CircleNotice[];
  offlineSince: number | null;
};
