import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as useGuardianStore, d as cn } from "./router-Bl4lStQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/decoy-C_a-reF6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEYS = [
	[
		"AC",
		"±",
		"%",
		"÷"
	],
	[
		"7",
		"8",
		"9",
		"×"
	],
	[
		"4",
		"5",
		"6",
		"−"
	],
	[
		"1",
		"2",
		"3",
		"+"
	],
	[
		"0",
		".",
		"="
	]
];
function DecoyCalculator() {
	const pin = useGuardianStore((s) => s.triggers.pin);
	const triggerCovert = useGuardianStore((s) => s.triggerCovert);
	const active = useGuardianStore((s) => s.activeSessionId);
	const covert = useGuardianStore((s) => {
		const id = s.activeSessionId;
		if (!id) return false;
		return s.sessions.find((x) => x.id === id)?.covert ?? false;
	});
	const [display, setDisplay] = (0, import_react.useState)("0");
	const [armedHere, setArmedHere] = (0, import_react.useState)(false);
	const tap = (key) => {
		if (key === "AC") {
			setDisplay("0");
			return;
		}
		if (key === "=") {
			if (display.replace(/\D/g, "") === pin) {
				triggerCovert("pin");
				setArmedHere(true);
			}
			return;
		}
		if ([
			"±",
			"%",
			"÷",
			"×",
			"−",
			"+"
		].includes(key)) return;
		setDisplay((d) => {
			const next = d === "0" && key !== "." ? key : d + key;
			if (next.replace(/\D/g, "") === pin && pin.length > 0) {
				triggerCovert("pin");
				setArmedHere(true);
			}
			return next.slice(0, 12);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "decoy-shell flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-5 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "decoy-muted text-xs tracking-wide",
					children: "Calculator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("size-1.5 rounded-full", armedHere || covert ? "decoy-led" : "bg-transparent"),
					"aria-hidden": true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col justify-end px-4 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 min-h-20 text-right text-6xl font-light tabular tracking-tight",
					children: display
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-3",
					children: KEYS.flatMap((row, ri) => row.map((key) => {
						const op = [
							"÷",
							"×",
							"−",
							"+",
							"="
						].includes(key);
						const util = [
							"AC",
							"±",
							"%"
						].includes(key);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => tap(key),
							className: cn("h-16 rounded-full text-xl transition-transform duration-150 active:scale-[0.96]", key === "0" && "col-span-2 px-7 text-left", op ? "decoy-op" : util ? "decoy-util" : "decoy-key"),
							children: key
						}, `${ri}-${key}`);
					}))
				})]
			}),
			active && (armedHere || covert) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Guardian is recording"
			}) : null
		]
	});
}
//#endregion
export { DecoyCalculator as component };
