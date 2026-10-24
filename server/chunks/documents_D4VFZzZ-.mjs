import { a as renderComponent, et as __exportAll, f as renderTemplate, p as maybeRenderHead } from "./server_Cdzh4AE6.mjs";
import { n as createComponent } from "./compiler_CX02AaCz.mjs";
import { A as apiUrl, B as toast, C as Spinner, G as formatDate, N as sendJson, U as formatBytes, k as apiFetch, t as $$Layout } from "./Layout_D80p1pEh.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { t as copyText } from "./chunk-2NLUY6RS_DPKKyizg.mjs";
import { t as FileDropZone } from "./dropzone_B5rfO-1N.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-ext-documents/islands/DocumentList.tsx
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
	const load = () => apiFetch("/documents").then((r) => {
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
	async function upload(files) {
		const file = files[0];
		if (!file) return;
		setUploading(true);
		setError(null);
		try {
			const fd = new FormData();
			fd.append("file", file);
			const r = await apiFetch("/documents", {
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
		}
	}
	async function saveRename(id) {
		const name = renameDraft.trim();
		if (!name) return;
		try {
			const r = await sendJson(`/documents/${id}`, "PATCH", { filename: name });
			if (!r.ok) throw new Error(String(r.status));
			setRenamingId(null);
			await load();
		} catch {
			toast.danger("Umbenennen fehlgeschlagen.");
		}
	}
	async function share(id) {
		try {
			const r = await sendJson(`/documents/${id}/sign`, "POST", {});
			if (r.status === 503) {
				setNotice("Signierte Links sind nicht konfiguriert.");
				return;
			}
			if (!r.ok) throw new Error(String(r.status));
			const d = await r.json();
			const until = new Date(d.expiresAt).toLocaleTimeString("de-DE");
			if (await copyText(d.url)) toast.success(`Link in die Zwischenablage kopiert (gültig bis ${until}).`);
			else setNotice(`Link (gültig bis ${until}): ${d.url}`);
		} catch {
			toast.danger("Link konnte nicht erstellt werden.");
		}
	}
	if (forbidden) return /* @__PURE__ */ jsx("p", {
		className: "tds-empty",
		children: "Kein Zugriff auf Dokumente."
	});
	if (error && docs === null) return /* @__PURE__ */ jsx(Alert, { children: error });
	if (docs === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx(FileDropZone, {
				label: uploading ? "Wird hochgeladen …" : "Datei hochladen",
				hint: "oder hierher ziehen",
				activeLabel: "Loslassen zum Hochladen",
				disabled: uploading,
				onFiles: (files) => void upload(files)
			}),
			/* @__PURE__ */ jsx(Alert, { children: error }),
			/* @__PURE__ */ jsx(Alert, {
				tone: "info",
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
					/* @__PURE__ */ jsx("td", { children: formatBytes(d.size_bytes) }),
					/* @__PURE__ */ jsx("td", { children: formatDate(d.uploaded_at) }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("span", {
						className: "tds-toolbar",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: apiUrl(`/documents/${d.id}/download`),
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
// node_modules/@tracht-digital-solutions/tds-ext-documents/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Dokumente</h1></div>${renderComponent($$result, "DocumentList", DocumentList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-documents/islands/DocumentList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-documents/pages/Index.astro", void 0);
// node_modules/.tds-frontend/routes/documents.astro
var documents_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Documents,
	file: () => $$file,
	url: () => void 0
});
var $$Documents = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dokumente" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/documents.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/documents.astro";
// \0virtual:astro:page:node_modules/.tds-frontend/routes/documents@_@astro
var page = () => documents_exports;
export { page };
