import { a as renderComponent, et as __exportAll, f as renderTemplate, p as maybeRenderHead } from "./server_Cdzh4AE6.mjs";
import { n as createComponent } from "./compiler_CX02AaCz.mjs";
import { C as Spinner, G as formatDate, k as apiFetch, t as $$Layout, w as StatusChip } from "./Layout_D80p1pEh.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { n as PROJECT_STATUS, t as MILESTONE_STATUS } from "./statuses_CPssjI6f.mjs";
import { n as AnimatedList, r as Collapse, t as AnimatedItem } from "./chunk-ERSKINIL_BaF4IMQk.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-ext-projects/islands/ProjectList.tsx
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
		apiFetch("/projects").then((r) => {
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
			const r = await apiFetch(`/projects/${id}`);
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
	if (error && projects === null) return /* @__PURE__ */ jsx(Alert, { children: error });
	if (projects === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (projects.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "marginalia",
		children: "Noch keine Projekte."
	});
	return /* @__PURE__ */ jsx(AnimatedList, {
		className: "project-list",
		children: projects.map((p) => /* @__PURE__ */ jsxs(AnimatedItem, {
			className: "tds-card",
			children: [/* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "btn btn-ghost tds-row tds-row--between",
				onClick: () => toggle(p.id),
				"aria-expanded": openId === p.id,
				children: [/* @__PURE__ */ jsx("span", {
					className: "project-card__title",
					children: p.title
				}), /* @__PURE__ */ jsx(StatusChip, {
					status: p.status,
					map: PROJECT_STATUS
				})]
			}), /* @__PURE__ */ jsx(Collapse, {
				open: openId === p.id,
				children: /* @__PURE__ */ jsxs("div", {
					className: "tds-stack",
					children: [
						p.description && /* @__PURE__ */ jsx("p", {
							className: "project-card__desc",
							children: p.description
						}),
						/* @__PURE__ */ jsxs("dl", {
							className: "project-card__dates",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Start" }), /* @__PURE__ */ jsx("dd", { children: formatDate(p.start_date) })] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Ziel" }), /* @__PURE__ */ jsx("dd", { children: formatDate(p.target_date) })] })]
						}),
						/* @__PURE__ */ jsx("h4", { children: "Meilensteine" }),
						loadingDetail ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : milestones.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "marginalia",
							children: "Keine Meilensteine."
						}) : /* @__PURE__ */ jsx(AnimatedList, {
							as: "ol",
							className: "tds-list",
							children: milestones.map((m) => /* @__PURE__ */ jsxs(AnimatedItem, {
								className: "tds-list__row",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "milestone__title",
										children: m.title
									}),
									/* @__PURE__ */ jsx(StatusChip, {
										status: m.status,
										map: MILESTONE_STATUS
									}),
									/* @__PURE__ */ jsx("time", { children: formatDate(m.due_date) })
								]
							}, m.id))
						})
					]
				})
			})]
		}, p.id))
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-projects/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Projekte</h1></div>${renderComponent($$result, "ProjectList", ProjectList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/islands/ProjectList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/pages/Index.astro", void 0);
// node_modules/.tds-frontend/routes/projects.astro
var projects_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Projects,
	file: () => $$file,
	url: () => void 0
});
var $$Projects = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Projekte" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/projects.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/projects.astro";
// \0virtual:astro:page:node_modules/.tds-frontend/routes/projects@_@astro
var page = () => projects_exports;
export { page };
