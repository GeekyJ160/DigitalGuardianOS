export type ChronologyEvent = {
  at: number | string;
  label: string;
  detail?: string;
};

export function formatObservedTime(at: number | string): string {
  if (typeof at === "string" && at.trim()) return at.trim();
  const ts = typeof at === "number" ? at : Date.parse(String(at));
  if (!Number.isFinite(ts)) return "—";
  return new Date(ts).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function buildChronology(events: ChronologyEvent[]): string {
  if (events.length === 0) return "No observed events were recorded.";
  return events
    .map((event) => `${formatObservedTime(event.at)} — ${event.label}`)
    .join("\n");
}

export function assessFacts(input: {
  title: string;
  expectedEnd: string;
  facts: string[];
}): string {
  const diffs: string[] = [];
  for (const fact of input.facts) {
    const lower = fact.toLowerCase();
    if (lower.includes("route deviation: yes") || lower.includes("deviation: yes")) {
      diffs.push("Path no longer matches the expected destination.");
    }
    const missed = lower.match(/missed check-ins:\s*(\d+)/);
    if (missed && Number(missed[1]) > 0) {
      diffs.push(`${missed[1]} scheduled check-in(s) unanswered.`);
    }
    if (lower.includes("online: no")) {
      diffs.push("Device reported offline.");
    }
    const battery = lower.match(/battery:\s*(\d+)/);
    if (battery && Number(battery[1]) <= 15) {
      diffs.push(`Battery is in the low band (${battery[1]}%).`);
    }
    if (lower.includes("arrived: no") && lower.includes("status: alert")) {
      diffs.push("Session is in alert and arrival was not recorded.");
    }
  }
  const head = `Observed differences for ${input.title} (expected end ${input.expectedEnd}).`;
  const body =
    diffs.length > 0
      ? diffs.join(" ")
      : "No measured differences from the listed facts.";
  return `${head} ${body} Unusual session activity detected. Are you okay?`;
}

export type GuardianChatContext = {
  title?: string;
  destination?: string;
  battery?: number;
  active?: boolean;
};

export function replyToGuardian(
  text: string,
  ctx: GuardianChatContext = {},
): string {
  const lower = text.toLowerCase();
  if (/facebook|hinge|tinder|date|meeting someone/.test(lower)) {
    return "Date session: check-ins, arrival context, a Primary Guardian, and a sealed capsule if the window ends. I will not decide if anyone is safe. Start a Date Session when you are ready.";
  }
  if (/dying|battery/.test(lower)) {
    const battery =
      ctx.battery != null
        ? `Battery is ${Math.round(ctx.battery)}% in this preview. `
        : "";
    return `${battery}I can suggest reducing GPS frequency and telling your Primary Guardian. These are suggestions, not an emergency conclusion.`;
  }
  if (/\blost\b|where am i/.test(lower)) {
    const dest = ctx.destination
      ? ` Planned destination: ${ctx.destination}.`
      : "";
    return `Open Timeline for the last verified signal.${dest} This preview cannot locate you. If you need help now, contact your Circle or local emergency services.`;
  }
  if (/unsafe|scared|in danger|help me|not comfortable/.test(lower)) {
    return "You can stop the session, contact a Guardian, move to a public staffed place, or call local emergency services. I can organize session facts. I cannot decide what you are experiencing. This preview does not dispatch 911.";
  }
  if (/\b(i'?m okay|i am okay|i'?m fine|im fine|all good)\b/.test(lower)) {
    return "Recorded as a user-confirmed status in this prototype. Use Check in on a live session to put it on the timeline.";
  }
  if (/protocol|escrow/.test(lower)) {
    return "Protocol runs only the steps you authorized: confirm, keep recording facts, notify named Circle members, then arm escrow if the release rule matches. This preview stores capsules on this device.";
  }
  const session = ctx.active && ctx.title ? ` Active session: ${ctx.title}.` : "";
  return `I can organize facts, explain the active session, or help you choose a next step you already named.${session} I will not infer danger or intent.`;
}
