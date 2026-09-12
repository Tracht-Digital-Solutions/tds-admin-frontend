import { Z as __exportAll, d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_d-ZXef0y.mjs";
import { t as createComponent } from "./compiler_6xhkfg2O.mjs";
import { g as ConfirmDialog, t as $$Layout, x as Spinner } from "./Layout_Bgah88_2.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { t as resolveChipVariant } from "./design_BN6Rm8xF.mjs";
import { t as toast } from "./toast_CwStKRcr.mjs";
import { useCallback, useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/ProductList.tsx
var EDITORIAL_LABEL = {
	none: "Kein Text",
	stub: "Notiz",
	published: "Eigener Text"
};
var STATUS_LABEL = {
	draft: "Entwurf",
	published: "Veröffentlicht",
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
	status: "draft",
	editorialStatus: "none",
	metaDescription: ""
};
/**
* The TDShop catalogue screen.
*
* Two things about the presentation are deliberate rather than decorative:
*
* 1. **`editorialStatus` is a column, not a detail.** A product with no
*    assessment of its own renders on the site but stays out of the search
*    index — so "Kein Text" is the difference between a catalogue entry that
*    works and one that merely exists. Burying it in the editor would make the
*    single most consequential field the least visible one.
* 2. **A product is listed once with its languages beside it**, not once per
*    language. The two share a price and an ASIN; showing them as two rows
*    would invite editing them as two products, which is exactly the drift the
*    schema was shaped to prevent.
*/
function ProductList() {
	const [products, setProducts] = useState(null);
	const [error, setError] = useState(null);
	const [form, setForm] = useState({ ...EMPTY_FORM });
	const [editingId, setEditingId] = useState(null);
	const [saving, setSaving] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
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
	const save = async (event) => {
		event.preventDefault();
		setSaving(true);
		try {
			const res = await apiFetch(editingId === null ? "/shop/products" : `/shop/products/${editingId}`, {
				method: editingId === null ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				toast.danger(json.error ?? `Speichern fehlgeschlagen (HTTP ${res.status})`);
				return;
			}
			toast.success(editingId === null ? "Produkt angelegt." : "Produkt gespeichert.");
			setForm({ ...EMPTY_FORM });
			setEditingId(null);
			await load();
		} catch {
			toast.danger("Speichern fehlgeschlagen — keine Verbindung zur API.");
		} finally {
			setSaving(false);
		}
	};
	const edit = (product, lang) => {
		const translation = product.translations[lang];
		setEditingId(product.id);
		setForm({
			lang,
			slug: translation?.slug ?? "",
			title: translation?.title ?? "",
			teaser: translation?.teaser ?? "",
			metaDescription: translation?.metaDescription ?? "",
			category: product.category,
			tags: product.tags.join(", "),
			brand: product.brand ?? "",
			kind: product.kind,
			status: product.status,
			editorialStatus: product.editorialStatus
		});
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
	if (products === null) return /* @__PURE__ */ jsx(Spinner, {});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		error ? /* @__PURE__ */ jsxs("div", {
			className: "tds-alert tds-alert--danger",
			children: ["Produkte konnten nicht geladen werden: ", error]
		}) : null,
		/* @__PURE__ */ jsxs("form", {
			className: "tds-card",
			onSubmit: save,
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
					/* @__PURE__ */ jsxs("small", { children: [form.metaDescription.length, " Zeichen — 80 bis 160 ist die nützliche Spanne."] })
				] }),
				/* @__PURE__ */ jsxs("div", {
					className: "tds-field-row",
					children: [/* @__PURE__ */ jsxs("label", { children: ["Kategorie", /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: form.category,
						onChange: (e) => setForm({
							...form,
							category: e.target.value
						})
					})] }), /* @__PURE__ */ jsxs("label", { children: ["Schlagwörter", /* @__PURE__ */ jsx("input", {
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
					children: [
						/* @__PURE__ */ jsxs("label", { children: ["Art", /* @__PURE__ */ jsxs("select", {
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
						})] }),
						/* @__PURE__ */ jsxs("label", { children: ["Status", /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: form.status,
							onChange: (e) => setForm({
								...form,
								status: e.target.value
							}),
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "draft",
									children: "Entwurf"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "published",
									children: "Veröffentlicht"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "archived",
									children: "Archiviert"
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("label", { children: ["Redaktion", /* @__PURE__ */ jsxs("select", {
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
						})] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "tds-toolbar",
					children: [/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "btn btn-primary",
						disabled: saving,
						"aria-busy": saving,
						children: editingId === null ? "Anlegen" : "Speichern"
					}), editingId !== null ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => {
							setEditingId(null);
							setForm({ ...EMPTY_FORM });
						},
						children: "Abbrechen"
					}) : null]
				})
			]
		}),
		products.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "tds-empty",
			children: "Noch keine Produkte im Katalog."
		}) : /* @__PURE__ */ jsxs("table", {
			className: "tds-table",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("th", { children: "Titel" }),
				/* @__PURE__ */ jsx("th", { children: "Kategorie" }),
				/* @__PURE__ */ jsx("th", { children: "Status" }),
				/* @__PURE__ */ jsx("th", { children: "Redaktion" }),
				/* @__PURE__ */ jsx("th", { children: "Sprachen" }),
				/* @__PURE__ */ jsx("th", {})
			] }) }), /* @__PURE__ */ jsx("tbody", { children: products.map((product) => /* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("td", { children: product.translations.de?.title ?? product.translations.en?.title ?? "—" }),
				/* @__PURE__ */ jsx("td", { children: product.category }),
				/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
					className: `chip ${resolveChipVariant(product.status === "published" ? "success" : "neutral")}`,
					children: STATUS_LABEL[product.status]
				}) }),
				/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
					className: `chip ${resolveChipVariant(product.editorialStatus === "published" ? "success" : "warning")}`,
					children: EDITORIAL_LABEL[product.editorialStatus]
				}) }),
				/* @__PURE__ */ jsx("td", { children: ["de", "en"].map((lang) => product.translations[lang] ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => edit(product, lang),
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
				/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => setPendingDelete(product),
					children: "Löschen"
				}) })
			] }, product.id)) })]
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
