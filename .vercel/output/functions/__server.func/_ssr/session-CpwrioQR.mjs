import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as useGuardianStore } from "./router-Bl4lStQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-CpwrioQR.js
var import_jsx_runtime = require_jsx_runtime();
function SessionIndex() {
	const id = useGuardianStore((s) => s.activeSessionId);
	if (id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/session/$id",
		params: { id }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/session/new" });
}
//#endregion
export { SessionIndex as component };
