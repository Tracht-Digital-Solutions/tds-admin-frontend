import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { _ as FormAlert, a as API_BASE, b as toast, c as fetchMe, h as Avatar, l as frontendFetch, m as LOGIN_URL, o as AUTH_API_URL, t as $$Layout, u as invalidateMe, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/theme/index.js
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
new Set(CHIP_VARIANTS);
var THEME_STORAGE_KEY = "tds-theme";
var THEME_ATTRIBUTE = "data-theme";
var THEME_CHANGE_EVENT = "tds:theme-change";
var DARK_QUERY = "(prefers-color-scheme: dark)";
var hasDocument = () => typeof document !== "undefined";
function systemTheme() {
	try {
		return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function resolveTheme(preference) {
	return preference === "system" ? systemTheme() : preference;
}
function readThemePreference() {
	try {
		const saved = localStorage.getItem(THEME_STORAGE_KEY);
		if (saved === "light" || saved === "dark") return saved;
	} catch {}
	return "system";
}
function applyThemePreference(preference, options = {}) {
	const theme = resolveTheme(preference);
	try {
		if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
		else localStorage.setItem(THEME_STORAGE_KEY, preference);
	} catch {}
	if (hasDocument()) document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
	if (options.announce !== false && typeof window !== "undefined") try {
		const detail = {
			preference,
			theme
		};
		window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail }));
	} catch {}
	return theme;
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/lib/preferences.ts
var PREFERENCES_URL = `${API_BASE}/me/preferences`;
var THEMES = [
	"light",
	"dark",
	"system"
];
var LOCALES = ["de", "en"];
/** Narrow an untrusted payload to the shape we understand. */
function parse(raw) {
	if (typeof raw !== "object" || raw === null) return {};
	const obj = raw;
	const out = {};
	if (typeof obj.theme === "string" && THEMES.includes(obj.theme)) out.theme = obj.theme;
	if (typeof obj.locale === "string" && LOCALES.includes(obj.locale)) out.locale = obj.locale;
	for (const key of ["notify_toast", "notify_email"]) {
		const value = obj[key];
		if (value === "0" || value === "1") out[key] = value;
	}
	return out;
}
/** Read the stored preferences. Resolves to `{}` on any failure — never throws. */
async function loadPreferences() {
	try {
		const res = await frontendFetch(PREFERENCES_URL);
		if (!res.ok) return {};
		return parse((await res.json()).preferences);
	} catch {
		return {};
	}
}
/**
* Persist a partial set of preferences.
*
* Returns the response so the caller can report the status — never `await` this
* and drop the result, which is the single most common defect across these
* repos: a 403 that closes the dialog and reloads the list while nothing
* changed. Resolves to `null` only when the request could not be made at all.
*/
async function savePreferences(values) {
	try {
		return await frontendFetch(PREFERENCES_URL, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ preferences: values })
		});
	} catch {
		return null;
	}
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/ProfileSettings.tsx
var TABS = [
	{
		id: "profil",
		label: "Profil"
	},
	{
		id: "darstellung",
		label: "Darstellung"
	},
	{
		id: "benachrichtigungen",
		label: "Benachrichtigungen"
	},
	{
		id: "sicherheit",
		label: "Sicherheit"
	}
];
var THEME_OPTIONS = [
	{
		value: "light",
		label: "Hell",
		hint: "Immer die helle Oberfläche."
	},
	{
		value: "dark",
		label: "Dunkel",
		hint: "Immer die dunkle Oberfläche."
	},
	{
		value: "system",
		label: "System",
		hint: "Folgt der Einstellung Ihres Geräts."
	}
];
/** Longest edge of a stored avatar. */
var AVATAR_PX = 256;
/** Mirrors AvatarService::MAX_BYTES in tds-auth-api. */
var MAX_UPLOAD_BYTES = 2097152;
/**
* Downscale in the browser before uploading.
*
* The production host has no guaranteed `ext-gd`, so the server validates and
* stores rather than transforms. Doing it here means a 4 MB phone photo becomes
* a ~30 KB square instead of a 413 the user has to solve with an image editor.
* Falls back to the original file if anything about canvas/WebP is unavailable —
* the server still enforces the real limit.
*/
async function downscale(file) {
	try {
		const bitmap = await createImageBitmap(file);
		const side = Math.min(bitmap.width, bitmap.height);
		const canvas = document.createElement("canvas");
		canvas.width = AVATAR_PX;
		canvas.height = AVATAR_PX;
		const ctx = canvas.getContext("2d");
		if (!ctx) return file;
		ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, AVATAR_PX, AVATAR_PX);
		bitmap.close?.();
		return await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", .9)) ?? file;
	} catch {
		return file;
	}
}
function formatDate(value) {
	const date = new Date(value.replace(" ", "T"));
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString("de-DE", {
		dateStyle: "medium",
		timeStyle: "short"
	});
}
function ProfileSettings() {
	const [tab, setTab] = useState("profil");
	const [me, setMe] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [savingProfile, setSavingProfile] = useState(false);
	const [avatarBusy, setAvatarBusy] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState(null);
	const [hasAvatar, setHasAvatar] = useState(false);
	const fileRef = useRef(null);
	const [prefs, setPrefs] = useState({});
	const [theme, setTheme] = useState("system");
	const [prefsUnavailable, setPrefsUnavailable] = useState(false);
	const [sessions, setSessions] = useState([]);
	const [sessionsError, setSessionsError] = useState("");
	useEffect(() => {
		(async () => {
			const principal = await fetchMe();
			if (!principal) {
				setLoadError("Ihr Profil konnte nicht geladen werden.");
				setLoading(false);
				return;
			}
			setMe(principal);
			setDisplayName(principal.displayName ?? "");
			setAvatarUrl(principal.avatarUrl ?? null);
			setHasAvatar(Boolean(principal.hasAvatar));
			setLoading(false);
		})();
		setTheme(readThemePreference());
		loadPreferences().then((stored) => {
			setPrefs(stored);
			if (stored.theme) setTheme(stored.theme);
			setPrefsUnavailable(Object.keys(stored).length === 0);
		});
	}, []);
	const loadSessions = useCallback(async () => {
		try {
			const res = await frontendFetch(`${AUTH_API_URL}/me/sessions`);
			if (!res.ok) {
				setSessionsError(`Sitzungen konnten nicht geladen werden (HTTP ${res.status}).`);
				return;
			}
			const body = await res.json();
			setSessions(Array.isArray(body.sessions) ? body.sessions : []);
			setSessionsError("");
		} catch {
			setSessionsError("Sitzungen konnten nicht geladen werden (keine Verbindung).");
		}
	}, []);
	useEffect(() => {
		if (tab === "sicherheit") loadSessions();
	}, [tab, loadSessions]);
	async function saveProfile(event) {
		event.preventDefault();
		setSavingProfile(true);
		try {
			const res = await frontendFetch(`${AUTH_API_URL}/me`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ displayName: displayName.trim() })
			});
			if (!res.ok) {
				toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
				return;
			}
			invalidateMe();
			toast.success("Profil gespeichert.");
		} catch {
			toast.danger("Speichern fehlgeschlagen (keine Verbindung).");
		} finally {
			setSavingProfile(false);
		}
	}
	async function uploadAvatar(file) {
		setAvatarBusy(true);
		try {
			const blob = await downscale(file);
			if (blob.size > MAX_UPLOAD_BYTES) {
				toast.warning("Das Bild ist zu groß (maximal 2 MB).");
				return;
			}
			const form = new FormData();
			form.append("file", blob, "avatar.webp");
			const res = await frontendFetch(`${AUTH_API_URL}/me/avatar`, {
				method: "POST",
				body: form
			});
			if (!res.ok) {
				toast.danger(`Bild konnte nicht gespeichert werden (HTTP ${res.status}).`);
				return;
			}
			const body = await res.json();
			setAvatarUrl(body.avatarUrl ?? null);
			setHasAvatar(true);
			invalidateMe();
			toast.success("Profilbild aktualisiert.");
		} catch {
			toast.danger("Bild konnte nicht gespeichert werden (keine Verbindung).");
		} finally {
			setAvatarBusy(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	async function removeAvatar() {
		setAvatarBusy(true);
		try {
			const res = await frontendFetch(`${AUTH_API_URL}/me/avatar`, { method: "DELETE" });
			if (!res.ok) {
				toast.danger(`Bild konnte nicht entfernt werden (HTTP ${res.status}).`);
				return;
			}
			setAvatarUrl(null);
			setHasAvatar(false);
			invalidateMe();
			toast.success("Profilbild entfernt.");
		} catch {
			toast.danger("Bild konnte nicht entfernt werden (keine Verbindung).");
		} finally {
			setAvatarBusy(false);
		}
	}
	function pickTheme(next) {
		setTheme(next);
		applyThemePreference(next);
	}
	async function persist(patch, message) {
		const next = {
			...prefs,
			...patch
		};
		setPrefs(next);
		const res = await savePreferences(patch);
		if (res && !res.ok) {
			toast.danger(`${message} fehlgeschlagen (HTTP ${res.status}).`);
			return;
		}
		if (!res) {
			toast.danger(`${message} fehlgeschlagen (keine Verbindung).`);
			return;
		}
		toast.success("Gespeichert.");
	}
	async function revokeSession(jti, current) {
		try {
			const res = await frontendFetch(`${AUTH_API_URL}/me/sessions/${encodeURIComponent(jti)}`, { method: "DELETE" });
			if (!res.ok) {
				toast.danger(`Sitzung konnte nicht beendet werden (HTTP ${res.status}).`);
				return;
			}
			if (current) {
				location.replace(LOGIN_URL);
				return;
			}
			toast.success("Sitzung beendet.");
			loadSessions();
		} catch {
			toast.danger("Sitzung konnte nicht beendet werden (keine Verbindung).");
		}
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "tds-card",
		style: { padding: "1.5rem" },
		children: /* @__PURE__ */ jsx(Spinner, {
			size: "lg",
			tone: "primary"
		})
	});
	if (loadError || !me) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: loadError || "Profil nicht verfügbar."
	});
	const label = me.label ?? me.name ?? me.email;
	const nextParam = encodeURIComponent(typeof location !== "undefined" ? location.href : "");
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				role: "tablist",
				"aria-label": "Bereiche",
				children: TABS.map((t) => /* @__PURE__ */ jsx("button", {
					type: "button",
					role: "tab",
					"aria-selected": tab === t.id,
					className: `chip ${tab === t.id ? "chip--info" : "chip--neutral"}`,
					onClick: () => setTab(t.id),
					children: t.label
				}, t.id))
			}),
			tab === "profil" && /* @__PURE__ */ jsxs("div", {
				className: "tds-card",
				style: { padding: "1.25rem" },
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						style: {
							alignItems: "center",
							gap: "1rem"
						},
						children: [/* @__PURE__ */ jsx(Avatar, {
							name: label,
							src: hasAvatar ? avatarUrl : null,
							seed: me.userId,
							size: "lg",
							decorative: true
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "tds-row",
								style: { gap: "0.5rem" },
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									disabled: avatarBusy,
									onClick: () => fileRef.current?.click(),
									children: avatarBusy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Bild auswählen"
								}), hasAvatar && /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									disabled: avatarBusy,
									onClick: () => void removeAvatar(),
									children: "Entfernen"
								})]
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs",
								style: { color: "var(--color-muted)" },
								children: [
									"PNG, JPEG oder WebP, maximal 2 MB. Das Bild wird vor dem Hochladen automatisch auf ",
									AVATAR_PX,
									"×",
									AVATAR_PX,
									" Pixel verkleinert."
								]
							})]
						})]
					}),
					/* @__PURE__ */ jsx("input", {
						ref: fileRef,
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						hidden: true,
						onChange: (e) => {
							const file = e.target.files?.[0];
							if (file) uploadAvatar(file);
						}
					}),
					/* @__PURE__ */ jsx("hr", {
						className: "tds-dropdown__sep",
						style: { margin: "1.25rem 0" }
					}),
					/* @__PURE__ */ jsxs("form", {
						className: "flex flex-col gap-4",
						onSubmit: saveProfile,
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "flex flex-col gap-1",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-medium",
										children: "Anzeigename"
									}),
									/* @__PURE__ */ jsx("input", {
										className: "field-boxed",
										value: displayName,
										maxLength: 100,
										placeholder: me.name ?? me.email,
										onChange: (e) => setDisplayName(e.target.value)
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "text-xs",
										style: { color: "var(--color-muted)" },
										children: [
											"So werden Sie in der Oberfläche angesprochen. Leer lassen, um „",
											me.name ?? me.email,
											"\" zu verwenden."
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex flex-col gap-1",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-medium",
										children: "Name"
									}),
									/* @__PURE__ */ jsx("input", {
										className: "field-boxed",
										value: me.name ?? "",
										readOnly: true,
										disabled: true
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs",
										style: { color: "var(--color-muted)" },
										children: "Der Name Ihres Kontos. Änderungen nimmt die Benutzerverwaltung vor."
									})
								]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex flex-col gap-1",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-medium",
										children: "E-Mail"
									}),
									/* @__PURE__ */ jsx("input", {
										className: "field-boxed",
										value: me.email,
										readOnly: true,
										disabled: true
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs",
										style: { color: "var(--color-muted)" },
										children: "Ihre Anmeldeadresse. Änderungen nimmt die Benutzerverwaltung vor."
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "tds-toolbar",
								children: /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "btn btn-primary",
									disabled: savingProfile,
									children: savingProfile ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
								})
							})
						]
					})
				]
			}),
			tab === "darstellung" && /* @__PURE__ */ jsxs("div", {
				className: "tds-card",
				style: { padding: "1.25rem" },
				children: [
					prefsUnavailable && /* @__PURE__ */ jsx("p", {
						className: "tds-alert",
						role: "status",
						children: "Einstellungen werden derzeit nur auf diesem Gerät gespeichert."
					}),
					/* @__PURE__ */ jsxs("fieldset", {
						className: "flex flex-col gap-2",
						style: { marginTop: "0.75rem" },
						children: [/* @__PURE__ */ jsx("legend", {
							className: "text-sm font-medium",
							children: "Erscheinungsbild"
						}), THEME_OPTIONS.map((option) => /* @__PURE__ */ jsxs("label", {
							className: "tds-list__row",
							style: { gap: "0.625rem" },
							children: [/* @__PURE__ */ jsx("input", {
								type: "radio",
								name: "theme",
								checked: theme === option.value,
								onChange: () => pickTheme(option.value)
							}), /* @__PURE__ */ jsxs("span", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm",
									children: option.label
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs",
									style: { color: "var(--color-muted)" },
									children: option.hint
								})]
							})]
						}, option.value))]
					}),
					/* @__PURE__ */ jsx("hr", {
						className: "tds-dropdown__sep",
						style: { margin: "1.25rem 0" }
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex flex-col gap-1",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium",
								children: "Sprache"
							}),
							/* @__PURE__ */ jsxs("select", {
								className: "field-boxed",
								value: prefs.locale ?? "de",
								onChange: (e) => void persist({ locale: e.target.value }, "Sprache speichern"),
								children: [/* @__PURE__ */ jsx("option", {
									value: "de",
									children: "Deutsch"
								}), /* @__PURE__ */ jsx("option", {
									value: "en",
									children: "English"
								})]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs",
								style: { color: "var(--color-muted)" },
								children: "Gilt für Hinweise und den Support-Chat. Die Menüs und Seiten der Verwaltung sind derzeit ausschließlich auf Deutsch."
							})
						]
					})
				]
			}),
			tab === "benachrichtigungen" && /* @__PURE__ */ jsx("div", {
				className: "tds-card",
				style: { padding: "1.25rem" },
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "tds-list__row",
						style: { gap: "0.625rem" },
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: (prefs.notify_toast ?? "1") === "1",
							onChange: (e) => void persist({ notify_toast: e.target.checked ? "1" : "0" }, "Einstellung speichern")
						}), /* @__PURE__ */ jsxs("span", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Hinweise in der Oberfläche"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs",
								style: { color: "var(--color-muted)" },
								children: "Kurze Einblendungen, wenn etwas Neues eintrifft."
							})]
						})]
					}), /* @__PURE__ */ jsxs("label", {
						className: "tds-list__row",
						style: { gap: "0.625rem" },
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: (prefs.notify_email ?? "1") === "1",
							onChange: (e) => void persist({ notify_email: e.target.checked ? "1" : "0" }, "Einstellung speichern")
						}), /* @__PURE__ */ jsxs("span", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "E-Mail-Benachrichtigungen"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs",
								style: { color: "var(--color-muted)" },
								children: "Nachrichten zu Vorgängen, die Sie betreffen."
							})]
						})]
					})]
				})
			}),
			tab === "sicherheit" && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "tds-card",
					style: { padding: "1.25rem" },
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-sm font-medium",
							children: "Anmeldung"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs",
							style: {
								color: "var(--color-muted)",
								marginTop: "0.25rem"
							},
							children: "Passwort und Passkeys werden zentral bei der Anmeldung verwaltet."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "tds-toolbar",
							style: { marginTop: "0.75rem" },
							children: [/* @__PURE__ */ jsx("a", {
								className: "btn btn-ghost",
								href: `https://auth.tracht-digital.de/passwort?next=${nextParam}`,
								children: "Passwort ändern"
							}), /* @__PURE__ */ jsx("a", {
								className: "btn btn-ghost",
								href: `https://auth.tracht-digital.de/passkeys?next=${nextParam}`,
								children: "Passkeys verwalten"
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "tds-card",
					style: { padding: "1.25rem" },
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-sm font-medium",
							children: "Aktive Sitzungen"
						}),
						sessionsError && /* @__PURE__ */ jsx(FormAlert, { message: sessionsError }),
						!sessionsError && sessions.length === 0 && /* @__PURE__ */ jsx("p", {
							className: "tds-empty",
							children: "Keine weiteren Sitzungen."
						}),
						sessions.length > 0 && /* @__PURE__ */ jsx("ul", {
							className: "tds-list",
							style: { marginTop: "0.5rem" },
							children: sessions.map((session) => /* @__PURE__ */ jsxs("li", {
								className: "tds-list__row",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-sm",
										children: [
											"Angemeldet seit ",
											formatDate(session.createdAt),
											session.current && /* @__PURE__ */ jsx("span", {
												className: "chip chip--info",
												style: { marginLeft: "0.5rem" },
												children: "Dieses Gerät"
											})
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-xs",
										style: { color: "var(--color-muted)" },
										children: ["Gültig bis ", formatDate(session.expiresAt)]
									})]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => void revokeSession(session.jti, session.current),
									children: session.current ? "Abmelden" : "Beenden"
								})]
							}, session.jti))
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/profil.astro
var profil_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Profil,
	file: () => $$file,
	url: () => $$url
});
var $$Profil = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Profileinstellungen" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Mein Konto</p><h1 class="tds-page__title">Profileinstellungen</h1><p class="tds-page__lede">Ihr Profil, die Darstellung der Oberfläche und die Sicherheit Ihres Kontos.</p></div></div>${renderComponent($$result, "ProfileSettings", ProfileSettings, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/ProfileSettings.tsx",
		"client:component-export": "default"
	})}</section>` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/profil.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/profil.astro";
var $$url = "/profil";
//#endregion
//#region \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/profil@_@astro
var page = () => profil_exports;
//#endregion
export { page };
