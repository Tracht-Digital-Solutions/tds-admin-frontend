import { a as renderComponent, et as __exportAll, f as renderTemplate, p as maybeRenderHead } from "./server_Cdzh4AE6.mjs";
import { n as createComponent } from "./compiler_CX02AaCz.mjs";
import { B as toast, C as Spinner, K as formatDateTime, N as sendJson, k as apiFetch, t as $$Layout } from "./Layout_D80p1pEh.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { n as AnimatedList, t as AnimatedItem } from "./chunk-ERSKINIL_BaF4IMQk.mjs";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-ext-messages/islands/MessageThread.tsx
/**
* Portal message thread (ported from tds-customer-legacy-frontend Messages.tsx).
* Alternating quoted blocks: owner messages get a primary-coloured left rule,
* customer messages a hairline frame. Compose + inline edit (own/admin) reuse
* the same backend rules; a 403 renders the no-access state, a 401 is left to
* the host auth gate. Relative fetches with credentials.
*/
function MessageThread() {
	const [messages, setMessages] = useState(null);
	const [error, setError] = useState(null);
	const [forbidden, setForbidden] = useState(false);
	const [draft, setDraft] = useState("");
	const [sending, setSending] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editDraft, setEditDraft] = useState("");
	const [editSaving, setEditSaving] = useState(false);
	const endRef = useRef(null);
	const load = () => apiFetch("/messages").then((r) => {
		if (r.status === 403) {
			setForbidden(true);
			return { messages: [] };
		}
		if (!r.ok) throw new Error(String(r.status));
		return r.json();
	}).then((d) => setMessages(d.messages ?? [])).catch(() => setError("Nachrichten konnten nicht geladen werden."));
	useEffect(() => {
		load();
	}, []);
	useEffect(() => {
		endRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
	}, [messages]);
	async function send(e) {
		e.preventDefault();
		const text = draft.trim();
		if (!text || sending) return;
		setSending(true);
		try {
			const r = await sendJson("/messages", "POST", { body: text });
			if (!r.ok) throw new Error(String(r.status));
			setDraft("");
			await load();
		} catch {
			toast.danger("Nachricht konnte nicht gesendet werden.");
		} finally {
			setSending(false);
		}
	}
	async function saveEdit(id) {
		const text = editDraft.trim();
		if (!text || editSaving) return;
		setEditSaving(true);
		try {
			const r = await sendJson(`/messages/${id}`, "PATCH", { body: text });
			if (!r.ok) throw new Error(String(r.status));
			setEditingId(null);
			await load();
		} catch {
			toast.danger("Änderung konnte nicht gespeichert werden.");
		} finally {
			setEditSaving(false);
		}
	}
	if (forbidden) return /* @__PURE__ */ jsx("p", {
		className: "marginalia",
		children: "Kein Zugriff auf Nachrichten."
	});
	if (error && messages === null) return /* @__PURE__ */ jsx(Alert, { children: error });
	if (messages === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "message-thread",
		children: [
			/* @__PURE__ */ jsx(Alert, { children: error }),
			messages.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Noch keine Nachrichten."
			}),
			/* @__PURE__ */ jsx(AnimatedList, {
				as: "ol",
				className: "tds-thread",
				children: messages.map((m) => /* @__PURE__ */ jsxs(AnimatedItem, {
					className: `tds-thread__item ${m.author_type === "owner" ? "tds-thread__item--other" : "tds-thread__item--own"}`,
					children: [/* @__PURE__ */ jsxs("header", {
						className: "tds-row marginalia",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "tds-thread__author",
								children: m.author_type === "owner" ? "Julian" : "Sie"
							}),
							/* @__PURE__ */ jsx("time", {
								dateTime: m.created_at,
								children: formatDateTime(m.created_at, { fallback: m.created_at })
							}),
							m.edited_at && /* @__PURE__ */ jsx("span", {
								className: "marginalia",
								children: "(bearbeitet)"
							})
						]
					}), editingId === m.id ? /* @__PURE__ */ jsxs("div", {
						className: "tds-compose",
						children: [/* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							value: editDraft,
							onChange: (e) => setEditDraft(e.target.value),
							rows: 3,
							"aria-label": "Nachricht bearbeiten"
						}), /* @__PURE__ */ jsxs("div", {
							className: "tds-compose__actions",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "btn btn-primary",
								onClick: () => saveEdit(m.id),
								disabled: editSaving,
								"aria-busy": editSaving,
								children: [editSaving ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : null, "Speichern"]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => setEditingId(null),
								disabled: editSaving,
								children: "Abbrechen"
							})]
						})]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "tds-stack",
						children: [m.body.split("\n").map((line, i) => /* @__PURE__ */ jsx("p", { children: line }, i)), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => {
								setEditingId(m.id);
								setEditDraft(m.body);
							},
							children: "Bearbeiten"
						})]
					})]
				}, m.id))
			}),
			/* @__PURE__ */ jsx("div", { ref: endRef }),
			/* @__PURE__ */ jsxs("form", {
				className: "tds-compose",
				onSubmit: send,
				children: [/* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					"aria-label": "Nachricht",
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "Nachricht schreiben …",
					rows: 3,
					maxLength: 1e4
				}), /* @__PURE__ */ jsxs("button", {
					type: "submit",
					className: "btn btn-primary",
					disabled: sending || draft.trim() === "",
					"aria-busy": sending,
					children: [sending ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : null, "Senden"]
				})]
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-messages/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Nachrichten</h1></div>${renderComponent($$result, "MessageThread", MessageThread, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-messages/islands/MessageThread.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-messages/pages/Index.astro", void 0);
// node_modules/.tds-frontend/routes/messages.astro
var messages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Messages,
	file: () => $$file,
	url: () => void 0
});
var $$Messages = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nachrichten" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/messages.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/messages.astro";
// \0virtual:astro:page:node_modules/.tds-frontend/routes/messages@_@astro
var page = () => messages_exports;
export { page };
