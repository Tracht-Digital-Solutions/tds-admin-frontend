import { a as renderComponent, et as __exportAll, f as renderTemplate, o as Fragment$2, p as maybeRenderHead } from "./server_D5Yed9jg.mjs";
import { n as createComponent } from "./compiler_sVAMJR7a.mjs";
import { A as toast, O as apiFetch, g as ConfirmDialog, t as $$Layout, x as Spinner } from "./Layout_DagOqKgN.mjs";
import { useEffect, useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-referrals/islands/format.ts
var euros = (cents) => cents === null ? "—" : new Intl.NumberFormat("de-DE", {
	style: "currency",
	currency: "EUR"
}).format(cents / 100);
/** `2026-10-07…` → `07.10.2026`, without a time-zone round trip. */
var day = (iso) => iso ? iso.slice(0, 10).split("-").reverse().join(".") : "—";
var percent = (value) => value === null ? "—" : `${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(value)} %`;
/** Euro text as typed ("1.250,50", "1250.5") → cents, or null. */
var parseEuros = (raw) => {
	const s = raw.trim().replace(/\s|€/g, "");
	if (s === "") return null;
	const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
	const n = Number(normalized);
	return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
};
/** Explicit map — never interpolate a chip class (Tailwind cannot extract it). */
var STATUS = {
	claimed: {
		label: "Genannt",
		chip: "chip chip--info"
	},
	pending: {
		label: "Wartet",
		chip: "chip chip--warning"
	},
	approved: {
		label: "Fällig",
		chip: "chip chip--success"
	},
	paid: {
		label: "Ausgezahlt",
		chip: "chip chip--neutral"
	},
	rejected: {
		label: "Abgelehnt",
		chip: "chip chip--danger"
	},
	reversed: {
		label: "Storniert",
		chip: "chip chip--danger"
	}
};
var statusOf = (s) => STATUS[s] ?? {
	label: s,
	chip: "chip chip--neutral"
};
var VIA = {
	link: "Empfehlungslink",
	code: "Code an der Kasse",
	named: "Vom Kunden genannt",
	manual: "Von Hand erfasst"
};
var TAX = {
	private: "Privatperson",
	small_business: "Kleinunternehmer (§ 19 UStG)",
	vat: "Umsatzsteuerpflichtig"
};
/** The wait line a partner or operator reads next to a pending commission. */
var waitLabel = (c) => {
	if (c.status !== "pending") return null;
	if (!c.source_paid) return "Wartet auf Zahlung des Auftrags";
	return c.approve_after ? `Fällig ab ${day(c.approve_after)}` : "Wartet";
};
/** The API's `{error}` text, or the status. */
async function errorText(res, fallback) {
	try {
		const body = await res.json();
		if (body.error) return `${body.error} (HTTP ${res.status})`;
	} catch {}
	return `${fallback} (HTTP ${res.status}).`;
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-referrals/islands/ReferralsAdmin.tsx
var json = (body) => ({
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(body)
});
/**
* The operator's side of the Empfehlungsprogramm: who the partners are, which
* sales they brought in, and settling what is due. One `GET` loads it all; every
* mutation reloads, so the list never shows a state the server does not have.
*/
function ReferralsAdmin() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [tab, setTab] = useState("commissions");
	const load = async () => {
		const res = await apiFetch("/admin/referrals/overview").catch(() => null);
		if (res === null) setError("Provisionen konnten nicht geladen werden — die API ist nicht erreichbar.");
		else if (!res.ok) setError(await errorText(res, "Provisionen konnten nicht geladen werden"));
		else {
			setError(null);
			setData(await res.json());
		}
	};
	useEffect(() => {
		load();
	}, []);
	/** Run a mutation, toast its outcome, reload. Returns whether it worked. */
	const mutate = async (path, init, success) => {
		const res = await apiFetch(path, init).catch(() => null);
		if (res === null) {
			toast.danger("Fehlgeschlagen — die API ist nicht erreichbar.");
			return false;
		}
		if (!res.ok) {
			toast.danger(await errorText(res, "Fehlgeschlagen"));
			return false;
		}
		toast.success(success);
		await load();
		return true;
	};
	if (error) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: error
	});
	if (data === null) return /* @__PURE__ */ jsxs("p", {
		className: "tds-empty",
		"aria-busy": "true",
		children: [/* @__PURE__ */ jsx(Spinner, {}), " Wird geladen …"]
	});
	const claimed = data.commissions.filter((c) => c.status === "claimed").length;
	const tabs = [
		{
			id: "commissions",
			label: claimed > 0 ? `Vermittlungen (${claimed} zuzuordnen)` : "Vermittlungen"
		},
		{
			id: "partners",
			label: `Partner (${data.partners.length})`
		},
		{
			id: "payouts",
			label: "Auszahlungen"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--loose",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				role: "group",
				"aria-label": "Bereich",
				children: tabs.map((t) => /* @__PURE__ */ jsx("button", {
					type: "button",
					className: tab === t.id ? "btn btn-primary" : "btn btn-ghost",
					"aria-pressed": tab === t.id,
					onClick: () => setTab(t.id),
					children: t.label
				}, t.id))
			}),
			tab === "commissions" ? /* @__PURE__ */ jsx(Commissions, {
				data,
				mutate
			}) : null,
			tab === "partners" ? /* @__PURE__ */ jsx(Partners, {
				data,
				mutate
			}) : null,
			tab === "payouts" ? /* @__PURE__ */ jsx(Payouts, {
				data,
				mutate
			}) : null
		]
	});
}
function Commissions({ data, mutate }) {
	const [rejecting, setRejecting] = useState(null);
	const [busy, setBusy] = useState(false);
	const active = data.partners.filter((p) => p.status === "active");
	const exportCsv = () => {
		const csv = [[
			"Datum",
			"Auftrag",
			"Partner",
			"Weg",
			"Status",
			"Netto",
			"Satz",
			"Provision",
			"Kunde",
			"Notiz"
		], ...data.commissions.map((c) => [
			day(c.created_at),
			c.description ?? "",
			c.partner_name ?? "",
			VIA[c.via] ?? c.via,
			statusOf(c.status).label,
			(c.net_cents / 100).toFixed(2).replace(".", ","),
			c.rate_percent === null ? "" : String(c.rate_percent).replace(".", ","),
			c.commission_cents === null ? "" : (c.commission_cents / 100).toFixed(2).replace(".", ","),
			c.customer_email ?? "",
			(c.note ?? "").replace(/\s+/g, " ")
		])].map((r) => r.map((v) => `"${String(v).replace(/"/g, "\"\"")}"`).join(";")).join("\r\n");
		const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = `provisionen-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--loose",
		children: [
			/* @__PURE__ */ jsx(ManualForm, {
				partners: active,
				mutate
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "tds-stack",
				"aria-labelledby": "ref-commissions",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "tds-row tds-row--between",
					children: [/* @__PURE__ */ jsx("h2", {
						id: "ref-commissions",
						className: "text-lg font-semibold",
						children: "Vermittlungen"
					}), data.commissions.length > 0 ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: exportCsv,
						children: "Als CSV exportieren"
					}) : null]
				}), data.commissions.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "tds-empty",
					children: "Noch keine Vermittlungen. Sie entstehen, wenn jemand mit Code oder Link im Shop kauft, an der Kasse einen Namen nennt oder Sie einen Auftrag oben erfassen."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "tds-list",
					"aria-label": "Vermittlungen",
					children: data.commissions.map((c) => /* @__PURE__ */ jsx(CommissionRow, {
						c,
						partners: active,
						mutate,
						onReject: () => setRejecting(c)
					}, c.id))
				})]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: rejecting !== null,
				title: "Vermittlung ablehnen?",
				message: rejecting ? `${rejecting.description ?? "Auftrag"}: Es wird keine Provision fällig.` : null,
				confirmLabel: "Ablehnen",
				busy,
				onCancel: () => setRejecting(null),
				onConfirm: async () => {
					if (!rejecting) return;
					setBusy(true);
					await mutate(`/admin/referrals/commissions/${rejecting.id}/reject`, {
						method: "POST",
						...json({})
					}, "Abgelehnt.");
					setBusy(false);
					setRejecting(null);
				}
			})
		]
	});
}
function CommissionRow({ c, partners, mutate, onReject }) {
	const [assignTo, setAssignTo] = useState("");
	const s = statusOf(c.status);
	const post = (action, body, ok) => mutate(`/admin/referrals/commissions/${c.id}/${action}`, {
		method: "POST",
		...json(body)
	}, ok);
	return /* @__PURE__ */ jsxs("li", {
		className: "tds-list__row",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "min-w-0 tds-stack tds-stack--tight",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "font-semibold",
					children: c.description ?? "Auftrag"
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "marginalia",
					children: [
						day(c.created_at),
						" · ",
						VIA[c.via] ?? c.via,
						" · ",
						c.partner_name ?? "kein Partner",
						c.customer_email ? ` · ${c.customer_email}` : ""
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "marginalia tabular-nums",
					children: [
						"Netto ",
						euros(c.net_cents),
						" · ",
						percent(c.rate_percent),
						" · Provision ",
						euros(c.commission_cents),
						waitLabel(c) ? ` · ${waitLabel(c)}` : ""
					]
				}),
				c.note ? /* @__PURE__ */ jsxs("p", {
					className: "marginalia",
					children: [
						"„",
						c.note,
						"“"
					]
				}) : null
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "tds-toolbar",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: s.chip,
					children: s.label
				}),
				c.status === "claimed" || c.status === "rejected" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("select", {
					className: "field-boxed",
					"aria-label": `Partner für ${c.description ?? "Auftrag"}`,
					value: assignTo,
					onChange: (e) => setAssignTo(e.target.value),
					children: [/* @__PURE__ */ jsx("option", {
						value: "",
						children: "Partner wählen …"
					}), partners.map((p) => /* @__PURE__ */ jsxs("option", {
						value: p.id,
						children: [
							p.name,
							" (",
							p.code,
							")"
						]
					}, p.id))]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					disabled: assignTo === "",
					onClick: () => void post("assign", { partner_id: Number(assignTo) }, "Zugeordnet."),
					children: "Zuordnen"
				})] }) : null,
				c.status === "pending" && !c.source_paid ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => void post("confirm-paid", {}, "Zahlung vermerkt."),
					children: "Zahlung eingegangen"
				}) : null,
				c.status === "pending" && c.source_paid ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => void post("approve", {}, "Freigegeben."),
					children: "Sofort freigeben"
				}) : null,
				c.status === "claimed" || c.status === "pending" || c.status === "approved" ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-danger",
					onClick: onReject,
					children: "Ablehnen"
				}) : null
			]
		})]
	});
}
function ManualForm({ partners, mutate }) {
	const [open, setOpen] = useState(false);
	const [partnerId, setPartnerId] = useState("");
	const [description, setDescription] = useState("");
	const [net, setNet] = useState("");
	const [email, setEmail] = useState("");
	const [invoiceId, setInvoiceId] = useState("");
	const [paid, setPaid] = useState(false);
	const [problem, setProblem] = useState(null);
	const [busy, setBusy] = useState(false);
	if (!open) return /* @__PURE__ */ jsxs("div", {
		className: "tds-toolbar",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn-primary",
			onClick: () => setOpen(true),
			disabled: partners.length === 0,
			children: "Vermittelten Auftrag erfassen"
		}), partners.length === 0 ? /* @__PURE__ */ jsx("span", {
			className: "marginalia",
			children: "Legen Sie zuerst einen Partner an."
		}) : null]
	});
	const submit = async () => {
		const cents = parseEuros(net);
		if (partnerId === "" || description.trim() === "" || cents === null) {
			setProblem("Bitte Partner, Beschreibung und einen Nettobetrag über 0 angeben.");
			return;
		}
		setProblem(null);
		setBusy(true);
		const ok = await mutate("/admin/referrals/commissions", {
			method: "POST",
			...json({
				partner_id: Number(partnerId),
				description,
				net_cents: cents,
				customer_email: email || null,
				invoice_id: invoiceId === "" ? null : Number(invoiceId),
				paid
			})
		}, "Auftrag erfasst.");
		setBusy(false);
		if (ok) {
			setOpen(false);
			setDescription("");
			setNet("");
			setEmail("");
			setInvoiceId("");
			setPaid(false);
		}
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-card p-4 tds-stack",
		"aria-labelledby": "ref-manual",
		children: [
			/* @__PURE__ */ jsx("h2", {
				id: "ref-manual",
				className: "text-lg font-semibold",
				children: "Vermittelten Auftrag erfassen"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Für Aufträge außerhalb des Shops, etwa wenn ein Kunde am Telefon sagt, wer Sie empfohlen hat."
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Partner" }), /* @__PURE__ */ jsxs("select", {
					className: "field-boxed",
					value: partnerId,
					onChange: (e) => setPartnerId(e.target.value),
					children: [/* @__PURE__ */ jsx("option", {
						value: "",
						children: "Bitte wählen …"
					}), partners.map((p) => /* @__PURE__ */ jsxs("option", {
						value: p.id,
						children: [
							p.name,
							" (",
							p.code,
							", ",
							percent(p.rate_percent),
							")"
						]
					}, p.id))]
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Auftrag" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					placeholder: "z. B. Website Bäckerei Huber"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Nettobetrag (€)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					inputMode: "decimal",
					value: net,
					onChange: (e) => setNet(e.target.value),
					placeholder: "1.200,00"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "E-Mail des Kunden (optional)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "email",
					value: email,
					onChange: (e) => setEmail(e.target.value)
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Rechnungs-Nr. im Panel (optional)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "number",
					min: "1",
					value: invoiceId,
					onChange: (e) => setInvoiceId(e.target.value)
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-toggle-row",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: paid,
					onChange: (e) => setPaid(e.target.checked)
				}), /* @__PURE__ */ jsx("span", { children: "Der Kunde hat schon bezahlt" })]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Mit Rechnungs-Nr. wird die Provision fällig, sobald die Rechnung als bezahlt gemeldet ist. Ohne bestätigen Sie die Zahlung selbst."
			}),
			problem ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: problem
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => void submit(),
					disabled: busy,
					"aria-busy": busy,
					children: "Erfassen"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => setOpen(false),
					children: "Abbrechen"
				})]
			})
		]
	});
}
var draftOf = (p) => ({
	name: p?.name ?? "",
	public_name: p?.public_name ?? "",
	email: p?.email ?? "",
	code: p?.code ?? "",
	rate_percent: p && p.own_rate ? String(p.rate_percent).replace(".", ",") : "",
	status: p?.status ?? "active",
	note: p?.note ?? "",
	payout_name: p?.payout_name ?? "",
	tax_status: p?.tax_status ?? "",
	vat_id: p?.vat_id ?? "",
	iban: ""
});
function Partners({ data, mutate }) {
	const [editing, setEditing] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--loose",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => setEditing("new"),
					children: "Neuer Partner"
				}), /* @__PURE__ */ jsxs("span", {
					className: "marginalia",
					children: [
						"Standardsatz ",
						percent(data.settings.default_rate_percent),
						", Wartefrist ",
						data.settings.hold_days,
						" Tage (Einstellungen → Empfehlungsprogramm)."
					]
				})]
			}),
			editing === "new" ? /* @__PURE__ */ jsx(PartnerForm, {
				partner: null,
				mutate,
				onDone: () => setEditing(null)
			}) : null,
			data.partners.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch keine Partner. Legen Sie einen mit der E-Mail-Adresse seines Portal-Zugangs an. Beim ersten Besuch von „Empfehlungen“ verknüpft er sich selbst."
			}) : /* @__PURE__ */ jsx("ul", {
				className: "tds-list",
				"aria-label": "Partner",
				children: data.partners.map((p) => editing === p.id ? /* @__PURE__ */ jsx("li", {
					className: "tds-list__row",
					children: /* @__PURE__ */ jsx(PartnerForm, {
						partner: p,
						mutate,
						onDone: () => setEditing(null)
					})
				}, p.id) : /* @__PURE__ */ jsxs("li", {
					className: "tds-list__row",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 tds-stack tds-stack--tight",
						children: [
							/* @__PURE__ */ jsxs("p", {
								className: "font-semibold",
								children: [
									p.name,
									" ",
									/* @__PURE__ */ jsxs("span", {
										className: "marginalia",
										children: [
											"(",
											p.public_name,
											")"
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "marginalia",
								children: [
									"Code ",
									p.code,
									" · ",
									percent(p.rate_percent),
									p.own_rate ? " (eigener Satz)" : "",
									" · ",
									p.email ?? "keine E-Mail",
									" ·",
									" ",
									p.user_id ? "Portal verknüpft" : "noch nicht im Portal"
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "marginalia",
								children: [
									"Auszahlung: ",
									p.iban_masked ?? "keine IBAN",
									p.tax_status ? ` · ${TAX[p.tax_status]}` : ""
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: p.status === "active" ? "chip chip--success" : "chip chip--neutral",
								children: p.status === "active" ? "Aktiv" : "Pausiert"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => void navigator.clipboard.writeText(p.link).then(() => toast.success("Link kopiert."), () => toast.danger("Link konnte nicht kopiert werden.")),
								children: "Link kopieren"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => setEditing(p.id),
								children: "Bearbeiten"
							})
						]
					})]
				}, p.id))
			}),
			/* @__PURE__ */ jsx(ProductRates, {
				data,
				mutate
			})
		]
	});
}
function PartnerForm({ partner, mutate, onDone }) {
	const [d, setD] = useState(draftOf(partner));
	const [busy, setBusy] = useState(false);
	const set = (k, v) => setD((prev) => ({
		...prev,
		[k]: v
	}));
	const save = async () => {
		setBusy(true);
		const body = {
			name: d.name,
			public_name: d.public_name,
			email: d.email,
			code: d.code,
			rate_percent: d.rate_percent.trim() === "" ? null : d.rate_percent.replace(",", "."),
			note: d.note,
			...partner ? { status: d.status } : {}
		};
		const ok = partner ? await mutate(`/admin/referrals/partners/${partner.id}`, {
			method: "PUT",
			...json(body)
		}, "Partner gespeichert.") : await mutate("/admin/referrals/partners", {
			method: "POST",
			...json(body)
		}, "Partner angelegt.");
		const payoutTouched = d.iban !== "" || d.payout_name !== (partner?.payout_name ?? "") || d.tax_status !== (partner?.tax_status ?? "") || d.vat_id !== (partner?.vat_id ?? "");
		if (ok && partner && payoutTouched) await mutate(`/admin/referrals/partners/${partner.id}/payout-details`, {
			method: "PUT",
			...json({
				iban: d.iban,
				payout_name: d.payout_name,
				tax_status: d.tax_status,
				vat_id: d.vat_id
			})
		}, "Auszahlungsdaten gespeichert.");
		setBusy(false);
		if (ok) onDone();
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-card p-4 tds-stack w-full",
		"aria-label": partner ? `Partner ${partner.name} bearbeiten` : "Neuer Partner",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Name" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					value: d.name,
					onChange: (e) => set("name", e.target.value)
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Angezeigter Name (leer = „Vorname N.“)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					value: d.public_name,
					onChange: (e) => set("public_name", e.target.value)
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "E-Mail des Portal-Zugangs" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "email",
					value: d.email,
					onChange: (e) => set("email", e.target.value)
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Code (leer = automatisch)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					value: d.code,
					onChange: (e) => set("code", e.target.value.toUpperCase())
				})]
			}),
			partner && d.code !== partner.code ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--warning",
				role: "status",
				children: "Ein neuer Code macht bereits geteilte Links ungültig."
			}) : null,
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Eigener Satz in % (leer = Standard)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					inputMode: "decimal",
					value: d.rate_percent,
					onChange: (e) => set("rate_percent", e.target.value)
				})]
			}),
			partner ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
				/* @__PURE__ */ jsxs("label", {
					className: "tds-toggle-row",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: d.status === "active",
						onChange: (e) => set("status", e.target.checked ? "active" : "paused")
					}), /* @__PURE__ */ jsx("span", { children: "Aktiv (pausiert: Code und Link zählen nicht mehr)" })]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "tds-field-row",
					children: [/* @__PURE__ */ jsx("span", { children: "Kontoinhaber" }), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						value: d.payout_name,
						onChange: (e) => set("payout_name", e.target.value)
					})]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "tds-field-row",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"IBAN (",
						partner.iban_masked ?? "keine",
						")"
					] }), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						value: d.iban,
						onChange: (e) => set("iban", e.target.value),
						placeholder: "leer = behalten",
						autoComplete: "off"
					})]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "tds-field-row",
					children: [/* @__PURE__ */ jsx("span", { children: "Steuerstatus" }), /* @__PURE__ */ jsxs("select", {
						className: "field-boxed",
						value: d.tax_status,
						onChange: (e) => set("tax_status", e.target.value),
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "unbekannt"
						}), Object.keys(TAX).map((k) => /* @__PURE__ */ jsx("option", {
							value: k,
							children: TAX[k]
						}, k))]
					})]
				}),
				d.tax_status === "vat" ? /* @__PURE__ */ jsxs("label", {
					className: "tds-field-row",
					children: [/* @__PURE__ */ jsx("span", { children: "USt-IdNr." }), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						value: d.vat_id,
						onChange: (e) => set("vat_id", e.target.value)
					})]
				}) : null
			] }) : null,
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Interne Notiz" }), /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					rows: 2,
					value: d.note,
					onChange: (e) => set("note", e.target.value)
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => void save(),
					disabled: busy || d.name.trim() === "",
					"aria-busy": busy,
					children: "Speichern"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: onDone,
					children: "Abbrechen"
				})]
			})
		]
	});
}
function ProductRates({ data, mutate }) {
	const [productId, setProductId] = useState("");
	const [rate, setRate] = useState("");
	const save = async (pid, value, ok) => {
		if (await mutate("/admin/referrals/product-rates", {
			method: "PUT",
			...json({
				product_id: pid,
				rate_percent: value === null ? null : value.replace(",", ".")
			})
		}, ok) && value !== null) {
			setProductId("");
			setRate("");
		}
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-stack",
		"aria-labelledby": "ref-rates",
		children: [
			/* @__PURE__ */ jsx("h2", {
				id: "ref-rates",
				className: "text-lg font-semibold",
				children: "Sätze pro Produkt"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Ein Produktsatz geht dem Satz des Partners vor. Die Produkt-ID steht in der Produktliste des Shops."
			}),
			data.product_rates.length > 0 ? /* @__PURE__ */ jsx("ul", {
				className: "tds-list",
				"aria-label": "Produktsätze",
				children: data.product_rates.map((r) => /* @__PURE__ */ jsxs("li", {
					className: "tds-list__row",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Produkt ",
						r.product_id,
						": ",
						/* @__PURE__ */ jsx("strong", { children: percent(r.rate_percent) })
					] }), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => void save(r.product_id, null, "Produktsatz entfernt."),
						children: "Entfernen"
					})]
				}, r.product_id))
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-row",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Produkt-ID" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: productId,
							onChange: (e) => setProductId(e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Satz in %" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							inputMode: "decimal",
							value: rate,
							onChange: (e) => setRate(e.target.value)
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: productId.trim() === "" || rate.trim() === "",
						onClick: () => void save(productId.trim(), rate, "Produktsatz gespeichert."),
						children: "Satz setzen"
					})
				]
			})
		]
	});
}
function Payouts({ data, mutate }) {
	const [settling, setSettling] = useState(null);
	const [reference, setReference] = useState("");
	const [busy, setBusy] = useState(false);
	const [statement, setStatement] = useState(null);
	const due = useMemo(() => {
		const byPartner = /* @__PURE__ */ new Map();
		for (const c of data.commissions) if (c.status === "approved" && c.partner_id !== null) byPartner.set(c.partner_id, (byPartner.get(c.partner_id) ?? 0) + (c.commission_cents ?? 0));
		return data.partners.map((partner) => ({
			partner,
			total: byPartner.get(partner.id) ?? 0
		})).filter((r) => r.total !== 0);
	}, [data]);
	const openStatement = async (id) => {
		const res = await apiFetch(`/admin/referrals/payouts/${id}`).catch(() => null);
		if (res === null || !res.ok) {
			toast.danger(res === null ? "Abrechnung nicht erreichbar." : await errorText(res, "Abrechnung nicht geladen"));
			return;
		}
		setStatement(await res.json());
	};
	if (statement) return /* @__PURE__ */ jsx(StatementView, {
		s: statement,
		onClose: () => setStatement(null)
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--loose",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "tds-stack",
				"aria-labelledby": "ref-due",
				children: [/* @__PURE__ */ jsx("h2", {
					id: "ref-due",
					className: "text-lg font-semibold",
					children: "Fällig"
				}), due.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "tds-empty",
					children: "Gerade ist nichts fällig. Provisionen werden fällig, wenn der Auftrag bezahlt und die Wartefrist vorbei ist."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "tds-list",
					"aria-label": "Fällige Provisionen",
					children: due.map(({ partner, total }) => /* @__PURE__ */ jsxs("li", {
						className: "tds-list__row",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-semibold",
								children: partner.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "marginalia",
								children: [partner.iban_masked ? `IBAN ${partner.iban_masked}` : "Keine IBAN hinterlegt", partner.tax_status ? ` · ${TAX[partner.tax_status]}` : ""]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "tds-toolbar",
							children: [/* @__PURE__ */ jsx("strong", {
								className: "tabular-nums",
								children: euros(total)
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-primary",
								disabled: total <= 0,
								title: total <= 0 ? "Rückbuchungen übersteigen die fälligen Provisionen." : void 0,
								onClick: () => {
									setReference(`Provision ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 7)}`);
									setSettling({
										partner,
										total
									});
								},
								children: "Auszahlung verbuchen"
							})]
						})]
					}, partner.id))
				})]
			}),
			settling ? /* @__PURE__ */ jsxs("section", {
				className: "tds-card p-4 tds-stack",
				"aria-labelledby": "ref-settle",
				children: [
					/* @__PURE__ */ jsxs("h2", {
						id: "ref-settle",
						className: "text-lg font-semibold",
						children: ["Auszahlung an ", settling.partner.name]
					}),
					/* @__PURE__ */ jsxs("p", { children: [
						"Überweisen Sie ",
						/* @__PURE__ */ jsx("strong", { children: euros(settling.total) }),
						settling.partner.tax_status === "vat" ? " zuzüglich 19 % Umsatzsteuer" : "",
						" und verbuchen Sie die Auszahlung danach hier."
					] }),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Verwendungszweck" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: reference,
							onChange: (e) => setReference(e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							disabled: busy,
							"aria-busy": busy,
							onClick: async () => {
								setBusy(true);
								const ok = await mutate("/admin/referrals/payouts", {
									method: "POST",
									...json({
										partner_id: settling.partner.id,
										reference
									})
								}, "Auszahlung verbucht.");
								setBusy(false);
								if (ok) setSettling(null);
							},
							children: "Als ausgezahlt verbuchen"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setSettling(null),
							children: "Abbrechen"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ jsxs("section", {
				className: "tds-stack",
				"aria-labelledby": "ref-payouts",
				children: [/* @__PURE__ */ jsx("h2", {
					id: "ref-payouts",
					className: "text-lg font-semibold",
					children: "Bisherige Auszahlungen"
				}), data.payouts.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "tds-empty",
					children: "Noch keine Auszahlungen."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "tds-list",
					"aria-label": "Auszahlungen",
					children: data.payouts.map((p) => /* @__PURE__ */ jsxs("li", {
						className: "tds-list__row",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							day(p.paid_at),
							" · ",
							p.partner_name ?? `Partner ${p.partner_id}`,
							" · ",
							p.reference ?? "ohne Zweck"
						] }), /* @__PURE__ */ jsxs("div", {
							className: "tds-toolbar",
							children: [/* @__PURE__ */ jsx("strong", {
								className: "tabular-nums",
								children: euros(p.total_cents)
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => void openStatement(p.id),
								children: "Abrechnung"
							})]
						})]
					}, p.id))
				})]
			})
		]
	});
}
function StatementView({ s, onClose }) {
	const vat = s.partner.tax_status === "vat";
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-card p-4 tds-stack",
		"aria-labelledby": "ref-statement",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "tds-row tds-row--between",
				children: [/* @__PURE__ */ jsxs("h2", {
					id: "ref-statement",
					className: "text-lg font-semibold",
					children: ["Provisionsabrechnung ", s.payout.reference ?? `#${s.payout.id}`]
				}), /* @__PURE__ */ jsxs("div", {
					className: "tds-toolbar",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-primary",
						onClick: () => window.print(),
						children: "Drucken"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: onClose,
						children: "Zurück"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("p", { children: [
				vat ? "Gutschrift" : "Abrechnung",
				" vom ",
				day(s.payout.paid_at),
				" für ",
				/* @__PURE__ */ jsx("strong", { children: s.partner.payout_name ?? s.partner.name }),
				s.partner.vat_id ? `, USt-IdNr. ${s.partner.vat_id}` : "",
				s.partner.iban ? `, IBAN ${s.partner.iban}` : "",
				"."
			] }),
			/* @__PURE__ */ jsx("ul", {
				className: "tds-list",
				"aria-label": "Positionen",
				children: s.lines.map((l) => /* @__PURE__ */ jsxs("li", {
					className: "tds-list__row",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						day(l.created_at),
						" · ",
						l.description ?? "Auftrag",
						" · Netto ",
						euros(l.net_cents),
						" · ",
						percent(l.rate_percent)
					] }), /* @__PURE__ */ jsx("strong", {
						className: "tabular-nums",
						children: euros(l.commission_cents)
					})]
				}, l.id))
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "tabular-nums",
				children: [
					"Summe netto ",
					/* @__PURE__ */ jsx("strong", { children: euros(s.payout.total_cents) }),
					vat ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						" ",
						"· zzgl. 19 % USt ",
						euros(s.payout.vat_cents),
						" · Auszahlung ",
						/* @__PURE__ */ jsx("strong", { children: euros(s.payout.gross_cents) })
					] }) : null
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: s.partner.tax_status === "small_business" ? "Der Partner ist Kleinunternehmer nach § 19 UStG; es wird keine Umsatzsteuer ausgewiesen." : vat ? "Gutschrift nach § 14 Abs. 2 Satz 2 UStG." : "Die Provision ist vom Empfänger selbst zu versteuern."
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-referrals/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">${"Provisionen"}</h1></div>${renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<p class="tds-page__lede">Partner verwalten, Vermittlungen prüfen und Provisionen auszahlen.</p>${renderComponent($$result, "ReferralsAdmin", ReferralsAdmin, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-referrals/islands/ReferralsAdmin.tsx",
		"client:component-export": "default"
	})}` })}`}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-referrals/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/empfehlungen.astro
var empfehlungen_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Empfehlungen,
	file: () => $$file,
	url: () => void 0
});
var $$Empfehlungen = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Empfehlungen" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/empfehlungen.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/empfehlungen.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/empfehlungen@_@astro
var page = () => empfehlungen_exports;
//#endregion
export { page };
