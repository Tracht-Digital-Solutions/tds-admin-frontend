import { C as createAstro, a as Fragment$2, c as renderSlot, d as renderTemplate, f as maybeRenderHead, g as createRenderInstruction, h as defineScriptVars, i as renderComponent, m as addAttribute, p as renderHead, x as unescapeHTML } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/components/index.js
var SEMANTIC_CHIP_VARIANTS$1 = [
	"neutral",
	"success",
	"warning",
	"danger",
	"info"
];
var CATEGORICAL_CHIP_VARIANTS$1 = [
	"cat-violet",
	"cat-teal",
	"cat-amber",
	"cat-rose",
	"cat-cyan"
];
var CHIP_VARIANTS$1 = [...SEMANTIC_CHIP_VARIANTS$1, ...CATEGORICAL_CHIP_VARIANTS$1];
new Set(CHIP_VARIANTS$1);
var TOAST_VARIANT_SET = /* @__PURE__ */ new Set([
	"success",
	"warning",
	"danger",
	"info"
]);
function resolveToastVariant(variant, fallback = "info") {
	const key = (variant ?? "").trim().toLowerCase();
	return TOAST_VARIANT_SET.has(key) ? key : fallback;
}
var THEME_STORAGE_KEY$1 = "tds-theme";
var THEME_ATTRIBUTE$1 = "data-theme";
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
function applyThemePreference(preference, options = {}) {
	const theme = resolveTheme(preference);
	try {
		if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY$1);
		else localStorage.setItem(THEME_STORAGE_KEY$1, preference);
	} catch {}
	if (hasDocument()) document.documentElement.setAttribute(THEME_ATTRIBUTE$1, theme);
	if (options.announce !== false && typeof window !== "undefined") try {
		const detail = {
			preference,
			theme
		};
		window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail }));
	} catch {}
	return theme;
}
var cssEase = {
	out: `cubic-bezier(${[
		.2,
		.8,
		.2,
		1
	].join(", ")})`,
	inOut: `cubic-bezier(${[
		.4,
		0,
		.2,
		1
	].join(", ")})`
};
function ThemeToggle({ labelToDark = "Auf Dunkel umschalten", labelToLight = "Auf Hell umschalten" } = {}) {
	const [theme, setTheme] = useState("light");
	const [mounted, setMounted] = useState(false);
	const buttonRef = useRef(null);
	useEffect(() => {
		const current = document.documentElement.getAttribute(THEME_ATTRIBUTE$1);
		setTheme(current === "dark" ? "dark" : "light");
		setMounted(true);
	}, []);
	const flip = () => {
		const next = theme === "dark" ? "light" : "dark";
		const apply = () => {
			setTheme(next);
			applyThemePreference(next);
		};
		const startViewTransition = document.startViewTransition;
		const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!startViewTransition || prefersReduced) {
			apply();
			return;
		}
		if (window.matchMedia("(pointer: coarse)").matches) {
			startViewTransition.call(document, () => {
				flushSync(apply);
			}).ready.then(() => {
				document.documentElement.animate({
					opacity: [0, 1],
					transform: ["scale(1.02)", "scale(1)"]
				}, {
					duration: 320,
					easing: cssEase.out,
					pseudoElement: "::view-transition-new(root)"
				});
			});
			return;
		}
		const rect = buttonRef.current?.getBoundingClientRect();
		const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
		const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
		const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		startViewTransition.call(document, () => {
			flushSync(apply);
		}).ready.then(() => {
			document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] }, {
				duration: 480,
				easing: cssEase.inOut,
				pseudoElement: "::view-transition-new(root)"
			});
		});
	};
	const label = mounted && theme === "dark" ? labelToLight : labelToDark;
	return /* @__PURE__ */ jsxs("button", {
		ref: buttonRef,
		type: "button",
		onClick: flip,
		"aria-label": label,
		title: label,
		className: "tds-theme-toggle inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer",
		children: [/* @__PURE__ */ jsx("svg", {
			"aria-hidden": "true",
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: mounted && theme === "dark" ? "hidden" : "block",
			children: /* @__PURE__ */ jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
		}), /* @__PURE__ */ jsxs("svg", {
			"aria-hidden": "true",
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: mounted && theme === "dark" ? "block" : "hidden",
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "12",
					cy: "12",
					r: "4"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "2",
					x2: "12",
					y2: "5"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "19",
					x2: "12",
					y2: "22"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "2",
					y1: "12",
					x2: "5",
					y2: "12"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "19",
					y1: "12",
					x2: "22",
					y2: "12"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "4.93",
					y1: "4.93",
					x2: "6.99",
					y2: "6.99"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "17.01",
					y1: "17.01",
					x2: "19.07",
					y2: "19.07"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "4.93",
					y1: "19.07",
					x2: "6.99",
					y2: "17.01"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "17.01",
					y1: "6.99",
					x2: "19.07",
					y2: "4.93"
				})
			]
		})]
	});
}
function initialsOf(name) {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return "?";
	const head = (value) => Array.from(value ?? "")[0] ?? "";
	return (head(words[0]) + (words.length > 1 ? head(words[words.length - 1]) : "")).toUpperCase() || "?";
}
function hash$1(value) {
	let h = 5381;
	for (let i = 0; i < value.length; i += 1) h = (h << 5) + h + value.charCodeAt(i) | 0;
	return Math.abs(h);
}
function Avatar({ name, src, seed, size = "md", decorative = false, className }) {
	const [failed, setFailed] = useState(false);
	const label = (name ?? "").trim();
	const classes = ["tds-avatar"];
	if (size === "sm") classes.push("tds-avatar--sm");
	else if (size === "lg") classes.push("tds-avatar--lg");
	if (className) classes.push(className);
	const showImage = Boolean(src) && !failed;
	const variant = CATEGORICAL_CHIP_VARIANTS$1[hash$1(String(seed ?? label ?? "")) % CATEGORICAL_CHIP_VARIANTS$1.length];
	const a11y = decorative ? { "aria-hidden": true } : {
		role: "img",
		"aria-label": label || "Profilbild"
	};
	if (showImage) return /* @__PURE__ */ jsx("img", {
		...a11y,
		alt: decorative ? "" : label,
		src: src ?? void 0,
		className: classes.join(" "),
		onError: () => setFailed(true),
		loading: "lazy",
		decoding: "async"
	});
	return /* @__PURE__ */ jsx("span", {
		...a11y,
		className: classes.join(" "),
		"data-avatar-variant": variant,
		children: /* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			children: initialsOf(label)
		})
	});
}
function FormAlert({ message }) {
	if (!message) return null;
	return /* @__PURE__ */ jsxs("p", {
		className: "form-alert",
		role: "alert",
		"aria-live": "assertive",
		children: [/* @__PURE__ */ jsx("svg", {
			className: "form-alert__icon",
			"aria-hidden": "true",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			children: /* @__PURE__ */ jsx("path", {
				fillRule: "evenodd",
				d: "M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a.9.9 0 01.9.9v4.4a.9.9 0 01-1.8 0V6.9A.9.9 0 0110 6zm0 8.4a1.1 1.1 0 100-2.2 1.1 1.1 0 000 2.2z",
				clipRule: "evenodd"
			})
		}), /* @__PURE__ */ jsx("span", { children: message })]
	});
}
function Spinner({ size = "md", tone = "current", label = "Wird geladen", className }) {
	const classes = ["tds-spinner"];
	if (size === "sm") classes.push("tds-spinner--sm");
	else if (size === "lg") classes.push("tds-spinner--lg");
	if (tone === "primary") classes.push("tds-spinner--primary");
	if (className) classes.push(className);
	return /* @__PURE__ */ jsx("span", {
		className: classes.join(" "),
		role: "status",
		"aria-label": label
	});
}
function ConfirmDialog({ open, title, message, confirmLabel = "Löschen", cancelLabel = "Abbrechen", destructive = true, busy = false, onConfirm, onCancel }) {
	const ref = useRef(null);
	const confirmRef = useRef(null);
	const cancelRef = useRef(null);
	const titleId = useId();
	const descId = useId();
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (open && !el.open) {
			if (typeof el.showModal === "function") el.showModal();
			else el.setAttribute("open", "");
			(destructive ? cancelRef.current : confirmRef.current)?.focus();
		} else if (!open && el.open) {
			if (typeof el.close === "function") el.close();
			else el.removeAttribute("open");
		}
	}, [open, destructive]);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const onNativeCancel = (e) => {
			e.preventDefault();
			if (!busy) onCancel();
		};
		el.addEventListener("cancel", onNativeCancel);
		return () => el.removeEventListener("cancel", onNativeCancel);
	}, [busy, onCancel]);
	if (!open) return null;
	return /* @__PURE__ */ jsx("dialog", {
		ref,
		className: "tds-modal",
		"aria-labelledby": titleId,
		"aria-describedby": message ? descId : void 0,
		onClick: (e) => {
			if (e.target === e.currentTarget && !busy) onCancel();
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "tds-modal__panel",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "tds-modal__title",
					id: titleId,
					children: title
				}),
				message ? /* @__PURE__ */ jsx("p", {
					className: "marginalia",
					id: descId,
					children: message
				}) : null,
				/* @__PURE__ */ jsxs("div", {
					className: "tds-modal__actions",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: onCancel,
						disabled: busy,
						ref: cancelRef,
						children: cancelLabel
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: `btn ${destructive ? "btn-danger" : "btn-primary"}`,
						onClick: onConfirm,
						disabled: busy,
						ref: confirmRef,
						children: busy ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : confirmLabel
					})]
				})
			]
		})
	});
}
var translations = {
	de: {
		nav: {
			about: "Über mich",
			services: "Leistungen",
			tech: "Tech",
			portfolio: "Portfolio",
			process: "Prozess",
			blog: "Journal",
			contact: "Kontakt",
			cta: "Unverbindlich anfragen",
			pricing: "Preise"
		},
		hero: {
			availability: "Verfügbar für Projekte · Q3 2026",
			location: "Schwarzenbek · Hamburg",
			headline: "Digitalisierung, die",
			headlineAccent: "Arbeit",
			headlineSuffix: "abnimmt.",
			sub: "Websites, Webshops und Werkzeuge für kleine Betriebe. Ich schaue, wo es hakt – und baue, was hilft. Aus Schwarzenbek bei Hamburg.",
			cta1: "Unverbindlich anfragen",
			cta2: "Leistungen ansehen",
			scrollHint: "Scrollen"
		},
		about: {
			label: "— 01 / Über mich",
			headline: "Hi, ich bin",
			headlineAccent: "Julian.",
			lead: "Ich bin freier Entwickler in Schwarzenbek bei Hamburg. Ich arbeite für Selbstständige und kleine Betriebe ohne eigene IT.",
			p1: "Website, Webshop, kleines Programm oder ein Ablauf, der einfacher werden soll: Ich höre zu, sortiere das Vorhaben und setze es um. Ein Ansprechpartner, von Anfang bis Ende.",
			p2: "Standardsoftware zwingt Sie, sich anzupassen. Ein gutes Werkzeug macht es andersherum. Manchmal ist die ehrliche Antwort: Es lohnt sich nicht.",
			portraitPlaceholder: "Hier könnte ein Schwarz-Weiß-Portrait von Julian stehen — schräg sitzend am Schreibtisch, leicht zur Kamera gewandt, naturnahes Licht.",
			stat1Value: "5+",
			stat1Label: "Jahre Erfahrung",
			stat2Value: "5",
			stat2Label: "Leistungsbereiche",
			stat3Value: "1:1",
			stat3Label: "Persönliche Betreuung"
		},
		services: {
			label: "— 02 / Leistungen",
			headline: "Was ich für Sie",
			headlineAccent: "leiste.",
			items: [
				{
					number: "01",
					title: "Digitalisierung für Unternehmen",
					description: "Listen von Hand, Zahlen aus drei Quellen, immer wieder abtippen. Ich nehme mir einen konkreten Ablauf vor und mache ihn einfacher – nicht gleich den ganzen Betrieb.",
					tags: [
						"Abläufe",
						"Auswertungen",
						"Automatisierung",
						"Schnittstellen"
					]
				},
				{
					number: "02",
					title: "Digitale Konzepte",
					description: "Sie haben eine Idee, aber noch keinen Plan. Ich mache daraus ein verständliches Konzept: was gebraucht wird, welcher Weg sinnvoll ist, was er kostet.",
					tags: [
						"Anforderungen",
						"Klickbarer Entwurf",
						"Aufwand",
						"Fahrplan"
					]
				},
				{
					number: "03",
					title: "Auftragsentwicklung",
					description: "Nicht jede Aufgabe braucht ein großes Programm. Oft reicht das Werkzeug, das zu Ihrer Arbeit passt: eine Excel-Vorlage, eine kleine Anwendung, eine Auswertung.",
					tags: [
						"Excel-Vorlage",
						"Kleine Anwendung",
						"Auswertung",
						"Datenübernahme"
					]
				},
				{
					number: "04",
					title: "Webauftritt",
					description: "Veraltet, unklar oder noch gar nicht da? Dann springen Interessenten ab, bevor sie anfragen. Ich baue neu, bringe Bestehendes auf Stand – und pflege es weiter.",
					tags: [
						"Neue Website",
						"Überarbeitung",
						"Pflege",
						"Auffindbarkeit"
					]
				},
				{
					number: "05",
					title: "Webshop",
					description: "Ihr Laden läuft, jetzt soll es online weitergehen. Ich plane, baue und betreue den Shop – auf Wunsch so, dass Artikel und Bestand vom Handy aus laufen.",
					tags: [
						"Onlineverkauf",
						"Produktpflege",
						"Bestand per Handy",
						"Betreuung"
					]
				}
			]
		},
		tech: {
			label: "Tech Stack",
			headline: "Womit ich",
			headlineAccent: "arbeite.",
			body: "Werkzeuge, die sich bewährt haben – keine Glaubensfrage, sondern das Richtige fürs Problem. Sprachen wechseln, gute Architektur bleibt."
		},
		portfolio: {
			label: "— 03 / Portfolio",
			headline: "Ausgewählte",
			headlineAccent: "Projekte.",
			comingSoon: "Demnächst",
			placeholderLabel: "Platzhalter",
			items: [
				{
					number: "01",
					badge: "Web-App",
					title: "Mittelstands-Plattform",
					description: "Eine maßgeschneiderte Webanwendung für einen mittelständischen Kunden – individuell entwickelt, skalierbar gebaut.",
					stack: [
						"Angular",
						"Node.js",
						"SQL"
					],
					imagePlaceholder: "Screenshot des Dashboards mit zentraler KPI-Übersicht, links Sidebar-Navigation, rechts ein Detailpanel."
				},
				{
					number: "02",
					badge: "Digitalisierung",
					title: "Prozess-Automatisierung",
					description: "Automatisierung manueller Geschäftsprozesse durch intelligente Workflows und Datenpipelines.",
					stack: [
						"Python",
						"KNIME",
						"SQL"
					],
					imagePlaceholder: "Workflow-Diagramm: KNIME-Knoten, die Daten aus drei Quellen zusammenführen, validieren und in eine SQL-Tabelle schreiben."
				},
				{
					number: "03",
					badge: "Web-Auftritt",
					title: "Markenpräsenz Mittelstand",
					description: "Professioneller Webauftritt für ein etabliertes Unternehmen – performant, barrierefrei, individuell.",
					stack: ["WordPress", "TypeScript"],
					imagePlaceholder: "Hero-Mockup der Kunden-Website auf Desktop und Mobile – ruhige Typografie, großes Schlüsselbild."
				},
				{
					number: "04",
					badge: "App",
					title: "Interne Business-App",
					description: "Desktop-Applikation zur internen Prozessverwaltung – intuitiv bedienbar, wartungsfreundlich dokumentiert.",
					stack: [
						"C#",
						"SQL",
						"Vue"
					],
					imagePlaceholder: "Screenshot der Desktop-App: Listenansicht der Aufträge mit Filterleiste oben und Detail-Panel rechts."
				}
			]
		},
		process: {
			label: "— 04 / Vorgehen",
			headline: "Wie ich",
			headlineAccent: "arbeite.",
			body: "Kein starrer Ablauf. Je nach Vorhaben verschiebt sich das Gewicht. Die vier Schritte sind der übliche Rahmen, kein Korsett.",
			steps: [
				{
					number: "01",
					title: "Zuhören",
					duration: "Zum Einstieg",
					description: "Sie schildern mir, wo es hakt. Ich frage nach – und sage ehrlich, ob sich eine Umsetzung lohnt."
				},
				{
					number: "02",
					title: "Konzept",
					duration: "Je nach Umfang",
					description: "Was wird gebraucht, welcher Weg ist sinnvoll, was kostet er? Die Grundlage steht, bevor Budget fließt."
				},
				{
					number: "03",
					title: "Umsetzung",
					duration: "Nach Absprache",
					description: "Ich baue es und zeige Ihnen Zwischenstände. Nachsteuern ist unterwegs günstig, hinterher teuer."
				},
				{
					number: "04",
					title: "Betreuung",
					duration: "Auf Wunsch",
					description: "Übergabe, Einweisung, auf Wunsch Pflege und Anpassungen. Ansprechpartner bleibe ich in jedem Fall."
				}
			]
		},
		blog: {
			label: "— 05 / Journal",
			headline: "Gedanken &",
			headlineAccent: "Artikel.",
			readMore: "Weiterlesen",
			allPosts: "Alle Artikel",
			placeholderLabel: "Platzhalter",
			posts: [
				{
					category: "Digitalisierung",
					title: "Digitalisierung fängt nicht beim Großprojekt an.",
					excerpt: "Sie fängt bei dem einen Ablauf an, der Sie jede Woche Stunden kostet – und den außer Ihnen niemand sieht.",
					date: "2026-08-04",
					slug: "digitalisierung-faengt-klein-an",
					imagePlaceholder: "Handgeschriebene Liste auf einem Klemmbrett neben einem Laptop – warmes Morgenlicht, Werkstatt im Hintergrund."
				},
				{
					category: "Webshop",
					title: "Lohnt sich ein Webshop für mein Ladengeschäft?",
					excerpt: "Nicht für jedes Sortiment. Vier Fragen, die die Antwort meist schon vorwegnehmen.",
					date: "2026-07-21",
					slug: "lohnt-sich-ein-webshop",
					imagePlaceholder: "Ladentheke von oben – Produkte, ein Notizblock und ein Smartphone mit offener Produktliste."
				},
				{
					category: "Werkzeuge",
					title: "Excel-Tabelle oder eigenes Werkzeug?",
					excerpt: "Eine Tabelle ist erstaunlich weit tragfähig. Es gibt aber drei Punkte, an denen sie zuverlässig kippt.",
					date: "2026-07-07",
					slug: "excel-oder-eigenes-werkzeug",
					imagePlaceholder: "Bildschirm mit einer weit gescrollten Tabelle, daneben ein Notizzettel mit Formelfragment."
				}
			]
		},
		contact: {
			label: "— 06 / Kontakt",
			headline: "Lassen Sie uns",
			headlineAccent: "reden.",
			sub: "Schreiben Sie mir in zwei Sätzen, wo es hakt. Ich antworte in der Regel innerhalb von 24 Stunden.",
			form: {
				name: "Name",
				namePlaceholder: "Hanna Schmidt",
				email: "E-Mail",
				emailPlaceholder: "hanna@manufaktur.de",
				company: "Unternehmen (optional)",
				companyPlaceholder: "Schmidt Manufaktur",
				message: "Nachricht",
				messagePlaceholder: "Wir pflegen unsere Preise noch in drei Listen gleichzeitig — das kostet jede Woche einen halben Tag.",
				consent: "Ich willige in die Verarbeitung meiner Daten gemäß der",
				consentLink: "Datenschutzerklärung",
				consentSuffix: "ein.",
				submit: "Nachricht senden",
				submitting: "Wird gesendet …",
				successTitle: "Nachricht erhalten!",
				successMessage: "Danke für Ihre Nachricht. Ich melde mich in der Regel innerhalb von 24 Stunden.",
				errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es noch einmal."
			},
			info: {
				emailLabel: "E-Mail",
				phoneLabel: "Handy",
				locationLabel: "Standort",
				socialLabel: "Social",
				email: "kontakt@tracht-digital.de",
				phone: "+49 178 822 4022",
				location: "Schwarzenbek · nähe Hamburg"
			}
		},
		pricing: {
			label: "— Preise",
			headline: "Transparente",
			headlineAccent: "Stundensätze.",
			sub: "Klare Preise, keine Pauschalpakete. Stundengenau abgerechnet, ehrlich geschätzt, mit einer Obergrenze, auf die Sie sich verlassen können.",
			teaserLabel: "Preise",
			teaserHeadline: "Klare Sätze,",
			teaserHeadlineAccent: "keine Pauschalen.",
			teaserSub: "Ab 95 € pro Stunde – stundengenau abgerechnet, ohne versteckte Kosten.",
			teaserCta: "Alle Stundensätze ansehen",
			teaserFromLabel: "ab",
			hourSuffix: "/ Stunde",
			includesLabel: "Beinhaltet:",
			items: [
				{
					title: "Beratung & Konzeption",
					rate: 120,
					description: "Strategische Begleitung, Architektur-Workshops, technische Reviews. Am Ende steht ein verständliches Konzept – nicht nur Folien.",
					includes: [
						"Aufnahme und Sortierung Ihrer Anforderungen",
						"Architektur- & Anforderungs-Workshops",
						"Code- & Stack-Reviews mit dokumentierten Empfehlungen",
						"Schriftliche Konzepte und Entscheidungsgrundlagen"
					],
					highlight: false
				},
				{
					title: "Web- & App-Entwicklung",
					rate: 105,
					description: "Frontend, Backend, mobile und Desktop-Apps. Sauber gebaut, getestet, dokumentiert – auch in zwei Jahren noch wartbar.",
					includes: [
						"Komponentenentwicklung (React, Vue, Angular)",
						"API- und Backend-Entwicklung (Node.js, C#, SQL)",
						"Mobile- und Desktop-Apps",
						"Tests, CI/CD und Dokumentation inklusive"
					],
					highlight: true
				},
				{
					title: "Digitalisierung & Automation",
					rate: 105,
					description: "Manuelle Abläufe durch Workflows, Datenpipelines und Integrationen ablösen. Konkrete Umsetzung, kein PowerPoint.",
					includes: [
						"Prozessanalyse vor Ort oder remote",
						"Workflow-Automation (Python, KNIME, n8n)",
						"Datenpipelines, ETL und SQL-Reporting",
						"Integration bestehender Tools und Systeme"
					],
					highlight: false
				},
				{
					title: "Wartung & Support",
					rate: 85,
					description: "Bestehende Systeme pflegen, Updates einspielen, Fehler beheben. Reaktionszeit nach Vereinbarung.",
					includes: [
						"Bug-Fixes und Hotfixes",
						"Dependency- und Sicherheits-Updates",
						"Monitoring und Performance-Optimierung",
						"Auf Wunsch monatliches Retainer-Modell"
					],
					highlight: false
				},
				{
					title: "Workshops & Schulungen",
					rate: 135,
					description: "Wissen weitergeben statt zurückhalten. Workshops für Ihr Team – von TypeScript-Basics bis Architektur.",
					includes: [
						"Inhouse- oder Remote-Workshops",
						"Maßgeschneiderte Schulungsunterlagen",
						"Hands-on-Übungen mit Ihrem echten Code",
						"Nachgespräch und Aufzeichnung inklusive"
					],
					highlight: false
				}
			],
			notesTitle: "Gut zu wissen",
			notes: [
				"Alle Preise zzgl. gesetzlicher Mehrwertsteuer (19 %).",
				"Tagessatz auf Anfrage – Rabatt ab 5 Tagen pro Monat verfügbar.",
				"Festpreis möglich, wenn der Umfang vorab klar ist.",
				"Reisekosten werden separat abgerechnet."
			],
			ctaTitle: "Klingt passend?",
			ctaSub: "Schreiben Sie mir kurz, worum es geht. Ich sage Ihnen ehrlich, ob und wie ich helfen kann.",
			ctaButton: "Unverbindlich anfragen",
			back: "Zurück"
		},
		consulting: {
			label: "— Beratung",
			headline: "Erst zuhören,",
			headlineAccent: "dann bauen.",
			body: "Vielleicht haben Sie ein klares Vorhaben, vielleicht nur das Gefühl, dass etwas einfacher laufen müsste. Beides ist ein guter Anfang.",
			primaryCta: "Unverbindlich anfragen",
			secondaryCta: "Leistungen ansehen"
		},
		footer: {
			slogan: "Digitale Lösungen, die wirklich passen.",
			tagline: "Persönlich, passgenau, aus einer Hand — aus Schwarzenbek bei Hamburg.",
			nav: "Navigation",
			contactTitle: "Kontakt",
			copyright: "© 2026 Tracht Digital Solutions. Alle Rechte vorbehalten.",
			impressum: "Impressum",
			datenschutz: "Datenschutz",
			pricing: "Preise"
		},
		errors: {
			name: "Bitte geben Sie Ihren Namen an.",
			email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
			message: "Mindestens 20 Zeichen, bitte.",
			consent: "Zustimmung erforderlich."
		},
		cookieNotice: {
			label: "Hinweis zu Cookies und Datenschutz",
			siteText: "Diese Website verwendet keine Tracking-Cookies. Es werden lediglich technisch notwendige Einstellungen (z. B. Ihr Farbschema) lokal in Ihrem Browser gespeichert.",
			panelText: "Dieser Bereich verwendet ausschließlich ein technisch notwendiges Cookie für die sichere Anmeldung (Session-Cookie). Es findet kein Tracking statt.",
			privacy: "Mehr in der Datenschutzerklärung.",
			accept: "Verstanden",
			consentText: "Wir zeigen auf diesem Blog Werbung von Google AdSense. Dafür werden – nur mit Ihrer Einwilligung – Cookies und ähnliche Technologien zu Werbezwecken gesetzt. Ihre Wahl ist freiwillig und jederzeit änderbar.",
			consentAccept: "Akzeptieren",
			consentDecline: "Ablehnen"
		},
		toast: { dismiss: "Schließen" }
	},
	en: {
		nav: {
			about: "About",
			services: "Services",
			tech: "Tech",
			portfolio: "Portfolio",
			process: "Process",
			blog: "Journal",
			contact: "Contact",
			cta: "Get in touch",
			pricing: "Pricing"
		},
		hero: {
			availability: "Available for projects · Q3 2026",
			location: "Schwarzenbek · Hamburg",
			headline: "Digitalization that takes",
			headlineAccent: "work",
			headlineSuffix: "off your hands.",
			sub: "Websites, online shops and tools for small businesses. I look at where things stick – and build what helps. From Schwarzenbek near Hamburg.",
			cta1: "Get in touch",
			cta2: "See services",
			scrollHint: "Scroll"
		},
		about: {
			label: "— 01 / About",
			headline: "Hi, I'm",
			headlineAccent: "Julian.",
			lead: "I'm a freelance developer in Schwarzenbek near Hamburg. I work with freelancers and small businesses that have no IT department.",
			p1: "Website, online shop, a small program or a workflow that should get simpler: I listen, sort out the plan and build it. One contact, start to finish.",
			p2: "Off-the-shelf software makes you adapt to it. A good tool works the other way round. Sometimes the honest answer is: it isn't worth it.",
			portraitPlaceholder: "A black-and-white portrait of Julian — seated at an angle at his desk, slightly turned toward the camera, soft natural light.",
			stat1Value: "5+",
			stat1Label: "Years of experience",
			stat2Value: "5",
			stat2Label: "Areas of work",
			stat3Value: "1:1",
			stat3Label: "Personal support"
		},
		services: {
			label: "— 02 / Services",
			headline: "What I",
			headlineAccent: "deliver.",
			items: [
				{
					number: "01",
					title: "Digitalization for Businesses",
					description: "Lists kept by hand, figures from three places, the same retyping every day. I take one concrete workflow and make it simpler – not the whole business at once.",
					tags: [
						"Workflows",
						"Reporting",
						"Automation",
						"Integrations"
					]
				},
				{
					number: "02",
					title: "Digital Concepts",
					description: "You have an idea but no plan yet. I turn it into a concept you can read: what is needed, which route makes sense, what it costs.",
					tags: [
						"Requirements",
						"Clickable draft",
						"Effort",
						"Roadmap"
					]
				},
				{
					number: "03",
					title: "Custom Development",
					description: "Not every task needs a big program. Often it just needs the tool that fits your work: a spreadsheet template, a small application, a report.",
					tags: [
						"Spreadsheet template",
						"Small application",
						"Reporting",
						"Data import"
					]
				},
				{
					number: "04",
					title: "Web Presence",
					description: "Out of date, unclear or not there at all? Then people leave before they get in touch. I build new, bring existing sites up to standard – and maintain them.",
					tags: [
						"New website",
						"Rework",
						"Maintenance",
						"Findability"
					]
				},
				{
					number: "05",
					title: "Online Shop",
					description: "Your shop runs locally, now it should run online too. I plan, build and look after it – set up so items and stock can be managed from a phone.",
					tags: [
						"Online sales",
						"Product upkeep",
						"Stock by phone",
						"Support"
					]
				}
			]
		},
		tech: {
			label: "Tech Stack",
			headline: "What I",
			headlineAccent: "work with.",
			body: "Tools that have proven themselves – not a matter of faith, just the right thing for the problem. Languages change; good architecture stays."
		},
		portfolio: {
			label: "— 03 / Portfolio",
			headline: "Selected",
			headlineAccent: "projects.",
			comingSoon: "Coming soon",
			placeholderLabel: "Placeholder",
			items: [
				{
					number: "01",
					badge: "Web App",
					title: "Mid-market platform",
					description: "A custom-built web application for a mid-market client – individually developed, built to scale.",
					stack: [
						"Angular",
						"Node.js",
						"SQL"
					],
					imagePlaceholder: "Dashboard screenshot with central KPI overview, sidebar navigation on the left, detail panel on the right."
				},
				{
					number: "02",
					badge: "Digitalization",
					title: "Process automation",
					description: "Automation of manual business processes through intelligent workflows and data pipelines.",
					stack: [
						"Python",
						"KNIME",
						"SQL"
					],
					imagePlaceholder: "Workflow diagram: KNIME nodes pulling data from three sources, validating it, writing into a SQL table."
				},
				{
					number: "03",
					badge: "Web presence",
					title: "Brand presence",
					description: "Professional web presence for an established company – performant, accessible, individually crafted.",
					stack: ["WordPress", "TypeScript"],
					imagePlaceholder: "Hero mockup of the client site on desktop and mobile — quiet typography, large keystone image."
				},
				{
					number: "04",
					badge: "App",
					title: "Internal business app",
					description: "Desktop application for internal process management – intuitively usable, cleanly documented.",
					stack: [
						"C#",
						"SQL",
						"Vue"
					],
					imagePlaceholder: "Desktop app screenshot: list view of orders with filter bar at the top and detail panel on the right."
				}
			]
		},
		process: {
			label: "— 04 / Process",
			headline: "How I",
			headlineAccent: "work.",
			body: "No rigid process. The weight shifts with the job. The four steps below are the usual frame, not a corset.",
			steps: [
				{
					number: "01",
					title: "Listening",
					duration: "To begin with",
					description: "You tell me where things get stuck. I keep asking – and say honestly whether building something is worth it."
				},
				{
					number: "02",
					title: "Concept",
					duration: "Depends on scope",
					description: "What is needed, which route makes sense, what does it cost? The groundwork is there before any budget moves."
				},
				{
					number: "03",
					title: "Delivery",
					duration: "As agreed",
					description: "I build it and show you where it stands. Changing course is cheap along the way and expensive afterwards."
				},
				{
					number: "04",
					title: "Support",
					duration: "If you want it",
					description: "Handover, a walkthrough, and maintenance if you want it. Either way I stay your point of contact."
				}
			]
		},
		blog: {
			label: "— 05 / Journal",
			headline: "Thoughts &",
			headlineAccent: "articles.",
			readMore: "Read more",
			allPosts: "All articles",
			placeholderLabel: "Placeholder",
			posts: [
				{
					category: "Digitalization",
					title: "Digitalization doesn't start with a big project.",
					excerpt: "It starts with the one routine that costs you hours every week – the one nobody but you can see.",
					date: "2026-08-04",
					slug: "digitalisierung-faengt-klein-an",
					imagePlaceholder: "A handwritten list on a clipboard beside a laptop — warm morning light, workshop in the background."
				},
				{
					category: "Online shop",
					title: "Is an online shop worth it for my local business?",
					excerpt: "Not for every range of products. Four questions that usually answer it for you.",
					date: "2026-07-21",
					slug: "lohnt-sich-ein-webshop",
					imagePlaceholder: "A shop counter from above — products, a notepad and a phone showing an open product list."
				},
				{
					category: "Tools",
					title: "Spreadsheet or a tool of your own?",
					excerpt: "A spreadsheet carries you surprisingly far. There are three points, though, where it reliably tips over.",
					date: "2026-07-07",
					slug: "excel-oder-eigenes-werkzeug",
					imagePlaceholder: "A screen showing a spreadsheet scrolled far down, next to a sticky note with a fragment of a formula."
				}
			]
		},
		contact: {
			label: "— 06 / Contact",
			headline: "Let's",
			headlineAccent: "talk.",
			sub: "Tell me in two sentences where things are getting stuck. I usually respond within 24 hours.",
			form: {
				name: "Name",
				namePlaceholder: "Alex Marlow",
				email: "Email",
				emailPlaceholder: "alex@marlow.studio",
				company: "Company (optional)",
				companyPlaceholder: "Marlow Studios",
				message: "Message",
				messagePlaceholder: "We still keep our prices in three separate lists — it costs us half a day every week.",
				consent: "I consent to the processing of my data in accordance with the",
				consentLink: "Privacy Policy",
				consentSuffix: ".",
				submit: "Send message",
				submitting: "Sending …",
				successTitle: "Message received!",
				successMessage: "Thank you for your message. I'll get back to you within 24 hours.",
				errorMessage: "Something went wrong. Please try again."
			},
			info: {
				emailLabel: "Email",
				phoneLabel: "Mobile",
				locationLabel: "Location",
				socialLabel: "Social",
				email: "contact@tracht-digital.de",
				phone: "+49 178 822 4022",
				location: "Schwarzenbek · near Hamburg"
			}
		},
		pricing: {
			label: "— Pricing",
			headline: "Transparent",
			headlineAccent: "hourly rates.",
			sub: "Clear pricing, no opaque packages. Billed by the actual hour, honestly estimated, with a ceiling you can rely on.",
			teaserLabel: "Pricing",
			teaserHeadline: "Clear rates,",
			teaserHeadlineAccent: "no packages.",
			teaserSub: "From €95 per hour – billed by the actual hour, no hidden fees.",
			teaserCta: "See all hourly rates",
			teaserFromLabel: "from",
			hourSuffix: "/ hour",
			includesLabel: "Included:",
			items: [
				{
					title: "Consulting & Strategy",
					rate: 120,
					description: "Strategic guidance, architecture workshops, technical reviews. You end up with a clear written concept — not just slides.",
					includes: [
						"Capturing and sorting your requirements",
						"Architecture and requirements workshops",
						"Code and stack reviews with documented recommendations",
						"Written concepts and decision-making input"
					],
					highlight: false
				},
				{
					title: "Web & App Development",
					rate: 105,
					description: "Frontend, backend, mobile and desktop apps. Cleanly built, tested, documented – still maintainable in two years.",
					includes: [
						"Component development (React, Vue, Angular)",
						"API and backend development (Node.js, C#, SQL)",
						"Mobile and desktop apps",
						"Tests, CI/CD and documentation included"
					],
					highlight: true
				},
				{
					title: "Digitalization & Automation",
					rate: 105,
					description: "Replacing manual processes with workflows, data pipelines and integrations. Concrete work, no PowerPoint.",
					includes: [
						"On-site or remote process analysis",
						"Workflow automation (Python, KNIME, n8n)",
						"Data pipelines, ETL and SQL reporting",
						"Integration of existing tools and systems"
					],
					highlight: false
				},
				{
					title: "Maintenance & Support",
					rate: 85,
					description: "Maintaining existing systems, rolling out updates, fixing bugs. Response times by agreement.",
					includes: [
						"Bug fixes and hotfixes",
						"Dependency and security updates",
						"Monitoring and performance optimization",
						"Optional monthly retainer model"
					],
					highlight: false
				},
				{
					title: "Workshops & Training",
					rate: 135,
					description: "Sharing knowledge instead of hoarding it. Workshops for your team – from TypeScript basics to architecture.",
					includes: [
						"On-site or remote workshops",
						"Tailored training materials",
						"Hands-on exercises with your real code",
						"Follow-up call and recording included"
					],
					highlight: false
				}
			],
			notesTitle: "Good to know",
			notes: [
				"All prices exclude German VAT (19 %).",
				"Day rate available on request — discount for 5+ days per month.",
				"Fixed price possible when the scope is clear up front.",
				"Travel costs are billed separately."
			],
			ctaTitle: "Sounds like a fit?",
			ctaSub: "Tell me briefly what it's about. I'll tell you honestly whether and how I can help.",
			ctaButton: "Get in touch",
			back: "Back"
		},
		consulting: {
			label: "— Consulting",
			headline: "Listen first,",
			headlineAccent: "build after.",
			body: "Maybe you have a clear plan, maybe just a feeling that something ought to be simpler. Either is a good place to start.",
			primaryCta: "Get in touch",
			secondaryCta: "See services"
		},
		footer: {
			slogan: "Digital solutions that truly fit.",
			tagline: "Personal, tailored, all from one source — from Schwarzenbek near Hamburg.",
			nav: "Navigation",
			contactTitle: "Contact",
			copyright: "© 2026 Tracht Digital Solutions. All rights reserved.",
			impressum: "Legal Notice",
			datenschutz: "Privacy Policy",
			pricing: "Pricing"
		},
		errors: {
			name: "Please enter your name.",
			email: "Please enter a valid email address.",
			message: "At least 20 characters, please.",
			consent: "Consent required."
		},
		cookieNotice: {
			label: "Cookie and privacy notice",
			siteText: "This website does not use tracking cookies. Only technically necessary preferences (e.g. your colour scheme) are stored locally in your browser.",
			panelText: "This area only uses one technically necessary cookie for secure sign-in (session cookie). No tracking takes place.",
			privacy: "More in the privacy policy.",
			accept: "Got it",
			consentText: "This blog shows advertising from Google AdSense. With your consent — and only then — cookies and similar technologies are set for advertising. Your choice is free and can be changed at any time.",
			consentAccept: "Accept",
			consentDecline: "Decline"
		},
		toast: { dismiss: "Dismiss" }
	}
};
var DEFAULT_STORAGE_KEY = "tds-cookie-notice";
var DEFAULT_PRIVACY_URL = "https://tracht-digital.de/legal/datenschutz";
var AD_CONSENT_KEY = "tds-ad-consent";
var AD_CONSENT_EVENT = "tds-ad-consent";
function getAdConsent() {
	if (typeof window === "undefined") return null;
	try {
		const v = window.localStorage.getItem(AD_CONSENT_KEY);
		return v === "granted" || v === "denied" ? v : null;
	} catch {
		return null;
	}
}
function setAdConsent(value) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(AD_CONSENT_KEY, value);
	} catch {}
	try {
		window.dispatchEvent(new CustomEvent(AD_CONSENT_EVENT, { detail: value }));
	} catch {}
}
function CookieNotice({ lang = "de", variant = "site", consent = false, privacyUrl = DEFAULT_PRIVACY_URL, storageKey = DEFAULT_STORAGE_KEY } = {}) {
	const [visible, setVisible] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		try {
			if (consent) {
				if (getAdConsent() !== null) return;
			} else if (localStorage.getItem(storageKey) === "1") return;
		} catch {}
		setVisible(true);
	}, [consent, storageKey]);
	useEffect(() => {
		const el = ref.current;
		if (!visible || !el || typeof window === "undefined") return;
		const root = document.documentElement;
		const publish = () => {
			root.style.setProperty("--tds-bottom-lane", `${Math.ceil(el.getBoundingClientRect().height)}px`);
		};
		publish();
		const ro = typeof ResizeObserver === "function" ? new ResizeObserver(publish) : null;
		ro?.observe(el);
		window.addEventListener("resize", publish);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", publish);
			root.style.removeProperty("--tds-bottom-lane");
		};
	}, [visible]);
	if (!visible) return null;
	const t = translations[lang].cookieNotice;
	const dismiss = () => {
		setVisible(false);
		try {
			localStorage.setItem(storageKey, "1");
		} catch {}
	};
	const decide = (value) => {
		setVisible(false);
		setAdConsent(value);
	};
	return /* @__PURE__ */ jsxs("aside", {
		ref,
		className: "cookie-notice",
		role: "region",
		"aria-label": t.label,
		children: [/* @__PURE__ */ jsxs("p", {
			className: "cookie-notice-text",
			children: [
				consent ? t.consentText : variant === "panel" ? t.panelText : t.siteText,
				" ",
				/* @__PURE__ */ jsx("a", {
					className: "cookie-notice-link",
					href: privacyUrl,
					children: t.privacy
				})
			]
		}), consent ? /* @__PURE__ */ jsxs("div", {
			className: "cookie-notice-actions",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "cookie-notice-btn cookie-notice-btn--ghost",
				onClick: () => decide("denied"),
				children: t.consentDecline
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "cookie-notice-btn",
				onClick: () => decide("granted"),
				children: t.consentAccept
			})]
		}) : /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "cookie-notice-btn",
			onClick: dismiss,
			children: t.accept
		})]
	});
}
var RUNTIME_CONFIG_PATH = "/tds-runtime.json";
var STATE_KEY = /* @__PURE__ */ Symbol.for("@tracht-digital-solutions/tds-shared:api-state");
var state = (() => {
	const host = globalThis;
	const existing = host[STATE_KEY];
	if (existing !== void 0) return existing;
	const fresh = {
		cached: null,
		runtimePromise: null,
		runtimeValue: null,
		onUnauthorized: null,
		headersProvider: null
	};
	host[STATE_KEY] = fresh;
	return fresh;
})();
var trimEnd = (value) => value.replace(/\/+$/, "");
function apiBase() {
	if (state.cached !== null) return state.cached;
	const env = typeof import.meta !== "undefined" ? Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_FRONTEND_TARGET": "admin",
		"SITE": void 0,
		"SSR": true
	}, {
		CI: "true",
		_: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm",
		PATH: "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.bin:/home/runner/work/tds-admin-frontend/node_modules/.bin:/home/runner/work/node_modules/.bin:/home/runner/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/opt/hostedtoolcache/node/22.23.2/x64/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/opt/hostedtoolcache/node/22.23.2/x64/bin:/snap/bin:/home/runner/.local/bin:/opt/pipx_bin:/home/runner/.cargo/bin:/home/runner/.config/composer/vendor/bin:/usr/local/.ghcup/bin:/home/runner/.dotnet/tools:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
	})?.PUBLIC_API_BASE ?? "" : "";
	if (typeof document === "undefined") return trimEnd(env || "https://api.tracht-digital.de");
	let meta = "";
	try {
		meta = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	state.cached = trimEnd(meta.trim() || env || "https://api.tracht-digital.de");
	return state.cached;
}
async function runtimeConfig() {
	if (state.runtimePromise !== null) return state.runtimePromise;
	if (typeof document === "undefined" || typeof fetch !== "function") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	let declared = "";
	try {
		declared = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	if (declared.trim() !== "") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	state.runtimePromise = (async () => {
		try {
			const res = await fetch(RUNTIME_CONFIG_PATH, {
				credentials: "same-origin",
				headers: { Accept: "application/json" },
				signal: typeof AbortSignal?.timeout === "function" ? AbortSignal.timeout(3e3) : void 0
			});
			if (!res.ok) return null;
			if (!(res.headers.get("content-type") ?? "").includes("json")) return null;
			const parsed = await res.json();
			if (parsed === null || typeof parsed !== "object") return null;
			const config = parsed;
			if (typeof config.apiBase === "string" && config.apiBase !== "") state.cached = trimEnd(config.apiBase);
			state.runtimeValue = config;
			return config;
		} catch {
			return null;
		}
	})();
	return state.runtimePromise;
}
function apiUrl(path) {
	if (/^(https?:)?\/\//i.test(path)) return path;
	return `${apiBase()}${path.startsWith("/") ? "" : "/"}${path}`;
}
async function apiFetch(path, init = {}) {
	await runtimeConfig();
	const url = apiUrl(path);
	let extra = {};
	if (state.headersProvider !== null) try {
		extra = state.headersProvider(url);
	} catch {}
	const res = await fetch(url, {
		credentials: "include",
		...init,
		headers: {
			...extra,
			...init.headers
		}
	});
	if (res.status === 401 && state.onUnauthorized !== null) try {
		await state.onUnauthorized(url);
	} catch {}
	return res;
}
var STR = {
	de: {
		close: "Schließen",
		hide: "Ausblenden",
		chat: "Chat",
		faq: "FAQ",
		docs: "Hilfe",
		contact: "Kontakt",
		startPrompt: "Schreib uns – wir antworten so schnell wie möglich.",
		namePh: "Name (optional)",
		emailPh: "E-Mail (optional)",
		msgPh: "Nachricht …",
		send: "Senden",
		start: "Chat starten",
		subjectPh: "Betreff (optional)",
		contactMsgPh: "Deine Nachricht …",
		contactSend: "Absenden",
		contactOk: "Danke! Wir melden uns.",
		contactErr: "Bitte Name, gültige E-Mail und eine Nachricht (min. 20 Zeichen) angeben.",
		rate: "Zu viele Anfragen – bitte später erneut versuchen.",
		empty: "Noch keine Nachrichten."
	},
	en: {
		close: "Close",
		hide: "Hide",
		chat: "Chat",
		faq: "FAQ",
		docs: "Help",
		contact: "Contact",
		startPrompt: "Message us – we reply as soon as we can.",
		namePh: "Name (optional)",
		emailPh: "Email (optional)",
		msgPh: "Message …",
		send: "Send",
		start: "Start chat",
		subjectPh: "Subject (optional)",
		contactMsgPh: "Your message …",
		contactSend: "Submit",
		contactOk: "Thanks! We'll be in touch.",
		contactErr: "Please provide a name, a valid email and a message (min. 20 chars).",
		rate: "Too many requests – please try again later.",
		empty: "No messages yet."
	}
};
var HIDDEN_KEY = "tds-live-chat-hidden";
var POLL_MS = 4e3;
function LiveChatCta({ frontend, apiBase: apiBase2, lang = "de" }) {
	const t = STR[lang === "en" ? "en" : "de"];
	const [config, setConfig] = useState(null);
	const [hidden, setHidden] = useState(true);
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState("chat");
	const launcherRef = useRef(null);
	const api = useCallback((path, init) => apiBase2 ? fetch(`${apiBase2}${path}`, {
		credentials: "include",
		...init
	}) : apiFetch(path, init), [apiBase2]);
	useEffect(() => {
		let alive = true;
		let dismissed = false;
		try {
			dismissed = localStorage.getItem(`${HIDDEN_KEY}:${frontend}`) === "1";
		} catch {}
		api(`/live-chat-cta/config?frontend=${encodeURIComponent(frontend)}&lang=${lang}`).then((r) => r.ok ? r.json() : null).then((d) => {
			if (!alive || !d || !d.enabled) return;
			setConfig(d);
			setHidden(dismissed);
			const first = [
				"chat",
				"faq",
				"docs",
				"contact"
			].find((k) => d.tabs[k]);
			if (first) setTab(first);
		}).catch(() => {});
		return () => {
			alive = false;
		};
	}, [
		api,
		frontend,
		lang
	]);
	useEffect(() => {
		const el = launcherRef.current;
		const root = typeof document === "undefined" ? null : document.documentElement;
		if (!root) return;
		if (!el || open || hidden || !config) {
			root.style.removeProperty("--tds-right-lane");
			return;
		}
		const publish = () => {
			root.style.setProperty("--tds-right-lane", `${Math.ceil(el.getBoundingClientRect().height)}px`);
		};
		publish();
		const ro = typeof ResizeObserver === "function" ? new ResizeObserver(publish) : null;
		ro?.observe(el);
		window.addEventListener("resize", publish);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", publish);
			root.style.removeProperty("--tds-right-lane");
		};
	}, [
		config,
		hidden,
		open
	]);
	const hide = () => {
		setHidden(true);
		setOpen(false);
		try {
			localStorage.setItem(`${HIDDEN_KEY}:${frontend}`, "1");
		} catch {}
	};
	if (!config || hidden) return null;
	const enabledTabs = [
		"chat",
		"faq",
		"docs",
		"contact"
	].filter((k) => config.tabs[k]);
	if (enabledTabs.length === 0) return null;
	const accent = config.cta.accent || "#050f68";
	if (!open) return /* @__PURE__ */ jsxs("div", {
		ref: launcherRef,
		className: "live-chat-cta live-chat-cta--closed",
		style: { "--lc-accent": accent },
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "live-chat-cta__launcher",
			onClick: () => setOpen(true),
			children: [/* @__PURE__ */ jsx("span", {
				className: "live-chat-cta__launcher-icon",
				"aria-hidden": "true",
				children: "💬"
			}), /* @__PURE__ */ jsx("span", {
				className: "live-chat-cta__launcher-label",
				children: config.cta.label
			})]
		}), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "live-chat-cta__hide",
			onClick: hide,
			"aria-label": t.hide,
			title: t.hide,
			children: "×"
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta live-chat-cta--open",
		style: { "--lc-accent": accent },
		role: "dialog",
		"aria-label": config.cta.label,
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "live-chat-cta__head",
				children: [/* @__PURE__ */ jsx("span", {
					className: "live-chat-cta__title",
					children: config.cta.label
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "live-chat-cta__close",
					onClick: () => setOpen(false),
					"aria-label": t.close,
					title: t.close,
					children: "−"
				})]
			}),
			enabledTabs.length > 1 ? /* @__PURE__ */ jsx("nav", {
				className: "live-chat-cta__tabs",
				role: "tablist",
				children: enabledTabs.map((k) => /* @__PURE__ */ jsx("button", {
					type: "button",
					role: "tab",
					"aria-selected": tab === k,
					className: tab === k ? "is-active" : "",
					onClick: () => setTab(k),
					children: t[k]
				}, k))
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "live-chat-cta__body",
				children: [
					tab === "chat" && config.tabs.chat ? /* @__PURE__ */ jsx(ChatPane, {
						api,
						frontend,
						greeting: config.cta.greeting,
						t
					}) : null,
					tab === "faq" && config.tabs.faq ? /* @__PURE__ */ jsx(FaqPane, { faqs: config.faqs }) : null,
					tab === "docs" && config.tabs.docs ? /* @__PURE__ */ jsx(DocsPane, { docs: config.docs }) : null,
					tab === "contact" && config.tabs.contact ? /* @__PURE__ */ jsx(ContactPane, {
						api,
						frontend,
						t
					}) : null
				]
			})
		]
	});
}
function sessionKey(frontend) {
	return `tds-live-chat-session:${frontend}`;
}
function ChatPane({ api, frontend, greeting, t }) {
	const [session, setSession] = useState(null);
	const [messages, setMessages] = useState([]);
	const [draft, setDraft] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [busy, setBusy] = useState(false);
	const endRef = useRef(null);
	const cursor = useRef(0);
	useEffect(() => {
		try {
			const raw = localStorage.getItem(sessionKey(frontend));
			if (raw) setSession(JSON.parse(raw));
		} catch {}
	}, [frontend]);
	const poll = useCallback(async () => {
		if (!session) return;
		const res = await api(`/live-chat-cta/chat/${session.id}/messages?since=${cursor.current}`, { headers: { "X-Chat-Token": session.token } });
		if (res.ok) {
			const incoming = (await res.json()).messages ?? [];
			if (incoming.length > 0) {
				cursor.current = incoming[incoming.length - 1].id;
				setMessages((m) => [...m, ...incoming]);
			}
		}
	}, [api, session]);
	useEffect(() => {
		if (!session) return;
		poll();
		const timer = setInterval(() => void poll(), POLL_MS);
		return () => clearInterval(timer);
	}, [session, poll]);
	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	const start = async () => {
		const body = draft.trim();
		if (!body) return;
		setBusy(true);
		const res = await api("/live-chat-cta/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				email,
				frontend,
				message: body
			})
		});
		setBusy(false);
		if (res.ok) {
			const d = await res.json();
			const s = {
				id: d.id,
				token: d.token
			};
			try {
				localStorage.setItem(sessionKey(frontend), JSON.stringify(s));
			} catch {}
			setSession(s);
			setDraft("");
		}
	};
	const send = async () => {
		if (!session) return;
		const body = draft.trim();
		if (!body) return;
		setBusy(true);
		const res = await api(`/live-chat-cta/chat/${session.id}/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Chat-Token": session.token
			},
			body: JSON.stringify({ body })
		});
		setBusy(false);
		if (res.ok) {
			setDraft("");
			await poll();
		}
	};
	if (!session) return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__chat",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__greeting",
				children: greeting
			}),
			/* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__hint",
				children: t.startPrompt
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: t.namePh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: t.emailPh
			}),
			/* @__PURE__ */ jsx("textarea", {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: t.msgPh,
				rows: 3
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: start,
				disabled: busy || !draft.trim(),
				children: t.start
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__chat",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "live-chat-cta__messages",
			children: [
				messages.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "live-chat-cta__hint",
					children: greeting
				}) : null,
				messages.map((m) => /* @__PURE__ */ jsx("div", {
					className: `live-chat-cta__msg live-chat-cta__msg--${m.author}`,
					children: m.body
				}, m.id)),
				/* @__PURE__ */ jsx("div", { ref: endRef })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "live-chat-cta__compose",
			children: [/* @__PURE__ */ jsx("textarea", {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: t.msgPh,
				rows: 2,
				onKeyDown: (e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						send();
					}
				}
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: send,
				disabled: busy || !draft.trim(),
				children: t.send
			})]
		})]
	});
}
function FaqPane({ faqs }) {
	const [open, setOpen] = useState(null);
	if (faqs.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__hint",
		children: "—"
	});
	return /* @__PURE__ */ jsx("ul", {
		className: "live-chat-cta__faq",
		children: faqs.map((f) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			"aria-expanded": open === f.id,
			onClick: () => setOpen(open === f.id ? null : f.id),
			children: f.question
		}), open === f.id ? /* @__PURE__ */ jsx(Prose, {
			text: f.answer,
			className: "live-chat-cta__faq-answer"
		}) : null] }, f.id))
	});
}
function DocsPane({ docs }) {
	const [active, setActive] = useState(null);
	if (docs.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__hint",
		children: "—"
	});
	const current = docs.find((d) => d.id === active) ?? null;
	if (current) return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__doc",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "live-chat-cta__back",
				onClick: () => setActive(null),
				children: "← "
			}),
			/* @__PURE__ */ jsx("h4", { children: current.title }),
			/* @__PURE__ */ jsx(Prose, {
				text: current.body_markdown,
				className: "live-chat-cta__doc-body"
			})
		]
	});
	return /* @__PURE__ */ jsx("ul", {
		className: "live-chat-cta__docs",
		children: docs.map((d) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => setActive(d.id),
			children: d.title
		}) }, d.id))
	});
}
function ContactPane({ api, frontend, t }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [website, setWebsite] = useState("");
	const [busy, setBusy] = useState(false);
	const [status, setStatus] = useState(null);
	const [done, setDone] = useState(false);
	const submit = async () => {
		setBusy(true);
		setStatus(null);
		const res = await api("/live-chat-cta/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				email,
				subject,
				message,
				frontend,
				website
			})
		});
		setBusy(false);
		if (res.ok) setDone(true);
		else if (res.status === 429) setStatus(t.rate);
		else setStatus(t.contactErr);
	};
	if (done) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__ok",
		children: t.contactOk
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__contact",
		children: [
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: t.namePh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: t.emailPh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: subject,
				onChange: (e) => setSubject(e.target.value),
				placeholder: t.subjectPh
			}),
			/* @__PURE__ */ jsx("textarea", {
				value: message,
				onChange: (e) => setMessage(e.target.value),
				placeholder: t.contactMsgPh,
				rows: 4
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: website,
				onChange: (e) => setWebsite(e.target.value),
				tabIndex: -1,
				autoComplete: "off",
				"aria-hidden": "true",
				style: {
					position: "absolute",
					left: "-9999px",
					width: 1,
					height: 1,
					opacity: 0
				}
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__err",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: submit,
				disabled: busy,
				children: t.contactSend
			})
		]
	});
}
function Prose({ text, className }) {
	const paragraphs = text.split(/\n{2,}/);
	return /* @__PURE__ */ jsx("div", {
		className,
		children: paragraphs.map((p, i) => /* @__PURE__ */ jsx("p", { children: p.split("\n").map((line, j) => /* @__PURE__ */ jsxs("span", { children: [line, j < p.split("\n").length - 1 ? /* @__PURE__ */ jsx("br", {}) : null] }, j)) }, i))
	});
}
var TOAST_EVENT = "tds:toast";
var TOAST_DURATIONS = {
	success: 4e3,
	info: 5e3,
	warning: 8e3,
	danger: 1e4
};
function showToast(detail) {
	if (typeof window === "undefined") return;
	const w = window;
	const normalised = {
		...detail,
		variant: resolveToastVariant(detail.variant)
	};
	try {
		w.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: normalised }));
	} catch {}
	try {
		if (!w.__tdsToastReady) (w.__tdsToastQueue ??= []).push(normalised);
	} catch {}
}
var raise = (variant) => (message, opts = {}) => showToast({
	...opts,
	variant,
	message
});
var toast = {
	success: raise("success"),
	warning: raise("warning"),
	danger: raise("danger"),
	info: raise("info")
};
var ICONS = {
	success: "M16.7 5.8a.9.9 0 010 1.3l-7.2 7.2a.9.9 0 01-1.3 0L4.3 10.4a.9.9 0 111.3-1.3l3.2 3.2 6.6-6.5a.9.9 0 011.3 0z",
	danger: "M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a.9.9 0 01.9.9v4.4a.9.9 0 01-1.8 0V6.9A.9.9 0 0110 6zm0 8.4a1.1 1.1 0 100-2.2 1.1 1.1 0 000 2.2z",
	warning: "M9.1 3.1a1 1 0 011.8 0l7 12.4a1 1 0 01-.9 1.5H3a1 1 0 01-.9-1.5l7-12.4zM10 7a.9.9 0 00-.9.9v3.4a.9.9 0 001.8 0V7.9A.9.9 0 0010 7zm0 7.6a1.05 1.05 0 100-2.1 1.05 1.05 0 000 2.1z",
	info: "M10 2a8 8 0 100 16 8 8 0 000-16zm0 3.4a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm0 3.7a.9.9 0 01.9.9v4a.9.9 0 01-1.8 0v-4a.9.9 0 01.9-.9z"
};
var isUrgent = (variant) => variant === "danger";
var safeHref = (href) => typeof href === "string" && /^\/(?!\/)/.test(href) ? href : null;
var nextId = 1;
function ToastHost({ lang = "de" } = {}) {
	const [items, setItems] = useState([]);
	const [paused, setPaused] = useState(false);
	const [duplicate, setDuplicate] = useState(false);
	const timers = useRef(/* @__PURE__ */ new Map());
	const dismiss = useCallback((id) => {
		const timer = timers.current.get(id);
		if (timer?.handle !== void 0 && timer.handle !== null) clearTimeout(timer.handle);
		timers.current.delete(id);
		setItems((prev) => prev.filter((item) => item.id !== id));
	}, []);
	const push = useCallback((detail) => {
		const variant = resolveToastVariant(detail.variant);
		const message = String(detail.message ?? "");
		if (message === "") return;
		const dedupe = detail.key ?? `${variant}:${message}`;
		const duration = detail.duration ?? TOAST_DURATIONS[variant] ?? TOAST_DURATIONS.info;
		const href = safeHref(detail.href) ?? void 0;
		setItems((prev) => {
			const existing = prev.find((item2) => item2.dedupe === dedupe);
			if (existing) return prev.map((item2) => item2.id === existing.id ? {
				...item2,
				count: item2.count + 1,
				message,
				href
			} : item2);
			const item = {
				variant,
				message,
				dedupe,
				duration,
				href,
				id: nextId++,
				count: 1
			};
			const sameRegion = prev.filter((other) => isUrgent(other.variant) === isUrgent(variant));
			if (sameRegion.length >= 3) {
				const oldest = sameRegion[0];
				return [...prev.filter((other) => other.id !== oldest?.id), item];
			}
			return [...prev, item];
		});
	}, []);
	useEffect(() => {
		const w = window;
		if (w.__tdsToastHostMounted) {
			setDuplicate(true);
			console.warn("[tds] A second ToastHost was mounted — only the first renders toasts.");
			return;
		}
		w.__tdsToastHostMounted = true;
		const onToast = (event) => {
			const detail = event.detail;
			if (detail && typeof detail.message === "string") push(detail);
		};
		window.addEventListener(TOAST_EVENT, onToast);
		w.__tdsToastReady = true;
		const queued = w.__tdsToastQueue ?? [];
		w.__tdsToastQueue = [];
		for (const detail of queued) push(detail);
		return () => {
			window.removeEventListener(TOAST_EVENT, onToast);
			w.__tdsToastReady = false;
			w.__tdsToastHostMounted = false;
		};
	}, [push]);
	useEffect(() => {
		const handles = timers.current;
		for (const item of items) {
			if (item.duration <= 0) continue;
			const existing = handles.get(item.id);
			if (!existing || existing.count !== item.count) {
				if (existing?.handle !== void 0 && existing?.handle !== null) clearTimeout(existing.handle);
				handles.set(item.id, {
					handle: null,
					startedAt: 0,
					remaining: item.duration,
					count: item.count
				});
			}
		}
		for (const [id, timer] of [...handles]) {
			if (items.some((item) => item.id === id)) continue;
			if (timer.handle !== null) clearTimeout(timer.handle);
			handles.delete(id);
		}
		for (const [id, timer] of handles) if (paused) {
			if (timer.handle === null) continue;
			clearTimeout(timer.handle);
			timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
			timer.handle = null;
		} else if (timer.handle === null) {
			timer.startedAt = Date.now();
			timer.handle = setTimeout(() => {
				handles.delete(id);
				setItems((prev) => prev.filter((other) => other.id !== id));
			}, timer.remaining);
		}
	}, [items, paused]);
	useEffect(() => {
		const handles = timers.current;
		return () => {
			for (const timer of handles.values()) if (timer.handle !== null) clearTimeout(timer.handle);
			handles.clear();
		};
	}, []);
	if (duplicate) return null;
	const t = translations[lang].toast;
	const urgent = items.filter((item) => isUrgent(item.variant));
	const polite = items.filter((item) => !isUrgent(item.variant));
	const renderToast = (item) => /* @__PURE__ */ jsxs("div", {
		className: `tds-toast tds-toast--${item.variant}`,
		children: [
			/* @__PURE__ */ jsx("svg", {
				className: "tds-toast__icon",
				"aria-hidden": "true",
				viewBox: "0 0 20 20",
				fill: "currentColor",
				children: /* @__PURE__ */ jsx("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: ICONS[item.variant]
				})
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "tds-toast__message",
				children: [item.href ? /* @__PURE__ */ jsx("a", {
					className: "tds-toast__link",
					href: item.href,
					children: item.message
				}) : item.message, item.count > 1 ? /* @__PURE__ */ jsxs("span", {
					className: "tds-toast__count",
					children: ["×", item.count]
				}) : null]
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "tds-toast__dismiss",
				"aria-label": t.dismiss,
				title: t.dismiss,
				onClick: () => dismiss(item.id),
				children: /* @__PURE__ */ jsx("svg", {
					"aria-hidden": "true",
					viewBox: "0 0 20 20",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					children: /* @__PURE__ */ jsx("path", {
						d: "M5 5l10 10M15 5L5 15",
						strokeLinecap: "round"
					})
				})
			})
		]
	}, item.id);
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-toast-host",
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		onFocus: () => setPaused(true),
		onBlur: () => setPaused(false),
		children: [/* @__PURE__ */ jsx("div", {
			className: "tds-toast-region",
			role: "alert",
			"aria-live": "assertive",
			"aria-relevant": "additions",
			children: urgent.map(renderToast)
		}), /* @__PURE__ */ jsx("div", {
			className: "tds-toast-region",
			role: "status",
			"aria-live": "polite",
			"aria-relevant": "additions",
			children: polite.map(renderToast)
		})]
	});
}
function Skeleton({ width = "100%", height = "1em", radius, circle = false, className, style }) {
	const classes = ["tds-skeleton"];
	if (circle) classes.push("tds-skeleton--circle");
	if (className) classes.push(className);
	const merged = {
		width,
		height,
		...style
	};
	if (radius != null) merged.borderRadius = radius;
	return /* @__PURE__ */ jsx("span", {
		className: classes.join(" "),
		style: merged,
		"aria-hidden": "true"
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/astro/index.js
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
var themeBootstrapScript = `(function () {
  function apply(root) {
    try {
      var saved = localStorage.getItem("${THEME_STORAGE_KEY}");
      if (saved === "light" || saved === "dark") {
        root.setAttribute("${THEME_ATTRIBUTE}", saved);
        return;
      }
    } catch (e) { /* storage disabled \u2014 fall through to OS */ }
    var dark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("${THEME_ATTRIBUTE}", dark ? "dark" : "light");
  }
  apply(document.documentElement);
  document.addEventListener("astro:before-swap", function (event) {
    apply(event.newDocument.documentElement);
  });
})();`;
//#endregion
//#region node_modules/astro/components/ClientRouter.astro
createAstro("https://astro.build");
var $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ClientRouter;
	const { fallback = "animate" } = Astro.props;
	return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/astro/components/ClientRouter.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/config/target.ts
var FRONTEND_TARGET = "admin";
var HINT_PREFIX = "tds_admin";
var BRAND_SUFFIX = "Panel";
var LOGIN_URL = "https://auth.tracht-digital.de";
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/BrandWordmark.astro
createAstro("https://astro.build");
var $$BrandWordmark = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BrandWordmark;
	const { class: className = "text-lg" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<strong${addAttribute(["brand-wordmark", className], "class:list")}>Tracht<span class="accent-italic"> ${BRAND_SUFFIX}</span></strong>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/BrandWordmark.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/Icon.astro
createAstro("https://astro.build");
var $$Icon = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Icon;
	const { name, size = 18, class: className } = Astro.props;
	const PATHS = {
		"layout-dashboard": "<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\"/><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\"/>",
		users: "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>",
		settings: "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
		"external-link": "<path d=\"M15 3h6v6\"/><path d=\"M10 14 21 3\"/><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/>",
		package: "<path d=\"m7.5 4.27 9 5.15\"/><path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\"/><path d=\"m3.3 7 8.7 5 8.7-5\"/><path d=\"M12 22V12\"/>",
		"life-buoy": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m4.93 4.93 4.24 4.24\"/><path d=\"m14.83 9.17 4.24-4.24\"/><path d=\"m14.83 14.83 4.24 4.24\"/><path d=\"m9.17 14.83-4.24 4.24\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/>",
		"file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M10 9H8\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/>",
		"book-open": "<path d=\"M12 7v14\"/><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\"/>",
		inbox: "<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\"/><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/>",
		receipt: "<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z\"/><path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\"/><path d=\"M12 17.5v-11\"/>",
		"message-circle": "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\"/>",
		"message-square": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>",
		"folder-kanban": "<path d=\"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z\"/><path d=\"M8 10v4\"/><path d=\"M12 10v2\"/><path d=\"M16 10v6\"/>",
		"folder-cog": "<path d=\"M10.5 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.5\"/><circle cx=\"18\" cy=\"18\" r=\"3\"/><path d=\"M18 14.5V14\"/><path d=\"M18 22v-.5\"/><path d=\"m21.03 16.25-.4.25\"/><path d=\"m15.37 19.5-.4.25\"/><path d=\"m15.37 16.5.4.25\"/><path d=\"m20.63 19.75.4.25\"/>",
		clock: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>",
		wrench: "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/>",
		layout: "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M9 21V9\"/>",
		square: "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/>",
		"chevrons-left": "<path d=\"m11 17-5-5 5-5\"/><path d=\"m18 17-5-5 5-5\"/>",
		"chevrons-right": "<path d=\"m6 17 5-5-5-5\"/><path d=\"m13 17 5-5-5-5\"/>",
		"chevron-up": "<path d=\"m18 15-6-6-6 6\"/>",
		"chevron-down": "<path d=\"m6 9 6 6 6-6\"/>",
		user: "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>",
		"log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><polyline points=\"16 17 21 12 16 7\"/><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"/>",
		"key-round": "<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\"/><circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/>",
		shield: "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>",
		bell: "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\"/><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\"/>",
		palette: "<circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\"/><path d=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z\"/>",
		building: "<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\" ry=\"2\"/><path d=\"M9 22v-4h6v4\"/><path d=\"M8 6h.01\"/><path d=\"M16 6h.01\"/><path d=\"M12 6h.01\"/><path d=\"M12 10h.01\"/><path d=\"M12 14h.01\"/><path d=\"M16 10h.01\"/><path d=\"M16 14h.01\"/><path d=\"M8 10h.01\"/><path d=\"M8 14h.01\"/>"
	};
	const body = name && PATHS[name] || PATHS.square;
	return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(size, "width")}${addAttribute(size, "height")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${addAttribute(className, "class")}>${unescapeHTML(body)}</svg>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/Icon.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/lib/auth.ts
var AUTHED_HINT_KEY = `${HINT_PREFIX}_authed`;
var AUTHED_EXP_KEY = `${HINT_PREFIX}_authed_exp`;
var CONFIRMED_KEY = `${HINT_PREFIX}_confirmed`;
var CONFIRM_TTL_MS = 6e4;
var AUTH_API_URL = "https://api.tracht-digital.de/auth";
var API_BASE = "https://api.tracht-digital.de";
var CUSTOMER_API_URL = `${API_BASE}/customer`;
function setAuthed(expiresAt) {
	try {
		localStorage.setItem(AUTHED_HINT_KEY, "1");
		if (expiresAt) localStorage.setItem(AUTHED_EXP_KEY, String(expiresAt));
		localStorage.setItem(CONFIRMED_KEY, String(Date.now() + CONFIRM_TTL_MS));
	} catch {}
}
function clearAuthed() {
	try {
		localStorage.removeItem(AUTHED_HINT_KEY);
		localStorage.removeItem(AUTHED_EXP_KEY);
		localStorage.removeItem(CONFIRMED_KEY);
	} catch {}
}
function companyIdOf(company) {
	return company.companyId ?? company.customerId ?? null;
}
function membershipIds(me, only) {
	return (me?.companies ?? []).filter((c) => only === void 0 || only(c)).map(companyIdOf).filter((id) => id !== null);
}
var mePromise = null;
async function fetchMe() {
	if (mePromise === null) {
		mePromise = (async () => {
			try {
				const res = await fetch(`${AUTH_API_URL}/me`, { credentials: "include" });
				return res.ok ? await res.json() : null;
			} catch {
				return null;
			}
		})();
		mePromise = mePromise.then((me) => {
			if (me === null) mePromise = null;
			return me;
		});
	}
	return mePromise;
}
function invalidateMe() {
	mePromise = null;
}
var redirecting = false;
function redirectToLogin() {
	if (redirecting) return;
	redirecting = true;
	clearAuthed();
	try {
		document.documentElement.classList.add("auth-checking");
	} catch {}
	const next = encodeURIComponent(location.href);
	location.replace(`${LOGIN_URL}?next=${next}`);
}
async function tryRefresh() {
	try {
		if (!(await fetch(`https://api.tracht-digital.de/auth/refresh`, {
			method: "POST",
			credentials: "include"
		})).ok) return false;
		if (!(await fetch(`https://api.tracht-digital.de/auth/me`, { credentials: "include" })).ok) return false;
		setAuthed();
		return true;
	} catch {
		return false;
	}
}
async function onUnauthorized(requestUrl) {
	if (requestUrl.startsWith(`https://api.tracht-digital.de/auth/me`)) {
		if (!await tryRefresh()) redirectToLogin();
		return;
	}
	if (!(await fetch(`https://api.tracht-digital.de/auth/me`, { credentials: "include" })).ok && !await tryRefresh()) redirectToLogin();
}
async function frontendFetch(input, init = {}) {
	const url = typeof input === "string" ? input : input.toString();
	const res = await fetch(url, {
		credentials: "include",
		...init
	});
	if (res.status === 401) await onUnauthorized(url);
	return res;
}
async function logout() {
	try {
		await fetch(`${AUTH_API_URL}/logout`, {
			method: "DELETE",
			credentials: "include"
		});
	} catch {}
	invalidateMe();
	clearAuthed();
	location.replace(LOGIN_URL);
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/lib/activeCompany.ts
var KEY = `${HINT_PREFIX}_active_company`;
/** The stored selection, or null when there is none. */
function getActiveCompany() {
	try {
		const raw = localStorage.getItem(KEY);
		if (raw === null) return null;
		const id = Number.parseInt(raw, 10);
		return Number.isFinite(id) && id > 0 ? id : null;
	} catch {
		return null;
	}
}
/** Store a selection, or clear it with `null`. */
function setActiveCompany(id) {
	try {
		if (id === null) localStorage.removeItem(KEY);
		else localStorage.setItem(KEY, String(id));
	} catch {}
}
/**
* The selection to actually use, given what the principal may act as.
*
* A stored id that is no longer a membership is discarded (and cleared), so
* losing access to a company does not leave the panel pinned to it — the
* server would refuse and every list would come back empty with nothing on
* screen to explain why.
*/
function resolveActiveCompany(allowed) {
	const stored = getActiveCompany();
	if (stored !== null && allowed.includes(stored)) return stored;
	if (stored !== null) setActiveCompany(null);
	return allowed[0] ?? null;
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/UserMenu.tsx
/** Menu geometry that has to match `.tds-dropdown` in tds-shared. */
var ICON = {
	user: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ jsx("circle", {
		cx: "12",
		cy: "7",
		r: "4"
	})] }),
	key: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("path", { d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" }), /* @__PURE__ */ jsx("circle", {
		cx: "16.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor"
	})] }),
	logout: /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
		/* @__PURE__ */ jsx("polyline", { points: "16 17 21 12 16 7" }),
		/* @__PURE__ */ jsx("line", {
			x1: "21",
			x2: "9",
			y1: "12",
			y2: "12"
		})
	] }),
	chevron: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" }),
	building: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("rect", {
		width: "16",
		height: "20",
		x: "4",
		y: "2",
		rx: "2"
	}), /* @__PURE__ */ jsx("path", { d: "M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" })] }),
	check: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" })
};
function Glyph({ children, size = 16 }) {
	return /* @__PURE__ */ jsx("svg", {
		"aria-hidden": "true",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.75",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children
	});
}
function UserMenu({ compact = false }) {
	const [me, setMe] = useState(null);
	const [loading, setLoading] = useState(true);
	const [companies, setCompanies] = useState([]);
	const [open, setOpen] = useState(false);
	const rootRef = useRef(null);
	const triggerRef = useRef(null);
	const panelRef = useRef(null);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			const principal = await fetchMe();
			if (cancelled) return;
			setMe(principal);
			setLoading(false);
			if (principal && !principal.isAdmin && (principal.companies?.length ?? 0) > 0) try {
				const res = await frontendFetch(`${API_BASE}/me/companies`);
				if (!res.ok) return;
				const body = await res.json();
				if (!cancelled && Array.isArray(body.companies)) setCompanies(body.companies);
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event) => {
			if (!rootRef.current?.contains(event.target)) setOpen(false);
		};
		const onKeyDown = (event) => {
			if (event.key === "Escape") {
				event.stopPropagation();
				setOpen(false);
				triggerRef.current?.focus();
			}
		};
		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);
	useEffect(() => {
		if (!open) return;
		panelRef.current?.querySelector("[data-menu-item]")?.focus();
	}, [open]);
	const onPanelKeyDown = useCallback((event) => {
		if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
		event.preventDefault();
		const items = Array.from(panelRef.current?.querySelectorAll("[data-menu-item]") ?? []);
		if (items.length === 0) return;
		items[(items.indexOf(document.activeElement) + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
	}, []);
	const label = useMemo(() => me?.label ?? me?.name ?? me?.email ?? "", [me]);
	/**
	* The memberships, as ids, straight from the signed principal.
	*
	* `/me/companies` supplies NAMES and may be unavailable; the ids are what the
	* switcher actually needs, so the list stays usable (as "Firma 12") when the
	* composed API is down — a switcher that disappears whenever a directory
	* lookup fails would strand a multi-company user in the wrong company.
	*/
	const memberIds = useMemo(() => membershipIds(me), [me]);
	const activeId = useMemo(() => resolveActiveCompany(memberIds), [memberIds]);
	const companyName = useCallback((id) => companies.find((c) => c.id === id)?.name ?? `Firma ${id}`, [companies]);
	const companyLine = useMemo(() => {
		if (!me) return "";
		if (me.isAdmin) return "Management";
		if (activeId !== null) return companyName(activeId);
		return companies[0]?.name ?? "";
	}, [
		me,
		companies,
		activeId,
		companyName
	]);
	/**
	* Switching reloads the page.
	*
	* Every island has fetched its data by the time the menu is open, and the
	* active company scopes nearly all of it. A reload is ten honest lines; the
	* alternative is a global invalidation bus that every extension would have to
	* subscribe to — and forgetting to subscribe would show one company's data
	* under another company's name, which is the worst outcome available here.
	*/
	const switchTo = useCallback((id) => {
		setActiveCompany(id);
		location.reload();
	}, []);
	if (loading || !me) return null;
	const passwordHref = `${LOGIN_URL}/passwort?next=${encodeURIComponent(typeof location !== "undefined" ? location.href : "")}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-dropdown",
		ref: rootRef,
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			ref: triggerRef,
			className: "tds-dropdown__trigger",
			"aria-haspopup": "menu",
			"aria-expanded": open,
			onClick: () => setOpen((v) => !v),
			children: [
				/* @__PURE__ */ jsx(Avatar, {
					name: label,
					src: me.hasAvatar ? me.avatarUrl : null,
					seed: me.userId,
					size: "sm",
					decorative: true
				}),
				!compact && /* @__PURE__ */ jsxs("span", {
					className: "min-w-0 hidden sm:block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__label text-sm font-medium",
						children: label
					}), companyLine && /* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__label text-xs",
						style: { color: "var(--color-muted)" },
						children: companyLine
					})]
				}),
				/* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					style: { color: "var(--color-muted)" },
					children: /* @__PURE__ */ jsx(Glyph, {
						size: 14,
						children: ICON.chevron
					})
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "sr-only",
					children: ["Profilmenü", label ? ` für ${label}` : ""]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			ref: panelRef,
			className: "tds-dropdown__panel",
			role: "menu",
			"aria-label": "Profilmenü",
			hidden: !open,
			onKeyDown: onPanelKeyDown,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "tds-dropdown__head",
					children: [/* @__PURE__ */ jsx(Avatar, {
						name: label,
						src: me.hasAvatar ? me.avatarUrl : null,
						seed: me.userId,
						decorative: true
					}), /* @__PURE__ */ jsxs("span", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "tds-dropdown__label text-sm font-medium",
								children: label
							}),
							/* @__PURE__ */ jsx("span", {
								className: "tds-dropdown__label text-xs",
								style: { color: "var(--color-muted)" },
								children: me.email
							}),
							companyLine && /* @__PURE__ */ jsx("span", {
								className: "tds-dropdown__label text-xs",
								style: { color: "var(--color-muted)" },
								children: companyLine
							})
						]
					})]
				}),
				memberIds.length > 1 && /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx("hr", { className: "tds-dropdown__sep" }),
					/* @__PURE__ */ jsx("p", {
						className: "tds-dropdown__caption",
						children: "Firma wechseln"
					}),
					memberIds.map((id) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "tds-dropdown__item",
						role: "menuitemradio",
						"aria-checked": id === activeId,
						"data-menu-item": true,
						onClick: () => switchTo(id),
						children: [/* @__PURE__ */ jsx("span", {
							className: "tds-dropdown__icon",
							children: /* @__PURE__ */ jsx(Glyph, { children: id === activeId ? ICON.check : ICON.building })
						}), companyName(id)]
					}, id))
				] }),
				/* @__PURE__ */ jsx("hr", { className: "tds-dropdown__sep" }),
				/* @__PURE__ */ jsxs("a", {
					className: "tds-dropdown__item",
					role: "menuitem",
					"data-menu-item": true,
					href: "/profil",
					children: [/* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__icon",
						children: /* @__PURE__ */ jsx(Glyph, { children: ICON.user })
					}), "Profileinstellungen"]
				}),
				/* @__PURE__ */ jsxs("a", {
					className: "tds-dropdown__item",
					role: "menuitem",
					"data-menu-item": true,
					href: passwordHref,
					children: [/* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__icon",
						children: /* @__PURE__ */ jsx(Glyph, { children: ICON.key })
					}), "Passwort ändern"]
				}),
				/* @__PURE__ */ jsx("hr", { className: "tds-dropdown__sep" }),
				/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "tds-dropdown__item tds-dropdown__item--danger",
					role: "menuitem",
					"data-menu-item": true,
					onClick: () => void logout(),
					children: [/* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__icon",
						children: /* @__PURE__ */ jsx(Glyph, { children: ICON.logout })
					}), "Abmelden"]
				})
			]
		})]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/NavList.astro
createAstro("https://astro.build");
var $$NavList = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$NavList;
	const { sections } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<nav class="px-2 pb-6 flex flex-col gap-0.5" aria-label="Hauptnavigation">${sections.map((section) => renderTemplate`<div class="nav-group flex flex-col gap-0.5"${addAttribute(section.hue ? `--nav-hue: ${section.hue}` : void 0, "style")}><p class="nav-group-label">${section.label}</p>${section.items.map((item) => renderTemplate`<a${addAttribute([
		"nav-item",
		"px-3 py-2",
		item.active && "nav-item--active"
	], "class:list")}${addAttribute(item.href, "href")}${addAttribute(item.id, "data-nav")}${addAttribute(item.external ? `${item.label} (neuer Tab)` : item.label, "data-tip")}${addAttribute(item.active ? "page" : void 0, "aria-current")}${addAttribute(item.revealFor, "data-reveal-for")}${addAttribute(item.revealFor !== void 0, "hidden")}${addAttribute(item.external ? "_blank" : void 0, "target")}${addAttribute(item.external ? "noopener noreferrer" : void 0, "rel")}><span class="nav-item__icon">${renderComponent($$result, "Icon", $$Icon, { "name": item.icon })}</span><span class="nav-item__label">${item.label}</span></a>`)}</div>`)}</nav>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/NavList.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/lib/panelHues.ts
/**
* Wayfinding colour + labels for the composed nav and the dashboard.
*
* tds-shared's app.css has always driven its colour-coding off two custom
* properties — `--nav-hue` on a nav section and (new in 0.15.0)
* `--tds-widget-hue` on a dashboard slot. Nothing ever set either, so every
* nav item fell back to the rail's white and every widget to the same
* accent: the rail was one grey column and the dashboard a dozen identical
* cards. This module is what assigns them.
*
* WHY HOST-SIDE AND NOT IN THE MANIFEST. `WidgetManifest` has no `icon` or
* `hue` field, and adding them would mean a `frontend-contract` minor plus a
* release of all 13 extensions before a single pixel changed. Deriving both
* from the id the extension already declares gets the same result with no
* cross-repo churn. If extensions ever want to override their own colour,
* that is an additive contract minor and this becomes the fallback.
*
* Everything here degrades: an unknown key gets a stable hashed hue and the
* `square` icon, so a brand-new extension is colour-coded on first build.
*/
/** The categorical palette, in the order the hash cycles through it. */
var CATEGORICAL = [
	"var(--color-cat-violet)",
	"var(--color-cat-teal)",
	"var(--color-cat-amber)",
	"var(--color-cat-rose)",
	"var(--color-cat-cyan)"
];
/**
* Deliberate hues for the keys that exist today, so related surfaces agree:
* the Tickets nav row, the "Offene Tickets" widget and the tickets pages all
* read cyan. Chosen for separation in the rail, not per-extension taste.
*/
var HUES = {
	verwaltung: "var(--tds-panel-accent)",
	support: "var(--color-cat-cyan)",
	abrechnung: "var(--color-cat-amber)",
	content: "var(--color-cat-violet)",
	work: "var(--color-cat-teal)",
	tools: "var(--color-info)",
	allgemein: "var(--color-muted)",
	"tickets-open": "var(--color-cat-cyan)",
	"contact-new": "var(--color-cat-rose)",
	"live-chat-open": "var(--color-cat-cyan)",
	"time-week": "var(--color-cat-teal)",
	"blog-cms-posts": "var(--color-cat-violet)",
	"website-cms-sections": "var(--color-cat-violet)",
	"customers-count": "var(--color-info)",
	"lexware-invoices": "var(--color-cat-amber)",
	"billing-open": "var(--color-cat-amber)",
	"projects-active": "var(--color-cat-teal)",
	"documents-count": "var(--color-info)",
	"messages-unread": "var(--color-cat-rose)",
	"tools-status": "var(--color-cat-violet)"
};
/**
* Icons for dashboard widgets. Nav icons come from the manifest
* (`NavEntry.icon`); widgets have no such field, so they are mapped here by
* id and fall back to the `square` glyph.
*/
var WIDGET_ICONS = {
	"tickets-open": "life-buoy",
	"contact-new": "inbox",
	"live-chat-open": "message-circle",
	"time-week": "clock",
	"blog-cms-posts": "book-open",
	"website-cms-sections": "layout",
	"customers-count": "users",
	"lexware-invoices": "receipt",
	"billing-open": "file-text",
	"projects-active": "folder-kanban",
	"documents-count": "file-text",
	"messages-unread": "message-square",
	"tools-status": "wrench"
};
/**
* Display labels for nav group ids. Extensions declare `group` as a bare id
* and `.nav-group-label` uppercases it, so the rail read
* "SUPPORT / ABRECHNUNG / CONTENT / WORK" — a German/English mix of raw
* identifiers. Anything not listed falls back to Capitalised(id), which is
* already correct for the German ones.
*/
var GROUP_LABELS = {
	verwaltung: "Verwaltung",
	support: "Support",
	abrechnung: "Abrechnung",
	content: "Content",
	work: "Arbeit",
	allgemein: "Allgemein"
};
/**
* Fold a group id to its canonical key. Extensions are free to write
* "Verwaltung", "verwaltung" or " Verwaltung " and all three must land in
* the SAME section as the base shell's own nav — otherwise the rail grows a
* duplicate heading with one orphaned link under it.
*/
function normaliseGroup(group) {
	return (group ?? "Allgemein").trim().toLowerCase();
}
/** Human label for a normalised group key. */
function groupLabel(key) {
	return GROUP_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}
/**
* djb2-ish string hash. Only needs to be stable and well-spread across five
* buckets — the same key must pick the same hue on every build, or the nav
* would change colour between deploys.
*/
function hash(key) {
	let h = 5381;
	for (let i = 0; i < key.length; i++) h = (h << 5) + h + key.charCodeAt(i) >>> 0;
	return h;
}
/**
* The wayfinding hue for a nav group or widget id, as a CSS value ready to
* drop into a `--nav-hue` / `--tds-widget-hue` inline style. Never returns
* empty: an unmapped key gets a stable categorical hue.
*/
function hueForKey(key) {
	if (!key) return "var(--tds-panel-accent)";
	const known = HUES[key] ?? HUES[normaliseGroup(key)];
	if (known) return known;
	return CATEGORICAL[hash(key) % CATEGORICAL.length];
}
/** The icon key for a dashboard widget id. Unknown → the square fallback. */
function widgetIcon(id) {
	return id && WIDGET_ICONS[id] || "square";
}
//#endregion
//#region \0virtual:frontend-registry
var registry = {
	"order": [
		"time-tracker",
		"support-tickets",
		"contact-tickets",
		"live-chat-cta",
		"website-cms",
		"blog-cms",
		"lexware",
		"customers",
		"billing",
		"tools",
		"messages",
		"projects",
		"documents"
	],
	"permissions": [
		{
			"id": "time:read",
			"label": "Zeiten ansehen",
			"group": "time-tracker"
		},
		{
			"id": "time:write",
			"label": "Zeiten erfassen",
			"group": "time-tracker"
		},
		{
			"id": "tickets:read",
			"label": "Tickets ansehen",
			"group": "support-tickets"
		},
		{
			"id": "tickets:write",
			"label": "Tickets erstellen & beantworten",
			"group": "support-tickets"
		},
		{
			"id": "contact:read",
			"label": "Kontaktanfragen ansehen",
			"group": "contact-tickets"
		},
		{
			"id": "contact:write",
			"label": "Kontaktanfragen bearbeiten",
			"group": "contact-tickets"
		},
		{
			"id": "live-chat:read",
			"label": "Live-Chat ansehen",
			"group": "live-chat-cta"
		},
		{
			"id": "live-chat:write",
			"label": "Live-Chat bearbeiten",
			"group": "live-chat-cta"
		},
		{
			"id": "wiki:read",
			"label": "Wiki-Inhalte ansehen",
			"group": "live-chat-cta"
		},
		{
			"id": "wiki:write",
			"label": "Wiki-Inhalte bearbeiten",
			"group": "live-chat-cta"
		},
		{
			"id": "website:read",
			"label": "Website-Inhalte ansehen",
			"group": "website-cms"
		},
		{
			"id": "website:write",
			"label": "Website-Inhalte bearbeiten",
			"group": "website-cms"
		},
		{
			"id": "blog:read",
			"label": "Blog-Beiträge ansehen",
			"group": "blog-cms"
		},
		{
			"id": "blog:write",
			"label": "Blog-Beiträge bearbeiten",
			"group": "blog-cms"
		},
		{
			"id": "lexware:read",
			"label": "Lexware / Rechnungen ansehen",
			"group": "lexware"
		},
		{
			"id": "lexware:write",
			"label": "Lexware-Kunden, Kontakte & Rechnungen verwalten",
			"group": "lexware"
		},
		{
			"id": "companies:read",
			"label": "Firmen ansehen",
			"group": "companies"
		},
		{
			"id": "companies:write",
			"label": "Firmen verwalten",
			"group": "companies"
		},
		{
			"id": "billing:read",
			"label": "Rechnungen ansehen",
			"group": "billing"
		},
		{
			"id": "billing:write",
			"label": "Rechnungen erstellen & senden",
			"group": "billing"
		},
		{
			"id": "tools:manage",
			"label": "Tools verwalten",
			"group": "tools"
		},
		{
			"id": "messages:read",
			"label": "Nachrichten ansehen",
			"group": "messages"
		},
		{
			"id": "messages:write",
			"label": "Nachrichten schreiben",
			"group": "messages"
		},
		{
			"id": "projects:read",
			"label": "Projekte ansehen",
			"group": "projects"
		},
		{
			"id": "projects:manage",
			"label": "Projekte verwalten (Owner)",
			"group": "projects"
		},
		{
			"id": "documents:read",
			"label": "Dokumente ansehen",
			"group": "documents"
		},
		{
			"id": "documents:write",
			"label": "Dokumente hochladen",
			"group": "documents"
		}
	],
	"nav": [
		{
			"id": "tickets",
			"label": "Tickets",
			"href": "/tickets",
			"icon": "life-buoy",
			"group": "support",
			"order": 10,
			"permission": "tickets:read"
		},
		{
			"id": "blog-cms",
			"label": "Blog-CMS",
			"href": "/blog",
			"icon": "book-open",
			"group": "content",
			"order": 10,
			"permission": "blog:read"
		},
		{
			"id": "billing",
			"label": "Rechnungen",
			"href": "/rechnungen",
			"icon": "file-text",
			"group": "abrechnung",
			"order": 10,
			"permission": "billing:read"
		},
		{
			"id": "projects",
			"label": "Projekte",
			"href": "/projects",
			"icon": "folder-kanban",
			"group": "work",
			"order": 10,
			"permission": "projects:read"
		},
		{
			"id": "projects-admin",
			"label": "Projekte verwalten",
			"href": "/admin/projects",
			"icon": "folder-cog",
			"group": "verwaltung",
			"order": 10,
			"permission": "projects:manage"
		},
		{
			"id": "live-chat",
			"label": "Live-Chat",
			"href": "/live-chat",
			"icon": "message-circle",
			"group": "support",
			"order": 15,
			"permission": "live-chat:read"
		},
		{
			"id": "customers",
			"label": "Firmen",
			"href": "/firmen",
			"icon": "building",
			"group": "verwaltung",
			"order": 15,
			"permission": "companies:read"
		},
		{
			"id": "wiki-content",
			"label": "Wiki-Inhalte",
			"href": "/wiki-inhalte",
			"icon": "book-open",
			"group": "support",
			"order": 16,
			"permission": "wiki:read"
		},
		{
			"id": "time",
			"label": "Zeiterfassung",
			"href": "/time",
			"icon": "clock",
			"group": "work",
			"order": 20,
			"permission": "time:read"
		},
		{
			"id": "contact-tickets",
			"label": "Kontaktanfragen",
			"href": "/kontakt",
			"icon": "inbox",
			"group": "support",
			"order": 20,
			"permission": "contact:read"
		},
		{
			"id": "website-cms",
			"label": "Website-CMS",
			"href": "/website",
			"icon": "layout",
			"group": "content",
			"order": 20,
			"permission": "website:read"
		},
		{
			"id": "lexware",
			"label": "Lexware",
			"href": "/lexware",
			"icon": "receipt",
			"group": "abrechnung",
			"order": 20,
			"permission": "lexware:read"
		},
		{
			"id": "messages",
			"label": "Nachrichten",
			"href": "/messages",
			"icon": "message-square",
			"group": "support",
			"order": 20,
			"permission": "messages:read"
		},
		{
			"id": "documents",
			"label": "Dokumente",
			"href": "/documents",
			"icon": "file-text",
			"group": "work",
			"order": 20,
			"permission": "documents:read"
		},
		{
			"id": "tools",
			"label": "Tools",
			"href": "/tools-verwaltung",
			"icon": "wrench",
			"group": "tools",
			"order": 50,
			"permission": "tools:manage"
		}
	],
	"widgets": [
		{
			"id": "projects-active",
			"title": "Aktive Projekte",
			"island": "@tracht-digital-solutions/tds-ext-projects/widgets/Widget.astro",
			"size": "sm",
			"permission": "projects:read",
			"dataEndpoint": "/projects/summary",
			"order": 5
		},
		{
			"id": "time-week",
			"title": "Diese Woche",
			"island": "@tracht-digital-solutions/tds-ext-time-tracker/widgets/Week.astro",
			"size": "md",
			"permission": "time:read",
			"dataEndpoint": "/time/summary",
			"order": 10
		},
		{
			"id": "tickets-open",
			"title": "Offene Tickets",
			"island": "@tracht-digital-solutions/tds-ext-support-tickets/widgets/Widget.astro",
			"size": "sm",
			"permission": "tickets:read",
			"dataEndpoint": "/tickets/summary",
			"order": 10
		},
		{
			"id": "billing-open",
			"title": "Offene Rechnungen",
			"island": "@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro",
			"size": "sm",
			"permission": "billing:read",
			"dataEndpoint": "/billing/summary",
			"order": 10
		},
		{
			"id": "live-chat-open",
			"title": "Offene Chats",
			"island": "@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro",
			"size": "sm",
			"permission": "live-chat:read",
			"dataEndpoint": "/live-chat-cta/summary",
			"order": 15
		},
		{
			"id": "customers-count",
			"title": "Firmen",
			"island": "@tracht-digital-solutions/tds-ext-customers/widgets/Widget.astro",
			"size": "sm",
			"permission": "companies:read",
			"dataEndpoint": "/companies/summary",
			"order": 15
		},
		{
			"id": "contact-new",
			"title": "Neue Anfragen",
			"island": "@tracht-digital-solutions/tds-ext-contact-tickets/widgets/Widget.astro",
			"size": "sm",
			"permission": "contact:read",
			"dataEndpoint": "/contact/summary",
			"order": 20
		},
		{
			"id": "lexware-invoices",
			"title": "Lexware-Rechnungen",
			"island": "@tracht-digital-solutions/tds-ext-lexware/widgets/Widget.astro",
			"size": "sm",
			"permission": "lexware:read",
			"dataEndpoint": "/lexware/summary",
			"order": 20
		},
		{
			"id": "messages-unread",
			"title": "Neue Nachrichten",
			"island": "@tracht-digital-solutions/tds-ext-messages/widgets/Widget.astro",
			"size": "sm",
			"permission": "messages:read",
			"dataEndpoint": "/messages/summary",
			"order": 20
		},
		{
			"id": "website-cms-sites",
			"title": "Websites",
			"island": "@tracht-digital-solutions/tds-ext-website-cms/widgets/Widget.astro",
			"size": "sm",
			"permission": "website:read",
			"dataEndpoint": "/cms/summary",
			"order": 30
		},
		{
			"id": "documents-count",
			"title": "Dokumente",
			"island": "@tracht-digital-solutions/tds-ext-documents/widgets/Widget.astro",
			"size": "sm",
			"permission": "documents:read",
			"dataEndpoint": "/documents/summary",
			"order": 30
		},
		{
			"id": "blog-cms-posts",
			"title": "Blog-Beiträge",
			"island": "@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro",
			"size": "sm",
			"permission": "blog:read",
			"dataEndpoint": "/blog/summary",
			"order": 40
		},
		{
			"id": "tools-status",
			"title": "Tools",
			"island": "@tracht-digital-solutions/tds-ext-tools/widgets/Widget.astro",
			"size": "sm",
			"permission": "tools:manage",
			"dataEndpoint": "/tools/summary",
			"order": 50
		}
	],
	"settings": [
		{
			"id": "billing",
			"label": "Stripe / Rechnungen",
			"island": "@tracht-digital-solutions/tds-ext-billing/islands/Settings.astro",
			"order": 10
		},
		{
			"id": "time",
			"label": "Zeiterfassung",
			"island": "@tracht-digital-solutions/tds-ext-time-tracker/islands/Settings.astro",
			"order": 20
		},
		{
			"id": "lexware",
			"label": "Lexware",
			"island": "@tracht-digital-solutions/tds-ext-lexware/islands/Settings.astro",
			"order": 20
		},
		{
			"id": "support-tickets",
			"label": "Support-Tickets",
			"island": "@tracht-digital-solutions/tds-ext-support-tickets/islands/Settings.astro",
			"order": 30
		},
		{
			"id": "contact-tickets",
			"label": "Kontaktanfragen",
			"island": "@tracht-digital-solutions/tds-ext-contact-tickets/islands/Settings.astro",
			"order": 35
		},
		{
			"id": "live-chat-cta",
			"label": "Live-Chat",
			"island": "@tracht-digital-solutions/tds-ext-live-chat-cta/islands/Settings.astro",
			"order": 40
		},
		{
			"id": "website-cms",
			"label": "Website-CMS",
			"island": "@tracht-digital-solutions/tds-ext-website-cms/islands/Settings.astro",
			"order": 40
		},
		{
			"id": "blog-cms",
			"label": "Blog-CMS",
			"island": "@tracht-digital-solutions/tds-ext-blog-cms/islands/Settings.astro",
			"order": 50
		},
		{
			"id": "tools",
			"label": "Tools / AdSense",
			"island": "@tracht-digital-solutions/tds-ext-tools/islands/Settings.astro",
			"order": 50
		}
	],
	"routes": [
		{
			"pattern": "/time",
			"entrypoint": "@tracht-digital-solutions/tds-ext-time-tracker/pages/Index.astro",
			"permission": "time:read"
		},
		{
			"pattern": "/tickets",
			"entrypoint": "@tracht-digital-solutions/tds-ext-support-tickets/pages/Index.astro",
			"permission": "tickets:read"
		},
		{
			"pattern": "/kontakt",
			"entrypoint": "@tracht-digital-solutions/tds-ext-contact-tickets/pages/Index.astro",
			"permission": "contact:read"
		},
		{
			"pattern": "/live-chat",
			"entrypoint": "@tracht-digital-solutions/tds-ext-live-chat-cta/pages/Index.astro",
			"permission": "live-chat:read"
		},
		{
			"pattern": "/wiki-inhalte",
			"entrypoint": "@tracht-digital-solutions/tds-ext-live-chat-cta/pages/WikiContent.astro",
			"permission": "wiki:read"
		},
		{
			"pattern": "/website",
			"entrypoint": "@tracht-digital-solutions/tds-ext-website-cms/pages/Index.astro",
			"permission": "website:read"
		},
		{
			"pattern": "/blog",
			"entrypoint": "@tracht-digital-solutions/tds-ext-blog-cms/pages/Index.astro",
			"permission": "blog:read"
		},
		{
			"pattern": "/lexware",
			"entrypoint": "@tracht-digital-solutions/tds-ext-lexware/pages/Index.astro",
			"permission": "lexware:read"
		},
		{
			"pattern": "/firmen",
			"entrypoint": "@tracht-digital-solutions/tds-ext-customers/pages/Index.astro",
			"permission": "companies:read"
		},
		{
			"pattern": "/rechnungen",
			"entrypoint": "@tracht-digital-solutions/tds-ext-billing/pages/Index.astro",
			"permission": "billing:read"
		},
		{
			"pattern": "/tools-verwaltung",
			"entrypoint": "@tracht-digital-solutions/tds-ext-tools/pages/Index.astro",
			"permission": "tools:manage"
		},
		{
			"pattern": "/messages",
			"entrypoint": "@tracht-digital-solutions/tds-ext-messages/pages/Index.astro",
			"permission": "messages:read"
		},
		{
			"pattern": "/projects",
			"entrypoint": "@tracht-digital-solutions/tds-ext-projects/pages/Index.astro",
			"permission": "projects:read"
		},
		{
			"pattern": "/admin/projects",
			"entrypoint": "@tracht-digital-solutions/tds-ext-projects/pages/AdminIndex.astro",
			"permission": "projects:manage"
		},
		{
			"pattern": "/documents",
			"entrypoint": "@tracht-digital-solutions/tds-ext-documents/pages/Index.astro",
			"permission": "documents:read"
		}
	],
	"i18n": {
		"de": {
			"time.title": "Zeiterfassung",
			"time.week": "Diese Woche",
			"tickets.title": "Support-Tickets",
			"tickets.open": "Offene Tickets",
			"contact.title": "Kontaktanfragen",
			"contact.new": "Neue Anfragen",
			"live-chat.title": "Live-Chat",
			"live-chat.chats": "Chats",
			"live-chat.faq": "FAQ",
			"live-chat.docs": "Handbücher",
			"wiki-content.title": "Wiki-Inhalte",
			"website.title": "Website-CMS",
			"website.sites": "Websites",
			"blog.title": "Blog-CMS",
			"blog.posts": "Beiträge",
			"lexware.title": "Lexware",
			"lexware.customers": "Kunden",
			"lexware.time": "Zeit zuordnen",
			"lexware.contacts": "Kontakte",
			"lexware.invoices": "Rechnungen",
			"companies.title": "Firmen",
			"billing.title": "Rechnungen",
			"tools.title": "Tools",
			"messages.title": "Nachrichten",
			"messages.unread": "Neue Nachrichten",
			"projects.title": "Projekte",
			"projects.active": "Aktive Projekte",
			"documents.title": "Dokumente",
			"documents.count": "Dokumente"
		},
		"en": {
			"time.title": "Time tracking",
			"time.week": "This week",
			"tickets.title": "Support tickets",
			"tickets.open": "Open tickets",
			"contact.title": "Contact requests",
			"contact.new": "New requests",
			"live-chat.title": "Live chat",
			"live-chat.chats": "Chats",
			"live-chat.faq": "FAQ",
			"live-chat.docs": "Handbooks",
			"wiki-content.title": "Wiki content",
			"website.title": "Website CMS",
			"website.sites": "Websites",
			"blog.title": "Blog CMS",
			"blog.posts": "Posts",
			"lexware.title": "Lexware",
			"lexware.customers": "Customers",
			"lexware.time": "Assign time",
			"lexware.contacts": "Contacts",
			"lexware.invoices": "Invoices",
			"companies.title": "Companies",
			"billing.title": "Invoices",
			"tools.title": "Tools",
			"messages.title": "Messages",
			"messages.unread": "Unread messages",
			"projects.title": "Projects",
			"projects.active": "Active projects",
			"documents.title": "Documents",
			"documents.count": "Documents"
		}
	}
};
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Layout;
	const hintKey = `${HINT_PREFIX}_authed`;
	const expKey = `${HINT_PREFIX}_authed_exp`;
	const confirmedKey = `${HINT_PREFIX}_confirmed`;
	const { title, description = "Internes Panel — Tracht Digital Solutions.", lang = "de", bare = false } = Astro2.props;
	const authApiUrl = "https://api.tracht-digital.de/auth";
	const BASE_GROUP = "verwaltung";
	const baseNav = [
		{
			href: "/",
			label: "Dashboard",
			id: void 0,
			icon: "layout-dashboard",
			order: 0
		},
		{
			href: "/users",
			label: "Benutzer",
			id: "users",
			icon: "users",
			order: 1,
			revealFor: "platform-admin"
		},
		{
			href: "/firma",
			label: "Meine Firma",
			id: "firma",
			icon: "building",
			order: 2,
			revealFor: "company-or-platform-admin"
		},
		{
			href: "/wiki",
			label: "API-Referenz",
			id: "wiki",
			icon: "book-open",
			order: 3
		},
		{
			href: "/einstellungen",
			label: "Einstellungen",
			id: "einstellungen",
			icon: "settings",
			order: 4
		}
	];
	baseNav.push({
		href: "/module",
		label: "Module",
		id: "module",
		icon: "package",
		order: 5
	});
	baseNav.push({
		href: "https://tools.tracht-digital.de",
		label: "Tools-Website",
		id: "tools-site",
		icon: "external-link",
		group: "tools",
		order: 90,
		external: true
	});
	const groups = /* @__PURE__ */ new Map();
	groups.set(BASE_GROUP, baseNav.filter((item) => item.group === void 0));
	const adoptedBaseNav = baseNav.filter((item) => item.group !== void 0);
	for (const item of registry.nav) {
		const key = normaliseGroup(item.group);
		const bucket = groups.get(key) ?? [];
		bucket.push({
			href: item.href,
			label: item.label,
			id: item.id,
			icon: item.icon,
			order: item.order ?? 100
		});
		groups.set(key, bucket);
	}
	for (const item of adoptedBaseNav) {
		const key = normaliseGroup(item.group);
		const bucket = groups.get(key);
		if (bucket) bucket.push(item);
	}
	const norm = (p) => {
		const trimmed = p.replace(/\/+$/, "");
		return trimmed === "" ? "/" : trimmed;
	};
	const here = norm(Astro2.url.pathname);
	const isActive = (href) => {
		const h = norm(href);
		return h === "/" ? here === "/" : here === h || here.startsWith(h + "/");
	};
	const navSections = [...groups.entries()].map(([key, items]) => ({
		label: groupLabel(key),
		hue: hueForKey(key),
		items: [...items].sort((a, b) => a.order - b.order).map((item) => ({
			href: item.href,
			label: item.label,
			id: item.id,
			icon: item.icon,
			active: isActive(item.href),
			external: item.external,
			revealFor: item.revealFor
		}))
	}));
	return renderTemplate`<!-- data-surface selects the geometry layer from tds-shared's design library
     (surfaces/panel.css): the 8px product-UI geometry, 0.75rem chips and,
     since 0.15.0, a soft resting elevation.

     data-frontend selects the ACCENT within that layer, and is the only
     styling value FRONTEND_TARGET is allowed to drive: management reads the
     brand navy, the customer portal reads teal, so a user with both open
     knows at a glance which surface they are on. Everything else about the
     two products stays identical — one shell, one component set, one
     geometry. The accent is a single token block in surfaces/panel.css
     ([data-surface="panel"][data-frontend="customer"]); no component
     anywhere branches on the target. --><html${addAttribute(lang, "lang")} data-surface="panel"${addAttribute(FRONTEND_TARGET, "data-frontend")}><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta name="robots" content="noindex,nofollow"><meta name="tds-api-base"${addAttribute(API_BASE, "content")}><script>${unescapeHTML(themeBootstrapScript)}<\/script><link rel="preconnect" href="https://api.tracht-digital.de" crossorigin><title>${title}</title>${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}${!bare && renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result2) => renderTemplate`<style>
            html.auth-checking body { visibility: hidden; }
            html.auth-checking::before {
              content: ""; position: fixed; inset: 0; z-index: 2147483646;
              background: var(--tds-panel-canvas, #f1efec);
            }
            html[data-theme="dark"].auth-checking::before { background: var(--tds-panel-canvas, #0f1223); }
            html.auth-checking::after {
              content: ""; position: fixed; inset: 0; margin: auto; z-index: 2147483647;
              width: 2.25rem; height: 2.25rem; border-radius: 9999px;
              border: 3px solid color-mix(in srgb, var(--color-primary, #050f68) 20%, transparent);
              border-top-color: var(--color-primary, #050f68);
              animation: tds-auth-spin 0.7s cubic-bezier(0.5, 0.15, 0.5, 0.85) infinite;
            }
            @keyframes tds-auth-spin { to { transform: rotate(360deg); } }
            @media (prefers-reduced-motion: reduce) {
              html.auth-checking::after {
                animation: none;
                border-color: color-mix(in srgb, var(--color-primary, #050f68) 35%, transparent);
              }
            }
          </style><script>(function(){${defineScriptVars({
		authApiUrl,
		loginUrl: "https://auth.tracht-digital.de",
		hintKey,
		expKey,
		confirmedKey
	})}
            (function () {
              function redirect() {
                // Bounce to the central login (auth.tracht-digital.de) with an
                // ABSOLUTE return URL — it validates ?next= against an allow-list
                // and sends the user back here after login.
                var next = encodeURIComponent(location.href);
                location.replace(loginUrl + "?next=" + next);
              }
              function clear() {
                try {
                  localStorage.removeItem(hintKey);
                  localStorage.removeItem(expKey);
                  localStorage.removeItem(confirmedKey);
                } catch (e) {}
              }
              var hint, exp, okUntil;
              try {
                hint = localStorage.getItem(hintKey);
                exp = localStorage.getItem(expKey);
                okUntil = localStorage.getItem(confirmedKey);
              } catch (e) { hint = null; }

              // A hint with a known-past expiry means the local session lapsed —
              // drop it and fall through to a fresh /me probe (the shared SSO
              // cookie may still be valid from another panel).
              if (hint) {
                var expMs = exp ? Number(exp) : NaN;
                if (Number.isFinite(expMs) && expMs <= Date.now()) { clear(); hint = null; }
              }

              // Fresh confirmation → paint immediately (only trusted with a hint).
              if (hint) {
                var okMs = okUntil ? Number(okUntil) : NaN;
                if (Number.isFinite(okMs) && okMs > Date.now()) return;
              }

              // Otherwise confirm against /me before revealing. This also covers
              // arriving fresh from the central login: the SSO cookie is set but
              // there is no local hint yet (localStorage is per-origin — the login
              // site cannot write this panel's). On success we SEED the hint here,
              // so we must NOT redirect on a missing hint (that would loop against
              // the login site, which sees a valid cookie and bounces straight
              // back). Only a 401 from /me is a real logout.
              document.documentElement.classList.add("auth-checking");
              function reveal() {
                try {
                  localStorage.setItem(hintKey, "1");
                  localStorage.setItem(confirmedKey, String(Date.now() + 60000));
                } catch (e) {}
                document.documentElement.classList.remove("auth-checking");
              }
              fetch(authApiUrl + "/me", { credentials: "include" }).then(function (res) {
                if (res.ok) { reveal(); return; }
                // Not logged in *yet*. A device with "angemeldet bleiben" holds a
                // 30-day cookie that can mint a fresh session — the session JWT
                // itself is deliberately short-lived, so without this exchange the
                // remembered login would still bounce to the login page every hour.
                return fetch(authApiUrl + "/refresh", { method: "POST", credentials: "include" })
                  .then(function (r) {
                    if (!r.ok) { clear(); redirect(); return; }
                    reveal();
                  });
              }).catch(function () {
                document.documentElement.classList.remove("auth-checking");
              });
            })();
          })();<\/script>` })}`}${renderHead($$result)}</head><body>${bare ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : renderTemplate`<div class="lg:flex min-h-dvh"><header class="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)]"><button type="button" id="nav-drawer-open" class="btn btn-ghost" aria-controls="nav-drawer" aria-expanded="false" aria-label="Navigation öffnen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"></path></svg></button>${renderComponent($$result, "BrandWordmark", $$BrandWordmark, {})}<span class="ml-auto flex items-center gap-1">${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:idle": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ThemeToggle"
	})}${renderComponent($$result, "UserMenu", UserMenu, {
		"client:idle": true,
		"compact": true,
		"client:component-hydration": "idle",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/UserMenu.tsx",
		"client:component-export": "default"
	})}</span></header><aside class="portal-sidebar hidden lg:flex lg:flex-col w-60 shrink-0 border-r"><div class="sidebar-head px-4 py-4 flex items-center gap-2"><span class="sidebar-hide-collapsed">${renderComponent($$result, "BrandWordmark", $$BrandWordmark, {})}</span><button type="button" class="btn btn-ghost ml-auto px-2" data-sidebar-toggle aria-controls="panel-nav" aria-expanded="true" aria-label="Navigation einklappen"><span data-expanded-icon>${renderComponent($$result, "Icon", $$Icon, { "name": "chevrons-left" })}</span><span data-collapsed-icon hidden>${renderComponent($$result, "Icon", $$Icon, { "name": "chevrons-right" })}</span></button></div><div id="panel-nav" class="flex-1 overflow-y-auto">${renderComponent($$result, "NavList", $$NavList, { "sections": navSections })}</div><div class="sidebar-foot mt-auto px-4 py-3 flex items-center gap-2"><!-- The ThemeToggle moved to the top bar, where it sits next to
                   the profile menu that now owns the rest of "my account".
                   Two toggles on one page would be two controls for one
                   setting. The target label stays: it is the only thing in
                   the rail that says which product this is. --><span class="sidebar-hide-collapsed text-xs" style="color: var(--color-muted)">${"Management"}</span></div></aside><div class="nav-drawer lg:hidden" id="nav-drawer" data-open="false"><div class="nav-drawer-backdrop" data-nav-drawer-close></div><div class="nav-drawer-panel"><div class="px-4 py-4 flex items-center gap-2">${renderComponent($$result, "BrandWordmark", $$BrandWordmark, {})}<button type="button" class="btn btn-ghost ml-auto" data-nav-drawer-close aria-label="Navigation schließen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"></path></svg></button></div>${renderComponent($$result, "NavList", $$NavList, { "sections": navSections })}</div></div><!-- The rail's neighbour is a COLUMN, not the page itself: the top
               bar has to sit above the canvas and stick while it scrolls.
               \`min-w-0\` on the column is what keeps a wide table inside it
               from pushing the whole layout out — \`body { overflow-x: hidden }\`
               would then clip it silently rather than scrolling it. --><div class="flex flex-col min-w-0 flex-1"><header class="panel-topbar hidden lg:flex">${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:idle": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ThemeToggle"
	})}${renderComponent($$result, "UserMenu", UserMenu, {
		"client:idle": true,
		"client:component-hydration": "idle",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/UserMenu.tsx",
		"client:component-export": "default"
	})}</header><main id="main" class="panel-main min-w-0 flex-1 p-4 sm:p-6"><div class="mx-auto w-full max-w-[90rem]">${renderSlot($$result, $$slots["default"])}</div></main></div></div>${renderScript($$result, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts")}`}<div data-astro-transition-persist="tds-nav-progress" id="tds-nav-progress" class="tds-nav-progress" data-state="idle" aria-hidden="true"></div>${renderComponent($$result, "ToastHost", ToastHost, {
		"client:idle": true,
		"lang": lang,
		"data-astro-transition-persist": "tds-toast-host",
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ToastHost"
	})}${renderComponent($$result, "CookieNotice", CookieNotice, {
		"client:idle": true,
		"variant": "panel",
		"data-astro-transition-persist": "tds-cookie-notice",
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "CookieNotice"
	})}${!bare && renderTemplate`${renderComponent($$result, "LiveChatCta", LiveChatCta, {
		"client:idle": true,
		"frontend": "admin",
		"lang": lang,
		"data-astro-transition-persist": "tds-live-chat",
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "LiveChatCta"
	})}`}</body></html>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/layouts/Layout.astro", "self");
//#endregion
export { FormAlert as _, API_BASE as a, toast as b, fetchMe as c, membershipIds as d, $$Icon as f, ConfirmDialog as g, Avatar as h, getActiveCompany as i, frontendFetch as l, LOGIN_URL as m, hueForKey as n, AUTH_API_URL as o, FRONTEND_TARGET as p, widgetIcon as r, CUSTOMER_API_URL as s, $$Layout as t, invalidateMe as u, Skeleton as v, renderScript as x, Spinner as y };
