import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { f as $$Icon, n as hueForKey, r as widgetIcon, t as $$Layout, v as Skeleton, x as renderScript, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useCallback, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
var $$Widget$11 = createComponent(($$result, $$props, $$slots) => {
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
var $$Widget$10 = createComponent(($$result, $$props, $$slots) => {
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
function WidgetBody$4() {
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
var $$Widget$9 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Offene Rechnungen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$4, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/WidgetBody.tsx
/** Dashboard widget body — open chats + new contact requests. */
function WidgetBody$3() {
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
var $$Widget$8 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Offene Chats</h3>${renderComponent($$result, "WidgetBody", WidgetBody$3, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-customers/islands/WidgetBody.tsx
/** Customers widget body — the directory count. Same-origin fetch with credentials. */
function WidgetBody$2() {
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
var $$Widget$7 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Firmen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$2, {
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
var $$Widget$6 = createComponent(($$result, $$props, $$slots) => {
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
function WidgetBody$1() {
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
var $$Widget$5 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Lexware-Rechnungen</h3>${renderComponent($$result, "WidgetBody", WidgetBody$1, {
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
var $$Widget$4 = createComponent(($$result, $$props, $$slots) => {
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
var $$Widget$3 = createComponent(($$result, $$props, $$slots) => {
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
var $$Widget$2 = createComponent(($$result, $$props, $$slots) => {
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
var $$Widget$1 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<article class="tds-widget"><h3 class="tds-widget__title">Blog-Beiträge</h3>${renderComponent($$result, "PostsCount", PostsCount, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/WidgetBody.tsx",
		"client:component-export": "default"
	})}</article>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro", void 0);
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
		Component: $$Widget$11
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
		Component: $$Widget$10
	},
	{
		"id": "billing-open",
		"title": "Offene Rechnungen",
		"island": "@tracht-digital-solutions/tds-ext-billing/widgets/Widget.astro",
		"size": "sm",
		"permission": "billing:read",
		"dataEndpoint": "/billing/summary",
		"order": 10,
		Component: $$Widget$9
	},
	{
		"id": "live-chat-open",
		"title": "Offene Chats",
		"island": "@tracht-digital-solutions/tds-ext-live-chat-cta/widgets/Widget.astro",
		"size": "sm",
		"permission": "live-chat:read",
		"dataEndpoint": "/live-chat-cta/summary",
		"order": 15,
		Component: $$Widget$8
	},
	{
		"id": "customers-count",
		"title": "Firmen",
		"island": "@tracht-digital-solutions/tds-ext-customers/widgets/Widget.astro",
		"size": "sm",
		"permission": "companies:read",
		"dataEndpoint": "/companies/summary",
		"order": 15,
		Component: $$Widget$7
	},
	{
		"id": "contact-new",
		"title": "Neue Anfragen",
		"island": "@tracht-digital-solutions/tds-ext-contact-tickets/widgets/Widget.astro",
		"size": "sm",
		"permission": "contact:read",
		"dataEndpoint": "/contact/summary",
		"order": 20,
		Component: $$Widget$6
	},
	{
		"id": "lexware-invoices",
		"title": "Lexware-Rechnungen",
		"island": "@tracht-digital-solutions/tds-ext-lexware/widgets/Widget.astro",
		"size": "sm",
		"permission": "lexware:read",
		"dataEndpoint": "/lexware/summary",
		"order": 20,
		Component: $$Widget$5
	},
	{
		"id": "messages-unread",
		"title": "Neue Nachrichten",
		"island": "@tracht-digital-solutions/tds-ext-messages/widgets/Widget.astro",
		"size": "sm",
		"permission": "messages:read",
		"dataEndpoint": "/messages/summary",
		"order": 20,
		Component: $$Widget$4
	},
	{
		"id": "website-cms-sites",
		"title": "Websites",
		"island": "@tracht-digital-solutions/tds-ext-website-cms/widgets/Widget.astro",
		"size": "sm",
		"permission": "website:read",
		"dataEndpoint": "/cms/summary",
		"order": 30,
		Component: $$Widget$3
	},
	{
		"id": "documents-count",
		"title": "Dokumente",
		"island": "@tracht-digital-solutions/tds-ext-documents/widgets/Widget.astro",
		"size": "sm",
		"permission": "documents:read",
		"dataEndpoint": "/documents/summary",
		"order": 30,
		Component: $$Widget$2
	},
	{
		"id": "blog-cms-posts",
		"title": "Blog-Beiträge",
		"island": "@tracht-digital-solutions/tds-ext-blog-cms/widgets/Widget.astro",
		"size": "sm",
		"permission": "blog:read",
		"dataEndpoint": "/blog/summary",
		"order": 40,
		Component: $$Widget$1
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
