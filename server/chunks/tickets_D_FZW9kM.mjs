import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/design/index.js
var SEMANTIC_CHIP_VARIANTS = [
	"neutral",
	"success",
	"warning",
	"danger",
	"info"
];
var CATEGORICAL_CHIP_VARIANTS = [
	"cat-violet",
	"cat-teal",
	"cat-amber",
	"cat-rose",
	"cat-cyan"
];
var CHIP_VARIANTS = [...SEMANTIC_CHIP_VARIANTS, ...CATEGORICAL_CHIP_VARIANTS];
var CHIP_ALIASES = {
	violet: "cat-violet",
	purple: "cat-violet",
	teal: "cat-teal",
	green: "success",
	amber: "cat-amber",
	orange: "cat-amber",
	yellow: "warning",
	rose: "cat-rose",
	pink: "cat-rose",
	red: "danger",
	cyan: "cat-cyan",
	blue: "info",
	grey: "neutral",
	gray: "neutral"
};
var VARIANT_SET = new Set(CHIP_VARIANTS);
function resolveChipVariant(color, fallback = "neutral") {
	const key = (color ?? "").trim().toLowerCase();
	if (VARIANT_SET.has(key)) return `chip--${key}`;
	const aliased = CHIP_ALIASES[key];
	if (aliased) return `chip--${aliased}`;
	return `chip--${fallback}`;
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/TicketBoard.tsx
var api = apiFetch;
/**
* Portal ticket board (checkpoint-2): the customer's list + detail + comment
* thread + new-ticket form. Admin triage lives behind /admin/tickets (admin
* product). Uses relative fetches with credentials; the shared api client +
* skeletons are wired when the host chrome lands.
*/
function TicketBoard() {
	const [tickets, setTickets] = useState(null);
	const [detail, setDetail] = useState(null);
	const [creating, setCreating] = useState(false);
	const loadList = () => api("/tickets").then((r) => r.ok ? r.json() : { tickets: [] }).then((d) => setTickets(d.tickets ?? [])).catch(() => setTickets([]));
	useEffect(() => {
		loadList();
	}, []);
	const openTicket = (id) => api(`/tickets/${id}`).then((r) => r.ok ? r.json() : null).then((d) => setDetail(d));
	if (detail) return /* @__PURE__ */ jsx(TicketDetailView, {
		ticket: detail,
		onBack: () => {
			setDetail(null);
			loadList();
		},
		onReload: () => openTicket(detail.id)
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: creating ? "btn btn-ghost" : "btn btn-primary",
					onClick: () => setCreating((v) => !v),
					children: creating ? "Abbrechen" : "Neues Ticket"
				})
			}),
			creating ? /* @__PURE__ */ jsx(NewTicketForm, { onCreated: () => {
				setCreating(false);
				loadList();
			} }) : null,
			tickets === null ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : tickets.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Keine Tickets vorhanden."
			}) : /* @__PURE__ */ jsx("ul", {
				className: "tds-list",
				children: tickets.map((t) => /* @__PURE__ */ jsxs("li", {
					className: "tds-list__row",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => openTicket(t.id),
							children: t.subject
						}),
						/* @__PURE__ */ jsx("span", {
							className: `chip ${resolveChipVariant(t.status_color)}`,
							children: t.status_name
						}),
						t.customer_action_required ? /* @__PURE__ */ jsx("span", {
							className: "chip chip--warning",
							children: "Aktion erforderlich"
						}) : null
					]
				}, t.id))
			})
		]
	});
}
function TicketDetailView({ ticket, onBack, onReload }) {
	const [reply, setReply] = useState("");
	const [sending, setSending] = useState(false);
	const send = async () => {
		if (reply.trim() === "") return;
		setSending(true);
		try {
			const res = await api(`/tickets/${ticket.id}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ body: reply.trim() })
			});
			if (res.ok) {
				setReply("");
				onReload();
			} else toast.danger(`Antwort konnte nicht gesendet werden (HTTP ${res.status}).`);
		} catch {
			toast.danger("Antwort konnte nicht gesendet werden — die API ist nicht erreichbar.");
		} finally {
			setSending(false);
		}
	};
	const upload = async (file) => {
		const form = new FormData();
		form.append("file", file);
		try {
			const res = await api(`/tickets/${ticket.id}/attachments`, {
				method: "POST",
				body: form
			});
			if (res.ok) {
				toast.success(`„${file.name}" hochgeladen.`);
				onReload();
			} else toast.danger(`Upload fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			toast.danger("Upload fehlgeschlagen — die API ist nicht erreichbar.");
		}
	};
	return /* @__PURE__ */ jsxs("article", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: onBack,
				children: "← Zurück"
			}),
			/* @__PURE__ */ jsx("h2", { children: ticket.subject }),
			/* @__PURE__ */ jsx("span", {
				className: `chip ${resolveChipVariant(ticket.status_color)}`,
				children: ticket.status_name
			}),
			ticket.customer_action_required ? /* @__PURE__ */ jsxs("p", {
				className: "ticket-detail__action",
				children: [
					/* @__PURE__ */ jsx("strong", { children: "Aktion erforderlich:" }),
					" ",
					ticket.customer_action_note ?? "Bitte antworten Sie."
				]
			}) : null,
			/* @__PURE__ */ jsx("p", {
				className: "ticket-detail__description",
				children: ticket.description
			}),
			ticket.attachments.length > 0 ? /* @__PURE__ */ jsx("ul", {
				className: "ticket-attachments",
				children: ticket.attachments.map((a) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
					href: `/tickets/${ticket.id}/attachments/${a.id}`,
					download: true,
					children: a.filename
				}) }, a.id))
			}) : null,
			/* @__PURE__ */ jsx("ol", {
				className: "tds-thread",
				children: ticket.comments.map((c) => /* @__PURE__ */ jsxs("li", {
					className: `tds-thread__item ${c.author_type === "owner" ? "tds-thread__item--other" : "tds-thread__item--own"}`,
					children: [/* @__PURE__ */ jsx("span", {
						className: "tds-thread__author",
						children: c.author_type === "owner" ? "Support" : "Sie"
					}), /* @__PURE__ */ jsx("p", { children: c.body })]
				}, c.id))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-compose",
				children: [
					/* @__PURE__ */ jsx("textarea", {
						className: "field-boxed",
						value: reply,
						onChange: (e) => setReply(e.target.value),
						placeholder: "Antwort schreiben …",
						rows: 3
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "btn btn-primary",
						onClick: send,
						disabled: sending || reply.trim() === "",
						"aria-busy": sending,
						children: [sending ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : null, "Senden"]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "ticket-reply__attach",
						children: ["Datei anhängen", /* @__PURE__ */ jsx("input", {
							type: "file",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) upload(f);
								e.target.value = "";
							}
						})]
					})
				]
			})
		]
	});
}
function NewTicketForm({ onCreated }) {
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState("question");
	const [priority, setPriority] = useState("normal");
	const [saving, setSaving] = useState(false);
	const submit = async () => {
		if (subject.trim() === "" || description.trim() === "") return;
		setSaving(true);
		try {
			const res = await api("/tickets", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					subject,
					description,
					type,
					priority
				})
			});
			if (res.ok) {
				toast.success("Ticket erstellt.");
				onCreated();
			} else toast.danger(`Ticket konnte nicht erstellt werden (HTTP ${res.status}).`);
		} catch {
			toast.danger("Ticket konnte nicht erstellt werden — die API ist nicht erreichbar.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ jsxs("form", {
		className: "tds-card tds-stack",
		onSubmit: (e) => {
			e.preventDefault();
			submit();
		},
		children: [
			/* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				value: subject,
				onChange: (e) => setSubject(e.target.value),
				placeholder: "Betreff",
				required: true
			}),
			/* @__PURE__ */ jsx("textarea", {
				className: "field-boxed",
				value: description,
				onChange: (e) => setDescription(e.target.value),
				placeholder: "Beschreibung",
				rows: 4,
				required: true
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-row",
				children: [/* @__PURE__ */ jsxs("select", {
					className: "field-boxed",
					value: type,
					onChange: (e) => setType(e.target.value),
					"aria-label": "Typ",
					children: [
						/* @__PURE__ */ jsx("option", {
							value: "question",
							children: "Frage"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "bug",
							children: "Fehler"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "feature",
							children: "Wunsch"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "other",
							children: "Sonstiges"
						})
					]
				}), /* @__PURE__ */ jsxs("select", {
					className: "field-boxed",
					value: priority,
					onChange: (e) => setPriority(e.target.value),
					"aria-label": "Priorität",
					children: [
						/* @__PURE__ */ jsx("option", {
							value: "low",
							children: "Niedrig"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "normal",
							children: "Normal"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "high",
							children: "Hoch"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "urgent",
							children: "Dringend"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("button", {
				type: "submit",
				className: "btn btn-primary",
				disabled: saving,
				"aria-busy": saving,
				children: [saving ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : null, "Ticket erstellen"]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-support-tickets/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Support-Tickets</h1></div>${renderComponent($$result, "TicketBoard", TicketBoard, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/TicketBoard.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/tickets.astro
var tickets_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Tickets,
	file: () => $$file,
	url: () => void 0
});
var $$Tickets = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tickets" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/tickets.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/tickets.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/tickets@_@astro
var page = () => tickets_exports;
//#endregion
export { page };
