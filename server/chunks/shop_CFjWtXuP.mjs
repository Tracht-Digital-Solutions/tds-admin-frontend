import { Q as __exportAll, a as renderComponent, f as renderTemplate, p as maybeRenderHead } from "./server_hnGLdWvx.mjs";
import { t as createComponent } from "./compiler_ClrasJXf.mjs";
import { M as resolveChipVariant, g as ConfirmDialog, j as toast, k as apiFetch, t as $$Layout, x as Spinner } from "./Layout_BX35BL1S.mjs";
import { a as Presence } from "./chunk-ERSKINIL_CZs-OmSg.mjs";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/PairEditor.tsx
var MAX_ITEMS = 12;
function PairEditor({ legend, rows, onChange, keys, labels, long = false }) {
	const [k, v] = keys;
	const update = (index, patch) => onChange(rows.map((row, i) => i === index ? {
		...row,
		...patch
	} : row));
	return /* @__PURE__ */ jsxs("fieldset", {
		className: "tds-stack tds-stack--tight",
		children: [
			/* @__PURE__ */ jsx("legend", { children: legend }),
			rows.map((row, index) => /* @__PURE__ */ jsxs("div", {
				className: "tds-row",
				children: [
					/* @__PURE__ */ jsxs("label", { children: [labels[0], /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: row[k] ?? "",
						maxLength: 300,
						onChange: (e) => update(index, { [k]: e.target.value })
					})] }),
					/* @__PURE__ */ jsxs("label", { children: [labels[1], long ? /* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						rows: 2,
						value: row[v] ?? "",
						maxLength: 2e3,
						onChange: (e) => update(index, { [v]: e.target.value })
					}) : /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: row[v] ?? "",
						maxLength: 2e3,
						onChange: (e) => update(index, { [v]: e.target.value })
					})] }),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						"aria-label": `${labels[0]} ${index + 1} entfernen`,
						onClick: () => onChange(rows.filter((_, i) => i !== index)),
						children: "Entfernen"
					})
				]
			}, index)),
			rows.length < MAX_ITEMS ? /* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => onChange([...rows, {
						[k]: "",
						[v]: ""
					}]),
					children: ["+ ", labels[0]]
				})
			}) : null
		]
	});
}
/** Parse a stored JSON column (the editor's raw read) into rows; anything else is empty. */
function parsePairs(raw, keys) {
	let value = raw;
	if (typeof raw === "string") try {
		value = JSON.parse(raw);
	} catch {
		return [];
	}
	if (!Array.isArray(value)) return [];
	return value.filter((row) => typeof row === "object" && row !== null).map((row) => ({
		[keys[0]]: String(row[keys[0]] ?? ""),
		[keys[1]]: String(row[keys[1]] ?? "")
	}));
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/CategoryManager.tsx
var EMPTY_DRAFT = {
	nameDe: "",
	nameEn: "",
	introDe: "",
	introEn: "",
	faqDe: [],
	faqEn: []
};
var toDraft = (c) => ({
	nameDe: c.nameDe ?? "",
	nameEn: c.nameEn ?? "",
	introDe: c.introDe ?? "",
	introEn: c.introEn ?? "",
	faqDe: parsePairs(c.faqDe ?? [], ["q", "a"]),
	faqEn: parsePairs(c.faqEn ?? [], ["q", "a"])
});
/** Mirrors `CategoryName::fromSlug()` — what the shop shows when no name is set. */
var fromSlug = (slug) => {
	const words = slug.replace(/-/g, " ").trim();
	return words.charAt(0).toUpperCase() + words.slice(1);
};
/**
* Category names in German and English.
*
* A category comes into being by typing its slug on a product, so this screen
* never creates one — it lists what the catalogue uses and names it. Before it
* existed the English shop showed German category names, because the slug was
* the only thing anybody had ever written down.
*
* The placeholder in each field is what the shop shows while the field is
* empty, so an unnamed category is visible as exactly that rather than as a
* blank.
*/
function CategoryManager() {
	const [categories, setCategories] = useState(null);
	const [drafts, setDrafts] = useState({});
	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(null);
	const load = useCallback(async () => {
		try {
			const res = await apiFetch("/shop/categories");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json = await res.json();
			setCategories(json.categories);
			setDrafts(Object.fromEntries(json.categories.map((c) => [c.slug, toDraft(c)])));
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unbekannter Fehler");
			setCategories([]);
		}
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	const setDraft = (slug, patch) => setDrafts((all) => ({
		...all,
		[slug]: {
			...all[slug] ?? EMPTY_DRAFT,
			...patch
		}
	}));
	const save = async (slug) => {
		const draft = drafts[slug];
		if (!draft) return;
		setSaving(slug);
		try {
			const res = await apiFetch(`/shop/categories/${slug}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(draft)
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				toast.danger(json.error ?? `Speichern fehlgeschlagen (HTTP ${res.status})`);
				return;
			}
			toast.success(`Kategorie „${slug}“ gespeichert.`);
			await load();
		} catch {
			toast.danger("Speichern fehlgeschlagen — keine Verbindung zur API.");
		} finally {
			setSaving(null);
		}
	};
	if (categories === null) return /* @__PURE__ */ jsx(Spinner, {});
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-card",
		children: [
			/* @__PURE__ */ jsx("h2", { children: "Kategorien" }),
			/* @__PURE__ */ jsx("p", { children: "Der Slug steht in der Adresse des Shops. Die Namen sind, was Besucher lesen. Ohne englischen Namen zeigt die englische Seite den deutschen, ohne beide den Slug mit großem Anfangsbuchstaben. Einleitung und häufige Fragen erscheinen oben auf der Kategorieseite — sichtbar und als strukturierte Daten für Suchmaschinen." }),
			error ? /* @__PURE__ */ jsxs("div", {
				className: "tds-alert tds-alert--danger",
				children: ["Kategorien konnten nicht geladen werden: ", error]
			}) : null,
			categories.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch keine Kategorien. Sie entstehen mit dem ersten Produkt."
			}) : /* @__PURE__ */ jsxs("table", {
				className: "tds-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Slug" }),
					/* @__PURE__ */ jsx("th", { children: "Name Deutsch" }),
					/* @__PURE__ */ jsx("th", { children: "Name Englisch" }),
					/* @__PURE__ */ jsx("th", { children: "Produkte" }),
					/* @__PURE__ */ jsx("th", {})
				] }) }), /* @__PURE__ */ jsx("tbody", { children: categories.map((category) => {
					const draft = drafts[category.slug] ?? EMPTY_DRAFT;
					const busy = saving === category.slug;
					return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							scope: "row",
							children: category.slug
						}),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							"aria-label": `Deutscher Name für ${category.slug}`,
							value: draft.nameDe,
							maxLength: 80,
							placeholder: fromSlug(category.slug),
							onChange: (e) => setDraft(category.slug, { nameDe: e.target.value })
						}) }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							"aria-label": `Englischer Name für ${category.slug}`,
							value: draft.nameEn,
							maxLength: 80,
							placeholder: draft.nameDe.trim() || fromSlug(category.slug),
							onChange: (e) => setDraft(category.slug, { nameEn: e.target.value })
						}) }),
						/* @__PURE__ */ jsx("td", { children: category.products }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							disabled: busy,
							"aria-busy": busy,
							onClick: () => void save(category.slug),
							children: "Speichern"
						}) })
					] }), /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 5,
						children: /* @__PURE__ */ jsxs("details", { children: [/* @__PURE__ */ jsxs("summary", { children: ["Seitentext und häufige Fragen", draft.introDe.trim() === "" ? " — noch leer" : ""] }), /* @__PURE__ */ jsxs("div", {
							className: "tds-stack",
							children: [
								/* @__PURE__ */ jsxs("label", { children: ["Einleitung Deutsch", /* @__PURE__ */ jsx("textarea", {
									className: "field-boxed",
									rows: 3,
									maxLength: 4e3,
									value: draft.introDe,
									onChange: (e) => setDraft(category.slug, { introDe: e.target.value })
								})] }),
								/* @__PURE__ */ jsxs("label", { children: ["Einleitung Englisch", /* @__PURE__ */ jsx("textarea", {
									className: "field-boxed",
									rows: 3,
									maxLength: 4e3,
									value: draft.introEn,
									onChange: (e) => setDraft(category.slug, { introEn: e.target.value })
								})] }),
								/* @__PURE__ */ jsx(PairEditor, {
									legend: "Häufige Fragen Deutsch",
									rows: draft.faqDe,
									onChange: (faqDe) => setDraft(category.slug, { faqDe }),
									keys: ["q", "a"],
									labels: ["Frage", "Antwort"],
									long: true
								}),
								/* @__PURE__ */ jsx(PairEditor, {
									legend: "Häufige Fragen Englisch",
									rows: draft.faqEn,
									onChange: (faqEn) => setDraft(category.slug, { faqEn }),
									keys: ["q", "a"],
									labels: ["Frage", "Antwort"],
									long: true
								}),
								/* @__PURE__ */ jsx("div", {
									className: "tds-toolbar",
									children: /* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn btn-primary",
										disabled: busy,
										"aria-busy": busy,
										onClick: () => void save(category.slug),
										children: "Speichern"
									})
								})
							]
						})] })
					}) })] }, category.slug);
				}) })]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/ProductList.tsx
var FILTER_LABEL = {
	all: "Alle",
	ready: "Bereit zur Freigabe",
	blocked: "Unvollständig",
	published: "Freigegeben"
};
var EDITORIAL_LABEL = {
	none: "Kein Text",
	stub: "Notiz",
	published: "Eigener Text"
};
var STATUS_LABEL = {
	draft: "Entwurf",
	published: "Freigegeben",
	archived: "Archiviert"
};
var EMPTY_FORM = {
	lang: "de",
	slug: "",
	title: "",
	teaser: "",
	category: "allgemein",
	tags: "",
	brand: "",
	kind: "affiliate",
	editorialStatus: "none",
	metaDescription: "",
	metaTitle: "",
	summary: "",
	body: "",
	facts: [],
	faq: []
};
var TITLE_MAX = 65;
/**
* The TDShop catalogue screen.
*
* Three things about the presentation are deliberate rather than decorative:
*
* 1. **Going live is a button, not a select.** "Freigeben" asks the server
*    whether the product is complete (text, meta data in both languages,
*    cover, category name, price) and refuses otherwise; the reasons stand in
*    the row. Seeded products arrive complete, so releasing them is one click
*    each — or one for a whole selection.
* 2. **`editorialStatus` is a column, not a detail.** A product with no
*    assessment of its own renders on the site but stays out of the search
*    index.
* 3. **A product is listed once with its languages beside it**, not once per
*    language. The two share a price and an ASIN; showing them as two rows
*    would invite editing them as two products.
*/
function ProductList() {
	const [products, setProducts] = useState(null);
	const [error, setError] = useState(null);
	const [form, setForm] = useState({ ...EMPTY_FORM });
	const [editingId, setEditingId] = useState(null);
	const [creating, setCreating] = useState(false);
	const [loadingEditor, setLoadingEditor] = useState(false);
	const [saving, setSaving] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [filter, setFilter] = useState("all");
	const [selected, setSelected] = useState(/* @__PURE__ */ new Set());
	const [publishing, setPublishing] = useState(null);
	const [categorySlugs, setCategorySlugs] = useState([]);
	const load = useCallback(async () => {
		try {
			const res = await apiFetch("/shop/products");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json = await res.json();
			setProducts(json.products);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unbekannter Fehler");
			setProducts([]);
		}
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	useEffect(() => {
		(async () => {
			try {
				const res = await apiFetch("/shop/categories");
				if (!res.ok) return;
				const json = await res.json();
				setCategorySlugs(json.categories.map((c) => c.slug));
			} catch {}
		})();
	}, [products]);
	const counts = useMemo(() => {
		const all = products ?? [];
		return {
			all: all.length,
			ready: all.filter((p) => p.status !== "published" && p.ready === true).length,
			blocked: all.filter((p) => p.status !== "published" && p.ready === false).length,
			published: all.filter((p) => p.status === "published").length
		};
	}, [products]);
	const visible = useMemo(() => {
		const all = products ?? [];
		switch (filter) {
			case "ready": return all.filter((p) => p.status !== "published" && p.ready === true);
			case "blocked": return all.filter((p) => p.status !== "published" && p.ready === false);
			case "published": return all.filter((p) => p.status === "published");
			default: return all;
		}
	}, [products, filter]);
	const releasable = visible.filter((p) => p.status !== "published" && p.ready === true);
	const save = async (event) => {
		event.preventDefault();
		setSaving(true);
		try {
			const res = await apiFetch(editingId === null ? "/shop/products" : `/shop/products/${editingId}`, {
				method: editingId === null ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...form,
					bodyFormat: "markdown"
				})
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				toast.danger(json.error ?? `Speichern fehlgeschlagen (HTTP ${res.status})`);
				return;
			}
			toast.success(editingId === null ? "Produkt angelegt." : "Produkt gespeichert.");
			setForm({ ...EMPTY_FORM });
			setEditingId(null);
			setCreating(false);
			await load();
		} catch {
			toast.danger("Speichern fehlgeschlagen — keine Verbindung zur API.");
		} finally {
			setSaving(false);
		}
	};
	/**
	* Open a product in the form. The list carries no body, facts or FAQ, so the
	* editor reads the full product first — saving a form without them would
	* leave those fields untouched on the server, but the editor should show
	* what it is editing.
	*/
	const edit = async (product, lang) => {
		const translation = product.translations[lang];
		setEditingId(product.id);
		setCreating(false);
		requestAnimationFrame(() => document.getElementById("shop-product-editor")?.scrollIntoView({ block: "start" }));
		const base = {
			...EMPTY_FORM,
			lang,
			slug: translation?.slug ?? "",
			title: translation?.title ?? "",
			teaser: translation?.teaser ?? "",
			metaDescription: translation?.metaDescription ?? "",
			category: product.category,
			tags: product.tags.join(", "),
			brand: product.brand ?? "",
			kind: product.kind,
			editorialStatus: product.editorialStatus
		};
		setForm(base);
		if (!translation) return;
		setLoadingEditor(true);
		try {
			const res = await apiFetch(`/shop/products/${product.id}`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const raw = (await res.json()).translations?.[lang] ?? {};
			setForm({
				...base,
				body: raw.body ?? "",
				metaTitle: raw.meta_title ?? "",
				summary: raw.summary ?? "",
				facts: parsePairs(raw.facts, ["label", "value"]),
				faq: parsePairs(raw.faq, ["q", "a"])
			});
		} catch (err) {
			toast.danger(`Produkttext konnte nicht geladen werden (${err instanceof Error ? err.message : "unbekannt"}).`);
		} finally {
			setLoadingEditor(false);
		}
	};
	const remove = async () => {
		if (!pendingDelete) return;
		setDeleting(true);
		try {
			const res = await apiFetch(`/shop/products/${pendingDelete.id}`, { method: "DELETE" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			toast.success("Produkt gelöscht.");
			await load();
		} catch (err) {
			toast.danger(`Löschen fehlgeschlagen (${err instanceof Error ? err.message : "unbekannt"}).`);
		} finally {
			setDeleting(false);
			setPendingDelete(null);
		}
	};
	const setLive = async (product, live) => {
		setPublishing(product.id);
		try {
			const res = await apiFetch(`/shop/products/${product.id}/${live ? "publish" : "unpublish"}`, { method: "POST" });
			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				const reasons = json.problems?.map((p) => p.message).join(" ") ?? "";
				toast.danger(`${json.error ?? "Freigabe fehlgeschlagen"} (HTTP ${res.status}) ${reasons}`.trim());
				return;
			}
			toast.success(live ? "Produkt freigegeben." : "Produkt zurückgezogen.");
			await load();
		} catch {
			toast.danger("Keine Verbindung zur API.");
		} finally {
			setPublishing(null);
		}
	};
	const publishSelected = async () => {
		const ids = [...selected];
		if (ids.length === 0) return;
		setPublishing("bulk");
		try {
			const res = await apiFetch("/shop/products/publish", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ids })
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				toast.danger(json.error ?? `Freigabe fehlgeschlagen (HTTP ${res.status})`);
				return;
			}
			const refused = Object.keys(json.refused ?? {}).length;
			const published = json.published?.length ?? 0;
			if (refused > 0) toast.warning(`${published} freigegeben, ${refused} noch unvollständig — Gründe stehen in der Liste.`);
			else toast.success(`${published} Produkte freigegeben.`);
			setSelected(/* @__PURE__ */ new Set());
			await load();
		} catch {
			toast.danger("Freigabe fehlgeschlagen — keine Verbindung zur API.");
		} finally {
			setPublishing(null);
		}
	};
	const toggle = (id) => setSelected((current) => {
		const next = new Set(current);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		return next;
	});
	if (products === null) return /* @__PURE__ */ jsx(Spinner, {});
	const pageTitle = form.metaTitle.trim() || form.title;
	const editorOpen = creating || editingId !== null;
	const closeEditor = () => {
		setEditingId(null);
		setCreating(false);
		setForm({ ...EMPTY_FORM });
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		error ? /* @__PURE__ */ jsxs("div", {
			className: "tds-alert tds-alert--danger",
			children: ["Produkte konnten nicht geladen werden: ", error]
		}) : null,
		!editorOpen ? /* @__PURE__ */ jsx("div", {
			className: "tds-toolbar",
			children: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => setCreating(true),
				children: "+ Neues Produkt"
			})
		}) : null,
		editorOpen ? /* @__PURE__ */ jsx(Presence, {
			view: editingId === null ? "new" : `product-${editingId}`,
			children: /* @__PURE__ */ jsxs("form", {
				id: "shop-product-editor",
				className: "tds-card",
				onSubmit: save,
				"aria-busy": loadingEditor,
				children: [
					/* @__PURE__ */ jsx("h2", { children: editingId === null ? "Neues Produkt" : `Produkt #${editingId} bearbeiten` }),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsxs("label", { children: ["Sprache", /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: form.lang,
							onChange: (e) => setForm({
								...form,
								lang: e.target.value
							}),
							children: [/* @__PURE__ */ jsx("option", {
								value: "de",
								children: "Deutsch"
							}), /* @__PURE__ */ jsx("option", {
								value: "en",
								children: "Englisch"
							})]
						})] }), /* @__PURE__ */ jsxs("label", { children: ["Slug", /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: form.slug,
							onChange: (e) => setForm({
								...form,
								slug: e.target.value
							}),
							placeholder: "fritzbox-7590-ax",
							required: true
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsxs("label", { children: ["Titel", /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: form.title,
							onChange: (e) => setForm({
								...form,
								title: e.target.value
							}),
							required: true
						})] }), /* @__PURE__ */ jsxs("label", { children: ["Marke", /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: form.brand,
							onChange: (e) => setForm({
								...form,
								brand: e.target.value
							})
						})] })]
					}),
					/* @__PURE__ */ jsxs("label", { children: ["Kurzbeschreibung", /* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						value: form.teaser,
						onChange: (e) => setForm({
							...form,
							teaser: e.target.value
						}),
						rows: 2
					})] }),
					/* @__PURE__ */ jsxs("label", { children: [
						"Kurz gesagt",
						/* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							value: form.summary,
							onChange: (e) => setForm({
								...form,
								summary: e.target.value
							}),
							rows: 3,
							maxLength: 400
						}),
						/* @__PURE__ */ jsx("small", { children: "2–3 Sätze, die die Frage „Was bekomme ich?“ vollständig beantworten." })
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsxs("label", { children: [
							"Meta-Titel",
							/* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: form.metaTitle,
								onChange: (e) => setForm({
									...form,
									metaTitle: e.target.value
								}),
								maxLength: 70,
								placeholder: form.title
							}),
							/* @__PURE__ */ jsxs("small", { children: [
								"Seitentitel: ",
								pageTitle.length,
								" Zeichen",
								pageTitle.length > TITLE_MAX ? ` — höchstens ${TITLE_MAX}, bitte kürzen.` : "."
							] })
						] }), /* @__PURE__ */ jsxs("label", { children: [
							"Meta-Description",
							/* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: form.metaDescription,
								onChange: (e) => setForm({
									...form,
									metaDescription: e.target.value
								}),
								maxLength: 300
							}),
							/* @__PURE__ */ jsxs("small", { children: [form.metaDescription.length, " Zeichen — nötig sind 80 bis 160."] })
						] })]
					}),
					/* @__PURE__ */ jsxs("label", { children: ["Produkttext (Markdown)", /* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						value: form.body,
						onChange: (e) => setForm({
							...form,
							body: e.target.value
						}),
						rows: 12
					})] }),
					/* @__PURE__ */ jsx(PairEditor, {
						legend: "Fakten (Dauer, Umfang, Ergebnis …)",
						rows: form.facts,
						onChange: (facts) => setForm({
							...form,
							facts
						}),
						keys: ["label", "value"],
						labels: ["Bezeichnung", "Wert"]
					}),
					/* @__PURE__ */ jsx(PairEditor, {
						legend: "Häufige Fragen",
						rows: form.faq,
						onChange: (faq) => setForm({
							...form,
							faq
						}),
						keys: ["q", "a"],
						labels: ["Frage", "Antwort"],
						long: true
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsxs("label", { children: [
							"Kategorie",
							/* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: form.category,
								onChange: (e) => setForm({
									...form,
									category: e.target.value
								}),
								list: "shop-category-slugs",
								pattern: "[a-z0-9\\-]{2,60}",
								title: "2–60 Kleinbuchstaben, Ziffern und Bindestriche"
							}),
							/* @__PURE__ */ jsx("datalist", {
								id: "shop-category-slugs",
								children: categorySlugs.map((slug) => /* @__PURE__ */ jsx("option", { value: slug }, slug))
							}),
							/* @__PURE__ */ jsx("small", { children: "Slug, z. B. netzwerk. Den lesbaren Namen pflegen Sie unter „Kategorien“." })
						] }), /* @__PURE__ */ jsxs("label", { children: ["Schlagwörter", /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: form.tags,
							onChange: (e) => setForm({
								...form,
								tags: e.target.value
							}),
							placeholder: "nas, backup, homeoffice"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsxs("label", { children: ["Art", /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: form.kind,
							onChange: (e) => setForm({
								...form,
								kind: e.target.value
							}),
							children: [/* @__PURE__ */ jsx("option", {
								value: "affiliate",
								children: "Affiliate"
							}), /* @__PURE__ */ jsx("option", {
								value: "digital",
								children: "Eigenes digitales Produkt"
							})]
						})] }), /* @__PURE__ */ jsxs("label", { children: ["Redaktion", /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: form.editorialStatus,
							onChange: (e) => setForm({
								...form,
								editorialStatus: e.target.value
							}),
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "none",
									children: "Kein eigener Text"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "stub",
									children: "Notiz"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "published",
									children: "Eigener Text — wird indexiert"
								})
							]
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn btn-primary",
							disabled: saving || loadingEditor,
							"aria-busy": saving,
							children: editingId === null ? "Anlegen" : "Speichern"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: closeEditor,
							children: "Abbrechen"
						})]
					})
				]
			})
		}) : null,
		/* @__PURE__ */ jsx("div", {
			className: "tds-toolbar",
			role: "group",
			"aria-label": "Produkte filtern",
			children: Object.keys(FILTER_LABEL).map((key) => /* @__PURE__ */ jsxs("button", {
				type: "button",
				className: filter === key ? "btn btn-primary" : "btn btn-ghost",
				"aria-pressed": filter === key,
				onClick: () => setFilter(key),
				children: [
					FILTER_LABEL[key],
					" (",
					counts[key],
					")"
				]
			}, key))
		}),
		releasable.length > 0 ? /* @__PURE__ */ jsxs("div", {
			className: "tds-toolbar",
			children: [/* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => setSelected(new Set(releasable.map((p) => p.id))),
				children: [
					"Alle bereiten auswählen (",
					releasable.length,
					")"
				]
			}), /* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "btn btn-accent",
				disabled: selected.size === 0 || publishing !== null,
				"aria-busy": publishing === "bulk",
				onClick: () => void publishSelected(),
				children: [
					"Ausgewählte freigeben (",
					selected.size,
					")"
				]
			})]
		}) : null,
		visible.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "tds-empty",
			children: products.length === 0 ? "Noch keine Produkte im Katalog." : "Keine Produkte in dieser Ansicht."
		}) : /* @__PURE__ */ jsxs("table", {
			className: "tds-table",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("th", { children: /* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: "Auswahl"
				}) }),
				/* @__PURE__ */ jsx("th", { children: "Titel" }),
				/* @__PURE__ */ jsx("th", { children: "Kategorie" }),
				/* @__PURE__ */ jsx("th", { children: "Status" }),
				/* @__PURE__ */ jsx("th", { children: "Bereitschaft" }),
				/* @__PURE__ */ jsx("th", { children: "Redaktion" }),
				/* @__PURE__ */ jsx("th", { children: "Sprachen" }),
				/* @__PURE__ */ jsx("th", {})
			] }) }), /* @__PURE__ */ jsx("tbody", { children: visible.map((product) => {
				const title = product.translations.de?.title ?? product.translations.en?.title ?? "—";
				const live = product.status === "published";
				const busy = publishing === product.id;
				return /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", { children: !live && product.ready ? /* @__PURE__ */ jsx("input", {
						type: "checkbox",
						"aria-label": `${title} auswählen`,
						checked: selected.has(product.id),
						onChange: () => toggle(product.id)
					}) : null }),
					/* @__PURE__ */ jsx("td", { children: title }),
					/* @__PURE__ */ jsx("td", { children: product.category }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
						className: `chip ${resolveChipVariant(live ? "success" : "neutral")}`,
						children: STATUS_LABEL[product.status]
					}) }),
					/* @__PURE__ */ jsx("td", { children: product.ready === void 0 ? "—" : product.ready ? /* @__PURE__ */ jsx("span", {
						className: `chip ${resolveChipVariant("success")}`,
						children: "Vollständig"
					}) : /* @__PURE__ */ jsxs("details", { children: [/* @__PURE__ */ jsx("summary", { children: /* @__PURE__ */ jsxs("span", {
						className: `chip ${resolveChipVariant("warning")}`,
						children: [product.problems?.length ?? 0, " offen"]
					}) }), /* @__PURE__ */ jsx("ul", {
						className: "marginalia",
						children: product.problems?.map((p) => /* @__PURE__ */ jsx("li", { children: p.message }, p.code))
					})] }) }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
						className: `chip ${resolveChipVariant(product.editorialStatus === "published" ? "success" : "warning")}`,
						children: EDITORIAL_LABEL[product.editorialStatus]
					}) }),
					/* @__PURE__ */ jsx("td", { children: ["de", "en"].map((lang) => product.translations[lang] ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => void edit(product, lang),
						children: lang.toUpperCase()
					}, lang) : /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => {
							edit(product, lang);
							setForm((f) => ({
								...f,
								lang,
								slug: "",
								title: "",
								teaser: ""
							}));
						},
						children: ["+ ", lang.toUpperCase()]
					}, lang)) }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [live ? /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							disabled: busy,
							"aria-busy": busy,
							onClick: () => void setLive(product, false),
							children: "Zurückziehen"
						}) : /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							disabled: busy || product.ready === false,
							"aria-busy": busy,
							title: product.ready === false ? "Erst vervollständigen — siehe Bereitschaft." : void 0,
							onClick: () => void setLive(product, true),
							children: "Freigeben"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setPendingDelete(product),
							children: "Löschen"
						})]
					}) })
				] }, product.id);
			}) })]
		}),
		/* @__PURE__ */ jsx(ConfirmDialog, {
			open: pendingDelete !== null,
			title: "Produkt löschen?",
			message: pendingDelete ? `„${pendingDelete.translations.de?.title ?? pendingDelete.id}" wird mit allen Übersetzungen, Angeboten und Platzierungseinträgen entfernt.` : "",
			confirmLabel: "Löschen",
			busy: deleting,
			onConfirm: () => void remove(),
			onCancel: () => setPendingDelete(null)
		})
	] });
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">TDShop</h1></div>${renderComponent($$result, "ProductList", ProductList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/ProductList.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "CategoryManager", CategoryManager, {
		"client:idle": true,
		"client:component-hydration": "idle",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/CategoryManager.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/shop.astro
var shop_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Shop,
	file: () => $$file,
	url: () => void 0
});
var $$Shop = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "TDShop" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/shop.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/shop.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/shop@_@astro
var page = () => shop_exports;
//#endregion
export { page };
