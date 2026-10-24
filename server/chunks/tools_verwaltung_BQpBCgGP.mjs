import { a as renderComponent, et as __exportAll, f as renderTemplate, p as maybeRenderHead } from "./server_Cdzh4AE6.mjs";
import { n as createComponent } from "./compiler_CX02AaCz.mjs";
import { B as toast, C as Spinner, H as centsToEuroInput, M as describeFailureFrom, N as sendJson, W as formatCents, Y as parseEuros, j as describeFailure, k as apiFetch, t as $$Layout, v as ConfirmDialog } from "./Layout_D80p1pEh.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { a as Presence, r as Collapse } from "./chunk-ERSKINIL_BaF4IMQk.mjs";
import { useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsManage.tsx
/** "DE + EN", "nur DE" or "nur EN": which tool pages will show the article. */
function articleLangs(a) {
	return a.de && a.en ? "DE + EN" : a.de ? "nur DE" : "nur EN";
}
/**
* Tool-catalog management: one row per tool (enabled / login / premium /
* Ratgeber article),
* saved to the backend which refreshes the affected public pages. The tool list
* is owned by the public site's composed packs. Pairing gives that site a
* resource-bound key; its server then synchronises the built catalog on first
* start and whenever the catalog hash changes.
*
* Prices are no longer set per tool: premium tools are sold as monthly
* stages (ToolsTiers). `price_cents` is still sent back unchanged so an old
* value is never zeroed by a save.
*
* The Ratgeber article comes from the blog CMS's public lists (German and
* English, one slug for both) when that extension is composed; each option
* says in which languages it exists, because the English tool page shows the
* English version and links to the Ratgeber when there is none; without it (404, network) the field is a plain
* slug input, and the tool page simply links to the blog.
*/
function ToolsManage() {
	const [tools, setTools] = useState(null);
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(null);
	const [articles, setArticles] = useState(null);
	const loadArticles = async () => {
		const list = async (lang) => {
			const res = await apiFetch(`/content/blog?lang=${lang}&limit=100`).catch(() => null);
			if (res === null || !res.ok) return null;
			const d = await res.json().catch(() => ({}));
			return Array.isArray(d.posts) ? d.posts.map((p) => ({
				slug: String(p.slug),
				title: String(p.title)
			})) : [];
		};
		const [de, en] = await Promise.all([list("de"), list("en")]);
		if (de === null && en === null) return;
		const merged = /* @__PURE__ */ new Map();
		for (const p of de ?? []) merged.set(p.slug, {
			slug: p.slug,
			title: p.title,
			de: true,
			en: false
		});
		for (const p of en ?? []) {
			const known = merged.get(p.slug);
			if (known) known.en = true;
			else merged.set(p.slug, {
				slug: p.slug,
				title: p.title,
				de: false,
				en: true
			});
		}
		if (merged.size > 0) setArticles([...merged.values()]);
	};
	const load = async () => {
		const res = await apiFetch("/admin/tools").catch(() => null);
		if (res === null) {
			setError("Tools konnten nicht geladen werden — die API ist nicht erreichbar.");
			setTools([]);
			return;
		}
		if (!res.ok) {
			setError(res.status === 401 || res.status === 403 ? "Nur für Administratoren." : `Fehler (HTTP ${res.status}).`);
			setTools([]);
			return;
		}
		const d = await res.json();
		setTools((d.tools ?? []).map((t) => ({
			...t,
			blog_slug: t.blog_slug ?? null
		})));
		setError(null);
		loadArticles();
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
		const res = await sendJson(`/admin/tools/${encodeURIComponent(tool.tool_id)}`, "PUT", {
			enabled: tool.enabled,
			requires_login: tool.requires_login,
			is_premium: tool.is_premium,
			price_cents: tool.price_cents,
			blog_slug: tool.blog_slug ?? "",
			sort_order: tool.sort_order
		}).catch(() => null);
		setBusy(null);
		if (res === null) {
			toast.danger(`„${tool.name}“ konnte nicht gespeichert werden — die API ist nicht erreichbar.`);
			return;
		}
		if (res.ok) {
			const body = await res.json().catch(() => ({}));
			if (body.cache_status === "refreshed" && body.cached === true) toast.success(`„${tool.name}“ gespeichert — Seiten-Cache aktualisiert.`);
			else if (body.cache_status === "not_configured") toast.warning(`„${tool.name}“ gespeichert — Tools-Site noch nicht verbunden.`);
			else toast.warning(`„${tool.name}“ gespeichert — Cache-Aktualisierung fehlgeschlagen.`);
		} else toast.danger(`„${tool.name}“ konnte nicht gespeichert werden (HTTP ${res.status}).`);
	};
	if (tools === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (error) return /* @__PURE__ */ jsx(Alert, { children: error });
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
					/* @__PURE__ */ jsx("th", { children: "Ratgeber-Artikel" }),
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
							"aria-label": `${t.name}: sichtbar`
						})
					}),
					/* @__PURE__ */ jsx("td", {
						className: "text-center",
						children: /* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: t.requires_login,
							onChange: (e) => patch(t.tool_id, { requires_login: e.target.checked }),
							"aria-label": `${t.name}: Login erforderlich`
						})
					}),
					/* @__PURE__ */ jsx("td", {
						className: "text-center",
						children: /* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: t.is_premium,
							onChange: (e) => patch(t.tool_id, { is_premium: e.target.checked }),
							"aria-label": `${t.name}: Premium`
						})
					}),
					/* @__PURE__ */ jsx("td", { children: articles !== null ? /* @__PURE__ */ jsxs("select", {
						"aria-label": `${t.name}: Ratgeber-Artikel`,
						className: "field-boxed",
						value: t.blog_slug ?? "",
						onChange: (e) => patch(t.tool_id, { blog_slug: e.target.value || null }),
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "",
								children: "— kein Artikel —"
							}),
							t.blog_slug && !articles.some((a) => a.slug === t.blog_slug) ? /* @__PURE__ */ jsxs("option", {
								value: t.blog_slug,
								children: [t.blog_slug, " (nicht veröffentlicht)"]
							}) : null,
							articles.map((a) => /* @__PURE__ */ jsxs("option", {
								value: a.slug,
								children: [
									a.title,
									" · ",
									articleLangs(a)
								]
							}, a.slug))
						]
					}) : /* @__PURE__ */ jsx("input", {
						"aria-label": `${t.name}: Ratgeber-Artikel`,
						type: "text",
						className: "field-boxed w-48",
						placeholder: "artikel-slug",
						value: t.blog_slug ?? "",
						onChange: (e) => patch(t.tool_id, { blog_slug: e.target.value.trim().toLowerCase() || null })
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
// node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolGuides.tsx
var EMPTY$1 = {
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
	const [draft, setDraft] = useState(EMPTY$1);
	const [busy, setBusy] = useState(false);
	const load = async () => {
		const both = await Promise.all([apiFetch("/admin/tools"), apiFetch("/admin/tools/guides")]).catch(() => null);
		if (both === null) {
			setError("Tools konnten nicht geladen werden — die API ist nicht erreichbar.");
			setTools([]);
			return;
		}
		const [toolsRes, guidesRes] = both;
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
			setDraft(EMPTY$1);
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
		} : EMPTY$1);
	}, [
		toolId,
		lang,
		stored
	]);
	const save = async () => {
		if (!toolId) return;
		setBusy(true);
		const res = await apiFetch(`/admin/tools/guides/${encodeURIComponent(toolId)}/${lang}`, {
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
		}).catch(() => null);
		setBusy(false);
		if (res === null) {
			toast.danger("Speichern fehlgeschlagen — die API ist nicht erreichbar.");
			return;
		}
		if (res.ok) {
			const body = await res.json().catch(() => ({}));
			if (body.cache_status === "refreshed" && body.cached === true) toast.success("Gespeichert — Seiten-Cache aktualisiert.");
			else if (body.cache_status === "not_configured") toast.warning("Gespeichert — Tools-Site noch nicht verbunden.");
			else toast.warning("Gespeichert — Cache-Aktualisierung fehlgeschlagen.");
			load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const [confirmReset, setConfirmReset] = useState(false);
	const reset = async () => {
		if (!toolId) return;
		setBusy(true);
		const res = await apiFetch(`/admin/tools/guides/${encodeURIComponent(toolId)}/${lang}`, { method: "DELETE" }).catch(() => null);
		setBusy(false);
		if (res === null) {
			toast.danger("Zurücksetzen fehlgeschlagen — die API ist nicht erreichbar.");
			return;
		}
		if (res.ok) {
			const body = await res.json().catch(() => ({}));
			if (body.cache_status === "refreshed" && body.cached === true) toast.success("Übersteuerung entfernt — Seiten-Cache aktualisiert.");
			else toast.warning("Übersteuerung entfernt — Cache-Aktualisierung steht noch aus.");
			setDraft(EMPTY$1);
			load();
		} else toast.danger(`Zurücksetzen fehlgeschlagen (HTTP ${res.status}).`);
	};
	if (tools === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (error) return /* @__PURE__ */ jsx(Alert, { children: error });
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
			/* @__PURE__ */ jsx(Presence, {
				view: toolId === "" ? "none" : `${toolId}-${lang}`,
				children: toolId === "" ? /* @__PURE__ */ jsx("div", {
					className: "tds-empty",
					children: /* @__PURE__ */ jsx("p", { children: "Wählen Sie ein Tool, um seinen Text zu bearbeiten." })
				}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx(Collapse, {
						open: hasOverride,
						children: /* @__PURE__ */ jsx(Alert, {
							tone: "neutral",
							children: "Für dieses Tool ist in dieser Sprache ein eigener Text hinterlegt."
						})
					}),
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
							onClick: () => setConfirmReset(true),
							disabled: busy,
							children: "Auf mitgelieferten Text zurücksetzen"
						}) : null]
					})
				] })
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: confirmReset,
				title: "Auf mitgelieferten Text zurücksetzen?",
				message: "Der im Panel geschriebene Ratgeber für diese Sprache wird gelöscht; die Seite zeigt wieder den Text aus dem Tool-Paket.",
				confirmLabel: "Zurücksetzen",
				busy,
				onConfirm: () => {
					setConfirmReset(false);
					reset();
				},
				onCancel: () => setConfirmReset(false)
			})
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
// node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsTiers.tsx
/** The studio is a free tool whose Premium is a feature unlock; a stage can sell it too. */
var STUDIO = "design-system-studio";
var EMPTY = {
	id: null,
	slug: "",
	name: "",
	name_en: "",
	tagline: "",
	tagline_en: "",
	features: "",
	features_en: "",
	price: "",
	tool_ids: [],
	active: true,
	highlight: false,
	sort_order: 0
};
var toDraft = (t) => ({
	id: t.id,
	slug: t.slug,
	name: t.name,
	name_en: t.name_en ?? "",
	tagline: t.tagline ?? "",
	tagline_en: t.tagline_en ?? "",
	features: t.features.join("\n"),
	features_en: t.features_en.join("\n"),
	price: centsToEuroInput(t.price_cents),
	tool_ids: t.tool_ids,
	active: t.active,
	highlight: t.highlight,
	sort_order: t.sort_order
});
/**
* The premium stages (`/tools-verwaltung`): name, FIXED monthly price, the
* advertising copy in both languages and the tools each stage unlocks. The
* public site shows exactly these prices; Stripe bills them monthly.
*
* - The price is typed in euros and sent in cents (`parseEuros`). A typo is
*   refused in the form, never rounded into a different price.
* - Nothing is saved until "Speichern". A price change applies to new
*   subscriptions; running ones keep the price they started with — said in
*   the form, because it is the one surprise here.
* - A stage with subscriptions cannot be deleted (the API answers 409); it is
*   taken off sale with "Im Verkauf".
*/
function ToolsTiers() {
	const [tiers, setTiers] = useState(null);
	const [tools, setTools] = useState([]);
	const [currency, setCurrency] = useState("EUR");
	const [error, setError] = useState(null);
	const [draft, setDraft] = useState(null);
	const [formError, setFormError] = useState(null);
	const [busy, setBusy] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(null);
	const load = async () => {
		const res = await apiFetch("/admin/tools/tiers").catch(() => null);
		if (res === null || !res.ok) {
			setError(describeFailure(res, "Premium-Stufen konnten nicht geladen werden", { adminOnly: true }));
			setTiers([]);
			return;
		}
		const d = await res.json().catch(() => ({}));
		setTiers(d.tiers ?? []);
		setCurrency(typeof d.currency === "string" ? d.currency : "EUR");
		setError(null);
	};
	const loadTools = async () => {
		const res = await apiFetch("/admin/tools").catch(() => null);
		if (res === null || !res.ok) return;
		const d = await res.json().catch(() => ({}));
		setTools(d.tools ?? []);
	};
	useEffect(() => {
		load();
		loadTools();
	}, []);
	const set = (patch) => setDraft((prev) => prev ? {
		...prev,
		...patch
	} : prev);
	const toggleTool = (id) => setDraft((prev) => prev ? {
		...prev,
		tool_ids: prev.tool_ids.includes(id) ? prev.tool_ids.filter((t) => t !== id) : [...prev.tool_ids, id]
	} : prev);
	const save = async () => {
		if (!draft) return;
		setFormError(null);
		const cents = parseEuros(draft.price);
		if (draft.name.trim() === "") return setFormError("Bitte einen Namen angeben.");
		if (cents === null || cents < 50) return setFormError("Bitte einen Monatspreis von mindestens 0,50 € angeben (z. B. 9,90).");
		if (draft.tool_ids.length === 0) return setFormError("Bitte mindestens ein Werkzeug auswählen.");
		setBusy(true);
		const payload = {
			slug: draft.slug.trim(),
			name: draft.name.trim(),
			name_en: draft.name_en.trim(),
			tagline: draft.tagline.trim(),
			tagline_en: draft.tagline_en.trim(),
			features: draft.features.split("\n"),
			features_en: draft.features_en.split("\n"),
			price_cents: cents,
			tool_ids: draft.tool_ids,
			active: draft.active,
			highlight: draft.highlight,
			sort_order: draft.sort_order
		};
		const res = await (draft.id === null ? sendJson("/admin/tools/tiers", "POST", payload) : sendJson(`/admin/tools/tiers/${draft.id}`, "PUT", payload)).catch(() => null);
		setBusy(false);
		if (res === null || !res.ok) {
			setFormError(await describeFailureFrom(res, "Speichern fehlgeschlagen"));
			return;
		}
		toast.success(`Stufe „${payload.name}“ gespeichert.`);
		setDraft(null);
		await load();
	};
	const remove = async () => {
		const tier = pendingDelete;
		if (!tier) return;
		setBusy(true);
		const res = await apiFetch(`/admin/tools/tiers/${tier.id}`, { method: "DELETE" }).catch(() => null);
		setBusy(false);
		setPendingDelete(null);
		if (res === null || !res.ok) {
			toast.danger(await describeFailureFrom(res, `„${tier.name}“ konnte nicht gelöscht werden`));
			return;
		}
		toast.success(`Stufe „${tier.name}“ gelöscht.`);
		await load();
	};
	if (tiers === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (error) return /* @__PURE__ */ jsx(Alert, { children: error });
	const choices = [...tools].sort((a, b) => Number(b.is_premium) - Number(a.is_premium) || a.name.localeCompare(b.name, "de"));
	const nameOf = (id) => tools.find((t) => t.tool_id === id)?.name ?? id;
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		id: "premium-tiers",
		children: [
			tiers.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "tds-empty",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold",
					children: "Noch keine Premium-Stufe."
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2",
					children: "Ohne Stufe lässt sich kein Premium-Werkzeug freischalten. Eine Stufe hat einen festen Monatspreis und schaltet die ausgewählten Werkzeuge frei."
				})]
			}) : /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "tds-table",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", { children: "Stufe" }),
						/* @__PURE__ */ jsx("th", { children: "Monatspreis" }),
						/* @__PURE__ */ jsx("th", { children: "Werkzeuge" }),
						/* @__PURE__ */ jsx("th", { children: "Abos" }),
						/* @__PURE__ */ jsx("th", { children: "Status" }),
						/* @__PURE__ */ jsx("th", {})
					] }) }), /* @__PURE__ */ jsx("tbody", { children: tiers.map((t) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsxs("td", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-medium",
							children: t.name
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs opacity-60",
							children: [t.slug, t.tagline ? ` · ${t.tagline}` : ""]
						})] }),
						/* @__PURE__ */ jsx("td", { children: formatCents(t.price_cents, { currency }) }),
						/* @__PURE__ */ jsx("td", {
							className: "text-sm",
							children: t.tool_ids.map(nameOf).join(", ")
						}),
						/* @__PURE__ */ jsx("td", {
							className: "text-center",
							children: t.subscribers
						}),
						/* @__PURE__ */ jsxs("td", { children: [t.active ? /* @__PURE__ */ jsx("span", {
							className: "chip chip--success",
							children: "Im Verkauf"
						}) : /* @__PURE__ */ jsx("span", {
							className: "chip chip--neutral",
							children: "Pausiert"
						}), t.highlight ? /* @__PURE__ */ jsx("span", {
							className: "chip chip--info ml-1",
							children: "Empfohlen"
						}) : null] }),
						/* @__PURE__ */ jsx("td", {
							className: "text-right",
							children: /* @__PURE__ */ jsxs("div", {
								className: "tds-toolbar",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => {
										setFormError(null);
										setDraft(toDraft(t));
									},
									children: "Bearbeiten"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-danger",
									onClick: () => setPendingDelete(t),
									disabled: t.subscribers > 0,
									title: t.subscribers > 0 ? "Stufe mit Abos: bitte pausieren statt löschen" : void 0,
									children: "Löschen"
								})]
							})
						})
					] }, t.id)) })]
				})
			}),
			draft === null ? /* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => {
						setFormError(null);
						setDraft({ ...EMPTY });
					},
					children: "Neue Stufe"
				})
			}) : /* @__PURE__ */ jsxs("form", {
				className: "tds-card tds-stack",
				"aria-label": draft.id === null ? "Neue Premium-Stufe" : `Stufe „${draft.name}“ bearbeiten`,
				onSubmit: (e) => {
					e.preventDefault();
					save();
				},
				children: [
					formError ? /* @__PURE__ */ jsx(Alert, {
						tone: "danger",
						children: formError
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: [/* @__PURE__ */ jsx("span", { children: "Name" }), /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									value: draft.name,
									onChange: (e) => set({ name: e.target.value }),
									maxLength: 120,
									required: true
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: [/* @__PURE__ */ jsx("span", { children: "Name (englisch)" }), /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									value: draft.name_en,
									onChange: (e) => set({ name_en: e.target.value }),
									maxLength: 120
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: [/* @__PURE__ */ jsx("span", { children: "Kurzname" }), /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									value: draft.slug,
									onChange: (e) => set({ slug: e.target.value }),
									placeholder: "aus dem Namen",
									maxLength: 60
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "tds-field-row",
							children: [/* @__PURE__ */ jsx("span", { children: "Monatspreis (€)" }), /* @__PURE__ */ jsx("input", {
								className: "field-boxed w-32",
								inputMode: "decimal",
								value: draft.price,
								onChange: (e) => set({ price: e.target.value }),
								placeholder: "9,90",
								required: true
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "tds-field-row",
							children: [/* @__PURE__ */ jsx("span", { children: "Reihenfolge" }), /* @__PURE__ */ jsx("input", {
								className: "field-boxed w-24",
								type: "number",
								min: "0",
								value: draft.sort_order,
								onChange: (e) => set({ sort_order: Math.max(0, Number(e.target.value) || 0) })
							})]
						})]
					}),
					draft.id !== null ? /* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Eine Preisänderung gilt für neue Abos. Laufende Abos behalten den Preis, mit dem sie abgeschlossen wurden."
					}) : null,
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Werbetext" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: draft.tagline,
							onChange: (e) => set({ tagline: e.target.value }),
							maxLength: 255,
							placeholder: "Ein Satz, der den Nutzen nennt"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Werbetext (englisch)" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: draft.tagline_en,
							onChange: (e) => set({ tagline_en: e.target.value }),
							maxLength: 255
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "tds-field-row",
							children: [/* @__PURE__ */ jsx("span", { children: "Leistungen (eine pro Zeile)" }), /* @__PURE__ */ jsx("textarea", {
								className: "field-boxed",
								rows: 4,
								value: draft.features,
								onChange: (e) => set({ features: e.target.value })
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "tds-field-row",
							children: [/* @__PURE__ */ jsx("span", { children: "Leistungen (englisch)" }), /* @__PURE__ */ jsx("textarea", {
								className: "field-boxed",
								rows: 4,
								value: draft.features_en,
								onChange: (e) => set({ features_en: e.target.value })
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("fieldset", {
						className: "tds-stack tds-stack--tight",
						children: [
							/* @__PURE__ */ jsx("legend", {
								className: "font-medium",
								children: "Freigeschaltete Werkzeuge"
							}),
							choices.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "marginalia",
								children: "Noch keine Werkzeuge synchronisiert."
							}) : null,
							choices.map((t) => /* @__PURE__ */ jsxs("label", {
								className: "tds-toggle-row",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: draft.tool_ids.includes(t.tool_id),
									onChange: () => toggleTool(t.tool_id)
								}), /* @__PURE__ */ jsxs("span", { children: [
									t.name,
									t.is_premium ? /* @__PURE__ */ jsx("span", {
										className: "chip chip--warning ml-1",
										children: "Premium"
									}) : null,
									!t.is_premium && t.tool_id === STUDIO ? /* @__PURE__ */ jsx("span", {
										className: "chip chip--info ml-1",
										children: "Premium-Funktionen"
									}) : null
								] })]
							}, t.tool_id))
						]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-toggle-row",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: draft.active,
							onChange: (e) => set({ active: e.target.checked })
						}), /* @__PURE__ */ jsx("span", { children: "Im Verkauf" })]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-toggle-row",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: draft.highlight,
							onChange: (e) => set({ highlight: e.target.checked })
						}), /* @__PURE__ */ jsx("span", { children: "Als Empfehlung hervorheben" })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn btn-primary",
							disabled: busy,
							"aria-busy": busy,
							children: busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setDraft(null),
							disabled: busy,
							children: "Abbrechen"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: `Stufe „${pendingDelete?.name ?? ""}“ wirklich löschen?`,
				message: "Die Stufe verschwindet sofort von der Tools-Site.",
				confirmLabel: "Löschen",
				destructive: true,
				busy,
				onConfirm: () => void remove(),
				onCancel: () => setPendingDelete(null)
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-tools/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Tools</h1></div><p class="text-sm opacity-70">Steuere den öffentlichen Tools-Katalog (tools.tracht-digital.de): sichtbar, Login-Pflicht, Premium und der Ratgeber-Artikel je Tool. Änderungen erneuern den Seiten-Cache der Website.</p>${renderComponent($$result, "ToolsManage", ToolsManage, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsManage.tsx",
		"client:component-export": "default"
	})}<div class="tds-settings-section"><h2 class="tds-page__title">Premium-Stufen</h2><p class="text-sm opacity-70">Premium wird monatlich abgerechnet. Jede Stufe hat einen festen Monatspreis, einen Werbetext und die Werkzeuge, die sie freischaltet. Die Tools-Site zeigt genau diese Preise. Kündigen können Kundinnen und Kunden selbst über das Stripe-Kundenportal (in Stripe einmal aktivieren). Frühere Einzelkäufe bleiben gültig.</p>${renderComponent($$result, "ToolsTiers", ToolsTiers, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsTiers.tsx",
		"client:component-export": "default"
	})}</div><div class="tds-settings-section"><h2 class="tds-page__title">Texte der Tool-Seiten</h2><p class="text-sm opacity-70">Name, Beschreibung, SEO-Felder und der Ratgeber unter jedem Werkzeug — Einleitung, Anwendungsfälle, Schritte, häufige Fragen und der Datenschutzhinweis. Gespeicherte Texte <strong>ersetzen</strong> den im Repository mitgelieferten; ein leeres Feld nimmt die Übersteuerung zurück. Nach dem Speichern wird der Seiten-Cache der betroffenen Tool-Seite neu gebaut, ein Deploy ist dafür nicht nötig.</p>${renderComponent($$result, "ToolGuides", ToolGuides, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolGuides.tsx",
		"client:component-export": "default"
	})}</div></section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/pages/Index.astro", void 0);
// node_modules/.tds-frontend/routes/tools_verwaltung.astro
var tools_verwaltung_exports = /* @__PURE__ */ __exportAll({
	default: () => $$ToolsVerwaltung,
	file: () => $$file,
	url: () => void 0
});
var $$ToolsVerwaltung = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tools" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/tools_verwaltung.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/tools_verwaltung.astro";
// \0virtual:astro:page:node_modules/.tds-frontend/routes/tools_verwaltung@_@astro
var page = () => tools_verwaltung_exports;
export { page };
