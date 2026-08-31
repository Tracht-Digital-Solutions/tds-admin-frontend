import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { _ as FormAlert, a as API_BASE, l as frontendFetch, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as modules } from "./_virtual_frontend-modules_BwNMBwYx.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/ModulesAdmin.tsx
/**
* Read-only inventory of the code that is actually running.
*
* Updating a composed module is a source/release operation. The running panel
* therefore neither contacts a package registry nor starts a GitHub workflow;
* it only combines the frontend build inventory with Composer's local runtime
* inventory from `GET /admin/modules`.
*/
function ModulesAdmin({ modules }) {
	const [backend, setBackend] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await frontendFetch(`${API_BASE}/admin/modules`);
				if (!res.ok) throw new Error(`Backend-Inventar konnte nicht geladen werden (HTTP ${res.status}).`);
				const payload = await res.json();
				if (!cancelled) setBackend({
					modules: payload.modules ?? [],
					packages: payload.packages ?? {}
				});
			} catch (cause) {
				if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
			} finally {
				if (!cancelled) setLoaded(true);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	const backendVersion = (pkg) => backend?.packages?.[pkg.replace(/^@/, "")] ?? null;
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Diese Übersicht zeigt ausschließlich den ausgelieferten Stand. Änderungen an Modulen werden im Quellcode vorgenommen und über den regulären Release-Prozess veröffentlicht."
			}),
			/* @__PURE__ */ jsx(FormAlert, { message: error }),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-card",
				children: [/* @__PURE__ */ jsxs("table", {
					className: "tds-table",
					children: [
						/* @__PURE__ */ jsx("caption", {
							className: "marginalia",
							children: "Frontend = in diesen Panel-Build komponiert · Backend = im laufenden API-Bundle installiert."
						}),
						/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Modul"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Frontend"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Backend"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								className: "hidden md:table-cell",
								children: "Pin"
							})
						] }) }),
						/* @__PURE__ */ jsx("tbody", { children: modules.map((entry) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsxs("th", {
								scope: "row",
								children: [entry.name, /* @__PURE__ */ jsx("span", {
									className: "marginalia block",
									children: entry.pkg
								})]
							}),
							/* @__PURE__ */ jsx("td", { children: entry.installed || "—" }),
							/* @__PURE__ */ jsx("td", { children: loaded ? backendVersion(entry.pkg) ?? "—" : /* @__PURE__ */ jsx(Spinner, { size: "sm" }) }),
							/* @__PURE__ */ jsx("td", {
								className: "hidden md:table-cell",
								children: entry.range || "—"
							})
						] }, entry.pkg)) })
					]
				}), modules.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "tds-empty",
					children: "Keine Module gefunden — dieser Build enthält kein auflösbares Produkt-Inventar."
				}) : null]
			}),
			backend && backend.modules.length > 0 ? /* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Im API-Bundle komponiert: ",
					backend.modules.join(", "),
					"."
				]
			}) : null
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/module.astro
var module_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Module,
	file: () => $$file,
	url: () => $$url
});
var $$Module = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Module" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">System</p><h1 class="tds-page__title">Module</h1><p class="tds-page__lede">Der ausgelieferte Stand der im Panel und im API-Bundle installierten Module.</p></div></div>${renderComponent($$result, "ModulesAdmin", ModulesAdmin, {
		"client:load": true,
		"modules": modules,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/ModulesAdmin.tsx",
		"client:component-export": "default"
	})}</section>` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/module.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/module.astro";
var $$url = "/module";
//#endregion
//#region \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/module@_@astro
var page = () => module_exports;
//#endregion
export { page };
