import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-messages/islands/MessageThread.tsx
var api = apiFetch;
var fmt = (iso) => {
	const d = new Date(iso.replace(" ", "T"));
	return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("de-DE", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
};
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
	const load = () => api("/messages").then((r) => {
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
			const r = await api("/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ body: text })
			});
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
			const r = await api(`/messages/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ body: text })
			});
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
	if (error && messages === null) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: error
	});
	if (messages === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "message-thread",
		children: [
			error && /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: error
			}),
			messages.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Noch keine Nachrichten."
			}),
			/* @__PURE__ */ jsx("ol", {
				className: "tds-thread",
				children: messages.map((m) => /* @__PURE__ */ jsxs("li", {
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
								children: fmt(m.created_at)
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
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-messages/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Nachrichten</h1></div>${renderComponent($$result, "MessageThread", MessageThread, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-messages/islands/MessageThread.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-messages/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/messages.astro
var messages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Messages,
	file: () => $$file,
	url: () => void 0
});
var $$Messages = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nachrichten" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/messages.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/messages.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/messages@_@astro
var page = () => messages_exports;
//#endregion
export { page };
