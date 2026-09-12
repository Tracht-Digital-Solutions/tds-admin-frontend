import { B as ZodDate, G as literal, H as array, J as string, K as number, U as boolean, V as _enum, W as discriminatedUnion, X as _coercedDate, Y as union, Z as __exportAll, d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute, q as object } from "./server_d-ZXef0y.mjs";
import { t as createComponent } from "./compiler_6xhkfg2O.mjs";
import { C as renderScript, b as SkeletonText, f as $$Icon, n as hueForKey, r as widgetIcon, t as $$Layout, v as ProductCard, x as Spinner, y as Skeleton } from "./Layout_Bgah88_2.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { t as toast } from "./toast_CwStKRcr.mjs";
import { useCallback, useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/zod/v4/classic/coerce.js
function date(params) {
	return _coercedDate(ZodDate, params);
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-projects/islands/WidgetBody.tsx
/**
* "Aktive Projekte" widget body. Fetches the active-project count from the
* manifest's dataEndpoint (`/projects/summary`). Relative fetch with credentials.
*/
function ActiveProjectsCount() {
	const [active, setActive] = useState(null);
	useEffect(() => {
		let alive = true;
		apiFetch("/projects/summary").then((r) => r.ok ? r.json() : { active: 0 }).then((d) => alive && setActive(Number(d.active ?? 0))).catch(() => alive && setActive(0));
		return () => {
			alive = false;
		};
	}, []);
	return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": active === null,
		children: active === null ? /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		}) : active
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-projects/widgets/Widget.astro
var $$Widget$12 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Aktive Projekte</h3>${renderComponent($$result, "ActiveProjectsCount", ActiveProjectsCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-projects/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-time-tracker/islands/WeekSummary.tsx
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
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-time-tracker/widgets/Week.astro
var $$Week = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Diese Woche</h3>${renderComponent($$result, "WeekSummary", WeekSummary, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-time-tracker/islands/WeekSummary.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-time-tracker/widgets/Week.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/WidgetBody.tsx
/**
* "Offene Tickets" widget body. Fetches the count from the manifest's
* dataEndpoint (`/tickets/summary`) via the base API wrapper. Checkpoint-1 uses
* a relative fetch with credentials; the shared api client is wired in the next
* frontend checkpoint.
*/
function OpenTicketsCount() {
	const [open, setOpen] = useState(null);
	useEffect(() => {
		let alive = true;
		apiFetch("/tickets/summary").then((r) => r.ok ? r.json() : { open: 0 }).then((d) => alive && setOpen(Number(d.open ?? 0))).catch(() => alive && setOpen(0));
		return () => {
			alive = false;
		};
	}, []);
	if (open === null) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": "true",
		children: /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		})
	});
	return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		children: open
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-support-tickets/widgets/Widget.astro
var $$Widget$11 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Offene Tickets</h3>${renderComponent($$result, "OpenTicketsCount", OpenTicketsCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-support-tickets/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-billing/islands/WidgetBody.tsx
/** Billing widget body — open-invoice count. Same-origin fetch with credentials. */
function WidgetBody$5() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		apiFetch("/billing/summary").then((r) => r.ok ? r.json() : Promise.reject(r.status)).then((d) => setData(d)).catch(() => setError(true));
	}, []);
	if (error) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		children: "—"
	});
	if (!data) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": "true",
		children: /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [/* @__PURE__ */ jsx("p", {
			className: "tds-widget__metric",
			children: data.open
		}), /* @__PURE__ */ jsx("p", {
			className: "marginalia",
			children: data.configured ? "offene Rechnungen" : "Stripe nicht konfiguriert"
		})]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro
var $$Widget$10 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Offene Rechnungen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$5, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/WidgetBody.tsx
/** Dashboard widget body — open chats + new contact requests. */
function WidgetBody$4() {
	const [state, setState] = useState(null);
	useEffect(() => {
		let alive = true;
		apiFetch("/live-chat-cta/summary").then((r) => r.ok ? r.json() : {
			openChats: 0,
			newContacts: 0
		}).then((d) => alive && setState({
			openChats: Number(d.openChats ?? 0),
			newContacts: Number(d.newContacts ?? 0)
		})).catch(() => alive && setState({
			openChats: 0,
			newContacts: 0
		}));
		return () => {
			alive = false;
		};
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [/* @__PURE__ */ jsx("p", {
			className: "tds-widget__metric",
			"aria-busy": state === null,
			children: state === null ? /* @__PURE__ */ jsx(Skeleton, {
				width: "3ch",
				height: "1.75rem"
			}) : state.openChats
		}), /* @__PURE__ */ jsx("p", {
			className: "marginalia",
			children: state === null ? "" : `${state.newContacts} neue Kontaktanfrage${state.newContacts === 1 ? "" : "n"}`
		})]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro
var $$Widget$9 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Offene Chats</h3>${renderComponent($$result, "WidgetBody", WidgetBody$4, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-customers/islands/WidgetBody.tsx
/** Customers widget body — the directory count. Same-origin fetch with credentials. */
function WidgetBody$3() {
	const [count, setCount] = useState(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		apiFetch("/companies/summary").then((r) => r.ok ? r.json() : Promise.reject(r.status)).then((d) => setCount(d.count)).catch(() => setError(true));
	}, []);
	if (error) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		children: "—"
	});
	if (count === null) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": "true",
		children: /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [/* @__PURE__ */ jsx("p", {
			className: "tds-widget__metric",
			children: count
		}), /* @__PURE__ */ jsx("p", {
			className: "marginalia",
			children: "Firmen im Verzeichnis"
		})]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-customers/widgets/Widget.astro
var $$Widget$8 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Firmen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$3, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-customers/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-customers/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/WidgetBody.tsx
/** "Neue Anfragen" widget body — the count of unhandled contact messages. */
function NewContactCount() {
	const [n, setN] = useState(null);
	const load = useCallback(async () => {
		try {
			const r = await apiFetch("/contact/summary");
			const d = r.ok ? await r.json() : { new: 0 };
			setN(Number(d.new ?? 0));
		} catch {
			setN(0);
		}
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	useEffect(() => {
		const onNotification = (event) => {
			if (event.detail?.module === "contact-tickets") load();
		};
		window.addEventListener("tds:notification", onNotification);
		return () => window.removeEventListener("tds:notification", onNotification);
	}, [load]);
	return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": n === null,
		children: n === null ? /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		}) : n
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/widgets/Widget.astro
var $$Widget$7 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Neue Anfragen</h3>${renderComponent($$result, "NewContactCount", NewContactCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-contact-tickets/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/WidgetBody.tsx
/**
* Lexware widget body — shows the total invoice count exported to Lexware and
* whether the API is configured. Same-origin fetch with credentials (the deploy
* wires the gateway).
*/
function WidgetBody$2() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		apiFetch("/lexware/summary").then((r) => r.ok ? r.json() : Promise.reject(r.status)).then((d) => setData(d)).catch(() => setError(true));
	}, []);
	if (error) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		children: "—"
	});
	if (!data) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": "true",
		children: /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [/* @__PURE__ */ jsx("p", {
			className: "tds-widget__metric",
			children: data.invoiceCount
		}), /* @__PURE__ */ jsx("p", {
			className: "marginalia",
			children: data.configured ? "Rechnungen an Lexware" : "Lexware nicht konfiguriert"
		})]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-lexware/widgets/Widget.astro
var $$Widget$6 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Lexware-Rechnungen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$2, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-lexware/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-messages/islands/WidgetBody.tsx
/**
* "Neue Nachrichten" widget body. Fetches the unread count from the manifest's
* dataEndpoint (`/messages/summary`). Relative fetch with credentials.
*/
function UnreadMessagesCount() {
	const [unread, setUnread] = useState(null);
	useEffect(() => {
		let alive = true;
		apiFetch("/messages/summary").then((r) => r.ok ? r.json() : { unread: 0 }).then((d) => alive && setUnread(Number(d.unread ?? 0))).catch(() => alive && setUnread(0));
		return () => {
			alive = false;
		};
	}, []);
	return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": unread === null,
		children: unread === null ? /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		}) : unread
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-messages/widgets/Widget.astro
var $$Widget$5 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Neue Nachrichten</h3>${renderComponent($$result, "UnreadMessagesCount", UnreadMessagesCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-messages/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-messages/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/WidgetBody.tsx
/**
* "Websites" widget body — the count of managed sites, from the manifest's
* dataEndpoint (/cms/summary).
*/
function ManagedSitesCount() {
	const [sites, setSites] = useState(null);
	useEffect(() => {
		let alive = true;
		apiFetch("/cms/summary").then((r) => r.ok ? r.json() : { sites: 0 }).then((d) => alive && setSites(Number(d.sites ?? 0))).catch(() => alive && setSites(0));
		return () => {
			alive = false;
		};
	}, []);
	return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": sites === null,
		children: sites === null ? /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		}) : sites
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-website-cms/widgets/Widget.astro
var $$Widget$4 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Websites</h3>${renderComponent($$result, "ManagedSitesCount", ManagedSitesCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-website-cms/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-documents/islands/WidgetBody.tsx
/**
* "Dokumente" widget body. Fetches the document count from the manifest's
* dataEndpoint (`/documents/summary`). Relative fetch with credentials.
*/
function DocumentCount() {
	const [count, setCount] = useState(null);
	useEffect(() => {
		let alive = true;
		apiFetch("/documents/summary").then((r) => r.ok ? r.json() : { count: 0 }).then((d) => alive && setCount(Number(d.count ?? 0))).catch(() => alive && setCount(0));
		return () => {
			alive = false;
		};
	}, []);
	return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": count === null,
		children: count === null ? /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		}) : count
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-documents/widgets/Widget.astro
var $$Widget$3 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Dokumente</h3>${renderComponent($$result, "DocumentCount", DocumentCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-documents/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-documents/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/WidgetBody.tsx
/** "Blog-Beiträge" widget body — the total post count, from /blog/summary. */
function PostsCount() {
	const [posts, setPosts] = useState(null);
	useEffect(() => {
		let alive = true;
		apiFetch("/blog/summary").then((r) => r.ok ? r.json() : { posts: 0 }).then((d) => alive && setPosts(Number(d.posts ?? 0))).catch(() => alive && setPosts(0));
		return () => {
			alive = false;
		};
	}, []);
	return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": posts === null,
		children: posts === null ? /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		}) : posts
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro
var $$Widget$2 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Blog-Beiträge</h3>${renderComponent($$result, "PostsCount", PostsCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/WidgetBody.tsx
/**
* The TDShop dashboard widget.
*
* Leads with the published count, but the two numbers underneath are the ones
* worth a glance:
*
* - `unwritten` — products that render but stay out of the search index for
*   want of their own assessment. That is the number deciding whether the
*   catalogue reads as a resource or as a link farm, and it is invisible
*   everywhere else.
* - `stalePrices` — offers whose quote has aged past 24 hours and is therefore
*   no longer shown. A rising number here means the offer sync has stopped,
*   which otherwise has no symptom at all: the pages keep working, they just
*   quietly stop showing prices.
*
* `apiFetch`, never a relative `fetch`: a relative call hits the host's SPA
* fallback, gets 200 with an HTML body, and renders a calm empty state.
*/
function WidgetBody$1() {
	const [data, setData] = useState(null);
	const [failed, setFailed] = useState(false);
	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				const res = await apiFetch("/shop/summary");
				if (!res.ok) throw new Error(String(res.status));
				const json = await res.json();
				if (alive) setData(json);
			} catch {
				if (alive) setFailed(true);
			}
		})();
		return () => {
			alive = false;
		};
	}, []);
	if (failed) return /* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		children: "—"
	});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("p", {
		className: "tds-widget__metric",
		"aria-busy": data === null,
		children: data ? data.published : /* @__PURE__ */ jsx(Skeleton, {
			width: "3ch",
			height: "1.75rem"
		})
	}), data ? /* @__PURE__ */ jsxs("ul", {
		className: "tds-list",
		children: [/* @__PURE__ */ jsxs("li", {
			className: "tds-list__row",
			children: [/* @__PURE__ */ jsx("span", { children: "Ohne eigenen Text" }), /* @__PURE__ */ jsx("span", { children: data.unwritten })]
		}), /* @__PURE__ */ jsxs("li", {
			className: "tds-list__row",
			children: [/* @__PURE__ */ jsx("span", { children: "Preise veraltet" }), /* @__PURE__ */ jsx("span", { children: data.stalePrices })]
		})]
	}) : null] });
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/Widget.astro
var $$Widget$1 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">TDShop</h3>${renderComponent($$result, "WidgetBody", WidgetBody$1, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/SyncBody.tsx
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
		status.revoked ? /* @__PURE__ */ jsx("div", {
			className: "tds-alert tds-alert--danger",
			children: "Amazon hat den API-Zugang entzogen. Der Katalog läuft weiter, aber Preise verschwinden nach 24 Stunden aus der Anzeige. Prüfen, ob das Partnerprogramm noch aktiv ist, dann hier erneut anstoßen."
		}) : null,
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
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/SyncWidget.astro
var $$SyncWidget = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Angebotsabgleich</h3>${renderComponent($$result, "SyncBody", SyncBody, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/SyncBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/SyncWidget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-tools/islands/WidgetBody.tsx
/** Compact tools status: enabled/total, premium count, AdSense on/off. */
function WidgetBody() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		apiFetch("/tools/summary").then((r) => r.ok ? r.json() : Promise.reject()).then(setData).catch(() => setError(true));
	}, []);
	if (error) return /* @__PURE__ */ jsx("p", {
		className: "text-sm opacity-70",
		children: "—"
	});
	if (!data) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	return /* @__PURE__ */ jsxs("div", {
		className: "tools-widget space-y-1 text-sm",
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "text-2xl font-semibold",
				children: [data.enabled, /* @__PURE__ */ jsxs("span", {
					className: "text-base opacity-60",
					children: [" / ", data.total]
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "opacity-70",
				children: "sichtbare Tools"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "opacity-70",
				children: [
					data.premium,
					" Premium · AdSense ",
					data.ads ? "an" : "aus"
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-tools/widgets/Widget.astro
var $$Widget = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Tools</h3>${renderComponent($$result, "WidgetBody", WidgetBody, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-tools/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/schemas/index.js
var PORTAL_PERMISSIONS = [
	"projects:read",
	"invoices:read",
	"invoices:pay",
	"documents:read",
	"documents:write",
	"messages:read",
	"messages:write",
	"tickets:read",
	"tickets:write"
];
var PERMISSION_KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,31}:[a-z0-9][a-z0-9-]{0,31}$/;
var MAX_PERMISSION_KEYS = 128;
[...PORTAL_PERMISSIONS], PORTAL_PERMISSIONS.filter((p) => p.endsWith(":read"));
var HeadingBlock = object({
	type: literal("heading"),
	level: union([literal(2), literal(3)]),
	text: string().max(300)
});
var ParagraphBlock = object({
	type: literal("paragraph"),
	text: string().max(5e3)
});
var ListBlock = object({
	type: literal("list"),
	ordered: boolean(),
	items: array(string().max(2e3)).max(100)
});
var QuoteBlock = object({
	type: literal("quote"),
	text: string().max(2e3),
	cite: string().max(200).optional().nullable()
});
var CodeBlock = object({
	type: literal("code"),
	lang: string().max(30),
	code: string().max(2e4)
});
var ImageBlock = object({
	type: literal("image"),
	url: string().max(600),
	alt: string().max(300),
	caption: string().max(300).optional().nullable()
});
var DividerBlock = object({ type: literal("divider") });
var CalloutBlock = object({
	type: literal("callout"),
	variant: _enum([
		"info",
		"warn",
		"tip"
	]),
	text: string().max(3e3)
});
var ButtonBlock = object({
	type: literal("button"),
	label: string().max(120),
	href: string().max(600),
	style: _enum(["primary", "ghost"])
});
var VideoBlock = object({
	type: literal("video"),
	provider: _enum(["youtube", "vimeo"]),
	url: string().max(600)
});
var AdsenseBlock = object({
	type: literal("adsense"),
	placement: literal("inline"),
	slot: string().max(60).optional().nullable()
});
var CustomBlock = object({
	type: literal("custom"),
	snippetId: number().int().positive()
});
var ProductBlock = object({
	type: literal("product"),
	slug: string().max(120),
	/** `card` = full product card, `inline` = one compact row, `list` = card + all offers. */
	variant: _enum([
		"card",
		"inline",
		"list"
	])
});
var BlogBlockSchema = discriminatedUnion("type", [
	HeadingBlock,
	ParagraphBlock,
	ListBlock,
	QuoteBlock,
	CodeBlock,
	ImageBlock,
	DividerBlock,
	CalloutBlock,
	ButtonBlock,
	VideoBlock,
	AdsenseBlock,
	CustomBlock,
	ProductBlock
]);
object({
	version: literal(1),
	blocks: array(BlogBlockSchema).min(1).max(400)
});
var ShopOfferSchema = object({
	id: number().int().positive(),
	kind: _enum(["own", "affiliate"]),
	network: _enum([
		"amazon",
		"awin",
		"belboon",
		"digistore",
		"direct"
	]),
	/** Merchant-facing label ("Amazon", "Hetzner"), already localised by the API. */
	merchant: string().max(120),
	/** The outbound URL, affiliate tag already appended by the API. */
	url: string().max(1e3),
	/** Net-of-nothing gross price in minor units; null when we have no quote. */
	priceCents: number().int().nonnegative().nullable(),
	currency: string().length(3).default("EUR"),
	/**
	* When {@link priceCents} was last confirmed, ISO-8601. Null means "never
	* fetched" — which is not the same as a stale price and renders differently:
	* a never-fetched offer simply shows no price, a stale one shows why.
	*/
	priceCheckedAt: string().datetime({ offset: true }).nullable(),
	availability: _enum([
		"in_stock",
		"out_of_stock",
		"unknown"
	]).default("unknown"),
	position: number().int().nonnegative().default(0)
});
var ShopProductRefSchema = object({
	slug: string().max(120),
	lang: _enum(["de", "en"]),
	title: string().max(200),
	teaser: string().max(400),
	category: string().max(60),
	imageUrl: string().max(1e3).nullable(),
	/** Absolute URL of the product page on the shop site. */
	url: string().max(1e3),
	offers: array(ShopOfferSchema).max(20).default([])
});
ShopProductRefSchema.extend({
	/** Blocks JSON or markdown, same dual format as a blog post body. */
	body: string(),
	bodyFormat: _enum(["markdown", "blocks"]).default("blocks"),
	tags: array(string().max(60)).max(20).default([]),
	metaDescription: string().max(300).nullable(),
	publishedAt: string().datetime({ offset: true }).nullable(),
	updatedAt: string().datetime({ offset: true }).nullable(),
	machineTranslated: boolean().default(false)
});
object({
	key: string().max(60),
	/** Heading shown above the slot, already localised. Null renders no heading. */
	heading: string().max(120).nullable(),
	/**
	* The legally required advertising label ("Anzeige" / "Advertisement").
	*
	* Served rather than hard-coded so the label is right in both languages and
	* cannot be forgotten by a consumer — see `ProductCard`, which refuses to
	* render an affiliate offer without one.
	*/
	label: string().max(60),
	products: array(ShopProductRefSchema).max(12).default([])
});
function emptyPlacement(key, lang = "de") {
	return {
		key,
		heading: null,
		label: lang === "de" ? "Anzeige" : "Advertisement",
		products: []
	};
}
object({
	name: string().min(2, "name"),
	email: string().email("email"),
	company: string().optional(),
	message: string().min(20, "message"),
	consent: literal(true, { error: () => ({ message: "consent" }) }),
	website: string().max(0).optional()
});
object({
	slug: string().min(3).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
	lang: _enum(["de", "en"]).default("de"),
	category: string().min(2).max(40),
	title: string().min(4).max(200),
	excerpt: string().min(10).max(400),
	body: string().min(20),
	/** Storage format of `body`. `markdown` keeps the legacy single-string path. */
	bodyFormat: _enum(["markdown", "blocks"]).default("markdown"),
	coverHint: string().max(400).optional().nullable(),
	publishedAt: date().optional().nullable(),
	draft: boolean().default(false),
	/** Per-post ad rendering mode (blog only). Mirrors the PHP validator. */
	adsMode: _enum([
		"default",
		"off",
		"auto",
		"manual"
	]).default("default"),
	/**
	* auth-api `app_user.id` of the author. Admins may set any eligible author;
	* for a non-admin blog author the server forces it to themselves. Null /
	* omitted leaves the post unassigned. The PHP validator mirrors this.
	*/
	authorId: number().int().positive().optional().nullable()
});
object({
	name: string().min(1).max(200),
	slug: string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
	avatarUrl: string().max(500).optional().nullable(),
	bio: string().max(500).optional().nullable(),
	active: boolean().default(true)
});
object({
	email: string().email().optional(),
	password: string().min(1).optional(),
	token: string().min(1).optional()
});
_enum(PORTAL_PERMISSIONS);
var PermissionKeySchema = string().regex(PERMISSION_KEY_PATTERN, "expected <resource>:<action>");
var MembershipSchema = object({
	companyId: number().int().positive().optional(),
	/** @deprecated legacy name for `companyId`; removed in the follow-up release. */
	customerId: number().int().positive().optional(),
	permissions: array(PermissionKeySchema).max(MAX_PERMISSION_KEYS).default([]),
	/** Ids of the groups assigned to this user IN this company. */
	groupIds: array(number().int().positive()).default([]),
	/** Whether this membership may manage the company's own users. */
	isCompanyAdmin: boolean().default(false),
	/**
	* The most this membership may ever be granted, `null` = inherit the
	* company policy. Platform-admin only — a company admin cannot raise it.
	*/
	permissionCeiling: array(PermissionKeySchema).nullish(),
	/**
	* Rights withheld from THIS person even where an assigned group grants
	* them — the per-person override of the group's decision.
	*
	* Not the same field as `permissionCeiling`, and the difference is easy to
	* lose: the ceiling is the platform admin's limit on what a company admin
	* may ever hand out; this is the ordinary decision about one person, which
	* a company admin owns. A right can be inside the ceiling and denied; it
	* cannot be outside the ceiling and granted.
	*
	* Unlike the ceiling there is no null/empty distinction — an empty deny
	* list and no deny list say the same thing — so this defaults to `[]`
	* rather than being nullish.
	*/
	permissionDenies: array(PermissionKeySchema).max(MAX_PERMISSION_KEYS).default([])
}).refine((m) => m.companyId !== void 0 || m.customerId !== void 0, { message: "companyId is required" }).transform((m) => ({
	...m,
	companyId: m.companyId ?? m.customerId
}));
object({
	email: string().email(),
	name: string().min(1).max(200).optional().nullable(),
	password: string().min(12).optional(),
	isAdmin: boolean().default(false),
	isSupportAgent: boolean().default(false),
	/** Grants blog-authoring access (see `AppUser.isBlogAuthor`). */
	isBlogAuthor: boolean().default(false),
	/** Author bio shown on the public blog author page. */
	bio: string().max(500).optional().nullable(),
	memberships: array(MembershipSchema).optional(),
	/** @deprecated use `memberships` — kept as a single-company fallback. */
	customerId: number().int().positive().optional().nullable(),
	/** @deprecated use `memberships`. */
	permissions: array(PermissionKeySchema).max(MAX_PERMISSION_KEYS).default([]),
	status: _enum(["active", "disabled"]).default("active")
});
object({
	email: string().email().optional(),
	name: string().min(1).max(200).optional().nullable(),
	isAdmin: boolean().optional(),
	isSupportAgent: boolean().optional(),
	/** Grants blog-authoring access (see `AppUser.isBlogAuthor`). */
	isBlogAuthor: boolean().optional(),
	/** Author bio shown on the public blog author page. */
	bio: string().max(500).optional().nullable(),
	memberships: array(MembershipSchema).optional(),
	/** @deprecated use `memberships`. */
	customerId: number().int().positive().optional().nullable(),
	/** @deprecated use `memberships`. */
	permissions: array(PermissionKeySchema).max(MAX_PERMISSION_KEYS).optional(),
	status: _enum(["active", "disabled"]).optional()
});
var TICKET_PRIORITIES = [
	"low",
	"normal",
	"high",
	"urgent"
];
var TICKET_TYPES = [
	"question",
	"bug",
	"feature",
	"other"
];
var TicketPrioritySchema = _enum(TICKET_PRIORITIES);
var TicketTypeSchema = _enum(TICKET_TYPES);
object({
	subject: string().min(3).max(200),
	description: string().min(10).max(1e4),
	priority: TicketPrioritySchema.default("normal"),
	type: TicketTypeSchema.default("question"),
	projectId: number().int().positive().optional().nullable()
});
object({
	body: string().min(1).max(1e4),
	isInternal: boolean().default(false)
});
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/islands/PicksBody.tsx
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
*/
function PicksBody() {
	const [placement, setPlacement] = useState(null);
	const [loading, setLoading] = useState(true);
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
	if (!placement || placement.products.length === 0) return null;
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
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/PicksWidget.astro
var $$PicksWidget = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Empfehlungen</h3>${renderComponent($$result, "PicksBody", PicksBody, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/islands/PicksBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-shop/widgets/PicksWidget.astro", void 0);
//#endregion
//#region \0virtual:frontend-widgets
var widgets = [
	{
		"id": "projects-active",
		"title": "Aktive Projekte",
		"island": "@tracht-digital-solutions/tds-ext-projects/widgets/Widget.astro",
		"size": "sm",
		"permission": "projects:read",
		"dataEndpoint": "/projects/summary",
		"order": 5,
		Component: $$Widget$12
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
		Component: $$Widget$11
	},
	{
		"id": "billing-open",
		"title": "Offene Rechnungen",
		"island": "@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro",
		"size": "sm",
		"permission": "billing:read",
		"dataEndpoint": "/billing/summary",
		"order": 10,
		Component: $$Widget$10
	},
	{
		"id": "live-chat-open",
		"title": "Offene Chats",
		"island": "@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro",
		"size": "sm",
		"permission": "live-chat:read",
		"dataEndpoint": "/live-chat-cta/summary",
		"order": 15,
		Component: $$Widget$9
	},
	{
		"id": "customers-count",
		"title": "Firmen",
		"island": "@tracht-digital-solutions/tds-ext-customers/widgets/Widget.astro",
		"size": "sm",
		"permission": "companies:read",
		"dataEndpoint": "/companies/summary",
		"order": 15,
		Component: $$Widget$8
	},
	{
		"id": "contact-new",
		"title": "Neue Anfragen",
		"island": "@tracht-digital-solutions/tds-ext-contact-tickets/widgets/Widget.astro",
		"size": "sm",
		"permission": "contact:read",
		"dataEndpoint": "/contact/summary",
		"order": 20,
		Component: $$Widget$7
	},
	{
		"id": "lexware-invoices",
		"title": "Lexware-Rechnungen",
		"island": "@tracht-digital-solutions/tds-ext-lexware/widgets/Widget.astro",
		"size": "sm",
		"permission": "lexware:read",
		"dataEndpoint": "/lexware/summary",
		"order": 20,
		Component: $$Widget$6
	},
	{
		"id": "messages-unread",
		"title": "Neue Nachrichten",
		"island": "@tracht-digital-solutions/tds-ext-messages/widgets/Widget.astro",
		"size": "sm",
		"permission": "messages:read",
		"dataEndpoint": "/messages/summary",
		"order": 20,
		Component: $$Widget$5
	},
	{
		"id": "website-cms-sites",
		"title": "Websites",
		"island": "@tracht-digital-solutions/tds-ext-website-cms/widgets/Widget.astro",
		"size": "sm",
		"permission": "website:read",
		"dataEndpoint": "/cms/summary",
		"order": 30,
		Component: $$Widget$4
	},
	{
		"id": "documents-count",
		"title": "Dokumente",
		"island": "@tracht-digital-solutions/tds-ext-documents/widgets/Widget.astro",
		"size": "sm",
		"permission": "documents:read",
		"dataEndpoint": "/documents/summary",
		"order": 30,
		Component: $$Widget$3
	},
	{
		"id": "blog-cms-posts",
		"title": "Blog-Beiträge",
		"island": "@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro",
		"size": "sm",
		"permission": "blog:read",
		"dataEndpoint": "/blog/summary",
		"order": 40,
		Component: $$Widget$2
	},
	{
		"id": "shop-summary",
		"title": "TDShop",
		"island": "@tracht-digital-solutions/tds-ext-shop/widgets/Widget.astro",
		"size": "sm",
		"permission": "shop:read",
		"dataEndpoint": "/shop/summary",
		"order": 45,
		Component: $$Widget$1
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
		Component: $$Widget
	},
	{
		"id": "shop-picks",
		"title": "Empfehlungen",
		"island": "@tracht-digital-solutions/tds-ext-shop/widgets/PicksWidget.astro",
		"size": "md",
		"order": 90,
		Component: $$PicksWidget
	}
];
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="tds-page__head"><div><p class="tds-page__eyebrow">Übersicht</p><h1 class="tds-page__title">Dashboard</h1></div><div class="tds-toolbar" data-dashboard-toolbar><button type="button" class="btn btn-ghost" data-dashboard-edit hidden>Anpassen</button><button type="button" class="btn btn-primary" data-dashboard-save hidden>Speichern</button><button type="button" class="btn btn-ghost" data-dashboard-cancel hidden>Abbrechen</button></div></div><div class="dashboard-grid" data-dashboard-grid>${widgets.map((widget) => {
		const Widget = widget.Component;
		const title = widget.title ?? widget.id;
		return renderTemplate`<section class="widget-slot"${addAttribute(widget.id, "data-widget")}${addAttribute(widget.size, "data-size")}${addAttribute(title, "data-label")}${addAttribute(`--tds-widget-hue: ${hueForKey(widget.id)}`, "style")}><div class="widget-slot__controls"><span class="widget-slot__handle" title="Ziehen zum Sortieren" aria-hidden="true">⠿</span><button type="button" class="btn btn-ghost widget-slot__move" data-widget-move="up"${addAttribute(`${title} nach vorne schieben`, "aria-label")}>${renderComponent($$result, "Icon", $$Icon, {
			"name": "chevron-up",
			"size": 16
		})}</button><button type="button" class="btn btn-ghost widget-slot__move" data-widget-move="down"${addAttribute(`${title} nach hinten schieben`, "aria-label")}>${renderComponent($$result, "Icon", $$Icon, {
			"name": "chevron-down",
			"size": 16
		})}</button><label class="widget-slot__toggle"><input type="checkbox" data-widget-visible checked><span>${title}</span></label></div><span class="widget-slot__icon" aria-hidden="true">${renderComponent($$result, "Icon", $$Icon, {
			"name": widgetIcon(widget.id),
			"size": 16
		})}</span>${renderComponent($$result, "Widget", Widget, {})}</section>`;
	})}</div><style>
    .widget-slot__controls { display: none; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .dashboard-grid.is-editing .widget-slot__controls { display: flex; }
    .dashboard-grid.is-editing .widget-slot {
      outline: 1px dashed color-mix(in srgb, var(--color-primary, #050f68) 40%, transparent);
      outline-offset: 4px; border-radius: 0.5rem;
    }
    .dashboard-grid.is-editing .widget-slot.is-hidden { opacity: 0.45; }
    .dashboard-grid.is-editing .widget-slot.is-dragging { opacity: 0.5; }
    .widget-slot.is-hidden { display: none; }
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
//#endregion
//#region \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
