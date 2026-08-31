import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { _ as FormAlert, a as API_BASE, l as frontendFetch, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import "./markdown_BXKCkzAJ.mjs";
import { t as modules } from "./_virtual_frontend-modules_BwNMBwYx.mjs";
import { useEffect, useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/ApiReference.tsx
var METHODS = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
];
function methodChip(method) {
	switch (method.toUpperCase()) {
		case "GET": return "chip--success";
		case "POST": return "chip--info";
		case "PUT":
		case "PATCH": return "chip--warning";
		case "DELETE": return "chip--danger";
		default: return "chip--neutral";
	}
}
var AUTH_LABEL = {
	public: "Öffentlich",
	session: "Anmeldung",
	permission: "Recht",
	admin: "Nur Admin",
	token: "Token",
	"pairing-token": "Pairing-Token",
	"finalize-token": "Finalisierungs-Token"
};
/**
* The module's German display name. The API emits ids only — on purpose: the
* name lives in each extension's TS manifest, which the BUILD already has
* composed (`virtual:frontend-modules`, handed in as a prop by the page).
* Duplicating it into the backend would be a second source of truth that
* nothing keeps in sync. An id with no matching package renders as itself.
*/
function moduleName(id, modules) {
	if (id === "base") return "Basis (Kernel)";
	return modules.find((m) => m.id === id)?.name ?? id;
}
/** German plural. A composed build has one module often enough to notice. */
function plural(n, one, many) {
	return `${n} ${n === 1 ? one : many}`;
}
/** Stable, linkable anchor for one route. */
function anchorFor(route) {
	return `route-${route.method}-${route.pattern}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function ApiReference({ modules: inventory }) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [q, setQ] = useState("");
	const [method, setMethod] = useState(null);
	const [expandKey, setExpandKey] = useState(0);
	const [expandAll, setExpandAll] = useState(false);
	useEffect(() => {
		frontendFetch(`${API_BASE}/wiki.json`).then((r) => r.ok ? r.json() : Promise.reject(/* @__PURE__ */ new Error(r.status === 403 ? "Nur für Admins." : `HTTP ${r.status}`))).then((d) => setData(d)).catch((e) => setError(String(e?.message ?? e)));
	}, []);
	const modules = useMemo(() => {
		if (!data) return [];
		const query = q.trim().toLowerCase();
		return data.modules.map((m) => ({
			...m,
			routes: m.routes.filter((r) => {
				if (method && r.method !== method) return false;
				if (!query) return true;
				return `${r.method} ${r.pattern} ${r.summary} ${r.description ?? ""}`.toLowerCase().includes(query);
			})
		})).filter((m) => m.routes.length > 0);
	}, [
		data,
		q,
		method
	]);
	const filtering = q.trim() !== "" || method !== null;
	const open = expandAll || filtering;
	if (error) return /* @__PURE__ */ jsx(FormAlert, { message: error });
	if (!data) return /* @__PURE__ */ jsx("p", {
		role: "status",
		children: /* @__PURE__ */ jsx(Spinner, {})
	});
	if (data.version !== 2) return /* @__PURE__ */ jsx(FormAlert, { message: `Diese Seite erwartet /wiki.json in Version 2, bekommen hat sie Version ${data.version}. Vermutlich ist das Backend älter als das Frontend.` });
	const shown = modules.reduce((n, m) => n + m.routes.length, 0);
	return /* @__PURE__ */ jsxs("div", {
		className: "api-reference",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Route, Zweck oder Beschreibung suchen …",
						"aria-label": "API-Referenz durchsuchen"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "tds-row",
						role: "group",
						"aria-label": "Nach Methode filtern",
						children: METHODS.map((m) => /* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-pressed": method === m,
							className: method === m ? `chip ${methodChip(m)}` : "chip",
							onClick: () => setMethod(method === m ? null : m),
							children: m
						}, m))
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => {
							setExpandAll(!expandAll);
							setExpandKey((k) => k + 1);
						},
						children: expandAll ? "Alles zuklappen" : "Alles aufklappen"
					})
				]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-sm opacity-70 my-3",
				children: [shown === data.stats.routes ? `${plural(data.stats.routes, "Route", "Routen")} in ${plural(data.stats.modules, "Modul", "Modulen")}` : `${shown} von ${plural(data.stats.routes, "Route", "Routen")}`, data.stats.documented < data.stats.routes && /* @__PURE__ */ jsxs(Fragment$1, { children: [
					" · ",
					data.stats.routes - data.stats.documented,
					" ohne Beschreibung"
				] })]
			}),
			data.stats.orphan_docs.length > 0 && /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--warning",
				children: [
					"Beschreibungen ohne passende Route (vermutlich umbenannt):",
					" ",
					data.stats.orphan_docs.join(", ")
				]
			}),
			modules.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Keine Route passt zum Filter."
			}) : modules.map((m) => /* @__PURE__ */ jsxs("details", {
				className: "tds-card p-4 mb-4",
				open,
				children: [/* @__PURE__ */ jsxs("summary", {
					className: "cursor-pointer font-semibold",
					children: [
						moduleName(m.id, inventory),
						" ",
						/* @__PURE__ */ jsxs("span", {
							className: "opacity-60 font-normal",
							children: [
								"(",
								m.routes.length,
								")"
							]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "tds-stack mt-3",
					children: m.routes.map((r) => /* @__PURE__ */ jsx(RouteEntry, {
						route: r,
						open
					}, `${r.method} ${r.pattern}`))
				})]
			}, `${m.id}-${expandKey}`))
		]
	});
}
function RouteEntry({ route, open }) {
	return /* @__PURE__ */ jsxs("details", {
		id: anchorFor(route),
		open,
		children: [/* @__PURE__ */ jsxs("summary", {
			className: "cursor-pointer flex items-baseline gap-2 min-w-0 flex-wrap",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: `chip ${methodChip(route.method)}`,
					children: route.method
				}),
				/* @__PURE__ */ jsx("code", {
					className: "break-all",
					children: route.pattern
				}),
				route.summary && /* @__PURE__ */ jsx("span", {
					className: "text-sm opacity-70",
					children: route.summary
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "tds-stack mt-2 mb-4 pl-1 text-sm",
			children: [
				!route.documented && /* @__PURE__ */ jsx("p", {
					className: "opacity-60",
					children: "Für diese Route liegt noch keine Beschreibung vor. Sie wird aus den registrierten Slim-Routen gelistet, damit die Referenz vollständig bleibt."
				}),
				route.description && /* @__PURE__ */ jsx("p", {
					className: "opacity-80",
					children: route.description
				}),
				(route.auth || route.permission) && /* @__PURE__ */ jsxs("p", {
					className: "tds-row",
					children: [route.auth && /* @__PURE__ */ jsx("span", {
						className: "chip chip--neutral",
						children: AUTH_LABEL[route.auth] ?? route.auth
					}), route.permission && /* @__PURE__ */ jsx("code", { children: route.permission })]
				}),
				route.params && route.params.length > 0 && /* @__PURE__ */ jsx(ParamTable, {
					params: route.params,
					label: `Parameter von ${route.method} ${route.pattern}`
				}),
				route.responses && route.responses.length > 0 && /* @__PURE__ */ jsx(ResponseTable, {
					responses: route.responses,
					label: `Antworten von ${route.method} ${route.pattern}`
				})
			]
		})]
	});
}
/**
* `tds-table` turns itself into a horizontal scroller below 40rem — no extra
* `overflow-x` wrapper. It has no focusable cell, so it also needs
* `tabindex`/`role`/label or its scrollport is unreachable by keyboard.
*/
function ParamTable({ params, label }) {
	return /* @__PURE__ */ jsxs("table", {
		className: "tds-table",
		tabIndex: 0,
		role: "region",
		"aria-label": label,
		children: [
			/* @__PURE__ */ jsx("caption", {
				className: "text-left opacity-70",
				children: "Parameter"
			}),
			/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("th", { children: "Name" }),
				/* @__PURE__ */ jsx("th", { children: "Ort" }),
				/* @__PURE__ */ jsx("th", { children: "Typ" }),
				/* @__PURE__ */ jsx("th", { children: "Pflicht" }),
				/* @__PURE__ */ jsx("th", { children: "Beschreibung" })
			] }) }),
			/* @__PURE__ */ jsx("tbody", { children: params.map((p) => /* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("code", { children: p.name }) }),
				/* @__PURE__ */ jsx("td", { children: p.in }),
				/* @__PURE__ */ jsx("td", { children: p.type }),
				/* @__PURE__ */ jsx("td", { children: p.required ? "ja" : "—" }),
				/* @__PURE__ */ jsx("td", { children: p.description ?? "—" })
			] }, `${p.in}-${p.name}`)) })
		]
	});
}
function ResponseTable({ responses, label }) {
	return /* @__PURE__ */ jsxs("table", {
		className: "tds-table",
		tabIndex: 0,
		role: "region",
		"aria-label": label,
		children: [
			/* @__PURE__ */ jsx("caption", {
				className: "text-left opacity-70",
				children: "Antworten"
			}),
			/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("th", { children: "Status" }), /* @__PURE__ */ jsx("th", { children: "Bedeutung" })] }) }),
			/* @__PURE__ */ jsx("tbody", { children: responses.map((r) => /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("code", { children: r.status }) }), /* @__PURE__ */ jsxs("td", { children: [r.description, r.example && /* @__PURE__ */ jsxs(Fragment$1, { children: [" ", /* @__PURE__ */ jsx("code", {
				className: "break-all",
				children: r.example
			})] })] })] }, r.status)) })
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/wiki.astro
var wiki_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Wiki,
	file: () => $$file,
	url: () => $$url
});
var $$Wiki = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "API-Referenz" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Referenz</p><h1 class="tds-page__title">API-Referenz</h1><p class="tds-page__lede max-w-2xl">Jede Route der Basis und aller komponierten Module — Zweck, Parameter, Antworten und das benötigte Recht. Die Liste entsteht aus den registrierten Slim-Routen, die Beschreibungen liefern die Module selbst. Rein intern.</p></div></div>${renderComponent($$result, "ApiReference", ApiReference, {
		"client:load": true,
		"modules": modules,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/ApiReference.tsx",
		"client:component-export": "default"
	})}</section>` })}`}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/wiki.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/wiki.astro";
var $$url = "/wiki";
//#endregion
//#region \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/wiki@_@astro
var page = () => wiki_exports;
//#endregion
export { page };
