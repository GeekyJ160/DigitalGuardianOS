import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as useGuardianStore, f as formatDateTime, h as shortHash, m as kindTitle, o as Card, s as Badge, u as CapsuleObject } from "./router-Bl4lStQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/capsules-BYrwb3jz.js
var import_jsx_runtime = require_jsx_runtime();
function Vault() {
	const capsules = useGuardianStore((s) => s.capsules);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-subtle uppercase",
						children: "Vault"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: "Guardian Capsules"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-sm text-muted",
						children: "Each protected session writes an encrypted capsule of original files — hashes, timestamps, and observed events. Nothing is inferred."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/verify",
				className: "text-sm text-muted hover:text-fg",
				children: "Guardian Verify"
			})]
		}), capsules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-6 text-sm text-muted",
			children: "No capsules yet. Arm a session to write the first one."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 md:grid-cols-2",
			children: capsules.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/capsules/$id",
				params: { id: c.id },
				className: "flex gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleObject, {
					serial: c.integrityHash,
					sealed: true,
					live: c.escrow.released
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 py-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "truncate text-sm font-medium",
								children: c.title
							}), c.escrow.released ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "live",
								children: "Escrow released"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "ok",
								children: "Sealed"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: kindTitle(c.kind)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-subtle",
							children: formatDateTime(c.sealedAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-mono text-[10px] tracking-wide text-subtle",
							children: shortHash(c.integrityHash, 6)
						})
					]
				})]
			}) }, c.id))
		})]
	});
}
//#endregion
export { Vault as component };
