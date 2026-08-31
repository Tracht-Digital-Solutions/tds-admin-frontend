import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, g as ConfirmDialog, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-projects/islands/ProjectsAdmin.tsx
var P_STATUS = [
	"discovery",
	"in_progress",
	"review",
	"delivered",
	"on_hold"
];
var M_STATUS = [
	"pending",
	"in_progress",
	"completed"
];
var P_LABEL = {
	discovery: "Analyse",
	in_progress: "In Arbeit",
	review: "Abnahme",
	delivered: "Abgeschlossen",
	on_hold: "Pausiert"
};
var M_LABEL = {
	pending: "Offen",
	in_progress: "In Arbeit",
	completed: "Erledigt"
};
var P_CHIP = {
	discovery: "chip--info",
	in_progress: "chip--warning",
	review: "chip--cat-violet",
	delivered: "chip--success",
	on_hold: "chip--neutral"
};
var M_CHIP = {
	pending: "chip--neutral",
	in_progress: "chip--warning",
	completed: "chip--success"
};
var api = (path, init) => apiFetch(path, {
	headers: { "Content-Type": "application/json" },
	...init
});
var emptyProject = () => ({
	title: "",
	customer_id: "",
	status: "discovery",
	start_date: "",
	target_date: "",
	description: ""
});
/**
* Owner project management (admin-only, gated by projects:manage). Lists all
* projects across companies and drives the admin CRUD routes in ProjectsModule:
* create/edit/delete projects and their milestones. Renders in the admin product
* only (customers lack projects:manage, so the nav/route is hidden for them).
*/
function ProjectsAdmin() {
	const [projects, setProjects] = useState(null);
	const [error, setError] = useState(null);
	const [form, setForm] = useState(emptyProject());
	const [editingId, setEditingId] = useState(null);
	const [busy, setBusy] = useState(false);
	const [msDraft, setMsDraft] = useState({});
	const [pendingDelete, setPendingDelete] = useState(null);
	const [pendingMilestone, setPendingMilestone] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const load = () => api("/admin/projects").then((r) => r.ok ? r.json() : Promise.reject(new Error(String(r.status)))).then((d) => setProjects(d.projects ?? [])).catch(() => setError("Projekte konnten nicht geladen werden."));
	useEffect(() => {
		load();
	}, []);
	async function saveProject(e) {
		e.preventDefault();
		if (!form.title.trim() || !editingId && !String(form.customer_id).trim()) return;
		setBusy(true);
		try {
			const r = await api(editingId ? `/admin/projects/${editingId}` : "/admin/projects", {
				method: editingId ? "PATCH" : "POST",
				body: JSON.stringify({
					...form,
					customer_id: Number(form.customer_id)
				})
			});
			if (!r.ok) throw new Error(String(r.status));
			const wasEditing = editingId !== null;
			setForm(emptyProject());
			setEditingId(null);
			await load();
			toast.success(wasEditing ? "Projekt gespeichert." : "Projekt angelegt.");
		} catch (e) {
			toast.danger(`Speichern fehlgeschlagen (HTTP ${e instanceof Error ? e.message : "?"}).`);
		} finally {
			setBusy(false);
		}
	}
	function editProject(p) {
		setEditingId(p.id);
		setForm({
			title: p.title,
			customer_id: String(p.customer_id),
			status: p.status,
			start_date: p.start_date ?? "",
			target_date: p.target_date ?? "",
			description: ""
		});
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
	async function confirmDeleteProject() {
		const p = pendingDelete;
		if (!p) return;
		setDeleting(true);
		try {
			const r = await api(`/admin/projects/${p.id}`, { method: "DELETE" });
			setPendingDelete(null);
			await load();
			if (r.ok) toast.success(`„${p.title}" gelöscht.`);
			else toast.danger(`Löschen fehlgeschlagen (HTTP ${r.status}).`);
		} catch {
			setPendingDelete(null);
			toast.danger("Löschen fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setDeleting(false);
		}
	}
	async function addMilestone(projectId) {
		const title = (msDraft[projectId] ?? "").trim();
		if (!title) return;
		try {
			const r = await api(`/admin/projects/${projectId}/milestones`, {
				method: "POST",
				body: JSON.stringify({ title })
			});
			if (r.ok) {
				setMsDraft((d) => ({
					...d,
					[projectId]: ""
				}));
				toast.success("Meilenstein hinzugefügt.");
			} else toast.danger(`Meilenstein konnte nicht angelegt werden (HTTP ${r.status}).`);
		} catch {
			toast.danger("Meilenstein konnte nicht angelegt werden — die API ist nicht erreichbar.");
		} finally {
			await load();
		}
	}
	async function cycleMilestone(m) {
		const next = M_STATUS[(M_STATUS.indexOf(m.status) + 1) % M_STATUS.length];
		try {
			const r = await api(`/admin/milestones/${m.id}`, {
				method: "PATCH",
				body: JSON.stringify({
					title: m.title,
					status: next,
					due_date: m.due_date
				})
			});
			if (!r.ok) toast.danger(`Status konnte nicht geändert werden (HTTP ${r.status}).`);
		} catch {
			toast.danger("Status konnte nicht geändert werden — die API ist nicht erreichbar.");
		} finally {
			await load();
		}
	}
	async function confirmDeleteMilestone() {
		const m = pendingMilestone;
		if (!m) return;
		setDeleting(true);
		try {
			const r = await api(`/admin/milestones/${m.id}`, { method: "DELETE" });
			setPendingMilestone(null);
			await load();
			if (r.ok) toast.success("Meilenstein gelöscht.");
			else toast.danger(`Löschen fehlgeschlagen (HTTP ${r.status}).`);
		} catch {
			setPendingMilestone(null);
			toast.danger("Löschen fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setDeleting(false);
		}
	}
	if (error && projects === null) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: error
	});
	if (projects === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			error && /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "tds-stack tds-card",
				onSubmit: saveProject,
				children: [
					/* @__PURE__ */ jsx("h3", { children: editingId ? `Projekt #${editingId} bearbeiten` : "Neues Projekt" }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: ["Titel", /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									value: form.title,
									onChange: (e) => setForm({
										...form,
										title: e.target.value
									}),
									maxLength: 200,
									required: true
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: ["Kunde (customer_id)", /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									type: "number",
									value: form.customer_id,
									onChange: (e) => setForm({
										...form,
										customer_id: e.target.value
									}),
									disabled: editingId !== null,
									required: !editingId
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: ["Status", /* @__PURE__ */ jsx("select", {
									className: "field-boxed",
									value: form.status,
									onChange: (e) => setForm({
										...form,
										status: e.target.value
									}),
									children: P_STATUS.map((s) => /* @__PURE__ */ jsx("option", {
										value: s,
										children: P_LABEL[s]
									}, s))
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: ["Start", /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									type: "date",
									value: form.start_date,
									onChange: (e) => setForm({
										...form,
										start_date: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: ["Ziel", /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									type: "date",
									value: form.target_date,
									onChange: (e) => setForm({
										...form,
										target_date: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: ["Beschreibung", /* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							value: form.description,
							onChange: (e) => setForm({
								...form,
								description: e.target.value
							}),
							rows: 2
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn btn-primary",
							disabled: busy,
							"aria-busy": busy,
							children: editingId ? "Speichern" : "Anlegen"
						}), editingId && /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => {
								setEditingId(null);
								setForm(emptyProject());
							},
							children: "Abbrechen"
						})]
					})
				]
			}),
			projects.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch keine Projekte."
			}) : /* @__PURE__ */ jsx("ul", {
				className: "tds-list",
				children: projects.map((p) => /* @__PURE__ */ jsxs("li", {
					className: "tds-card",
					children: [/* @__PURE__ */ jsxs("header", {
						className: "tds-row tds-row--between",
						children: [
							/* @__PURE__ */ jsx("strong", { children: p.title }),
							/* @__PURE__ */ jsx("span", {
								className: `chip ${P_CHIP[p.status] ?? "chip--neutral"}`,
								children: P_LABEL[p.status] ?? p.status
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "marginalia",
								children: ["Kunde #", p.customer_id]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "tds-toolbar",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => editProject(p),
									children: "Bearbeiten"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-danger",
									onClick: () => setPendingDelete(p),
									children: "Löschen"
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "tds-stack",
						children: [/* @__PURE__ */ jsx("ol", { children: (p.milestones ?? []).map((m) => /* @__PURE__ */ jsxs("li", { children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: `chip ${M_CHIP[m.status] ?? "chip--neutral"}`,
								onClick: () => cycleMilestone(m),
								title: "Status wechseln",
								children: M_LABEL[m.status]
							}),
							/* @__PURE__ */ jsx("span", { children: m.title }),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-danger",
								onClick: () => setPendingMilestone(m),
								"aria-label": "Meilenstein löschen",
								children: "×"
							})
						] }, m.id)) }), /* @__PURE__ */ jsxs("div", {
							className: "tds-toolbar",
							children: [/* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								"aria-label": "Neuer Meilenstein",
								value: msDraft[p.id] ?? "",
								onChange: (e) => setMsDraft((d) => ({
									...d,
									[p.id]: e.target.value
								})),
								placeholder: "Meilenstein hinzufügen …",
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addMilestone(p.id);
									}
								}
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-primary",
								onClick: () => addMilestone(p.id),
								"aria-label": "Meilenstein hinzufügen",
								children: "+"
							})]
						})]
					})]
				}, p.id))
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingMilestone !== null,
				title: `Meilenstein „${pendingMilestone?.title ?? ""}“ löschen?`,
				busy: deleting,
				onConfirm: () => void confirmDeleteMilestone(),
				onCancel: () => setPendingMilestone(null)
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: `Projekt „${pendingDelete?.title ?? ""}“ löschen?`,
				message: "Alle Meilensteine des Projekts werden mitgelöscht.",
				busy: deleting,
				onConfirm: () => void confirmDeleteProject(),
				onCancel: () => setPendingDelete(null)
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-projects/pages/AdminIndex.astro
var $$AdminIndex = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Projekte verwalten</h1></div>${renderComponent($$result, "ProjectsAdmin", ProjectsAdmin, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/islands/ProjectsAdmin.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/pages/AdminIndex.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/admin_projects.astro
var admin_projects_exports = /* @__PURE__ */ __exportAll({
	default: () => $$AdminProjects,
	file: () => $$file,
	url: () => void 0
});
var $$AdminProjects = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Projekte verwalten" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$AdminIndex, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/admin_projects.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/admin_projects.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/admin_projects@_@astro
var page = () => admin_projects_exports;
//#endregion
export { page };
