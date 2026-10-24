import { a as renderComponent, et as __exportAll, f as renderTemplate, p as maybeRenderHead } from "./server_Cdzh4AE6.mjs";
import { n as createComponent } from "./compiler_CX02AaCz.mjs";
import { B as toast, D as Tabs, E as TabPanel, N as sendJson, k as apiFetch, t as $$Layout, v as ConfirmDialog } from "./Layout_D80p1pEh.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { n as AnimatedList, o as TabIndicator, t as AnimatedItem } from "./chunk-ERSKINIL_BaF4IMQk.mjs";
import { useCallback, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/WikiContentManager.tsx
function WikiContentManager() {
	const [tab, setTab] = useState("faq");
	return /* @__PURE__ */ jsxs("div", {
		className: "wiki-content-manager",
		children: [/* @__PURE__ */ jsx(Tabs, {
			label: "Inhalte",
			idPrefix: "wiki-content",
			tabs: [["faq", "FAQ"], ["docs", "Handbücher"]],
			value: tab,
			onChange: setTab,
			decorate: (_id, active) => active ? /* @__PURE__ */ jsx(TabIndicator, { group: "wiki-content" }) : null
		}), /* @__PURE__ */ jsx(TabPanel, {
			idPrefix: "wiki-content",
			id: tab,
			active: true,
			children: tab === "faq" ? /* @__PURE__ */ jsx(FaqTab, {}) : /* @__PURE__ */ jsx(DocsTab, {})
		})]
	});
}
var emptyFaq = {
	lang: "de",
	category: "",
	question: "",
	answer: "",
	sort_order: 100,
	is_published: 1
};
function FaqTab() {
	const [rows, setRows] = useState([]);
	const [draft, setDraft] = useState({ ...emptyFaq });
	const [pendingDelete, setPendingDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [status, setStatus] = useState(null);
	const [loadFailed, setLoadFailed] = useState(false);
	const load = useCallback(async () => {
		const res = await apiFetch("/admin/live-chat-cta/faqs").catch(() => null);
		setLoadFailed(res === null);
		if (res?.ok) setRows((await res.json()).faqs ?? []);
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	const save = async () => {
		if (!draft.question.trim() || !draft.answer.trim()) {
			setStatus("Frage und Antwort sind erforderlich.");
			return;
		}
		const isEdit = typeof draft.id === "number";
		const res = await sendJson(`/admin/live-chat-cta/faqs${isEdit ? `/${draft.id}` : ""}`, isEdit ? "PUT" : "POST", draft).catch(() => null);
		if (res === null) {
			toast.danger("Speichern fehlgeschlagen — die API ist nicht erreichbar.");
			return;
		}
		if (res.ok) {
			setDraft({ ...emptyFaq });
			setStatus(null);
			toast.success(isEdit ? "FAQ-Eintrag gespeichert." : "FAQ-Eintrag angelegt.");
			await load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const confirmRemove = async () => {
		const r = pendingDelete;
		if (!r) return;
		setDeleting(true);
		try {
			const res = await apiFetch(`/admin/live-chat-cta/faqs/${r.id}`, { method: "DELETE" });
			setPendingDelete(null);
			if (res.ok) await load();
		} catch {
			setPendingDelete(null);
			toast.danger("Löschen fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setDeleting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "kb",
		children: [
			/* @__PURE__ */ jsxs("form", {
				className: "tds-stack",
				onSubmit: (e) => {
					e.preventDefault();
					save();
				},
				children: [
					/* @__PURE__ */ jsx("h2", { children: typeof draft.id === "number" ? "FAQ bearbeiten" : "Neue FAQ" }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid",
						children: [/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Sprache" }), /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: draft.lang,
							onChange: (e) => setDraft({
								...draft,
								lang: e.target.value
							}),
							children: [/* @__PURE__ */ jsx("option", {
								value: "de",
								children: "Deutsch"
							}), /* @__PURE__ */ jsx("option", {
								value: "en",
								children: "English"
							})]
						})] }), /* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Kategorie" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: draft.category ?? "",
							onChange: (e) => setDraft({
								...draft,
								category: e.target.value
							})
						})] })]
					}),
					/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Frage" }), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						value: draft.question,
						onChange: (e) => setDraft({
							...draft,
							question: e.target.value
						})
					})] }),
					/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Antwort" }), /* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						rows: 4,
						value: draft.answer,
						onChange: (e) => setDraft({
							...draft,
							answer: e.target.value
						})
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid",
						children: [/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Reihenfolge" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "number",
							value: draft.sort_order,
							onChange: (e) => setDraft({
								...draft,
								sort_order: Number(e.target.value)
							})
						})] }), /* @__PURE__ */ jsxs("label", {
							className: "checkbox",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: !!draft.is_published,
								onChange: (e) => setDraft({
									...draft,
									is_published: e.target.checked ? 1 : 0
								})
							}), /* @__PURE__ */ jsx("span", { children: "Veröffentlicht" })]
						})]
					}),
					/* @__PURE__ */ jsx(Alert, { children: status }),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							className: "btn btn-primary",
							type: "submit",
							children: "Speichern"
						}), typeof draft.id === "number" ? /* @__PURE__ */ jsx("button", {
							className: "btn btn-ghost",
							type: "button",
							onClick: () => setDraft({ ...emptyFaq }),
							children: "Abbrechen"
						}) : null]
					})
				]
			}),
			loadFailed ? /* @__PURE__ */ jsx(Alert, { children: "FAQ-Einträge konnten nicht geladen werden — die API ist nicht erreichbar." }) : null,
			/* @__PURE__ */ jsx(AnimatedList, {
				className: "tds-list",
				children: rows.map((r) => /* @__PURE__ */ jsxs(AnimatedItem, {
					className: "tds-list__row",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: r.question }), /* @__PURE__ */ jsxs("span", {
						className: "marginalia",
						children: [
							r.lang,
							r.category ? ` · ${r.category}` : "",
							r.is_published ? "" : " · Entwurf"
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							className: "btn btn-ghost",
							type: "button",
							onClick: () => setDraft({
								...r,
								category: r.category ?? ""
							}),
							children: "Bearbeiten"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-danger",
							onClick: () => setPendingDelete(r),
							children: "Löschen"
						})]
					})]
				}, r.id))
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: "FAQ-Eintrag löschen?",
				message: pendingDelete?.question ?? void 0,
				busy: deleting,
				onConfirm: () => void confirmRemove(),
				onCancel: () => setPendingDelete(null)
			})
		]
	});
}
var emptyDoc = {
	lang: "de",
	slug: "",
	title: "",
	body_markdown: "",
	sort_order: 100,
	is_published: 1
};
function DocsTab() {
	const [rows, setRows] = useState([]);
	const [draft, setDraft] = useState({ ...emptyDoc });
	const [pendingDelete, setPendingDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [status, setStatus] = useState(null);
	const [loadFailed, setLoadFailed] = useState(false);
	const load = useCallback(async () => {
		const res = await apiFetch("/admin/live-chat-cta/docs").catch(() => null);
		setLoadFailed(res === null);
		if (res?.ok) setRows((await res.json()).docs ?? []);
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	const save = async () => {
		if (!draft.title.trim()) {
			setStatus("Titel ist erforderlich.");
			return;
		}
		const isEdit = typeof draft.id === "number";
		const res = await sendJson(`/admin/live-chat-cta/docs${isEdit ? `/${draft.id}` : ""}`, isEdit ? "PUT" : "POST", draft).catch(() => null);
		if (res === null) {
			toast.danger("Speichern fehlgeschlagen — die API ist nicht erreichbar.");
			return;
		}
		if (res.ok) {
			setDraft({ ...emptyDoc });
			setStatus(null);
			await load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const confirmRemove = async () => {
		const r = pendingDelete;
		if (!r) return;
		setDeleting(true);
		try {
			const res = await apiFetch(`/admin/live-chat-cta/docs/${r.id}`, { method: "DELETE" });
			setPendingDelete(null);
			if (res.ok) await load();
		} catch {
			setPendingDelete(null);
			toast.danger("Löschen fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setDeleting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "kb",
		children: [
			/* @__PURE__ */ jsxs("form", {
				className: "tds-stack",
				onSubmit: (e) => {
					e.preventDefault();
					save();
				},
				children: [
					/* @__PURE__ */ jsx("h2", { children: typeof draft.id === "number" ? "Artikel bearbeiten" : "Neuer Artikel" }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid",
						children: [/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Sprache" }), /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: draft.lang,
							onChange: (e) => setDraft({
								...draft,
								lang: e.target.value
							}),
							children: [/* @__PURE__ */ jsx("option", {
								value: "de",
								children: "Deutsch"
							}), /* @__PURE__ */ jsx("option", {
								value: "en",
								children: "English"
							})]
						})] }), /* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Slug (optional)" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: draft.slug,
							onChange: (e) => setDraft({
								...draft,
								slug: e.target.value
							}),
							placeholder: "wird aus dem Titel erzeugt"
						})] })]
					}),
					/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Titel" }), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						value: draft.title,
						onChange: (e) => setDraft({
							...draft,
							title: e.target.value
						})
					})] }),
					/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Inhalt (Markdown)" }), /* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						rows: 8,
						value: draft.body_markdown,
						onChange: (e) => setDraft({
							...draft,
							body_markdown: e.target.value
						})
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid",
						children: [/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", { children: "Reihenfolge" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "number",
							value: draft.sort_order,
							onChange: (e) => setDraft({
								...draft,
								sort_order: Number(e.target.value)
							})
						})] }), /* @__PURE__ */ jsxs("label", {
							className: "checkbox",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: !!draft.is_published,
								onChange: (e) => setDraft({
									...draft,
									is_published: e.target.checked ? 1 : 0
								})
							}), /* @__PURE__ */ jsx("span", { children: "Veröffentlicht" })]
						})]
					}),
					/* @__PURE__ */ jsx(Alert, { children: status }),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							className: "btn btn-primary",
							type: "submit",
							children: "Speichern"
						}), typeof draft.id === "number" ? /* @__PURE__ */ jsx("button", {
							className: "btn btn-ghost",
							type: "button",
							onClick: () => setDraft({ ...emptyDoc }),
							children: "Abbrechen"
						}) : null]
					})
				]
			}),
			loadFailed ? /* @__PURE__ */ jsx(Alert, { children: "Artikel konnten nicht geladen werden — die API ist nicht erreichbar." }) : null,
			/* @__PURE__ */ jsx(AnimatedList, {
				className: "tds-list",
				children: rows.map((r) => /* @__PURE__ */ jsxs(AnimatedItem, {
					className: "tds-list__row",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: r.title }), /* @__PURE__ */ jsxs("span", {
						className: "marginalia",
						children: [
							r.lang,
							" · ",
							r.slug,
							r.is_published ? "" : " · Entwurf"
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							className: "btn btn-ghost",
							type: "button",
							onClick: () => setDraft({ ...r }),
							children: "Bearbeiten"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-danger",
							onClick: () => setPendingDelete(r),
							children: "Löschen"
						})]
					})]
				}, r.id))
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: `Dokument „${pendingDelete?.title ?? ""}“ löschen?`,
				message: "Die Sprachfassung wird dauerhaft entfernt.",
				busy: deleting,
				onConfirm: () => void confirmRemove(),
				onCancel: () => setPendingDelete(null)
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/pages/WikiContent.astro
var $$WikiContent = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Wiki-Inhalte</h1></div><p class="tds-page__lede">FAQs und Handbücher für das Kunden-Wiki pflegen. Veröffentlichte Einträge erscheinen im Portal unter <em>Hilfe</em> und im Support-Widget.</p>${renderComponent($$result, "WikiContentManager", WikiContentManager, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/WikiContentManager.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/pages/WikiContent.astro", void 0);
// node_modules/.tds-frontend/routes/wiki_inhalte.astro
var wiki_inhalte_exports = /* @__PURE__ */ __exportAll({
	default: () => $$WikiInhalte,
	file: () => $$file,
	url: () => void 0
});
var $$WikiInhalte = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Wiki-Inhalte" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$WikiContent, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/wiki_inhalte.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/wiki_inhalte.astro";
// \0virtual:astro:page:node_modules/.tds-frontend/routes/wiki_inhalte@_@astro
var page = () => wiki_inhalte_exports;
export { page };
