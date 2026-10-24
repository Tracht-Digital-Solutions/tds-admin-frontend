import { a as renderComponent, et as __exportAll, f as renderTemplate, h as addAttribute, p as maybeRenderHead } from "./server_Cdzh4AE6.mjs";
import { r as emptyPlacement } from "./schemas_BUizrtX_.mjs";
import { n as createComponent } from "./compiler_CX02AaCz.mjs";
import { B as toast, S as SkeletonText, T as SummaryMetric, X as renderScript, b as ProductCard, h as $$Icon, k as apiFetch, n as hueForKey, r as widgetIcon, t as $$Layout, x as Skeleton } from "./Layout_D80p1pEh.mjs";
import { t as Alert } from "./chunk-S5MXGWAS_x1E9P-4b.mjs";
import { r as Sparkline } from "./charts_BTZceFk9.mjs";
import { h as pct, m as num, p as loadReport } from "./lib_BfA1tVXt.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-ext-projects/islands/WidgetBody.tsx
/** "Aktive Projekte" widget body — the active-project count from `/projects/summary`. */
function ActiveProjectsCount() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/projects/summary",
		value: (d) => Number(d.active ?? 0)
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-projects/widgets/Widget.astro
var $$Widget$14 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Aktive Projekte</h3>${renderComponent($$result, "ActiveProjectsCount", ActiveProjectsCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-time-tracker/islands/WeekSummary.tsx
/**
* Dashboard widget body — this week's tracked hours + a running-timer hint.
* Fetches the manifest's dataEndpoint (`/time/summary`) via the panel API
* (same-origin relative fetch with the session cookie, like every extension).
*/
function WeekSummary() {
	const [data, setData] = useState(null);
	const [failed, setFailed] = useState(false);
	useEffect(() => {
		apiFetch("/time/summary").then((r) => r.ok ? r.json() : Promise.reject(/* @__PURE__ */ new Error())).then((d) => setData(d)).catch(() => setFailed(true));
	}, []);
	if (failed) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		children: "–"
	});
	if (data === null) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": "true",
		children: /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		})
	});
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
		className: "tds-widget__metric",
		children: [data.weekHours.toLocaleString("de-DE"), " h"]
	}), data.running ? /* @__PURE__ */ jsx("p", {
		className: "text-xs opacity-70",
		children: "⏱ Timer läuft"
	}) : null] });
}
// node_modules/@tracht-digital-solutions/tds-ext-time-tracker/widgets/Week.astro
var $$Week = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Diese Woche</h3>${renderComponent($$result, "WeekSummary", WeekSummary, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-time-tracker/islands/WeekSummary.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-time-tracker/widgets/Week.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/WidgetBody.tsx
/** "Offene Tickets" widget body — the open-ticket count from `/tickets/summary`. */
function OpenTicketsCount() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/tickets/summary",
		value: (d) => Number(d.open ?? 0)
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-support-tickets/widgets/Widget.astro
var $$Widget$13 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Offene Tickets</h3>${renderComponent($$result, "OpenTicketsCount", OpenTicketsCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-billing/islands/WidgetBody.tsx
/** Billing widget body — the open-invoice count from `/billing/summary`. */
function WidgetBody$7() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/billing/summary",
		value: (d) => d.open,
		caption: (d) => d.configured === false ? "Stripe nicht konfiguriert" : d.open === 1 ? "offene Rechnung" : "offene Rechnungen",
		children: (d) => /* @__PURE__ */ jsx("a", {
			className: "link-underline text-sm inline-flex items-center min-h-11 self-start",
			href: "/rechnungen",
			children: d.open > 0 ? "Jetzt ansehen und bezahlen" : "Alle Rechnungen"
		})
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro
var $$Widget$12 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Offene Rechnungen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$7, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/WidgetBody.tsx
/** Live-chat widget body — open chats, with new contact requests underneath. */
function WidgetBody$6() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/live-chat-cta/summary",
		value: (d) => Number(d.openChats ?? 0),
		caption: (d) => {
			const n = Number(d.newContacts ?? 0);
			return `${n} neue Kontaktanfrage${n === 1 ? "" : "n"}`;
		}
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro
var $$Widget$11 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Offene Chats</h3>${renderComponent($$result, "WidgetBody", WidgetBody$6, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-customers/islands/WidgetBody.tsx
/** Customers widget body — the directory count from `/companies/summary`. */
function WidgetBody$5() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/companies/summary",
		caption: () => "Firmen im Verzeichnis"
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-customers/widgets/Widget.astro
var $$Widget$10 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Firmen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$5, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-customers/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-customers/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/WidgetBody.tsx
/**
* Dashboard card: visits of the last seven days, the bounce rate and a
* sparkline. A failed load shows "–", never a 0 — zero visitors is a real
* answer this card must not give when it simply could not ask.
*/
function WidgetBody$4() {
	const [report, setReport] = useState({ state: "loading" });
	useEffect(() => {
		let live = true;
		loadReport("summary", null).then((r) => {
			if (live) setReport(r);
		});
		return () => {
			live = false;
		};
	}, []);
	if (report.state === "loading") return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": "true",
		children: /* @__PURE__ */ jsx(Skeleton, {
			width: "4ch",
			height: "1.75rem"
		})
	});
	if (report.state === "error") return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		title: report.message,
		children: "–"
	});
	const t = report.data.totals;
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack tds-stack--tight",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "tds-widget__metric",
				children: num(t.visits)
			}),
			/* @__PURE__ */ jsx(Sparkline, {
				values: report.data.series.map((s) => s.visits),
				label: `Besuche der letzten sieben Tage: ${report.data.series.map((s) => s.visits).join(", ")}`
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "marginalia",
				children: [
					"Absprungrate ",
					pct(t.bounceRate),
					" · ",
					/* @__PURE__ */ jsx("a", {
						href: "/statistik",
						children: "Statistik öffnen"
					})
				]
			})
		]
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-analytics/widgets/Widget.astro
var $$Widget$9 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Besuche (7 Tage)</h3>${renderComponent($$result, "WidgetBody", WidgetBody$4, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-analytics/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/WidgetBody.tsx
/**
* "Neue Anfragen" widget body — the count of unhandled contact messages.
*
* It reloads whenever the shell's poller announces a new request
* (`refreshOnModule`): a tile still showing yesterday's count next to a toast
* about a new one is worse than no tile.
*/
function NewContactCount() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/contact/summary",
		value: (d) => Number(d.new ?? 0),
		refreshOnModule: "contact-tickets"
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/widgets/Widget.astro
var $$Widget$8 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Neue Anfragen</h3>${renderComponent($$result, "NewContactCount", NewContactCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/WidgetBody.tsx
/**
* Lexware widget body — the number of invoices exported to Lexware, and
* whether the integration is configured at all.
*/
function WidgetBody$3() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/lexware/summary",
		value: (d) => d.invoiceCount,
		caption: (d) => d.configured ? "Rechnungen an Lexware" : "Lexware nicht konfiguriert"
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-lexware/widgets/Widget.astro
var $$Widget$7 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Lexware-Rechnungen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$3, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-messages/islands/WidgetBody.tsx
/** "Neue Nachrichten" widget body — the unread count from `/messages/summary`. */
function UnreadMessagesCount() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/messages/summary",
		value: (d) => Number(d.unread ?? 0)
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-messages/widgets/Widget.astro
var $$Widget$6 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Neue Nachrichten</h3>${renderComponent($$result, "UnreadMessagesCount", UnreadMessagesCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-messages/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-messages/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/WidgetBody.tsx
/** "Websites" widget body — the count of managed sites, from `/cms/summary`. */
function ManagedSitesCount() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/cms/summary",
		value: (d) => Number(d.sites ?? 0)
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-website-cms/widgets/Widget.astro
var $$Widget$5 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Websites</h3>${renderComponent($$result, "ManagedSitesCount", ManagedSitesCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-documents/islands/WidgetBody.tsx
/** "Dokumente" widget body — the document count from `/documents/summary`. */
function DocumentCount() {
	return /* @__PURE__ */ jsx(SummaryMetric, { endpoint: "/documents/summary" });
}
// node_modules/@tracht-digital-solutions/tds-ext-documents/widgets/Widget.astro
var $$Widget$4 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Dokumente</h3>${renderComponent($$result, "DocumentCount", DocumentCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-documents/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-documents/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/WidgetBody.tsx
/** "Blog-Beiträge" widget body — the total post count, from `/blog/summary`. */
function PostsCount() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/blog/summary",
		value: (d) => Number(d.posts ?? 0)
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro
var $$Widget$3 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Blog-Beiträge</h3>${renderComponent($$result, "PostsCount", PostsCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-shop/islands/WidgetBody.tsx
/**
* Shop widget body. Leads with the published count; the two numbers under it
* are the ones that need work (no own text yet, stale prices). A failure reads
* `—` — a zero would be a number the reader has no reason to doubt.
*/
function WidgetBody$2() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/shop/summary",
		value: (d) => d.published,
		children: (d) => /* @__PURE__ */ jsxs("ul", {
			className: "tds-list",
			children: [/* @__PURE__ */ jsxs("li", {
				className: "tds-list__row",
				children: [/* @__PURE__ */ jsx("span", { children: "Ohne eigenen Text" }), /* @__PURE__ */ jsx("span", { children: d.unwritten })]
			}), /* @__PURE__ */ jsxs("li", {
				className: "tds-list__row",
				children: [/* @__PURE__ */ jsx("span", { children: "Preise veraltet" }), /* @__PURE__ */ jsx("span", { children: d.stalePrices })]
			})]
		})
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/Widget.astro
var $$Widget$2 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">TDShop</h3>${renderComponent($$result, "WidgetBody", WidgetBody$2, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-shop/islands/SyncBody.tsx
/**
* The offer-sync widget.
*
* It exists for one state that has no other symptom: **Amazon has withdrawn
* API access.** That happens when qualifying sales stop, and nothing about it
* looks broken — the shop keeps working, the links keep working, prices simply
* stop appearing as each quote passes its 24-hour life. Without this widget
* the first sign would be someone noticing, weeks later, that the catalogue
* has no prices.
*
* So a revoked queue is rendered as a persistent in-flow alert, not a toast: a
* toast disappears while it is being read, and this is a standing condition
* somebody has to act on.
*/
function SyncBody() {
	const [status, setStatus] = useState(null);
	const [failed, setFailed] = useState(false);
	const [busy, setBusy] = useState(false);
	const load = useCallback(async () => {
		try {
			const res = await apiFetch("/shop/sync/status");
			if (!res.ok) throw new Error(String(res.status));
			setStatus(await res.json());
			setFailed(false);
		} catch {
			setFailed(true);
		}
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	const run = async () => {
		setBusy(true);
		try {
			const res = await apiFetch("/shop/sync/enqueue", { method: "POST" });
			if (!res.ok) throw new Error(String(res.status));
			const result = await res.json();
			if (result.stopped === "revoked") toast.danger("Amazon lehnt den Zugang weiterhin ab — Zugangsdaten und Partnerprogramm prüfen.");
			else toast.success(`${result.ok} Angebote aktualisiert, ${result.failed} fehlgeschlagen.`);
			await load();
		} catch (err) {
			toast.danger(`Abgleich fehlgeschlagen (${err instanceof Error ? err.message : "unbekannt"}).`);
		} finally {
			setBusy(false);
		}
	};
	if (failed) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		children: "—"
	});
	if (!status) return /* @__PURE__ */ jsx(Skeleton, {
		width: "6ch",
		height: "1.75rem"
	});
	if (!status.configured) return /* @__PURE__ */ jsxs("p", { children: [
		"Nicht konfiguriert. Zugangsdaten unter ",
		/* @__PURE__ */ jsx("strong", { children: "Einstellungen → TDShop" }),
		"."
	] });
	const pending = (status.queue.pending ?? 0) + (status.queue.error ?? 0);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		status.revoked ? /* @__PURE__ */ jsx(Alert, { children: "Amazon hat den API-Zugang entzogen. Der Katalog läuft weiter, aber Preise verschwinden nach 24 Stunden aus der Anzeige. Prüfen, ob das Partnerprogramm noch aktiv ist, dann hier erneut anstoßen." }) : null,
		/* @__PURE__ */ jsx("p", {
			className: "tds-widget__metric",
			children: pending
		}),
		/* @__PURE__ */ jsxs("ul", {
			className: "tds-list",
			children: [/* @__PURE__ */ jsxs("li", {
				className: "tds-list__row",
				children: [/* @__PURE__ */ jsx("span", { children: "Wartend" }), /* @__PURE__ */ jsx("span", { children: pending })]
			}), /* @__PURE__ */ jsxs("li", {
				className: "tds-list__row",
				children: [/* @__PURE__ */ jsx("span", { children: "Zuletzt aktualisiert" }), /* @__PURE__ */ jsx("span", { children: status.lastRun?.items_ok ?? 0 })]
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "tds-toolbar",
			children: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => void run(),
				disabled: busy,
				"aria-busy": busy,
				children: "Jetzt abgleichen"
			})
		})
	] });
}
// node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/SyncWidget.astro
var $$SyncWidget = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Angebotsabgleich</h3>${renderComponent($$result, "SyncBody", SyncBody, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/SyncBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/SyncWidget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-tools/islands/WidgetBody.tsx
/** Compact tools status: enabled/total, premium count, AdSense on/off. */
function WidgetBody$1() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/tools/summary",
		value: (d) => /* @__PURE__ */ jsxs(Fragment$1, { children: [d.enabled, /* @__PURE__ */ jsxs("span", {
			className: "text-base opacity-60",
			children: [" / ", d.total]
		})] }),
		caption: () => "sichtbare Tools",
		children: (d) => /* @__PURE__ */ jsxs("p", {
			className: "marginalia",
			children: [
				d.premium,
				" Premium · AdSense ",
				d.ads ? "an" : "aus"
			]
		})
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-tools/widgets/Widget.astro
var $$Widget$1 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Tools</h3>${renderComponent($$result, "WidgetBody", WidgetBody$1, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/widgets/Widget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-shop/islands/PicksBody.tsx
var PLACEMENT_KEY = "panel-dashboard";
/**
* Product placement in the customer portal dashboard.
*
* Renders the shared `ProductCard`, which carries the advertising label and the
* price-freshness rule itself — this island decides nothing about either, and
* that is deliberate: three surfaces render this card, and a rule re-decided
* per surface is a rule that eventually differs on one of them.
*
* ### Empty is a normal state here, not an error
*
* A slot with nothing in it renders NOTHING — no heading, no empty-state card,
* no "no recommendations yet". This is advertising inside somebody's working
* dashboard; an empty box explaining that there is no advertising is worse than
* the absence it describes. The widget therefore collapses to null, and the
* dashboard closes over the gap.
*
* Returning null was not enough on its own: `widgets/PicksWidget.astro` draws
* the card and its "Empfehlungen" heading around this island, so an empty slot
* still left an empty titled card on every portal dashboard (seen 2026-10-07).
* An empty placement therefore hides the dashboard slot it sits in.
*/
function PicksBody() {
	const [placement, setPlacement] = useState(null);
	const [loading, setLoading] = useState(true);
	const marker = useRef(null);
	const empty = !loading && (!placement || placement.products.length === 0);
	useEffect(() => {
		if (!empty) return;
		const box = marker.current?.closest(".widget-slot") ?? marker.current?.closest(".tds-widget");
		if (box) box.hidden = true;
	}, [empty]);
	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				const res = await apiFetch(`/content/shop/placement/${PLACEMENT_KEY}?lang=de`);
				if (!res.ok) throw new Error(String(res.status));
				const json = await res.json();
				if (alive) setPlacement(json);
			} catch {
				if (alive) setPlacement(emptyPlacement(PLACEMENT_KEY));
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, []);
	if (loading) return /* @__PURE__ */ jsx(SkeletonText, { lines: 2 });
	if (empty || !placement) return /* @__PURE__ */ jsx("span", {
		ref: marker,
		hidden: true
	});
	const attribute = (url, lang) => `${url}?source=customer&placement=${PLACEMENT_KEY}&lang=${lang}`;
	return /* @__PURE__ */ jsx("div", {
		className: "tds-product-strip",
		children: placement.products.map((product) => /* @__PURE__ */ jsx(ProductCard, {
			product: {
				...product,
				offers: product.offers.map((o) => ({
					...o,
					url: attribute(o.url, product.lang)
				}))
			},
			variant: "card",
			lang: product.lang,
			affiliateLabel: placement.label
		}, product.slug))
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/PicksWidget.astro
var $$PicksWidget = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Empfehlungen</h3>${renderComponent($$result, "PicksBody", PicksBody, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/PicksBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/PicksWidget.astro", void 0);
// node_modules/@tracht-digital-solutions/tds-ext-cards/islands/WidgetBody.tsx
/** "Visitenkarten" widget body — published cards out of all cards. */
function WidgetBody() {
	return /* @__PURE__ */ jsx(SummaryMetric, {
		endpoint: "/cards/summary",
		value: (d) => /* @__PURE__ */ jsxs(Fragment$1, { children: [d.published, /* @__PURE__ */ jsxs("span", {
			className: "marginalia",
			children: [
				" von ",
				d.total,
				" veröffentlicht"
			]
		})] })
	});
}
// node_modules/@tracht-digital-solutions/tds-ext-cards/widgets/Widget.astro
var $$Widget = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Visitenkarten</h3>${renderComponent($$result, "WidgetBody", WidgetBody, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-cards/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-cards/widgets/Widget.astro", void 0);
// \0virtual:frontend-widgets
var widgets = [
	{
		"id": "projects-active",
		"title": "Aktive Projekte",
		"island": "@tracht-digital-solutions/tds-ext-projects/widgets/Widget.astro",
		"size": "sm",
		"permission": "projects:read",
		"dataEndpoint": "/projects/summary",
		"order": 5,
		Component: $$Widget$14
	},
	{
		"id": "time-week",
		"title": "Diese Woche",
		"island": "@tracht-digital-solutions/tds-ext-time-tracker/widgets/Week.astro",
		"size": "md",
		"permission": "time:read",
		"dataEndpoint": "/time/summary",
		"order": 10,
		Component: $$Week
	},
	{
		"id": "tickets-open",
		"title": "Offene Tickets",
		"island": "@tracht-digital-solutions/tds-ext-support-tickets/widgets/Widget.astro",
		"size": "sm",
		"permission": "tickets:read",
		"dataEndpoint": "/tickets/summary",
		"order": 10,
		Component: $$Widget$13
	},
	{
		"id": "billing-open",
		"title": "Offene Rechnungen",
		"island": "@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro",
		"size": "sm",
		"permission": "invoices:read",
		"dataEndpoint": "/billing/summary",
		"order": 10,
		Component: $$Widget$12
	},
	{
		"id": "live-chat-open",
		"title": "Offene Chats",
		"island": "@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro",
		"size": "sm",
		"permission": "live-chat:read",
		"dataEndpoint": "/live-chat-cta/summary",
		"order": 15,
		Component: $$Widget$11
	},
	{
		"id": "customers-count",
		"title": "Firmen",
		"island": "@tracht-digital-solutions/tds-ext-customers/widgets/Widget.astro",
		"size": "sm",
		"permission": "companies:read",
		"dataEndpoint": "/companies/summary",
		"order": 15,
		Component: $$Widget$10
	},
	{
		"id": "analytics-visits",
		"title": "Besuche (7 Tage)",
		"island": "@tracht-digital-solutions/tds-ext-analytics/widgets/Widget.astro",
		"size": "md",
		"permission": "analytics:read",
		"dataEndpoint": "/analytics/summary",
		"order": 15,
		Component: $$Widget$9
	},
	{
		"id": "contact-new",
		"title": "Neue Anfragen",
		"island": "@tracht-digital-solutions/tds-ext-contact-tickets/widgets/Widget.astro",
		"size": "sm",
		"permission": "contact:read",
		"dataEndpoint": "/contact/summary",
		"order": 20,
		Component: $$Widget$8
	},
	{
		"id": "lexware-invoices",
		"title": "Lexware-Rechnungen",
		"island": "@tracht-digital-solutions/tds-ext-lexware/widgets/Widget.astro",
		"size": "sm",
		"permission": "lexware:read",
		"dataEndpoint": "/lexware/summary",
		"order": 20,
		Component: $$Widget$7
	},
	{
		"id": "messages-unread",
		"title": "Neue Nachrichten",
		"island": "@tracht-digital-solutions/tds-ext-messages/widgets/Widget.astro",
		"size": "sm",
		"permission": "messages:read",
		"dataEndpoint": "/messages/summary",
		"order": 20,
		Component: $$Widget$6
	},
	{
		"id": "website-cms-sites",
		"title": "Websites",
		"island": "@tracht-digital-solutions/tds-ext-website-cms/widgets/Widget.astro",
		"size": "sm",
		"permission": "website:read",
		"dataEndpoint": "/cms/summary",
		"order": 30,
		Component: $$Widget$5
	},
	{
		"id": "documents-count",
		"title": "Dokumente",
		"island": "@tracht-digital-solutions/tds-ext-documents/widgets/Widget.astro",
		"size": "sm",
		"permission": "documents:read",
		"dataEndpoint": "/documents/summary",
		"order": 30,
		Component: $$Widget$4
	},
	{
		"id": "blog-cms-posts",
		"title": "Blog-Beiträge",
		"island": "@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro",
		"size": "sm",
		"permission": "blog:read",
		"dataEndpoint": "/blog/summary",
		"order": 40,
		Component: $$Widget$3
	},
	{
		"id": "shop-summary",
		"title": "TDShop",
		"island": "@tracht-digital-solutions/tds-ext-shop/widgets/Widget.astro",
		"size": "sm",
		"permission": "shop:read",
		"dataEndpoint": "/shop/summary",
		"order": 45,
		Component: $$Widget$2
	},
	{
		"id": "shop-sync",
		"title": "Angebotsabgleich",
		"island": "@tracht-digital-solutions/tds-ext-shop/widgets/SyncWidget.astro",
		"size": "sm",
		"permission": "shop:sync",
		"dataEndpoint": "/shop/sync/status",
		"order": 46,
		Component: $$SyncWidget
	},
	{
		"id": "tools-status",
		"title": "Tools",
		"island": "@tracht-digital-solutions/tds-ext-tools/widgets/Widget.astro",
		"size": "sm",
		"permission": "tools:manage",
		"dataEndpoint": "/tools/summary",
		"order": 50,
		Component: $$Widget$1
	},
	{
		"id": "shop-picks",
		"title": "Empfehlungen",
		"island": "@tracht-digital-solutions/tds-ext-shop/widgets/PicksWidget.astro",
		"size": "md",
		"order": 90,
		Component: $$PicksWidget
	},
	{
		"id": "cards-widget",
		"title": "Visitenkarten",
		"island": "@tracht-digital-solutions/tds-ext-cards/widgets/Widget.astro",
		"size": "sm",
		"permission": "cards:read",
		"dataEndpoint": "/cards/summary",
		"order": 140,
		Component: $$Widget
	}
];
// node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Übersicht</p><h1 class="tds-page__title">Dashboard</h1></div><div class="tds-toolbar" data-dashboard-toolbar><button type="button" class="btn btn-ghost" data-dashboard-edit hidden>Anpassen</button><button type="button" class="btn btn-primary" data-dashboard-save hidden>Speichern</button><button type="button" class="btn btn-ghost" data-dashboard-cancel hidden>Abbrechen</button></div></div><h2 class="sr-only">Kacheln</h2><div class="dashboard-grid" data-dashboard-grid>${widgets.map((widget) => {
		const Widget = widget.Component;
		const title = widget.title ?? widget.id;
		return renderTemplate`<section class="widget-slot"${addAttribute(widget.id, "data-widget")}${addAttribute(widget.size, "data-size")}${addAttribute(title, "data-label")}${addAttribute(widget.permission, "data-reveal-permission")}${addAttribute(widget.permission !== void 0, "hidden")}${addAttribute(`--tds-widget-hue: ${hueForKey(widget.id)}`, "style")}><div class="widget-slot__controls"><span class="widget-slot__handle" title="Ziehen zum Sortieren" aria-hidden="true">⠿</span><button type="button" class="btn btn-ghost widget-slot__move" data-widget-move="up"${addAttribute(`${title} nach vorne schieben`, "aria-label")}>${renderComponent($$result, "Icon", $$Icon, {
			"name": "chevron-up",
			"size": 16
		})}</button><button type="button" class="btn btn-ghost widget-slot__move" data-widget-move="down"${addAttribute(`${title} nach hinten schieben`, "aria-label")}>${renderComponent($$result, "Icon", $$Icon, {
			"name": "chevron-down",
			"size": 16
		})}</button><label class="widget-slot__toggle"><input type="checkbox" data-widget-visible checked><span>${title}</span></label></div><span class="widget-slot__icon" aria-hidden="true">${renderComponent($$result, "Icon", $$Icon, {
			"name": widgetIcon(widget.id),
			"size": 16
		})}</span>${renderComponent($$result, "Widget", Widget, {})}</section>`;
	})}</div></section><style>
    .widget-slot__controls { display: none; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .dashboard-grid.is-editing .widget-slot__controls { display: flex; }
    .dashboard-grid.is-editing .widget-slot {
      outline: 1px dashed color-mix(in srgb, var(--color-primary, #050f68) 40%, transparent);
      outline-offset: 4px; border-radius: 0.5rem;
    }
    .dashboard-grid.is-editing .widget-slot.is-hidden { opacity: 0.45; }
    .dashboard-grid.is-editing .widget-slot.is-dragging { opacity: 0.5; }
    .widget-slot.is-hidden { display: none; }
    /* Not permitted (WidgetManifest.permission): gone in edit mode too, and its
       island never hydrates — \`client:visible\` waits for a box that never comes,
       so no 403 is even requested. */
    .widget-slot[hidden] { display: none !important; }
    .dashboard-grid.is-editing .widget-slot.is-hidden { display: block; }
    .widget-slot__handle { cursor: grab; user-select: none; font-size: 1.1rem; line-height: 1; }
    .widget-slot__toggle { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.9rem; }
    /* The drag handle is the mouse affordance and nothing else — HTML5 drag
       and drop does not exist on a touch screen, and it is unreachable by
       keyboard either way. These two buttons are the real control; the drag
       stays because it is the faster gesture where it works. */
    .widget-slot__move { padding: 0.25rem 0.4rem; }
    @media (pointer: coarse) { .widget-slot__handle { display: none; } }
    /* The hue icon is absolutely positioned to the SLOT's top-right (the
       .tds-widget markup belongs to each extension and is not touched), so
       once edit mode reveals the controls row above the widget the icon would
       overlay it. Edit mode is chrome, not the finished view — drop it. */
    .dashboard-grid.is-editing .widget-slot__icon { display: none; }
  </style>${renderScript($$result, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/index.astro?astro&type=script&index=0&lang.ts")}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/index.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/index.astro";
// \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/index@_@astro
var page = () => pages_exports;
export { page };
