import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsManage.tsx
var api$1 = apiFetch;
/**
* Tool-catalog management: one row per tool (enabled / login / premium / price),
* saved to the backend which refreshes the affected public pages. The tool list
* is owned by the public site's composed packs. Pairing gives that site a
* resource-bound key; its server then synchronises the built catalog on first
* start and whenever the catalog hash changes.
*/
function ToolsManage() {
	const [tools, setTools] = useState(null);
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(null);
	const load = async () => {
		const res = await api$1("/admin/tools");
		if (!res.ok) {
			setError(res.status === 401 || res.status === 403 ? "Nur für Administratoren." : `Fehler (HTTP ${res.status}).`);
			setTools([]);
			return;
		}
		const d = await res.json();
		setTools(d.tools ?? []);
		setError(null);
	};
	useEffect(() => {
		load();
	}, []);
	const patch = (id, patch) => setTools((prev) => prev?.map((t) => t.tool_id === id ? {
		...t,
		...patch
	} : t) ?? prev);
	const save = async (tool) => {
		setBusy(tool.tool_id);
		const res = await api$1(`/admin/tools/${encodeURIComponent(tool.tool_id)}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				enabled: tool.enabled,
				requires_login: tool.requires_login,
				is_premium: tool.is_premium,
				price_cents: tool.price_cents,
				sort_order: tool.sort_order
			})
		});
		setBusy(null);
		if (res.ok) {
			const body = await res.json().catch(() => ({}));
			if (body.cache_status === "refreshed" && body.cached === true) toast.success(`„${tool.name}“ gespeichert — Seiten-Cache aktualisiert.`);
			else if (body.cache_status === "not_configured") toast.warning(`„${tool.name}“ gespeichert — Tools-Site noch nicht verbunden.`);
			else toast.warning(`„${tool.name}“ gespeichert — Cache-Aktualisierung fehlgeschlagen.`);
		} else toast.danger(`„${tool.name}“ konnte nicht gespeichert werden (HTTP ${res.status}).`);
	};
	if (tools === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (error) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: error
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "tools-manage space-y-4",
		children: [/* @__PURE__ */ jsxs("p", {
			className: "text-sm opacity-70",
			children: [tools.length, " Tool(s)"]
		}), tools.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "tds-empty",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "font-semibold",
					children: "Noch keine Tools synchronisiert."
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2",
					children: "Verbinden Sie die Tools-Site unter Einstellungen → Tools mit der API. Der veröffentlichte Katalog wird danach beim Serverstart automatisch über den Site-Key synchronisiert."
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2",
					children: /* @__PURE__ */ jsx("a", {
						href: "/einstellungen",
						children: "Verbindung einrichten"
					})
				})
			]
		}) : /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs("table", {
				className: "tds-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Tool" }),
					/* @__PURE__ */ jsx("th", { children: "Sichtbar" }),
					/* @__PURE__ */ jsx("th", { children: "Login" }),
					/* @__PURE__ */ jsx("th", { children: "Premium" }),
					/* @__PURE__ */ jsx("th", { children: "Preis (€)" }),
					/* @__PURE__ */ jsx("th", {})
				] }) }), /* @__PURE__ */ jsx("tbody", { children: tools.map((t) => /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsxs("td", { children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: t.name
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-xs opacity-60",
						children: [
							t.tool_id,
							" · ",
							t.category
						]
					})] }),
					/* @__PURE__ */ jsx("td", {
						className: "text-center",
						children: /* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: t.enabled,
							onChange: (e) => patch(t.tool_id, { enabled: e.target.checked }),
							"aria-label": "Sichtbar"
						})
					}),
					/* @__PURE__ */ jsx("td", {
						className: "text-center",
						children: /* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: t.requires_login,
							onChange: (e) => patch(t.tool_id, { requires_login: e.target.checked }),
							"aria-label": "Login erforderlich"
						})
					}),
					/* @__PURE__ */ jsx("td", {
						className: "text-center",
						children: /* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: t.is_premium,
							onChange: (e) => patch(t.tool_id, { is_premium: e.target.checked }),
							"aria-label": "Premium"
						})
					}),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", {
						type: "number",
						min: "0",
						step: "0.01",
						className: "field-boxed w-24",
						value: (t.price_cents / 100).toFixed(2),
						onChange: (e) => patch(t.tool_id, { price_cents: Math.max(0, Math.round(Number(e.target.value) * 100)) }),
						disabled: !t.is_premium
					}) }),
					/* @__PURE__ */ jsx("td", {
						className: "text-right",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: () => save(t),
							disabled: busy === t.tool_id,
							"aria-busy": busy === t.tool_id,
							children: "Speichern"
						})
					})
				] }, t.tool_id)) })]
			})
		})]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolGuides.tsx
var api = apiFetch;
var EMPTY = {
	name: "",
	description: "",
	seo_title: "",
	seo_description: "",
	intro: [],
	use_cases: [],
	steps: [],
	faq: [],
	related: [],
	privacy: ""
};
/**
* The tool pages' text, edited in the panel.
*
* ### Everything here is an OVERRIDE, and the empty state is the normal state
*
* The tool list, the German manifest copy and the guides committed in
* `tds-tools-frontend/src/content/guides` remain the source of truth. A field
* left blank means "use the text that shipped with the site", which is why
* this form opens empty even for a tool whose page is full of prose — and why
* clearing a field is how you take an edit back. Saying so in the interface
* matters: an editor who reads an empty *Einleitung* as "there is no intro"
* will paste one in and quietly detach the page from the repository copy.
*
* ### Why the SEO fields carry their budgets in the label
*
* A meta description has no visible failure mode: nothing renders wrong,
* nothing errors, and an over-long tail is simply absent from a search result
* nobody is looking at. The site's own tests fail outside 80–160 characters, so
* the counter here is the earliest place the number can be seen.
*/
function ToolGuides() {
	const [tools, setTools] = useState(null);
	const [stored, setStored] = useState([]);
	const [error, setError] = useState(null);
	const [toolId, setToolId] = useState("");
	const [lang, setLang] = useState("de");
	const [draft, setDraft] = useState(EMPTY);
	const [busy, setBusy] = useState(false);
	const load = async () => {
		const [toolsRes, guidesRes] = await Promise.all([api("/admin/tools"), api("/admin/tools/guides")]);
		if (!toolsRes.ok) {
			setError(toolsRes.status === 401 || toolsRes.status === 403 ? "Nur für Administratoren." : `Tools konnten nicht geladen werden (HTTP ${toolsRes.status}).`);
			setTools([]);
			return;
		}
		const toolsData = await toolsRes.json().catch(() => ({ tools: [] }));
		const guidesData = guidesRes.ok ? await guidesRes.json().catch(() => ({ guides: [] })) : { guides: [] };
		setTools(toolsData.tools ?? []);
		setStored(guidesData.guides ?? []);
		setError(null);
	};
	useEffect(() => {
		load();
	}, []);
	useEffect(() => {
		if (!toolId) {
			setDraft(EMPTY);
			return;
		}
		const row = stored.find((g) => g.tool_id === toolId && g.lang === lang);
		setDraft(row ? {
			name: row.name ?? "",
			description: row.description ?? "",
			seo_title: row.seo_title ?? "",
			seo_description: row.seo_description ?? "",
			intro: row.intro ?? [],
			use_cases: (row.use_cases ?? []).map((u) => ({
				a: u.title,
				b: u.text
			})),
			steps: (row.steps ?? []).map((s) => ({
				a: s.title,
				b: s.description
			})),
			faq: (row.faq ?? []).map((f) => ({
				a: f.q,
				b: f.a
			})),
			related: row.related ?? [],
			privacy: row.privacy ?? ""
		} : EMPTY);
	}, [
		toolId,
		lang,
		stored
	]);
	const save = async () => {
		if (!toolId) return;
		setBusy(true);
		const res = await api(`/admin/tools/guides/${encodeURIComponent(toolId)}/${lang}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: draft.name,
				description: draft.description,
				seo_title: draft.seo_title,
				seo_description: draft.seo_description,
				intro: draft.intro.filter((p) => p.trim() !== ""),
				use_cases: draft.use_cases.filter((u) => u.a.trim() !== "").map((u) => ({
					title: u.a,
					text: u.b
				})),
				steps: draft.steps.filter((s) => s.a.trim() !== "").map((s) => ({
					title: s.a,
					description: s.b
				})),
				faq: draft.faq.filter((f) => f.a.trim() !== "").map((f) => ({
					q: f.a,
					a: f.b
				})),
				related: draft.related.filter((r) => r.trim() !== ""),
				privacy: draft.privacy
			})
		});
		setBusy(false);
		if (res.ok) {
			const body = await res.json().catch(() => ({}));
			if (body.cache_status === "refreshed" && body.cached === true) toast.success("Gespeichert — Seiten-Cache aktualisiert.");
			else if (body.cache_status === "not_configured") toast.warning("Gespeichert — Tools-Site noch nicht verbunden.");
			else toast.warning("Gespeichert — Cache-Aktualisierung fehlgeschlagen.");
			load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const reset = async () => {
		if (!toolId) return;
		setBusy(true);
		const res = await api(`/admin/tools/guides/${encodeURIComponent(toolId)}/${lang}`, { method: "DELETE" });
		setBusy(false);
		if (res.ok) {
			const body = await res.json().catch(() => ({}));
			if (body.cache_status === "refreshed" && body.cached === true) toast.success("Übersteuerung entfernt — Seiten-Cache aktualisiert.");
			else toast.warning("Übersteuerung entfernt — Cache-Aktualisierung steht noch aus.");
			setDraft(EMPTY);
			load();
		} else toast.danger(`Zurücksetzen fehlgeschlagen (HTTP ${res.status}).`);
	};
	if (tools === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (error) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: error
	});
	const hasOverride = stored.some((g) => g.tool_id === toolId && g.lang === lang);
	return /* @__PURE__ */ jsxs("div", {
		className: "tool-guides tds-stack",
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Hier steht nur, was den mitgelieferten Text ",
					/* @__PURE__ */ jsx("strong", { children: "ersetzen" }),
					" soll. Ein leeres Feld heißt „den Text aus dem Repository verwenden\" — deshalb ist dieses Formular auch bei einer Tool-Seite leer, die voller Text ist. Ein Feld zu leeren nimmt die Übersteuerung wieder zurück."
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-row",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "field",
					children: [/* @__PURE__ */ jsx("span", { children: "Tool" }), /* @__PURE__ */ jsxs("select", {
						className: "field-boxed",
						value: toolId,
						onChange: (e) => setToolId(e.target.value),
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "— auswählen —"
						}), tools.map((t) => /* @__PURE__ */ jsx("option", {
							value: t.tool_id,
							children: t.name
						}, t.tool_id))]
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "field",
					children: [/* @__PURE__ */ jsx("span", { children: "Sprache" }), /* @__PURE__ */ jsxs("select", {
						className: "field-boxed",
						value: lang,
						onChange: (e) => setLang(e.target.value),
						children: [/* @__PURE__ */ jsx("option", {
							value: "de",
							children: "Deutsch"
						}), /* @__PURE__ */ jsx("option", {
							value: "en",
							children: "English"
						})]
					})]
				})]
			}),
			toolId === "" ? /* @__PURE__ */ jsx("div", {
				className: "tds-empty",
				children: /* @__PURE__ */ jsx("p", { children: "Wählen Sie ein Tool, um seinen Text zu bearbeiten." })
			}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
				hasOverride ? /* @__PURE__ */ jsx("p", {
					className: "tds-alert",
					role: "status",
					children: "Für dieses Tool ist in dieser Sprache ein eigener Text hinterlegt."
				}) : null,
				/* @__PURE__ */ jsxs("label", {
					className: "field",
					children: [/* @__PURE__ */ jsx("span", { children: "Name" }), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: draft.name,
						onChange: (e) => setDraft({
							...draft,
							name: e.target.value
						}),
						placeholder: "leer = Name aus dem Paket"
					})]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "field",
					children: [/* @__PURE__ */ jsx("span", { children: "Kurzbeschreibung" }), /* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						rows: 2,
						value: draft.description,
						onChange: (e) => setDraft({
							...draft,
							description: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "field",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"SEO-Titel (",
						draft.seo_title.length,
						"/60)"
					] }), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: draft.seo_title,
						onChange: (e) => setDraft({
							...draft,
							seo_title: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "field",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"SEO-Beschreibung (",
						draft.seo_description.length,
						", Ziel 80–160)"
					] }), /* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						rows: 2,
						value: draft.seo_description,
						onChange: (e) => setDraft({
							...draft,
							seo_description: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ jsx(StringList, {
					label: "Einleitung (Absätze)",
					itemLabel: "Absatz",
					multiline: true,
					values: draft.intro,
					onChange: (intro) => setDraft({
						...draft,
						intro
					})
				}),
				/* @__PURE__ */ jsx(PairList, {
					label: "Anwendungsfälle",
					itemLabel: "Anwendungsfall",
					aLabel: "Situation",
					bLabel: "Text",
					values: draft.use_cases,
					onChange: (use_cases) => setDraft({
						...draft,
						use_cases
					})
				}),
				/* @__PURE__ */ jsx(PairList, {
					label: "Schritte",
					itemLabel: "Schritt",
					aLabel: "Titel",
					bLabel: "Beschreibung",
					hint: "Diese Schritte erscheinen auch als HowTo-Auszeichnung für Suchmaschinen. Sie müssen zu dem passen, was auf der Seite steht.",
					values: draft.steps,
					onChange: (steps) => setDraft({
						...draft,
						steps
					})
				}),
				/* @__PURE__ */ jsx(PairList, {
					label: "Häufige Fragen",
					itemLabel: "Frage",
					aLabel: "Frage",
					bLabel: "Antwort",
					hint: "Auch diese werden als FAQ-Auszeichnung ausgeliefert. Google verwirft das Ergebnis, wenn die Antwort dort von der sichtbaren abweicht.",
					values: draft.faq,
					onChange: (faq) => setDraft({
						...draft,
						faq
					})
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "field",
					children: [/* @__PURE__ */ jsx("span", { children: "Datenschutzhinweis" }), /* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						rows: 3,
						value: draft.privacy,
						onChange: (e) => setDraft({
							...draft,
							privacy: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ jsx(StringList, {
					label: "Verwandte Tools (Slugs)",
					itemLabel: "Slug",
					values: draft.related,
					onChange: (related) => setDraft({
						...draft,
						related
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "tds-row",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-primary",
						onClick: save,
						disabled: busy,
						"aria-busy": busy,
						children: "Speichern"
					}), hasOverride ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: reset,
						disabled: busy,
						children: "Auf mitgelieferten Text zurücksetzen"
					}) : null]
				})
			] })
		]
	});
}
/** A repeatable list of single strings. */
function StringList({ label, itemLabel, values, onChange, multiline = false }) {
	const set = (i, v) => onChange(values.map((x, n) => n === i ? v : x));
	return /* @__PURE__ */ jsxs("fieldset", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("legend", { children: label }),
			values.map((v, i) => /* @__PURE__ */ jsxs("div", {
				className: "tds-row",
				children: [multiline ? /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					rows: 2,
					value: v,
					onChange: (e) => set(i, e.target.value),
					"aria-label": `${itemLabel} ${i + 1}`
				}) : /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					value: v,
					onChange: (e) => set(i, e.target.value),
					"aria-label": `${itemLabel} ${i + 1}`
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => onChange(values.filter((_, n) => n !== i)),
					children: "Entfernen"
				})]
			}, i)),
			/* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => onChange([...values, ""]),
				children: [itemLabel, " hinzufügen"]
			})
		]
	});
}
/** A repeatable list of two-field rows — steps, use cases and FAQ share it. */
function PairList({ label, itemLabel, aLabel, bLabel, hint, values, onChange }) {
	const set = (i, patch) => onChange(values.map((x, n) => n === i ? {
		...x,
		...patch
	} : x));
	return /* @__PURE__ */ jsxs("fieldset", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("legend", { children: label }),
			hint ? /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: hint
			}) : null,
			values.map((v, i) => /* @__PURE__ */ jsxs("div", {
				className: "tds-stack",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "tds-row",
					children: [/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: v.a,
						onChange: (e) => set(i, { a: e.target.value }),
						"aria-label": `${aLabel} ${i + 1}`,
						placeholder: aLabel
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => onChange(values.filter((_, n) => n !== i)),
						children: "Entfernen"
					})]
				}), /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					rows: 2,
					value: v.b,
					onChange: (e) => set(i, { b: e.target.value }),
					"aria-label": `${bLabel} ${i + 1}`,
					placeholder: bLabel
				})]
			}, i)),
			/* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => onChange([...values, {
					a: "",
					b: ""
				}]),
				children: [itemLabel, " hinzufügen"]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-tools/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Tools</h1></div><p class="text-sm opacity-70">Steuere den öffentlichen Tools-Katalog (tools.tracht-digital.de): sichtbar, Login-Pflicht, Premium und Preis je Tool. Änderungen lösen einen Rebuild der Website aus.</p>${renderComponent($$result, "ToolsManage", ToolsManage, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsManage.tsx",
		"client:component-export": "default"
	})}<div class="tds-settings-section"><h2 class="tds-page__title">Texte der Tool-Seiten</h2><p class="text-sm opacity-70">Name, Beschreibung, SEO-Felder und der Ratgeber unter jedem Werkzeug — Einleitung, Anwendungsfälle, Schritte, häufige Fragen und der Datenschutzhinweis. Gespeicherte Texte <strong>ersetzen</strong> den im Repository mitgelieferten; ein leeres Feld nimmt die Übersteuerung zurück. Nach dem Speichern wird der Seiten-Cache der betroffenen Tool-Seite neu gebaut, ein Deploy ist dafür nicht nötig.</p>${renderComponent($$result, "ToolGuides", ToolGuides, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolGuides.tsx",
		"client:component-export": "default"
	})}</div></section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/tools_verwaltung.astro
var tools_verwaltung_exports = /* @__PURE__ */ __exportAll({
	default: () => $$ToolsVerwaltung,
	file: () => $$file,
	url: () => void 0
});
var $$ToolsVerwaltung = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tools" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/tools_verwaltung.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/tools_verwaltung.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/tools_verwaltung@_@astro
var page = () => tools_verwaltung_exports;
//#endregion
export { page };
