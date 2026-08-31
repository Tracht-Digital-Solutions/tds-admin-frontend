import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { _ as FormAlert, a as API_BASE, b as toast, l as frontendFetch, p as FRONTEND_TARGET, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { n as staleClass, r as useCachedJson, t as invalidate } from "./data_CxFkYAe0.mjs";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/CorsSettings.tsx
var ENDPOINT = `${API_BASE}/admin/cors`;
var SOURCE_LABEL = {
	baseline: "fest eingebaut",
	env: ".env des Hosts",
	db: "hier gepflegt"
};
var SOURCE_VARIANT = {
	baseline: "chip--neutral",
	env: "chip--warning",
	db: "chip--info"
};
/**
* *CORS / Freigegebene Origins* — which browser origins may call this API.
*
* It used to live only in `CORS_ALLOWED_ORIGINS` on the host, editable by
* opening a file over SSH on a host whose whole install model is "ohne SSH".
* So in practice the list was whatever the installer wrote once, and adding a
* customer domain or a staging host was not something anybody could do.
*
* Two things this form has to make visible, because getting either wrong is
* silent:
*
* The LAYER each origin comes from. The list is a union of a coded baseline,
* the host's `.env` and the rows edited here — a union, not an override, so
* that nothing saved in a browser can remove the origin that browser is
* running on. Without the layer shown, the entries that cannot be deleted look
* like a bug.
*
* And the REJECTS. The server compares an exact string, so `https://kunde.de/`
* — the standard paste error — unblocks nothing, forever, with no error
* anywhere. The API normalises what it can and hands back what it could not;
* that list is rendered IN FLOW rather than as a toast, because it is text to
* read and act on, not a passing notice.
*/
function CorsSettings() {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [status, setStatus] = useState(null);
	const [draft, setDraft] = useState("");
	const [rejected, setRejected] = useState([]);
	const [busy, setBusy] = useState(false);
	const load = async () => {
		try {
			const res = await frontendFetch(ENDPOINT);
			if (!res.ok) {
				setError(res.status === 401 || res.status === 403 ? "Nur für Administratoren." : `Origins konnten nicht geladen werden (HTTP ${res.status}).`);
				setLoaded(true);
				return;
			}
			const data = await res.json();
			setStatus(data);
			setDraft((data.custom ?? []).join("\n"));
			setError(null);
		} catch {
			setError("Origins konnten nicht geladen werden — die API ist nicht erreichbar.");
		} finally {
			setLoaded(true);
		}
	};
	useEffect(() => {
		load();
	}, []);
	const save = async () => {
		setBusy(true);
		setRejected([]);
		try {
			const res = await frontendFetch(ENDPOINT, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ origins: draft })
			});
			const data = await res.json().catch(() => null);
			if (!res.ok || !data?.ok) {
				toast.danger(data?.error ? `Speichern fehlgeschlagen (HTTP ${res.status}): ${data.error}` : `Speichern fehlgeschlagen (HTTP ${res.status}).`);
				return;
			}
			setStatus(data);
			setDraft((data.saved ?? []).join("\n"));
			setRejected(data.rejected ?? []);
			if ((data.rejected ?? []).length > 0) toast.warning("Gespeichert — einzelne Einträge wurden abgelehnt.");
			else toast.success("Gespeichert.");
		} catch {
			toast.danger("Speichern fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setBusy(false);
		}
	};
	if (!loaded) return /* @__PURE__ */ jsx(Spinner, {});
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-settings-section__body tds-stack",
		children: [
			/* @__PURE__ */ jsx(FormAlert, { message: error }),
			status && !status.store_available ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--warning",
				children: [
					"Noch keine Datenbank konfiguriert — es gelten nur die fest eingebauten Origins und die",
					" ",
					/* @__PURE__ */ jsx("code", { children: ".env" }),
					" des Hosts. Eigene Einträge lassen sich erst danach speichern."
				]
			}) : null,
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Nur Browser-Anfragen von diesen Herkünften dürfen die API lesen. Die fest eingebauten Adressen der eigenen Seiten lassen sich nicht entfernen — sonst könnte eine Änderung hier genau die Oberfläche aussperren, die sie zurücknehmen müsste."
			}),
			status ? /* @__PURE__ */ jsx("ul", {
				className: "tds-list",
				children: status.origins.map((row) => /* @__PURE__ */ jsxs("li", {
					className: "tds-list__row",
					children: [/* @__PURE__ */ jsx("code", { children: row.origin }), /* @__PURE__ */ jsx("span", {
						className: `chip ${SOURCE_VARIANT[row.source]}`,
						children: SOURCE_LABEL[row.source]
					})]
				}, `${row.source}-${row.origin}`))
			}) : null,
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "Zusätzliche Origins (eine pro Zeile)"
				}), /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					rows: 4,
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "https://kunde.example\nhttp://localhost:4321",
					spellCheck: false,
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Schema, Host und gegebenenfalls Port — kein Pfad und kein Schrägstrich am Ende (",
					/* @__PURE__ */ jsx("code", { children: "https://kunde.example" }),
					", nicht ",
					/* @__PURE__ */ jsx("code", { children: "https://kunde.example/" }),
					"). Verglichen wird exakt, ein knapp danebenliegender Eintrag gibt also dauerhaft nichts frei. Ein",
					/* @__PURE__ */ jsx("code", { children: " *" }),
					" ist nicht möglich: zusammen mit Sitzungs-Cookies verbietet der Standard den Platzhalter."
				]
			}),
			rejected.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "tds-alert tds-alert--warning",
				children: [/* @__PURE__ */ jsx("p", { children: "Diese Einträge wurden nicht übernommen:" }), /* @__PURE__ */ jsx("ul", { children: rejected.map((entry) => /* @__PURE__ */ jsxs("li", { children: [
					/* @__PURE__ */ jsx("code", { children: entry.value }),
					" — ",
					entry.reason
				] }, entry.value)) })]
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => void save(),
					disabled: busy,
					children: busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Die Änderung gilt sofort für die nächste Anfrage — ein neues Deployment ist nicht nötig."
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/MailSettings.tsx
var NS$7 = `${API_BASE}/admin/settings/mail`;
var STATUS$1 = `${API_BASE}/admin/mail`;
var TEST$1 = `${API_BASE}/admin/mail/test`;
/** Coded defaults, mirrored from the API's `MailConfig`. */
var DEFAULTS$1 = {
	port: "587",
	security: "tls",
	from_email: "no-reply@tracht-digital.de",
	from_name: "Tracht Digital Solutions"
};
/**
* *E-Mail (SMTP)* — the base's own settings section for the one transport every
* composed module sends through (Ticket-Benachrichtigungen, Kontakt-Antworten,
* Live-Chat-Mails …).
*
* Two reads, because they answer different questions: the settings namespace
* holds what is *stored* (and is what this form edits), while `GET /admin/mail`
* reports what actually *sends* — including a transport that comes from the
* host's `MAIL_DSN`. Showing only the former would present an empty form on a
* host that mails perfectly well, and the first "fix" would overwrite a working
* transport.
*
* The password is a secret: it comes back masked and a blank field on save keeps
* the stored value, so it never round-trips through the browser.
*
* The test button exists because saving is not sending. SMTP fails on things no
* form can validate (wrong port, refused relay, bad credentials), and the
* modules that use the mailer send on events an admin cannot trigger at will —
* without this, the first proof that mail works would be a customer not getting
* one. Its failure is rendered IN FLOW, not as a toast: the SMTP server's reply
* is diagnostic text to read, not a passing notice.
*/
function MailSettings() {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [status, setStatus] = useState(null);
	const [host, setHost] = useState("");
	const [port, setPort] = useState(DEFAULTS$1.port);
	const [security, setSecurity] = useState(DEFAULTS$1.security);
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [passwordState, setPasswordState] = useState(null);
	const [fromEmail, setFromEmail] = useState("");
	const [fromName, setFromName] = useState("");
	const [dsn, setDsn] = useState("");
	const [dsnState, setDsnState] = useState(null);
	const [testTo, setTestTo] = useState("");
	const [testError, setTestError] = useState(null);
	const [busy, setBusy] = useState(false);
	const [testing, setTesting] = useState(false);
	const load = async () => {
		try {
			const [settingsRes, statusRes] = await Promise.all([frontendFetch(NS$7), frontendFetch(STATUS$1)]);
			if (!settingsRes.ok) {
				setError(settingsRes.status === 401 || settingsRes.status === 403 ? "Nur für Administratoren." : `Einstellungen konnten nicht geladen werden (HTTP ${settingsRes.status}).`);
				setLoaded(true);
				return;
			}
			const data = await settingsRes.json();
			const map = new Map((data.settings ?? []).map((s) => [s.key, s]));
			setHost(map.get("host")?.value ?? "");
			setPort(map.get("port")?.value || DEFAULTS$1.port);
			setSecurity(map.get("security")?.value || DEFAULTS$1.security);
			setUser(map.get("user")?.value ?? "");
			setPasswordState(map.get("password") ?? null);
			setFromEmail(map.get("from_email")?.value ?? "");
			setFromName(map.get("from_name")?.value ?? "");
			setDsnState(map.get("dsn") ?? null);
			setStatus(statusRes.ok ? await statusRes.json() : null);
			setError(null);
		} catch {
			setError("Einstellungen konnten nicht geladen werden — die API ist nicht erreichbar.");
		} finally {
			setLoaded(true);
		}
	};
	useEffect(() => {
		load();
	}, []);
	const save = async () => {
		setBusy(true);
		try {
			const res = await frontendFetch(NS$7, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ settings: [
					{
						key: "host",
						secret: false,
						value: host.trim()
					},
					{
						key: "port",
						secret: false,
						value: port.trim()
					},
					{
						key: "security",
						secret: false,
						value: security
					},
					{
						key: "user",
						secret: false,
						value: user.trim()
					},
					{
						key: "password",
						secret: true,
						value: password
					},
					{
						key: "from_email",
						secret: false,
						value: fromEmail.trim()
					},
					{
						key: "from_name",
						secret: false,
						value: fromName.trim()
					},
					{
						key: "dsn",
						secret: true,
						value: dsn.trim()
					}
				] })
			});
			if (res.ok) {
				setPassword("");
				setDsn("");
				toast.success("Gespeichert.");
				load();
			} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			toast.danger("Speichern fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setBusy(false);
		}
	};
	const sendTest = async () => {
		setTesting(true);
		setTestError(null);
		try {
			const res = await frontendFetch(TEST$1, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ to: testTo.trim() })
			});
			const data = await res.json().catch(() => null);
			if (res.ok && data?.ok) toast.success(`Testmail an ${data.to ?? "die eigene Adresse"} übergeben.`);
			else setTestError(data?.error ? `Versand fehlgeschlagen (HTTP ${res.status}): ${data.error}` : `Versand fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			setTestError("Versand fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setTesting(false);
		}
	};
	const passwordHint = passwordState?.configured ? `hinterlegt (…${passwordState.last4 ?? "????"})` : "nicht hinterlegt";
	const dsnHint = dsnState?.configured ? `hinterlegt (…${dsnState.last4 ?? "????"})` : "nicht gesetzt";
	const sourceLabel = () => {
		if (!status) return {
			text: "Status unbekannt",
			variant: "warning"
		};
		if (!status.configured) return {
			text: "Kein Versand konfiguriert",
			variant: "danger"
		};
		return status.source === "env" ? {
			text: "Aktiv über MAIL_DSN aus der .env des Hosts",
			variant: "warning"
		} : {
			text: "Aktiv über diese Einstellungen",
			variant: "success"
		};
	};
	if (!loaded) return /* @__PURE__ */ jsx(Spinner, {});
	const state = sourceLabel();
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-settings-section__body tds-stack",
		children: [
			/* @__PURE__ */ jsx(FormAlert, { message: error }),
			/* @__PURE__ */ jsxs("p", {
				className: "tds-row",
				children: [/* @__PURE__ */ jsx("span", {
					className: `status-pill status-pill--${state.variant}`,
					children: state.text
				}), status?.configured ? /* @__PURE__ */ jsxs("span", {
					className: "marginalia",
					children: [
						"Absender: ",
						status.from_name,
						" <",
						status.from_email,
						">"
					]
				}) : null]
			}),
			status?.source === "env" ? /* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Der Versand läuft derzeit über die ",
					/* @__PURE__ */ jsx("code", { children: "MAIL_DSN" }),
					" auf dem Host. Sobald hier ein Server eingetragen und gespeichert ist, gilt diese Einstellung — die ",
					/* @__PURE__ */ jsx("code", { children: ".env" }),
					" ",
					"bleibt nur noch Rückfallebene."
				]
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "SMTP-Server"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: host,
							onChange: (e) => setHost(e.target.value),
							placeholder: "smtp.example.net",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Port"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "number",
							min: "1",
							max: "65535",
							value: port,
							onChange: (e) => setPort(e.target.value),
							placeholder: DEFAULTS$1.port
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Verschlüsselung"
						}), /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: security,
							onChange: (e) => setSecurity(e.target.value),
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "tls",
									children: "STARTTLS (Port 587)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "ssl",
									children: "SSL/TLS (Port 465)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "none",
									children: "Keine"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Benutzername"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: user,
							onChange: (e) => setUser(e.target.value),
							placeholder: "no-reply@example.net",
							autoComplete: "off"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-sm",
					children: ["Passwort ", /* @__PURE__ */ jsxs("em", {
						className: "opacity-60",
						children: [
							"(",
							passwordHint,
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					placeholder: "leer = bestehendes Passwort behalten",
					autoComplete: "new-password"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Absenderadresse"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "email",
						value: fromEmail,
						onChange: (e) => setFromEmail(e.target.value),
						placeholder: DEFAULTS$1.from_email
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Absendername"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						value: fromName,
						onChange: (e) => setFromName(e.target.value),
						placeholder: DEFAULTS$1.from_name
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-sm",
					children: ["Eigener DSN ", /* @__PURE__ */ jsxs("em", {
						className: "opacity-60",
						children: [
							"(",
							dsnHint,
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: dsn,
					onChange: (e) => setDsn(e.target.value),
					placeholder: "optional, z. B. sendmail://default",
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Ein eigener DSN übersteuert die Felder oben und ist nur für Transporte gedacht, die das Formular nicht abbildet. Er kann das Passwort enthalten und wird deshalb wie ein Geheimnis behandelt."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => void save(),
					disabled: busy,
					children: busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
				})
			}),
			/* @__PURE__ */ jsx("hr", {}),
			/* @__PURE__ */ jsx("h3", {
				className: "text-sm",
				children: "Testmail"
			}),
			/* @__PURE__ */ jsx(FormAlert, { message: testError }),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Empfänger"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "email",
						value: testTo,
						onChange: (e) => setTestTo(e.target.value),
						placeholder: "leer = eigene Adresse"
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => void sendTest(),
					disabled: testing || !status?.configured,
					children: testing ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Testmail senden"
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Der Test verwendet die ",
					/* @__PURE__ */ jsx("strong", { children: "gespeicherte" }),
					" Konfiguration — vorher speichern. Erfolg heißt: der SMTP-Server hat die Mail angenommen."
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-billing/islands/BillingSettings.tsx
var api$9 = apiFetch;
var NS$6 = "/admin/settings/billing";
/**
* Stripe settings — secret key + webhook secret + default currency + payment
* term, in the core runtime settings store (admin-only). Secrets come back masked
* (configured + last4); a blank secret on save keeps the existing value.
*/
function BillingSettings() {
	const [loaded, setLoaded] = useState(false);
	const [keyState, setKeyState] = useState(null);
	const [whState, setWhState] = useState(null);
	const [keyInput, setKeyInput] = useState("");
	const [whInput, setWhInput] = useState("");
	const [currency, setCurrency] = useState("EUR");
	const [days, setDays] = useState("14");
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const load = async () => {
		const res = await api$9(NS$6);
		if (!res.ok) {
			setStatus(res.status === 403 || res.status === 401 ? "Nur für Administratoren." : `Fehler (HTTP ${res.status}).`);
			setLoaded(true);
			return;
		}
		const d = await res.json();
		const map = new Map((d.settings ?? []).map((s) => [s.key, s]));
		setKeyState(map.get("stripe_secret_key") ?? null);
		setWhState(map.get("stripe_webhook_secret") ?? null);
		setCurrency(map.get("default_currency")?.value || "EUR");
		setDays(map.get("days_until_due")?.value || "14");
		setLoaded(true);
	};
	useEffect(() => {
		load();
	}, []);
	const save = async () => {
		setBusy(true);
		setStatus(null);
		const settings = [
			{
				key: "stripe_secret_key",
				secret: true,
				value: keyInput.trim()
			},
			{
				key: "stripe_webhook_secret",
				secret: true,
				value: whInput.trim()
			},
			{
				key: "default_currency",
				secret: false,
				value: currency.trim().toUpperCase()
			},
			{
				key: "days_until_due",
				secret: false,
				value: days.trim()
			}
		];
		const res = await api$9(NS$6, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ settings })
		});
		setBusy(false);
		if (res.ok) {
			setKeyInput("");
			setWhInput("");
			toast.success("Gespeichert.");
			load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const hint = (s) => s?.configured ? `konfiguriert (…${s.last4 ?? "????"})` : "nicht konfiguriert";
	if (!loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "billing-settings space-y-4",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-sm",
					children: ["Stripe Secret Key ", /* @__PURE__ */ jsxs("em", {
						className: "opacity-60",
						children: [
							"(",
							hint(keyState),
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: keyInput,
					onChange: (e) => setKeyInput(e.target.value),
					placeholder: "sk_… (leer = behalten)",
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-sm",
					children: ["Webhook Secret ", /* @__PURE__ */ jsxs("em", {
						className: "opacity-60",
						children: [
							"(",
							hint(whState),
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: whInput,
					onChange: (e) => setWhInput(e.target.value),
					placeholder: "whsec_… (leer = behalten)",
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Standard-Währung"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						maxLength: 3,
						value: currency,
						onChange: (e) => setCurrency(e.target.value),
						placeholder: "EUR"
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Zahlungsziel (Tage)"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "number",
						min: "0",
						value: days,
						onChange: (e) => setDays(e.target.value),
						placeholder: "14"
					})]
				})]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-primary",
				onClick: save,
				disabled: busy,
				"aria-busy": busy,
				children: "Speichern"
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-billing/islands/Settings.astro
var $$Settings$8 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body"><h3>Stripe / Rechnungen</h3>${renderComponent($$result, "BillingSettings", BillingSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/islands/BillingSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/islands/Settings.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-time-tracker/islands/Settings.astro
var $$Settings$7 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body"><p>Einstellungen der Zeiterfassung (Platzhalter).</p></div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-time-tracker/islands/Settings.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/LexwareSettings.tsx
var api$8 = apiFetch;
var NS$5 = "/admin/settings/lexware";
/**
* Lexware settings — API key + URL + default net hourly rate + tax rate,
* persisted in the core runtime settings store (`/admin/settings/lexware`,
* admin-only). The secret key comes back masked (configured + last4); a blank
* key on save keeps the existing value. The backend reads these DB-first with an
* env fallback. A connection test hits GET /lexware/admin/test.
*/
function LexwareSettings() {
	const [loaded, setLoaded] = useState(false);
	const [keyState, setKeyState] = useState(null);
	const [keyInput, setKeyInput] = useState("");
	const [url, setUrl] = useState("https://api.lexware.io/v1");
	const [rate, setRate] = useState("");
	const [tax, setTax] = useState("19");
	const [status, setStatus] = useState(null);
	const [testResult, setTestResult] = useState(null);
	const [busy, setBusy] = useState(false);
	const load = async () => {
		const res = await api$8(NS$5);
		if (!res.ok) {
			setStatus(res.status === 403 || res.status === 401 ? "Nur für Administratoren." : `Fehler (HTTP ${res.status}).`);
			setLoaded(true);
			return;
		}
		const d = await res.json();
		const map = new Map((d.settings ?? []).map((s) => [s.key, s]));
		setKeyState(map.get("api_key") ?? null);
		setUrl(map.get("api_url")?.value || "https://api.lexware.io/v1");
		setRate(map.get("default_hourly_rate")?.value ?? "");
		setTax(map.get("default_tax_rate")?.value || "19");
		setLoaded(true);
	};
	useEffect(() => {
		load();
	}, []);
	const save = async () => {
		setBusy(true);
		setStatus(null);
		const settings = [
			{
				key: "api_key",
				secret: true,
				value: keyInput.trim()
			},
			{
				key: "api_url",
				secret: false,
				value: url.trim()
			},
			{
				key: "default_hourly_rate",
				secret: false,
				value: rate.trim()
			},
			{
				key: "default_tax_rate",
				secret: false,
				value: tax.trim()
			}
		];
		const res = await api$8(NS$5, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ settings })
		});
		setBusy(false);
		if (res.ok) {
			setKeyInput("");
			toast.success("Gespeichert.");
			load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const test = async () => {
		setTestResult("Teste …");
		const res = await api$8("/lexware/admin/test");
		const d = await res.json().catch(() => ({}));
		if (res.ok && d.ok) setTestResult("Verbindung erfolgreich.");
		else setTestResult(`Fehlgeschlagen: ${d.error ?? `HTTP ${res.status}`}`);
	};
	const secretHint = keyState?.configured ? `konfiguriert (…${keyState.last4 ?? "????"})` : "nicht konfiguriert";
	if (!loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "lexware-settings space-y-4",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-sm",
					children: ["API-Key ", /* @__PURE__ */ jsxs("em", {
						className: "opacity-60",
						children: [
							"(",
							secretHint,
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: keyInput,
					onChange: (e) => setKeyInput(e.target.value),
					placeholder: "Neuen Schlüssel setzen (leer = behalten)",
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "API-URL"
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					value: url,
					onChange: (e) => setUrl(e.target.value),
					placeholder: "https://api.lexware.io/v1"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Standard-Stundensatz (netto)"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "number",
						min: "0",
						step: "0.01",
						value: rate,
						onChange: (e) => setRate(e.target.value),
						placeholder: "0"
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Steuersatz (%)"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "number",
						min: "0",
						step: "0.1",
						value: tax,
						onChange: (e) => setTax(e.target.value),
						placeholder: "19"
					})]
				})]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsx("button", {
					className: "btn btn-primary",
					type: "button",
					onClick: save,
					disabled: busy,
					children: "Speichern"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: test,
					children: "Verbindung testen"
				})]
			}),
			testResult ? /* @__PURE__ */ jsx("p", {
				className: "text-sm opacity-80",
				children: testResult
			}) : null
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/Settings.astro
var $$Settings$6 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body"><h3>Lexware Office</h3>${renderComponent($$result, "LexwareSettings", LexwareSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/LexwareSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/Settings.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/NotificationSettings.tsx
var LABELS = {
	notify_admin_on_new: "Admin bei neuem Ticket benachrichtigen",
	notify_customer_on_status: "Kunde bei Statusänderung benachrichtigen",
	notify_customer_on_reply: "Kunde bei Antwort benachrichtigen"
};
var api$7 = apiFetch;
/**
* Admin notification toggles (checkpoint-4). Reads/writes
* /admin/ticket-settings. Emails also require the core Mailer (MAIL_DSN) + a
* recipient, so a toggle on with no SMTP simply no-ops.
*/
function NotificationSettings() {
	const [toggles, setToggles] = useState(null);
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		api$7("/admin/ticket-settings").then((r) => r.ok ? r.json() : { settings: {} }).then((d) => setToggles(d.settings ?? {})).catch(() => setToggles({}));
	}, []);
	/**
	* The toggle flips optimistically, so the response MUST be checked: this
	* used to `await` the PUT and discard it, which meant a 403 or a 500 left
	* the checkbox showing a setting that was never stored. On failure the
	* optimistic flip is rolled back and the reason is toasted.
	*/
	const save = async (next) => {
		const previous = toggles;
		setToggles(next);
		setSaving(true);
		try {
			const res = await api$7("/admin/ticket-settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(next)
			});
			if (res.ok) toast.success("Benachrichtigungen gespeichert.");
			else {
				setToggles(previous);
				toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
			}
		} catch {
			setToggles(previous);
			toast.danger("Speichern fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setSaving(false);
		}
	};
	if (toggles === null) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsx("fieldset", {
		className: "ticket-settings",
		disabled: saving,
		children: Object.keys(LABELS).map((key) => /* @__PURE__ */ jsxs("label", {
			className: "tds-toggle-row",
			children: [/* @__PURE__ */ jsx("span", { children: LABELS[key] }), /* @__PURE__ */ jsx("input", {
				type: "checkbox",
				checked: Boolean(toggles[key]),
				onChange: (e) => save({
					...toggles,
					[key]: e.target.checked
				})
			})]
		}, key))
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/ImapSettings.tsx
var api$6 = apiFetch;
var NS$4 = "/admin/settings/support-tickets";
var STATUS = "/admin/tickets/imap";
var TEST = "/admin/tickets/imap-test";
var POLL = "/admin/tickets/ingest";
/** Coded defaults, mirrored from the API's `ImapConfig`. */
var DEFAULTS = {
	port: "993",
	security: "ssl",
	folder: "INBOX",
	mode: "reply"
};
var MODES = [
	{
		value: "off",
		label: "Aus",
		hint: "Das Postfach wird nicht abgerufen."
	},
	{
		value: "reply",
		label: "Nur Antworten auf bestehende Tickets",
		hint: "Antworten landen am passenden Ticket. Mails ohne Bezug werden verworfen."
	},
	{
		value: "allowlist",
		label: "Neue Tickets nur von erlaubten Absendern",
		hint: "Zusätzlich zu Antworten: Mails der unten gelisteten Adressen und Domains öffnen ein neues Ticket."
	},
	{
		value: "all",
		label: "Neue Tickets von allen Absendern",
		hint: "Jede unbekannte Mail wird zu einem Ticket — auch Spam. Nur für ein Postfach sinnvoll, das ausschließlich Support-Mails empfängt."
	}
];
/**
* *E-Mail-Eingang (IMAP)* — the mailbox the support system reads, and the rule
* that decides what an incoming mail becomes.
*
* Two reads, because they answer different questions: the settings namespace
* holds what is *stored* (and is what this form edits), while
* `GET /admin/tickets/imap` reports what the ingest actually *uses* — including
* a mailbox that still comes from the host's `IMAP_*`. Showing only the former
* would present an empty form on a host whose ingest works, and the first "fix"
* would overwrite a working mailbox.
*
* The password and the ingest token are secrets: they come back masked and a
* blank field on save keeps the stored value, so neither round-trips through
* the browser.
*
* Two actions sit below the form because saving is neither connecting nor
* fetching: IMAP fails on things no form can validate (wrong port, refused
* login, a folder that does not exist), and the poll is the whole point — on a
* host with no cron, "Jetzt abrufen" is how mail becomes tickets at all until
* an external scheduler calls the token-gated route.
*/
function ImapSettings() {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [status, setStatus] = useState(null);
	const [host, setHost] = useState("");
	const [port, setPort] = useState(DEFAULTS.port);
	const [security, setSecurity] = useState(DEFAULTS.security);
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [passwordState, setPasswordState] = useState(null);
	const [folder, setFolder] = useState(DEFAULTS.folder);
	const [mode, setMode] = useState(DEFAULTS.mode);
	const [allowlist, setAllowlist] = useState("");
	const [matchCompany, setMatchCompany] = useState(true);
	const [token, setToken] = useState("");
	const [tokenState, setTokenState] = useState(null);
	const [actionError, setActionError] = useState(null);
	const [busy, setBusy] = useState(false);
	const [testing, setTesting] = useState(false);
	const [polling, setPolling] = useState(false);
	const load = async () => {
		try {
			const [settingsRes, statusRes] = await Promise.all([api$6(NS$4), api$6(STATUS)]);
			if (!settingsRes.ok) {
				setError(settingsRes.status === 401 || settingsRes.status === 403 ? "Nur für Administratoren." : `Einstellungen konnten nicht geladen werden (HTTP ${settingsRes.status}).`);
				setLoaded(true);
				return;
			}
			const data = await settingsRes.json();
			const map = new Map((data.settings ?? []).map((s) => [s.key, s]));
			setHost(map.get("imap_host")?.value ?? "");
			setPort(map.get("imap_port")?.value || DEFAULTS.port);
			setSecurity(map.get("imap_security")?.value || DEFAULTS.security);
			setUser(map.get("imap_user")?.value ?? "");
			setPasswordState(map.get("imap_password") ?? null);
			setFolder(map.get("imap_folder")?.value || DEFAULTS.folder);
			setMode(map.get("ingest_mode")?.value || DEFAULTS.mode);
			setAllowlist(map.get("ingest_allowlist")?.value ?? "");
			setMatchCompany(map.get("ingest_match_company")?.value !== "0");
			setTokenState(map.get("ingest_token") ?? null);
			setStatus(statusRes.ok ? await statusRes.json() : null);
			setError(null);
		} catch {
			setError("Einstellungen konnten nicht geladen werden — die API ist nicht erreichbar.");
		} finally {
			setLoaded(true);
		}
	};
	useEffect(() => {
		load();
	}, []);
	const save = async () => {
		setBusy(true);
		try {
			const res = await api$6(NS$4, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ settings: [
					{
						key: "imap_host",
						secret: false,
						value: host.trim()
					},
					{
						key: "imap_port",
						secret: false,
						value: port.trim()
					},
					{
						key: "imap_security",
						secret: false,
						value: security
					},
					{
						key: "imap_user",
						secret: false,
						value: user.trim()
					},
					{
						key: "imap_password",
						secret: true,
						value: password
					},
					{
						key: "imap_folder",
						secret: false,
						value: folder.trim()
					},
					{
						key: "ingest_mode",
						secret: false,
						value: mode
					},
					{
						key: "ingest_allowlist",
						secret: false,
						value: allowlist.trim()
					},
					{
						key: "ingest_match_company",
						secret: false,
						value: matchCompany ? "1" : "0"
					},
					{
						key: "ingest_token",
						secret: true,
						value: token
					}
				] })
			});
			if (res.ok) {
				setPassword("");
				setToken("");
				toast.success("Gespeichert.");
				load();
			} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			toast.danger("Speichern fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setBusy(false);
		}
	};
	const test = async () => {
		setTesting(true);
		setActionError(null);
		try {
			const res = await api$6(TEST);
			const data = await res.json().catch(() => null);
			if (res.ok && data?.ok) toast.success("Verbindung steht.");
			else setActionError(data?.error ? `Verbindung fehlgeschlagen (HTTP ${res.status}): ${data.error}` : `Verbindung fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			setActionError("Verbindung fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setTesting(false);
		}
	};
	const pollNow = async () => {
		setPolling(true);
		setActionError(null);
		try {
			const res = await api$6(POLL, { method: "POST" });
			const data = await res.json().catch(() => null);
			if (!res.ok || !data) {
				setActionError(data?.error ? `Abruf fehlgeschlagen (HTTP ${res.status}): ${data.error}` : `Abruf fehlgeschlagen (HTTP ${res.status}).`);
				return;
			}
			if (!data.polled) {
				setActionError(data.mode === "off" ? "Kein Abruf: Die Annahme steht auf „Aus“." : "Kein Abruf: Es ist kein Postfach hinterlegt.");
				return;
			}
			toast.success(`${data.processed} Mail(s) gelesen — ${data.created} neu, ${data.appended} angehängt, ${data.skipped} übersprungen.`);
			window.dispatchEvent(new CustomEvent("tds:notification"));
		} catch {
			setActionError("Abruf fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setPolling(false);
		}
	};
	const secretHint = (s, verb) => s?.configured ? `hinterlegt (…${s.last4 ?? "????"})` : verb;
	const sourceLabel = () => {
		if (!status) return {
			text: "Status unbekannt",
			variant: "warning"
		};
		if (!status.configured) return {
			text: "Kein Postfach eingerichtet",
			variant: "danger"
		};
		if (!status.polling) return {
			text: "Postfach eingerichtet, Annahme aus",
			variant: "warning"
		};
		return status.source === "env" ? {
			text: "Aktiv über IMAP_* aus der .env des Hosts",
			variant: "warning"
		} : {
			text: "Aktiv über diese Einstellungen",
			variant: "success"
		};
	};
	if (!loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	const state = sourceLabel();
	const activeMode = MODES.find((m) => m.value === mode);
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx(FormAlert, { message: error }),
			/* @__PURE__ */ jsxs("p", {
				className: "tds-row",
				children: [/* @__PURE__ */ jsx("span", {
					className: `status-pill status-pill--${state.variant}`,
					children: state.text
				}), status?.configured ? /* @__PURE__ */ jsxs("span", {
					className: "marginalia",
					children: [
						status.user,
						" @ ",
						status.host,
						":",
						status.port,
						" (",
						status.folder,
						")"
					]
				}) : null]
			}),
			status?.source === "env" ? /* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Der Abruf läuft derzeit über ",
					/* @__PURE__ */ jsx("code", { children: "IMAP_*" }),
					" aus der ",
					/* @__PURE__ */ jsx("code", { children: ".env" }),
					" des Hosts. Sobald hier ein Postfach eingetragen und gespeichert ist, gilt diese Einstellung — die",
					" ",
					/* @__PURE__ */ jsx("code", { children: ".env" }),
					" bleibt nur noch Rückfallebene."
				]
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "IMAP-Server"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: host,
							onChange: (e) => setHost(e.target.value),
							placeholder: "imap.example.net",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Port"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "number",
							min: "1",
							max: "65535",
							value: port,
							onChange: (e) => setPort(e.target.value),
							placeholder: DEFAULTS.port
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Verschlüsselung"
						}), /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: security,
							onChange: (e) => setSecurity(e.target.value),
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "ssl",
									children: "SSL/TLS (Port 993)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "tls",
									children: "STARTTLS (Port 143)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "none",
									children: "Keine"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Ordner"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: folder,
							onChange: (e) => setFolder(e.target.value),
							placeholder: DEFAULTS.folder,
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Benutzername"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: user,
							onChange: (e) => setUser(e.target.value),
							placeholder: "support@example.net",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-sm",
							children: ["Passwort ", /* @__PURE__ */ jsxs("em", {
								className: "opacity-60",
								children: [
									"(",
									secretHint(passwordState, "nicht hinterlegt"),
									")"
								]
							})]
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "leer = bestehendes Passwort behalten",
							autoComplete: "new-password"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("hr", {}),
			/* @__PURE__ */ jsx("h3", {
				className: "text-sm",
				children: "Annahme eingehender Mails"
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "Regel"
				}), /* @__PURE__ */ jsx("select", {
					className: "field-boxed",
					value: mode,
					onChange: (e) => setMode(e.target.value),
					children: MODES.map((m) => /* @__PURE__ */ jsx("option", {
						value: m.value,
						children: m.label
					}, m.value))
				})]
			}),
			activeMode ? /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: activeMode.hint
			}) : null,
			mode === "allowlist" ? /* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "Erlaubte Absender"
				}), /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					rows: 4,
					value: allowlist,
					onChange: (e) => setAllowlist(e.target.value),
					placeholder: "chef@kunde.de\n@partner.de"
				})]
			}) : null,
			mode === "allowlist" ? /* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Eine Adresse oder eine ganze Domain je Zeile (Komma geht auch). ",
					/* @__PURE__ */ jsx("code", { children: "@partner.de" }),
					" ",
					"und ",
					/* @__PURE__ */ jsx("code", { children: "partner.de" }),
					" bedeuten dasselbe und schließen Subdomains ein."
				]
			}) : null,
			/* @__PURE__ */ jsxs("label", {
				className: "tds-toggle-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Absender einer bekannten Firma zuordnen" }), /* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: matchCompany,
					onChange: (e) => setMatchCompany(e.target.checked)
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Stimmt die Absenderadresse mit der E-Mail einer Firma im Firmenverzeichnis überein, wird das Ticket dieser Firma zugeordnet und ist damit auch in deren Portal sichtbar. Sonst bleibt es ein reines Verwaltungs-Ticket."
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-sm",
					children: ["Ingest-Token ", /* @__PURE__ */ jsxs("em", {
						className: "opacity-60",
						children: [
							"(",
							secretHint(tokenState, "nicht gesetzt"),
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: token,
					onChange: (e) => setToken(e.target.value),
					placeholder: "leer = bestehendes Token behalten",
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Nur nötig, wenn ein externer Zeitplan (z. B. ein Cron-Dienst) den Abruf regelmäßig anstoßen soll: ",
					/* @__PURE__ */ jsx("code", { children: "POST /tickets/ingest?token=…" }),
					". Ohne Token ist diese Route abgeschaltet; „Jetzt abrufen\" unten funktioniert davon unabhängig. Dasselbe Token schützt den Kontaktformular-Eingang."
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => void save(),
					disabled: busy,
					children: busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
				})
			}),
			/* @__PURE__ */ jsx("hr", {}),
			/* @__PURE__ */ jsx(FormAlert, { message: actionError }),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => void test(),
					disabled: testing || !status?.configured,
					children: testing ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Verbindung testen"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => void pollNow(),
					disabled: polling || !status?.configured,
					children: polling ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Jetzt abrufen"
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Beide Aktionen verwenden die ",
					/* @__PURE__ */ jsx("strong", { children: "gespeicherte" }),
					" Konfiguration — vorher speichern. Abgerufen werden ungelesene Mails (max. 50 je Durchgang); verarbeitete Mails werden als gelesen markiert."
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/Settings.astro
var $$Settings$5 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body tds-stack"><h3>E-Mail-Benachrichtigungen</h3>${renderComponent($$result, "NotificationSettings", NotificationSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/NotificationSettings.tsx",
		"client:component-export": "default"
	})}<h3>E-Mail-Eingang (IMAP)</h3>${renderComponent($$result, "ImapSettings", ImapSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/ImapSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/Settings.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/Settings.astro
var $$Settings$4 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body"><p>Kontaktanfragen-Einstellungen (Benachrichtigungs-Empfänger folgt).</p></div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/Settings.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/LiveChatSettings.tsx
var api$5 = apiFetch;
var NS$3 = "/admin/settings/live-chat-cta";
var FRONTENDS = [
	{
		key: "landingpage",
		label: "Landingpage"
	},
	{
		key: "blog",
		label: "Blog"
	},
	{
		key: "customer",
		label: "Kundenportal"
	},
	{
		key: "admin",
		label: "Admin"
	},
	{
		key: "tools",
		label: "Tools"
	}
];
var FEATURES = [
	{
		key: "chat",
		label: "Chat"
	},
	{
		key: "faq",
		label: "FAQ"
	},
	{
		key: "docs",
		label: "Doku"
	},
	{
		key: "contact",
		label: "Kontakt"
	}
];
function LiveChatSettings() {
	const [loaded, setLoaded] = useState(false);
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const [values, setValues] = useState({});
	const allKeys = useMemo(() => {
		const keys = [
			"cta_label",
			"cta_greeting",
			"cta_accent",
			"agent_email"
		];
		for (const f of FRONTENDS) {
			keys.push(`${f.key}_enabled`);
			for (const feat of FEATURES) keys.push(`${f.key}_${feat.key}`);
		}
		return keys;
	}, []);
	const load = async () => {
		const res = await api$5(NS$3);
		if (!res.ok) {
			setStatus(res.status === 401 || res.status === 403 ? "Nur für Administratoren." : `Fehler (HTTP ${res.status}).`);
			setLoaded(true);
			return;
		}
		const d = await res.json();
		const map = new Map((d.settings ?? []).map((s) => [s.key, s]));
		const next = {};
		for (const k of allKeys) next[k] = map.get(k)?.value ?? "";
		if (!map.has("cta_label")) next.cta_label = "Fragen? Schreib uns";
		if (!map.has("cta_greeting")) next.cta_greeting = "Hallo! Wie können wir helfen?";
		if (!map.has("cta_accent")) next.cta_accent = "#050f68";
		for (const f of FRONTENDS) for (const feat of FEATURES) if (!map.has(`${f.key}_${feat.key}`)) next[`${f.key}_${feat.key}`] = "1";
		setValues(next);
		setLoaded(true);
	};
	useEffect(() => {
		load();
	}, []);
	const set = (key, value) => setValues((v) => ({
		...v,
		[key]: value
	}));
	const flag = (key) => values[key] === "1";
	const toggle = (key) => set(key, flag(key) ? "0" : "1");
	const save = async () => {
		setBusy(true);
		setStatus(null);
		const settings = allKeys.map((key) => ({
			key,
			secret: false,
			value: values[key] ?? ""
		}));
		const res = await api$5(NS$3, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ settings })
		});
		setBusy(false);
		if (res.ok) {
			toast.success("Gespeichert.");
			load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	if (!loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-settings space-y-5",
		children: [
			/* @__PURE__ */ jsxs("fieldset", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsx("legend", {
						className: "text-sm font-semibold",
						children: "Widget"
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "CTA-Text (Button)"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: values.cta_label ?? "",
							onChange: (e) => set("cta_label", e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Begrüßung im Panel"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: values.cta_greeting ?? "",
							onChange: (e) => set("cta_greeting", e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Akzentfarbe"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "color",
								value: values.cta_accent || "#050f68",
								onChange: (e) => set("cta_accent", e.target.value)
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Benachrichtigungs-E-Mail"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "email",
								value: values.agent_email ?? "",
								onChange: (e) => set("agent_email", e.target.value),
								placeholder: "support@…"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsx("legend", {
						className: "text-sm font-semibold",
						children: "Aktivierung je Frontend"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm opacity-70",
						children: "Widget pro Frontend an/aus — und je Frontend einzeln festlegen, welche Funktionen erscheinen."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "live-chat-settings__matrix",
						children: /* @__PURE__ */ jsxs("table", {
							className: "tds-table",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", { children: "Frontend" }),
								/* @__PURE__ */ jsx("th", { children: "Aktiv" }),
								FEATURES.map((f) => /* @__PURE__ */ jsx("th", { children: f.label }, f.key))
							] }) }), /* @__PURE__ */ jsx("tbody", { children: FRONTENDS.map((fe) => {
								const on = flag(`${fe.key}_enabled`);
								return /* @__PURE__ */ jsxs("tr", {
									className: on ? "" : "is-off",
									children: [
										/* @__PURE__ */ jsx("td", { children: fe.label }),
										/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: on,
											onChange: () => toggle(`${fe.key}_enabled`),
											"aria-label": `${fe.label} aktiv`
										}) }),
										FEATURES.map((feat) => /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: flag(`${fe.key}_${feat.key}`),
											disabled: !on,
											onChange: () => toggle(`${fe.key}_${feat.key}`),
											"aria-label": `${fe.label} ${feat.label}`
										}) }, feat.key))
									]
								}, fe.key);
							}) })]
						})
					})
				]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-primary",
				type: "button",
				onClick: save,
				disabled: busy,
				children: "Speichern"
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/Settings.astro
var $$Settings$3 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body"><h3>Live-Chat</h3>${renderComponent($$result, "LiveChatSettings", LiveChatSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/LiveChatSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/Settings.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/WebsiteSettings.tsx
var api$4 = apiFetch;
var NS$2 = "/admin/settings/website-cms";
/**
* Website-CMS settings section — DeepL key and auto-translate flag.
* persisted in the core's runtime settings store (`/admin/settings/website-cms`,
* admin-only). Secrets come back masked (configured + last4) and a blank secret
* on save keeps the existing value. The extension backend reads these DB-first
* with an env fallback. Mirror of blog-cms's BlogSettings.
*/
function WebsiteSettings() {
	const [loaded, setLoaded] = useState(false);
	const [deeplState, setDeeplState] = useState(null);
	const [autoTranslate, setAutoTranslate] = useState(true);
	const [deeplInput, setDeeplInput] = useState("");
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const load = async () => {
		setStatus(null);
		let res;
		try {
			res = await api$4(NS$2);
		} catch {
			setStatus("Einstellungen konnten nicht geladen werden (Netzwerkfehler).");
			setLoaded(true);
			return;
		}
		if (!res.ok) {
			setStatus(res.status === 403 || res.status === 401 ? "Nur für Administratoren." : `Fehler (HTTP ${res.status}).`);
			setLoaded(true);
			return;
		}
		let d;
		try {
			d = await res.json();
		} catch {
			setStatus("Einstellungen konnten nicht gelesen werden (ungültige Serverantwort).");
			setLoaded(true);
			return;
		}
		const map = new Map((d.settings ?? []).map((s) => [s.key, s]));
		setDeeplState(map.get("deepl_api_key") ?? null);
		const at = map.get("auto_translate");
		setAutoTranslate(at?.value !== "0");
		setLoaded(true);
	};
	useEffect(() => {
		load();
	}, []);
	const save = async () => {
		setBusy(true);
		setStatus(null);
		const settings = [{
			key: "deepl_api_key",
			secret: true,
			value: deeplInput.trim()
		}, {
			key: "auto_translate",
			secret: false,
			value: autoTranslate ? "1" : "0"
		}];
		let res;
		try {
			res = await api$4(NS$2, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ settings })
			});
		} catch {
			setBusy(false);
			toast.danger("Speichern fehlgeschlagen (Netzwerkfehler).");
			return;
		}
		setBusy(false);
		if (res.ok) {
			setDeeplInput("");
			toast.success("Gespeichert.");
			load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const secretHint = (s) => s?.configured ? `konfiguriert (…${s.last4 ?? "????"})` : "nicht konfiguriert";
	if (!loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "website-settings space-y-4",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-sm",
					children: ["DeepL API-Key ", /* @__PURE__ */ jsxs("em", {
						className: "opacity-60",
						children: [
							"(",
							secretHint(deeplState),
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: deeplInput,
					onChange: (e) => setDeeplInput(e.target.value),
					placeholder: "Neuen Schlüssel setzen (leer = behalten)",
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: autoTranslate,
					onChange: (e) => setAutoTranslate(e.target.checked)
				}), /* @__PURE__ */ jsx("span", { children: "Automatische Übersetzung (DeepL) aktiv" })]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Die API- und Cache-Verbindung wird direkt bei der jeweiligen Website eingerichtet. Zugangsdaten werden hier nicht angezeigt."
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-primary",
				type: "button",
				onClick: save,
				disabled: busy,
				children: "Speichern"
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/SiteRegistry.tsx
var api$3 = apiFetch;
/**
* The managed-website registry — **this is where a website is added**, and the
* only place its rebuild target and page-cache address are set.
*
* All of it used to sit on the Website-CMS content screen, above the text
* somebody had come to edit: a repository name, a GitHub workflow filename and
* a deploy button, on the page an operator opens to fix a typo. Connecting a
* site is a once-per-site act by whoever runs the platform; editing its words
* is a daily act by whoever writes them. They are now two screens.
*
* ### Two buttons that sound alike and are not
*
* *Jetzt neu bauen* dispatches a CI workflow: it ships **code**, takes minutes
* and is for a design or template change. *Seiten-Cache neu bauen* re-renders
* pages from content already in the database: it takes seconds and is what a
* save does automatically. The copy says so at every call site, because the
* pair has been confused before and the expensive one is the wrong guess.
*/
function SiteRegistry() {
	const sitesQuery = useCachedJson("/cms/sites");
	const blogsQuery = useCachedJson("/blogs");
	const sites = sitesQuery.data?.sites ?? [];
	const blogs = blogsQuery.data?.blogs ?? [];
	const sitesVisiblyStale = sitesQuery.stale || sitesQuery.error !== null && sitesQuery.data !== void 0;
	const [key, setKey] = useState("");
	const [name, setName] = useState("");
	const [creating, setCreating] = useState(false);
	const [formError, setFormError] = useState(null);
	const create = async (event) => {
		event.preventDefault();
		const siteKey = key.trim();
		if (!/^[a-z0-9-]{2,64}$/.test(siteKey)) {
			setFormError("Der Schlüssel darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten (2–64 Zeichen).");
			return;
		}
		if (name.trim() === "") {
			setFormError("Ein Name ist erforderlich.");
			return;
		}
		setFormError(null);
		setCreating(true);
		let res;
		try {
			res = await api$3("/cms/sites", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					site_key: siteKey,
					name: name.trim()
				})
			});
		} catch {
			setCreating(false);
			toast.danger("Anlegen fehlgeschlagen (Netzwerkfehler).");
			return;
		}
		setCreating(false);
		if (res.ok) {
			setKey("");
			setName("");
			toast.success("Website angelegt.");
			invalidate("/cms/");
		} else toast.danger(`Anlegen fehlgeschlagen (HTTP ${res.status}).`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsxs("form", {
				className: "tds-stack tds-stack--tight",
				onSubmit: create,
				noValidate: true,
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "marginalia",
						children: [
							"Der Schlüssel verbindet die Inhalte mit der öffentlichen Website und lässt sich später nicht ändern — ",
							/* @__PURE__ */ jsx("code", { children: "landingpage" }),
							", ",
							/* @__PURE__ */ jsx("code", { children: "blog" }),
							", …"
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block text-sm",
							children: ["Schlüssel", /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: key,
								onChange: (e) => setKey(e.target.value),
								placeholder: "landingpage",
								autoComplete: "off"
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "block text-sm",
							children: ["Name", /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Startseite tracht-digital.de"
							})]
						})]
					}),
					formError ? /* @__PURE__ */ jsx("p", {
						className: "tds-alert tds-alert--danger",
						role: "alert",
						children: formError
					}) : null,
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "submit",
						disabled: creating,
						children: creating ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Website hinzufügen"
					})
				]
			}),
			sitesQuery.error && sites.length > 0 ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Websites konnten nicht aktualisiert werden (",
					sitesQuery.error.message,
					"). Die angezeigten Daten sind möglicherweise veraltet."
				]
			}) : null,
			sitesQuery.loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : sitesQuery.error && sites.length === 0 ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Websites konnten nicht geladen werden (",
					sitesQuery.error.message,
					")."
				]
			}) : sites.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch keine Website verbunden."
			}) : /* @__PURE__ */ jsx("div", {
				className: staleClass(sitesVisiblyStale, "tds-stack"),
				"aria-busy": sitesVisiblyStale,
				children: sites.map((site) => /* @__PURE__ */ jsx(SiteCard, {
					site,
					blogs
				}, site.id))
			})
		]
	});
}
/** One-click API connection and targeted page-cache refresh for one site. */
function SiteCard({ site, blogs }) {
	const [connection, setConnection] = useState(null);
	const [origin, setOrigin] = useState("");
	const [blog, setBlog] = useState("");
	const [candidateKeys, setCandidateKeys] = useState(blogs.map((item) => item.blog_key));
	const [loading, setLoading] = useState(true);
	const [connecting, setConnecting] = useState(false);
	const [installUrl, setInstallUrl] = useState(null);
	const [connectionStatus, setConnectionStatus] = useState(null);
	const [cacheStatus, setCacheStatus] = useState(null);
	const loadConnection = async () => {
		try {
			const res = await api$3(`/cms/sites/${site.site_key}/connection`);
			if (res.status === 404) setConnection(null);
			else if (res.ok) {
				const body = await res.json();
				const next = body.connection ?? body;
				setConnection(next);
				setOrigin(next.origin ?? "");
			} else setConnectionStatus(`Verbindungsstatus konnte nicht geladen werden (HTTP ${res.status}).`);
		} catch {
			setConnectionStatus("Verbindungsstatus konnte nicht geladen werden (Netzwerkfehler).");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadConnection();
	}, [site.site_key]);
	useEffect(() => {
		const keys = blogs.map((item) => item.blog_key);
		setCandidateKeys(keys);
		if (keys.length === 1) setBlog(keys[0]);
	}, [blogs]);
	const connect = async () => {
		setConnecting(true);
		setConnectionStatus(null);
		setInstallUrl(null);
		try {
			const bindings = blog.trim() === "" ? {} : { blog: blog.trim() };
			const res = await api$3(`/cms/sites/${site.site_key}/connection/pairing`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					origin: origin.trim(),
					profile: "landingpage",
					bindings
				})
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) {
				if (Array.isArray(body.candidates)) setCandidateKeys(body.candidates.map(String));
				setConnectionStatus(res.status === 422 ? body.error ?? "Bitte eine reine HTTPS-Adresse und bei mehreren Blogs den passenden Blog-Schlüssel angeben." : `Verbinden fehlgeschlagen (HTTP ${res.status}).`);
				return;
			}
			setInstallUrl(body.fallback_url ?? body.install_url ?? null);
			if (body.delivered === true || body.connected === true) {
				toast.success("Website mit der API verbunden.");
				await loadConnection();
			} else setConnectionStatus("Die Website war nicht direkt erreichbar. Öffnen Sie den Einrichtungslink auf dem Website-Server.");
		} catch {
			setConnectionStatus("Verbinden fehlgeschlagen (Netzwerkfehler).");
		} finally {
			setConnecting(false);
		}
	};
	const disconnect = async () => {
		const res = await api$3(`/cms/sites/${site.site_key}/connection`, { method: "DELETE" });
		if (res.ok) {
			setConnection(null);
			setInstallUrl(null);
			toast.success("Verbindung getrennt.");
		} else toast.danger(`Trennen fehlgeschlagen (HTTP ${res.status}).`);
	};
	const rebuildCache = async () => {
		setCacheStatus("Seiten-Cache wird neu gebaut …");
		let res;
		try {
			res = await api$3(`/cms/sites/${site.site_key}/cache/rebuild`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ all: true })
			});
		} catch {
			setCacheStatus(null);
			toast.danger("Cache-Neubau fehlgeschlagen (Netzwerkfehler).");
			return;
		}
		if (res.ok) {
			setCacheStatus(null);
			toast.success("Cache-Neubau für die Website wurde angestoßen.");
		} else if (res.status === 422) setCacheStatus("Die gespeicherte Website-Adresse ist ungültig.");
		else if (res.status === 503) setCacheStatus("Die Website ist noch nicht vollständig mit der API verbunden.");
		else if (res.status === 502) setCacheStatus("Die Website ist erreichbar, aber der Cache-Neubau ist fehlgeschlagen. Bitte erneut versuchen.");
		else {
			setCacheStatus(null);
			toast.danger(`Cache-Neubau fehlgeschlagen (HTTP ${res.status}).`);
		}
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-card tds-stack",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-baseline gap-2",
				children: [/* @__PURE__ */ jsx("h4", { children: site.name }), /* @__PURE__ */ jsx("code", {
					className: "text-xs opacity-70",
					children: site.site_key
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block text-sm",
				children: ["Adresse der öffentlichen Website", /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					value: origin,
					onChange: (e) => setOrigin(e.target.value),
					placeholder: "https://tracht-digital.de"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Die Website übernimmt API-Schlüssel und Cache-Zugang automatisch. Nur die HTTPS-Adresse ohne Pfad eingeben."
			}),
			candidateKeys.length > 0 ? /* @__PURE__ */ jsxs("label", {
				className: "block text-sm",
				children: [
					"Blog-Inhalte verwenden ",
					candidateKeys.length > 1 ? /* @__PURE__ */ jsx("span", { children: "(erforderlich)" }) : null,
					/* @__PURE__ */ jsxs("select", {
						className: "field-boxed",
						value: blog,
						onChange: (e) => setBlog(e.target.value),
						children: [candidateKeys.length > 1 ? /* @__PURE__ */ jsx("option", {
							value: "",
							children: "Blog auswählen …"
						}) : null, candidateKeys.map((key) => {
							const label = blogs.find((item) => item.blog_key === key)?.name;
							return /* @__PURE__ */ jsx("option", {
								value: key,
								children: label ? `${label} (${key})` : key
							}, key);
						})]
					})
				]
			}) : null,
			loading ? /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Verbindungsstatus wird geladen …"] }) : connection ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--success",
				role: "status",
				children: ["Verbunden mit ", connection.origin ?? origin]
			}) : /* @__PURE__ */ jsx("p", {
				className: "tds-alert",
				role: "status",
				children: "Noch nicht mit der API verbunden."
			}),
			connectionStatus ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: connectionStatus
			}) : null,
			installUrl ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
				className: "btn btn-ghost",
				href: installUrl,
				children: "Einrichtungslink öffnen"
			}) }) : null,
			cacheStatus ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert",
				role: "status",
				children: cacheStatus
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: connect,
						disabled: connecting || origin.trim() === "" || candidateKeys.length > 1 && blog === "",
						children: connecting ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : connection ? "Neu verbinden" : "Mit API verbinden"
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-accent",
						type: "button",
						onClick: rebuildCache,
						children: "Seiten-Cache neu bauen"
					}),
					connection ? /* @__PURE__ */ jsx("button", {
						className: "btn btn-ghost",
						type: "button",
						onClick: disconnect,
						children: "Verbindung trennen"
					}) : null
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/Settings.astro
var $$Settings$2 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body"><h3>Website-CMS</h3>${renderComponent($$result, "WebsiteSettings", WebsiteSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/WebsiteSettings.tsx",
		"client:component-export": "default"
	})}<h4>Websites</h4><p class="marginalia">Hier werden Websites hinzugefügt. Die Inhalte selbst werden unter<a class="link-underline" href="/website">Website-CMS</a> bearbeitet — dort wird pro Seite ausgewählt, was geändert werden soll.</p>${renderComponent($$result, "SiteRegistry", SiteRegistry, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/SiteRegistry.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/Settings.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogSettings.tsx
var api$2 = apiFetch;
var NS$1 = "/admin/settings/blog-cms";
/**
* Blog-CMS settings section — DeepL key + auto-translate flag.
* persisted in the core's runtime settings store (`/admin/settings/blog-cms`,
* admin-only). Secrets come back masked (configured + last4) and a blank secret
* on save keeps the existing value, so the raw key never round-trips to the UI.
* The extension backend reads these DB-first with an env fallback.
*/
function BlogSettings() {
	const [loaded, setLoaded] = useState(false);
	const [deeplState, setDeeplState] = useState(null);
	const [autoTranslate, setAutoTranslate] = useState(true);
	const [deeplInput, setDeeplInput] = useState("");
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const load = async () => {
		const res = await api$2(NS$1);
		if (!res.ok) {
			setStatus(res.status === 403 || res.status === 401 ? "Nur für Administratoren." : `Fehler (HTTP ${res.status}).`);
			setLoaded(true);
			return;
		}
		const d = await res.json();
		const map = new Map((d.settings ?? []).map((s) => [s.key, s]));
		setDeeplState(map.get("deepl_api_key") ?? null);
		const at = map.get("auto_translate");
		setAutoTranslate(at?.value !== "0");
		setLoaded(true);
	};
	useEffect(() => {
		load();
	}, []);
	const save = async () => {
		setBusy(true);
		setStatus(null);
		const settings = [{
			key: "deepl_api_key",
			secret: true,
			value: deeplInput.trim()
		}, {
			key: "auto_translate",
			secret: false,
			value: autoTranslate ? "1" : "0"
		}];
		const res = await api$2(NS$1, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ settings })
		});
		setBusy(false);
		if (res.ok) {
			setDeeplInput("");
			toast.success("Gespeichert.");
			load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const secretHint = (s) => s?.configured ? `konfiguriert (…${s.last4 ?? "????"})` : "nicht konfiguriert";
	if (!loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "blog-settings space-y-4",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-sm",
					children: ["DeepL API-Key ", /* @__PURE__ */ jsxs("em", {
						className: "opacity-60",
						children: [
							"(",
							secretHint(deeplState),
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: deeplInput,
					onChange: (e) => setDeeplInput(e.target.value),
					placeholder: "Neuen Schlüssel setzen (leer = behalten)",
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: autoTranslate,
					onChange: (e) => setAutoTranslate(e.target.checked)
				}), /* @__PURE__ */ jsx("span", { children: "Automatische Übersetzung (DeepL) aktiv" })]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Die Verbindung zum öffentlichen Blog einschließlich Cache-Zugang wird direkt beim jeweiligen Blog eingerichtet. Zugangsdaten werden hier nicht angezeigt."
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-primary",
				type: "button",
				onClick: save,
				disabled: busy,
				children: "Speichern"
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogRegistry.tsx
var api$1 = apiFetch;
/**
* The managed-blogs registry — **this is where a blog is added**, and the only
* place its rebuild target and page-cache address are set.
*
* It moved off the Blog-CMS content screen for the same reason the website
* registry did: connecting a blog is a once-per-blog act by whoever runs the
* platform, writing its articles is a daily act by whoever writes them, and a
* GitHub repository field had no business sitting above the article list.
*
* ### Two rebuild buttons, and the expensive one is the wrong guess
*
* *Jetzt neu bauen* dispatches a CI build: it ships code, re-runs every DeepL
* translation and re-renders one OG card per post — minutes. *Seiten-Cache neu
* bauen* re-renders pages from articles already stored — seconds, and it is
* what publishing does by itself, per article.
*/
function BlogRegistry() {
	const blogsQuery = useCachedJson("/blogs");
	const websitesQuery = useCachedJson("/cms/sites");
	const blogs = blogsQuery.data?.blogs ?? [];
	const websites = websitesQuery.data?.sites ?? [];
	const [key, setKey] = useState("");
	const [name, setName] = useState("");
	const [creating, setCreating] = useState(false);
	const [formError, setFormError] = useState(null);
	const create = async (event) => {
		event.preventDefault();
		const blogKey = key.trim();
		if (!/^[a-z0-9-]{2,64}$/.test(blogKey)) {
			setFormError("Der Schlüssel darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten (2–64 Zeichen).");
			return;
		}
		if (name.trim() === "") {
			setFormError("Ein Name ist erforderlich.");
			return;
		}
		setFormError(null);
		setCreating(true);
		const res = await api$1("/blogs", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				blog_key: blogKey,
				name: name.trim()
			})
		});
		setCreating(false);
		if (res.ok) {
			setKey("");
			setName("");
			toast.success("Blog angelegt.");
			invalidate("/blogs");
		} else toast.danger(`Anlegen fehlgeschlagen (HTTP ${res.status}).`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsxs("form", {
				className: "tds-stack tds-stack--tight",
				onSubmit: create,
				noValidate: true,
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Der Schlüssel verbindet die Beiträge mit dem öffentlichen Blog und lässt sich später nicht ändern."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block text-sm",
							children: ["Schlüssel", /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: key,
								onChange: (e) => setKey(e.target.value),
								placeholder: "journal",
								autoComplete: "off"
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "block text-sm",
							children: ["Name", /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Journal blog.tracht-digital.de"
							})]
						})]
					}),
					formError ? /* @__PURE__ */ jsx("p", {
						className: "tds-alert tds-alert--danger",
						role: "alert",
						children: formError
					}) : null,
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "submit",
						disabled: creating,
						children: creating ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Blog hinzufügen"
					})
				]
			}),
			blogsQuery.error && blogs.length > 0 ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Die Blog-Liste konnte nicht aktualisiert werden (",
					blogsQuery.error.message,
					"). Die angezeigten Daten können veraltet sein."
				]
			}) : null,
			blogsQuery.loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : blogsQuery.error && blogs.length === 0 ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Blogs konnten nicht geladen werden (",
					blogsQuery.error.message,
					")."
				]
			}) : blogs.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch kein Blog verbunden."
			}) : /* @__PURE__ */ jsx("div", {
				className: staleClass(blogsQuery.stale, "tds-stack"),
				"aria-busy": blogsQuery.stale,
				children: blogs.map((blog) => /* @__PURE__ */ jsx(BlogCard, {
					blog,
					websites
				}, blog.id))
			})
		]
	});
}
/** One-click API connection and targeted page-cache refresh for one blog. */
function BlogCard({ blog, websites }) {
	const [connection, setConnection] = useState(null);
	const [origin, setOrigin] = useState("");
	const [website, setWebsite] = useState("");
	const [candidateKeys, setCandidateKeys] = useState(websites.map((item) => item.site_key));
	const [loading, setLoading] = useState(true);
	const [connecting, setConnecting] = useState(false);
	const [installUrl, setInstallUrl] = useState(null);
	const [connectionStatus, setConnectionStatus] = useState(null);
	const [cacheStatus, setCacheStatus] = useState(null);
	const loadConnection = async () => {
		try {
			const res = await api$1(`/blogs/${blog.blog_key}/connection`);
			if (res.status === 404) setConnection(null);
			else if (res.ok) {
				const body = await res.json();
				const next = body.connection ?? body;
				setConnection(next);
				setOrigin(next.origin ?? "");
			} else setConnectionStatus(`Verbindungsstatus konnte nicht geladen werden (HTTP ${res.status}).`);
		} catch {
			setConnectionStatus("Verbindungsstatus konnte nicht geladen werden (Netzwerkfehler).");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadConnection();
	}, [blog.blog_key]);
	useEffect(() => {
		const keys = websites.map((item) => item.site_key);
		setCandidateKeys(keys);
		if (keys.length === 1) setWebsite(keys[0]);
	}, [websites]);
	const connect = async () => {
		setConnecting(true);
		setConnectionStatus(null);
		setInstallUrl(null);
		try {
			const bindings = website.trim() === "" ? {} : { website: website.trim() };
			const res = await api$1(`/blogs/${blog.blog_key}/connection/pairing`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					origin: origin.trim(),
					profile: "blog",
					bindings
				})
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) {
				if (Array.isArray(body.candidates)) setCandidateKeys(body.candidates.map(String));
				setConnectionStatus(res.status === 422 ? body.error ?? "Bitte eine reine HTTPS-Adresse und bei mehreren Websites den passenden Website-Schlüssel angeben." : `Verbinden fehlgeschlagen (HTTP ${res.status}).`);
				return;
			}
			setInstallUrl(body.fallback_url ?? body.install_url ?? null);
			if (body.delivered === true || body.connected === true) {
				toast.success("Blog mit der API verbunden.");
				await loadConnection();
			} else setConnectionStatus("Die Website war nicht direkt erreichbar. Öffnen Sie den Einrichtungslink auf dem Blog-Server.");
		} catch {
			setConnectionStatus("Verbinden fehlgeschlagen (Netzwerkfehler).");
		} finally {
			setConnecting(false);
		}
	};
	const disconnect = async () => {
		const res = await api$1(`/blogs/${blog.blog_key}/connection`, { method: "DELETE" });
		if (res.ok) {
			setConnection(null);
			setInstallUrl(null);
			toast.success("Verbindung getrennt.");
		} else toast.danger(`Trennen fehlgeschlagen (HTTP ${res.status}).`);
	};
	const rebuildCache = async () => {
		setCacheStatus("Seiten-Cache wird neu gebaut …");
		const res = await api$1(`/blogs/${blog.blog_key}/cache/rebuild`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({})
		});
		if (res.ok) {
			setCacheStatus(null);
			toast.success("Cache-Neubau wurde angefragt.");
		} else if (res.status === 422) setCacheStatus("Die gespeicherte Website-Adresse ist ungültig.");
		else if (res.status === 503) setCacheStatus("Der Blog ist noch nicht vollständig mit der API verbunden.");
		else if (res.status === 502) setCacheStatus("Der Blog ist erreichbar, aber der Cache-Neubau ist fehlgeschlagen. Bitte erneut versuchen.");
		else {
			setCacheStatus(null);
			toast.danger(`Cache-Neubau fehlgeschlagen (HTTP ${res.status}).`);
		}
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-card tds-stack",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-baseline gap-2",
				children: [/* @__PURE__ */ jsx("h4", { children: blog.name }), /* @__PURE__ */ jsx("code", {
					className: "text-xs opacity-70",
					children: blog.blog_key
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block text-sm",
				children: ["Adresse des öffentlichen Blogs", /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "url",
					inputMode: "url",
					value: origin,
					onChange: (e) => setOrigin(e.target.value),
					placeholder: "https://blog.tracht-digital.de"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Der Blog übernimmt API-Schlüssel und Cache-Zugang automatisch. Nur die HTTPS-Adresse ohne Pfad eingeben."
			}),
			candidateKeys.length > 0 ? /* @__PURE__ */ jsxs("label", {
				className: "block text-sm",
				children: [
					"Website-Inhalte verwenden ",
					candidateKeys.length > 1 ? /* @__PURE__ */ jsx("span", { children: "(erforderlich)" }) : null,
					/* @__PURE__ */ jsxs("select", {
						className: "field-boxed",
						value: website,
						onChange: (e) => setWebsite(e.target.value),
						children: [candidateKeys.length > 1 ? /* @__PURE__ */ jsx("option", {
							value: "",
							children: "Website auswählen …"
						}) : null, candidateKeys.map((key) => {
							const label = websites.find((item) => item.site_key === key)?.name;
							return /* @__PURE__ */ jsx("option", {
								value: key,
								children: label ? `${label} (${key})` : key
							}, key);
						})]
					})
				]
			}) : null,
			loading ? /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Verbindungsstatus wird geladen …"] }) : connection ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--success",
				role: "status",
				children: ["Verbunden mit ", connection.origin ?? origin]
			}) : /* @__PURE__ */ jsx("p", {
				className: "tds-alert",
				role: "status",
				children: "Noch nicht mit der API verbunden."
			}),
			connectionStatus ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: connectionStatus
			}) : null,
			installUrl ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
				className: "btn btn-ghost",
				href: installUrl,
				children: "Einrichtungslink öffnen"
			}) }) : null,
			cacheStatus ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert",
				role: "status",
				children: cacheStatus
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: connect,
						disabled: connecting || origin.trim() === "" || candidateKeys.length > 1 && website === "",
						children: connecting ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : connection ? "Neu verbinden" : "Mit API verbinden"
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-accent",
						type: "button",
						onClick: rebuildCache,
						children: "Seiten-Cache neu bauen"
					}),
					connection ? /* @__PURE__ */ jsx("button", {
						className: "btn btn-ghost",
						type: "button",
						onClick: disconnect,
						children: "Verbindung trennen"
					}) : null
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/Settings.astro
var $$Settings$1 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body"><h3>Blog-CMS</h3>${renderComponent($$result, "BlogSettings", BlogSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogSettings.tsx",
		"client:component-export": "default"
	})}<h4>Blogs</h4><p class="marginalia">Hier werden Blogs hinzugefügt. Die Beiträge selbst werden unter<a class="link-underline" href="/blog">Blog-CMS</a> geschrieben — dort wird pro Artikel ausgewählt, was geändert werden soll.</p>${renderComponent($$result, "BlogRegistry", BlogRegistry, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogRegistry.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/Settings.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsSettings.tsx
var api = apiFetch;
var NS = "/admin/settings/tools";
/**
* Tools settings — one-click API connection, AdSense and the Stripe premium
* layer. Runtime credentials for the public site are managed by pairing, never
* by GitHub or editable token fields. Stripe secrets stay in the core settings
* store and come back masked; a blank secret on save keeps the existing value.
*
* The cache and Stripe blocks were declared in `ToolsModule::settings()` from
* the start and rendered by nothing, so the page-cache rebuild and the whole
* premium layer could only be configured by editing `.env` on the host. On this
* Plesk host that is the same as not being configurable — the lesson SMTP
* (2026-08-14) and IMAP (2026-08-15) already paid for twice.
*/
function ToolsSettings() {
	const [loaded, setLoaded] = useState(false);
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const [adsEnabled, setAdsEnabled] = useState(false);
	const [publisherId, setPublisherId] = useState("");
	const [slotCatalog, setSlotCatalog] = useState("");
	const [slotTool, setSlotTool] = useState("");
	const [connection, setConnection] = useState(null);
	const [origin, setOrigin] = useState("");
	const [connectionLoaded, setConnectionLoaded] = useState(false);
	const [connecting, setConnecting] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState(null);
	const [installUrl, setInstallUrl] = useState(null);
	const [currency, setCurrency] = useState("EUR");
	const [successUrl, setSuccessUrl] = useState("");
	const [cancelUrl, setCancelUrl] = useState("");
	const [stripeKey, setStripeKey] = useState("");
	const [stripeKeyState, setStripeKeyState] = useState(null);
	const [stripeHook, setStripeHook] = useState("");
	const [stripeHookState, setStripeHookState] = useState(null);
	const load = async () => {
		const res = await api(NS);
		if (!res.ok) {
			setStatus(res.status === 401 || res.status === 403 ? "Nur für Administratoren." : `Fehler (HTTP ${res.status}).`);
			setLoaded(true);
			return;
		}
		const d = await res.json();
		const map = new Map((d.settings ?? []).map((s) => [s.key, s]));
		setAdsEnabled((map.get("ads_enabled")?.value || "0") === "1");
		setPublisherId(map.get("adsense_publisher_id")?.value || "");
		setSlotCatalog(map.get("adsense_slot_catalog")?.value || "");
		setSlotTool(map.get("adsense_slot_tool")?.value || "");
		setCurrency(map.get("currency")?.value || "EUR");
		setSuccessUrl(map.get("checkout_success_url")?.value || "");
		setCancelUrl(map.get("checkout_cancel_url")?.value || "");
		setStripeKeyState(map.get("stripe_secret_key") ?? null);
		setStripeHookState(map.get("stripe_webhook_secret") ?? null);
		setLoaded(true);
	};
	const loadConnection = async () => {
		try {
			const res = await api("/admin/tools/connection");
			if (res.status === 404) setConnection(null);
			else if (res.ok) {
				const body = await res.json();
				const next = body.connection ?? body;
				setConnection(next);
				setOrigin(next.origin ?? "");
			} else setConnectionStatus(`Verbindungsstatus konnte nicht geladen werden (HTTP ${res.status}).`);
		} catch {
			setConnectionStatus("Verbindungsstatus konnte nicht geladen werden (Netzwerkfehler).");
		} finally {
			setConnectionLoaded(true);
		}
	};
	useEffect(() => {
		load();
		loadConnection();
	}, []);
	const save = async () => {
		setBusy(true);
		setStatus(null);
		const settings = [
			{
				key: "ads_enabled",
				secret: false,
				value: adsEnabled ? "1" : "0"
			},
			{
				key: "adsense_publisher_id",
				secret: false,
				value: publisherId.trim()
			},
			{
				key: "adsense_slot_catalog",
				secret: false,
				value: slotCatalog.trim()
			},
			{
				key: "adsense_slot_tool",
				secret: false,
				value: slotTool.trim()
			},
			{
				key: "currency",
				secret: false,
				value: currency.trim().toUpperCase() || "EUR"
			},
			{
				key: "checkout_success_url",
				secret: false,
				value: successUrl.trim()
			},
			{
				key: "checkout_cancel_url",
				secret: false,
				value: cancelUrl.trim()
			},
			{
				key: "stripe_secret_key",
				secret: true,
				value: stripeKey.trim()
			},
			{
				key: "stripe_webhook_secret",
				secret: true,
				value: stripeHook.trim()
			}
		];
		const res = await api(NS, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ settings })
		});
		if (res.ok) {
			setStripeKey("");
			setStripeHook("");
			const cacheRes = await api("/admin/tools/cache/rebuild", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ event: "settings" })
			});
			const cacheBody = await cacheRes.json().catch(() => ({}));
			if (cacheRes.status === 202 && cacheBody.cached === true) toast.success("Gespeichert — Seiten-Cache aktualisiert.");
			else if (cacheRes.status === 503) toast.warning("Gespeichert — die Tools-Site ist noch nicht für Cache-Aktualisierungen verbunden.");
			else toast.warning(`Gespeichert — Cache-Aktualisierung fehlgeschlagen (HTTP ${cacheRes.status}).`);
			load();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
		setBusy(false);
	};
	const connect = async () => {
		setConnecting(true);
		setConnectionStatus(null);
		setInstallUrl(null);
		try {
			const res = await api("/admin/tools/connection/pairing", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					origin: origin.trim(),
					profile: "tools"
				})
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) {
				setConnectionStatus(res.status === 422 ? body.error ?? "Bitte eine reine HTTPS-Adresse ohne Pfad eingeben." : `Verbinden fehlgeschlagen (HTTP ${res.status}).`);
				return;
			}
			setInstallUrl(body.fallback_url ?? body.install_url ?? null);
			if (body.delivered === true || body.connected === true) {
				toast.success("Tools-Site mit der API verbunden.");
				await loadConnection();
			} else setConnectionStatus("Die Tools-Site war nicht direkt erreichbar. Öffnen Sie den Einrichtungslink auf dem Site-Server.");
		} catch {
			setConnectionStatus("Verbinden fehlgeschlagen (Netzwerkfehler).");
		} finally {
			setConnecting(false);
		}
	};
	const disconnect = async () => {
		const res = await api("/admin/tools/connection", { method: "DELETE" });
		if (res.ok) {
			setConnection(null);
			setInstallUrl(null);
			toast.success("Verbindung getrennt.");
		} else toast.danger(`Trennen fehlgeschlagen (HTTP ${res.status}).`);
	};
	const hint = (s) => s?.configured ? `konfiguriert (…${s.last4 ?? "????"})` : "nicht konfiguriert";
	if (!loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "tools-settings space-y-5",
		children: [
			/* @__PURE__ */ jsxs("fieldset", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsx("legend", {
						className: "text-sm font-semibold",
						children: "Google AdSense"
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: adsEnabled,
							onChange: (e) => setAdsEnabled(e.target.checked)
						}), "AdSense aktivieren"]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Publisher-ID"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: publisherId,
							onChange: (e) => setPublisherId(e.target.value),
							placeholder: "ca-pub-…"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Slot (Übersicht)"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "text",
								value: slotCatalog,
								onChange: (e) => setSlotCatalog(e.target.value),
								placeholder: "123…"
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Slot (Tool-Seite)"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "text",
								value: slotTool,
								onChange: (e) => setSlotTool(e.target.value),
								placeholder: "123…"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsx("legend", {
						className: "text-sm font-semibold",
						children: "API-Verbindung"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm opacity-70",
						children: "Die Tools-Site übernimmt API-Schlüssel und Cache-Zugang automatisch. Ein separates Registry-Token oder GitHub-Rebuild ist nicht erforderlich."
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Basis-URL der Tools-Site"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "url",
							value: origin,
							onChange: (e) => setOrigin(e.target.value),
							placeholder: "https://tools.tracht-digital.de"
						})]
					}),
					!connectionLoaded ? /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Verbindungsstatus wird geladen …"] }) : connection ? /* @__PURE__ */ jsxs("p", {
						className: "tds-alert tds-alert--success",
						role: "status",
						children: ["Verbunden mit ", connection.origin ?? origin]
					}) : /* @__PURE__ */ jsx("p", {
						className: "tds-alert",
						role: "status",
						children: "Noch nicht mit der API verbunden."
					}),
					connectionStatus ? /* @__PURE__ */ jsx("p", {
						className: "tds-alert tds-alert--danger",
						role: "alert",
						children: connectionStatus
					}) : null,
					installUrl ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
						className: "btn btn-ghost",
						href: installUrl,
						children: "Einrichtungslink öffnen"
					}) }) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: connect,
							disabled: connecting || origin.trim() === "",
							children: connecting ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : connection ? "Neu verbinden" : "Mit API verbinden"
						}), connection ? /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: disconnect,
							children: "Verbindung trennen"
						}) : null]
					})
				]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsx("legend", {
						className: "text-sm font-semibold",
						children: "Premium (Stripe)"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm opacity-70",
						children: "Ohne Secret Key antwortet der Checkout mit 503 und kein Premium-Tool lässt sich kaufen. Der Webhook (…/tools/stripe-webhook) schaltet den Kauf frei — ohne sein Secret bleibt jede Zahlung ohne Freischaltung."
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-sm",
							children: ["Secret Key ", /* @__PURE__ */ jsxs("em", {
								className: "opacity-60",
								children: [
									"(",
									hint(stripeKeyState),
									")"
								]
							})]
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "password",
							value: stripeKey,
							onChange: (e) => setStripeKey(e.target.value),
							placeholder: "sk_… (leer = behalten)",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-sm",
							children: ["Webhook Secret ", /* @__PURE__ */ jsxs("em", {
								className: "opacity-60",
								children: [
									"(",
									hint(stripeHookState),
									")"
								]
							})]
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "password",
							value: stripeHook,
							onChange: (e) => setStripeHook(e.target.value),
							placeholder: "whsec_… (leer = behalten)",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Währung"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "text",
								value: currency,
								onChange: (e) => setCurrency(e.target.value),
								placeholder: "EUR"
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Success-URL"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "url",
								value: successUrl,
								onChange: (e) => setSuccessUrl(e.target.value),
								placeholder: "https://tools.tracht-digital.de/"
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Cancel-URL"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "url",
							value: cancelUrl,
							onChange: (e) => setCancelUrl(e.target.value),
							placeholder: "https://tools.tracht-digital.de/"
						})]
					})
				]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-primary",
				onClick: save,
				disabled: busy,
				"aria-busy": busy,
				children: "Speichern"
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-tools/islands/Settings.astro
var $$Settings = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body"><h3>Tools / AdSense</h3>${renderComponent($$result, "ToolsSettings", ToolsSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/Settings.astro", void 0);
//#endregion
//#region \0virtual:frontend-settings
var settings = [
	{
		"id": "billing",
		"label": "Stripe / Rechnungen",
		"island": "@tracht-digital-solutions/tds-ext-billing/islands/Settings.astro",
		"order": 10,
		Component: $$Settings$8
	},
	{
		"id": "time",
		"label": "Zeiterfassung",
		"island": "@tracht-digital-solutions/tds-ext-time-tracker/islands/Settings.astro",
		"order": 20,
		Component: $$Settings$7
	},
	{
		"id": "lexware",
		"label": "Lexware",
		"island": "@tracht-digital-solutions/tds-ext-lexware/islands/Settings.astro",
		"order": 20,
		Component: $$Settings$6
	},
	{
		"id": "support-tickets",
		"label": "Support-Tickets",
		"island": "@tracht-digital-solutions/tds-ext-support-tickets/islands/Settings.astro",
		"order": 30,
		Component: $$Settings$5
	},
	{
		"id": "contact-tickets",
		"label": "Kontaktanfragen",
		"island": "@tracht-digital-solutions/tds-ext-contact-tickets/islands/Settings.astro",
		"order": 35,
		Component: $$Settings$4
	},
	{
		"id": "live-chat-cta",
		"label": "Live-Chat",
		"island": "@tracht-digital-solutions/tds-ext-live-chat-cta/islands/Settings.astro",
		"order": 40,
		Component: $$Settings$3
	},
	{
		"id": "website-cms",
		"label": "Website-CMS",
		"island": "@tracht-digital-solutions/tds-ext-website-cms/islands/Settings.astro",
		"order": 40,
		Component: $$Settings$2
	},
	{
		"id": "blog-cms",
		"label": "Blog-CMS",
		"island": "@tracht-digital-solutions/tds-ext-blog-cms/islands/Settings.astro",
		"order": 50,
		Component: $$Settings$1
	},
	{
		"id": "tools",
		"label": "Tools / AdSense",
		"island": "@tracht-digital-solutions/tds-ext-tools/islands/Settings.astro",
		"order": 50,
		Component: $$Settings
	}
];
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen.astro
var einstellungen_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Einstellungen,
	file: () => $$file,
	url: () => $$url
});
var $$Einstellungen = createComponent(($$result, $$props, $$slots) => {
	const showAdminSettings = FRONTEND_TARGET === "admin";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Einstellungen" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Konfiguration</p><h1 class="tds-page__title">Einstellungen</h1></div></div>${settings.length === 0 && !showAdminSettings ? renderTemplate`<p class="tds-empty">Keine Einstellungen verfügbar.</p>` : null}<div class="settings-list flex flex-col gap-6">${showAdminSettings ? renderTemplate`<section class="tds-settings-section" data-settings="mail"><h2 class="tds-settings-section__title">E-Mail (SMTP)</h2>${renderComponent($$result, "MailSettings", MailSettings, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/MailSettings.tsx",
		"client:component-export": "default"
	})}</section>` : null}${showAdminSettings ? renderTemplate`<section class="tds-settings-section" data-settings="cors"><h2 class="tds-settings-section__title">CORS / Freigegebene Origins</h2>${renderComponent($$result, "CorsSettings", CorsSettings, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/CorsSettings.tsx",
		"client:component-export": "default"
	})}</section>` : null}${settings.map((panel) => {
		const Panel = panel.Component;
		return renderTemplate`<section class="tds-settings-section"${addAttribute(panel.id, "data-settings")}><h2 class="tds-settings-section__title">${panel.label}</h2>${renderComponent($$result, "Panel", Panel, {})}</section>`;
	})}</div></section>` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen.astro";
var $$url = "/einstellungen";
//#endregion
//#region \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen@_@astro
var page = () => einstellungen_exports;
//#endregion
export { page };
