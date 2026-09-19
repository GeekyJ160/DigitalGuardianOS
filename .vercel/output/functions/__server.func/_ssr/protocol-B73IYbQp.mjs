import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as useGuardianStore, c as Input, l as Button, o as Card, r as Label } from "./router-Bl4lStQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/protocol-B73IYbQp.js
var import_jsx_runtime = require_jsx_runtime();
function Protocol() {
	const protocol = useGuardianStore((s) => s.protocol);
	const triggers = useGuardianStore((s) => s.triggers);
	const setTriggers = useGuardianStore((s) => s.setTriggers);
	const contacts = useGuardianStore((s) => s.contacts);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in mx-auto max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-subtle uppercase",
						children: "Rules"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: "Protocol"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Guardian executes only what you authorize. It will not invent a next step, and it will not accuse."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-3",
				children: protocol.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex gap-4 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular text-xs text-subtle",
						children: i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: step.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: step.detail
					})] })]
				}) }, step.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Missed-response window"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "After a scheduled check-in is due, Guardian waits this long before treating it as missed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "miss",
							children: "Seconds"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "miss",
							type: "number",
							min: 10,
							max: 120,
							value: Math.round(triggers.missedResponseMs / 1e3),
							onChange: (e) => setTriggers({ missedResponseMs: Math.max(10, Number(e.target.value) || 30) * 1e3 })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Dead-man evidence escrow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Sensitive records stay encrypted. Nobody in the Circle gets automatic access. You define the release: two missed check-ins and the phone offline. In this preview the offline window is compressed to 20 seconds so you can see it fire."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [
							"Default release: ",
							contacts[0]?.name ?? "first Circle member",
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/triggers",
					children: "Configure covert triggers"
				})
			})
		]
	});
}
//#endregion
export { Protocol as component };
