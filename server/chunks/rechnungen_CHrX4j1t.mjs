import { Q as __exportAll, a as renderComponent, f as renderTemplate, o as Fragment$2, p as maybeRenderHead } from "./server_hnGLdWvx.mjs";
import { t as createComponent } from "./compiler_ClrasJXf.mjs";
import { g as ConfirmDialog, j as toast, k as apiFetch, t as $$Layout, x as Spinner } from "./Layout_BX35BL1S.mjs";
import { n as AnimatedList, t as AnimatedItem } from "./chunk-ERSKINIL_CZs-OmSg.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-billing/islands/BillingAdmin.tsx
var api = apiFetch;
var euros = (cents, currency) => new Intl.NumberFormat("de-DE", {
	style: "currency",
	currency
}).format(cents / 100);
var STATUS_LABEL = {
	draft: "Entwurf",
	open: "Offen",
	paid: "Bezahlt",
	void: "Storniert"
};
/** `2026-10-07…` → `07.10.2026`, without a time-zone round trip. */
var day = (iso) => iso.slice(0, 10).split("-").reverse().join(".");
function BillingAdmin() {
	const [invoices, setInvoices] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [status, setStatus] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [customerId, setCustomerId] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [items, setItems] = useState([{
		description: "",
		quantity: "1",
		amount: ""
	}]);
	/**
	* The customer directory (tds-ext-customers), for names instead of ids. The
	* list used to print "12" in the Kunde column and the form asked for a
	* "Kunden-ID" nobody knows by heart. `null` = the directory is not composed
	* or not reachable — the form then falls back to the number field, because
	* this extension deliberately has no hard dependency on customers.
	*/
	const [companies, setCompanies] = useState(null);
	const load = async () => {
		const res = await api("/admin/invoices").catch(() => null);
		if (res === null) {
			setStatus("Rechnungen konnten nicht geladen werden — die API ist nicht erreichbar.");
			setLoaded(true);
			return;
		}
		if (res.ok) setInvoices((await res.json()).invoices ?? []);
		else setStatus(res.status === 403 ? "Nur für Administratoren." : `Rechnungen konnten nicht geladen werden (HTTP ${res.status}).`);
		setLoaded(true);
	};
	useEffect(() => {
		load();
		(async () => {
			const res = await api("/admin/customers").catch(() => null);
			if (!res?.ok) return;
			const data = await res.json().catch(() => null);
			if (Array.isArray(data?.customers)) setCompanies(data.customers);
		})();
	}, []);
	const companyName = (id) => id === null ? "—" : companies?.find((c) => c.id === id)?.name ?? `Firma #${id}`;
	const setItem = (i, patch) => setItems((prev) => prev.map((it, idx) => idx === i ? {
		...it,
		...patch
	} : it));
	const create = async () => {
		const payloadItems = items.filter((it) => it.description.trim() !== "" && Number(it.amount) > 0).map((it) => ({
			description: it.description.trim(),
			quantity: Math.max(1, Number(it.quantity) || 1),
			unit_amount_cents: Math.round(Number(it.amount) * 100)
		}));
		if (payloadItems.length === 0) {
			setStatus("Mindestens eine Position mit Betrag angeben.");
			return;
		}
		const res = await api("/admin/invoices", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				customer_id: customerId.trim() === "" ? null : Number(customerId),
				description,
				due_date: dueDate || null,
				items: payloadItems
			})
		}).catch(() => null);
		if (res === null) {
			toast.danger("Entwurf konnte nicht erstellt werden — die API ist nicht erreichbar.");
			return;
		}
		if (res.ok) {
			setShowForm(false);
			setCustomerId("");
			setDescription("");
			setDueDate("");
			setItems([{
				description: "",
				quantity: "1",
				amount: ""
			}]);
			setStatus(null);
			toast.success("Entwurf erstellt.");
			load();
		} else toast.danger(`Entwurf konnte nicht erstellt werden (HTTP ${res.status}).`);
	};
	const send = async (id) => {
		const res = await api(`/admin/invoices/${id}/send`, { method: "POST" }).catch(() => null);
		if (res === null) {
			toast.danger("Senden fehlgeschlagen — die API ist nicht erreichbar.");
			load();
			return;
		}
		const d = await res.json().catch(() => ({}));
		if (res.ok) toast.success("An Stripe gesendet.");
		else toast.danger(`Senden fehlgeschlagen: ${d.error ?? `HTTP ${res.status}`}`);
		load();
	};
	const confirmRemove = async () => {
		const inv = pendingDelete;
		if (!inv) return;
		setDeleting(true);
		try {
			const res = await api(`/admin/invoices/${inv.id}`, { method: "DELETE" });
			setPendingDelete(null);
			if (res.ok) {
				toast.success("Rechnung gelöscht.");
				load();
			} else toast.danger(`Löschen fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			setPendingDelete(null);
			toast.danger("Löschen fehlgeschlagen — die API ist nicht erreichbar.");
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
			showForm ? /* @__PURE__ */ jsxs("div", {
				className: "tds-card tds-stack",
				children: [
					/* @__PURE__ */ jsx("h4", { children: "Neue Rechnung" }),
					companies ? /* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Kunde" }), /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: customerId,
							onChange: (e) => setCustomerId(e.target.value),
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "— ohne Kunde —"
							}), companies.map((c) => /* @__PURE__ */ jsx("option", {
								value: String(c.id),
								children: c.name
							}, c.id))]
						})]
					}) : /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "number",
						placeholder: "Kunden-ID (optional)",
						"aria-label": "Kunden-ID",
						value: customerId,
						onChange: (e) => setCustomerId(e.target.value)
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						placeholder: "Beschreibung (optional)",
						"aria-label": "Beschreibung",
						value: description,
						onChange: (e) => setDescription(e.target.value)
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Fällig am" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "date",
							value: dueDate,
							onChange: (e) => setDueDate(e.target.value)
						})]
					}),
					/* @__PURE__ */ jsx("h5", { children: "Positionen" }),
					/* @__PURE__ */ jsx(AnimatedList, {
						as: "div",
						children: items.map((it, i) => /* @__PURE__ */ jsxs(AnimatedItem, {
							as: "div",
							className: "tds-toolbar",
							children: [
								/* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									type: "text",
									placeholder: "Beschreibung",
									"aria-label": "Positionsbeschreibung",
									value: it.description,
									onChange: (e) => setItem(i, { description: e.target.value })
								}),
								/* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									type: "number",
									min: "1",
									placeholder: "Menge",
									"aria-label": "Menge",
									value: it.quantity,
									onChange: (e) => setItem(i, { quantity: e.target.value })
								}),
								/* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									type: "number",
									min: "0",
									step: "0.01",
									placeholder: "Einzelpreis €",
									"aria-label": "Einzelpreis",
									value: it.amount,
									onChange: (e) => setItem(i, { amount: e.target.value })
								})
							]
						}, i))
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => setItems((p) => [...p, {
							description: "",
							quantity: "1",
							amount: ""
						}]),
						children: "+ Position"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: create,
							children: "Entwurf erstellen"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setShowForm(false),
							children: "Abbrechen"
						})]
					})
				]
			}) : /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-primary self-start",
				onClick: () => setShowForm(true),
				children: "Neue Rechnung"
			}),
			/* @__PURE__ */ jsxs("table", {
				className: "tds-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Datum" }),
					/* @__PURE__ */ jsx("th", { children: "Kunde" }),
					/* @__PURE__ */ jsx("th", { children: "Betrag" }),
					/* @__PURE__ */ jsx("th", { children: "Status" }),
					/* @__PURE__ */ jsx("th", {})
				] }) }), /* @__PURE__ */ jsxs("tbody", { children: [invoices.map((inv) => /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", {
						className: "tabular-nums",
						children: day(inv.created_at)
					}),
					/* @__PURE__ */ jsx("td", { children: companyName(inv.customer_id) }),
					/* @__PURE__ */ jsx("td", {
						className: "tabular-nums",
						children: euros(inv.total_cents, inv.currency)
					}),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("span", {
						className: "tds-toolbar",
						children: [STATUS_LABEL[inv.status] ?? inv.status, inv.hosted_invoice_url ? /* @__PURE__ */ jsx("a", {
							className: "btn btn-ghost",
							href: inv.hosted_invoice_url,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": `Rechnung #${inv.id} bei Stripe öffnen (neuer Tab)`,
							children: "Stripe ↗"
						}) : null]
					}) }),
					/* @__PURE__ */ jsx("td", { children: inv.status === "draft" ? /* @__PURE__ */ jsxs("span", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: () => void send(inv.id),
							children: "Senden"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setPendingDelete(inv),
							children: "Löschen"
						})]
					}) : null })
				] }, inv.id)), invoices.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 5,
					className: "opacity-70",
					children: "Noch keine Rechnungen."
				}) }) : null] })]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: `Rechnung #${pendingDelete?.id ?? ""} löschen?`,
				message: "Der Rechnungsentwurf und alle Positionen werden dauerhaft entfernt.",
				busy: deleting,
				onConfirm: () => void confirmRemove(),
				onCancel: () => setPendingDelete(null)
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-billing/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Rechnungen</h1></div>${renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<p class="tds-page__lede">Rechnungen erstellen, an Stripe senden und den Zahlungsstatus verfolgen.</p>${renderComponent($$result, "BillingAdmin", BillingAdmin, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/islands/BillingAdmin.tsx",
		"client:component-export": "default"
	})}` })}`}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/rechnungen.astro
var rechnungen_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Rechnungen,
	file: () => $$file,
	url: () => void 0
});
var $$Rechnungen = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Rechnungen" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/rechnungen.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/rechnungen.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/rechnungen@_@astro
var page = () => rechnungen_exports;
//#endregion
export { page };
