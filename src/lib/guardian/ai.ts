import { createServerFn } from "@tanstack/react-start";
import {
  assessFacts,
  buildChronology,
  replyToGuardian,
  type GuardianChatContext,
} from "./local-ai";

export type ChronologyInput = {
  title: string;
  destination: string;
  events: { at: string; kind: string; label: string; detail?: string }[];
};

async function completeWithXai(
  system: string,
  user: string,
  maxTokens: number,
): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
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

export const reconstructChronology = createServerFn({ method: "POST" })
  .validator((input: ChronologyInput) => input)
  .handler(async ({ data }) => {
    const local = buildChronology(data.events);
    const lines = data.events
      .map((e) => `${e.at} | ${e.kind} | ${e.label}${e.detail ? ` — ${e.detail}` : ""}`)
      .join("\n");
    const text = await completeWithXai(
      "You are GuardianAI, an evidence chronology writer. You record facts. You never infer crime, intent, guilt, danger, abduction, assault, or motive. You never accuse. Use only the language of observed events. Prefer the exact labels provided. Output a plain chronology, one event per line, formatted: TIME — observation. No preamble, no conclusion, no advice.",
      `Capsule: ${data.title}\nDestination: ${data.destination || "unspecified"}\n\nObserved records:\n${lines}`,
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
    const local = assessFacts(data);
    const text = await completeWithXai(
      "You are GuardianAI. Compare measurable session facts against the user's expected pattern. Do not infer intent, guilt, or danger. Do not tell the user they are unsafe. Speak only in observed differences (time, distance, connectivity, unanswered checks). End with a single question: Unusual session activity detected. Are you okay? Keep it under 90 words.",
      `Session: ${data.title}\nExpected end: ${data.expectedEnd}\nFacts:\n- ${data.facts.join("\n- ")}`,
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
    const ctx: GuardianChatContext = {
      title: data.title,
      destination: data.destination,
      battery: data.battery,
      active: data.active,
    };
    const local = replyToGuardian(data.text, ctx);
    const text = await completeWithXai(
      "You are GuardianAI. Help the user prepare a session, explain verified device signals, and organize Circle information. Never infer crime, intent, guilt, danger, or motive. Never claim you dispatch emergency services. If the user needs immediate help, tell them to contact their Circle or local emergency services. Keep replies under 80 words.",
      `User: ${data.text}\nContext: ${JSON.stringify(ctx)}`,
      220,
    );
    return { ok: true as const, text: text ?? local, source: text ? "xai" : "local" };
  });
