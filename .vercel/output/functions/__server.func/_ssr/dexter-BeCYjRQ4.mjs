import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dexter-BeCYjRQ4.js
function collectUrl(target, value) {
	if (value) target.push(value);
}
function parseDexterOutput(body) {
	const urls = [];
	let memo = "";
	for (const item of body.output ?? []) {
		if (item.type === "message") for (const block of item.content ?? []) {
			if ((block.type === "output_text" || block.type === "text") && block.text) memo += block.text;
			for (const a of block.annotations ?? []) collectUrl(urls, a.url);
		}
		if (item.type === "web_search_call") for (const s of item.action?.sources ?? []) collectUrl(urls, s.url);
	}
	if (!memo && body.output_text) memo = body.output_text;
	for (const c of body.citations ?? []) collectUrl(urls, typeof c === "string" ? c : c.url);
	return {
		memo: memo.trim(),
		citations: [...new Set(urls)].slice(0, 12)
	};
}
var runDexterResearch_createServerFn_handler = createServerRpc({
	id: "82a4e8dedd634f84e8c5f9b1374e6db7c027d05a2af6d198706866a7ebcb4b89",
	name: "runDexterResearch",
	filename: "src/lib/guardian/dexter.ts"
}, (opts) => runDexterResearch.__executeServer(opts));
var runDexterResearch = createServerFn({ method: "POST" }).validator((input) => ({ query: input.query.trim().slice(0, 500) })).handler(runDexterResearch_createServerFn_handler, async ({ data }) => {
	if (!data.query) return {
		ok: false,
		error: "Ask Dexter a research question first."
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Dexter is not available in this environment."
	};
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 9e4);
	try {
		const res = await fetch("https://api.x.ai/v1/responses", {
			method: "POST",
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_output_tokens: 1400,
				temperature: .2,
				store: false,
				tool_choice: "required",
				tools: [{ type: "web_search" }],
				instructions: `You are Dexter, the autonomous financial research agent inside GuardianOS.

Workflow for every question:
1. Plan 3–6 concrete research steps.
2. Use live search for prices, filings, statements, and recent news. Never invent a number.
3. If the question is valuation / fair value / DCF: gather FCF history, growth, WACC band, project 5 years with decaying growth, Gordon terminal at ~2.5%, convert to per-share, and run a small WACC × terminal sensitivity.
4. Validate: flag if enterprise value is wildly off reported EV, or if terminal value dominates.
5. Write a memo.

Memo format, plain text:
QUESTION
PLAN
FACTS (each figure with a source)
ANALYSIS
WHAT WOULD CHANGE THIS
SOURCES
Then the exact line: Not financial advice. For learning only.

Rules:
- Educational research only. No trade recommendations, no "buy" / "sell".
- If live data is missing, say what you could not verify.
- Be concise. No preamble, no emoji.`,
				input: [{
					role: "user",
					content: data.query
				}]
			})
		});
		if (!res.ok) return {
			ok: false,
			error: `Dexter could not complete search (${res.status}).`
		};
		const { memo, citations } = parseDexterOutput(await res.json());
		if (!memo) return {
			ok: false,
			error: "Dexter returned an empty memo."
		};
		return {
			ok: true,
			memo,
			citations
		};
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") return {
			ok: false,
			error: "Dexter timed out waiting for live sources."
		};
		return {
			ok: false,
			error: "Dexter could not reach live sources."
		};
	} finally {
		clearTimeout(timer);
	}
});
//#endregion
export { runDexterResearch_createServerFn_handler };
