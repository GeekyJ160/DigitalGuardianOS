import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-CQD0vG31.js
var reconstructChronology_createServerFn_handler = createServerRpc({
	id: "0f4e9ae5e3899f5471cecbf31cc7abdf04fe9ef577671b723ed3d4ee091a638e",
	name: "reconstructChronology",
	filename: "src/lib/guardian/ai.ts"
}, (opts) => reconstructChronology.__executeServer(opts));
var reconstructChronology = createServerFn({ method: "POST" }).validator((input) => input).handler(reconstructChronology_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const lines = data.events.map((e) => `${e.at} | ${e.kind} | ${e.label}${e.detail ? ` — ${e.detail}` : ""}`).join("\n");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 700,
			temperature: .2,
			messages: [{
				role: "system",
				content: "You are GuardianAI, an evidence chronology writer. You record facts. You never infer crime, intent, guilt, danger, abduction, assault, or motive. You never accuse. Use only the language of observed events. Prefer the exact labels provided. Output a plain chronology, one event per line, formatted: TIME — observation. No preamble, no conclusion, no advice."
			}, {
				role: "user",
				content: `Capsule: ${data.title}\nDestination: ${data.destination || "unspecified"}\n\nObserved records:\n${lines}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Empty chronology"
	};
	return {
		ok: true,
		text
	};
});
var assessSession_createServerFn_handler = createServerRpc({
	id: "4e72452e5bb8953af03c8d5382848b2b56c27b9ff6cfe69f46bbb835370c828c",
	name: "assessSession",
	filename: "src/lib/guardian/ai.ts"
}, (opts) => assessSession.__executeServer(opts));
var assessSession = createServerFn({ method: "POST" }).validator((input) => input).handler(assessSession_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 280,
			temperature: .2,
			messages: [{
				role: "system",
				content: "You are GuardianAI. Compare measurable session facts against the user's expected pattern. Do not infer intent, guilt, or danger. Do not tell the user they are unsafe. Speak only in observed differences (time, distance, connectivity, unanswered checks). End with a single question: Unusual session activity detected. Are you okay? Keep it under 90 words."
			}, {
				role: "user",
				content: `Session: ${data.title}\nExpected end: ${data.expectedEnd}\nFacts:\n- ${data.facts.join("\n- ")}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Empty assessment"
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { assessSession_createServerFn_handler, reconstructChronology_createServerFn_handler };
