import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-projects/islands/ProjectList.tsx
var STATUS_LABEL = {
	discovery: "Analyse",
	in_progress: "In Arbeit",
	review: "Abnahme",
	delivered: "Abgeschlossen",
	on_hold: "Pausiert"
};
var M_STATUS_LABEL = {
	pending: "Offen",
	in_progress: "In Arbeit",
	completed: "Erledigt"
};
var STATUS_CHIP = {
	discovery: "chip--info",
	in_progress: "chip--warning",
	review: "chip--cat-violet",
	delivered: "chip--success",
	on_hold: "chip--neutral"
};
var M_STATUS_CHIP = {
	pending: "chip--neutral",
	in_progress: "chip--warning",
	completed: "chip--success"
};
var api = apiFetch;
var fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("de-DE", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
}) : "—";
/**
* Portal project directory (ported from tds-customer-legacy-frontend's project
* views). List of the company's projects; selecting one loads its detail +
* milestone timeline. Read-only — owner management lives in the admin product.
*/
function ProjectList() {
	const [projects, setProjects] = useState(null);
	const [forbidden, setForbidden] = useState(false);
	const [error, setError] = useState(null);
	const [openId, setOpenId] = useState(null);
	const [milestones, setMilestones] = useState([]);
	const [loadingDetail, setLoadingDetail] = useState(false);
	useEffect(() => {
		api("/projects").then((r) => {
			if (r.status === 403) {
				setForbidden(true);
				return { projects: [] };
			}
			if (!r.ok) throw new Error(String(r.status));
			return r.json();
		}).then((d) => setProjects(d.projects ?? [])).catch(() => setError("Projekte konnten nicht geladen werden."));
	}, []);
	async function toggle(id) {
		if (openId === id) {
			setOpenId(null);
			return;
		}
		setOpenId(id);
		setLoadingDetail(true);
		try {
			const r = await api(`/projects/${id}`);
			const d = r.ok ? await r.json() : { milestones: [] };
			setMilestones(d.milestones ?? []);
		} catch {
			setMilestones([]);
		} finally {
			setLoadingDetail(false);
		}
	}
	if (forbidden) return /* @__PURE__ */ jsx("p", {
		className: "marginalia",
		children: "Kein Zugriff auf Projekte."
	});
	if (error && projects === null) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: error
	});
	if (projects === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (projects.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "marginalia",
		children: "Noch keine Projekte."
	});
	return /* @__PURE__ */ jsx("ul", {
		className: "project-list",
		children: projects.map((p) => /* @__PURE__ */ jsxs("li", {
			className: "tds-card",
			children: [/* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "btn btn-ghost tds-row tds-row--between",
				onClick: () => toggle(p.id),
				"aria-expanded": openId === p.id,
				children: [/* @__PURE__ */ jsx("span", {
					className: "project-card__title",
					children: p.title
				}), /* @__PURE__ */ jsx("span", {
					className: `chip ${STATUS_CHIP[p.status] ?? "chip--neutral"}`,
					children: STATUS_LABEL[p.status] ?? p.status
				})]
			}), openId === p.id && /* @__PURE__ */ jsxs("div", {
				className: "tds-stack",
				children: [
					p.description && /* @__PURE__ */ jsx("p", {
						className: "project-card__desc",
						children: p.description
					}),
					/* @__PURE__ */ jsxs("dl", {
						className: "project-card__dates",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Start" }), /* @__PURE__ */ jsx("dd", { children: fmtDate(p.start_date) })] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Ziel" }), /* @__PURE__ */ jsx("dd", { children: fmtDate(p.target_date) })] })]
					}),
					/* @__PURE__ */ jsx("h4", { children: "Meilensteine" }),
					loadingDetail ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : milestones.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Keine Meilensteine."
					}) : /* @__PURE__ */ jsx("ol", {
						className: "tds-list",
						children: milestones.map((m) => /* @__PURE__ */ jsxs("li", {
							className: "tds-list__row",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "milestone__title",
									children: m.title
								}),
								/* @__PURE__ */ jsx("span", {
									className: `chip ${M_STATUS_CHIP[m.status] ?? "chip--neutral"}`,
									children: M_STATUS_LABEL[m.status] ?? m.status
								}),
								/* @__PURE__ */ jsx("time", { children: fmtDate(m.due_date) })
							]
						}, m.id))
					})
				]
			})]
		}, p.id))
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-projects/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Projekte</h1></div>${renderComponent($$result, "ProjectList", ProjectList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/islands/ProjectList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/projects.astro
var projects_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Projects,
	file: () => $$file,
	url: () => void 0
});
var $$Projects = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Projekte" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/projects.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/projects.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/projects@_@astro
var page = () => projects_exports;
//#endregion
export { page };
