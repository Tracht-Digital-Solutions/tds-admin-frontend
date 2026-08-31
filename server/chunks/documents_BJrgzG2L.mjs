import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-documents/islands/DocumentList.tsx
var api = apiFetch;
var fmtSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`;
var fmtDate = (iso) => new Date(iso.replace(" ", "T")).toLocaleDateString("de-DE", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
});
/**
* Portal document store (ported from tds-customer-legacy-frontend's Documents).
* List + upload (multipart under "file") + JWT-gated download + inline rename +
* a "Link teilen" action that mints a short-lived signed URL (copied to the
* clipboard). Read-only when the user lacks documents:write.
*/
function DocumentList() {
	const [docs, setDocs] = useState(null);
	const [forbidden, setForbidden] = useState(false);
	const [error, setError] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [renamingId, setRenamingId] = useState(null);
	const [renameDraft, setRenameDraft] = useState("");
	const [notice, setNotice] = useState(null);
	const fileRef = useRef(null);
	const load = () => api("/documents").then((r) => {
		if (r.status === 403) {
			setForbidden(true);
			return { documents: [] };
		}
		if (!r.ok) throw new Error(String(r.status));
		return r.json();
	}).then((d) => setDocs(d.documents ?? [])).catch(() => setError("Dokumente konnten nicht geladen werden."));
	useEffect(() => {
		load();
	}, []);
	async function upload(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		setError(null);
		try {
			const fd = new FormData();
			fd.append("file", file);
			const r = await api("/documents", {
				method: "POST",
				body: fd
			});
			if (!r.ok) {
				const d = await r.json().catch(() => ({}));
				throw new Error(d.error ?? String(r.status));
			}
			await load();
		} catch (err) {
			toast.danger(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	async function saveRename(id) {
		const name = renameDraft.trim();
		if (!name) return;
		try {
			const r = await api(`/documents/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filename: name })
			});
			if (!r.ok) throw new Error(String(r.status));
			setRenamingId(null);
			await load();
		} catch {
			toast.danger("Umbenennen fehlgeschlagen.");
		}
	}
	async function share(id) {
		try {
			const r = await api(`/documents/${id}/sign`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: "{}"
			});
			if (r.status === 503) {
				setNotice("Signierte Links sind nicht konfiguriert.");
				return;
			}
			if (!r.ok) throw new Error(String(r.status));
			const d = await r.json();
			await navigator.clipboard?.writeText(d.url).catch(() => void 0);
			toast.success("Link in die Zwischenablage kopiert (gültig bis " + new Date(d.expiresAt).toLocaleTimeString("de-DE") + ").");
		} catch {
			toast.danger("Link konnte nicht erstellt werden.");
		}
	}
	if (forbidden) return /* @__PURE__ */ jsx("p", {
		className: "tds-empty",
		children: "Kein Zugriff auf Dokumente."
	});
	if (error && docs === null) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: error
	});
	if (docs === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsxs("label", {
					className: "btn btn-primary",
					"aria-busy": uploading,
					children: [
						uploading ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : null,
						uploading ? "Wird hochgeladen …" : "Datei hochladen",
						/* @__PURE__ */ jsx("input", {
							ref: fileRef,
							type: "file",
							onChange: upload,
							disabled: uploading,
							hidden: true
						})
					]
				})
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: error
			}),
			notice && /* @__PURE__ */ jsx("p", {
				className: "tds-alert",
				role: "status",
				children: notice
			}),
			docs.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch keine Dokumente."
			}) : /* @__PURE__ */ jsxs("table", {
				className: "tds-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Name" }),
					/* @__PURE__ */ jsx("th", { children: "Größe" }),
					/* @__PURE__ */ jsx("th", { children: "Hochgeladen" }),
					/* @__PURE__ */ jsx("th", {})
				] }) }), /* @__PURE__ */ jsx("tbody", { children: docs.map((d) => /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", {
						className: "break-words",
						children: renamingId === d.id ? /* @__PURE__ */ jsxs("span", {
							className: "tds-row",
							children: [
								/* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									value: renameDraft,
									onChange: (e) => setRenameDraft(e.target.value),
									maxLength: 255,
									"aria-label": "Neuer Dateiname"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-primary",
									onClick: () => saveRename(d.id),
									children: "OK"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => setRenamingId(null),
									"aria-label": "Umbenennen abbrechen",
									children: "×"
								})
							]
						}) : d.filename
					}),
					/* @__PURE__ */ jsx("td", { children: fmtSize(d.size_bytes) }),
					/* @__PURE__ */ jsx("td", { children: fmtDate(d.uploaded_at) }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("span", {
						className: "tds-toolbar",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: `/documents/${d.id}/download`,
								children: "Download"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => {
									setRenamingId(d.id);
									setRenameDraft(d.filename);
								},
								children: "Umbenennen"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => share(d.id),
								children: "Link teilen"
							})
						]
					}) })
				] }, d.id)) })]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-documents/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Dokumente</h1></div>${renderComponent($$result, "DocumentList", DocumentList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-documents/islands/DocumentList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-documents/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/documents.astro
var documents_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Documents,
	file: () => $$file,
	url: () => void 0
});
var $$Documents = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dokumente" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/documents.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/documents.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/documents@_@astro
var page = () => documents_exports;
//#endregion
export { page };
