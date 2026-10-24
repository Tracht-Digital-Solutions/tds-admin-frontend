import { a as renderComponent, et as __exportAll, f as renderTemplate, p as maybeRenderHead } from "./server_Cdzh4AE6.mjs";
import { n as createComponent } from "./compiler_CX02AaCz.mjs";
import { B as toast, C as Spinner, N as sendJson, k as apiFetch, t as $$Layout } from "./Layout_D80p1pEh.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { a as Presence, n as AnimatedList, o as TabIndicator, r as Collapse, t as AnimatedItem } from "./chunk-ERSKINIL_BaF4IMQk.mjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/grouping.ts
/**
* Public suffixes that are two labels long and actually occur in this inbox's
* mail. Deliberately a short hand-kept list rather than a Public Suffix List
* dependency: the customer base is effectively `.de`, and shipping (and
* refreshing) the full PSL to shorten a group heading is not a trade worth
* making. A suffix that is missing here only costs a slightly longer label —
* `firma.co.nz` groups as `co.nz` instead of `firma.co.nz` — never a wrong
* group, because the mapping stays deterministic.
*/
var MULTI_LABEL_SUFFIXES = /* @__PURE__ */ new Set([
	"co.uk",
	"org.uk",
	"ac.uk",
	"gov.uk",
	"com.au",
	"net.au",
	"org.au",
	"co.jp",
	"com.br",
	"co.za",
	"com.tr",
	"com.pl",
	"co.nz"
]);
/**
* Mailbox providers, so a domain group can say so.
*
* Ten `gmx.de` addresses are ten unrelated people; without the marker the group
* heading reads exactly like a company with ten employees writing in.
*/
var FREEMAIL = /* @__PURE__ */ new Set([
	"gmail.com",
	"googlemail.com",
	"gmx.de",
	"gmx.net",
	"gmx.at",
	"gmx.ch",
	"web.de",
	"t-online.de",
	"freenet.de",
	"outlook.com",
	"outlook.de",
	"hotmail.com",
	"hotmail.de",
	"live.com",
	"live.de",
	"yahoo.com",
	"yahoo.de",
	"icloud.com",
	"me.com",
	"aol.com",
	"posteo.de",
	"mailbox.org",
	"protonmail.com",
	"proton.me"
]);
/** The host part of an address, lowercased. `""` when there isn't one. */
function emailHost(email) {
	const at = String(email ?? "").lastIndexOf("@");
	if (at < 0) return "";
	return email.slice(at + 1).trim().toLowerCase();
}
/**
* The registrable ("main") domain of an address — `mail.firma.co.uk` →
* `firma.co.uk`, `info@firma.de` → `firma.de`.
*
* This is what "gruppieren nach Hauptdomain" means: everyone writing from the
* same organisation lands in one group regardless of which mail subdomain they
* happen to use.
*/
function registrableDomain(email) {
	const host = emailHost(email);
	if (host === "") return "";
	const labels = host.split(".").filter(Boolean);
	if (labels.length <= 2) return labels.join(".");
	const lastTwo = labels.slice(-2).join(".");
	if (MULTI_LABEL_SUFFIXES.has(lastTwo)) return labels.slice(-3).join(".");
	return lastTwo;
}
function isFreemail(domain) {
	return FREEMAIL.has(domain);
}
/** The German label for each grouping mode, for the select. */
var GROUP_LABELS = {
	"": "Keine Gruppierung",
	email: "E-Mail",
	name: "Name",
	company: "Firma",
	domain: "Hauptdomain"
};
var EMPTY_LABEL = {
	"": "",
	email: "Ohne E-Mail",
	name: "Ohne Namen",
	company: "Ohne Firma",
	domain: "Ohne Domain"
};
/**
* Bucket rows by the chosen key, preserving the server's order both between
* groups (first appearance wins) and inside them.
*
* Preserving order matters: the server sorted by whatever the user picked, and
* re-sorting the groups alphabetically here would quietly override that.
*/
function groupMessages(items, by) {
	if (by === "") return [{
		key: "",
		label: "",
		freemail: false,
		items
	}];
	const buckets = /* @__PURE__ */ new Map();
	for (const item of items) {
		const raw = by === "email" ? String(item.email ?? "").trim().toLowerCase() : by === "name" ? String(item.name ?? "").trim() : by === "company" ? String(item.company ?? "").trim() : registrableDomain(item.email);
		const key = raw === "" ? "\0empty" : raw;
		let bucket = buckets.get(key);
		if (bucket === void 0) {
			bucket = {
				key,
				label: raw === "" ? EMPTY_LABEL[by] : raw,
				freemail: by === "domain" && raw !== "" && isFreemail(raw),
				items: []
			};
			buckets.set(key, bucket);
		}
		bucket.items.push(item);
	}
	return [...buckets.values()];
}
// node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/ContactInbox.tsx
/**
* Never a bare relative path: the panel is a static site on its own host, so
* `fetch("/contact/messages")` would hit the product host, get the SPA
* fallback HTML with a 200, and end up in the catch below as an empty inbox.
*/
/** Sort options, in the order the select offers them. */
var SORTS = [
	{
		value: "created_at",
		dir: "desc",
		label: "Neueste zuerst"
	},
	{
		value: "created_at",
		dir: "asc",
		label: "Älteste zuerst"
	},
	{
		value: "name",
		dir: "asc",
		label: "Name A–Z"
	},
	{
		value: "name",
		dir: "desc",
		label: "Name Z–A"
	},
	{
		value: "email",
		dir: "asc",
		label: "E-Mail A–Z"
	},
	{
		value: "company",
		dir: "asc",
		label: "Firma A–Z"
	},
	{
		value: "status",
		dir: "asc",
		label: "Status"
	}
];
var STATUS_CHIPS = [
	{
		value: "new",
		label: "Neu"
	},
	{
		value: "handled",
		label: "Erledigt"
	},
	{
		value: "spam",
		label: "Spam"
	},
	{
		value: "",
		label: "Alle"
	}
];
/**
* Contact-form inbox: list + status filter + free-text search + sorting +
* grouping, and the detail view (full body, reply history, email reply).
*
* Live: the shell's notification poller dispatches `tds:notification` for every
* new request, so an inbox left open updates itself instead of going stale
* behind a toast that says something arrived.
*/
function ContactInbox() {
	const [messages, setMessages] = useState(null);
	const [filter, setFilter] = useState("new");
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	const [sortIndex, setSortIndex] = useState(0);
	const [groupBy, setGroupBy] = useState("");
	const [failed, setFailed] = useState(false);
	const [openId, setOpenId] = useState(null);
	useEffect(() => {
		const t = setTimeout(() => setQuery(search.trim()), 300);
		return () => clearTimeout(t);
	}, [search]);
	const sort = SORTS[sortIndex] ?? SORTS[0];
	const load = useCallback(async () => {
		const params = new URLSearchParams();
		if (filter) params.set("status", filter);
		if (query) params.set("q", query);
		params.set("sort", sort.value);
		params.set("dir", sort.dir);
		try {
			const res = await apiFetch(`/contact/messages?${params}`);
			if (!res.ok) {
				setFailed(true);
				setMessages([]);
				return;
			}
			const data = await res.json();
			setFailed(false);
			setMessages(data.messages ?? []);
		} catch {
			setFailed(true);
			setMessages([]);
		}
	}, [
		filter,
		query,
		sort.value,
		sort.dir
	]);
	useEffect(() => {
		load();
	}, [load]);
	useEffect(() => {
		const onNotification = (event) => {
			if (event.detail?.module === "contact-tickets") load();
		};
		window.addEventListener("tds:notification", onNotification);
		return () => window.removeEventListener("tds:notification", onNotification);
	}, [load]);
	const setStatus = async (m, status) => {
		const res = await sendJson(`/contact/messages/${m.id}`, "PATCH", { status }).catch(() => null);
		if (res === null) {
			toast.danger("Status konnte nicht geändert werden — die API ist nicht erreichbar.");
			return;
		}
		if (!res.ok) {
			toast.danger(`Status konnte nicht geändert werden (HTTP ${res.status}).`);
			return;
		}
		load();
	};
	const groups = useMemo(() => groupMessages(messages ?? [], groupBy), [messages, groupBy]);
	const inbox = /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: STATUS_CHIPS.map((s) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: `chip tds-tab chip--${filter === s.value ? "info" : "neutral"}`,
					"aria-pressed": filter === s.value,
					onClick: () => setFilter(s.value),
					children: [s.label, filter === s.value ? /* @__PURE__ */ jsx(TabIndicator, { group: "contact-status" }) : null]
				}, s.value || "all"))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: ["Suche", /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "search",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Name, E-Mail, Firma, Betreff …"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: ["Sortierung", /* @__PURE__ */ jsx("select", {
							className: "field-boxed",
							value: String(sortIndex),
							onChange: (e) => setSortIndex(Number(e.target.value)),
							children: SORTS.map((s, i) => /* @__PURE__ */ jsx("option", {
								value: i,
								children: s.label
							}, `${s.value}-${s.dir}`))
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: ["Gruppieren", /* @__PURE__ */ jsx("select", {
							className: "field-boxed",
							value: groupBy,
							onChange: (e) => setGroupBy(e.target.value),
							children: Object.keys(GROUP_LABELS).map((key) => /* @__PURE__ */ jsx("option", {
								value: key,
								children: GROUP_LABELS[key]
							}, key || "none"))
						})]
					})
				]
			}),
			failed ? /* @__PURE__ */ jsx(Alert, { children: "Anfragen konnten nicht geladen werden." }) : null,
			messages === null ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : messages.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: failed ? "Keine Daten." : query ? "Keine Treffer." : "Keine Anfragen."
			}) : groups.map((group) => /* @__PURE__ */ jsx(GroupSection, {
				group,
				grouped: groupBy !== "",
				children: /* @__PURE__ */ jsx(AnimatedList, {
					className: "tds-list",
					children: group.items.map((m) => /* @__PURE__ */ jsx(Row, {
						message: m,
						onOpen: () => setOpenId(m.id),
						onStatus: setStatus
					}, m.id))
				})
			}, group.key))
		]
	});
	return /* @__PURE__ */ jsx(Presence, {
		view: openId === null ? "inbox" : `message-${openId}`,
		children: openId !== null ? /* @__PURE__ */ jsx(MessageView, {
			id: openId,
			onBack: () => {
				setOpenId(null);
				load();
			}
		}) : inbox
	});
}
function GroupSection({ group, grouped, children }) {
	if (!grouped) return /* @__PURE__ */ jsx(Fragment$1, { children });
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-stack tds-stack--tight",
		children: [/* @__PURE__ */ jsxs("h3", {
			className: "tds-row",
			children: [
				/* @__PURE__ */ jsx("span", { children: group.label }),
				/* @__PURE__ */ jsx("span", {
					className: "chip chip--neutral",
					children: group.items.length
				}),
				group.freemail ? /* @__PURE__ */ jsx("span", {
					className: "chip chip--warning",
					children: "Freemail"
				}) : null
			]
		}), children]
	});
}
function Row({ message: m, onOpen, onStatus }) {
	const secondary = m.subject || m.excerpt || null;
	return /* @__PURE__ */ jsxs(AnimatedItem, {
		className: "tds-list__row",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "btn btn-ghost tds-row",
			onClick: onOpen,
			children: [/* @__PURE__ */ jsxs("span", { children: [
				/* @__PURE__ */ jsx("strong", { children: m.name }),
				" <",
				m.email,
				">",
				m.company ? /* @__PURE__ */ jsxs("em", { children: [" · ", m.company] }) : null
			] }), secondary ? /* @__PURE__ */ jsx("span", { children: secondary }) : null]
		}), /* @__PURE__ */ jsxs("span", {
			className: "tds-toolbar",
			children: [m.status !== "handled" ? /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => onStatus(m, "handled"),
				children: "Erledigt"
			}) : null, m.status !== "spam" ? /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-danger",
				onClick: () => onStatus(m, "spam"),
				children: "Spam"
			}) : null]
		})]
	});
}
function MessageView({ id, onBack }) {
	const [msg, setMsg] = useState(null);
	const [loadFailed, setLoadFailed] = useState(false);
	const [reply, setReply] = useState("");
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const load = () => apiFetch(`/contact/messages/${id}`).then((r) => r.ok ? r.json() : Promise.reject(new Error(String(r.status)))).then((d) => {
		setMsg(d);
		setLoadFailed(false);
	}).catch(() => setLoadFailed(true));
	useEffect(() => {
		load();
	}, [id]);
	const send = async () => {
		if (reply.trim().length < 2) {
			setStatus("Antwort darf nicht leer sein.");
			return;
		}
		setBusy(true);
		setStatus(null);
		const res = await sendJson(`/contact/messages/${id}/reply`, "POST", { body: reply }).catch(() => null);
		setBusy(false);
		if (res === null) {
			toast.danger("Antwort konnte nicht gesendet werden — die API ist nicht erreichbar.");
			return;
		}
		if (res.ok) {
			setReply("");
			toast.success("Antwort gesendet.");
			setStatus(null);
			load();
		} else if (res.status === 503) setStatus("E-Mail-Versand ist nicht konfiguriert.");
		else toast.danger(`Antwort konnte nicht gesendet werden (HTTP ${res.status}).`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn-ghost",
			onClick: onBack,
			children: "← Posteingang"
		}), loadFailed ? /* @__PURE__ */ jsx(Alert, { children: "Anfrage konnte nicht geladen werden." }) : msg === null ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
			/* @__PURE__ */ jsxs("header", {
				className: "tds-row tds-row--between",
				children: [
					/* @__PURE__ */ jsx("h2", { children: msg.subject || "Ohne Betreff" }),
					/* @__PURE__ */ jsxs("p", { children: [
						/* @__PURE__ */ jsx("strong", { children: msg.name }),
						" <",
						msg.email,
						">",
						msg.company ? /* @__PURE__ */ jsxs("em", { children: [" · ", msg.company] }) : null
					] }),
					/* @__PURE__ */ jsx("span", {
						className: `chip chip--${msg.status === "new" ? "warning" : msg.status === "spam" ? "danger" : "success"}`,
						children: msg.status === "new" ? "Neu" : msg.status === "spam" ? "Spam" : "Erledigt"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "tds-stack",
				children: msg.message
			}),
			msg.replies.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "tds-stack",
				children: [/* @__PURE__ */ jsx("h3", { children: "Antworten" }), /* @__PURE__ */ jsx(AnimatedList, { children: msg.replies.map((r) => /* @__PURE__ */ jsxs(AnimatedItem, { children: [/* @__PURE__ */ jsxs("div", {
					className: "marginalia",
					children: [
						r.sent_by ?? "Admin",
						" · ",
						r.created_at
					]
				}), /* @__PURE__ */ jsx("div", { children: r.body })] }, r.id)) })]
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-compose",
				children: [
					/* @__PURE__ */ jsx("h3", { children: "Antworten" }),
					/* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						value: reply,
						onChange: (e) => setReply(e.target.value),
						rows: 8,
						placeholder: `Antwort an ${msg.name} …`
					}),
					/* @__PURE__ */ jsx(Collapse, {
						open: Boolean(status),
						children: /* @__PURE__ */ jsx(Alert, { children: status })
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "btn btn-primary",
						onClick: send,
						disabled: busy,
						"aria-busy": busy,
						children: [busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : null, "Antwort senden"]
					})
				]
			})
		] })]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Kontaktanfragen</h1></div>${renderComponent($$result, "ContactInbox", ContactInbox, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/ContactInbox.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/pages/Index.astro", void 0);
// node_modules/.tds-frontend/routes/kontakt.astro
var kontakt_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Kontakt,
	file: () => $$file,
	url: () => void 0
});
var $$Kontakt = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Kontaktanfragen" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/kontakt.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/kontakt.astro";
// \0virtual:astro:page:node_modules/.tds-frontend/routes/kontakt@_@astro
var page = () => kontakt_exports;
export { page };
