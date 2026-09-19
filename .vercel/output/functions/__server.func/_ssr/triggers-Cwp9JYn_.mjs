import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Mic, m as Keyboard, r as Watch, x as Calculator } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useGuardianStore, c as Input, l as Button, n as Switch, o as Card, r as Label } from "./router-Bl4lStQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/triggers-Cwp9JYn_.js
var import_jsx_runtime = require_jsx_runtime();
function Triggers() {
	const triggers = useGuardianStore((s) => s.triggers);
	const setTriggers = useGuardianStore((s) => s.setTriggers);
	const triggerCovert = useGuardianStore((s) => s.triggerCovert);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in mx-auto max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-subtle uppercase",
						children: "Covert"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: "Triggers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "The phone does not need a giant red panic button. Guardian can arm from a phrase, a decoy surface, a key sequence, or a missed response."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4 text-muted" }), "Voice phrase"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "phrase",
						children: "Authorized phrase"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "phrase",
						value: triggers.voicePhrase,
						onChange: (e) => setTriggers({ voicePhrase: e.target.value })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Typing this phrase anywhere in the preview silently arms Guardian. On a phone it would be a spoken line."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => {
							triggerCovert("phrase");
							toast("Covert session armed");
						},
						children: "Test phrase"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "size-4 text-muted" }), "Decoy calculator"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pin",
						children: "PIN"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "pin",
						value: triggers.pin,
						onChange: (e) => setTriggers({ pin: e.target.value.replace(/\D/g, "").slice(0, 8) }),
						inputMode: "numeric"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Open what looks like a calculator. Enter the PIN. Guardian arms silently and the decoy stays on screen."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/decoy",
							children: "Open decoy"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "size-4 text-muted" }), "Hardware gesture"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: triggers.volumeGesture,
						onCheckedChange: (v) => setTriggers({ volumeGesture: v })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Volume up, down, up, then hold. In this preview: ↑ ↓ ↑ and hold ↑."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Watch, { className: "size-4 text-muted" }), "Wearable tap pattern"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: triggers.watchTap,
							onCheckedChange: (v) => setTriggers({ watchTap: v })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Three taps on a paired watch would arm the same protocol. Preview uses the test control."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						disabled: !triggers.watchTap,
						onClick: () => {
							triggerCovert("watch");
							toast("Covert session armed");
						},
						children: "Test watch pattern"
					})
				]
			})
		]
	});
}
//#endregion
export { Triggers as component };
