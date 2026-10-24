import { a as renderComponent, et as __exportAll, f as renderTemplate, h as addAttribute, o as Fragment$2, p as maybeRenderHead } from "./server_Cdzh4AE6.mjs";
import { n as createComponent } from "./compiler_CX02AaCz.mjs";
import { B as toast, C as Spinner, H as centsToEuroInput, N as sendJson, X as renderScript, Y as parseEuros, a as sectionReveal, c as API_BASE, f as frontendFetch, g as FRONTEND_TARGET, i as BASE_SETTINGS, j as describeFailure, k as apiFetch, o as settingsSections, t as $$Layout, v as ConfirmDialog, y as FormAlert } from "./Layout_D80p1pEh.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { n as staleClass, r as useCachedJson, t as invalidate } from "./data_BsU3Oeaq.mjs";
import { t as copyText } from "./chunk-2NLUY6RS_DPKKyizg.mjs";
import { a as SITES } from "./lib_BfA1tVXt.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/CorsSettings.tsx
var ENDPOINT$1 = `${API_BASE}/admin/cors`;
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
			const res = await frontendFetch(ENDPOINT$1);
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
			const res = await frontendFetch(ENDPOINT$1, {
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
// node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/MailSettings.tsx
var NS$2 = `${API_BASE}/admin/settings/mail`;
var STATUS$2 = `${API_BASE}/admin/mail`;
var TEST$2 = `${API_BASE}/admin/mail/test`;
/** Coded defaults, mirrored from the API's `MailConfig`. */
var DEFAULTS$2 = {
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
	const [port, setPort] = useState(DEFAULTS$2.port);
	const [security, setSecurity] = useState(DEFAULTS$2.security);
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
			const [settingsRes, statusRes] = await Promise.all([frontendFetch(NS$2), frontendFetch(STATUS$2)]);
			if (!settingsRes.ok) {
				setError(settingsRes.status === 401 || settingsRes.status === 403 ? "Nur für Administratoren." : `Einstellungen konnten nicht geladen werden (HTTP ${settingsRes.status}).`);
				setLoaded(true);
				return;
			}
			const data = await settingsRes.json();
			const map = new Map((data.settings ?? []).map((s) => [s.key, s]));
			setHost(map.get("host")?.value ?? "");
			setPort(map.get("port")?.value || DEFAULTS$2.port);
			setSecurity(map.get("security")?.value || DEFAULTS$2.security);
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
			const res = await frontendFetch(NS$2, {
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
			const res = await frontendFetch(TEST$2, {
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
							placeholder: DEFAULTS$2.port
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
						placeholder: DEFAULTS$2.from_email
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
						placeholder: DEFAULTS$2.from_name
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
// node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/StripeSettings.tsx
var NS$1 = `${API_BASE}/admin/settings/stripe`;
var STATUS$1 = `${API_BASE}/admin/stripe`;
var TEST$1 = `${API_BASE}/admin/stripe/test`;
/**
* *Zahlungen (Stripe)* — the platform's one Stripe account.
*
* Rechnungen, Premium-Tools and the Shop each kept their own key field, so the
* same account had to be entered three times and nothing showed which module
* actually charged through which key. The key is entered once here; a module
* key, where one is set, still overrides it for that module only.
*
* The list below is the part an admin needs when setting up Stripe: every
* webhook endpoint the composed modules expect, with the events to subscribe
* and whether that endpoint's signing secret is stored. Without a secret a
* module refuses every webhook — no payment is ever confirmed — and nothing
* else in the panel would say so.
*
* "Verbindung testen" makes a read-only call (the balance), because saving a
* key is not proof that it works, and the first real proof would otherwise be
* a customer's failed payment.
*/
function StripeSettings() {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [status, setStatus] = useState(null);
	const [key, setKey] = useState("");
	const [busy, setBusy] = useState(false);
	const [testing, setTesting] = useState(false);
	const [testError, setTestError] = useState(null);
	const load = async () => {
		try {
			const res = await frontendFetch(STATUS$1);
			if (!res.ok) {
				setError(res.status === 401 || res.status === 403 ? "Nur für Administratoren." : `Stripe-Status konnte nicht geladen werden (HTTP ${res.status}).`);
				return;
			}
			setStatus(await res.json());
			setError(null);
		} catch {
			setError("Stripe-Status konnte nicht geladen werden — die API ist nicht erreichbar.");
		} finally {
			setLoaded(true);
		}
	};
	useEffect(() => {
		load();
	}, []);
	const save = async () => {
		if (key.trim() === "") {
			toast.info("Kein neuer Schlüssel eingegeben — der bestehende bleibt.");
			return;
		}
		setBusy(true);
		try {
			const res = await frontendFetch(NS$1, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ settings: [{
					key: "secret_key",
					secret: true,
					value: key.trim()
				}] })
			});
			if (res.ok) {
				setKey("");
				toast.success("Gespeichert.");
				load();
			} else {
				const data = await res.json().catch(() => null);
				toast.danger(data?.error ?? `Speichern fehlgeschlagen (HTTP ${res.status}).`);
			}
		} catch {
			toast.danger("Speichern fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setBusy(false);
		}
	};
	const test = async () => {
		setTesting(true);
		setTestError(null);
		try {
			const res = await frontendFetch(TEST$1, { method: "POST" });
			const data = await res.json().catch(() => null);
			if (res.ok && data?.ok) toast.success(`Verbindung steht (${data.mode === "live" ? "Live-Modus" : "Testmodus"}).`);
			else setTestError(data?.error ? `Test fehlgeschlagen (HTTP ${res.status}): ${data.error}` : `Test fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			setTestError("Test fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setTesting(false);
		}
	};
	const copy = async (text) => {
		if (await copyText(text)) toast.success("Adresse kopiert.");
		else toast.info(text);
	};
	if (!loaded) return /* @__PURE__ */ jsx(Spinner, {});
	const state = !status ? {
		text: "Status unbekannt",
		variant: "warning"
	} : !status.configured ? {
		text: "Kein Stripe-Konto verbunden",
		variant: "danger"
	} : status.source === "env" ? {
		text: "Aktiv über STRIPE_SECRET_KEY aus der .env des Hosts",
		variant: "warning"
	} : {
		text: "Aktiv über diese Einstellungen",
		variant: "success"
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-settings-section__body tds-stack",
		children: [
			/* @__PURE__ */ jsx(FormAlert, { message: error }),
			/* @__PURE__ */ jsxs("p", {
				className: "tds-row",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: `status-pill status-pill--${state.variant}`,
						children: state.text
					}),
					status?.mode ? /* @__PURE__ */ jsx("span", {
						className: `status-pill status-pill--${status.mode === "live" ? "success" : "warning"}`,
						children: status.mode === "live" ? "Live-Modus" : "Testmodus"
					}) : null,
					status?.last4 ? /* @__PURE__ */ jsxs("span", {
						className: "marginalia",
						children: ["Schlüssel …", status.last4]
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "Secret Key"
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					value: key,
					onChange: (e) => setKey(e.target.value),
					placeholder: "sk_live_… oder rk_live_… (leer = bestehenden behalten)",
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Gilt für Rechnungen, Premium-Tools und den Shop. Ein Modul mit eigenem Schlüssel in seinen Einstellungen nutzt weiterhin diesen. Ein eingeschränkter Schlüssel (",
					/* @__PURE__ */ jsx("code", { children: "rk_" }),
					") mit Schreibrechten für Kunden, Rechnungen und Checkout genügt."
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => void save(),
					disabled: busy,
					children: busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => void test(),
					disabled: testing || !status?.configured,
					children: testing ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Verbindung testen"
				})]
			}),
			/* @__PURE__ */ jsx(FormAlert, { message: testError }),
			/* @__PURE__ */ jsx("hr", {}),
			/* @__PURE__ */ jsx("h3", {
				className: "text-sm",
				children: "Webhooks"
			}),
			status && status.webhooks.length > 0 ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"In Stripe unter ",
					/* @__PURE__ */ jsx("em", { children: "Entwickler → Webhooks" }),
					" je Adresse einen Endpunkt mit den genannten Ereignissen anlegen und dessen Signing Secret (",
					/* @__PURE__ */ jsx("code", { children: "whsec_…" }),
					") in den Einstellungen des Moduls eintragen."
				]
			}), /* @__PURE__ */ jsx("ul", {
				className: "tds-stack",
				"data-testid": "stripe-webhooks",
				children: status.webhooks.map((hook) => /* @__PURE__ */ jsxs("li", {
					className: "tds-card p-3",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "tds-row",
							children: [/* @__PURE__ */ jsx("strong", { children: hook.label }), /* @__PURE__ */ jsx("span", {
								className: `status-pill status-pill--${hook.secretConfigured ? "success" : "danger"}`,
								children: hook.secretConfigured ? "Signing Secret hinterlegt" : "Signing Secret fehlt"
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "tds-row",
							children: [/* @__PURE__ */ jsx("code", {
								className: "break-all",
								children: hook.url
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => void copy(hook.url),
								children: "Kopieren"
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "marginalia",
							children: ["Ereignisse: ", hook.events.join(", ")]
						})
					]
				}, hook.url))
			})] }) : /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Kein Modul mit Stripe-Zahlungen aktiv."
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/SitemapSettings.tsx
var ENDPOINT = `${API_BASE}/admin/sites`;
/**
* The sites that actually READ the list (`src/lib/sitemapExclusions.ts` in the
* landingpage and the blog). The registry also knows tools, the shop, the card
* app and the login — offering a field there would promise an effect nobody
* delivers. Add a site here when it starts reading `/content/sitemap-exclusions`.
*/
var READS_EXCLUSIONS = /* @__PURE__ */ new Set(["landingpage", "blog"]);
var CACHE_LABEL = {
	refreshed: "Sitemap neu erzeugt",
	not_configured: "nicht gekoppelt — wirkt beim nächsten Rendern",
	failed: "Site nicht erreichbar — wirkt beim nächsten Rendern",
	skipped: "übersprungen"
};
var lines = (text) => text.split("\n").map((l) => l.trim()).filter((l) => l !== "");
/**
* *Suchmaschinen (Sitemap)* — the paths each public site leaves out of its
* sitemap and serves `noindex`.
*
* The sites have read this list since 2026-09 (`/content/sitemap-exclusions`)
* and the API has stored it on `PUT /admin/sites`, but no screen ever wrote it:
* an operator who wanted `/tag/*` out of the index had to send JSON by hand.
*
* One textarea per site, one pattern per line. The PUT REPLACES the whole map —
* a partial merge could never remove a site's last path — so every site's list
* is sent on every save, exactly as the form shows it. Rejects come back as
* text and stay in flow (see CorsSettings for why that is not a toast).
*/
function SitemapSettings() {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [sites, setSites] = useState([]);
	const [drafts, setDrafts] = useState({});
	const [limits, setLimits] = useState(null);
	const [rejected, setRejected] = useState([]);
	const [cache, setCache] = useState({});
	const [busy, setBusy] = useState(false);
	const [stored, setStored] = useState({});
	const apply = (data, list) => {
		const next = {};
		for (const site of list) next[site.id] = (data.sitemap_exclusions?.[site.id] ?? []).join("\n");
		setDrafts(next);
	};
	useEffect(() => {
		(async () => {
			try {
				const res = await frontendFetch(ENDPOINT);
				if (!res.ok) {
					setError(res.status === 401 || res.status === 403 ? "Nur für Administratoren." : `Sites konnten nicht geladen werden (HTTP ${res.status}).`);
					return;
				}
				const data = await res.json();
				const list = (data.sites ?? []).filter((s) => READS_EXCLUSIONS.has(s.id)).map((s) => ({
					id: s.id,
					label: s.label
				}));
				setSites(list);
				setLimits(data.sitemap_exclusion_limits ?? null);
				setStored(data.sitemap_exclusions ?? {});
				apply(data, list);
			} catch {
				setError("Sites konnten nicht geladen werden — die API ist nicht erreichbar.");
			} finally {
				setLoaded(true);
			}
		})();
	}, []);
	const save = async () => {
		setBusy(true);
		setRejected([]);
		setCache({});
		try {
			const body = { ...stored };
			for (const site of sites) body[site.id] = lines(drafts[site.id] ?? "");
			const res = await frontendFetch(ENDPOINT, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sitemap_exclusions: body })
			});
			const data = await res.json().catch(() => null);
			if (!res.ok || !data?.ok) {
				toast.danger(data?.error ? `Speichern fehlgeschlagen (HTTP ${res.status}): ${data.error}` : `Speichern fehlgeschlagen (HTTP ${res.status}).`);
				return;
			}
			if (data.sitemap_exclusions) {
				setStored(data.sitemap_exclusions);
				apply({ sitemap_exclusions: data.sitemap_exclusions }, sites);
			}
			setRejected(data.rejected ?? []);
			setCache(data.cache_status ?? {});
			if ((data.rejected ?? []).length > 0) toast.warning("Gespeichert — einzelne Pfade wurden abgelehnt.");
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
		children: [/* @__PURE__ */ jsx(FormAlert, { message: error }), error ? null : /* @__PURE__ */ jsxs(Fragment$1, { children: [
			/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Pfade, die eine Site aus ihrer Sitemap nimmt und mit ",
					/* @__PURE__ */ jsx("code", { children: "noindex" }),
					" ausliefert — die Seite bleibt erreichbar, sie wird nur nicht mehr zum Indexieren angeboten. Ein Pfad pro Zeile, beginnend mit ",
					/* @__PURE__ */ jsx("code", { children: "/" }),
					"; ein ",
					/* @__PURE__ */ jsx("code", { children: "*" }),
					" am Ende schließt alles darunter aus (",
					/* @__PURE__ */ jsx("code", { children: "/tag/*" }),
					"). Ein Artikel fällt immer mit seiner Sprachfassung zusammen heraus.",
					limits ? ` Höchstens ${limits.max_per_site} Pfade je Site.` : null
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: sites.map((site) => /* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-sm font-semibold",
							children: site.label
						}),
						/* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							rows: 4,
							value: drafts[site.id] ?? "",
							onChange: (e) => setDrafts((d) => ({
								...d,
								[site.id]: e.target.value
							})),
							placeholder: "/tag/*\n/aktuelles",
							spellCheck: false,
							autoComplete: "off",
							"aria-describedby": cache[site.id] ? `sitemap-cache-${site.id}` : void 0
						}),
						cache[site.id] ? /* @__PURE__ */ jsx("span", {
							id: `sitemap-cache-${site.id}`,
							className: "marginalia",
							children: CACHE_LABEL[cache[site.id]] ?? cache[site.id]
						}) : null
					]
				}, site.id))
			}),
			rejected.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "tds-alert tds-alert--warning",
				children: [/* @__PURE__ */ jsx("p", { children: "Diese Pfade wurden nicht übernommen:" }), /* @__PURE__ */ jsx("ul", { children: rejected.map((entry, i) => /* @__PURE__ */ jsxs("li", { children: [
					/* @__PURE__ */ jsx("code", { children: entry.value || "(leer)" }),
					" — ",
					entry.reason
				] }, `${entry.value}-${i}`)) })]
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
			})
		] })]
	});
}
// node_modules/@tracht-digital-solutions/tds-shared/dist/admin/index.js
function secretHint(setting) {
	return setting?.configured ? `konfiguriert (\u2026${setting.last4 ?? "????"})` : "nicht konfiguriert";
}
function useRuntimeSettings(namespace) {
	const path = `/admin/settings/${namespace}`;
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [settings, setSettings] = useState(/* @__PURE__ */ new Map());
	const [busy, setBusy] = useState(false);
	const alive = useRef(true);
	const reload = useCallback(async () => {
		const res = await apiFetch(path).catch(() => null);
		if (!alive.current) return;
		if (res === null || !res.ok) {
			setError(describeFailure(res, "Einstellungen konnten nicht geladen werden", { adminOnly: true }));
			setLoaded(true);
			return;
		}
		const body = await res.json().catch(() => ({}));
		if (!alive.current) return;
		setSettings(new Map((body.settings ?? []).map((s) => [s.key, s])));
		setError(null);
		setLoaded(true);
	}, [path]);
	useEffect(() => {
		alive.current = true;
		reload();
		return () => {
			alive.current = false;
		};
	}, [reload]);
	return {
		loaded,
		error,
		settings,
		get: (key) => settings.get(key),
		value: (key, fallback = "") => settings.get(key)?.value || fallback,
		busy,
		save: useCallback(async (inputs, successText = "Gespeichert.") => {
			setBusy(true);
			const res = await sendJson(path, "PUT", { settings: inputs.map((s) => ({
				key: s.key,
				secret: s.secret ?? false,
				value: s.value
			})) }).catch(() => null);
			if (alive.current) setBusy(false);
			if (res === null || !res.ok) {
				toast.danger(describeFailure(res, "Speichern fehlgeschlagen", { adminOnly: true }));
				return false;
			}
			if (successText !== null) toast.success(successText);
			await reload();
			return true;
		}, [path, reload]),
		reload
	};
}
function SecretField({ label, setting, value, onChange, placeholder = "Neuen Wert setzen (leer = behalten)", disabled }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "text-sm",
			children: [
				label,
				" ",
				/* @__PURE__ */ jsxs("em", {
					className: "opacity-60",
					children: [
						"(",
						secretHint(setting),
						")"
					]
				})
			]
		}), /* @__PURE__ */ jsx("input", {
			className: "field-boxed",
			type: "password",
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			autoComplete: "off",
			disabled
		})]
	});
}
var reasonOf = (body) => typeof body.error === "string" && body.error.trim() !== "" ? body.error.trim() : null;
function usePairing({ base, profile, subject, rebuildBody = {}, rebuildSuccess = "Cache-Neubau wurde angefragt.", ambiguousHint = "Bitte eine reine HTTPS-Adresse und bei mehreren Websites den passenden Website-Schlüssel angeben." }) {
	const [connection, setConnection] = useState(null);
	const [loading, setLoading] = useState(true);
	const [connecting, setConnecting] = useState(false);
	const [status, setStatus] = useState(null);
	const [installUrl, setInstallUrl] = useState(null);
	const [candidates, setCandidates] = useState(null);
	const reload = useCallback(async () => {
		try {
			const res = await apiFetch(`${base}/connection`);
			if (res.status === 404) setConnection(null);
			else if (res.ok) {
				const body = await res.json();
				setConnection(body.connection ?? body);
			} else setStatus(`Verbindungsstatus konnte nicht geladen werden (HTTP ${res.status}).`);
		} catch {
			setStatus("Verbindungsstatus konnte nicht geladen werden (Netzwerkfehler).");
		} finally {
			setLoading(false);
		}
	}, [base]);
	useEffect(() => {
		reload();
	}, [reload]);
	return {
		connection,
		loading,
		connecting,
		status,
		installUrl,
		candidates,
		connect: useCallback(async (origin, bindings) => {
			setConnecting(true);
			setStatus(null);
			setInstallUrl(null);
			try {
				const res = await sendJson(`${base}/connection/pairing`, "POST", {
					origin: origin.trim(),
					profile,
					...bindings === void 0 ? {} : { bindings }
				});
				const body = await res.json().catch(() => ({}));
				if (!res.ok) {
					if (Array.isArray(body.candidates)) setCandidates(body.candidates.map(String));
					const reason2 = reasonOf(body);
					setStatus(res.status === 422 ? reason2 ?? ambiguousHint : `Verbinden fehlgeschlagen (HTTP ${res.status})${reason2 ? `: ${reason2}` : "."}`);
					return false;
				}
				const link = body.fallback_url ?? body.install_url ?? null;
				setInstallUrl(link);
				if (body.delivered === true || body.connected === true) {
					toast.success(`${subject} ist mit der API verbunden.`);
					await reload();
					return true;
				}
				const reason = reasonOf(body);
				setStatus(`${subject} hat die Verbindung nicht direkt angenommen${reason ? ` (${reason})` : ""}. \xD6ffnen Sie den Einrichtungslink auf dem Server.`);
				return false;
			} catch {
				setStatus("Verbinden fehlgeschlagen (Netzwerkfehler).");
				return false;
			} finally {
				setConnecting(false);
			}
		}, [
			base,
			profile,
			subject,
			ambiguousHint,
			reload
		]),
		disconnect: useCallback(async () => {
			const res = await apiFetch(`${base}/connection`, { method: "DELETE" }).catch(() => null);
			if (res === null || !res.ok) {
				toast.danger(describeFailure(res, "Trennen fehlgeschlagen"));
				return false;
			}
			setConnection(null);
			setInstallUrl(null);
			toast.success("Verbindung getrennt.");
			return true;
		}, [base]),
		rebuildCache: useCallback(async () => {
			setStatus(null);
			const res = await sendJson(`${base}/cache/rebuild`, "POST", rebuildBody).catch(() => null);
			if (res !== null && res.ok) {
				toast.success(rebuildSuccess);
				return true;
			}
			if (res?.status === 422) setStatus("Die gespeicherte Website-Adresse ist ungültig.");
			else if (res?.status === 503) setStatus(`${subject} ist noch nicht vollst\xE4ndig mit der API verbunden.`);
			else if (res?.status === 502) setStatus(`${subject} ist erreichbar, aber der Cache-Neubau ist fehlgeschlagen. Bitte erneut versuchen.`);
			else toast.danger(describeFailure(res, "Cache-Neubau fehlgeschlagen"));
			return false;
		}, [
			base,
			subject,
			rebuildSuccess
		]),
		reload
	};
}
// node_modules/@tracht-digital-solutions/tds-ext-billing/islands/BillingSettings.tsx
/**
* Stripe settings — secret key + webhook secret + default currency + payment
* term, in the core runtime settings store (`/admin/settings/billing`,
* admin-only), loaded and saved by tds-shared `useRuntimeSettings`. Secrets
* come back masked (configured + last4); a blank secret on save keeps the
* existing value.
*/
function BillingSettings() {
	const settings = useRuntimeSettings("billing");
	const [keyInput, setKeyInput] = useState("");
	const [whInput, setWhInput] = useState("");
	const [currency, setCurrency] = useState("EUR");
	const [days, setDays] = useState("14");
	useEffect(() => {
		setCurrency(settings.value("default_currency", "EUR"));
		setDays(settings.value("days_until_due", "14"));
	}, [settings.settings]);
	const save = async () => {
		if (await settings.save([
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
				value: currency.trim().toUpperCase()
			},
			{
				key: "days_until_due",
				value: days.trim()
			}
		])) {
			setKeyInput("");
			setWhInput("");
		}
	};
	if (!settings.loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "billing-settings space-y-4",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-sm opacity-70",
				children: "Nur nötig, wenn dieses Modul ein eigenes Stripe-Konto nutzen soll. Ohne eigenen Schlüssel gilt das zentrale Konto unter Einstellungen → Zahlungen (Stripe); dort stehen auch alle Webhook-Adressen."
			}),
			/* @__PURE__ */ jsx(SecretField, {
				label: "Stripe Secret Key, optional",
				setting: settings.get("stripe_secret_key"),
				value: keyInput,
				onChange: setKeyInput,
				placeholder: "sk_… (leer = behalten)"
			}),
			/* @__PURE__ */ jsx(SecretField, {
				label: "Webhook Secret",
				setting: settings.get("stripe_webhook_secret"),
				value: whInput,
				onChange: setWhInput,
				placeholder: "whsec_… (leer = behalten)"
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
			/* @__PURE__ */ jsx(Alert, { children: settings.error }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-primary",
				onClick: () => void save(),
				disabled: settings.busy,
				"aria-busy": settings.busy,
				children: "Speichern"
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-billing/islands/Settings.astro
var $$Settings$10 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "BillingSettings", BillingSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/islands/BillingSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/LexwareSettings.tsx
var DEFAULT_URL = "https://api.lexware.io/v1";
/**
* Lexware settings — API key + URL + default net hourly rate + tax rate,
* persisted in the core runtime settings store (`/admin/settings/lexware`,
* admin-only) through tds-shared `useRuntimeSettings`. The secret key comes
* back masked (configured + last4); a blank key on save keeps the existing
* value. The backend reads these DB-first with an env fallback. A connection
* test hits GET /lexware/admin/test.
*/
function LexwareSettings() {
	const settings = useRuntimeSettings("lexware");
	const [keyInput, setKeyInput] = useState("");
	const [url, setUrl] = useState(DEFAULT_URL);
	const [rate, setRate] = useState("");
	const [tax, setTax] = useState("19");
	const [testResult, setTestResult] = useState(null);
	useEffect(() => {
		setUrl(settings.value("api_url", DEFAULT_URL));
		setRate(settings.get("default_hourly_rate")?.value ?? "");
		setTax(settings.value("default_tax_rate", "19"));
	}, [settings.settings]);
	const save = async () => {
		if (await settings.save([
			{
				key: "api_key",
				secret: true,
				value: keyInput.trim()
			},
			{
				key: "api_url",
				value: url.trim()
			},
			{
				key: "default_hourly_rate",
				value: rate.trim()
			},
			{
				key: "default_tax_rate",
				value: tax.trim()
			}
		])) setKeyInput("");
	};
	const test = async () => {
		setTestResult("Teste …");
		const res = await apiFetch("/lexware/admin/test").catch(() => null);
		if (res === null) {
			setTestResult("Fehlgeschlagen: die API ist nicht erreichbar.");
			return;
		}
		const d = await res.json().catch(() => ({}));
		if (res.ok && d.ok) setTestResult("Verbindung erfolgreich.");
		else setTestResult(`Fehlgeschlagen: ${d.error ?? `HTTP ${res.status}`}`);
	};
	if (!settings.loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "lexware-settings space-y-4",
		children: [
			/* @__PURE__ */ jsx(SecretField, {
				label: "API-Key",
				setting: settings.get("api_key"),
				value: keyInput,
				onChange: setKeyInput,
				placeholder: "Neuen Schlüssel setzen (leer = behalten)"
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
			/* @__PURE__ */ jsx(Alert, { children: settings.error }),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsx("button", {
					className: "btn btn-primary",
					type: "button",
					onClick: () => void save(),
					disabled: settings.busy,
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
// node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/Settings.astro
var $$Settings$9 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "LexwareSettings", LexwareSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/LexwareSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/NotificationSettings.tsx
var LABELS = {
	notify_admin_on_new: "Admin bei neuem Ticket benachrichtigen",
	notify_customer_on_status: "Kunde bei Statusänderung benachrichtigen",
	notify_customer_on_reply: "Kunde bei Antwort benachrichtigen"
};
/**
* Admin notification toggles (checkpoint-4). Reads/writes
* /admin/ticket-settings. Emails also require the core Mailer (MAIL_DSN) + a
* recipient, so a toggle on with no SMTP simply no-ops.
*/
function NotificationSettings() {
	const [toggles, setToggles] = useState(null);
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		apiFetch("/admin/ticket-settings").then((r) => r.ok ? r.json() : { settings: {} }).then((d) => setToggles(d.settings ?? {})).catch(() => setToggles({}));
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
			const res = await sendJson("/admin/ticket-settings", "PUT", next);
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
// node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/ImapSettings.tsx
var NS = "/admin/settings/support-tickets";
var STATUS = "/admin/tickets/imap";
var TEST = "/admin/tickets/imap-test";
var POLL = "/admin/tickets/ingest";
/** Coded defaults, mirrored from the API's `ImapConfig`. */
var DEFAULTS$1 = {
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
	const [port, setPort] = useState(DEFAULTS$1.port);
	const [security, setSecurity] = useState(DEFAULTS$1.security);
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [passwordState, setPasswordState] = useState(null);
	const [folder, setFolder] = useState(DEFAULTS$1.folder);
	const [mode, setMode] = useState(DEFAULTS$1.mode);
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
			const [settingsRes, statusRes] = await Promise.all([apiFetch(NS), apiFetch(STATUS)]);
			if (!settingsRes.ok) {
				setError(settingsRes.status === 401 || settingsRes.status === 403 ? "Nur für Administratoren." : `Einstellungen konnten nicht geladen werden (HTTP ${settingsRes.status}).`);
				setLoaded(true);
				return;
			}
			const data = await settingsRes.json();
			const map = new Map((data.settings ?? []).map((s) => [s.key, s]));
			setHost(map.get("imap_host")?.value ?? "");
			setPort(map.get("imap_port")?.value || DEFAULTS$1.port);
			setSecurity(map.get("imap_security")?.value || DEFAULTS$1.security);
			setUser(map.get("imap_user")?.value ?? "");
			setPasswordState(map.get("imap_password") ?? null);
			setFolder(map.get("imap_folder")?.value || DEFAULTS$1.folder);
			setMode(map.get("ingest_mode")?.value || DEFAULTS$1.mode);
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
			const res = await sendJson(NS, "PUT", { settings: [
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
			] });
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
			const res = await apiFetch(TEST);
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
			const res = await apiFetch(POLL, { method: "POST" });
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
							placeholder: DEFAULTS$1.folder,
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
// node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/Settings.astro
var $$Settings$8 = createComponent(($$result, $$props, $$slots) => {
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
// node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/LiveChatSettings.tsx
/**
* Live-Chat settings — the activation matrix (each frontend × {master, chat, faq,
* docs, contact}) plus the widget branding. Persisted to the core runtime
* settings store (/admin/settings/live-chat-cta, via tds-shared
* `useRuntimeSettings`); all keys are non-secret. The
* public config endpoint reads the same store, so toggles take effect with no
* rebuild — the widget just re-reads config on its next mount.
*/
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
	const settings = useRuntimeSettings("live-chat-cta");
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
	useEffect(() => {
		const map = settings.settings;
		const next = {};
		for (const k of allKeys) next[k] = map.get(k)?.value ?? "";
		if (!map.has("cta_label")) next.cta_label = "Fragen? Schreib uns";
		if (!map.has("cta_greeting")) next.cta_greeting = "Hallo! Wie können wir helfen?";
		if (!map.has("cta_accent")) next.cta_accent = "#050f68";
		for (const f of FRONTENDS) for (const feat of FEATURES) if (!map.has(`${f.key}_${feat.key}`)) next[`${f.key}_${feat.key}`] = "1";
		setValues(next);
	}, [settings.settings, allKeys]);
	const set = (key, value) => setValues((v) => ({
		...v,
		[key]: value
	}));
	const flag = (key) => values[key] === "1";
	const toggle = (key) => set(key, flag(key) ? "0" : "1");
	const save = () => settings.save(allKeys.map((key) => ({
		key,
		value: values[key] ?? ""
	})));
	if (!settings.loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
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
			/* @__PURE__ */ jsx(Alert, { children: settings.error }),
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-primary",
				type: "button",
				onClick: () => void save(),
				disabled: settings.busy,
				children: "Speichern"
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/Settings.astro
var $$Settings$7 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "LiveChatSettings", LiveChatSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/LiveChatSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/WebsiteSettings.tsx
/**
* Website-CMS settings section — DeepL key and auto-translate flag, persisted
* in the core's runtime settings store (`/admin/settings/website-cms`,
* admin-only) through tds-shared `useRuntimeSettings`. Secrets come back masked
* (configured + last4) and a blank secret on save keeps the existing value. The
* extension backend reads these DB-first with an env fallback. Same shape as
* blog-cms's BlogSettings.
*/
function WebsiteSettings() {
	const settings = useRuntimeSettings("website-cms");
	const [autoTranslate, setAutoTranslate] = useState(true);
	const [deeplInput, setDeeplInput] = useState("");
	useEffect(() => {
		setAutoTranslate(settings.get("auto_translate")?.value !== "0");
	}, [settings.settings]);
	const save = async () => {
		if (await settings.save([{
			key: "deepl_api_key",
			secret: true,
			value: deeplInput.trim()
		}, {
			key: "auto_translate",
			value: autoTranslate ? "1" : "0"
		}])) setDeeplInput("");
	};
	if (!settings.loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "website-settings space-y-4",
		children: [
			/* @__PURE__ */ jsx(SecretField, {
				label: "DeepL API-Key",
				setting: settings.get("deepl_api_key"),
				value: deeplInput,
				onChange: setDeeplInput,
				placeholder: "Neuen Schlüssel setzen (leer = behalten)"
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
			/* @__PURE__ */ jsx(Alert, { children: settings.error }),
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-primary",
				type: "button",
				onClick: () => void save(),
				disabled: settings.busy,
				children: "Speichern"
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/SiteRegistry.tsx
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
			res = await sendJson("/cms/sites", "POST", {
				site_key: siteKey,
				name: name.trim()
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
					formError ? /* @__PURE__ */ jsx(Alert, { children: formError }) : null,
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "submit",
						disabled: creating,
						children: creating ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Website hinzufügen"
					})
				]
			}),
			sitesQuery.error && sites.length > 0 ? /* @__PURE__ */ jsxs(Alert, { children: [
				"Websites konnten nicht aktualisiert werden (",
				sitesQuery.error.message,
				"). Die angezeigten Daten sind möglicherweise veraltet."
			] }) : null,
			sitesQuery.loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : sitesQuery.error && sites.length === 0 ? /* @__PURE__ */ jsxs(Alert, { children: [
				"Websites konnten nicht geladen werden (",
				sitesQuery.error.message,
				")."
			] }) : sites.length === 0 ? /* @__PURE__ */ jsx("p", {
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
	const pairing = usePairing({
		base: `/cms/sites/${site.site_key}`,
		profile: "landingpage",
		subject: "Die Website",
		rebuildBody: { all: true },
		rebuildSuccess: "Cache-Neubau für die Website wurde angestoßen.",
		ambiguousHint: "Bitte eine reine HTTPS-Adresse und bei mehreren Blogs den passenden Blog-Schlüssel angeben."
	});
	const connection = pairing.connection;
	const [origin, setOrigin] = useState("");
	const [blog, setBlog] = useState("");
	const [confirmDisconnect, setConfirmDisconnect] = useState(false);
	const [disconnecting, setDisconnecting] = useState(false);
	const [rebuilding, setRebuilding] = useState(false);
	const candidateKeys = pairing.candidates ?? blogs.map((item) => item.blog_key);
	useEffect(() => {
		if (connection?.origin) setOrigin(connection.origin);
	}, [connection?.origin]);
	useEffect(() => {
		if (blogs.length === 1) setBlog(blogs[0].blog_key);
	}, [blogs]);
	const connect = () => void pairing.connect(origin, blog.trim() === "" ? {} : { blog: blog.trim() });
	const disconnect = async () => {
		setDisconnecting(true);
		await pairing.disconnect();
		setDisconnecting(false);
		setConfirmDisconnect(false);
	};
	const rebuildCache = async () => {
		setRebuilding(true);
		await pairing.rebuildCache();
		setRebuilding(false);
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
			pairing.loading ? /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Verbindungsstatus wird geladen …"] }) : connection ? /* @__PURE__ */ jsxs(Alert, {
				tone: "success",
				children: ["Verbunden mit ", connection.origin ?? origin]
			}) : /* @__PURE__ */ jsx(Alert, {
				tone: "neutral",
				children: "Noch nicht mit der API verbunden."
			}),
			/* @__PURE__ */ jsx(Alert, { children: pairing.status }),
			pairing.installUrl ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
				className: "btn btn-ghost",
				href: pairing.installUrl,
				children: "Einrichtungslink öffnen"
			}) }) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: connect,
						disabled: pairing.connecting || origin.trim() === "" || candidateKeys.length > 1 && blog === "",
						children: pairing.connecting ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : connection ? "Neu verbinden" : "Mit API verbinden"
					}),
					/* @__PURE__ */ jsxs("button", {
						className: "btn btn-accent",
						type: "button",
						onClick: () => void rebuildCache(),
						disabled: rebuilding,
						"aria-busy": rebuilding,
						children: [rebuilding ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : null, "Seiten-Cache neu bauen"]
					}),
					connection ? /* @__PURE__ */ jsx("button", {
						className: "btn btn-ghost",
						type: "button",
						onClick: () => setConfirmDisconnect(true),
						children: "Verbindung trennen"
					}) : null
				]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: confirmDisconnect,
				title: "Verbindung trennen?",
				message: `Die Website „${site.name}" verliert ihren API-Zugang, bis sie neu verbunden wird.`,
				confirmLabel: "Trennen",
				busy: disconnecting,
				onConfirm: () => void disconnect(),
				onCancel: () => setConfirmDisconnect(false)
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/Settings.astro
var $$Settings$6 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "WebsiteSettings", WebsiteSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/WebsiteSettings.tsx",
		"client:component-export": "default"
	})}<h3>Websites</h3><p class="marginalia">Hier werden Websites hinzugefügt. Die Inhalte selbst werden unter <a class="link-underline" href="/website">Website-CMS</a> bearbeitet — dort wird pro Seite ausgewählt, was geändert werden soll.</p>${renderComponent($$result, "SiteRegistry", SiteRegistry, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/SiteRegistry.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogSettings.tsx
/**
* Blog-CMS settings section — DeepL key + auto-translate flag, persisted in the
* core's runtime settings store (`/admin/settings/blog-cms`, admin-only)
* through tds-shared `useRuntimeSettings`. Secrets come back masked
* (configured + last4) and a blank secret on save keeps the existing value, so
* the raw key never round-trips to the UI. The extension backend reads these
* DB-first with an env fallback.
*/
function BlogSettings() {
	const settings = useRuntimeSettings("blog-cms");
	const [autoTranslate, setAutoTranslate] = useState(true);
	const [deeplInput, setDeeplInput] = useState("");
	useEffect(() => {
		setAutoTranslate(settings.get("auto_translate")?.value !== "0");
	}, [settings.settings]);
	const save = async () => {
		if (await settings.save([{
			key: "deepl_api_key",
			secret: true,
			value: deeplInput.trim()
		}, {
			key: "auto_translate",
			value: autoTranslate ? "1" : "0"
		}])) setDeeplInput("");
	};
	if (!settings.loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "blog-settings space-y-4",
		children: [
			/* @__PURE__ */ jsx(SecretField, {
				label: "DeepL API-Key",
				setting: settings.get("deepl_api_key"),
				value: deeplInput,
				onChange: setDeeplInput,
				placeholder: "Neuen Schlüssel setzen (leer = behalten)"
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
			/* @__PURE__ */ jsx(Alert, { children: settings.error }),
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-primary",
				type: "button",
				onClick: () => void save(),
				disabled: settings.busy,
				children: "Speichern"
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogRegistry.tsx
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
		let res;
		try {
			res = await sendJson("/blogs", "POST", {
				blog_key: blogKey,
				name: name.trim()
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
					formError ? /* @__PURE__ */ jsx(Alert, { children: formError }) : null,
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "submit",
						disabled: creating,
						children: creating ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Blog hinzufügen"
					})
				]
			}),
			blogsQuery.error && blogs.length > 0 ? /* @__PURE__ */ jsxs(Alert, { children: [
				"Die Blog-Liste konnte nicht aktualisiert werden (",
				blogsQuery.error.message,
				"). Die angezeigten Daten können veraltet sein."
			] }) : null,
			blogsQuery.loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : blogsQuery.error && blogs.length === 0 ? /* @__PURE__ */ jsxs(Alert, { children: [
				"Blogs konnten nicht geladen werden (",
				blogsQuery.error.message,
				")."
			] }) : blogs.length === 0 ? /* @__PURE__ */ jsx("p", {
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
	const pairing = usePairing({
		base: `/blogs/${blog.blog_key}`,
		profile: "blog",
		subject: "Der Blog"
	});
	const connection = pairing.connection;
	const [origin, setOrigin] = useState("");
	const [website, setWebsite] = useState("");
	const [confirmDisconnect, setConfirmDisconnect] = useState(false);
	const [rebuilding, setRebuilding] = useState(false);
	const candidateKeys = pairing.candidates ?? websites.map((item) => item.site_key);
	useEffect(() => {
		if (connection?.origin) setOrigin(connection.origin);
	}, [connection?.origin]);
	useEffect(() => {
		if (websites.length === 1) setWebsite(websites[0].site_key);
	}, [websites]);
	const connect = () => void pairing.connect(origin, website.trim() === "" ? {} : { website: website.trim() });
	const [disconnecting, setDisconnecting] = useState(false);
	const disconnect = async () => {
		setDisconnecting(true);
		await pairing.disconnect();
		setDisconnecting(false);
		setConfirmDisconnect(false);
	};
	const rebuildCache = async () => {
		setRebuilding(true);
		await pairing.rebuildCache();
		setRebuilding(false);
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
			pairing.loading ? /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Verbindungsstatus wird geladen …"] }) : connection ? /* @__PURE__ */ jsxs(Alert, {
				tone: "success",
				children: ["Verbunden mit ", connection.origin ?? origin]
			}) : /* @__PURE__ */ jsx(Alert, {
				tone: "neutral",
				children: "Noch nicht mit der API verbunden."
			}),
			/* @__PURE__ */ jsx(Alert, { children: pairing.status }),
			pairing.installUrl ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
				className: "btn btn-ghost",
				href: pairing.installUrl,
				children: "Einrichtungslink öffnen"
			}) }) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: connect,
						disabled: pairing.connecting || origin.trim() === "" || candidateKeys.length > 1 && website === "",
						children: pairing.connecting ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : connection ? "Neu verbinden" : "Mit API verbinden"
					}),
					/* @__PURE__ */ jsxs("button", {
						className: "btn btn-accent",
						type: "button",
						onClick: () => void rebuildCache(),
						disabled: rebuilding,
						"aria-busy": rebuilding,
						children: [rebuilding ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : null, "Seiten-Cache neu bauen"]
					}),
					connection ? /* @__PURE__ */ jsx("button", {
						className: "btn btn-ghost",
						type: "button",
						onClick: () => setConfirmDisconnect(true),
						children: "Verbindung trennen"
					}) : null
				]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: confirmDisconnect,
				title: "Verbindung trennen?",
				message: `Der Blog „${blog.name}" verliert seinen API-Zugang, bis er neu verbunden wird.`,
				confirmLabel: "Trennen",
				busy: disconnecting,
				onConfirm: () => void disconnect(),
				onCancel: () => setConfirmDisconnect(false)
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/Settings.astro
var $$Settings$5 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "BlogSettings", BlogSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogSettings.tsx",
		"client:component-export": "default"
	})}<h3>Blogs</h3><p class="marginalia">Hier werden Blogs hinzugefügt. Die Beiträge selbst werden unter <a class="link-underline" href="/blog">Blog-CMS</a> geschrieben — dort wird pro Artikel ausgewählt, was geändert werden soll.</p>${renderComponent($$result, "BlogRegistry", BlogRegistry, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogRegistry.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsSettings.tsx
/**
* Designsystem-Studio export formats, in the order the studio lists them. Must
* match `StudioPolicy::FORMATS` (PHP) and `EXPORT_FORMATS` (tds-tool-devkit).
*/
var STUDIO_FORMATS = [
	["css", "CSS"],
	["variables", "CSS Custom Properties"],
	["html", "HTML-Beispiele"],
	["scss", "SCSS"],
	["json", "JSON Design Tokens"],
	["tailwind", "Tailwind CSS"],
	["bootstrap", "Bootstrap 5.3"],
	["zip", "Komplettpaket (ZIP)"]
];
var STUDIO_DEFAULT_PREMIUM = "scss,tailwind,bootstrap,zip";
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
	const settings = useRuntimeSettings("tools");
	const pairing = usePairing({
		base: "/admin/tools",
		profile: "tools",
		subject: "Die Tools-Site",
		ambiguousHint: "Bitte eine reine HTTPS-Adresse ohne Pfad eingeben."
	});
	const connection = pairing.connection;
	const [adsEnabled, setAdsEnabled] = useState(false);
	const [publisherId, setPublisherId] = useState("");
	const [slotCatalog, setSlotCatalog] = useState("");
	const [slotTool, setSlotTool] = useState("");
	const [origin, setOrigin] = useState("");
	const [confirmDisconnect, setConfirmDisconnect] = useState(false);
	const [disconnecting, setDisconnecting] = useState(false);
	const [saving, setSaving] = useState(false);
	const [currency, setCurrency] = useState("EUR");
	const [successUrl, setSuccessUrl] = useState("");
	const [cancelUrl, setCancelUrl] = useState("");
	const [stripeKey, setStripeKey] = useState("");
	const [stripeHook, setStripeHook] = useState("");
	const [studioPremium, setStudioPremium] = useState(new Set(STUDIO_DEFAULT_PREMIUM.split(",")));
	const [studioPrice, setStudioPrice] = useState("9,00");
	const [studioLimit, setStudioLimit] = useState("50");
	const [studioAnalysis, setStudioAnalysis] = useState(true);
	const [studioPerHour, setStudioPerHour] = useState("20");
	const [studioSheets, setStudioSheets] = useState("12");
	useEffect(() => {
		const v = settings.value;
		setAdsEnabled(v("ads_enabled", "0") === "1");
		setPublisherId(v("adsense_publisher_id"));
		setSlotCatalog(v("adsense_slot_catalog"));
		setSlotTool(v("adsense_slot_tool"));
		setCurrency(v("currency", "EUR"));
		setSuccessUrl(v("checkout_success_url"));
		setCancelUrl(v("checkout_cancel_url"));
		const premium = settings.get("studio_premium_formats")?.value ?? STUDIO_DEFAULT_PREMIUM;
		setStudioPremium(new Set(premium.split(",").map((f) => f.trim()).filter(Boolean)));
		const cents = Number(v("studio_price_cents", "900"));
		setStudioPrice(centsToEuroInput(Number.isFinite(cents) ? cents : 900));
		setStudioLimit(v("studio_project_limit", "50"));
		setStudioAnalysis(v("studio_analysis_enabled", "1") === "1");
		setStudioPerHour(v("studio_analysis_per_hour", "20"));
		setStudioSheets(v("studio_analysis_max_stylesheets", "12"));
	}, [settings.settings]);
	useEffect(() => {
		if (connection?.origin) setOrigin(connection.origin);
	}, [connection?.origin]);
	const save = async () => {
		const cents = parseEuros(studioPrice);
		if (cents === null) {
			toast.danger("Bitte einen gültigen Preis für das Designsystem-Studio eingeben (z. B. 9,00).");
			return;
		}
		const whole = (v, min, max, fallback) => {
			const n = Math.round(Number(v));
			return String(Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback);
		};
		setSaving(true);
		if (await settings.save([
			{
				key: "ads_enabled",
				value: adsEnabled ? "1" : "0"
			},
			{
				key: "adsense_publisher_id",
				value: publisherId.trim()
			},
			{
				key: "adsense_slot_catalog",
				value: slotCatalog.trim()
			},
			{
				key: "adsense_slot_tool",
				value: slotTool.trim()
			},
			{
				key: "currency",
				value: currency.trim().toUpperCase() || "EUR"
			},
			{
				key: "checkout_success_url",
				value: successUrl.trim()
			},
			{
				key: "checkout_cancel_url",
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
			},
			{
				key: "studio_premium_formats",
				value: STUDIO_FORMATS.map(([f]) => f).filter((f) => studioPremium.has(f)).join(",")
			},
			{
				key: "studio_price_cents",
				value: String(cents)
			},
			{
				key: "studio_project_limit",
				value: whole(studioLimit, 1, 1e3, 50)
			},
			{
				key: "studio_analysis_enabled",
				value: studioAnalysis ? "1" : "0"
			},
			{
				key: "studio_analysis_per_hour",
				value: whole(studioPerHour, 1, 1e3, 20)
			},
			{
				key: "studio_analysis_max_stylesheets",
				value: whole(studioSheets, 1, 30, 12)
			}
		], null)) {
			setStripeKey("");
			setStripeHook("");
			const cacheRes = await sendJson("/admin/tools/cache/rebuild", "POST", { event: "settings" }).catch(() => null);
			const cacheBody = cacheRes === null ? {} : await cacheRes.json().catch(() => ({}));
			if (cacheRes === null) toast.warning("Gespeichert — Cache-Aktualisierung fehlgeschlagen, die API ist nicht erreichbar.");
			else if (cacheRes.status === 202 && cacheBody.cached === true) toast.success("Gespeichert — Seiten-Cache aktualisiert.");
			else if (cacheRes.status === 503) toast.warning("Gespeichert — die Tools-Site ist noch nicht für Cache-Aktualisierungen verbunden.");
			else toast.warning(`Gespeichert — Cache-Aktualisierung fehlgeschlagen (HTTP ${cacheRes.status}).`);
		}
		setSaving(false);
	};
	const disconnect = async () => {
		setDisconnecting(true);
		await pairing.disconnect();
		setDisconnecting(false);
		setConfirmDisconnect(false);
	};
	if (!settings.loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
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
					pairing.loading ? /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Verbindungsstatus wird geladen …"] }) : connection ? /* @__PURE__ */ jsxs(Alert, {
						tone: "success",
						children: ["Verbunden mit ", connection.origin ?? origin]
					}) : /* @__PURE__ */ jsx(Alert, {
						tone: "neutral",
						children: "Noch nicht mit der API verbunden."
					}),
					/* @__PURE__ */ jsx(Alert, { children: pairing.status }),
					pairing.installUrl ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
						className: "btn btn-ghost",
						href: pairing.installUrl,
						children: "Einrichtungslink öffnen"
					}) }) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: () => void pairing.connect(origin),
							disabled: pairing.connecting || origin.trim() === "",
							children: pairing.connecting ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : connection ? "Neu verbinden" : "Mit API verbinden"
						}), connection ? /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setConfirmDisconnect(true),
							children: "Verbindung trennen"
						}) : null]
					}),
					/* @__PURE__ */ jsx(ConfirmDialog, {
						open: confirmDisconnect,
						title: "Verbindung trennen?",
						message: "Die Tools-Site verliert ihren API-Zugang, bis sie neu verbunden wird.",
						confirmLabel: "Trennen",
						busy: disconnecting,
						onConfirm: () => void disconnect(),
						onCancel: () => setConfirmDisconnect(false)
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
						children: "Ohne Stripe-Konto (zentral oder hier) antwortet der Checkout mit 503 und kein Premium-Tool lässt sich kaufen. Der Webhook (…/tools/stripe-webhook) schaltet den Kauf frei — ohne sein Secret bleibt jede Zahlung ohne Freischaltung."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm opacity-70",
						children: "Nur nötig, wenn dieses Modul ein eigenes Stripe-Konto nutzen soll. Ohne eigenen Schlüssel gilt das zentrale Konto unter Einstellungen → Zahlungen (Stripe); dort stehen auch alle Webhook-Adressen."
					}),
					/* @__PURE__ */ jsx(SecretField, {
						label: "Secret Key, optional",
						setting: settings.get("stripe_secret_key"),
						value: stripeKey,
						onChange: setStripeKey,
						placeholder: "sk_… (leer = behalten)"
					}),
					/* @__PURE__ */ jsx(SecretField, {
						label: "Webhook Secret",
						setting: settings.get("stripe_webhook_secret"),
						value: stripeHook,
						onChange: setStripeHook,
						placeholder: "whsec_… (leer = behalten)"
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
			/* @__PURE__ */ jsxs("fieldset", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsx("legend", {
						className: "text-sm font-semibold",
						children: "Designsystem-Studio"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm opacity-70",
						children: "Das Studio selbst ist kostenlos. Premium (einmaliger Kauf, Freischaltung „design-system-studio“) schaltet das Speichern von Projekten und die unten als Premium markierten Exportformate frei. Ein- und ausgeschaltet wird das Tool in der Tool-Verwaltung."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: STUDIO_FORMATS.map(([format, label]) => /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: label
							}), /* @__PURE__ */ jsxs("select", {
								className: "field-boxed",
								value: studioPremium.has(format) ? "premium" : "free",
								onChange: (e) => {
									const next = new Set(studioPremium);
									if (e.target.value === "premium") next.add(format);
									else next.delete(format);
									setStudioPremium(next);
								},
								children: [/* @__PURE__ */ jsx("option", {
									value: "free",
									children: "Kostenlos"
								}), /* @__PURE__ */ jsx("option", {
									value: "premium",
									children: "Premium"
								})]
							})]
						}, format))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Premium-Preis (Euro)"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "text",
								inputMode: "decimal",
								value: studioPrice,
								onChange: (e) => setStudioPrice(e.target.value),
								placeholder: "9,00"
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Gespeicherte Projekte pro Nutzer"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "number",
								min: 1,
								max: 1e3,
								value: studioLimit,
								onChange: (e) => setStudioLimit(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: studioAnalysis,
							onChange: (e) => setStudioAnalysis(e.target.checked)
						}), "Website-Analyse per HTTPS erlauben"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Analysen pro Stunde und Besucher-Adresse"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "number",
								min: 1,
								max: 1e3,
								value: studioPerHour,
								onChange: (e) => setStudioPerHour(e.target.value)
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Stylesheets pro Analyse (höchstens 30)"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "number",
								min: 1,
								max: 30,
								value: studioSheets,
								onChange: (e) => setStudioSheets(e.target.value)
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Alert, { children: settings.error }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-primary",
				onClick: () => void save(),
				disabled: saving,
				"aria-busy": saving,
				children: "Speichern"
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-tools/islands/Settings.astro
var $$Settings$4 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "ToolsSettings", ToolsSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/ToolsSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-shop/islands/ShopSettings.tsx
/**
* TDShop settings — the Amazon Product Advertising credentials.
*
* Persisted in the core's runtime settings store (admin-only), so they live in
* the database rather than in `.env` and can be changed without a deploy.
* Secrets come back **masked** (`configured` + `last4`) and a blank secret on
* save keeps the stored value — the raw key never round-trips to the browser.
*
* The module reads them DB-first with an env fallback, and treats all three of
* key/secret/tag as one unit: with any of them missing the sync is simply off,
* rather than half-configured and failing every call with a signature error
* that reads like a code bug.
*/
function ShopSettings() {
	const settings = useRuntimeSettings("shop");
	const [rebuilding, setRebuilding] = useState(false);
	const [cacheUrl, setCacheUrl] = useState("https://shop.tracht-digital.de");
	const [cacheToken, setCacheToken] = useState("");
	const [accessInput, setAccessInput] = useState("");
	const [secretInput, setSecretInput] = useState("");
	const [partnerTag, setPartnerTag] = useState("");
	const [marketplace, setMarketplace] = useState("www.amazon.de");
	const [stripeKeyInput, setStripeKeyInput] = useState("");
	const [stripeHookInput, setStripeHookInput] = useState("");
	const [ppClientId, setPpClientId] = useState("");
	const [ppSecretInput, setPpSecretInput] = useState("");
	const [ppWebhookId, setPpWebhookId] = useState("");
	const [ppSandbox, setPpSandbox] = useState(false);
	const [weroPsp, setWeroPsp] = useState("");
	const [weroKeyInput, setWeroKeyInput] = useState("");
	const [weroHookInput, setWeroHookInput] = useState("");
	const [shipFlat, setShipFlat] = useState("");
	const [shipFreeFrom, setShipFreeFrom] = useState("");
	useEffect(() => {
		const get = (key) => settings.get(key)?.value;
		setCacheUrl(get("cache_url") ?? "https://shop.tracht-digital.de");
		setPartnerTag(get("amazon_partner_tag") ?? "");
		setMarketplace(get("amazon_marketplace") ?? "www.amazon.de");
		setPpClientId(get("paypal_client_id") ?? "");
		setPpWebhookId(get("paypal_webhook_id") ?? "");
		setPpSandbox((get("paypal_sandbox") ?? "") !== "");
		setWeroPsp(get("wero_psp") ?? "");
		setShipFlat(get("shipping_flat_cents") ?? "");
		setShipFreeFrom(get("shipping_free_from_cents") ?? "");
	}, [settings.settings]);
	const save = async () => {
		if (!await settings.save([
			{
				key: "cache_url",
				value: cacheUrl.trim()
			},
			{
				key: "cache_token",
				secret: true,
				value: cacheToken.trim()
			},
			{
				key: "amazon_access_key",
				secret: true,
				value: accessInput.trim()
			},
			{
				key: "amazon_secret_key",
				secret: true,
				value: secretInput.trim()
			},
			{
				key: "amazon_partner_tag",
				value: partnerTag.trim()
			},
			{
				key: "amazon_marketplace",
				value: marketplace.trim()
			},
			{
				key: "stripe_secret_key",
				secret: true,
				value: stripeKeyInput.trim()
			},
			{
				key: "stripe_webhook_secret",
				secret: true,
				value: stripeHookInput.trim()
			},
			{
				key: "paypal_client_id",
				value: ppClientId.trim()
			},
			{
				key: "paypal_secret",
				secret: true,
				value: ppSecretInput.trim()
			},
			{
				key: "paypal_webhook_id",
				value: ppWebhookId.trim()
			},
			{
				key: "paypal_sandbox",
				value: ppSandbox ? "1" : ""
			},
			{
				key: "wero_psp",
				value: weroPsp.trim()
			},
			{
				key: "wero_api_key",
				secret: true,
				value: weroKeyInput.trim()
			},
			{
				key: "wero_webhook_secret",
				secret: true,
				value: weroHookInput.trim()
			},
			{
				key: "shipping_flat_cents",
				value: shipFlat.trim()
			},
			{
				key: "shipping_free_from_cents",
				value: shipFreeFrom.trim()
			}
		])) return;
		setAccessInput("");
		setCacheToken("");
		setSecretInput("");
		setStripeKeyInput("");
		setStripeHookInput("");
		setPpSecretInput("");
		setWeroKeyInput("");
		setWeroHookInput("");
	};
	if (!settings.loaded) return /* @__PURE__ */ jsx(Spinner, {});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(Alert, { children: settings.error }),
		/* @__PURE__ */ jsx("h3", { children: "Öffentlichen Shop aktualisieren" }),
		/* @__PURE__ */ jsx("p", { children: "Freigaben aktualisieren den Seiten-Cache automatisch. Das Token muss mit TDS_CACHE_TOKEN auf dem Shop-Host übereinstimmen. Angaben zuerst speichern." }),
		/* @__PURE__ */ jsxs("div", {
			className: "tds-field-row",
			children: [/* @__PURE__ */ jsxs("label", { children: ["Shop-Adresse", /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				type: "url",
				value: cacheUrl,
				onChange: (e) => setCacheUrl(e.target.value)
			})] }), /* @__PURE__ */ jsxs("label", { children: [
				"Cache-Token ",
				/* @__PURE__ */ jsxs("em", { children: [
					"(",
					secretHint(settings.get("cache_token")),
					")"
				] }),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					autoComplete: "off",
					value: cacheToken,
					onChange: (e) => setCacheToken(e.target.value),
					placeholder: "leer lassen = unverändert"
				})
			] })]
		}),
		/* @__PURE__ */ jsx("button", {
			className: "btn btn-ghost",
			type: "button",
			disabled: settings.busy || rebuilding,
			"aria-busy": rebuilding,
			onClick: async () => {
				setRebuilding(true);
				try {
					const res = await apiFetch("/shop/cache/rebuild", { method: "POST" });
					const report = await res.json();
					if (res.ok && report.cached) toast.success("Öffentlicher Shop aktualisiert.");
					else toast.warning(report.cache_status === "not_configured" ? "Bitte Shop-Adresse und Cache-Token konfigurieren und speichern." : "Seiten-Cache konnte nicht vollständig aktualisiert werden. Bitte Verbindung und Token prüfen.");
				} catch {
					toast.danger("Keine Verbindung zur API.");
				} finally {
					setRebuilding(false);
				}
			},
			children: "Seiten-Cache neu aufbauen"
		}),
		/* @__PURE__ */ jsx(Alert, {
			tone: "info",
			children: "Ohne diese drei Angaben ist der Angebotsabgleich aus. Der Katalog funktioniert trotzdem — Affiliate-Links sind nicht die API. Nur Preise verschwinden dann nach 24 Stunden von selbst aus der Anzeige, weil sie laut Lizenz nicht länger gezeigt werden dürfen."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "tds-field-row",
			children: [/* @__PURE__ */ jsxs("label", { children: [
				"Access Key ",
				/* @__PURE__ */ jsxs("em", { children: [
					"(",
					secretHint(settings.get("amazon_access_key")),
					")"
				] }),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					autoComplete: "off",
					value: accessInput,
					onChange: (e) => setAccessInput(e.target.value),
					placeholder: "leer lassen = unverändert"
				})
			] }), /* @__PURE__ */ jsxs("label", { children: [
				"Secret Key ",
				/* @__PURE__ */ jsxs("em", { children: [
					"(",
					secretHint(settings.get("amazon_secret_key")),
					")"
				] }),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					autoComplete: "off",
					value: secretInput,
					onChange: (e) => setSecretInput(e.target.value),
					placeholder: "leer lassen = unverändert"
				})
			] })]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "tds-field-row",
			children: [/* @__PURE__ */ jsxs("label", { children: ["Partner-Tag", /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				value: partnerTag,
				onChange: (e) => setPartnerTag(e.target.value),
				placeholder: "tds-21"
			})] }), /* @__PURE__ */ jsxs("label", { children: ["Marktplatz", /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				value: marketplace,
				onChange: (e) => setMarketplace(e.target.value)
			})] })]
		}),
		/* @__PURE__ */ jsx("h3", { children: "Stripe" }),
		/* @__PURE__ */ jsxs(Alert, {
			tone: "info",
			children: [
				"Für den Verkauf eigener Leistungen. Der Secret Key ist nur nötig, wenn der Shop ein eigenes Stripe-Konto nutzen soll — sonst gilt das zentrale Konto unter Einstellungen → Zahlungen (Stripe). Das Webhook-Secret ist kein Nice-to-have: fehlt es, weist der Webhook ",
				/* @__PURE__ */ jsx("strong", { children: "jede" }),
				" ",
				"Anfrage ab, statt irgendeinen POST als Zahlung zu akzeptieren."
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "tds-field-row",
			children: [/* @__PURE__ */ jsxs("label", { children: [
				"Secret Key, optional ",
				/* @__PURE__ */ jsxs("em", { children: [
					"(",
					secretHint(settings.get("stripe_secret_key")),
					")"
				] }),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					autoComplete: "off",
					value: stripeKeyInput,
					onChange: (e) => setStripeKeyInput(e.target.value),
					placeholder: "leer lassen = unverändert"
				})
			] }), /* @__PURE__ */ jsxs("label", { children: [
				"Webhook-Secret ",
				/* @__PURE__ */ jsxs("em", { children: [
					"(",
					secretHint(settings.get("stripe_webhook_secret")),
					")"
				] }),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					autoComplete: "off",
					value: stripeHookInput,
					onChange: (e) => setStripeHookInput(e.target.value),
					placeholder: "whsec_…"
				})
			] })]
		}),
		/* @__PURE__ */ jsx("h3", { children: "PayPal" }),
		/* @__PURE__ */ jsxs(Alert, {
			tone: "info",
			children: [
				"Direkt über Orders v2, nicht über einen zweiten Dienstleister. Die Webhook-ID gehört zu den Zugangsdaten und ist keine Formalität: ohne sie lässt sich ein Ereignis nicht prüfen, und eine Zahlungsart, die eine Zahlung starten, aber nie bestätigen kann, wird deshalb gar nicht erst angeboten. Webhook-Adresse:",
				" ",
				/* @__PURE__ */ jsx("code", { children: "/shop/payment/paypal/webhook" })
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "tds-field-row",
			children: [/* @__PURE__ */ jsxs("label", { children: ["Client-ID", /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				value: ppClientId,
				onChange: (e) => setPpClientId(e.target.value),
				placeholder: "leer = PayPal aus"
			})] }), /* @__PURE__ */ jsxs("label", { children: [
				"Secret ",
				/* @__PURE__ */ jsxs("em", { children: [
					"(",
					secretHint(settings.get("paypal_secret")),
					")"
				] }),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					autoComplete: "off",
					value: ppSecretInput,
					onChange: (e) => setPpSecretInput(e.target.value),
					placeholder: "leer lassen = unverändert"
				})
			] })]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "tds-field-row",
			children: [/* @__PURE__ */ jsxs("label", { children: ["Webhook-ID", /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				value: ppWebhookId,
				onChange: (e) => setPpWebhookId(e.target.value),
				placeholder: "WH-…"
			})] }), /* @__PURE__ */ jsxs("label", {
				className: "tds-toggle-row",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: ppSandbox,
					onChange: (e) => setPpSandbox(e.target.checked)
				}), "Sandbox statt Live"]
			})]
		}),
		/* @__PURE__ */ jsx("h3", { children: "Wero" }),
		/* @__PURE__ */ jsxs(Alert, {
			tone: "warning",
			children: [
				"Noch nicht angeschlossen. Wero läuft über einen Zahlungsdienstleister, und solange hier keiner eingetragen ist, erscheint die Zahlungsart in der Kasse überhaupt nicht — sie lässt sich also nicht versehentlich anbieten. Was zum Fertigstellen fehlt, steht in",
				" ",
				/* @__PURE__ */ jsx("code", { children: "docs/wero-adapter.md" }),
				"."
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "tds-field-row",
			children: [/* @__PURE__ */ jsxs("label", { children: ["Dienstleister", /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				value: weroPsp,
				onChange: (e) => setWeroPsp(e.target.value),
				placeholder: "leer = Wero aus"
			})] }), /* @__PURE__ */ jsxs("label", { children: [
				"API-Schlüssel ",
				/* @__PURE__ */ jsxs("em", { children: [
					"(",
					secretHint(settings.get("wero_api_key")),
					")"
				] }),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					autoComplete: "off",
					value: weroKeyInput,
					onChange: (e) => setWeroKeyInput(e.target.value),
					placeholder: "leer lassen = unverändert"
				})
			] })]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "tds-field-row",
			children: /* @__PURE__ */ jsxs("label", { children: [
				"Webhook-Secret ",
				/* @__PURE__ */ jsxs("em", { children: [
					"(",
					secretHint(settings.get("wero_webhook_secret")),
					")"
				] }),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "password",
					autoComplete: "off",
					value: weroHookInput,
					onChange: (e) => setWeroHookInput(e.target.value),
					placeholder: "leer lassen = unverändert"
				})
			] })
		}),
		/* @__PURE__ */ jsx("h3", { children: "Versand" }),
		/* @__PURE__ */ jsxs(Alert, {
			tone: "info",
			children: [
				"Gilt nur für Bestellungen mit körperlicher Ware; ein Warenkorb aus reinen Leistungen wird nie mit Versand belastet und fragt auch keine Lieferanschrift ab. Beträge in ",
				/* @__PURE__ */ jsx("strong", { children: "Cent" }),
				", netto — die Steuer kommt oben drauf, und zwar mit dem Satz der gelieferten Ware, bei gemischten Sätzen anteilig aufgeteilt (Abschn. 3.10 UStAE). 0 als Pauschale heißt versandkostenfrei."
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "tds-field-row",
			children: [/* @__PURE__ */ jsxs("label", { children: ["Pauschale (Cent, netto)", /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				inputMode: "numeric",
				value: shipFlat,
				onChange: (e) => setShipFlat(e.target.value),
				placeholder: "495"
			})] }), /* @__PURE__ */ jsxs("label", { children: ["Versandfrei ab (Cent, netto)", /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				inputMode: "numeric",
				value: shipFreeFrom,
				onChange: (e) => setShipFreeFrom(e.target.value),
				placeholder: "0 = keine Grenze"
			})] })]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "tds-toolbar",
			children: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-primary",
				onClick: () => void save(),
				disabled: settings.busy,
				"aria-busy": settings.busy,
				children: "Speichern"
			})
		})
	] });
}
// node_modules/@tracht-digital-solutions/tds-ext-shop/islands/Settings.astro
var $$Settings$3 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "ShopSettings", ShopSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/ShopSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/AnalyticsSettings.tsx
/**
* Besucher-Statistik settings, persisted to the core settings store
* (`/admin/settings/analytics`). All keys are non-secret; the collector reads
* the same store on every beacon, so a change applies without a deploy.
*/
var DEFAULTS = {
	...Object.fromEntries(SITES.map((s) => [`site_${s.key}`, "1"])),
	retention_days: "90",
	excluded_paths: "",
	extra_hosts: "",
	geoip_enabled: "1"
};
function AnalyticsSettings() {
	const settings = useRuntimeSettings("analytics");
	const [status, setStatus] = useState(null);
	const [values, setValues] = useState(DEFAULTS);
	useEffect(() => {
		const next = { ...DEFAULTS };
		for (const [key, s] of settings.settings) if (key in next && typeof s.value === "string" && s.value !== "") next[key] = s.value;
		setValues(next);
	}, [settings.settings]);
	const set = (key, value) => setValues((v) => ({
		...v,
		[key]: value
	}));
	const flag = (key) => values[key] === "1";
	const save = async () => {
		const days = Number(values.retention_days);
		if (!Number.isInteger(days) || days < 7 || days > 400) {
			setStatus("Aufbewahrung: bitte eine ganze Zahl zwischen 7 und 400 Tagen.");
			return;
		}
		setStatus(null);
		await settings.save(Object.keys(DEFAULTS).map((key) => ({
			key,
			value: values[key] ?? ""
		})));
	};
	if (!settings.loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Gemessen wird nur, wer auf der jeweiligen Site der Kategorie „Statistik“ zugestimmt hat. Ohne Einwilligung sendet der Browser nichts."
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "tds-stack tds-stack--tight",
				children: [/* @__PURE__ */ jsx("legend", { children: "Messung je Site" }), SITES.map((s) => /* @__PURE__ */ jsxs("label", {
					className: "tds-toggle-row",
					children: [/* @__PURE__ */ jsx("span", { children: s.label }), /* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: flag(`site_${s.key}`),
						onChange: () => set(`site_${s.key}`, flag(`site_${s.key}`) ? "0" : "1")
					})]
				}, s.key))]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Rohdaten aufbewahren (Tage)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "number",
					min: 7,
					max: 400,
					value: values.retention_days ?? "90",
					onChange: (e) => set("retention_days", e.target.value)
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Danach werden einzelne Besuche gelöscht; es bleiben anonyme Tagessummen."
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-toggle-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Land aus der IP-Adresse ermitteln (lokale DB-IP-Datenbank, die Adresse wird nicht gespeichert)" }), /* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: flag("geoip_enabled"),
					onChange: () => set("geoip_enabled", flag("geoip_enabled") ? "0" : "1")
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Ausgeschlossene Pfade (ein Präfix je Zeile)" }), /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					rows: 3,
					value: values.excluded_paths ?? "",
					placeholder: "/vorschau",
					onChange: (e) => set("excluded_paths", e.target.value)
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Zusätzliche Hosts (host=site je Zeile, z. B. für eine lokale Vorschau)" }), /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					rows: 2,
					value: values.extra_hosts ?? "",
					placeholder: "localhost=landing",
					onChange: (e) => set("extra_hosts", e.target.value)
				})]
			}),
			/* @__PURE__ */ jsx(Alert, { children: status ?? settings.error }),
			/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", {
				className: "btn btn-primary",
				type: "button",
				onClick: save,
				disabled: settings.busy,
				children: "Speichern"
			}) })
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/Settings.astro
var $$Settings$2 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "AnalyticsSettings", AnalyticsSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/AnalyticsSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-referrals/islands/ReferralsSettings.tsx
var FIELDS = [
	{
		key: "default_rate_percent",
		label: "Standard-Provision (% vom Netto)",
		placeholder: "10",
		inputMode: "decimal"
	},
	{
		key: "hold_days",
		label: "Wartefrist nach Zahlung (Tage)",
		placeholder: "21",
		inputMode: "numeric"
	},
	{
		key: "link_days",
		label: "Gültigkeit eines Empfehlungslinks (Tage)",
		placeholder: "30",
		inputMode: "numeric"
	},
	{
		key: "link_base",
		label: "Ziel des Empfehlungslinks",
		placeholder: "https://shop.tracht-digital.de/",
		inputMode: "url"
	},
	{
		key: "terms_url",
		label: "Adresse der Partnerbedingungen",
		placeholder: "https://…",
		inputMode: "url"
	}
];
/** The programme's terms, in the core settings store (admin only). Empty = default. */
function ReferralsSettings() {
	const settings = useRuntimeSettings("referrals");
	const [values, setValues] = useState({});
	useEffect(() => {
		setValues(Object.fromEntries(FIELDS.map((f) => [f.key, settings.get(f.key)?.value ?? ""])));
	}, [settings.settings]);
	const save = () => settings.save(FIELDS.map((f) => ({
		key: f.key,
		value: (values[f.key] ?? "").trim()
	})));
	if (!settings.loaded) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Gilt für neue Vermittlungen. Bereits erfasste behalten ihren Satz. Leere Felder nehmen den angezeigten Standardwert."
			}),
			FIELDS.map((f) => /* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: f.label }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					inputMode: f.inputMode,
					value: values[f.key] ?? "",
					placeholder: f.placeholder,
					onChange: (e) => setValues({
						...values,
						[f.key]: e.target.value
					})
				})]
			}, f.key)),
			/* @__PURE__ */ jsx(Alert, { children: settings.error }),
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => void save(),
					disabled: settings.busy,
					"aria-busy": settings.busy,
					children: "Speichern"
				})
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-referrals/islands/Settings.astro
var $$Settings$1 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "ReferralsSettings", ReferralsSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-referrals/islands/ReferralsSettings.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-referrals/islands/Settings.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-cards/islands/CardsConnection.tsx
function CardsConnection() {
	const query = useCachedJson("/cards/connection");
	const [origin, setOrigin] = useState("https://karte.tracht-digital.de");
	const [pairing, setPairing] = useState(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const [confirmDisconnect, setConfirmDisconnect] = useState(false);
	const payload = query.data;
	const connection = payload && "connection" in payload ? payload.connection : null;
	const stale = query.stale && payload !== void 0;
	const pair = async () => {
		setBusy(true);
		setError(null);
		setPairing(null);
		try {
			const res = await sendJson("/cards/connection/pairing", "POST", { origin });
			const body = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(body.error ?? `Kopplung fehlgeschlagen (${res.status}).`);
				return;
			}
			setPairing(body);
			invalidate("/cards/connection");
			toast.success("Kopplung angelegt. Die Daten unten sind nur jetzt sichtbar.");
		} catch (err) {
			toast.danger(`Kopplung fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setBusy(false);
		}
	};
	const disconnect = async () => {
		setConfirmDisconnect(false);
		setBusy(true);
		try {
			const res = await apiFetch("/cards/connection", { method: "DELETE" });
			if (!res.ok) {
				setError(`Trennen fehlgeschlagen (${res.status}).`);
				return;
			}
			invalidate("/cards/connection");
			toast.success("Verbindung getrennt. Die Kartenseite liest nichts mehr.");
		} catch (err) {
			toast.danger(`Trennen fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setBusy(false);
		}
	};
	if (query.loading) return /* @__PURE__ */ jsxs("p", {
		"aria-busy": "true",
		children: [/* @__PURE__ */ jsx(Spinner, {}), " Verbindung wird geprüft …"]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: staleClass(stale, "tds-stack"),
		"aria-busy": stale,
		children: [
			error ? /* @__PURE__ */ jsx(Alert, { children: error }) : null,
			connection ? /* @__PURE__ */ jsxs("div", {
				className: "tds-stack",
				children: [
					/* @__PURE__ */ jsxs("p", { children: [
						"Verbunden mit ",
						/* @__PURE__ */ jsx("code", { children: connection.origin }),
						connection.connectedAt ? ` seit ${connection.connectedAt}` : "",
						"."
					] }),
					/* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Eine Verbindung genügt für alle Karten. Eine neue Kundendomain braucht einen DNS-Eintrag und einen Alias im Hosting, keine zweite Kopplung."
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: busy,
						onClick: () => setConfirmDisconnect(true),
						children: "Verbindung trennen"
					})
				]
			}) : /* @__PURE__ */ jsxs("form", {
				className: "tds-stack",
				onSubmit: (e) => {
					e.preventDefault();
					pair();
				},
				children: [
					/* @__PURE__ */ jsx("p", { children: "Die Kartenseite ist noch nicht verbunden. Bis dahin liest sie nichts." }),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-stack",
						children: [
							/* @__PURE__ */ jsx("span", { children: "Origin der Kartenseite" }),
							/* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "url",
								value: origin,
								required: true,
								onChange: (e) => setOrigin(e.target.value)
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "marginalia",
								children: [
									"Die Rückfall-Domain, nicht eine Kundendomain. Hinter Plesk muss sie mit",
									/* @__PURE__ */ jsx("code", { children: "https://" }),
									" beginnen."
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "btn btn-primary",
						disabled: busy,
						children: busy ? "Wird gekoppelt …" : "Kopplung anlegen"
					})
				]
			}),
			pairing ? /* @__PURE__ */ jsxs("div", {
				className: "tds-alert tds-alert--info",
				children: [/* @__PURE__ */ jsxs("p", { children: [
					"Diese Daten einmalig auf ",
					/* @__PURE__ */ jsxs("code", { children: [origin, "/install"] }),
					" eintragen. Sie werden nicht wieder angezeigt."
				] }), /* @__PURE__ */ jsxs("dl", { children: [
					/* @__PURE__ */ jsx("dt", { children: "Code" }),
					/* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx("code", { children: pairing.code }) }),
					pairing.connectUrl ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("dt", { children: "Adresse" }), /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx("code", { children: pairing.connectUrl }) })] }) : null,
					pairing.expiresAt ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("dt", { children: "Gültig bis" }), /* @__PURE__ */ jsx("dd", { children: pairing.expiresAt })] }) : null
				] })]
			}) : null,
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: confirmDisconnect,
				title: "Verbindung trennen?",
				message: "Die Kartenseite liest danach nichts mehr und liefert nur noch, was in ihrem Cache liegt.",
				confirmLabel: "Trennen",
				onConfirm: () => void disconnect(),
				onCancel: () => setConfirmDisconnect(false)
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-cards/islands/Settings.astro
var $$Settings = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="tds-settings-section__body">${renderComponent($$result, "CardsConnection", CardsConnection, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-cards/islands/CardsConnection.tsx",
		"client:component-export": "default"
	})}</div>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-cards/islands/Settings.astro", void 0);
// \0virtual:frontend-settings
var settings = [
	{
		"id": "billing",
		"label": "Stripe / Rechnungen",
		"island": "@tracht-digital-solutions/tds-ext-billing/islands/Settings.astro",
		"order": 10,
		Component: $$Settings$10
	},
	{
		"id": "lexware",
		"label": "Lexware",
		"island": "@tracht-digital-solutions/tds-ext-lexware/islands/Settings.astro",
		"order": 20,
		Component: $$Settings$9
	},
	{
		"id": "support-tickets",
		"label": "Support-Tickets",
		"island": "@tracht-digital-solutions/tds-ext-support-tickets/islands/Settings.astro",
		"order": 30,
		Component: $$Settings$8
	},
	{
		"id": "live-chat-cta",
		"label": "Live-Chat",
		"island": "@tracht-digital-solutions/tds-ext-live-chat-cta/islands/Settings.astro",
		"order": 40,
		Component: $$Settings$7
	},
	{
		"id": "website-cms",
		"label": "Website-CMS",
		"island": "@tracht-digital-solutions/tds-ext-website-cms/islands/Settings.astro",
		"order": 40,
		Component: $$Settings$6
	},
	{
		"id": "blog-cms",
		"label": "Blog-CMS",
		"island": "@tracht-digital-solutions/tds-ext-blog-cms/islands/Settings.astro",
		"order": 50,
		Component: $$Settings$5
	},
	{
		"id": "tools",
		"label": "Tools / AdSense",
		"island": "@tracht-digital-solutions/tds-ext-tools/islands/Settings.astro",
		"order": 50,
		Component: $$Settings$4
	},
	{
		"id": "shop",
		"label": "TDShop",
		"island": "@tracht-digital-solutions/tds-ext-shop/islands/Settings.astro",
		"order": 55,
		Component: $$Settings$3
	},
	{
		"id": "analytics",
		"label": "Besucher-Statistik",
		"island": "@tracht-digital-solutions/tds-ext-analytics/islands/Settings.astro",
		"order": 60,
		Component: $$Settings$2
	},
	{
		"id": "referrals",
		"label": "Empfehlungsprogramm",
		"island": "@tracht-digital-solutions/tds-ext-referrals/islands/Settings.astro",
		"order": 60,
		Component: $$Settings$1
	},
	{
		"id": "cards",
		"label": "Visitenkarten",
		"island": "@tracht-digital-solutions/tds-ext-cards/islands/Settings.astro",
		"order": 140,
		Component: $$Settings
	}
];
// node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen.astro
var einstellungen_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Einstellungen,
	file: () => $$file,
	url: () => $$url
});
var $$Einstellungen = createComponent(($$result, $$props, $$slots) => {
	const showAdminSettings = FRONTEND_TARGET === "admin";
	const baseLabel = (id) => BASE_SETTINGS.find((s) => s.id === id)?.label ?? id;
	const index = settingsSections(settings).map((section) => ({
		...section,
		...sectionReveal(section)
	}));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Einstellungen" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Konfiguration</p><h1 class="tds-page__title">Einstellungen</h1></div></div><p class="tds-empty" data-settings-empty${addAttribute(settings.length > 0 || showAdminSettings, "hidden")}>Für Ihr Konto gibt es hier nichts einzustellen. Darstellung und Passwort ändern Sie im <a href="/profil" class="link-underline">Profil</a>.</p><div class="settings-layout"><nav class="settings-index" aria-label="Abschnitte" data-settings-index><p class="tds-dropdown__caption">Abschnitte</p><ul>${index.map((section) => renderTemplate`<li${addAttribute(section.revealFor, "data-reveal-for")}${addAttribute(section.permission, "data-reveal-permission")} hidden><a class="settings-index__link"${addAttribute(`#settings-${section.id}`, "href")}${addAttribute(section.id, "data-settings-link")}>${section.label}</a></li>`)}</ul></nav><div class="settings-list flex flex-col gap-6">${showAdminSettings ? renderTemplate`<section class="tds-settings-section" id="settings-mail" data-settings="mail" data-reveal-for="platform-admin" hidden><h2 class="tds-settings-section__title">${baseLabel("mail")}</h2>${renderComponent($$result, "MailSettings", MailSettings, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/MailSettings.tsx",
		"client:component-export": "default"
	})}</section>` : null}${showAdminSettings ? renderTemplate`<section class="tds-settings-section" id="settings-stripe" data-settings="stripe" data-reveal-for="platform-admin" hidden><h2 class="tds-settings-section__title">${baseLabel("stripe")}</h2>${renderComponent($$result, "StripeSettings", StripeSettings, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/StripeSettings.tsx",
		"client:component-export": "default"
	})}</section>` : null}${showAdminSettings ? renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<section class="tds-settings-section" id="settings-cors" data-settings="cors" data-reveal-for="platform-admin" hidden><h2 class="tds-settings-section__title">${baseLabel("cors")}</h2>${renderComponent($$result, "CorsSettings", CorsSettings, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/CorsSettings.tsx",
		"client:component-export": "default"
	})}</section><section class="tds-settings-section" id="settings-sitemap" data-settings="sitemap" data-reveal-for="platform-admin" hidden><h2 class="tds-settings-section__title">${baseLabel("sitemap")}</h2>${renderComponent($$result, "SitemapSettings", SitemapSettings, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/SitemapSettings.tsx",
		"client:component-export": "default"
	})}</section>` })}` : null}${settings.map((panel) => {
		const Panel = panel.Component;
		return renderTemplate`<section class="tds-settings-section"${addAttribute(`settings-${panel.id}`, "id")}${addAttribute(panel.id, "data-settings")}${addAttribute(panel.permission, "data-reveal-permission")}${addAttribute(panel.permission ? void 0 : "platform-admin", "data-reveal-for")} hidden><h2 class="tds-settings-section__title">${panel.label}</h2>${renderComponent($$result, "Panel", Panel, {})}</section>`;
	})}</div></div></section>` })}${renderScript($$result, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen.astro";
var $$url = "/einstellungen";
// \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/einstellungen@_@astro
var page = () => einstellungen_exports;
export { page };
