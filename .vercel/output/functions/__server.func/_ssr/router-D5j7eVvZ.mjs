import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useNavigate, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Slot } from "../_libs/@radix-ui/react-popper+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { C as ChartLine, S as Check, T as Battery, _ as Fingerprint, a as TriangleAlert, c as ScrollText, g as House, i as Users, l as Radio, m as Lock, n as WifiOff, p as MapPin, s as ShieldAlert, t as Wifi, y as Download } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DcV-RHBV.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatTime(ts) {
	return new Date(ts).toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatDateTime(ts) {
	return new Date(ts).toLocaleString([], {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatDuration(ms) {
	const total = Math.max(0, Math.round(ms / 1e3));
	return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}
function shortHash(hash, n = 8) {
	if (hash.length <= n * 2) return hash;
	return `${hash.slice(0, n)}…${hash.slice(-n)}`;
}
function uid() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `g_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-D5j7eVvZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function CapsuleMark({ className, live = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("text-accent", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "10",
				y: "3",
				width: "12",
				height: "26",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13",
				y: "8",
				width: "6",
				height: "1.5",
				rx: "0.75",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13",
				y: "22.5",
				width: "6",
				height: "1.5",
				rx: "0.75",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "2.2",
				fill: live ? "var(--color-live)" : "currentColor"
			})
		]
	});
}
function CapsuleObject({ serial, sealed, live }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto flex h-44 w-24 items-center justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-2 left-1/2 w-16 -translate-x-1/2 rounded-[28px] bg-elevated shadow-[var(--shadow-border)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-6 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-6 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-full", live ? "bg-live live-dot" : sealed ? "bg-ok" : "bg-accent") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 max-w-14 truncate font-mono text-[9px] tracking-widest text-subtle uppercase",
					children: serial.slice(0, 8)
				})]
			})
		]
	});
}
function fnv1a(input) {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
/** Deterministic 64-char hex fingerprint for evidence rows. Not a substitute for SHA-256 at rest. */
function fingerprint(input) {
	let acc = input;
	const parts = [];
	for (let i = 0; i < 8; i++) {
		const h = fnv1a(`${acc}|${i}|guardian-capsule`);
		parts.push(h.toString(16).padStart(8, "0"));
		acc = parts[i] + acc;
	}
	return parts.join("");
}
function eventCanonical(event) {
	return [
		event.id,
		event.at.toString(10),
		event.kind,
		event.label,
		event.detail ?? ""
	].join("|");
}
var SESSION_KINDS = [
	{
		id: "date",
		title: "Guardian Date",
		blurb: "Meeting someone. Expected duration and a check-in window.",
		defaultDestination: "West 7th, Fort Worth"
	},
	{
		id: "ride",
		title: "Guardian Ride",
		blurb: "Rideshare or transit. Preserve route, vehicle, and drop-off.",
		defaultDestination: "DFW Terminal D"
	},
	{
		id: "showing",
		title: "Guardian Showing",
		blurb: "Property visit. Agent, address, and expected walkthrough.",
		defaultDestination: "1841 Fairmount Ave"
	},
	{
		id: "travel",
		title: "Guardian Stay",
		blurb: "Hotel or trip. Check-in at arrival and overnight.",
		defaultDestination: "The Sinclair, Fort Worth"
	},
	{
		id: "nightlife",
		title: "Nightlife",
		blurb: "Out for the evening. Route home and missed-response protocol.",
		defaultDestination: "Near Southside"
	},
	{
		id: "work",
		title: "Worker Guardian",
		blurb: "Shift, delivery, or field visit. Expected end of window.",
		defaultDestination: "South Main warehouse"
	},
	{
		id: "custom",
		title: "Custom session",
		blurb: "Name the window. Guardian records only what you authorize.",
		defaultDestination: ""
	}
];
function kindTitle(kind) {
	return SESSION_KINDS.find((k) => k.id === kind)?.title ?? "Guardian Session";
}
var MAYA = "contact-maya";
var SEED_CONTACTS = [
	{
		id: MAYA,
		name: "Maya Chen",
		relation: "Sister",
		phone: "+1 ··· ··· 4412",
		notifyOn: [
			"missed_checkin",
			"offline",
			"sos",
			"escrow"
		]
	},
	{
		id: "contact-jordan",
		name: "Jordan Hale",
		relation: "Partner",
		phone: "+1 ··· ··· 8801",
		notifyOn: [
			"missed_checkin",
			"deviation",
			"sos"
		]
	},
	{
		id: "contact-alex",
		name: "Alex Rivera",
		relation: "Roommate",
		phone: "+1 ··· ··· 2290",
		notifyOn: ["sos", "escrow"]
	}
];
var SEED_TRIGGERS = {
	voicePhrase: "Tell Maya I'm running late.",
	pin: "9117",
	volumeGesture: true,
	watchTap: true,
	missedResponseMs: 3e4
};
var SEED_PROTOCOL = [
	{
		id: "confirm",
		title: "Confirm you are okay",
		detail: "A silent prompt waits for the missed-response window you set."
	},
	{
		id: "record",
		title: "Keep recording facts",
		detail: "Location, connectivity, battery, and check-in history continue."
	},
	{
		id: "circle",
		title: "Notify the Guardian Circle",
		detail: "Only contacts you authorized for that event type are messaged."
	},
	{
		id: "escrow",
		title: "Arm evidence escrow",
		detail: "If release rules match, the capsule is shared with the named person."
	}
];
function event(at, kind, label, detail) {
	return {
		id: uid(),
		at,
		kind,
		label,
		detail
	};
}
function seal(events, extra) {
	const eventHashes = events.map((e) => ({
		eventId: e.id,
		hash: fingerprint(eventCanonical(e))
	}));
	return {
		eventHashes,
		integrityHash: fingerprint(extra + eventHashes.map((h) => h.hash).join(""))
	};
}
function seedCapsules(now = Date.now()) {
	const start = now - 648e5;
	const nightlifeStart = now - 2592e5;
	const dateEvents = [
		event(start, "session_started", "Session started", "Guardian Date — West 7th, Fort Worth. Expected check-in 11:30 PM."),
		event(start + 9e5, "arrived", "Arrived at destination", "Device location matched the session destination."),
		event(start + 132e4, "note", "User-submitted note preserved", "At the bar, table near the window."),
		event(start + 168e4, "checkin_ok", "Check-in received", "User confirmed on time."),
		event(start + 336e4, "checkin_missed", "Scheduled check-in missed", "No response within the authorized window."),
		event(start + 354e4, "location_update", "Device began moving north", "Heading changed after a stationary period."),
		event(start + 384e4, "route_deviation", "Route deviated from expected destination", "Path no longer aligned with the return route home."),
		event(start + 402e4, "circle_notified", "Guardian Circle notified", "Maya Chen and Jordan Hale received the missed-check-in protocol."),
		event(start + 42e5, "session_ended", "Session sealed", "Capsule written with original files. No inferences attached.")
	];
	const dateSeal = seal(dateEvents, "date-west7th");
	const nightEvents = [
		event(nightlifeStart, "session_started", "Session started", "Nightlife — Near Southside. Expected home by 12:15 AM."),
		event(nightlifeStart + 48e4, "arrived", "Arrived at destination", "Device location matched the session destination."),
		event(nightlifeStart + 24e5, "checkin_ok", "Check-in received", "User confirmed on time."),
		event(nightlifeStart + 48e5, "checkin_ok", "Check-in received", "User confirmed on time."),
		event(nightlifeStart + 66e5, "location_update", "Device moving toward home", "Path aligned with the expected return route."),
		event(nightlifeStart + 768e4, "session_ended", "Session sealed", "All authorized check-ins were received. Capsule archived.")
	];
	const nightSeal = seal(nightEvents, "nightlife-southside");
	return [{
		id: "capsule-date-west7th",
		sessionId: "session-date-west7th",
		createdAt: start,
		sealedAt: start + 42e5,
		title: "Guardian Date — West 7th",
		kind: "date",
		destination: "West 7th, Fort Worth",
		events: dateEvents,
		breadcrumbs: samplePath(start, true),
		...dateSeal,
		chronology: [
			"10:42 PM — Session started",
			"10:57 PM — Arrived at destination",
			"11:04 PM — User-submitted note preserved",
			"11:10 PM — Check-in received",
			"11:38 PM — Scheduled check-in missed",
			"11:41 PM — Device began moving north",
			"11:46 PM — Route deviated from expected destination",
			"11:49 PM — Guardian Circle notified",
			"11:52 PM — Session sealed"
		].join("\n"),
		escrow: {
			enabled: true,
			contactId: MAYA,
			missedCheckins: 2,
			offlineMs: 216e5,
			released: false
		},
		original: true
	}, {
		id: "capsule-nightlife-southside",
		sessionId: "session-nightlife-southside",
		createdAt: nightlifeStart,
		sealedAt: nightlifeStart + 768e4,
		title: "Nightlife — Near Southside",
		kind: "nightlife",
		destination: "Near Southside",
		events: nightEvents,
		breadcrumbs: samplePath(nightlifeStart, false),
		...nightSeal,
		chronology: [
			"9:14 PM — Session started",
			"9:22 PM — Arrived at destination",
			"9:54 PM — Check-in received",
			"10:34 PM — Check-in received",
			"11:04 PM — Device moving toward home",
			"11:22 PM — Session sealed"
		].join("\n"),
		escrow: {
			enabled: false,
			contactId: MAYA,
			missedCheckins: 2,
			offlineMs: 216e5,
			released: false
		},
		original: true
	}];
}
function samplePath(start, deviate) {
	const pts = [
		[.18, .78],
		[.26, .7],
		[.34, .62],
		[.46, .55],
		[.58, .48],
		[.66, .42],
		[.72, .38]
	];
	if (deviate) pts.push([.7, .28], [.68, .18], [.74, .12]);
	else pts.push([.6, .5], [.42, .62], [.22, .74]);
	return pts.map(([x, y], i) => ({
		t: start + i * 7 * 6e4,
		x,
		y
	}));
}
var HOME_POINT = {
	x: .18,
	y: .78
};
var DEST_POINT = {
	x: .72,
	y: .38
};
var EXPECTED_PATH = [
	[.18, .78],
	[.26, .7],
	[.34, .62],
	[.46, .55],
	[.58, .48],
	[.66, .42],
	[.72, .38]
];
var DEVIATION_PATH = [
	[.72, .38],
	[.7, .28],
	[.68, .18],
	[.74, .12]
];
var RETURN_PATH = [
	[.72, .38],
	[.6, .5],
	[.42, .62],
	[.22, .74],
	[.18, .78]
];
function observed(kind, label, detail, meta) {
	return {
		id: uid(),
		at: Date.now(),
		kind,
		label,
		detail,
		meta
	};
}
function lerpPath(path, t) {
	if (path.length === 0) return HOME_POINT;
	if (path.length === 1) return {
		x: path[0][0],
		y: path[0][1]
	};
	const scaled = Math.min(1, Math.max(0, t)) * (path.length - 1);
	const i = Math.min(path.length - 2, Math.floor(scaled));
	const f = scaled - i;
	const a = path[i];
	const b = path[i + 1];
	return {
		x: a[0] + (b[0] - a[0]) * f,
		y: a[1] + (b[1] - a[1]) * f
	};
}
function notifyCircle(contacts, kind, message) {
	const flag = {
		checkin_missed: "missed_checkin",
		route_deviation: "deviation",
		connectivity_lost: "offline",
		sos: "sos",
		escrow_released: "escrow",
		covert_trigger: "sos"
	}[kind];
	if (!flag) return [];
	return contacts.filter((c) => c.notifyOn.includes(flag)).map((c) => ({
		id: uid(),
		at: Date.now(),
		contactId: c.id,
		contactName: c.name,
		message,
		eventKind: kind
	}));
}
function sealCapsule(session, escrow) {
	const events = session.events;
	const eventHashes = events.map((e) => ({
		eventId: e.id,
		hash: fingerprint(eventCanonical(e))
	}));
	const integrityHash = fingerprint(session.id + eventHashes.map((h) => h.hash).join(""));
	return {
		id: `capsule-${session.id}`,
		sessionId: session.id,
		createdAt: session.startedAt,
		sealedAt: Date.now(),
		title: session.title,
		kind: session.kind,
		destination: session.destination,
		events,
		breadcrumbs: session.breadcrumbs,
		eventHashes,
		integrityHash,
		escrow,
		original: true
	};
}
var initial = () => ({
	onboarded: false,
	displayName: "",
	contacts: SEED_CONTACTS,
	sessions: [],
	activeSessionId: null,
	capsules: seedCapsules(),
	triggers: SEED_TRIGGERS,
	protocol: SEED_PROTOCOL,
	notices: [],
	offlineSince: null,
	dexterMemos: []
});
var useGuardianStore = create()(persist((set, get) => ({
	...initial(),
	completeOnboarding: (name) => set({
		onboarded: true,
		displayName: name?.trim() || get().displayName
	}),
	setDisplayName: (name) => set({ displayName: name }),
	addContact: (c) => set({ contacts: [...get().contacts, {
		...c,
		id: uid()
	}] }),
	removeContact: (id) => set({ contacts: get().contacts.filter((c) => c.id !== id) }),
	updateContact: (id, patch) => set({ contacts: get().contacts.map((c) => c.id === id ? {
		...c,
		...patch
	} : c) }),
	setTriggers: (patch) => set({ triggers: {
		...get().triggers,
		...patch
	} }),
	setProtocol: (steps) => set({ protocol: steps }),
	startSession: (input) => {
		const existing = get().activeSessionId;
		if (existing) {
			const cur = get().sessions.find((s) => s.id === existing);
			if (cur && cur.status !== "ended") get().endSession(existing);
		}
		const id = uid();
		const now = Date.now();
		const title = input.destination ? `${kindTitle(input.kind)} — ${input.destination}` : kindTitle(input.kind);
		const startEvent = observed("session_started", "Session started", `${title}. Check-in every ${Math.round(input.checkInEveryMs / 1e3)}s in this preview (shortened).`, { covert: Boolean(input.covert) });
		set({
			sessions: [{
				id,
				kind: input.kind,
				title,
				destination: input.destination,
				meetingWith: input.meetingWith,
				startedAt: now,
				expectedEndAt: now + input.durationMs,
				checkInEveryMs: input.checkInEveryMs,
				nextCheckInAt: now + input.checkInEveryMs,
				confirmUntil: null,
				missedCheckins: 0,
				status: "active",
				protocolFired: false,
				events: [startEvent],
				breadcrumbs: [{
					t: now,
					x: HOME_POINT.x,
					y: HOME_POINT.y
				}],
				battery: 87,
				online: true,
				notes: [],
				pathProgress: 0,
				arrived: false,
				departed: false,
				deviated: false,
				covert: Boolean(input.covert),
				escrow: {
					enabled: input.escrowEnabled,
					contactId: input.escrowContactId,
					missedCheckins: 2,
					offlineMs: 2e4,
					released: false
				}
			}, ...get().sessions],
			activeSessionId: id
		});
		return id;
	},
	addEvent: (sessionId, kind, label, detail, meta) => {
		const ev = observed(kind, label, detail, meta);
		set({ sessions: get().sessions.map((s) => s.id === sessionId ? {
			...s,
			events: [...s.events, ev]
		} : s) });
	},
	checkIn: (sessionId) => {
		const id = sessionId ?? get().activeSessionId;
		if (!id) return;
		const now = Date.now();
		const ev = observed("checkin_ok", "Check-in received", "User confirmed within the authorized window.");
		set({ sessions: get().sessions.map((s) => s.id === id ? {
			...s,
			events: [...s.events, ev],
			nextCheckInAt: now + s.checkInEveryMs,
			confirmUntil: null,
			status: s.status === "alert" && !s.deviated ? "active" : s.status
		} : s) });
	},
	confirmOk: (sessionId) => get().checkIn(sessionId),
	tick: (now = Date.now()) => {
		const { activeSessionId, sessions, contacts, triggers } = get();
		if (!activeSessionId) return;
		const session = sessions.find((s) => s.id === activeSessionId);
		if (!session || session.status === "ended") return;
		const elapsed = now - session.startedAt;
		const window = Math.max(1, session.expectedEndAt - session.startedAt);
		let pathProgress = Math.min(1, elapsed / (window * .45));
		let arrived = session.arrived;
		let departed = session.departed;
		let events = session.events;
		let breadcrumbs = session.breadcrumbs;
		let status = session.status;
		let confirmUntil = session.confirmUntil;
		let nextCheckInAt = session.nextCheckInAt;
		let missedCheckins = session.missedCheckins;
		let protocolFired = session.protocolFired;
		let notices = get().notices;
		let online = session.online;
		let sessionEscrow = session.escrow;
		const battery = Math.max(4, session.battery - .015);
		const push = (kind, label, detail) => {
			events = [...events, observed(kind, label, detail)];
		};
		if (!arrived && pathProgress >= 1) {
			arrived = true;
			pathProgress = 1;
			push("arrived", "Arrived at destination", session.destination ? `Device location matched ${session.destination}.` : "Device location matched the session destination.");
		}
		const returnStart = window * .7;
		if (arrived && !session.deviated && elapsed > returnStart) departed = true;
		let pos;
		if (session.deviated) {
			const dElapsed = elapsed - (session.events.find((e) => e.kind === "route_deviation")?.at ?? now) + session.startedAt;
			pos = lerpPath(DEVIATION_PATH, Math.min(1, Math.max(0, dElapsed / 4e4)));
		} else if (!arrived) pos = lerpPath(EXPECTED_PATH, pathProgress);
		else if (departed) pos = lerpPath(RETURN_PATH, Math.min(1, (elapsed - returnStart) / (window * .28)));
		else {
			const wobble = Math.sin(now / 4e3) * .008;
			pos = {
				x: DEST_POINT.x + wobble,
				y: DEST_POINT.y
			};
		}
		const last = breadcrumbs[breadcrumbs.length - 1];
		if (!last || Math.hypot(pos.x - last.x, pos.y - last.y) > .012 || now - last.t > 4e3) breadcrumbs = [...breadcrumbs, {
			t: now,
			x: pos.x,
			y: pos.y
		}].slice(-80);
		if (session.online && confirmUntil === null && now >= nextCheckInAt) {
			confirmUntil = now + triggers.missedResponseMs;
			push("checkin_prompt", "Check-in prompt issued", `Confirm you are okay within ${Math.round(triggers.missedResponseMs / 1e3)} seconds.`);
		}
		if (confirmUntil !== null && now >= confirmUntil) {
			missedCheckins += 1;
			confirmUntil = null;
			nextCheckInAt = now + session.checkInEveryMs;
			status = "alert";
			push("checkin_missed", "Scheduled check-in missed", "No response within the authorized window.");
			if (!protocolFired) {
				protocolFired = true;
				const n = notifyCircle(contacts, "checkin_missed", `Missed check-in on ${session.title}.`);
				notices = [...n, ...notices];
				if (n.length) push("circle_notified", "Guardian Circle notified", n.map((x) => x.contactName).join(", ") + " received the missed-check-in protocol.");
			}
		}
		const offlineSince = get().offlineSince;
		if (!online && offlineSince) {
			const rule = session.escrow;
			if (rule.enabled && !rule.released && missedCheckins >= rule.missedCheckins && now - offlineSince >= rule.offlineMs) {
				const contact = contacts.find((c) => c.id === rule.contactId);
				push("escrow_released", "Evidence escrow released", contact ? `Release rules matched. Capsule access granted to ${contact.name}.` : "Release rules matched.");
				notices = [...notifyCircle(contacts, "escrow_released", `Escrow released for ${session.title}.`), ...notices];
				sessionEscrow = {
					...rule,
					released: true,
					releasedAt: now
				};
			}
		}
		if (battery < 15 && session.battery >= 15) push("battery_change", "Battery crossed 15%", "Device battery entered the low band.");
		set({
			notices,
			sessions: sessions.map((s) => s.id === session.id ? {
				...s,
				events,
				breadcrumbs,
				pathProgress,
				arrived,
				departed,
				status,
				confirmUntil,
				nextCheckInAt,
				missedCheckins,
				protocolFired,
				battery,
				online,
				escrow: sessionEscrow
			} : s)
		});
	},
	endSession: (sessionId) => {
		const id = sessionId ?? get().activeSessionId;
		if (!id) return null;
		const session = get().sessions.find((s) => s.id === id);
		if (!session || session.status === "ended") return null;
		const endEv = observed("session_ended", "Session sealed", "Capsule written with original files. No inferences attached.");
		const ended = {
			...session,
			status: "ended",
			events: [...session.events, endEv],
			confirmUntil: null
		};
		const capsule = sealCapsule(ended, session.escrow);
		set({
			sessions: get().sessions.map((s) => s.id === id ? ended : s),
			activeSessionId: get().activeSessionId === id ? null : get().activeSessionId,
			capsules: [capsule, ...get().capsules.filter((c) => c.sessionId !== id)]
		});
		return capsule.id;
	},
	simulateArrival: () => {
		const id = get().activeSessionId;
		if (!id) return;
		set({ sessions: get().sessions.map((s) => {
			if (s.id !== id || s.arrived) return s;
			const ev = observed("arrived", "Arrived at destination", s.destination ? `Device location matched ${s.destination}.` : "Device location matched the session destination.");
			return {
				...s,
				arrived: true,
				pathProgress: 1,
				breadcrumbs: [...s.breadcrumbs, {
					t: Date.now(),
					x: DEST_POINT.x,
					y: DEST_POINT.y
				}],
				events: [...s.events, ev]
			};
		}) });
	},
	simulateDeviation: () => {
		const id = get().activeSessionId;
		if (!id) return;
		const session = get().sessions.find((s) => s.id === id);
		if (!session || session.deviated) return;
		const move = observed("location_update", "Device began moving north", "Heading changed after a stationary period.");
		const dev = observed("route_deviation", "Route deviated from expected destination", "Path no longer aligned with the expected route.");
		const n = notifyCircle(get().contacts, "route_deviation", `Route deviation on ${session.title}.`);
		const extra = n.length ? [observed("circle_notified", "Guardian Circle notified", n.map((x) => x.contactName).join(", ") + " received a route-deviation notice.")] : [];
		set({
			notices: [...n, ...get().notices],
			sessions: get().sessions.map((s) => s.id === id ? {
				...s,
				arrived: true,
				deviated: true,
				status: "alert",
				events: [
					...s.events,
					move,
					dev,
					...extra
				]
			} : s)
		});
	},
	simulateMissedCheckIn: () => {
		const id = get().activeSessionId;
		if (!id) return;
		set({ sessions: get().sessions.map((s) => s.id === id ? {
			...s,
			nextCheckInAt: Date.now() - 1e3,
			confirmUntil: Date.now() - 1e3
		} : s) });
		get().tick();
	},
	simulateOffline: () => {
		const id = get().activeSessionId;
		if (!id) return;
		const ev = observed("connectivity_lost", "Device connectivity lost", "Phone reported offline.");
		const n = notifyCircle(get().contacts, "connectivity_lost", "Device went offline during a protected session.");
		set({
			offlineSince: Date.now(),
			notices: [...n, ...get().notices],
			sessions: get().sessions.map((s) => s.id === id ? {
				...s,
				online: false,
				status: "alert",
				events: [
					...s.events,
					ev,
					...n.length ? [observed("circle_notified", "Guardian Circle notified", n.map((x) => x.contactName).join(", ") + " received an offline notice.")] : []
				]
			} : s)
		});
	},
	simulateOnline: () => {
		const id = get().activeSessionId;
		if (!id) return;
		const ev = observed("connectivity_restored", "Device connectivity restored", "Phone reported online.");
		set({
			offlineSince: null,
			sessions: get().sessions.map((s) => s.id === id ? {
				...s,
				online: true,
				events: [...s.events, ev]
			} : s)
		});
	},
	triggerCovert: (source) => {
		const sourceLabel = {
			pin: "Covert PIN accepted on decoy surface",
			phrase: "Voice phrase matched the authorized trigger",
			gesture: "Hardware gesture sequence matched",
			watch: "Wearable tap pattern matched"
		}[source];
		const existing = get().activeSessionId;
		if (existing) {
			const ev = observed("covert_trigger", "Covert trigger activated", sourceLabel, { source });
			set({ sessions: get().sessions.map((s) => s.id === existing ? {
				...s,
				covert: true,
				status: "alert",
				events: [...s.events, ev]
			} : s) });
			return existing;
		}
		const id = get().startSession({
			kind: "custom",
			destination: "",
			meetingWith: "",
			durationMs: 72e4,
			checkInEveryMs: 9e4,
			escrowEnabled: true,
			escrowContactId: get().contacts[0]?.id ?? "",
			covert: true
		});
		get().addEvent(id, "covert_trigger", "Covert trigger activated", sourceLabel, { source });
		return id;
	},
	saveChronology: (capsuleId, text) => set({ capsules: get().capsules.map((c) => c.id === capsuleId ? {
		...c,
		chronology: text
	} : c) }),
	releaseEscrow: (capsuleId) => {
		const cap = get().capsules.find((c) => c.id === capsuleId);
		if (!cap || cap.escrow.released) return;
		const contact = get().contacts.find((c) => c.id === cap.escrow.contactId);
		set({
			notices: [...notifyCircle(get().contacts, "escrow_released", `Escrow released for ${cap.title}.`), ...get().notices],
			capsules: get().capsules.map((c) => c.id === capsuleId ? {
				...c,
				escrow: {
					...c.escrow,
					released: true,
					releasedAt: Date.now()
				},
				events: [...c.events, observed("escrow_released", "Evidence escrow released", contact ? `Release rules matched. Capsule access granted to ${contact.name}.` : "Release rules matched.")]
			} : c)
		});
	},
	addNote: (text) => {
		const id = get().activeSessionId;
		if (!id || !text.trim()) return;
		const ev = observed("note", "User-submitted note preserved", text.trim());
		set({ sessions: get().sessions.map((s) => s.id === id ? {
			...s,
			notes: [...s.notes, text.trim()],
			events: [...s.events, ev]
		} : s) });
	},
	saveDexterMemo: (memo) => {
		const id = uid();
		set({ dexterMemos: [{
			id,
			createdAt: Date.now(),
			...memo
		}, ...get().dexterMemos ?? []].slice(0, 20) });
		return id;
	},
	removeDexterMemo: (id) => set({ dexterMemos: (get().dexterMemos ?? []).filter((m) => m.id !== id) })
}), {
	name: "guardianos-v1",
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	merge: (persisted, current) => {
		const p = persisted ?? {};
		return {
			...current,
			...p,
			dexterMemos: p.dexterMemos ?? []
		};
	},
	partialize: (s) => ({
		onboarded: s.onboarded,
		displayName: s.displayName,
		contacts: s.contacts,
		sessions: s.sessions,
		activeSessionId: s.activeSessionId,
		capsules: s.capsules,
		triggers: s.triggers,
		protocol: s.protocol,
		notices: s.notices,
		offlineSince: s.offlineSince,
		dexterMemos: s.dexterMemos ?? []
	})
}));
function useActiveSession() {
	return useGuardianStore((s) => {
		if (!s.activeSessionId) return null;
		return s.sessions.find((x) => x.id === s.activeSessionId) ?? null;
	});
}
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: House,
		match: (p) => p === "/"
	},
	{
		to: "/session/new",
		label: "Session",
		icon: Radio,
		match: (p) => p.startsWith("/session"),
		liveTo: true
	},
	{
		to: "/capsules",
		label: "Vault",
		icon: Lock,
		match: (p) => p.startsWith("/capsules") || p.startsWith("/verify")
	},
	{
		to: "/circle",
		label: "Circle",
		icon: Users,
		match: (p) => p.startsWith("/circle")
	},
	{
		to: "/dexter",
		label: "Dexter",
		icon: ChartLine,
		match: (p) => p.startsWith("/dexter")
	}
];
function AppShell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const session = useActiveSession();
	const liveId = useGuardianStore((s) => s.activeSessionId);
	if (path === "/decoy" || path === "/campaign") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-surface px-3 py-5 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "mb-8 flex items-center gap-2 px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleMark, {
							className: "size-7",
							live: Boolean(session)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium tracking-tight",
							children: "GuardianOS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
							children: session ? "Recording" : "Standby"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-1",
						children: NAV.map((item) => {
							const active = item.match(path);
							const Icon = item.icon;
							if (item.liveTo && liveId) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/session/$id",
								params: { id: liveId },
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-elevated text-fg shadow-[var(--shadow-border)]" : "text-muted hover:bg-elevated hover:text-fg"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
									item.label,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto size-1.5 rounded-full bg-live live-dot" })
								]
							}, item.label);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-elevated text-fg shadow-[var(--shadow-border)]" : "text-muted hover:bg-elevated hover:text-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
							}, item.label);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/protocol",
							className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm", path.startsWith("/protocol") ? "bg-elevated text-fg shadow-[var(--shadow-border)]" : "text-muted hover:bg-elevated hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "size-4" }), "Protocol"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/triggers",
							className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm", path.startsWith("/triggers") ? "bg-elevated text-fg shadow-[var(--shadow-border)]" : "text-muted hover:bg-elevated hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: "size-4" }), "Triggers"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleMark, {
						className: "size-6",
						live: Boolean(session)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "GuardianOS"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex items-center gap-2 text-[10px] tracking-[0.16em] text-subtle uppercase",
					children: session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-live live-dot" }), "Recording"] }) : "Standby"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "md:pl-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-5xl px-4 pt-5 pb-28 md:px-8 md:pb-12",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface/95 px-1 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden",
				children: NAV.map((item) => {
					const active = item.match(path);
					const Icon = item.icon;
					const className = cn("flex h-12 min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide", active ? "text-fg" : "text-subtle");
					const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.liveTo && session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-0.5 -right-1 size-1.5 rounded-full bg-live" }) : null]
					}), item.label] });
					if (item.liveTo && liveId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/session/$id",
						params: { id: liveId },
						className,
						children: inner
					}, item.label);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className,
						children: inner
					}, item.label);
				})
			})
		]
	});
}
function sequenceMatch(buf, target) {
	if (buf.length < target.length) return false;
	return buf.slice(-target.length).every((k, i) => k === target[i]);
}
function GuardianRuntime() {
	const tick = useGuardianStore((s) => s.tick);
	const triggerCovert = useGuardianStore((s) => s.triggerCovert);
	const volumeGesture = useGuardianStore((s) => s.triggers.volumeGesture);
	const phrase = useGuardianStore((s) => s.triggers.voicePhrase);
	const keys = (0, import_react.useRef)([]);
	const hold = (0, import_react.useRef)(null);
	const typed = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => tick(), 1e3);
		return () => window.clearInterval(id);
	}, [tick]);
	(0, import_react.useEffect)(() => {
		if (!volumeGesture) return;
		const onDown = (e) => {
			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				keys.current = [...keys.current, e.key].slice(-6);
				if (e.key === "ArrowUp") hold.current = window.setTimeout(() => {
					if (sequenceMatch(keys.current, [
						"ArrowUp",
						"ArrowDown",
						"ArrowUp"
					])) {
						triggerCovert("gesture");
						keys.current = [];
					}
				}, 700);
			}
			if (e.key.length === 1) {
				typed.current = (typed.current + e.key).slice(-80);
				if (phrase && typed.current.toLowerCase().includes(phrase.toLowerCase())) {
					triggerCovert("phrase");
					typed.current = "";
				}
			}
		};
		const onUp = (e) => {
			if (e.key === "ArrowUp" && hold.current) {
				window.clearTimeout(hold.current);
				hold.current = null;
			}
		};
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);
		return () => {
			window.removeEventListener("keydown", onDown);
			window.removeEventListener("keyup", onUp);
		};
	}, [
		volumeGesture,
		phrase,
		triggerCovert
	]);
	return null;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-fg hover:bg-elevated",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-elevated",
			danger: "bg-danger text-fg hover:bg-danger/90",
			live: "bg-live text-fg hover:bg-live/90"
		},
		size: {
			default: "h-11 rounded-md px-4",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11 rounded-md",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 placeholder:text-subtle focus-visible:outline-none focus-visible:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-accent/30 disabled:opacity-50", className),
		...props
	});
}
var STEPS = [
	{
		kicker: "The black box for your real life",
		title: "GuardianOS protects the moments nobody knows will matter until they do.",
		body: "It does not decide if you are in danger. It records authorized facts and recognizes the rules you wrote."
	},
	{
		kicker: "Prevent · Detect · Preserve · Escalate · Reconstruct",
		title: "Every protected session writes a Guardian Capsule.",
		body: "Location, check-ins, connectivity, and notes stay original. Chronologies say “observed event,” never a verdict."
	},
	{
		kicker: "Your circle. Your protocol.",
		title: "Stay protected. Preserve the truth.",
		body: "If a check-in is missed, Guardian follows only the protocol you authorized — including dead-man evidence escrow."
	}
];
function Onboarding() {
	const complete = useGuardianStore((s) => s.completeOnboarding);
	const [step, setStep] = (0, import_react.useState)(0);
	const [name, setName] = (0, import_react.useState)("");
	const current = STEPS[step];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh flex-col bg-bg px-5 py-8 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-md flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleMark, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs tracking-[0.22em] uppercase",
						children: "GuardianOS"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in mt-auto mb-auto space-y-5 pt-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.18em] text-live uppercase",
							children: current.kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-[2rem] leading-tight tracking-tight",
							children: current.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: current.body
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted",
								htmlFor: "display-name",
								children: "What should Circle notices call you?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "display-name",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Optional",
								autoComplete: "given-name"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 pt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1.5",
						children: STEPS.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: i === step ? "h-1 w-6 rounded-full bg-accent" : "h-1 w-3 rounded-full bg-border" }, i))
					}), step < STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setStep((s) => s + 1),
						children: "Continue"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => complete(name),
						children: "Enter GuardianOS"
					})]
				})
			]
		})
	});
}
function Toaster$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "dark",
		position: "top-center",
		toastOptions: { classNames: {
			toast: "bg-elevated text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] border-0",
			title: "text-fg",
			description: "text-muted"
		} }
	});
}
function TooltipProvider({ children, delayDuration = 200 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		children
	});
}
var styles_default = "/assets/styles-BtE_dKPI.css";
var APP_NAME = "GuardianOS";
var Route$14 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0a0b0d"
			},
			{
				name: "description",
				content: "Stay protected. Preserve the truth."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boot, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
function Boot({ children }) {
	const onboarded = useGuardianStore((s) => s.onboarded);
	const path = useRouterState({ select: (s) => s.location.pathname });
	if (path === "/campaign" || path === "/decoy") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	if (!onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardianRuntime, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children })] });
}
var $$splitComponentImporter$10 = () => import("./routes-BIQrP7Sc.mjs");
var Route$13 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./campaign-649n2Y9r.mjs");
var Route$12 = createFileRoute("/campaign")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./capsules-DeGPh_Kw.mjs");
var Route$11 = createFileRoute("/capsules")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./circle-B66w1UNW.mjs");
var Route$10 = createFileRoute("/circle")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./decoy-Dts6rjKh.mjs");
var Route$9 = createFileRoute("/decoy")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./dexter-CvpDPeXM.mjs");
var Route$8 = createFileRoute("/dexter")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./protocol-DsVHduRq.mjs");
var Route$7 = createFileRoute("/protocol")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./triggers-CO5KCD_y.mjs");
var Route$6 = createFileRoute("/triggers")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./verify-ibauBnr_.mjs");
var Route$5 = createFileRoute("/verify")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./capsules-DJpILa1H.mjs");
var Route$4 = createFileRoute("/capsules/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-elevated text-muted shadow-[var(--shadow-border)]",
		live: "bg-live/15 text-live",
		ok: "bg-ok/15 text-ok",
		alert: "bg-live/15 text-live",
		danger: "bg-danger/15 text-danger",
		accent: "bg-accent/15 text-accent"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-surface p-4 text-fg shadow-[var(--shadow-border)]", className),
		...props
	});
}
function streets() {
	const lines = [];
	for (let i = 1; i <= 8; i++) {
		const v = i / 9 * 100;
		lines.push({
			x1: v,
			y1: 0,
			x2: v,
			y2: 100
		});
		lines.push({
			x1: 0,
			y1: v,
			x2: 100,
			y2: v
		});
	}
	return lines;
}
function BreadcrumbMap({ crumbs, className, expected = true }) {
	const pts = crumbs.map((c) => `${(c.x * 100).toFixed(2)},${(c.y * 100).toFixed(2)}`).join(" ");
	const last = crumbs[crumbs.length - 1];
	const grid = streets();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-lg bg-bg shadow-[var(--shadow-border)]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			className: "block h-full w-full",
			"aria-hidden": true,
			children: [
				grid.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: l.x1,
					y1: l.y1,
					x2: l.x2,
					y2: l.y2,
					stroke: "currentColor",
					className: "text-border",
					strokeWidth: i % 3 === 0 ? .45 : .25
				}, i)),
				expected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
					points: "18,78 26,70 34,62 46,55 58,48 66,42 72,38",
					fill: "none",
					stroke: "currentColor",
					className: "text-subtle",
					strokeWidth: "0.7",
					strokeDasharray: "1.4 1.4"
				}),
				pts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
					points: pts,
					fill: "none",
					stroke: "currentColor",
					className: "text-accent",
					strokeWidth: "1.15",
					strokeLinejoin: "round",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: HOME_POINT.x * 100,
					cy: HOME_POINT.y * 100,
					r: "1.6",
					className: "fill-muted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: DEST_POINT.x * 100,
					cy: DEST_POINT.y * 100,
					r: "1.8",
					className: "fill-accent"
				}),
				last && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: last.x * 100,
					cy: last.y * 100,
					r: "3.2",
					className: "fill-live/25"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: last.x * 100,
					cy: last.y * 100,
					r: "1.5",
					className: "fill-live"
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-3 py-2 text-[10px] tracking-wide text-subtle uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Destination" })]
		})]
	});
}
function Timeline({ events, compact = false }) {
	const ordered = [...events].sort((a, b) => a.at - b.at);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "relative",
		children: ordered.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-3 pb-4 last:pb-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-16 shrink-0 flex-col items-end pt-0.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						className: "tabular text-xs text-muted",
						children: formatTime(ev.at)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1 size-2 rounded-full", ev.kind.includes("missed") || ev.kind === "route_deviation" || ev.kind === "sos" || ev.kind === "connectivity_lost" ? "bg-live" : ev.kind === "checkin_ok" || ev.kind === "session_ended" ? "bg-ok" : "bg-accent") }), i < ordered.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 w-px flex-1 bg-border" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 pb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: ev.label
						}),
						!compact && ev.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted",
							children: ev.detail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[10px] tracking-widest text-subtle uppercase",
							children: "Observed event"
						})
					]
				})
			]
		}, ev.id))
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var reconstructChronology = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("0f4e9ae5e3899f5471cecbf31cc7abdf04fe9ef577671b723ed3d4ee091a638e"));
var assessSession = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4e72452e5bb8953af03c8d5382848b2b56c27b9ff6cfe69f46bbb835370c828c"));
var Route$3 = createFileRoute("/capsules/$id")({ component: CapsuleDetail });
function CapsuleDetail() {
	const { id } = Route$3.useParams();
	const capsule = useGuardianStore((s) => s.capsules.find((c) => c.id === id));
	const contacts = useGuardianStore((s) => s.contacts);
	const saveChronology = useGuardianStore((s) => s.saveChronology);
	const releaseEscrow = useGuardianStore((s) => s.releaseEscrow);
	const [working, setWorking] = (0, import_react.useState)(false);
	if (!capsule) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Capsule not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/capsules",
				children: "Back to vault"
			})
		})]
	});
	const escrowName = contacts.find((c) => c.id === capsule.escrow.contactId)?.name ?? "named contact";
	const onReconstruct = async () => {
		setWorking(true);
		try {
			const res = await reconstructChronology({ data: {
				title: capsule.title,
				destination: capsule.destination,
				events: capsule.events.map((e) => ({
					at: formatTime(e.at),
					kind: e.kind,
					label: e.label,
					detail: e.detail
				}))
			} });
			if (res.ok) {
				saveChronology(capsule.id, res.text);
				toast("Chronology written from original records");
			} else toast(res.error);
		} catch {
			toast("GuardianAI could not complete the chronology.");
		} finally {
			setWorking(false);
		}
	};
	const onExport = () => {
		const pkg = {
			product: "Guardian Verify",
			notice: "Fact package. Not a police report. Not an accusation. Original records only.",
			capsule: {
				id: capsule.id,
				title: capsule.title,
				sealedAt: new Date(capsule.sealedAt).toISOString(),
				destination: capsule.destination,
				integrityHash: capsule.integrityHash,
				original: true
			},
			checks: {
				locationData: capsule.breadcrumbs.length > 0,
				originalMediaHashes: capsule.eventHashes.length > 0,
				deviceTimestamps: true,
				checkInRecords: capsule.events.some((e) => e.kind.startsWith("checkin")),
				emergencyContactEvents: capsule.events.some((e) => e.kind === "circle_notified"),
				fileIntegrity: Boolean(capsule.integrityHash)
			},
			events: capsule.events.map((e) => ({
				at: new Date(e.at).toISOString(),
				kind: e.kind,
				label: e.label,
				detail: e.detail ?? null,
				hash: capsule.eventHashes.find((h) => h.eventId === e.id)?.hash ?? null
			}))
		};
		const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${capsule.id}.guardian.json`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const checks = [
		{
			label: "Location data",
			ok: capsule.breadcrumbs.length > 0
		},
		{
			label: "Original media hashes",
			ok: capsule.eventHashes.length > 0
		},
		{
			label: "Device timestamps",
			ok: true
		},
		{
			label: "Check-in records",
			ok: capsule.events.some((e) => e.kind.startsWith("checkin"))
		},
		{
			label: "Emergency-contact events",
			ok: capsule.events.some((e) => e.kind === "circle_notified")
		},
		{
			label: "File integrity",
			ok: Boolean(capsule.integrityHash)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleObject, {
						serial: capsule.integrityHash,
						sealed: true,
						live: capsule.escrow.released
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.2em] text-subtle uppercase",
								children: "Capsule"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-3xl tracking-tight",
								children: capsule.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: ["Sealed ", formatDateTime(capsule.sealedAt)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-xs text-subtle",
								children: shortHash(capsule.integrityHash, 10)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: onExport,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Export fact package"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbMap, {
					crumbs: capsule.breadcrumbs,
					className: "h-52"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "GuardianAI chronology"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onReconstruct,
						disabled: working,
						children: working ? "Writing…" : capsule.chronology ? "Rewrite from originals" : "Reconstruct"
					})]
				}), capsule.chronology ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto font-sans text-sm leading-relaxed whitespace-pre-wrap text-fg",
					children: capsule.chronology
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Reconstruct a human-readable chronology from the original records. GuardianAI will not add inferences."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 text-sm font-medium",
						children: "Observed events"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { events: capsule.events })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Guardian Verify"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "A fact package. Not a police report. Not an accusation."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2",
								children: checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: c.label
									}), c.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex items-center gap-1 text-ok",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-subtle",
										children: "—"
									})]
								}, c.label))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium",
									children: "Evidence escrow"
								}), capsule.escrow.released ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "live",
									children: "Released"
								}) : capsule.escrow.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Armed" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Off" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted",
								children: [
									"If two check-ins fail and the device stays offline, access goes to",
									" ",
									escrowName,
									". Taking the phone does not erase the record."
								]
							}),
							capsule.escrow.enabled && !capsule.escrow.released ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-4 w-full",
								variant: "secondary",
								onClick: () => {
									releaseEscrow(capsule.id);
									toast(`Capsule released to ${escrowName}`);
								},
								children: "Simulate release"
							}) : null
						]
					})]
				})]
			})
		]
	});
}
var $$splitComponentImporter = () => import("./session-BSmrYc1U.mjs");
var Route$2 = createFileRoute("/session/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function CheckInRing({ remainingMs, totalMs, alert }) {
	const r = 42;
	const c = 2 * Math.PI * r;
	const dash = c * Math.min(1, Math.max(0, remainingMs / Math.max(1, totalMs)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto size-36",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			className: "size-full -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r,
				fill: "none",
				stroke: "currentColor",
				className: "text-border",
				strokeWidth: "4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r,
				fill: "none",
				stroke: "currentColor",
				className: alert ? "text-live" : "text-accent",
				strokeWidth: "4",
				strokeDasharray: `${dash} ${c}`,
				strokeLinecap: "round"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("tabular font-display text-2xl tracking-tight", alert ? "text-live" : "text-fg"),
				children: formatDuration(remainingMs)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] tracking-widest text-subtle uppercase",
				children: alert ? "Confirm" : "Check-in"
			})]
		})]
	});
}
var Route$1 = createFileRoute("/session/$id")({ component: LiveSession });
function useNow(interval) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		if (interval === null) return;
		const id = window.setInterval(() => setNow(Date.now()), interval);
		return () => window.clearInterval(id);
	}, [interval]);
	return now;
}
function LiveSession() {
	const { id } = Route$1.useParams();
	const navigate = useNavigate();
	const session = useGuardianStore((s) => s.sessions.find((x) => x.id === id));
	const checkIn = useGuardianStore((s) => s.checkIn);
	const endSession = useGuardianStore((s) => s.endSession);
	const addNote = useGuardianStore((s) => s.addNote);
	const simulateArrival = useGuardianStore((s) => s.simulateArrival);
	const simulateDeviation = useGuardianStore((s) => s.simulateDeviation);
	const simulateMissedCheckIn = useGuardianStore((s) => s.simulateMissedCheckIn);
	const simulateOffline = useGuardianStore((s) => s.simulateOffline);
	const simulateOnline = useGuardianStore((s) => s.simulateOnline);
	const [note, setNote] = (0, import_react.useState)("");
	const [assessment, setAssessment] = (0, import_react.useState)(null);
	const [assessing, setAssessing] = (0, import_react.useState)(false);
	const now = useNow(session && session.status !== "ended" ? 500 : null);
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Session not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/session/new",
				children: "Start a session"
			})
		})]
	});
	const missedMs = useGuardianStore((s) => s.triggers.missedResponseMs);
	const remaining = session.confirmUntil ? session.confirmUntil - now : session.nextCheckInAt - now;
	const total = session.confirmUntil ? missedMs : session.checkInEveryMs;
	const prompting = Boolean(session.confirmUntil);
	const onEnd = () => {
		const capId = endSession(session.id);
		if (capId) {
			toast("Capsule sealed");
			navigate({
				to: "/capsules/$id",
				params: { id: capId }
			});
		}
	};
	const onAssess = async () => {
		setAssessing(true);
		setAssessment(null);
		const facts = [
			`Status: ${session.status}`,
			`Destination: ${session.destination || "unspecified"}`,
			`Arrived: ${session.arrived ? "yes" : "no"}`,
			`Route deviation: ${session.deviated ? "yes" : "no"}`,
			`Missed check-ins: ${session.missedCheckins}`,
			`Online: ${session.online ? "yes" : "no"}`,
			`Battery: ${Math.round(session.battery)}%`,
			`Elapsed: ${formatDuration(now - session.startedAt)}`
		];
		try {
			const res = await assessSession({ data: {
				title: session.title,
				expectedEnd: formatDateTime(session.expectedEndAt),
				facts
			} });
			if (res.ok) setAssessment(res.text);
			else setAssessment(res.error);
		} catch {
			setAssessment("GuardianAI could not complete the assessment.");
		} finally {
			setAssessing(false);
		}
	};
	if (session.status === "ended") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Session sealed"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/capsules",
				children: "Open vault"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-subtle uppercase",
						children: "Live"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: session.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							session.meetingWith ? `Meeting ${session.meetingWith}. ` : null,
							"Expected window ends ",
							formatDateTime(session.expectedEndAt),
							"."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: session.status === "alert" ? "live" : "ok",
						children: session.status === "alert" ? "Protocol armed" : "Active"
					}), session.covert ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Covert" }) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckInRing, {
							remainingMs: Math.max(0, remaining),
							totalMs: total,
							alert: prompting
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => checkIn(session.id),
								children: prompting ? "I'm okay" : "Check in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "danger",
								onClick: onEnd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" }), "End and seal capsule"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 grid grid-cols-3 gap-2 text-center text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md bg-elevated px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: "Battery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "mt-1 flex items-center justify-center gap-1 tabular text-fg",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, { className: "size-3.5" }),
											Math.round(session.battery),
											"%"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md bg-elevated px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: "Link"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "mt-1 flex items-center justify-center gap-1 text-fg",
										children: [session.online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "size-3.5 text-live" }), session.online ? "Online" : "Offline"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md bg-elevated px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: "Missed"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 tabular text-fg",
										children: session.missedCheckins
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden p-0 lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbMap, {
						crumbs: session.breadcrumbs,
						className: "h-64 md:h-80"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 px-4 py-3 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
							session.destination || "No destination set",
							session.deviated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "live",
								children: "Route deviation observed"
							}) : session.arrived ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "ok",
								children: "At destination"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "En route" })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Preserve a note"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Notes are stored original. GuardianAI never rewrites them."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							addNote(note);
							setNote("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "What should be on the record?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							disabled: !note.trim(),
							children: "Preserve"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Observed events"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: onAssess,
							disabled: assessing,
							children: assessing ? "Reading facts…" : "Ask GuardianAI"
						})]
					}),
					assessment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 rounded-md bg-elevated p-3 text-sm text-muted",
						children: assessment
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { events: session.events })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Preview tools"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Compressed events so you can see prevent, detect, preserve, and escalate without waiting for a real night out."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: simulateArrival,
								children: "Simulate arrival"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: simulateDeviation,
								children: "Simulate deviation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: simulateMissedCheckIn,
								children: "Miss check-in"
							}),
							session.online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: simulateOffline,
								children: "Go offline"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: simulateOnline,
								children: "Restore link"
							})
						]
					})
				]
			})
		]
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full bg-elevated shadow-[var(--shadow-border)] transition-colors duration-150 data-[state=checked]:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform duration-150 data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-accent-fg" })
	});
}
var Route = createFileRoute("/session/new")({ component: NewSession });
function NewSession() {
	const navigate = useNavigate();
	const start = useGuardianStore((s) => s.startSession);
	const contacts = useGuardianStore((s) => s.contacts);
	const [kind, setKind] = (0, import_react.useState)("date");
	const preset = SESSION_KINDS.find((k) => k.id === kind);
	const [destination, setDestination] = (0, import_react.useState)(preset.defaultDestination);
	const [meetingWith, setMeetingWith] = (0, import_react.useState)("");
	const [durationMin, setDurationMin] = (0, import_react.useState)(8);
	const [checkInSec, setCheckInSec] = (0, import_react.useState)(90);
	const [escrow, setEscrow] = (0, import_react.useState)(true);
	const [escrowContact, setEscrowContact] = (0, import_react.useState)(contacts[0]?.id ?? "");
	const applyKind = (id) => {
		setKind(id);
		const next = SESSION_KINDS.find((k) => k.id === id);
		if (next) setDestination(next.defaultDestination);
	};
	const onStart = () => {
		const id = start({
			kind,
			destination: destination.trim(),
			meetingWith: meetingWith.trim(),
			durationMs: durationMin * 6e4,
			checkInEveryMs: checkInSec * 1e3,
			escrowEnabled: escrow,
			escrowContactId: escrowContact
		});
		navigate({
			to: "/session/$id",
			params: { id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in mx-auto max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-subtle uppercase",
						children: "Arm a window"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: "Start a Guardian Session"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Preview timers are shortened so you can experience check-ins and the protocol without waiting hours."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: SESSION_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => applyKind(k.id),
					className: cn("rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150", kind === k.id ? "shadow-[var(--shadow-border-hover)] ring-1 ring-accent/40" : "hover:shadow-[var(--shadow-border-hover)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: k.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: k.blurb
					})]
				}, k.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "dest",
							children: "Destination"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "dest",
							value: destination,
							onChange: (e) => setDestination(e.target.value),
							placeholder: "Address or place"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "who",
							children: "Meeting with"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "who",
							value: meetingWith,
							onChange: (e) => setMeetingWith(e.target.value),
							placeholder: "Optional name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "dur",
								children: "Expected window (minutes)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "dur",
								type: "number",
								min: 3,
								max: 30,
								value: durationMin,
								onChange: (e) => setDurationMin(Number(e.target.value) || 8)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ci",
								children: "Check-in every (seconds)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ci",
								type: "number",
								min: 30,
								max: 180,
								value: checkInSec,
								onChange: (e) => setCheckInSec(Number(e.target.value) || 90)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-lg bg-elevated px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "Dead-man evidence escrow"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Release the capsule if two check-ins are missed and the phone goes offline."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: escrow,
							onCheckedChange: setEscrow
						})]
					}),
					escrow && contacts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "escrow-who",
							children: "Release to"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "escrow-who",
							className: "flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]",
							value: escrowContact,
							onChange: (e) => setEscrowContact(e.target.value),
							children: contacts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: c.id,
								children: [
									c.name,
									" · ",
									c.relation
								]
							}, c.id))
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "w-full sm:w-auto",
				onClick: onStart,
				children: "Arm session"
			})
		]
	});
}
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var CampaignRoute = Route$12.update({
	id: "/campaign",
	path: "/campaign",
	getParentRoute: () => Route$14
});
var CapsulesRoute = Route$11.update({
	id: "/capsules",
	path: "/capsules",
	getParentRoute: () => Route$14
});
var CircleRoute = Route$10.update({
	id: "/circle",
	path: "/circle",
	getParentRoute: () => Route$14
});
var DecoyRoute = Route$9.update({
	id: "/decoy",
	path: "/decoy",
	getParentRoute: () => Route$14
});
var DexterRoute = Route$8.update({
	id: "/dexter",
	path: "/dexter",
	getParentRoute: () => Route$14
});
var ProtocolRoute = Route$7.update({
	id: "/protocol",
	path: "/protocol",
	getParentRoute: () => Route$14
});
var TriggersRoute = Route$6.update({
	id: "/triggers",
	path: "/triggers",
	getParentRoute: () => Route$14
});
var VerifyRoute = Route$5.update({
	id: "/verify",
	path: "/verify",
	getParentRoute: () => Route$14
});
var CapsulesIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => CapsulesRoute
});
var CapsulesIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => CapsulesRoute
});
var SessionIndexRoute = Route$2.update({
	id: "/session/",
	path: "/session/",
	getParentRoute: () => Route$14
});
var SessionIdRoute = Route$1.update({
	id: "/session/$id",
	path: "/session/$id",
	getParentRoute: () => Route$14
});
var SessionNewRoute = Route.update({
	id: "/session/new",
	path: "/session/new",
	getParentRoute: () => Route$14
});
var CapsulesRouteChildren = {
	CapsulesIdRoute,
	CapsulesIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	CampaignRoute,
	CapsulesRoute: CapsulesRoute._addFileChildren(CapsulesRouteChildren),
	CircleRoute,
	DecoyRoute,
	DexterRoute,
	ProtocolRoute,
	TriggersRoute,
	VerifyRoute,
	SessionIdRoute,
	SessionNewRoute,
	SessionIndexRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { formatDuration as _, Timeline as a, Input as c, useGuardianStore as d, kindTitle as f, formatDateTime as g, cn as h, createSsrRpc as i, Button as l, CapsuleObject as m, Switch as n, Card as o, CapsuleMark as p, Label as r, Badge as s, router_exports as t, useActiveSession as u, shortHash as v };
