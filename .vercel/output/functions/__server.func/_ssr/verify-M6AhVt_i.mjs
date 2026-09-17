import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { y as Check } from "../_libs/lucide-react.mjs";
import { a as Card, c as Button, d as formatDateTime, g as useGuardianStore, m as shortHash } from "./router-D2huocgC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-M6AhVt_i.js
var import_jsx_runtime = require_jsx_runtime();
function Verify() {
	const capsules = useGuardianStore((s) => s.capsules);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in mx-auto max-w-2xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.2em] text-subtle uppercase",
					children: "Guardian Verify"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight",
					children: "Portable authenticated incident records"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Not a police report. Not an accusation. A fact package: location, hashes, timestamps, check-ins, Circle events, file integrity."
				})
			]
		}), capsules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-5 text-sm text-muted",
			children: "No sealed capsules yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: capsules.map((c) => {
				const score = [
					c.breadcrumbs.length > 0,
					c.eventHashes.length > 0,
					true,
					c.events.some((e) => e.kind.startsWith("checkin")),
					c.events.some((e) => e.kind === "circle_notified"),
					Boolean(c.integrityHash)
				].filter(Boolean).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: c.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								formatDateTime(c.sealedAt),
								" · ",
								shortHash(c.integrityHash, 6)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-xs text-ok",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }),
								score,
								"/6"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/capsules/$id",
							params: { id: c.id },
							children: "Open verified timeline"
						})
					})]
				}) }, c.id);
			})
		})]
	});
}
//#endregion
export { Verify as component };
