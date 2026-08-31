import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, t as $$Layout } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/LiveChatManager.tsx
/**
* Admin surface for the Live-Chat-CTA: the visitor-session inbox (list + thread
* + reply), polling the open thread every ~4s so an agent sees new visitor
* messages live. Polling rather than SSE/WebSockets because the production host
* is PHP-FPM behind Plesk with no long-lived workers.
*
* The FAQ and handbook editors used to be two more tabs here. They now live on
* their own page (`WikiContentManager`, route `/wiki-inhalte`): those rows are
* the customer portal's Wiki, so editing them is content publishing rather than
* support work, and it is granted separately (`wiki:*` vs `live-chat:*`).
*/
var api = apiFetch;
var POLL_MS = 4e3;
function LiveChatManager() {
	return /* @__PURE__ */ jsx("div", {
		className: "live-chat-manager",
		children: /* @__PURE__ */ jsx(ChatsTab, {})
	});
}
function ChatsTab() {
	const [sessions, setSessions] = useState([]);
	const [filter, setFilter] = useState("open");
	const [selected, setSelected] = useState(null);
	const loadSessions = useCallback(async () => {
		const res = await api(`/admin/live-chat-cta/sessions${filter ? `?status=${filter}` : ""}`);
		if (res.ok) setSessions((await res.json()).sessions ?? []);
	}, [filter]);
	useEffect(() => {
		loadSessions();
	}, [loadSessions]);
	return /* @__PURE__ */ jsxs("div", {
		className: "chats grid gap-4 md:grid-cols-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "tds-stack min-w-0",
			children: [/* @__PURE__ */ jsx("div", {
				className: "tds-row",
				children: [
					"open",
					"closed",
					""
				].map((f) => /* @__PURE__ */ jsx("button", {
					type: "button",
					className: filter === f ? "chip chip-active" : "chip",
					onClick: () => setFilter(f),
					children: f === "open" ? "Offen" : f === "closed" ? "Geschlossen" : "Alle"
				}, f || "all"))
			}), sessions.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Keine Chats."
			}) : /* @__PURE__ */ jsx("ul", { children: sessions.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
				type: "button",
				className: selected === s.id ? "btn btn-ghost tds-row is-active" : "btn btn-ghost tds-row",
				onClick: () => setSelected(s.id),
				children: [
					/* @__PURE__ */ jsx("strong", { children: s.visitor_name || s.visitor_email || `Besucher #${s.id}` }),
					/* @__PURE__ */ jsxs("span", {
						className: "marginalia",
						children: [
							s.frontend ?? "–",
							" · ",
							s.message_count,
							" · ",
							new Date(s.last_activity_at).toLocaleString("de-DE")
						]
					}),
					s.status === "open" ? /* @__PURE__ */ jsx("span", {
						className: "chip chip--info",
						children: "offen"
					}) : null
				]
			}) }, s.id)) })]
		}), /* @__PURE__ */ jsx("div", {
			className: "tds-stack min-w-0 md:col-span-2",
			children: selected === null ? /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Chat auswählen …"
			}) : /* @__PURE__ */ jsx(ChatThread, {
				sessionId: selected,
				onChanged: loadSessions
			})
		})]
	});
}
function ChatThread({ sessionId, onChanged }) {
	const [messages, setMessages] = useState([]);
	const [status, setStatus] = useState("open");
	const [reply, setReply] = useState("");
	const [busy, setBusy] = useState(false);
	const endRef = useRef(null);
	const load = useCallback(async () => {
		const res = await api(`/admin/live-chat-cta/sessions/${sessionId}`);
		if (res.ok) {
			const d = await res.json();
			setMessages(d.messages ?? []);
			setStatus(d.status ?? "open");
		}
	}, [sessionId]);
	useEffect(() => {
		load();
		const t = setInterval(() => void load(), POLL_MS);
		return () => clearInterval(t);
	}, [load]);
	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	const send = async () => {
		const body = reply.trim();
		if (!body) return;
		setBusy(true);
		const res = await api(`/admin/live-chat-cta/sessions/${sessionId}/reply`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ body })
		});
		setBusy(false);
		if (res.ok) {
			setReply("");
			await load();
		} else toast.danger(`Antwort konnte nicht gesendet werden (HTTP ${res.status}).`);
	};
	const toggleStatus = async () => {
		const next = status === "open" ? "closed" : "open";
		const res = await api(`/admin/live-chat-cta/sessions/${sessionId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status: next })
		});
		if (res.ok) {
			setStatus(next);
			onChanged();
		} else toast.danger(`Status konnte nicht geändert werden (HTTP ${res.status}).`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "thread",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "tds-row tds-row--between",
				children: [/* @__PURE__ */ jsx("span", {
					className: `chip ${status === "open" ? "chip--info" : "chip--neutral"}`,
					children: status === "open" ? "offen" : "geschlossen"
				}), /* @__PURE__ */ jsx("button", {
					className: "btn btn-ghost",
					type: "button",
					onClick: toggleStatus,
					children: status === "open" ? "Schließen" : "Wieder öffnen"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-thread",
				children: [messages.map((m) => /* @__PURE__ */ jsxs("div", {
					className: `tds-thread__item ${m.author === "agent" ? "tds-thread__item--own" : "tds-thread__item--other"}`,
					children: [/* @__PURE__ */ jsx("p", { children: m.body }), /* @__PURE__ */ jsx("time", { children: new Date(m.created_at).toLocaleTimeString("de-DE") })]
				}, m.id)), /* @__PURE__ */ jsx("div", { ref: endRef })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-compose",
				children: [/* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					value: reply,
					onChange: (e) => setReply(e.target.value),
					placeholder: "Antwort schreiben …",
					rows: 2,
					onKeyDown: (e) => {
						if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
					}
				}), /* @__PURE__ */ jsx("button", {
					className: "btn btn-primary",
					type: "button",
					onClick: send,
					disabled: busy || !reply.trim(),
					children: "Senden"
				})]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Live-Chat</h1></div><p class="tds-page__lede">Besucheranfragen aus dem Support-Widget beantworten. FAQs und Handbücher werden unter <em>Wiki-Inhalte</em> gepflegt.</p>${renderComponent($$result, "LiveChatManager", LiveChatManager, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/LiveChatManager.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/live_chat.astro
var live_chat_exports = /* @__PURE__ */ __exportAll({
	default: () => $$LiveChat,
	file: () => $$file,
	url: () => void 0
});
var $$LiveChat = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Live-Chat" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/live_chat.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/live_chat.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/live_chat@_@astro
var page = () => live_chat_exports;
//#endregion
export { page };
