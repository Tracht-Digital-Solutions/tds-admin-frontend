import { Q as __exportAll, a as renderComponent, f as renderTemplate, p as maybeRenderHead } from "./server_hnGLdWvx.mjs";
import { t as createComponent } from "./compiler_ClrasJXf.mjs";
import { a as API_BASE, j as toast, l as frontendFetch, t as $$Layout, x as Spinner } from "./Layout_BX35BL1S.mjs";
import { useCallback, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/lib/setupStatus.ts
var pending = null;
var fetchedAt = 0;
/**
* Shared for a few seconds only: long enough for the banner, the page and the
* settings markers of ONE page load to share a request, short enough that a
* client-side navigation after changing a setting asks again. Module state
* survives the ClientRouter's page swaps, so an unbounded cache would show the
* state from before the change.
*/
var SHARE_MS = 5e3;
/** The current status, or null when the API is unreachable or answered badly. */
function loadSetupStatus(fresh = false) {
	if (fresh || pending === null || Date.now() - fetchedAt > SHARE_MS) {
		fetchedAt = Date.now();
		pending = (async () => {
			try {
				const res = await frontendFetch(`${API_BASE}/me/setup-status`);
				if (!res.ok) return null;
				const json = await res.json();
				return Array.isArray(json.items) ? {
					items: json.items,
					open: Number(json.open ?? 0)
				} : null;
			} catch {
				return null;
			}
		})();
	}
	return pending;
}
/** Store one choice. Throws with the HTTP status on failure, for the toast. */
async function chooseSetup(id, action) {
	if (!/^[a-z0-9-]+:[a-z0-9_.-]+$/.test(id)) throw new Error("invalid id");
	const res = await frontendFetch(`${API_BASE}/me/setup-status/${id}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ action })
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	pending = null;
}
/** Still to do: not set up, and neither put off nor ignored. */
var isOpen = (item) => item.state !== "ok" && !item.snoozed && !item.ignored;
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/SetupWizard.tsx
var LEVEL = {
	required: {
		label: "Nötig",
		chip: "chip--danger"
	},
	recommended: {
		label: "Empfohlen",
		chip: "chip--warning"
	},
	optional: {
		label: "Optional",
		chip: "chip--neutral"
	}
};
var STATE = {
	ok: {
		label: "Eingerichtet",
		chip: "chip--success"
	},
	partial: {
		label: "Teilweise",
		chip: "chip--warning"
	},
	missing: {
		label: "Nicht eingerichtet",
		chip: "chip--danger"
	}
};
var DONE_TOAST = {
	snooze: "Verschoben — die Erinnerung kommt bei der nächsten Anmeldung wieder.",
	ignore: "Ignoriert. Unter „Ignoriert“ lässt sich das zurückholen.",
	restore: "Wieder in der Liste."
};
/**
* The Einrichtungsassistent (`/einrichtung`).
*
* Four groups, in the order an operator works through them: what is still
* open, what was put off until the next sign-in, what is done, what was
* ignored. Every open item has the same three ways forward — set it up now,
* later, or never — because "unconfigured" is silent everywhere else in the
* system and the operator must be able to decide about each one explicitly.
*
* "Einrichten" is a plain link: the setting itself lives where it always
* lived (mostly a section of /einstellungen), so there is one place to edit
* it and the wizard can never drift from it.
*/
function SetupWizard() {
	const [status, setStatus] = useState(void 0);
	const [busy, setBusy] = useState(null);
	const load = useCallback(async (fresh = false) => {
		setStatus(await loadSetupStatus(fresh));
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	const choose = async (item, action) => {
		setBusy(item.id);
		try {
			await chooseSetup(item.id, action);
			toast.success(DONE_TOAST[action]);
			await load(true);
			window.dispatchEvent(new CustomEvent("tds:setup-changed"));
		} catch (err) {
			toast.danger(`Speichern fehlgeschlagen (${err instanceof Error ? err.message : "unbekannt"}).`);
		} finally {
			setBusy(null);
		}
	};
	if (status === void 0) return /* @__PURE__ */ jsx(Spinner, {});
	if (status === null) return /* @__PURE__ */ jsx("div", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: "Der Einrichtungsstand konnte nicht geladen werden. Bitte später erneut versuchen."
	});
	const open = status.items.filter(isOpen);
	const later = status.items.filter((i) => i.state !== "ok" && i.snoozed && !i.ignored);
	const done = status.items.filter((i) => i.state === "ok" && !i.ignored);
	const ignored = status.items.filter((i) => i.ignored);
	const row = (item) => {
		const level = LEVEL[item.level];
		const state = STATE[item.state];
		const isBusy = busy === item.id;
		return /* @__PURE__ */ jsxs("li", {
			className: "tds-list__row",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "tds-stack tds-stack--tight",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "tds-row",
					children: [
						/* @__PURE__ */ jsx("strong", { children: item.title }),
						/* @__PURE__ */ jsx("span", {
							className: `chip ${state.chip}`,
							children: state.label
						}),
						item.state !== "ok" ? /* @__PURE__ */ jsx("span", {
							className: `chip ${level.chip}`,
							children: level.label
						}) : null
					]
				}), item.state !== "ok" && item.description ? /* @__PURE__ */ jsx("p", {
					className: "marginalia",
					children: item.description
				}) : null]
			}), /* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [
					item.state !== "ok" && !item.ignored ? /* @__PURE__ */ jsx("a", {
						className: "btn btn-primary",
						href: item.href,
						children: "Einrichten"
					}) : null,
					item.state !== "ok" && !item.snoozed && !item.ignored ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: isBusy,
						"aria-busy": isBusy,
						onClick: () => void choose(item, "snooze"),
						children: "Später"
					}) : null,
					item.state !== "ok" && !item.ignored ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: isBusy,
						"aria-busy": isBusy,
						onClick: () => void choose(item, "ignore"),
						children: "Ignorieren"
					}) : null,
					item.ignored || item.snoozed ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: isBusy,
						"aria-busy": isBusy,
						onClick: () => void choose(item, "restore"),
						children: "Zurückholen"
					}) : null
				]
			})]
		}, item.id);
	};
	const group = (title, items, hint) => items.length > 0 ? /* @__PURE__ */ jsxs("section", {
		className: "tds-card tds-stack",
		"aria-label": title,
		children: [
			/* @__PURE__ */ jsxs("h2", { children: [
				title,
				" (",
				items.length,
				")"
			] }),
			hint ? /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: hint
			}) : null,
			/* @__PURE__ */ jsx("ul", {
				className: "tds-list",
				children: items.map(row)
			})
		]
	}) : null;
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--loose",
		children: [
			open.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "tds-alert tds-alert--success",
				children: "Alles Nötige ist eingerichtet oder bewusst zurückgestellt."
			}) : null,
			group("Offen", open, "„Später“ blendet einen Punkt bis zur nächsten Anmeldung aus, „Ignorieren“ dauerhaft."),
			group("Später", later, "Kommt bei der nächsten Anmeldung wieder."),
			group("Eingerichtet", done),
			group("Ignoriert", ignored)
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einrichtung.astro
var einrichtung_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Einrichtung,
	file: () => $$file,
	url: () => $$url
});
var $$Einrichtung = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Einrichtung" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Konfiguration</p><h1 class="tds-page__title">Einrichtung</h1><p class="tds-page__lede">Was im System noch nicht eingerichtet ist. Nicht eingerichtete Funktionen melden keinen Fehler, sie tun einfach nichts — deshalb stehen sie hier.</p></div></div>${renderComponent($$result, "SetupWizard", SetupWizard, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/SetupWizard.tsx",
		"client:component-export": "default"
	})}</section>` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einrichtung.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einrichtung.astro";
var $$url = "/einrichtung";
//#endregion
//#region \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einrichtung@_@astro
var page = () => einrichtung_exports;
//#endregion
export { page };
