import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Plus, o as Trash2 } from "../_libs/lucide-react.mjs";
import { c as Input, d as useGuardianStore, g as formatDateTime, l as Button, o as Card, r as Label } from "./router-D5j7eVvZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/circle-B66w1UNW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FLAGS = [
	{
		id: "missed_checkin",
		label: "Missed check-in"
	},
	{
		id: "deviation",
		label: "Route deviation"
	},
	{
		id: "offline",
		label: "Offline"
	},
	{
		id: "sos",
		label: "Covert / SOS"
	},
	{
		id: "escrow",
		label: "Escrow release"
	}
];
function Circle() {
	const contacts = useGuardianStore((s) => s.contacts);
	const notices = useGuardianStore((s) => s.notices);
	const addContact = useGuardianStore((s) => s.addContact);
	const removeContact = useGuardianStore((s) => s.removeContact);
	const updateContact = useGuardianStore((s) => s.updateContact);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [relation, setRelation] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.2em] text-subtle uppercase",
							children: "People"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl tracking-tight",
							children: "Guardian Circle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xl text-sm text-muted",
							children: "Only the events you authorize are sent, and only to the people you name. Guardian never broadcasts a session by default."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add person"]
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "cname",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "cname",
								value: name,
								onChange: (e) => setName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "crel",
								children: "Relation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "crel",
								value: relation,
								onChange: (e) => setRelation(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "cph",
								children: "Phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "cph",
								value: phone,
								onChange: (e) => setPhone(e.target.value)
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !name.trim(),
					onClick: () => {
						addContact({
							name: name.trim(),
							relation: relation.trim() || "Circle",
							phone: phone.trim() || "—",
							notifyOn: ["missed_checkin", "sos"]
						});
						setName("");
						setRelation("");
						setPhone("");
						setOpen(false);
					},
					children: "Save to Circle"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: contacts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								c.relation,
								" · ",
								c.phone
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							onClick: () => removeContact(c.id),
							"aria-label": `Remove ${c.name}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: FLAGS.map((f) => {
							const on = c.notifyOn.includes(f.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									const next = on ? c.notifyOn.filter((x) => x !== f.id) : [...c.notifyOn, f.id];
									updateContact(c.id, { notifyOn: next });
								},
								className: on ? "h-9 rounded-full bg-accent px-3 text-xs text-accent-fg" : "h-9 rounded-full bg-elevated px-3 text-xs text-muted shadow-[var(--shadow-border)]",
								children: f.label
							}, f.id);
						})
					})]
				}) }, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-medium",
					children: "Notice log"
				}), notices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No notices have been sent."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: notices.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: n.contactName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" — ", n.message]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-subtle",
								children: formatDateTime(n.at)
							})
						]
					}, n.id))
				})]
			})
		]
	});
}
//#endregion
export { Circle as component };
