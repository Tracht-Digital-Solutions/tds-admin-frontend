import { Q as __exportAll, a as renderComponent, f as renderTemplate, p as maybeRenderHead } from "./server_hnGLdWvx.mjs";
import { t as createComponent } from "./compiler_ClrasJXf.mjs";
import { t as $$Layout, y as Skeleton } from "./Layout_BX35BL1S.mjs";
import { n as BarList, t as AreaChart } from "./charts_US1U5AJi.mjs";
import { a as SITES, c as countryName, d as duration, f as label, h as pct, i as OS_LABELS, l as defaultFilter, m as num, n as CHANNEL_LABELS, o as addDays, p as loadReport, r as DEVICE_LABELS, s as berlinDay, t as BROWSER_LABELS, u as delta } from "./lib_DR2kV_Wh.mjs";
import { useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/Dashboard.tsx
var TABS = [
	["overview", "Übersicht"],
	["pages", "Seiten & Absprung"],
	["sources", "Herkunft & Klicks"],
	["forms", "Formulare"]
];
/** Load a report whenever the filter changes; a stale answer never overwrites a newer one. */
function useReport(name, filter) {
	const [state, setState] = useState({ state: "loading" });
	useEffect(() => {
		let live = true;
		setState({ state: "loading" });
		loadReport(name, filter).then((r) => {
			if (live) setState(r);
		});
		return () => {
			live = false;
		};
	}, [
		name,
		filter.site,
		filter.from,
		filter.to
	]);
	return state;
}
function Dashboard() {
	const [filter, setFilter] = useState(defaultFilter);
	const [tab, setTab] = useState("overview");
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--loose",
		children: [
			/* @__PURE__ */ jsx(FilterBar, {
				filter,
				onChange: setFilter
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "tds-toolbar",
				role: "tablist",
				"aria-label": "Ansicht",
				children: TABS.map(([id, text]) => /* @__PURE__ */ jsx("button", {
					type: "button",
					role: "tab",
					id: `analytics-tab-${id}`,
					"aria-selected": tab === id,
					"aria-controls": "analytics-panel",
					className: tab === id ? "chip tds-tab chip-active" : "chip tds-tab",
					onClick: () => setTab(id),
					children: text
				}, id))
			}),
			/* @__PURE__ */ jsxs("div", {
				id: "analytics-panel",
				role: "tabpanel",
				"aria-labelledby": `analytics-tab-${tab}`,
				children: [
					tab === "overview" ? /* @__PURE__ */ jsx(OverviewTab, { filter }) : null,
					tab === "pages" ? /* @__PURE__ */ jsx(PagesTab, { filter }) : null,
					tab === "sources" ? /* @__PURE__ */ jsx(SourcesTab, { filter }) : null,
					tab === "forms" ? /* @__PURE__ */ jsx(FormsTab, { filter }) : null
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Erfasst werden nur Besucher, die der Kategorie „Statistik“ zugestimmt haben — die Zahlen sind deshalb kleiner als die tatsächliche Reichweite. Keine IP-Adressen, keine Formularinhalte, keine Drittanbieter."
			})
		]
	});
}
function FilterBar({ filter, onChange }) {
	const today = berlinDay();
	const preset = (days) => onChange({
		...filter,
		from: addDays(today, -(days - 1)),
		to: today
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-toolbar",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Site" }), /* @__PURE__ */ jsxs("select", {
					className: "field-boxed",
					value: filter.site,
					onChange: (e) => onChange({
						...filter,
						site: e.target.value
					}),
					children: [/* @__PURE__ */ jsx("option", {
						value: "",
						children: "Alle Sites"
					}), SITES.map((s) => /* @__PURE__ */ jsx("option", {
						value: s.key,
						children: s.label
					}, s.key))]
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Von" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "date",
					value: filter.from,
					max: filter.to,
					onChange: (e) => e.target.value && onChange({
						...filter,
						from: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsx("span", { children: "Bis" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "date",
					value: filter.to,
					min: filter.from,
					max: today,
					onChange: (e) => e.target.value && onChange({
						...filter,
						to: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ jsx("span", {
				className: "tds-row",
				role: "group",
				"aria-label": "Zeitraum",
				children: [
					7,
					30,
					90
				].map((d) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => preset(d),
					children: [d, " Tage"]
				}, d))
			})
		]
	});
}
/** Loading, error and success rendered the same way in every tab. */
function Section({ report, children }) {
	if (report.state === "loading") return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		"aria-busy": "true",
		children: [/* @__PURE__ */ jsx(Skeleton, { height: "6rem" }), /* @__PURE__ */ jsx(Skeleton, { height: "12rem" })]
	});
	if (report.state === "error") return /* @__PURE__ */ jsx("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: report.message
	});
	return /* @__PURE__ */ jsx(Fragment$1, { children: children(report.data) });
}
function Card({ title, children, note }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "tds-card tds-stack p-4",
		children: [
			/* @__PURE__ */ jsx("h2", { children: title }),
			note ? /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: note
			}) : null,
			children
		]
	});
}
function Kpi({ title, value, change, invert }) {
	const good = change === null ? null : invert ? change < 0 : change > 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "stat-tile tds-stack tds-stack--tight",
		style: { padding: "1rem" },
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "marginalia",
				children: title
			}),
			/* @__PURE__ */ jsx("strong", {
				style: {
					fontSize: "1.75rem",
					lineHeight: 1.1
				},
				children: value
			}),
			/* @__PURE__ */ jsx("span", {
				className: good === null ? "marginalia" : good ? "chip chip--success" : "chip chip--warning",
				children: change === null ? "kein Vergleich" : `${change > 0 ? "+" : ""}${pct(change)} zur Vorperiode`
			})
		]
	});
}
function OverviewTab({ filter }) {
	const report = useReport("overview", filter);
	return /* @__PURE__ */ jsx(Section, {
		report,
		children: (d) => {
			const t = d.totals;
			const p = d.previous;
			return /* @__PURE__ */ jsxs("div", {
				className: "tds-stack tds-stack--loose",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "tds-grid-auto",
						children: [
							/* @__PURE__ */ jsx(Kpi, {
								title: "Besuche",
								value: num(t.visits),
								change: delta(t.visits, p.visits)
							}),
							/* @__PURE__ */ jsx(Kpi, {
								title: "Besucher",
								value: num(t.visitors),
								change: delta(t.visitors, p.visitors)
							}),
							/* @__PURE__ */ jsx(Kpi, {
								title: "Seitenaufrufe",
								value: num(t.pageviews),
								change: delta(t.pageviews, p.pageviews)
							}),
							/* @__PURE__ */ jsx(Kpi, {
								title: "Absprungrate",
								value: pct(t.bounceRate),
								change: delta(t.bounceRate, p.bounceRate),
								invert: true
							}),
							/* @__PURE__ */ jsx(Kpi, {
								title: "Ø Verweildauer",
								value: duration(t.avgDurationMs),
								change: delta(t.avgDurationMs, p.avgDurationMs)
							}),
							/* @__PURE__ */ jsx(Kpi, {
								title: "Wiederkehrend",
								value: t.visits > 0 ? pct(t.returning / t.visits) : "–",
								change: delta(t.returning, p.returning)
							})
						]
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Verlauf",
						note: "Linie: Besuche · gestrichelt: Seitenaufrufe",
						children: t.visits === 0 && t.pageviews === 0 ? /* @__PURE__ */ jsx("p", {
							className: "tds-empty",
							children: "Im gewählten Zeitraum wurden keine Besuche erfasst."
						}) : /* @__PURE__ */ jsx(AreaChart, {
							label: `Besuche je Tag vom ${filter.from} bis ${filter.to}: insgesamt ${t.visits}`,
							points: d.series.map((s) => ({
								label: s.day,
								value: s.visits
							})),
							secondary: d.series.map((s) => ({
								label: s.day,
								value: s.pageviews
							}))
						})
					}),
					/* @__PURE__ */ jsx(RetentionNote, { days: d.retentionDays })
				]
			});
		}
	});
}
function PagesTab({ filter }) {
	const pages = useReport("pages", filter);
	const scroll = useReport("scroll", filter);
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--loose",
		children: [/* @__PURE__ */ jsx(Section, {
			report: pages,
			children: (d) => /* @__PURE__ */ jsx(Card, {
				title: "Seiten",
				note: "Ausstiegsquote: Anteil der Aufrufe, nach denen der Besuch endete. Absprungrate: Besuche, die auf dieser Seite einstiegen und nach einer Seite endeten.",
				children: d.pages.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "tds-empty",
					children: "Keine Seitenaufrufe im Zeitraum."
				}) : /* @__PURE__ */ jsxs("table", {
					className: "tds-table",
					tabIndex: 0,
					role: "region",
					"aria-label": "Seiten",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Seite"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Aufrufe"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Einstiege"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Ausstiege"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Ausstiegsquote"
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Absprungrate"
						})
					] }) }), /* @__PURE__ */ jsx("tbody", { children: d.pages.map((p) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							style: { overflowWrap: "anywhere" },
							children: p.path
						}),
						/* @__PURE__ */ jsx("td", { children: num(p.pageviews) }),
						/* @__PURE__ */ jsx("td", { children: num(p.entries) }),
						/* @__PURE__ */ jsx("td", { children: num(p.exits) }),
						/* @__PURE__ */ jsx("td", { children: pct(p.exitRate) }),
						/* @__PURE__ */ jsx("td", { children: pct(p.bounceRate) })
					] }, p.path)) })]
				})
			})
		}), /* @__PURE__ */ jsx(Section, {
			report: scroll,
			children: (d) => /* @__PURE__ */ jsx(Card, {
				title: "Scrolltiefe",
				note: "Anteil der Aufrufe, die 25, 50, 75 und 100 % der Seite erreicht haben, und die erreichten Abschnitte.",
				children: d.pages.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "tds-empty",
					children: "Keine Daten im Zeitraum."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "tds-list",
					children: d.pages.slice(0, 15).map((p) => /* @__PURE__ */ jsx("li", {
						className: "tds-list__row",
						children: /* @__PURE__ */ jsxs("div", {
							className: "tds-stack tds-stack--tight",
							style: {
								flex: "1 1 100%",
								minWidth: 0
							},
							children: [
								/* @__PURE__ */ jsx("strong", {
									style: { overflowWrap: "anywhere" },
									children: p.path
								}),
								/* @__PURE__ */ jsx("span", {
									className: "tds-row",
									children: [
										"25",
										"50",
										"75",
										"100"
									].map((m) => /* @__PURE__ */ jsxs("span", {
										className: "chip chip--neutral",
										children: [
											m,
											" %: ",
											pct(p.reached[m])
										]
									}, m))
								}),
								p.sections.length > 0 ? /* @__PURE__ */ jsx(BarList, {
									empty: "",
									max: p.pageviews,
									rows: p.sections.map((s) => ({
										key: s.id,
										label: `#${s.id}`,
										value: s.count,
										hint: pct(s.share)
									}))
								}) : null
							]
						})
					}, p.path))
				})
			})
		})]
	});
}
var rows = (list, name = (k) => k || "Unbekannt") => {
	const total = list.reduce((s, r) => s + r.count, 0);
	return list.map((r) => ({
		key: r.key || "_",
		label: name(r.key),
		value: r.count,
		hint: total > 0 ? pct(r.count / total) : void 0
	}));
};
function SourcesTab({ filter }) {
	const sources = useReport("sources", filter);
	const clicks = useReport("clicks", filter);
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--loose",
		children: [/* @__PURE__ */ jsx(Section, {
			report: sources,
			children: (d) => /* @__PURE__ */ jsxs("div", {
				className: "tds-grid-auto",
				children: [
					/* @__PURE__ */ jsx(Card, {
						title: "Kanäle",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine Besuche.",
							rows: rows(d.channel, (k) => label(CHANNEL_LABELS, k))
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Verweisende Seiten",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine Verweise.",
							rows: rows(d.ref.filter((r) => r.key !== ""))
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Kampagnen (utm_campaign)",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine Kampagnen.",
							rows: rows(d.campaign.filter((r) => r.key !== ""))
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Quellen (utm_source)",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine getaggten Links.",
							rows: rows(d.source.filter((r) => r.key !== ""))
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Länder",
						note: d.geoip ? "IP-Geolokalisierung: DB-IP.com (CC BY 4.0)" : "Länderdatenbank noch nicht geladen.",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine Besuche.",
							rows: rows(d.country, countryName)
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Geräte",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine Besuche.",
							rows: rows(d.device, (k) => label(DEVICE_LABELS, k))
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Browser",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine Besuche.",
							rows: rows(d.browser, (k) => label(BROWSER_LABELS, k))
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Betriebssysteme",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine Besuche.",
							rows: rows(d.os, (k) => label(OS_LABELS, k))
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Sprache",
						children: /* @__PURE__ */ jsx(BarList, {
							empty: "Keine Besuche.",
							rows: rows(d.lang, (k) => k === "en" ? "Englisch" : k === "de" ? "Deutsch" : k)
						})
					})
				]
			})
		}), /* @__PURE__ */ jsx(Section, {
			report: clicks,
			children: (d) => /* @__PURE__ */ jsxs("div", {
				className: "tds-grid-auto",
				children: [/* @__PURE__ */ jsx(Card, {
					title: "Klicks auf Schaltflächen",
					note: "Elemente mit data-track-Namen.",
					children: /* @__PURE__ */ jsx(BarList, {
						empty: "Keine Klicks erfasst.",
						rows: rows(d.cta)
					})
				}), /* @__PURE__ */ jsx(Card, {
					title: "Ausgehende Links",
					note: "Zieldomain von Links, die die Site verlassen.",
					children: /* @__PURE__ */ jsx(BarList, {
						empty: "Keine ausgehenden Klicks.",
						rows: rows(d.outbound)
					})
				})]
			})
		})]
	});
}
var FORM_LABELS = {
	contact: "Kontaktformular",
	newsletter: "Newsletter",
	login: "Anmeldung",
	checkout: "Kasse"
};
function FormsTab({ filter }) {
	const forms = useReport("forms", filter);
	return /* @__PURE__ */ jsx(Section, {
		report: forms,
		children: (d) => d.forms.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "tds-empty",
			children: "Im Zeitraum hat niemand ein markiertes Formular begonnen."
		}) : /* @__PURE__ */ jsx("div", {
			className: "tds-grid-auto",
			children: d.forms.map((f) => /* @__PURE__ */ jsxs(Card, {
				title: label(FORM_LABELS, f.form),
				children: [
					/* @__PURE__ */ jsx(BarList, {
						empty: "",
						max: f.started,
						rows: [
							{
								key: "started",
								label: "Begonnen",
								value: f.started
							},
							{
								key: "submitted",
								label: "Abgeschickt",
								value: f.submitted,
								hint: pct(f.conversion)
							},
							{
								key: "abandoned",
								label: "Abgebrochen",
								value: f.abandoned
							}
						]
					}),
					/* @__PURE__ */ jsx("h3", { children: "Abgebrochen nach Feld" }),
					/* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Das zuletzt ausgefüllte Feld — nur sein Name, nie der Inhalt."
					}),
					/* @__PURE__ */ jsx(BarList, {
						empty: "Kein Abbruch.",
						rows: f.abandonedAt.map((a) => ({
							key: a.field,
							label: a.field,
							value: a.count
						}))
					})
				]
			}, f.form))
		})
	});
}
function RetentionNote({ days }) {
	if (!days) return null;
	return /* @__PURE__ */ jsxs("p", {
		className: "marginalia",
		children: [
			"Einzelne Besuche werden ",
			days,
			" Tage gespeichert, danach bleiben nur anonyme Tagessummen. Besucher zählen in älteren Zeiträumen je Tag."
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-analytics/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Öffentliche Sites</p><h1 class="tds-page__title">Besucher-Statistik</h1><p class="tds-page__lede">Woher Besucher kommen, was sie anklicken und wo sie abspringen — nur mit Einwilligung erfasst.</p></div></div>${renderComponent($$result, "Dashboard", Dashboard, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/Dashboard.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-analytics/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/statistik.astro
var statistik_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Statistik,
	file: () => $$file,
	url: () => void 0
});
var $$Statistik = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Statistik" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/statistik.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/statistik.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/statistik@_@astro
var page = () => statistik_exports;
//#endregion
export { page };
