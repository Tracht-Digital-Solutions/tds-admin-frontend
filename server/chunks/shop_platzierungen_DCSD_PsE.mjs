import { Z as __exportAll, d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_d-ZXef0y.mjs";
import { t as createComponent } from "./compiler_6xhkfg2O.mjs";
import { t as $$Layout, x as Spinner } from "./Layout_Bgah88_2.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { t as resolveChipVariant } from "./design_BN6Rm8xF.mjs";
import { t as toast } from "./toast_CwStKRcr.mjs";
import { useCallback, useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/PlacementManager.tsx
var SURFACE_LABEL = {
	blog: "Journal",
	panel: "Kundenportal",
	shop: "TDShop"
};
var STRATEGY_LABEL = {
	manual: "Von Hand bestückt",
	category: "Nach Kategorie",
	tag: "Nach Schlagwort",
	auto: "Automatisch (neueste)"
};
/**
* The advertising slots.
*
* The keys are seeded rather than created here, and that is on purpose: the
* consuming code names them in markup — the journal asks for
* `blog-article-end`, the portal widget for `panel-dashboard`. A slot invented
* in this screen would have nowhere to appear, and a missing one is not an
* error anywhere (the endpoint answers with an empty slot), so the feature
* would look like it works and show nothing. Editing, not creating, is
* therefore the whole job here.
*/
function PlacementManager() {
	const [placements, setPlacements] = useState(null);
	const [error, setError] = useState(null);
	const [savingKey, setSavingKey] = useState(null);
	const load = useCallback(async () => {
		try {
			const res = await apiFetch("/shop/placements");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json = await res.json();
			setPlacements(json.placements);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unbekannter Fehler");
			setPlacements([]);
		}
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	const patch = async (placement, fields) => {
		setSavingKey(placement.key);
		try {
			const res = await apiFetch(`/shop/placements/${placement.key}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(fields)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			toast.success(`„${placement.label}" gespeichert.`);
			await load();
		} catch (err) {
			toast.danger(`Speichern fehlgeschlagen (${err instanceof Error ? err.message : "unbekannt"}).`);
		} finally {
			setSavingKey(null);
		}
	};
	if (placements === null) return /* @__PURE__ */ jsx(Spinner, {});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		error ? /* @__PURE__ */ jsxs("div", {
			className: "tds-alert tds-alert--danger",
			children: ["Platzierungen konnten nicht geladen werden: ", error]
		}) : null,
		/* @__PURE__ */ jsxs("div", {
			className: "tds-alert tds-alert--info",
			children: [
				"Jede Platzierung wird als ",
				/* @__PURE__ */ jsx("strong", { children: "Anzeige" }),
				" gekennzeichnet. Die Kennzeichnung wird von der API mitgeliefert und lässt sich hier nicht abschalten — sie ist eine Rechtspflicht, keine Einstellung."
			]
		}),
		placements.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "tds-empty",
			children: "Keine Platzierungen vorhanden."
		}) : /* @__PURE__ */ jsx("ul", {
			className: "tds-list",
			children: placements.map((placement) => /* @__PURE__ */ jsxs("li", {
				className: "tds-list__row",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("strong", { children: placement.label }),
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsx("code", { children: placement.key }),
						" ",
						/* @__PURE__ */ jsx("span", {
							className: `chip ${resolveChipVariant("neutral")}`,
							children: SURFACE_LABEL[placement.surface]
						}),
						" ",
						/* @__PURE__ */ jsx("span", {
							className: `chip ${resolveChipVariant(placement.active ? "success" : "neutral")}`,
							children: placement.active ? "Aktiv" : "Aus"
						})
					] }),
					/* @__PURE__ */ jsxs("label", { children: ["Auswahl", /* @__PURE__ */ jsx("select", {
						className: "field-boxed",
						value: placement.strategy,
						disabled: savingKey === placement.key,
						onChange: (e) => void patch(placement, { strategy: e.target.value }),
						children: Object.keys(STRATEGY_LABEL).map((s) => /* @__PURE__ */ jsx("option", {
							value: s,
							children: STRATEGY_LABEL[s]
						}, s))
					})] }),
					/* @__PURE__ */ jsxs("label", { children: ["Anzahl", /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "number",
						min: 1,
						max: 12,
						defaultValue: placement.max_items,
						disabled: savingKey === placement.key,
						onBlur: (e) => {
							const next = Number(e.target.value);
							if (next !== placement.max_items) patch(placement, { max_items: next });
						}
					})] }),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: savingKey === placement.key,
						"aria-busy": savingKey === placement.key,
						onClick: () => void patch(placement, { active: placement.active ? 0 : 1 }),
						children: placement.active ? "Ausschalten" : "Einschalten"
					})
				]
			}, placement.key))
		})
	] });
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/pages/Placements.astro
var $$Placements = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Platzierungen</h1></div>${renderComponent($$result, "PlacementManager", PlacementManager, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/PlacementManager.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/pages/Placements.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/shop_platzierungen.astro
var shop_platzierungen_exports = /* @__PURE__ */ __exportAll({
	default: () => $$ShopPlatzierungen,
	file: () => $$file,
	url: () => void 0
});
var $$ShopPlatzierungen = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Panel" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Placements, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/shop_platzierungen.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/shop_platzierungen.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/shop_platzierungen@_@astro
var page = () => shop_platzierungen_exports;
//#endregion
export { page };
