import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as ScrollText, g as Fingerprint, i as Users, p as Lock, v as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as Card, c as Button, d as formatDateTime, f as formatDuration, g as useGuardianStore, h as useActiveSession, i as Timeline, o as Badge } from "./router-D2huocgC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CIbDsX2W.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const session = useActiveSession();
	const capsules = useGuardianStore((s) => s.capsules);
	const contacts = useGuardianStore((s) => s.contacts);
	const notices = useGuardianStore((s) => s.notices);
	const name = useGuardianStore((s) => s.displayName);
	const latest = capsules[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-subtle uppercase",
						children: session ? "Protected session" : "Command"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight md:text-4xl",
						children: session ? session.title : name ? `${name}, stay protected.` : "Stay protected. Preserve the truth."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-sm text-muted",
						children: "GuardianOS is the black box for the hours that look ordinary until they are not. It records facts. It does not decide what they mean."
					})
				]
			}),
			session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative mt-1 flex size-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-full bg-live live-ring" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative size-3 rounded-full bg-live live-dot" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "live",
							children: "Recording"
						}), session.covert ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Covert" }) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Next check-in in",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular text-fg",
								children: formatDuration(Math.max(0, session.nextCheckInAt - Date.now()))
							})
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/session/$id",
						params: { id: session.id },
						children: "Open live session"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.16em] text-subtle uppercase",
						children: "Arm a window"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl tracking-tight",
						children: "Start a Guardian Session"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-lg text-sm text-muted",
						children: "Date, ride, showing, nightlife, or custom. From that moment Guardian tracks the context you authorized — then writes a capsule if anything diverges from the plan."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/session/new",
							children: "Start session"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
						to: "/circle",
						icon: Users,
						label: "Circle",
						meta: `${contacts.length} people`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
						to: "/capsules",
						icon: Lock,
						label: "Vault",
						meta: `${capsules.length} capsules`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
						to: "/triggers",
						icon: Fingerprint,
						label: "Triggers",
						meta: "PIN · phrase · gesture"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
						to: "/protocol",
						icon: ScrollText,
						label: "Protocol",
						meta: "Escrow rules"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Latest observed"
						}), latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/capsules/$id",
							params: { id: latest.id },
							className: "text-xs text-muted hover:text-fg",
							children: "Open capsule"
						}) : null]
					}), latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {
						events: latest.events.slice(-5),
						compact: true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No capsules yet."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 text-sm font-medium",
						children: "Circle notices"
					}), notices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No protocol messages have been sent. Notices appear only after an authorized event."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: notices.slice(0, 5).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-fg",
									children: n.contactName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: n.message
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-[10px] text-subtle",
									children: formatDateTime(n.at)
								})
							]
						}, n.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "This preview simulates observation and evidence assembly. It does not dispatch emergency services."
			})
		]
	});
}
function QuickLink({ to, icon: Icon, label, meta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "group flex min-h-24 flex-col justify-between rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-end justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-subtle",
				children: meta
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-subtle transition-transform group-hover:translate-x-0.5" })]
		})]
	});
}
//#endregion
export { Home as component };
