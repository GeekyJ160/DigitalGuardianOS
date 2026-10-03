import { createServerFn } from "@tanstack/react-start";
import {
  assessFacts,
  buildChronology,
  clipPrompt,
  MAX_PROMPT_CHARS,
  replyToGuardian,
  type GuardianChatContext,
} from "./local-ai";

export type ChronologyInput = {
  title: string;
  destination: string;
  events: { at: string; kind: string; label: string; detail?: string }[];
};

const MAX_XAI_CALLS = 8;
const XAI_WINDOW_MS = 10 * 60 * 1000;
const MAX_CHRONOLOGY_EVENTS = 40;
const xaiHits: number[] = [];

function allowXaiCall(): boolean {
  const now = Date.now();
  while (xaiHits.length && now - xaiHits[0] > XAI_WINDOW_MS) xaiHits.shift();
  if (xaiHits.length >= MAX_XAI_CALLS) return false;
  xaiHits.push(now);
  return true;
}

async function completeWithXai(
  system: string,
  user: string,
  maxTokens: number,
): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  if (!allowXaiCall()) return null;
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: maxTokens,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return body.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export const xaiStatus = createServerFn({ method: "POST" }).handler(async () => ({
  available: Boolean(process.env.XAI_API_KEY),
}));

export const reconstructChronology = createServerFn({ method: "POST" })
  .validator((input: ChronologyInput) => input)
  .handler(async ({ data }) => {
    const events = data.events.slice(0, MAX_CHRONOLOGY_EVENTS).map((event) => ({
      ...event,
      label: clipPrompt(event.label, 120),
      detail: event.detail ? clipPrompt(event.detail, 200) : undefined,
    }));
    const local = buildChronology(events);
    const lines = events
      .map((e) => `${e.at} | ${e.kind} | ${e.label}${e.detail ? ` — ${e.detail}` : ""}`)
      .join("\n");
    const text = await completeWithXai(
      "You are GuardianAI, an evidence chronology writer. You record facts. You never infer crime, intent, guilt, danger, abduction, assault, or motive. You never accuse. Use only the language of observed events. Prefer the exact labels provided. Output a plain chronology, one event per line, formatted: TIME — observation. No preamble, no conclusion, no advice.",
      `Capsule: ${clipPrompt(data.title, 120)}\nDestination: ${clipPrompt(data.destination || "unspecified", 120)}\n\nObserved records:\n${lines}`,
      700,
    );
    return { ok: true as const, text: text ?? local, source: text ? "xai" : "local" };
  });

export const assessSession = createServerFn({ method: "POST" })
  .validator(
    (input: {
      title: string;
      expectedEnd: string;
      facts: string[];
    }) => input,
  )
  .handler(async ({ data }) => {
    const facts = data.facts.slice(0, 12).map((fact) => clipPrompt(fact, 160));
    const payload = {
      title: clipPrompt(data.title, 120),
      expectedEnd: clipPrompt(data.expectedEnd, 80),
      facts,
    };
    const local = assessFacts(payload);
    const text = await completeWithXai(
      "You are GuardianAI. Compare measurable session facts against the user's expected pattern. Do not infer intent, guilt, or danger. Do not tell the user they are unsafe. Speak only in observed differences (time, distance, connectivity, unanswered checks). End with a single question: Unusual session activity detected. Are you okay? Keep it under 90 words.",
      `Session: ${payload.title}\nExpected end: ${payload.expectedEnd}\nFacts:\n- ${facts.join("\n- ")}`,
      280,
    );
    return { ok: true as const, text: text ?? local, source: text ? "xai" : "local" };
  });

export const askGuardian = createServerFn({ method: "POST" })
  .validator(
    (input: {
      text: string;
      title?: string;
      destination?: string;
      battery?: number;
      active?: boolean;
    }) => input,
  )
  .handler(async ({ data }) => {
    const prompt = clipPrompt(data.text, MAX_PROMPT_CHARS);
    const ctx: GuardianChatContext = {
      title: data.title ? clipPrompt(data.title, 120) : undefined,
      destination: data.destination
        ? clipPrompt(data.destination, 120)
        : undefined,
      battery: data.battery,
      active: data.active,
    };
    const local = replyToGuardian(prompt, ctx);
    if (!prompt) {
      return { ok: true as const, text: local, source: "local" as const };
    }
    const text = await completeWithXai(
      "You are GuardianAI. Help the user prepare a session, explain verified device signals, and organize Circle information. Never infer crime, intent, guilt, danger, or motive. Never claim you dispatch emergency services. If the user needs immediate help, tell them to contact their Circle or local emergency services. Keep replies under 80 words.",
      `User: ${prompt}\nContext: ${JSON.stringify(ctx)}`,
      220,
    );
    return { ok: true as const, text: text ?? local, source: text ? "xai" : "local" };
  });
