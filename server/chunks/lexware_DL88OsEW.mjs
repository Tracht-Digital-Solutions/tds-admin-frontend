import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, t as $$Layout } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/LexwareHub.tsx
var api = apiFetch;
var fmtHours = (min) => (min / 60).toFixed(2).replace(".", ",");
function LexwareHub() {
	const [tab, setTab] = useState("customers");
	return /* @__PURE__ */ jsxs("div", {
		className: "lexware-hub",
		children: [/* @__PURE__ */ jsx("nav", {
			className: "tds-toolbar",
			role: "tablist",
			children: [
				["customers", "Kunden"],
				["time", "Zeit zuordnen"],
				["contacts", "Kontakte"],
				["invoices", "Rechnungen"]
			].map(([id, label]) => /* @__PURE__ */ jsx("button", {
				type: "button",
				role: "tab",
				"aria-selected": tab === id,
				className: tab === id ? "chip chip-active" : "chip",
				onClick: () => setTab(id),
				children: label
			}, id))
		}), /* @__PURE__ */ jsxs("div", {
			className: "lexware-tabpanel",
			children: [
				tab === "customers" ? /* @__PURE__ */ jsx(CustomersTab, {}) : null,
				tab === "time" ? /* @__PURE__ */ jsx(TimeTab, {}) : null,
				tab === "contacts" ? /* @__PURE__ */ jsx(ContactsTab, {}) : null,
				tab === "invoices" ? /* @__PURE__ */ jsx(InvoicesTab, {}) : null
			]
		})]
	});
}
/** Customer + project directory. */
function CustomersTab() {
	const [customers, setCustomers] = useState([]);
	const [selected, setSelected] = useState(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [rate, setRate] = useState("");
	const [status, setStatus] = useState(null);
	const load = async () => {
		const res = await api("/lexware/customers");
		if (res.ok) setCustomers((await res.json()).customers ?? []);
	};
	useEffect(() => {
		load();
	}, []);
	const open = async (id) => {
		const res = await api(`/lexware/customers/${id}`);
		if (res.ok) setSelected(await res.json());
	};
	const addCustomer = async () => {
		if (name.trim() === "") return;
		const res = await api("/lexware/customers", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				email,
				default_hourly_rate: rate
			})
		});
		if (res.ok) {
			setName("");
			setEmail("");
			setRate("");
			toast.success("Kunde angelegt.");
			load();
		} else toast.danger(`Kunde konnte nicht angelegt werden (HTTP ${res.status}).`);
	};
	const pushContact = async (id) => {
		const res = await api(`/lexware/customers/${id}/push-contact`, { method: "POST" });
		const d = await res.json().catch(() => ({}));
		if (res.ok) toast.success("Kontakt in Lexware angelegt.");
		else toast.danger(`Hand-off an Lexware fehlgeschlagen: ${d.error ?? `HTTP ${res.status}`}`);
		open(id);
		load();
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "lexware-customers grid gap-4 md:grid-cols-2",
		children: [/* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("h4", { children: "Kunden" }),
			/* @__PURE__ */ jsxs("ul", {
				className: "tds-list",
				children: [customers.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn-ghost tds-list__row",
					onClick: () => void open(c.id),
					children: [
						/* @__PURE__ */ jsx("strong", { children: c.name }),
						/* @__PURE__ */ jsxs("span", {
							className: "opacity-70",
							children: [
								" · ",
								c.project_count ?? 0,
								" Projekte"
							]
						}),
						c.lexware_contact_id ? /* @__PURE__ */ jsx("span", {
							className: "chip chip--success",
							children: " Lexware"
						}) : null
					]
				}) }, c.id)), customers.length === 0 ? /* @__PURE__ */ jsx("li", {
					className: "opacity-70",
					children: "Noch keine Kunden."
				}) : null]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-card tds-stack",
				children: [
					/* @__PURE__ */ jsx("h5", { children: "Neuer Kunde" }),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						placeholder: "Name",
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "email",
						placeholder: "E-Mail (optional)",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "number",
						min: "0",
						step: "0.01",
						placeholder: "Stundensatz netto (optional)",
						value: rate,
						onChange: (e) => setRate(e.target.value)
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: addCustomer,
						children: "Anlegen"
					})
				]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null
		] }), /* @__PURE__ */ jsx("div", { children: selected ? /* @__PURE__ */ jsx(CustomerDetail, {
			customer: selected,
			onChanged: () => void open(selected.id),
			onPush: () => void pushContact(selected.id)
		}) : /* @__PURE__ */ jsx("p", {
			className: "opacity-70",
			children: "Kunde wählen …"
		}) })]
	});
}
function CustomerDetail({ customer, onChanged, onPush }) {
	const [title, setTitle] = useState("");
	const [rate, setRate] = useState("");
	const addProject = async () => {
		if (title.trim() === "") return;
		if ((await api(`/lexware/customers/${customer.id}/projects`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title,
				hourly_rate: rate
			})
		})).ok) {
			setTitle("");
			setRate("");
			onChanged();
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "lx-detail",
		children: [
			/* @__PURE__ */ jsx("h4", { children: customer.name }),
			/* @__PURE__ */ jsxs("p", {
				className: "opacity-80",
				children: [
					customer.email ?? "keine E-Mail",
					" ·",
					" ",
					customer.lexware_contact_id ? `Lexware-Kontakt ${customer.lexware_contact_id}` : "nicht in Lexware"
				]
			}),
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-ghost",
				type: "button",
				onClick: onPush,
				disabled: customer.lexware_contact_id !== null,
				children: customer.lexware_contact_id ? "In Lexware angelegt" : "Als Lexware-Kontakt anlegen"
			}),
			/* @__PURE__ */ jsx("h5", { children: "Projekte" }),
			/* @__PURE__ */ jsxs("ul", {
				className: "tds-list",
				children: [(customer.projects ?? []).map((p) => /* @__PURE__ */ jsxs("li", { children: [
					p.title,
					p.hourly_rate !== null ? /* @__PURE__ */ jsxs("span", {
						className: "opacity-70",
						children: [
							" · ",
							p.hourly_rate,
							" €/h"
						]
					}) : null,
					p.status === "archived" ? /* @__PURE__ */ jsx("span", {
						className: "chip",
						children: " archiviert"
					}) : null
				] }, p.id)), (customer.projects ?? []).length === 0 ? /* @__PURE__ */ jsx("li", {
					className: "opacity-70",
					children: "Noch keine Projekte."
				}) : null]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-card tds-stack",
				children: [
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						placeholder: "Projekttitel",
						value: title,
						onChange: (e) => setTitle(e.target.value)
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "number",
						min: "0",
						step: "0.01",
						placeholder: "Stundensatz (optional, überschreibt Kunde)",
						value: rate,
						onChange: (e) => setRate(e.target.value)
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: addProject,
						children: "Projekt anlegen"
					})
				]
			})
		]
	});
}
/** Reusable customer→project picker used by the time + invoice tabs. */
function ProjectPicker({ projectId, onChange }) {
	const [customers, setCustomers] = useState([]);
	const [customerId, setCustomerId] = useState(null);
	const [projects, setProjects] = useState([]);
	useEffect(() => {
		api("/lexware/customers").then(async (r) => {
			if (r.ok) setCustomers((await r.json()).customers ?? []);
		});
	}, []);
	useEffect(() => {
		if (customerId === null) {
			setProjects([]);
			return;
		}
		api(`/lexware/customers/${customerId}`).then(async (r) => {
			if (r.ok) setProjects((await r.json()).projects ?? []);
		});
	}, [customerId]);
	return /* @__PURE__ */ jsxs("div", {
		className: "lx-picker flex flex-wrap gap-3",
		children: [/* @__PURE__ */ jsxs("select", {
			className: "field-boxed",
			value: customerId ?? "",
			onChange: (e) => {
				const v = e.target.value === "" ? null : Number(e.target.value);
				setCustomerId(v);
				onChange(null);
			},
			children: [/* @__PURE__ */ jsx("option", {
				value: "",
				children: "Kunde …"
			}), customers.map((c) => /* @__PURE__ */ jsx("option", {
				value: c.id,
				children: c.name
			}, c.id))]
		}), /* @__PURE__ */ jsxs("select", {
			className: "field-boxed",
			value: projectId ?? "",
			onChange: (e) => onChange(e.target.value === "" ? null : Number(e.target.value)),
			disabled: customerId === null,
			children: [/* @__PURE__ */ jsx("option", {
				value: "",
				children: "Projekt …"
			}), projects.map((p) => /* @__PURE__ */ jsx("option", {
				value: p.id,
				children: p.title
			}, p.id))]
		})]
	});
}
/** Assign tracked time entries to a Lexware project. */
function TimeTab() {
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [entries, setEntries] = useState([]);
	const [projectId, setProjectId] = useState(null);
	const [status, setStatus] = useState(null);
	const load = async () => {
		const q = new URLSearchParams();
		if (from) q.set("from", from);
		if (to) q.set("to", to);
		const res = await api(`/lexware/time/unassigned?${q.toString()}`);
		if (res.ok) setEntries((await res.json()).entries ?? []);
	};
	useEffect(() => {
		load();
	}, []);
	const assign = async (entryId) => {
		if (projectId === null) {
			setStatus("Bitte zuerst ein Projekt wählen.");
			return;
		}
		const res = await api("/lexware/time/assign", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				timeEntryId: entryId,
				projectId
			})
		});
		if (res.ok) {
			setEntries((prev) => prev.filter((e) => e.id !== entryId));
			toast.success("Zugeordnet.");
		} else toast.danger(`Zuordnung fehlgeschlagen (HTTP ${res.status}).`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "lexware-time",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "opacity-80",
				children: "Nicht zugeordnete, abgeschlossene Zeiteinträge einem Lexware-Projekt zuweisen."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "lx-form flex flex-wrap gap-3 items-end",
				children: [
					/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Von"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value)
					})] }),
					/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Bis"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value)
					})] }),
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: () => void load(),
						children: "Filtern"
					}),
					/* @__PURE__ */ jsx(ProjectPicker, {
						projectId,
						onChange: setProjectId
					})
				]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsxs("table", {
				className: "tds-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Datum" }),
					/* @__PURE__ */ jsx("th", { children: "Notiz" }),
					/* @__PURE__ */ jsx("th", { children: "Dauer" }),
					/* @__PURE__ */ jsx("th", {})
				] }) }), /* @__PURE__ */ jsxs("tbody", { children: [entries.map((e) => /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", { children: e.started_at.slice(0, 10) }),
					/* @__PURE__ */ jsx("td", { children: e.note ?? "—" }),
					/* @__PURE__ */ jsxs("td", { children: [fmtHours(e.duration_minutes), " h"] }),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: () => void assign(e.id),
						children: "Zuordnen"
					}) })
				] }, e.id)), entries.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 4,
					className: "opacity-70",
					children: "Keine offenen Einträge."
				}) }) : null] })]
			})
		]
	});
}
/** Push leads (from the ticket systems) to Lexware as contacts. */
function ContactsTab() {
	const [leads, setLeads] = useState([]);
	const [status, setStatus] = useState(null);
	const load = async () => {
		const res = await api("/lexware/leads");
		if (res.ok) setLeads((await res.json()).leads ?? []);
	};
	useEffect(() => {
		load();
	}, []);
	const push = async (lead) => {
		const res = await api("/lexware/leads/push", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				source_type: lead.source_type,
				source_id: lead.source_id,
				name: lead.name,
				email: lead.email,
				company: lead.company
			})
		});
		const d = await res.json().catch(() => ({}));
		if (res.ok) toast.success("Kontakt angelegt.");
		else toast.danger(`Hand-off an Lexware fehlgeschlagen: ${d.error ?? `HTTP ${res.status}`}`);
		load();
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "lexware-contacts",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "opacity-80",
				children: "Kontakte aus Kontaktanfragen & Tickets als Lexware-Kontakte anlegen."
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsxs("table", {
				className: "tds-table",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Name" }),
					/* @__PURE__ */ jsx("th", { children: "E-Mail" }),
					/* @__PURE__ */ jsx("th", { children: "Firma" }),
					/* @__PURE__ */ jsx("th", { children: "Quelle" }),
					/* @__PURE__ */ jsx("th", {})
				] }) }), /* @__PURE__ */ jsxs("tbody", { children: [leads.map((l) => /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", { children: l.name || "—" }),
					/* @__PURE__ */ jsx("td", { children: l.email }),
					/* @__PURE__ */ jsx("td", { children: l.company ?? "—" }),
					/* @__PURE__ */ jsx("td", { children: l.source_type === "ticket" ? "Ticket" : "Kontaktformular" }),
					/* @__PURE__ */ jsx("td", { children: l.lexware_contact_id ? /* @__PURE__ */ jsx("span", {
						className: "chip chip--success",
						children: "in Lexware"
					}) : /* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: () => void push(l),
						children: "Anlegen"
					}) })
				] }, `${l.source_type}-${l.source_id}`)), leads.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 5,
					className: "opacity-70",
					children: "Keine Kontakt-Kandidaten gefunden."
				}) }) : null] })]
			})
		]
	});
}
/** Export billable time as a Lexware invoice + list past exports. */
function InvoicesTab() {
	const [projectId, setProjectId] = useState(null);
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [finalize, setFinalize] = useState(false);
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const [invoices, setInvoices] = useState([]);
	const load = async () => {
		const res = await api("/lexware/invoices");
		if (res.ok) setInvoices((await res.json()).invoices ?? []);
	};
	useEffect(() => {
		load();
	}, []);
	const exportInvoice = async () => {
		if (projectId === null) {
			setStatus("Bitte ein Projekt wählen.");
			return;
		}
		setBusy(true);
		setStatus(null);
		const res = await api("/lexware/invoices/from-project", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectId,
				from,
				to,
				finalize
			})
		});
		const d = await res.json().catch(() => ({}));
		setBusy(false);
		if (res.ok) {
			toast.success(`Rechnung erstellt (${fmtHours(d.totalMinutes ?? 0)} h, ${finalize ? "final" : "Entwurf"}).`);
			load();
		} else toast.danger(`Rechnung fehlgeschlagen: ${d.error ?? `HTTP ${res.status}`}`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "lexware-invoices",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "lx-form flex flex-wrap gap-3 items-end",
				children: [
					/* @__PURE__ */ jsx(ProjectPicker, {
						projectId,
						onChange: setProjectId
					}),
					/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Von"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value)
					})] }),
					/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Bis"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value)
					})] }),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: finalize,
							onChange: (e) => setFinalize(e.target.checked)
						}), /* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Finalisieren (echte Rechnung)"
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: exportInvoice,
						disabled: busy,
						children: "Rechnung erstellen"
					})
				]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("h5", { children: "Bisherige Exporte" }),
			/* @__PURE__ */ jsxs("table", {
				className: "tds-table",
				tabIndex: 0,
				role: "region",
				"aria-label": "Bisherige Exporte",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", { children: "Datum" }),
					/* @__PURE__ */ jsx("th", { children: "Kunde" }),
					/* @__PURE__ */ jsx("th", { children: "Zeitraum" }),
					/* @__PURE__ */ jsx("th", { children: "Stunden" }),
					/* @__PURE__ */ jsx("th", { children: "Status" })
				] }) }), /* @__PURE__ */ jsxs("tbody", { children: [invoices.map((i) => /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", { children: i.created_at.slice(0, 10) }),
					/* @__PURE__ */ jsx("td", { children: i.customer_name ?? "—" }),
					/* @__PURE__ */ jsx("td", { children: i.period_from && i.period_to ? `${i.period_from} – ${i.period_to}` : "—" }),
					/* @__PURE__ */ jsxs("td", { children: [fmtHours(i.total_minutes), " h"] }),
					/* @__PURE__ */ jsx("td", { children: i.finalized ? "Final" : "Entwurf" })
				] }, i.id)), invoices.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 5,
					className: "opacity-70",
					children: "Noch keine Rechnungen exportiert."
				}) }) : null] })]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-lexware/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Lexware</h1></div><p class="tds-page__lede">Kunden &amp; Projekte, Zeiterfassung zuordnen, Kontakte und Rechnungen an Lexware Office.</p>${renderComponent($$result, "LexwareHub", LexwareHub, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/LexwareHub.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/lexware.astro
var lexware_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Lexware,
	file: () => $$file,
	url: () => void 0
});
var $$Lexware = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Lexware" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/lexware.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/lexware.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/lexware@_@astro
var page = () => lexware_exports;
//#endregion
export { page };
