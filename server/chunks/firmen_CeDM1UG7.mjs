import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, g as ConfirmDialog, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-customers/islands/CustomersList.tsx
var api = apiFetch;
var empty = {
	name: "",
	email: "",
	phone: "",
	note: ""
};
/** Customer/company directory CRUD (list + create + inline edit + delete). */
function CustomersList() {
	const [customers, setCustomers] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [editing, setEditing] = useState(null);
	const [form, setForm] = useState(empty);
	const [status, setStatus] = useState(null);
	const [pendingDelete, setPendingDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const load = async () => {
		const res = await api("/companies");
		if (res.ok) {
			const body = await res.json();
			setCustomers(body.companies ?? body.customers ?? []);
		} else setStatus(res.status === 401 || res.status === 403 ? "Keine Berechtigung." : `Fehler (HTTP ${res.status}).`);
		setLoaded(true);
	};
	useEffect(() => {
		load();
	}, []);
	const startNew = () => {
		setForm(empty);
		setEditing("new");
		setStatus(null);
	};
	const startEdit = (c) => {
		setForm({
			name: c.name,
			email: c.email ?? "",
			phone: c.phone ?? "",
			note: c.note ?? ""
		});
		setEditing(c.id);
		setStatus(null);
	};
	const save = async () => {
		if (form.name.trim() === "") {
			setStatus("Name ist erforderlich.");
			return;
		}
		const isNew = editing === "new";
		const res = await api(isNew ? "/companies" : `/companies/${editing}`, {
			method: isNew ? "POST" : "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form)
		});
		if (res.ok) {
			setEditing(null);
			toast.success(isNew ? "Firma angelegt." : "Firma gespeichert.");
			load();
		} else if (res.status === 409) setStatus("E-Mail bereits vergeben.");
		else {
			const d = await res.json().catch(() => ({}));
			toast.danger(`Speichern fehlgeschlagen: ${d.error ?? `HTTP ${res.status}`}`);
		}
	};
	const confirmRemove = async () => {
		const c = pendingDelete;
		if (!c) return;
		setDeleting(true);
		try {
			const res = await api(`/companies/${c.id}`, { method: "DELETE" });
			setPendingDelete(null);
			if (res.ok) {
				toast.success(`„${c.name}" gelöscht.`);
				load();
			} else toast.danger(`Löschen fehlgeschlagen (HTTP ${res.status}).`);
		} finally {
			setDeleting(false);
		}
	};
	if (!loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			editing !== null ? /* @__PURE__ */ jsxs("div", {
				className: "tds-card tds-stack",
				children: [
					/* @__PURE__ */ jsx("h4", { children: editing === "new" ? "Neue Firma" : "Firma bearbeiten" }),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						placeholder: "Name / Firma",
						"aria-label": "Name / Firma",
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "email",
						placeholder: "E-Mail (optional)",
						"aria-label": "E-Mail",
						value: form.email,
						onChange: (e) => setForm({
							...form,
							email: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						placeholder: "Telefon (optional)",
						"aria-label": "Telefon",
						value: form.phone,
						onChange: (e) => setForm({
							...form,
							phone: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						placeholder: "Notiz (optional)",
						"aria-label": "Notiz",
						value: form.note,
						onChange: (e) => setForm({
							...form,
							note: e.target.value
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: save,
							children: "Speichern"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setEditing(null),
							children: "Abbrechen"
						})]
					})
				]
			}) : /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-primary",
				onClick: startNew,
				children: "Neue Firma"
			}),
			/* @__PURE__ */ jsxs("table", {
				className: "tds-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Name" }),
					/* @__PURE__ */ jsx("th", { children: "E-Mail" }),
					/* @__PURE__ */ jsx("th", { children: "Telefon" }),
					/* @__PURE__ */ jsx("th", {})
				] }) }), /* @__PURE__ */ jsxs("tbody", { children: [customers.map((c) => /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", { children: c.name }),
					/* @__PURE__ */ jsx("td", { children: c.email ?? "—" }),
					/* @__PURE__ */ jsx("td", { children: c.phone ?? "—" }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("span", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => startEdit(c),
							children: "Bearbeiten"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setPendingDelete(c),
							children: "Löschen"
						})]
					}) })
				] }, c.id)), customers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 4,
					className: "opacity-70",
					children: "Noch keine Firmen."
				}) }) : null] })]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: `Firma „${pendingDelete?.name ?? ""}“ löschen?`,
				message: "Mitgliedschaften, Projekte und Rechnungen dieser Firma verlieren ihre Zuordnung.",
				busy: deleting,
				onConfirm: () => void confirmRemove(),
				onCancel: () => setPendingDelete(null)
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-customers/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Firmen</h1></div><p class="tds-page__lede">Das zentrale Firmenverzeichnis — Grundlage für Zugänge, Abrechnung und Portal.</p>${renderComponent($$result, "CustomersList", CustomersList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-customers/islands/CustomersList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-customers/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/firmen.astro
var firmen_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Firmen,
	file: () => $$file,
	url: () => void 0
});
var $$Firmen = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Firmen" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/firmen.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/firmen.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/firmen@_@astro
var page = () => firmen_exports;
//#endregion
export { page };
