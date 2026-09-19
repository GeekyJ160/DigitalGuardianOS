import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { b as ChartLine, o as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useGuardianStore, d as cn, f as formatDateTime, i as createSsrRpc, l as Button, o as Card } from "./router-Bl4lStQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dexter-DIpfbWCX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md bg-elevated px-3 py-2 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:opacity-50", className),
		...props
	});
}
var runDexterResearch = createServerFn({ method: "POST" }).validator((input) => ({ query: input.query.trim().slice(0, 500) })).handler(createSsrRpc("82a4e8dedd634f84e8c5f9b1374e6db7c027d05a2af6d198706866a7ebcb4b89"));
var STARTERS = [
	"AAPL DCF snapshot vs current price",
	"NVDA last two quarters: revenue, FCF, margins",
	"Is TSLA cash flow covering capex this year?"
];
var WORKFLOW = [
	"Plan 3–6 research steps",
	"Pull live price, filings, news",
	"Validate figures against sources",
	"Write the memo"
];
function DexterDesk() {
	const memos = useGuardianStore((s) => s.dexterMemos ?? []);
	const saveDexterMemo = useGuardianStore((s) => s.saveDexterMemo);
	const removeDexterMemo = useGuardianStore((s) => s.removeDexterMemo);
	const [query, setQuery] = (0, import_react.useState)("");
	const [working, setWorking] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)(0);
	const [activeId, setActiveId] = (0, import_react.useState)(memos[0]?.id ?? null);
	const active = memos.find((m) => m.id === activeId) ?? memos[0] ?? null;
	(0, import_react.useEffect)(() => {
		if (!working) {
			setPhase(0);
			return;
		}
		setPhase(0);
		const timers = [
			900,
			2400,
			9e3
		].map((ms, i) => window.setTimeout(() => setPhase(i + 1), ms));
		return () => timers.forEach(clearTimeout);
	}, [working]);
	const run = async (q) => {
		const next = q.trim();
		if (!next || working) return;
		setWorking(true);
		try {
			const res = await runDexterResearch({ data: { query: next } });
			if (!res.ok) {
				toast(res.error);
				return;
			}
			const id = saveDexterMemo({
				query: next,
				memo: res.memo,
				citations: res.citations
			});
			setActiveId(id);
			setQuery("");
		} catch {
			toast("Dexter could not finish this brief.");
		} finally {
			setWorking(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-subtle uppercase",
						children: "Dexter skill · active"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: "Financial research desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-sm text-muted",
						children: "Dexter plans the work, searches live sources, checks its own numbers, and writes a memo. Educational research only — not advice."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "dexter-q",
						className: "text-xs font-medium text-muted",
						children: "Research question"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "dexter-q",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "What is MSFT worth on free cash flow?",
						className: "min-h-24",
						disabled: working
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: STARTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: working,
							className: "h-11 rounded-full bg-elevated px-3 text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg disabled:opacity-50",
							onClick: () => setQuery(s),
							children: s
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void run(query),
						disabled: working || !query.trim(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "size-4" }), working ? "Dexter is researching…" : "Run Dexter"]
					})
				]
			}),
			working ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				"aria-live": "polite",
				"aria-busy": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.16em] text-live uppercase",
						children: "Live search in progress"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl tracking-tight",
						children: "Dexter is working the brief"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Plan → search → validate → memo. This usually takes under a minute."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 space-y-2",
						children: WORKFLOW.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("flex items-center gap-3 text-sm", i < phase ? "text-ok" : i === phase ? "text-fg" : "text-subtle"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 shrink-0 rounded-full", i < phase ? "bg-ok" : i === phase ? "bg-live live-dot" : "bg-border") }), step]
						}, step))
					})
				]
			}) : active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: active.query
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: formatDateTime(active.createdAt)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							"aria-label": "Remove memo",
							onClick: () => {
								removeDexterMemo(active.id);
								setActiveId(null);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-x-auto font-sans text-sm leading-relaxed whitespace-pre-wrap text-fg",
						children: active.memo
					}),
					active.citations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1 border-t border-border pt-3",
						children: active.citations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "truncate text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: c,
								target: "_blank",
								rel: "noreferrer",
								className: "text-muted hover:text-fg",
								children: c
							})
						}, c))
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No memos yet. Ask a ticker, a filing, or a valuation question."
			}),
			memos.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Prior briefs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: memos.filter((m) => m.id !== active?.id).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-h-11 w-full rounded-lg bg-surface px-4 py-3 text-left text-sm shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
						onClick: () => setActiveId(m.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: m.query
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-subtle",
							children: formatDateTime(m.createdAt)
						})]
					}) }, m.id))
				})]
			}) : null
		]
	});
}
//#endregion
export { DexterDesk as component };
