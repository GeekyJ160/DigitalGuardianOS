import { createServerFn } from "@tanstack/react-start";

export type ChronologyInput = {
  title: string;
  destination: string;
  events: { at: string; kind: string; label: string; detail?: string }[];
};

export const reconstructChronology = createServerFn({ method: "POST" })
  .validator((input: ChronologyInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available in this environment" };
    }

    const lines = data.events
      .map((e) => `${e.at} | ${e.kind} | ${e.label}${e.detail ? ` — ${e.detail}` : ""}`)
      .join("\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 700,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are GuardianAI, an evidence chronology writer. You record facts. You never infer crime, intent, guilt, danger, abduction, assault, or motive. You never accuse. Use only the language of observed events. Prefer the exact labels provided. Output a plain chronology, one event per line, formatted: TIME — observation. No preamble, no conclusion, no advice.",
          },
          {
            role: "user",
            content: `Capsule: ${data.title}\nDestination: ${data.destination || "unspecified"}\n\nObserved records:\n${lines}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `xAI API error ${res.status}` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Empty chronology" };
    return { ok: true as const, text };
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
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available in this environment" };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 280,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are GuardianAI. Compare measurable session facts against the user's expected pattern. Do not infer intent, guilt, or danger. Do not tell the user they are unsafe. Speak only in observed differences (time, distance, connectivity, unanswered checks). End with a single question: Unusual session activity detected. Are you okay? Keep it under 90 words.",
          },
          {
            role: "user",
            content: `Session: ${data.title}\nExpected end: ${data.expectedEnd}\nFacts:\n- ${data.facts.join("\n- ")}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `xAI API error ${res.status}` };
    }
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Empty assessment" };
    return { ok: true as const, text };
  });
