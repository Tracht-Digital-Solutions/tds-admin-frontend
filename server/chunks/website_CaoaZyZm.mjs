import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { n as apiUrl, t as apiFetch } from "./api_sTTHNFo-.mjs";
import { n as staleClass, r as useCachedJson, t as invalidate } from "./data_CxFkYAe0.mjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/LegalDocs.tsx
var api$1 = apiFetch;
/** The documents a site is expected to carry, so the editor is not a blank slate. */
var KNOWN_KEYS = [{
	key: "agb",
	label: "AGB"
}];
var LANGS = ["de", "en"];
var formatSize = (bytes) => bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
/**
* Legal-document manager for one site — the upload surface behind the
* landingpage's AGB page.
*
* The uploaded PDF is the source of truth. The public landingpage reads it
* while rendering the legal route, and the targeted page-cache event replaces
* only that language's preview/download pages.
*/
function LegalDocs({ siteKey }) {
	const docsPath = `/cms/sites/${siteKey}/legal`;
	const docsQuery = useCachedJson(docsPath);
	const docs = docsQuery.data?.docs ?? [];
	const docsVisiblyStale = docsQuery.stale || docsQuery.error !== null && docsQuery.data !== void 0;
	const [docKey, setDocKey] = useState("agb");
	const [lang, setLang] = useState("de");
	const [versionLabel, setVersionLabel] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const fileRef = useRef(null);
	const upload = async () => {
		const file = fileRef.current?.files?.[0];
		if (!file) {
			setError("Bitte eine PDF-Datei auswählen.");
			return;
		}
		if (!/^[a-z0-9-]{2,64}$/.test(docKey)) {
			setError("Dokument-Schlüssel: 2–64 Zeichen, nur a–z, 0–9 und Bindestrich.");
			return;
		}
		setError(null);
		setBusy(true);
		const body = new FormData();
		body.append("file", file);
		body.append("lang", lang);
		body.append("version_label", versionLabel.trim());
		let res;
		try {
			res = await api$1(`/cms/sites/${siteKey}/legal/${docKey}`, {
				method: "POST",
				body
			});
		} catch {
			setBusy(false);
			toast.danger("Upload fehlgeschlagen (Netzwerkfehler).");
			return;
		}
		setBusy(false);
		if (res.ok) {
			if (fileRef.current) fileRef.current.value = "";
			const result = await res.json().catch(() => ({}));
			toast.success(result.cached === true ? "Dokument hochgeladen. Cache-Neubau für die betroffenen Seiten wurde angestoßen." : "Dokument hochgeladen. Der Seiten-Cache konnte nicht angestoßen werden.");
			invalidate(docsPath);
			return;
		}
		if (res.status === 415) setError("Nur PDF-Dateien werden akzeptiert.");
		else if (res.status === 413) setError("Die Datei ist größer als 8 MB.");
		else toast.danger(`Upload fehlgeschlagen (HTTP ${res.status}).`);
	};
	const remove = async (doc) => {
		let res;
		try {
			res = await api$1(`/cms/sites/${siteKey}/legal/${doc.docKey}?lang=${doc.lang}`, { method: "DELETE" });
		} catch {
			toast.danger("Entfernen fehlgeschlagen (Netzwerkfehler).");
			return;
		}
		if (res.ok) {
			const result = await res.json().catch(() => ({}));
			toast.success(result.cached === true ? "Dokument entfernt. Cache-Neubau für die betroffenen Seiten wurde angestoßen." : "Dokument entfernt. Der Seiten-Cache konnte nicht angestoßen werden.");
			invalidate(docsPath);
		} else toast.danger(`Entfernen fehlgeschlagen (HTTP ${res.status}).`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "cms-editor__legal",
		children: [
			/* @__PURE__ */ jsx("h3", { children: "Rechtsdokumente (PDF)" }),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Hochgeladene PDFs — z. B. die AGB — werden von der öffentlichen Website als Vorschau und Download eingebunden. Nach dem Speichern werden nur die betroffenen Seiten dieser Sprache neu gerendert. Pro Sprache eine Datei; maximal 8 MB."
			}),
			docsQuery.error ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Dokumente konnten nicht aktualisiert werden (",
					docsQuery.error.message,
					").",
					docs.length > 0 ? " Die angezeigten Daten sind möglicherweise veraltet." : ""
				]
			}) : null,
			docsQuery.loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : docs.length === 0 && !docsQuery.error ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch keine Dokumente hochgeladen."
			}) : docs.length > 0 ? /* @__PURE__ */ jsxs("table", {
				className: staleClass(docsVisiblyStale, "tds-table"),
				"aria-busy": docsVisiblyStale,
				tabIndex: 0,
				role: "region",
				"aria-label": "Hochgeladene Rechtsdokumente",
				children: [
					/* @__PURE__ */ jsx("caption", {
						className: "sr-only",
						children: "Hochgeladene Rechtsdokumente"
					}),
					/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Dokument"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Sprache"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Datei"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Stand"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Aktion"
						})
					] }) }),
					/* @__PURE__ */ jsx("tbody", { children: docs.map((d) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("code", { children: d.docKey }) }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
							className: "chip chip--neutral",
							children: d.lang
						}) }),
						/* @__PURE__ */ jsxs("td", { children: [
							d.filename,
							" ",
							/* @__PURE__ */ jsxs("span", {
								className: "marginalia",
								children: [
									"(",
									formatSize(d.sizeBytes),
									")"
								]
							})
						] }),
						/* @__PURE__ */ jsx("td", { children: d.versionLabel ?? "—" }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
							className: "tds-toolbar",
							children: [/* @__PURE__ */ jsx("a", {
								className: "btn btn-ghost",
								href: apiUrl(`/cms/sites/${siteKey}/legal/${d.docKey}/file?lang=${d.lang}`),
								target: "_blank",
								rel: "noopener noreferrer",
								children: "Ansehen"
							}), /* @__PURE__ */ jsx("button", {
								className: "btn btn-ghost",
								type: "button",
								onClick: () => remove(d),
								children: "Entfernen"
							})]
						}) })
					] }, `${d.docKey}-${d.lang}`)) })
				]
			}) : null,
			/* @__PURE__ */ jsxs("form", {
				className: "tds-stack",
				onSubmit: (e) => {
					e.preventDefault();
					upload();
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						children: [
							/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
								className: "marginalia",
								children: "Dokument"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								list: "cms-legal-keys",
								value: docKey,
								onChange: (e) => setDocKey(e.target.value.toLowerCase()),
								placeholder: "agb",
								required: true
							})] }),
							/* @__PURE__ */ jsx("datalist", {
								id: "cms-legal-keys",
								children: KNOWN_KEYS.map((k) => /* @__PURE__ */ jsx("option", {
									value: k.key,
									children: k.label
								}, k.key))
							}),
							/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
								className: "marginalia",
								children: "Sprache"
							}), /* @__PURE__ */ jsx("select", {
								className: "field-boxed",
								value: lang,
								onChange: (e) => setLang(e.target.value),
								children: LANGS.map((l) => /* @__PURE__ */ jsx("option", {
									value: l,
									children: l
								}, l))
							})] }),
							/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
								className: "marginalia",
								children: "Stand (optional)"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: versionLabel,
								onChange: (e) => setVersionLabel(e.target.value),
								placeholder: "Stand: 09/2025"
							})] })
						]
					}),
					/* @__PURE__ */ jsx("input", {
						ref: fileRef,
						type: "file",
						accept: "application/pdf,.pdf",
						"aria-label": "PDF-Datei"
					}),
					error ? /* @__PURE__ */ jsx("p", {
						className: "tds-alert tds-alert--danger",
						role: "alert",
						children: error
					}) : null,
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "submit",
						disabled: busy,
						children: busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Hochladen"
					})
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/sections.ts
/**
* Stable content-block keys for the six landing-page services.
*
* The public site owns service IDs, slugs and route lookup. Keeping those
* values out of the editable schema means an editorial change can never break
* a public URL; only visitor-facing copy belongs in these blocks.
*/
var SERVICE_SECTION_KEYS = [
	"service_consulting",
	"service_process",
	"service_solutions",
	"service_custom_development",
	"service_web_presence",
	"service_complete_it"
];
/** Every service page has the same deliberately shallow editing contract. */
function serviceDetailSchema() {
	return [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "title",
			label: "Leistungsname",
			type: "text"
		},
		{
			key: "summary",
			label: "Kurzbeschreibung",
			type: "textarea"
		},
		{
			key: "intro",
			label: "Einleitung",
			type: "textarea"
		},
		{
			key: "situationsTitle",
			label: "Ausgangslagen – Überschrift",
			type: "text"
		},
		{
			key: "situations",
			label: "Typische Ausgangslagen",
			type: "stringlist",
			itemLabel: "Ausgangslage"
		},
		{
			key: "responsibilitiesTitle",
			label: "Leistungsumfang – Überschrift",
			type: "text"
		},
		{
			key: "responsibilities",
			label: "Was übernommen wird",
			type: "stringlist",
			itemLabel: "Aufgabe"
		},
		{
			key: "outcomesTitle",
			label: "Ergebnisse – Überschrift",
			type: "text"
		},
		{
			key: "outcomes",
			label: "Erwartbare Ergebnisse",
			type: "stringlist",
			itemLabel: "Ergebnis"
		},
		{
			key: "boundariesTitle",
			label: "Abgrenzung – Überschrift",
			type: "text"
		},
		{
			key: "boundaries",
			label: "Abgrenzungen und Grenzen",
			type: "stringlist",
			itemLabel: "Abgrenzung"
		},
		{
			key: "processTitle",
			label: "Vorgehen – Überschrift",
			type: "text"
		},
		{
			key: "process",
			label: "Vorgehen",
			type: "stringlist",
			itemLabel: "Schritt"
		},
		{
			key: "priceLabel",
			label: "Preis-Label",
			type: "text"
		},
		{
			key: "priceText",
			label: "Preiserklärung",
			type: "textarea"
		},
		{
			key: "referencesLabel",
			label: "Referenzen – Label",
			type: "text"
		},
		{
			key: "referencesHeadline",
			label: "Referenzen – Überschrift",
			type: "text"
		},
		{
			key: "references",
			label: "Anonymisierte Referenzen",
			type: "list",
			itemLabel: "Referenz",
			itemFields: [
				{
					key: "title",
					label: "Neutraler Titel",
					type: "text"
				},
				{
					key: "context",
					label: "Branche oder Unternehmenskontext",
					type: "textarea"
				},
				{
					key: "challenge",
					label: "Ausgangslage",
					type: "textarea"
				},
				{
					key: "solution",
					label: "Lösungsweg",
					type: "textarea"
				},
				{
					key: "result",
					label: "Ergebnis",
					type: "textarea"
				},
				{
					key: "metric",
					label: "Belegbare Kennzahl (optional)",
					type: "text"
				}
			]
		},
		{
			key: "ctaTitle",
			label: "CTA – Überschrift",
			type: "text"
		},
		{
			key: "ctaText",
			label: "CTA – Text",
			type: "textarea"
		},
		{
			key: "ctaButton",
			label: "CTA – Button",
			type: "text"
		}
	];
}
/** FAQ v2 changes its content namespace, not the editor contract. */
function faqSchema() {
	return [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "items",
			label: "Fragen",
			type: "list",
			itemLabel: "Frage",
			itemFields: [{
				key: "q",
				label: "Frage",
				type: "text"
			}, {
				key: "a",
				label: "Antwort",
				type: "textarea"
			}]
		}
	];
}
var SECTION_SCHEMAS = {
	home_hero: [
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "headlineSuffix",
			label: "Überschrift (Suffix)",
			type: "text"
		},
		{
			key: "sub",
			label: "Untertext",
			type: "textarea"
		},
		{
			key: "cta1",
			label: "Button 1",
			type: "text"
		},
		{
			key: "cta2",
			label: "Button 2",
			type: "text"
		},
		{
			key: "scrollHint",
			label: "Scroll-Hinweis",
			type: "text"
		}
	],
	why_me: [
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "lead",
			label: "Lead",
			type: "textarea"
		},
		{
			key: "p1",
			label: "Absatz 1",
			type: "textarea"
		},
		{
			key: "p2",
			label: "Absatz 2",
			type: "textarea"
		},
		{
			key: "reasons",
			label: "Gründe",
			type: "list",
			itemLabel: "Grund",
			itemFields: [{
				key: "title",
				label: "Titel",
				type: "text"
			}, {
				key: "description",
				label: "Beschreibung",
				type: "textarea"
			}]
		}
	],
	services_overview: [
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "intro",
			label: "Einleitung",
			type: "textarea"
		}
	],
	digital_responsibility: [
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "body",
			label: "Text",
			type: "textarea"
		},
		{
			key: "points",
			label: "Verantwortungsbereiche",
			type: "stringlist",
			itemLabel: "Punkt"
		},
		{
			key: "primaryCta",
			label: "Button (primär)",
			type: "text"
		},
		{
			key: "secondaryCta",
			label: "Button (sekundär)",
			type: "text"
		}
	],
	hero: [
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "headlineSuffix",
			label: "Überschrift (Suffix)",
			type: "text"
		},
		{
			key: "tagline",
			label: "Tagline",
			type: "text"
		},
		{
			key: "sub",
			label: "Untertext",
			type: "textarea"
		},
		{
			key: "cta1",
			label: "Button 1",
			type: "text"
		},
		{
			key: "cta2",
			label: "Button 2",
			type: "text"
		},
		{
			key: "scrollHint",
			label: "Scroll-Hinweis",
			type: "text"
		}
	],
	about: [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "lead",
			label: "Lead",
			type: "textarea"
		},
		{
			key: "p1",
			label: "Absatz 1",
			type: "textarea"
		},
		{
			key: "p2",
			label: "Absatz 2",
			type: "textarea"
		},
		{
			key: "stat1Value",
			label: "Statistik 1 – Wert",
			type: "text"
		},
		{
			key: "stat1Label",
			label: "Statistik 1 – Label",
			type: "text"
		},
		{
			key: "stat2Value",
			label: "Statistik 2 – Wert",
			type: "text"
		},
		{
			key: "stat2Label",
			label: "Statistik 2 – Label",
			type: "text"
		},
		{
			key: "stat3Value",
			label: "Statistik 3 – Wert",
			type: "text"
		},
		{
			key: "stat3Label",
			label: "Statistik 3 – Label",
			type: "text"
		}
	],
	services: [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "items",
			label: "Leistungen",
			type: "list",
			itemLabel: "Leistung",
			itemFields: [
				{
					key: "number",
					label: "Nummer",
					type: "text"
				},
				{
					key: "title",
					label: "Titel",
					type: "text"
				},
				{
					key: "description",
					label: "Beschreibung",
					type: "textarea"
				}
			]
		}
	],
	service_consulting: serviceDetailSchema(),
	service_process: serviceDetailSchema(),
	service_solutions: serviceDetailSchema(),
	service_custom_development: serviceDetailSchema(),
	service_web_presence: serviceDetailSchema(),
	service_complete_it: serviceDetailSchema(),
	faq: faqSchema(),
	faq_v2: faqSchema(),
	contact: [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "sub",
			label: "Untertext",
			type: "textarea"
		},
		{
			key: "email",
			label: "E-Mail",
			type: "text"
		},
		{
			key: "phone",
			label: "Telefon",
			type: "text"
		},
		{
			key: "location",
			label: "Ort",
			type: "text"
		}
	],
	process: [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "body",
			label: "Text",
			type: "textarea"
		},
		{
			key: "steps",
			label: "Schritte",
			type: "list",
			itemLabel: "Schritt",
			itemFields: [
				{
					key: "number",
					label: "Nummer",
					type: "text"
				},
				{
					key: "title",
					label: "Titel",
					type: "text"
				},
				{
					key: "duration",
					label: "Dauer",
					type: "text"
				},
				{
					key: "description",
					label: "Beschreibung",
					type: "textarea"
				},
				{
					key: "detail",
					label: "Detail",
					type: "textarea"
				},
				{
					key: "outcome",
					label: "Ergebnis",
					type: "textarea"
				}
			]
		}
	],
	consulting: [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "body",
			label: "Text",
			type: "textarea"
		},
		{
			key: "primaryCta",
			label: "Button (primär)",
			type: "text"
		},
		{
			key: "secondaryCta",
			label: "Button (sekundär)",
			type: "text"
		}
	],
	journal: [{
		key: "slugs",
		label: "Ausgewählte Blogbeiträge",
		type: "stringlist",
		itemLabel: "Slug"
	}],
	cookie_banner: [{
		key: "enabled",
		label: "Cookie-Hinweis anzeigen",
		type: "checkbox"
	}],
	footer: [
		{
			key: "slogan",
			label: "Slogan",
			type: "text"
		},
		{
			key: "tagline",
			label: "Tagline",
			type: "text"
		},
		{
			key: "nav",
			label: "Navigation-Titel",
			type: "text"
		},
		{
			key: "contactTitle",
			label: "Kontakt-Titel",
			type: "text"
		},
		{
			key: "copyright",
			label: "Copyright",
			type: "text"
		},
		{
			key: "impressum",
			label: "Impressum-Label",
			type: "text"
		},
		{
			key: "datenschutz",
			label: "Datenschutz-Label",
			type: "text"
		},
		{
			key: "pricing",
			label: "Preise-Label",
			type: "text"
		}
	],
	pricing: [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "sub",
			label: "Untertext",
			type: "textarea"
		},
		{
			key: "teaserLabel",
			label: "Teaser-Label",
			type: "text"
		},
		{
			key: "teaserHeadline",
			label: "Teaser-Überschrift",
			type: "text"
		},
		{
			key: "teaserHeadlineAccent",
			label: "Teaser-Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "teaserSub",
			label: "Teaser-Untertext",
			type: "textarea"
		},
		{
			key: "teaserCta",
			label: "Teaser-Button",
			type: "text"
		},
		{
			key: "teaserFromLabel",
			label: "„ab“-Label",
			type: "text"
		},
		{
			key: "hourSuffix",
			label: "Stunden-Suffix",
			type: "text"
		},
		{
			key: "includesLabel",
			label: "„Beinhaltet“-Label",
			type: "text"
		},
		{
			key: "items",
			label: "Pakete",
			type: "list",
			itemLabel: "Paket",
			itemFields: [
				{
					key: "title",
					label: "Titel",
					type: "text"
				},
				{
					key: "rate",
					label: "Stundensatz (€)",
					type: "number"
				},
				{
					key: "description",
					label: "Beschreibung",
					type: "textarea"
				},
				{
					key: "includes",
					label: "Beinhaltet",
					type: "stringlist",
					itemLabel: "Punkt"
				},
				{
					key: "highlight",
					label: "Hervorheben",
					type: "checkbox"
				}
			]
		},
		{
			key: "notesTitle",
			label: "Hinweise-Titel",
			type: "text"
		},
		{
			key: "notes",
			label: "Hinweise",
			type: "stringlist",
			itemLabel: "Hinweis"
		},
		{
			key: "ctaTitle",
			label: "CTA-Titel",
			type: "text"
		},
		{
			key: "ctaSub",
			label: "CTA-Untertext",
			type: "textarea"
		},
		{
			key: "ctaButton",
			label: "CTA-Button",
			type: "text"
		},
		{
			key: "back",
			label: "Zurück-Label",
			type: "text"
		}
	],
	pricing_services: [
		{
			key: "label",
			label: "Label",
			type: "text"
		},
		{
			key: "headline",
			label: "Überschrift",
			type: "text"
		},
		{
			key: "headlineAccent",
			label: "Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "sub",
			label: "Untertext",
			type: "textarea"
		},
		{
			key: "teaserHeadline",
			label: "Teaser-Überschrift",
			type: "text"
		},
		{
			key: "teaserHeadlineAccent",
			label: "Teaser-Überschrift (Akzent)",
			type: "text"
		},
		{
			key: "teaserSub",
			label: "Teaser-Untertext",
			type: "textarea"
		},
		{
			key: "teaserCta",
			label: "Teaser-Button",
			type: "text"
		},
		{
			key: "teaserFromLabel",
			label: "„ab“-Label",
			type: "text"
		},
		{
			key: "hourSuffix",
			label: "Stunden-Suffix",
			type: "text"
		},
		{
			key: "customRateLabel",
			label: "Individueller Preis – Label",
			type: "text"
		},
		{
			key: "includesLabel",
			label: "„Beinhaltet“-Label",
			type: "text"
		},
		{
			key: "rateConsulting",
			label: "Beratung & Konzeption – Stundensatz (€)",
			type: "number"
		},
		{
			key: "rateProcess",
			label: "Prozessoptimierung – Stundensatz (€)",
			type: "number"
		},
		{
			key: "rateSolutions",
			label: "Individuelle Lösungen – Stundensatz (€)",
			type: "number"
		},
		{
			key: "rateCustomDevelopment",
			label: "Auftragsprogrammierung – Stundensatz (€)",
			type: "number"
		},
		{
			key: "rateWebPresence",
			label: "Webauftritt – Stundensatz (€)",
			type: "number"
		},
		{
			key: "notesTitle",
			label: "Hinweise-Titel",
			type: "text"
		},
		{
			key: "notes",
			label: "Hinweise",
			type: "stringlist",
			itemLabel: "Hinweis"
		},
		{
			key: "ctaTitle",
			label: "CTA-Titel",
			type: "text"
		},
		{
			key: "ctaSub",
			label: "CTA-Untertext",
			type: "textarea"
		},
		{
			key: "ctaButton",
			label: "CTA-Button",
			type: "text"
		},
		{
			key: "back",
			label: "Zurück-Label",
			type: "text"
		}
	],
	legal_impressum: [{
		key: "markdown",
		label: "Impressum (Markdown)",
		type: "textarea"
	}],
	legal_datenschutz: [{
		key: "markdown",
		label: "Datenschutzerklärung (Markdown)",
		type: "textarea"
	}]
};
/**
* German names for the section keys.
*
* The key itself is shown alongside, not replaced by, the label: it is what the
* API, the cache event and every log line call the thing, so hiding it would
* make a support conversation impossible.
*/
var SECTION_LABELS = {
	home_hero: "Startseite: Titelbereich",
	why_me: "Wieso ich?",
	services_overview: "Was ich anbiete?",
	digital_responsibility: "Digitalisierungsverantwortung",
	hero: "Titelbereich",
	about: "Über mich",
	services: "Leistungen",
	service_consulting: "Leistung: Beratung & Konzeption",
	service_process: "Leistung: Prozessoptimierung",
	service_solutions: "Leistung: Individuelle Lösungen",
	service_custom_development: "Leistung: Auftragsprogrammierung",
	service_web_presence: "Leistung: Webauftritt",
	service_complete_it: "Leistung: Komplette IT",
	process: "Ablauf",
	consulting: "Beratung",
	journal: "Journal-Auswahl",
	faq: "Häufige Fragen",
	faq_v2: "Häufige Fragen",
	contact: "Kontakt",
	footer: "Fußzeile",
	pricing: "Preise",
	pricing_services: "Preise nach Leistung",
	cookie_banner: "Cookie-Hinweis",
	legal_impressum: "Impressum (Text)",
	legal_datenschutz: "Datenschutzerklärung (Text)"
};
/**
* The pages of the primary consumer (`tracht-digital.de`).
*
* Ordered as a visitor meets them. `legal_*` sit on their own pages rather than
* on the home page — the same split the site's cache route table makes, and for
* the same reason: saving the Impressum must not re-render the whole site.
*/
var PAGES = [
	{
		id: "startseite",
		label: "Startseite",
		path: "/",
		sections: [
			"home_hero",
			"why_me",
			"services_overview",
			...SERVICE_SECTION_KEYS,
			"digital_responsibility",
			"process",
			"pricing_services",
			"journal",
			"faq_v2",
			"contact",
			"cookie_banner",
			"footer"
		]
	},
	{
		id: "preise",
		label: "Preise",
		path: "/preise",
		sections: [
			"pricing_services",
			...SERVICE_SECTION_KEYS,
			"contact",
			"footer"
		]
	},
	{
		id: "leistung_beratung_konzeption",
		label: "Leistung: Beratung & Konzeption",
		path: "/leistungen/beratung-konzeption",
		pathEn: "/en/services/consulting-planning",
		sections: [
			"service_consulting",
			"contact",
			"footer"
		]
	},
	{
		id: "leistung_prozessoptimierung",
		label: "Leistung: Prozessoptimierung",
		path: "/leistungen/prozessoptimierung",
		pathEn: "/en/services/process-optimization",
		sections: [
			"service_process",
			"contact",
			"footer"
		]
	},
	{
		id: "leistung_individuelle_loesungen",
		label: "Leistung: Individuelle Lösungen",
		path: "/leistungen/individuelle-loesungen",
		pathEn: "/en/services/tailored-solutions",
		sections: [
			"service_solutions",
			"contact",
			"footer"
		]
	},
	{
		id: "leistung_auftragsprogrammierung",
		label: "Leistung: Auftragsprogrammierung",
		path: "/leistungen/auftragsprogrammierung",
		pathEn: "/en/services/contract-development",
		sections: [
			"service_custom_development",
			"contact",
			"footer"
		]
	},
	{
		id: "leistung_webauftritt",
		label: "Leistung: Webauftritt",
		path: "/leistungen/webauftritt",
		pathEn: "/en/services/web-presence",
		sections: [
			"service_web_presence",
			"contact",
			"footer"
		]
	},
	{
		id: "leistung_komplette_it",
		label: "Leistung: Komplette IT",
		path: "/leistungen/komplette-it",
		pathEn: "/en/services/complete-it",
		sections: [
			"service_complete_it",
			"contact",
			"footer"
		]
	},
	{
		id: "impressum",
		label: "Impressum",
		path: "/legal/impressum",
		sections: ["legal_impressum"]
	},
	{
		id: "datenschutz",
		label: "Datenschutz",
		path: "/legal/datenschutz",
		sections: ["legal_datenschutz"]
	}
];
/** The bucket every unmapped section falls into. */
var OTHER_PAGE_ID = "weitere";
/**
* Group a site's section keys into pages.
*
* Two rules, both of which exist to keep content reachable:
*
*  - known pages and sections are always offered, even before an override row
*    exists — otherwise a newly registered site could never create its first
*    block, and a missing language could never be authored by hand;
*  - a stored section no page claims lands in "Weitere Abschnitte", so a second
*    managed site's content is editable on day one without anyone editing this
*    file. That is the difference between a map and a filter.
*/
function resolvePages(sectionKeys) {
	const available = new Set(sectionKeys);
	const claimed = /* @__PURE__ */ new Set();
	const pages = PAGES.map((page) => {
		for (const key of page.sections) claimed.add(key);
		return {
			...page,
			present: [...page.sections]
		};
	});
	const rest = [...available].filter((key) => !claimed.has(key)).sort();
	if (rest.length > 0) pages.push({
		id: OTHER_PAGE_ID,
		label: "Weitere Abschnitte",
		path: "",
		sections: rest,
		present: rest
	});
	return pages;
}
/** Display name for a section key, falling back to the key itself. */
function sectionLabel(key) {
	return SECTION_LABELS[key] ?? key;
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/SitesList.tsx
var api = apiFetch;
/**
* Website-CMS — the CONTENT screen: pick a website, pick a page, edit its
* sections.
*
* ### What is deliberately NOT here any more
*
* Adding a website, and configuring where its rebuild and its page cache point,
* moved to **Einstellungen → Website-CMS** (`SiteRegistry.tsx`). Those are
* things you do once when a site is connected; they were sitting on the daily
* editing screen, above the content, where connection fields are noise at best
* and an invitation to break a working site at
* worst. This screen now answers exactly one question: which words go on which
* page.
*
* ### Stale-while-revalidate
*
* Every read goes through `useCachedJson`, so coming back to this screen paints
* the site list and the page list instantly from the last visit and refreshes
* them behind the user. While that refresh is in flight the affected list wears
* `tds-stale` — dimmed and pulsing — because data that may already be wrong
* must never be presented as current.
*/
function SitesList() {
	const sitesQuery = useCachedJson("/cms/sites");
	const sites = sitesQuery.data?.sites ?? [];
	const [selectedKey, setSelectedKey] = useState(null);
	const sitesVisiblyStale = sitesQuery.stale || sitesQuery.error !== null && sitesQuery.data !== void 0;
	useEffect(() => {
		if (sites.length === 0) {
			if (selectedKey !== null) setSelectedKey(null);
			return;
		}
		if (selectedKey === null || !sites.some((s) => s.site_key === selectedKey)) setSelectedKey(sites[0]?.site_key ?? null);
	}, [sites, selectedKey]);
	const selected = sites.find((s) => s.site_key === selectedKey) ?? null;
	if (sitesQuery.loading) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (sitesQuery.error && sites.length === 0) return /* @__PURE__ */ jsxs("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: [
			"Websites konnten nicht geladen werden (",
			sitesQuery.error.message,
			")."
		]
	});
	if (sites.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "tds-empty",
		children: [/* @__PURE__ */ jsx("p", { children: "Noch keine Website verbunden." }), /* @__PURE__ */ jsxs("p", {
			className: "marginalia",
			children: [
				"Websites werden unter ",
				/* @__PURE__ */ jsx("a", {
					className: "link-underline",
					href: "/einstellungen",
					children: "Einstellungen → Website-CMS"
				}),
				" ",
				"hinzugefügt. Dort liegt auch, wohin ein Speichern den Seiten-Cache schickt."
			]
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: staleClass(sitesVisiblyStale, "cms-sites tds-stack"),
		"aria-busy": sitesVisiblyStale,
		children: [
			sitesQuery.error ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Websites konnten nicht aktualisiert werden (",
					sitesQuery.error.message,
					"). Die angezeigten Daten sind möglicherweise veraltet."
				]
			}) : null,
			sites.length > 1 ? /* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				role: "group",
				"aria-label": "Website wählen",
				children: sites.map((s) => /* @__PURE__ */ jsx("button", {
					type: "button",
					className: s.site_key === selectedKey ? "chip chip--info" : "chip chip--neutral",
					"aria-pressed": s.site_key === selectedKey,
					onClick: () => setSelectedKey(s.site_key),
					children: s.name
				}, s.id))
			}) : null,
			selected ? /* @__PURE__ */ jsx(SiteEditor, { site: selected }) : null
		]
	});
}
/** A single typed leaf input; emits the correctly-typed value (string/number/bool). */
function LeafInput({ field, value, onChange }) {
	if (field.type === "checkbox") return /* @__PURE__ */ jsx("input", {
		type: "checkbox",
		checked: Boolean(value),
		onChange: (e) => onChange(e.target.checked)
	});
	if (field.type === "number") return /* @__PURE__ */ jsx("input", {
		className: "field-boxed",
		type: "number",
		value: value === void 0 || value === null || value === "" ? "" : String(value),
		onChange: (e) => onChange(e.target.value === "" ? null : Number(e.target.value))
	});
	if (field.type === "textarea") return /* @__PURE__ */ jsx("textarea", {
		className: "field-boxed",
		value: String(value ?? ""),
		onChange: (e) => onChange(e.target.value),
		rows: 3
	});
	return /* @__PURE__ */ jsx("input", {
		className: "field-boxed",
		value: String(value ?? ""),
		onChange: (e) => onChange(e.target.value)
	});
}
/** Editor for an array of plain strings (e.g. pricing `includes` / `notes`). */
function StringListEditor({ field, items, onChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "cms-form__stringlist",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-sm",
				children: field.label
			}), /* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "btn btn-ghost text-xs",
				onClick: () => onChange([...items, ""]),
				children: ["+ ", field.itemLabel]
			})]
		}), items.map((s, i) => /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				value: s,
				onChange: (e) => onChange(items.map((v, idx) => idx === i ? e.target.value : v))
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-danger text-xs",
				onClick: () => onChange(items.filter((_, idx) => idx !== i)),
				children: "×"
			})]
		}, i))]
	});
}
/** Render one field (leaf / string-list / object-list) bound to `value[field.key]`. */
function FieldEditor({ field, value, onChange }) {
	if (field.type === "stringlist") return /* @__PURE__ */ jsx(StringListEditor, {
		field,
		items: Array.isArray(value) ? value.map((v) => String(v ?? "")) : [],
		onChange: (items) => onChange(items)
	});
	return /* @__PURE__ */ jsxs("label", {
		className: "block text-sm",
		children: [field.label, /* @__PURE__ */ jsx(LeafInput, {
			field,
			value,
			onChange
		})]
	});
}
function ListEditor({ field, items, onChange }) {
	const update = (i, key, v) => onChange(items.map((it, idx) => idx === i ? {
		...it,
		[key]: v
	} : it));
	const blank = () => Object.fromEntries(field.itemFields.map((f) => [f.key, f.type === "stringlist" ? [] : f.type === "checkbox" ? false : f.type === "number" ? null : ""]));
	const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm font-medium",
					children: field.label
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn-ghost text-xs",
					onClick: () => onChange([...items, blank()]),
					children: ["+ ", field.itemLabel]
				})]
			}),
			items.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "text-xs opacity-60",
				children: "Noch keine Einträge."
			}) : null,
			items.map((it, i) => /* @__PURE__ */ jsxs("div", {
				className: "tds-card tds-stack tds-stack--tight p-3",
				children: [field.itemFields.map((f) => /* @__PURE__ */ jsx(FieldEditor, {
					field: f,
					value: it[f.key],
					onChange: (v) => update(i, f.key, v)
				}, f.key)), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-danger text-xs",
					onClick: () => remove(i),
					children: "Eintrag entfernen"
				})]
			}, i))
		]
	});
}
function StructuredForm({ schema, value, onChange }) {
	const setField = (key, v) => onChange({
		...value,
		[key]: v
	});
	return /* @__PURE__ */ jsx("div", {
		className: "cms-form space-y-3",
		children: schema.map((f) => f.type === "list" ? /* @__PURE__ */ jsx(ListEditor, {
			field: f,
			items: Array.isArray(value[f.key]) ? value[f.key] : [],
			onChange: (items) => setField(f.key, items)
		}, f.key) : /* @__PURE__ */ jsx(FieldEditor, {
			field: f,
			value: value[f.key],
			onChange: (v) => setField(f.key, v)
		}, f.key))
	});
}
/** The pages and sections of one site, plus the editor for the chosen section. */
function SiteEditor({ site }) {
	const blocksQuery = useCachedJson(`/cms/${site.site_key}/blocks`);
	const blocks = useMemo(() => blocksQuery.data?.blocks ?? [], [blocksQuery.data]);
	const [pageId, setPageId] = useState(null);
	const [sectionKey, setSectionKey] = useState(null);
	const [lang, setLang] = useState("de");
	const [backfillStatus, setBackfillStatus] = useState(null);
	const blocksVisiblyStale = blocksQuery.stale || blocksQuery.error !== null && blocksQuery.data !== void 0;
	const sectionKeys = useMemo(() => [...new Set(blocks.map((b) => b.section_key))], [blocks]);
	const pages = useMemo(() => resolvePages(sectionKeys), [sectionKeys]);
	useEffect(() => {
		if (pages.length === 0) {
			if (pageId !== null) setPageId(null);
			return;
		}
		if (pageId === null || !pages.some((p) => p.id === pageId)) setPageId(pages[0]?.id ?? null);
	}, [pages, pageId]);
	const page = pages.find((p) => p.id === pageId) ?? null;
	const isMachine = (key, l) => Boolean(blocks.find((b) => b.section_key === key && b.lang === l)?.machine_translated);
	const isStored = (key, l) => blocks.some((b) => b.section_key === key && b.lang === l);
	const backfill = async () => {
		setBackfillStatus("Übersetzungen werden erzeugt …");
		let res;
		try {
			res = await api(`/cms/sites/${site.site_key}/translations/backfill`, { method: "POST" });
		} catch {
			setBackfillStatus(null);
			toast.danger("Übersetzungslauf fehlgeschlagen (Netzwerkfehler).");
			return;
		}
		if (res.ok) {
			const d = await res.json().catch(() => ({}));
			setBackfillStatus(null);
			const created = d.created ?? 0;
			const cacheResult = created === 0 ? "" : d.cached === true ? " Cache-Neubau für die betroffenen Seiten wurde angestoßen." : " Der Seiten-Cache konnte nicht angestoßen werden.";
			toast.success(`Fertig: ${created} erstellt, ${d.skipped ?? 0} übersprungen.${cacheResult}`);
			invalidate(`/cms/${site.site_key}/`);
		} else if (res.status === 503) setBackfillStatus("Automatische Übersetzung ist nicht konfiguriert (Einstellungen → Website-CMS).");
		else {
			setBackfillStatus(null);
			toast.danger(`Übersetzungslauf fehlgeschlagen (HTTP ${res.status}).`);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "cms-editor tds-stack",
		children: [
			blocksQuery.error ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Inhalte konnten nicht aktualisiert werden (",
					blocksQuery.error.message,
					").",
					blocks.length > 0 ? " Die angezeigten Daten sind möglicherweise veraltet." : ""
				]
			}) : null,
			blocksQuery.loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
				blocks.length === 0 && !blocksQuery.error ? /* @__PURE__ */ jsx("p", {
					className: "tds-alert",
					children: "Noch keine eigenen Inhalte gespeichert. Die öffentliche Website verwendet ihre eingebauten Vorgaben; jeder Abschnitt kann hier erstmals angelegt werden."
				}) : null,
				/* @__PURE__ */ jsx("nav", {
					className: staleClass(blocksVisiblyStale, "tds-toolbar"),
					"aria-busy": blocksVisiblyStale,
					"aria-label": "Seite wählen",
					children: pages.map((p) => /* @__PURE__ */ jsx("button", {
						type: "button",
						className: p.id === pageId ? "chip chip--info" : "chip chip--neutral",
						"aria-pressed": p.id === pageId,
						onClick: () => {
							setPageId(p.id);
							setSectionKey(null);
						},
						children: p.label
					}, p.id))
				}),
				page ? /* @__PURE__ */ jsx(PageSections, {
					page,
					stale: blocksVisiblyStale,
					activeSection: sectionKey,
					activeLang: lang,
					isMachine,
					isStored,
					onPick: (key, l) => {
						setSectionKey(key);
						setLang(l);
					}
				}) : null,
				page && sectionKey ? /* @__PURE__ */ jsx(BlockEditor, {
					siteKey: site.site_key,
					sectionKey,
					lang,
					onLangChange: setLang,
					cacheConfigured: Boolean((site.cache_url ?? "").trim())
				}) : /* @__PURE__ */ jsx("p", {
					className: "marginalia",
					children: "Einen Abschnitt wählen, um ihn zu bearbeiten."
				})
			] }),
			/* @__PURE__ */ jsx(LegalDocs, { siteKey: site.site_key }),
			/* @__PURE__ */ jsxs("div", {
				className: "cms-editor__translate",
				children: [
					/* @__PURE__ */ jsx("h3", { children: "Automatische Übersetzung" }),
					/* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Beim Speichern eines Abschnitts wird die Gegensprache per DeepL erzeugt (Schlüssel unter Einstellungen → Website-CMS). Vorhandene Abschnitte lassen sich hier nachziehen."
					}),
					backfillStatus ? /* @__PURE__ */ jsx("p", {
						className: "tds-alert",
						role: "status",
						children: backfillStatus
					}) : null,
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: backfill,
						children: "Übersetzungen nachziehen"
					})
				]
			})
		]
	});
}
/** The sections of one page, each with the languages it exists in. */
function PageSections({ page, stale, activeSection, activeLang, isMachine, isStored, onPick }) {
	return /* @__PURE__ */ jsxs("div", {
		className: staleClass(stale, "tds-card tds-stack"),
		"aria-busy": stale,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ jsx("h3", { children: page.label }), page.path ? page.pathEn ? /* @__PURE__ */ jsxs("span", {
				className: "flex flex-wrap items-center justify-end gap-2",
				children: [/* @__PURE__ */ jsxs("code", {
					className: "text-xs opacity-70",
					children: ["DE ", page.path]
				}), /* @__PURE__ */ jsxs("code", {
					className: "text-xs opacity-70",
					children: ["EN ", page.pathEn]
				})]
			}) : /* @__PURE__ */ jsx("code", {
				className: "text-xs opacity-70",
				children: page.path
			}) : null]
		}), /* @__PURE__ */ jsx("ul", {
			className: "tds-list",
			children: page.present.map((key) => /* @__PURE__ */ jsxs("li", {
				className: "tds-list__row",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsx("strong", { children: sectionLabel(key) }), /* @__PURE__ */ jsx("code", {
						className: "text-xs opacity-70",
						children: key
					})]
				}), /* @__PURE__ */ jsx("span", {
					className: "flex flex-wrap items-center gap-1",
					children: ["de", "en"].map((l) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: activeSection === key && activeLang === l ? "btn btn-primary text-xs" : "btn btn-ghost text-xs",
						onClick: () => onPick(key, l === "en" ? "en" : "de"),
						children: [l.toUpperCase(), isMachine(key, l) ? " · auto" : !isStored(key, l) ? " · Vorgabe" : ""]
					}, l))
				})]
			}, key))
		})]
	});
}
/** Load, edit and save one block; a save re-renders only the pages it affects. */
function BlockEditor({ siteKey, sectionKey, lang, onLangChange, cacheConfigured }) {
	const path = `/cms/${siteKey}/blocks/${sectionKey}?lang=${lang}`;
	const blockQuery = useCachedJson(path);
	const [value, setValue] = useState({});
	const [json, setJson] = useState("{}");
	const [mode, setMode] = useState("form");
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [seededPath, setSeededPath] = useState(null);
	const [seededFrom, setSeededFrom] = useState(null);
	const schema = SECTION_SCHEMAS[sectionKey];
	const blockVisiblyStale = blockQuery.stale || blockQuery.error !== null && blockQuery.data !== void 0;
	useEffect(() => {
		if (blockQuery.data === void 0) return;
		const raw = blockQuery.data.value;
		const obj = raw !== null && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
		const signature = `${path}::${JSON.stringify(obj)}`;
		if (!(seededPath !== path) && (dirty || signature === seededFrom)) return;
		setValue(obj);
		setJson(JSON.stringify(obj, null, 2));
		setMode(schema ? "form" : "json");
		setStatus(null);
		setDirty(false);
		setSeededPath(path);
		setSeededFrom(signature);
	}, [
		blockQuery.data,
		dirty,
		path,
		schema,
		seededFrom,
		seededPath
	]);
	/** Resolve the object to save from whichever mode is active. */
	const currentValue = () => {
		if (mode === "form") return value;
		let parsed;
		try {
			parsed = JSON.parse(json);
		} catch {
			return null;
		}
		return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : null;
	};
	const toForm = () => {
		const v = currentValue();
		if (v === null) {
			setStatus("Ungültiges JSON — Formular nicht verfügbar.");
			return;
		}
		setValue(v);
		setStatus(null);
		setMode("form");
	};
	const toJson = () => {
		setJson(JSON.stringify(value, null, 2));
		setMode("json");
	};
	const save = async () => {
		const v = currentValue();
		if (v === null) {
			setStatus("Wert muss ein gültiges JSON-Objekt sein.");
			return;
		}
		setBusy(true);
		let res;
		try {
			res = await api(`/cms/${siteKey}/blocks/${sectionKey}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					value: v,
					lang
				})
			});
		} catch {
			setBusy(false);
			toast.danger("Speichern fehlgeschlagen (Netzwerkfehler). Der Inhalt wurde nicht bestätigt.");
			return;
		}
		setBusy(false);
		if (!res.ok) {
			toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
			return;
		}
		const body = await res.json().catch(() => ({}));
		toast.success(body.cached === true ? "Gespeichert. Der Cache-Neubau für die betroffenen Seiten wurde angestoßen." : cacheConfigured ? "Gespeichert. Der Seiten-Cache konnte nicht angestoßen werden." : "Gespeichert. Für diese Website ist kein Seiten-Cache hinterlegt.");
		invalidate(`/cms/${siteKey}/`);
		setValue(v);
		setJson(JSON.stringify(v, null, 2));
		setDirty(false);
		setSeededPath(path);
		setSeededFrom(`${path}::${JSON.stringify(v)}`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-card tds-stack",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsxs("h3", { children: [
					sectionLabel(sectionKey),
					" ",
					/* @__PURE__ */ jsx("code", {
						className: "text-xs opacity-70",
						children: sectionKey
					})
				] }), /* @__PURE__ */ jsxs("span", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsxs("select", {
						className: "field-boxed",
						"aria-label": "Sprache des Abschnitts",
						value: lang,
						onChange: (e) => onLangChange(e.target.value === "en" ? "en" : "de"),
						children: [/* @__PURE__ */ jsx("option", {
							value: "de",
							children: "de"
						}), /* @__PURE__ */ jsx("option", {
							value: "en",
							children: "en"
						})]
					}), schema ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost text-xs",
						onClick: () => mode === "form" ? toJson() : toForm(),
						children: mode === "form" ? "JSON bearbeiten" : "Formular"
					}) : null]
				})]
			}),
			blockQuery.loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : /* @__PURE__ */ jsxs("div", {
				className: staleClass(blockVisiblyStale),
				"aria-busy": blockVisiblyStale,
				children: [blockQuery.data?.value === null ? /* @__PURE__ */ jsxs("p", {
					className: "marginalia",
					children: [
						"Für ",
						lang.toUpperCase(),
						" ist noch kein eigener Inhalt gespeichert; die Website verwendet ihre eingebaute Vorgabe."
					]
				}) : null, mode === "form" && schema ? /* @__PURE__ */ jsx(StructuredForm, {
					schema,
					value,
					onChange: (next) => {
						setValue(next);
						setDirty(true);
					}
				}) : /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					"aria-label": "JSON",
					value: json,
					onChange: (e) => {
						setJson(e.target.value);
						setDirty(true);
					},
					rows: 14,
					spellCheck: false
				})]
			}),
			blockQuery.error ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Abschnitt konnte nicht geladen werden (",
					blockQuery.error.message,
					")."
				]
			}) : null,
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ jsx("button", {
					className: "btn btn-primary",
					type: "button",
					onClick: save,
					disabled: busy || blockQuery.loading || blockQuery.data === void 0,
					children: busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
				}), /* @__PURE__ */ jsx("span", {
					className: "marginalia",
					children: "Speichern baut nur die betroffenen Seiten neu, nicht die ganze Website."
				})]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Website-CMS</h1></div>${renderComponent($$result, "SitesList", SitesList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/SitesList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/website.astro
var website_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Website,
	file: () => $$file,
	url: () => void 0
});
var $$Website = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Website-CMS" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/website.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/website.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/website@_@astro
var page = () => website_exports;
//#endregion
export { page };
