import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_LsG8ujsh.mjs";
import "./compiler_D79C1aKC.mjs";
import { B as toast, C as Spinner, K as formatDateTime, M as describeFailureFrom, N as sendJson, W as formatCents, Y as parseEuros, Z as createComponent, t as $$Layout } from "./Layout_Cyo2eFJY.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { n as staleClass, r as useCachedJson, t as invalidate } from "./data_Bg9dC1jF.mjs";
import { useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-ext-opensource/islands/ProjectsScreen.tsx
/** `v1.2.0` and `1.2.0` are the same version. */
function normalizeVersion(version) {
	return (version ?? "").trim().replace(/^v(?=\d)/, "");
}
/** What picking a version from GitHub's list fills in; a typed version changes nothing else. */
function fieldsFromRelease(version, releases) {
	const match = releases.find((r) => r.version === normalizeVersion(version));
	return match ? {
		version_date: match.date,
		download_url: match.url
	} : {};
}
/** What a save did to the public site, in words that are true. */
function cacheMessage(status) {
	switch (status) {
		case "refreshed": return {
			tone: "success",
			text: "Gespeichert. Die Webseite zeigt den neuen Stand."
		};
		case "not_configured": return {
			tone: "info",
			text: "Gespeichert. Die Webseite ist noch nicht gekoppelt und zeigt den neuen Stand erst nach ihrem nächsten Neuaufbau."
		};
		default: return {
			tone: "warning",
			text: "Gespeichert, aber die Webseite hat den Neuaufbau nicht bestätigt. Er lässt sich unten erneut anstoßen."
		};
	}
}
/** `"500,1000"` → `"5,00; 10,00"`, for a field people type euros into. */
function presetsToEuros(csv) {
	return csv.split(",").map((c) => Number(c.trim())).filter((n) => Number.isFinite(n) && n > 0).map((n) => (n / 100).toFixed(2).replace(".", ",")).join("; ");
}
/** `"5; 10,50"` → `"500,1050"`; null when any entry is not an amount. */
function eurosToPresets(text) {
	const parts = text.split(/[;\n]/).map((p) => p.trim()).filter((p) => p !== "");
	const cents = [];
	for (const part of parts) {
		const value = parseEuros(part);
		if (value === null) return null;
		cents.push(Math.round(value));
	}
	return cents.join(",");
}
var STATUS_LABEL = {
	paid: "bezahlt",
	open: "offen",
	expired: "abgelaufen",
	failed: "fehlgeschlagen"
};
var STATUS_CHIP = {
	paid: "chip chip--success",
	open: "chip chip--neutral",
	expired: "chip chip--neutral",
	failed: "chip chip--danger"
};
function ProjectsScreen() {
	const query = useCachedJson("/opensource/admin/projects");
	const donations = useCachedJson("/opensource/admin/donations?status=all&limit=50");
	const [slug, setSlug] = useState(null);
	const [draft, setDraft] = useState(null);
	const [presets, setPresets] = useState("");
	const [notes, setNotes] = useState({
		version: "",
		de: "",
		en: ""
	});
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const [notice, setNotice] = useState(null);
	const projects = query.data?.projects ?? [];
	const selected = projects.find((p) => p.slug === slug) ?? projects[0] ?? null;
	const releasesQuery = useCachedJson(selected ? `/opensource/admin/projects/${selected.slug}/releases` : null);
	const releases = releasesQuery.data?.releases ?? [];
	const shownVersion = normalizeVersion(draft?.version);
	const shownRelease = releases.find((r) => r.version === shownVersion) ?? null;
	useEffect(() => {
		if (selected && draft?.slug !== selected.slug) {
			setDraft({ ...selected });
			setPresets(presetsToEuros(selected.donation_presets));
			setNotice(null);
			setError(null);
		}
	}, [selected, draft?.slug]);
	const notesLoaded = releasesQuery.data !== void 0 && releasesQuery.data !== null;
	const [notesLoadedFor, setNotesLoadedFor] = useState("");
	useEffect(() => {
		const key = `${draft?.slug ?? ""}:${shownVersion}:${notesLoaded}`;
		if (key !== notesLoadedFor) {
			const stored = releasesQuery.data?.notes[shownVersion];
			setNotes({
				version: shownVersion,
				de: stored?.de ?? "",
				en: stored?.en ?? ""
			});
			setNotesLoadedFor(key);
		}
	}, [
		draft?.slug,
		shownVersion,
		notesLoaded,
		notesLoadedFor,
		releasesQuery.data
	]);
	const set = (key, value) => {
		setDraft((d) => d ? {
			...d,
			[key]: value
		} : d);
	};
	const save = async () => {
		if (!draft) return;
		const cents = eurosToPresets(presets);
		if (cents === null) {
			setError("Die Spendenbeträge bitte als Euro-Beträge mit Semikolon trennen, z. B. 5; 10; 25.");
			return;
		}
		setBusy(true);
		setError(null);
		setNotice(null);
		try {
			const res = await sendJson(`/opensource/admin/projects/${draft.slug}`, "PUT", {
				...draft,
				donation_presets: cents,
				...notesLoaded && notes.version !== "" ? {
					notes_version: notes.version,
					notes_de: notes.de,
					notes_en: notes.en
				} : {}
			});
			if (!res.ok) {
				setError(await describeFailureFrom(res, "Speichern fehlgeschlagen"));
				return;
			}
			const body = await res.json();
			setDraft({ ...body.project });
			setPresets(presetsToEuros(body.project.donation_presets));
			setNotice(cacheMessage(body.cache?.cache_status));
			invalidate("/opensource/");
		} catch (err) {
			setError(await describeFailureFrom(null, "Speichern fehlgeschlagen"));
			console.error(err);
		} finally {
			setBusy(false);
		}
	};
	const syncNow = async () => {
		if (!draft) return;
		setBusy(true);
		setError(null);
		setNotice(null);
		try {
			const res = await sendJson(`/opensource/admin/projects/${draft.slug}/releases/sync`, "POST", {});
			if (!res.ok) {
				setError(await describeFailureFrom(res, "GitHub konnte nicht abgerufen werden"));
				return;
			}
			const body = await res.json();
			setDraft((d) => d ? {
				...d,
				...body.project
			} : d);
			setNotice(body.changed ? cacheMessage(body.cache?.cache_status) : {
				tone: "info",
				text: "Keine Änderung: Die Webseite zeigt schon diesen Stand."
			});
			invalidate("/opensource/");
		} catch {
			toast.danger("GitHub konnte nicht abgerufen werden.");
		} finally {
			setBusy(false);
		}
	};
	const rebuild = async () => {
		if (!draft) return;
		setBusy(true);
		try {
			const res = await sendJson(`/opensource/admin/projects/${draft.slug}/cache/rebuild`, "POST", {});
			const body = await res.json().catch(() => ({}));
			setNotice(cacheMessage(body.cache?.cache_status ?? (res.ok ? "refreshed" : "failed")));
		} catch {
			toast.danger("Die Webseite war nicht erreichbar.");
		} finally {
			setBusy(false);
		}
	};
	if (query.loading) return /* @__PURE__ */ jsxs("p", {
		"aria-busy": "true",
		children: [/* @__PURE__ */ jsx(Spinner, {}), " Projekte werden geladen …"]
	});
	if (!query.data) return /* @__PURE__ */ jsx(Alert, {
		tone: "danger",
		children: "Die Projekte konnten nicht geladen werden."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: staleClass(query.stale, "tds-stack tds-stack--loose"),
		"aria-busy": query.stale,
		children: [
			query.error && query.data ? /* @__PURE__ */ jsx(Alert, {
				tone: "warning",
				children: "Ältere Daten: die Aktualisierung ist fehlgeschlagen."
			}) : null,
			!query.data.paymentsReady ? /* @__PURE__ */ jsx(Alert, {
				tone: "info",
				children: "Stripe ist noch nicht eingerichtet (Einstellungen → Zahlungen). Bis dahin zeigen die Webseiten keinen Spendenknopf."
			}) : null,
			query.data.paymentsReady && !query.data.webhookReady ? /* @__PURE__ */ jsx(Alert, {
				tone: "warning",
				children: "Das Webhook-Geheimnis für Spenden fehlt. Spenden gehen ein, erscheinen hier aber nicht als bezahlt."
			}) : null,
			projects.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch kein Projekt angelegt."
			}) : /* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsxs("label", {
					className: "tds-field-row",
					children: [/* @__PURE__ */ jsx("span", { children: "Projekt" }), /* @__PURE__ */ jsx("select", {
						className: "field-boxed",
						value: selected?.slug ?? "",
						onChange: (e) => setSlug(e.target.value),
						children: projects.map((p) => /* @__PURE__ */ jsx("option", {
							value: p.slug,
							children: p.name
						}, p.slug))
					})]
				})
			}),
			draft ? /* @__PURE__ */ jsxs("form", {
				className: "tds-card p-4 tds-stack",
				onSubmit: (e) => {
					e.preventDefault();
					save();
				},
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold",
						children: draft.name
					}),
					draft.site_url ? /* @__PURE__ */ jsxs("p", {
						className: "marginalia",
						children: ["Webseite: ", /* @__PURE__ */ jsx("a", {
							className: "link-underline",
							href: draft.site_url,
							children: draft.site_url
						})]
					}) : null,
					/* @__PURE__ */ jsx("h3", {
						className: "font-semibold",
						children: "Version auf der Webseite"
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Anzeige" }), /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: draft.release_mode,
							onChange: (e) => set("release_mode", e.target.value),
							children: [/* @__PURE__ */ jsx("option", {
								value: "auto",
								children: "Automatisch: neuester öffentlicher GitHub-Release"
							}), /* @__PURE__ */ jsx("option", {
								value: "manual",
								children: "Manuell: Version selbst festlegen"
							})]
						})]
					}),
					draft.release_mode === "auto" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("p", {
						className: "marginalia",
						children: [
							"Aktuell: ",
							draft.version ?? "noch keine Version",
							draft.version_date ? ` vom ${draft.version_date}` : "",
							". Vorabversionen zählen mit, Entwürfe nicht. Die Webseite übernimmt einen neuen Release spätestens am nächsten Tag, mit GitHub-Webhook sofort."
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "tds-toolbar",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							disabled: busy,
							onClick: () => void syncNow(),
							children: "Jetzt bei GitHub abrufen"
						})
					})] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
						/* @__PURE__ */ jsxs("label", {
							className: "tds-field-row",
							children: [
								/* @__PURE__ */ jsx("span", { children: "Version" }),
								/* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									list: "opensource-releases",
									value: draft.version ?? "",
									placeholder: "0.4.0-alpha",
									onChange: (e) => {
										const version = e.target.value;
										setDraft((d) => d ? {
											...d,
											version,
											...fieldsFromRelease(version, releases)
										} : d);
									}
								}),
								/* @__PURE__ */ jsx("datalist", {
									id: "opensource-releases",
									children: releases.map((r) => /* @__PURE__ */ jsx("option", {
										value: r.version,
										children: r.date ?? ""
									}, r.version))
								})
							]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "tds-field-row",
							children: [/* @__PURE__ */ jsx("span", { children: "Veröffentlicht am" }), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "date",
								value: draft.version_date ?? "",
								onChange: (e) => set("version_date", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "tds-field-row",
							children: [/* @__PURE__ */ jsx("span", { children: "Download" }), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "url",
								value: draft.download_url ?? "",
								onChange: (e) => set("download_url", e.target.value)
							})]
						})
					] }),
					draft.release_error ? /* @__PURE__ */ jsxs(Alert, {
						tone: "warning",
						children: ["GitHub: ", draft.release_error]
					}) : null,
					releasesQuery.data?.error ? /* @__PURE__ */ jsxs(Alert, {
						tone: "warning",
						children: ["GitHub: ", releasesQuery.data.error]
					}) : null,
					/* @__PURE__ */ jsxs("h3", {
						className: "font-semibold",
						children: ["Release-Notes", shownVersion ? ` für ${shownVersion}` : ""]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Die Webseite zeigt immer die Notes der angezeigten Version. Ein leeres Feld nimmt den Text von GitHub, der meist englisch ist. Markdown ist erlaubt: Listen, **fett**, Links."
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Deutsch" }), /* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							rows: 6,
							maxLength: 2e4,
							value: notes.de,
							disabled: !notesLoaded,
							onChange: (e) => setNotes((n) => ({
								...n,
								de: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Englisch" }), /* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							rows: 6,
							maxLength: 2e4,
							value: notes.en,
							disabled: !notesLoaded,
							onChange: (e) => setNotes((n) => ({
								...n,
								en: e.target.value
							}))
						})]
					}),
					shownRelease?.body ? /* @__PURE__ */ jsxs("details", { children: [
						/* @__PURE__ */ jsx("summary", {
							className: "marginalia",
							children: "Text von GitHub ansehen"
						}),
						/* @__PURE__ */ jsx("pre", {
							className: "marginalia whitespace-pre-wrap",
							children: shownRelease.body
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setNotes((n) => ({
								...n,
								de: n.de || shownRelease.body,
								en: n.en || shownRelease.body
							})),
							children: "In leere Felder übernehmen"
						})
					] }) : null,
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Stand (Deutsch)" }), /* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							rows: 2,
							maxLength: 400,
							value: draft.status_de ?? "",
							onChange: (e) => set("status_de", e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Stand (Englisch)" }), /* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							rows: 2,
							maxLength: 400,
							value: draft.status_en ?? "",
							onChange: (e) => set("status_en", e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Quellcode" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "url",
							required: true,
							value: draft.repo_url,
							onChange: (e) => set("repo_url", e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Spiegel" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "url",
							value: draft.mirror_url ?? "",
							onChange: (e) => set("mirror_url", e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Lizenz (SPDX)" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: draft.license,
							onChange: (e) => set("license", e.target.value)
						})]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "font-semibold",
						children: "Spenden"
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-toggle-row",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: draft.donations_enabled,
							onChange: (e) => set("donations_enabled", e.target.checked)
						}), /* @__PURE__ */ jsx("span", { children: "Spenden annehmen" })]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: [/* @__PURE__ */ jsx("span", { children: "Vorschläge in Euro" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: presets,
							onChange: (e) => setPresets(e.target.value),
							placeholder: "5; 10; 25"
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "marginalia",
						children: [
							"Freie Beträge zwischen ",
							formatCents(draft.donation_min, { currency: draft.currency }),
							" und",
							" ",
							formatCents(draft.donation_max, { currency: draft.currency }),
							"."
						]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-toggle-row",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: draft.published,
							onChange: (e) => set("published", e.target.checked)
						}), /* @__PURE__ */ jsx("span", { children: "Veröffentlicht (die Webseite liest das Projekt)" })]
					}),
					/* @__PURE__ */ jsx(Alert, {
						tone: "danger",
						children: error
					}),
					notice ? /* @__PURE__ */ jsx(Alert, {
						tone: notice.tone,
						children: notice.text
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn btn-primary",
							disabled: busy,
							children: busy ? "Wird gespeichert …" : "Speichern"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							disabled: busy,
							onClick: () => void rebuild(),
							children: "Webseite neu aufbauen"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ jsxs("section", {
				className: "tds-card p-4 tds-stack",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold",
						children: "Spenden"
					}),
					donations.data?.summary.length ? /* @__PURE__ */ jsx("ul", {
						className: "tds-list",
						children: donations.data.summary.map((s) => /* @__PURE__ */ jsxs("li", {
							className: "tds-list__row",
							children: [/* @__PURE__ */ jsx("span", {
								className: "tabular-nums",
								children: formatCents(s.total, { currency: s.currency })
							}), /* @__PURE__ */ jsxs("span", {
								className: "marginalia",
								children: [
									s.count,
									" Spenden · ",
									formatCents(s.last30, { currency: s.currency }),
									" in den letzten 30 Tagen"
								]
							})]
						}, s.currency))
					}) : null,
					donations.loading ? /* @__PURE__ */ jsxs("p", {
						"aria-busy": "true",
						children: [/* @__PURE__ */ jsx(Spinner, {}), " Spenden werden geladen …"]
					}) : donations.data && donations.data.donations.length > 0 ? /* @__PURE__ */ jsxs("table", {
						className: "tds-table",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Datum"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Projekt"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Betrag"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Status"
							})
						] }) }), /* @__PURE__ */ jsx("tbody", { children: donations.data.donations.map((d) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", { children: formatDateTime(d.paid_at ?? d.created_at) }),
							/* @__PURE__ */ jsx("td", { children: d.project ?? "—" }),
							/* @__PURE__ */ jsx("td", {
								className: "tabular-nums",
								children: formatCents(d.amount, { currency: d.currency })
							}),
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
								className: STATUS_CHIP[d.status] ?? "chip chip--neutral",
								children: STATUS_LABEL[d.status] ?? d.status
							}) })
						] }, d.id)) })]
					}) : donations.data ? /* @__PURE__ */ jsx("p", {
						className: "tds-empty",
						children: "Noch keine Spenden."
					}) : /* @__PURE__ */ jsx(Alert, {
						tone: "warning",
						children: "Die Spenden konnten nicht geladen werden."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Ohne Namen und E-Mail: wer gespendet hat, steht nur in Stripe."
					})
				]
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-opensource/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Open Source</h1><p class="tds-page__lede">Projekte mit eigener Webseite. Hier stehen Version, Download und Spenden; die Texte liegen in der jeweiligen Site.</p></div>${renderComponent($$result, "ProjectsScreen", ProjectsScreen, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-opensource/islands/ProjectsScreen.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-opensource/pages/Index.astro", void 0);
// node_modules/.tds-frontend/routes/open_source.astro
var open_source_exports = /* @__PURE__ */ __exportAll({
	default: () => $$OpenSource,
	file: () => $$file,
	url: () => void 0
});
var $$OpenSource = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Open Source" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/open_source.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/open_source.astro";
// \0virtual:astro:page:node_modules/.tds-frontend/routes/open_source@_@astro
var page = () => open_source_exports;
export { page };
