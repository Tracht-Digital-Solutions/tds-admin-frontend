import { Z as __exportAll, d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_d-ZXef0y.mjs";
import { t as createComponent } from "./compiler_6xhkfg2O.mjs";
import { t as $$Layout, x as Spinner } from "./Layout_Bgah88_2.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { t as resolveChipVariant } from "./design_BN6Rm8xF.mjs";
import { t as toast } from "./toast_CwStKRcr.mjs";
import { useCallback, useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/OrderList.tsx
var STATUS_LABEL = {
	pending: "Offen",
	paid: "Bezahlt",
	refunded: "Erstattet",
	failed: "Fehlgeschlagen"
};
var euro = (cents, currency) => {
	try {
		return new Intl.NumberFormat("de-DE", {
			style: "currency",
			currency
		}).format(cents / 100);
	} catch {
		return `${(cents / 100).toFixed(2)} ${currency}`;
	}
};
var date = (iso) => {
	if (!iso) return "—";
	const t = Date.parse(iso.replace(" ", "T") + (iso.endsWith("Z") ? "" : "Z"));
	return Number.isNaN(t) ? "—" : new Intl.DateTimeFormat("de-DE", {
		dateStyle: "short",
		timeStyle: "short"
	}).format(t);
};
/**
* Orders for TDS's own digital service packages.
*
* Two things this screen shows that are not decoration:
*
* 1. **Paid but not yet delivered** is the working queue. These are services,
*    not downloads — nothing is delivered automatically, so an order sits here
*    until somebody does the work and says so. That is why "Als erbracht
*    markieren" exists and why the widget counts `open` rather than `paid`.
* 2. **The withdrawal confirmation is shown with its wording**, not as a tick.
*    § 356 Abs. 4 BGB makes the sentence the customer agreed to the thing that
*    has to be provable, and that sentence changes over the years — so each
*    order carries its own copy, and this is where you read it back.
*/
function OrderList() {
	const [orders, setOrders] = useState(null);
	const [error, setError] = useState(null);
	const [busyId, setBusyId] = useState(null);
	const [expanded, setExpanded] = useState(null);
	const load = useCallback(async () => {
		try {
			const res = await apiFetch("/shop/orders");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json = await res.json();
			setOrders(json.orders);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unbekannter Fehler");
			setOrders([]);
		}
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	const fulfil = async (order) => {
		setBusyId(order.id);
		try {
			const res = await apiFetch(`/shop/orders/${order.id}/fulfil`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({})
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			toast.success(`${order.order_no} als erbracht markiert.`);
			await load();
		} catch (err) {
			toast.danger(`Fehlgeschlagen (${err instanceof Error ? err.message : "unbekannt"}).`);
		} finally {
			setBusyId(null);
		}
	};
	if (orders === null) return /* @__PURE__ */ jsx(Spinner, {});
	const open = orders.filter((o) => o.status === "paid" && !o.fulfilled_at).length;
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		error ? /* @__PURE__ */ jsxs("div", {
			className: "tds-alert tds-alert--danger",
			children: ["Bestellungen konnten nicht geladen werden: ", error]
		}) : null,
		open > 0 ? /* @__PURE__ */ jsxs("div", {
			className: "tds-alert tds-alert--warning",
			children: [
				open,
				" bezahlte ",
				open === 1 ? "Bestellung wartet" : "Bestellungen warten",
				" auf Erbringung. Diese Produkte sind Leistungen — es wird nichts automatisch ausgeliefert."
			]
		}) : null,
		orders.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "tds-empty",
			children: "Noch keine Bestellungen."
		}) : /* @__PURE__ */ jsxs("table", {
			className: "tds-table",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("th", { children: "Nummer" }),
				/* @__PURE__ */ jsx("th", { children: "Datum" }),
				/* @__PURE__ */ jsx("th", { children: "Kunde" }),
				/* @__PURE__ */ jsx("th", { children: "Leistung" }),
				/* @__PURE__ */ jsx("th", { children: "Brutto" }),
				/* @__PURE__ */ jsx("th", { children: "Status" }),
				/* @__PURE__ */ jsx("th", {})
			] }) }), /* @__PURE__ */ jsx("tbody", { children: orders.flatMap((order) => [/* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => setExpanded(expanded === order.id ? null : order.id),
					"aria-expanded": expanded === order.id,
					children: order.order_no
				}) }),
				/* @__PURE__ */ jsx("td", { children: date(order.created_at) }),
				/* @__PURE__ */ jsxs("td", { children: [
					order.name ?? "—",
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsx("small", { children: order.email })
				] }),
				/* @__PURE__ */ jsx("td", { children: order.items ?? "—" }),
				/* @__PURE__ */ jsx("td", { children: euro(order.gross_cents, order.currency) }),
				/* @__PURE__ */ jsxs("td", { children: [
					/* @__PURE__ */ jsx("span", {
						className: `chip ${resolveChipVariant(order.status === "paid" ? "success" : order.status === "refunded" ? "warning" : "neutral")}`,
						children: STATUS_LABEL[order.status]
					}),
					order.fulfilled_at ? /* @__PURE__ */ jsxs(Fragment$1, { children: [" ", /* @__PURE__ */ jsx("span", {
						className: `chip ${resolveChipVariant("info")}`,
						children: "Erbracht"
					})] }) : null,
					order.status === "paid" && order.invoice_status === "ok" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [" ", /* @__PURE__ */ jsx("span", {
						className: `chip ${resolveChipVariant("success")}`,
						children: order.invoice_number ? `RE ${order.invoice_number}` : "Rechnung"
					})] }) : null,
					order.status === "paid" && order.invoice_status === "failed" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [" ", /* @__PURE__ */ jsx("span", {
						className: `chip ${resolveChipVariant("danger")}`,
						title: order.invoice_error ?? void 0,
						children: "Rechnung fehlgeschlagen"
					})] }) : null
				] }),
				/* @__PURE__ */ jsx("td", { children: order.status === "paid" && !order.fulfilled_at ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					disabled: busyId === order.id,
					"aria-busy": busyId === order.id,
					onClick: () => void fulfil(order),
					children: "Als erbracht markieren"
				}) : null })
			] }, order.id), expanded === order.id ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
				colSpan: 7,
				children: /* @__PURE__ */ jsxs("small", { children: [
					"Widerruf bestätigt: ",
					date(order.withdrawal_consent_at),
					/* @__PURE__ */ jsx("br", {}),
					"„",
					order.withdrawal_consent_text ?? "—",
					"\"",
					/* @__PURE__ */ jsx("br", {}),
					"Netto ",
					euro(order.net_cents, order.currency),
					" · USt",
					" ",
					euro(order.tax_cents, order.currency),
					" · ",
					order.country
				] })
			}) }, `${order.id}-detail`) : null]) })]
		})
	] });
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/pages/Orders.astro
var $$Orders = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Bestellungen</h1></div>${renderComponent($$result, "OrderList", OrderList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/OrderList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/pages/Orders.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/shop_bestellungen.astro
var shop_bestellungen_exports = /* @__PURE__ */ __exportAll({
	default: () => $$ShopBestellungen,
	file: () => $$file,
	url: () => void 0
});
var $$ShopBestellungen = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Panel" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Orders, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/shop_bestellungen.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/shop_bestellungen.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/shop_bestellungen@_@astro
var page = () => shop_bestellungen_exports;
//#endregion
export { page };
