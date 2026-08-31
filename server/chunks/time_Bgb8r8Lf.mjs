import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-time-tracker/islands/TimeTracker.tsx
var api = apiFetch;
/** Minutes → "Xh Ym" (or "Ym"). */
function fmt(minutes) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
/**
* Full time-tracker page: a start/stop timer, a manual-entry form, and the
* recent-entries list — all scoped to the logged-in user by the API. Relative
* fetch with the session cookie, matching every other extension island.
*/
function TimeTracker() {
	const [summary, setSummary] = useState(null);
	const [entries, setEntries] = useState(null);
	const [note, setNote] = useState("");
	const [manualStart, setManualStart] = useState("");
	const [manualEnd, setManualEnd] = useState("");
	const [manualNote, setManualNote] = useState("");
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const load = async () => {
		const [s, e] = await Promise.all([api("/time/summary").then((r) => r.ok ? r.json() : null), api("/time/entries").then((r) => r.ok ? r.json() : { entries: [] })]);
		setSummary(s);
		setEntries(e.entries ?? []);
	};
	useEffect(() => {
		load();
	}, []);
	const start = async () => {
		setBusy(true);
		try {
			const res = await api("/time/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ note: note.trim() })
			});
			if (res.ok) {
				setNote("");
				toast.success("Timer gestartet.");
			} else toast.danger(`Timer konnte nicht gestartet werden (HTTP ${res.status}).`);
		} catch {
			toast.danger("Timer konnte nicht gestartet werden — die API ist nicht erreichbar.");
		} finally {
			setBusy(false);
			load();
		}
	};
	const stop = async () => {
		setBusy(true);
		try {
			const res = await api("/time/stop", { method: "POST" });
			if (res.ok) toast.success("Timer gestoppt.");
			else toast.danger(`Timer konnte nicht gestoppt werden (HTTP ${res.status}) — er läuft weiter.`);
		} catch {
			toast.danger("Timer konnte nicht gestoppt werden — die API ist nicht erreichbar.");
		} finally {
			setBusy(false);
			load();
		}
	};
	const addManual = async () => {
		if (manualStart === "" || manualEnd === "") {
			setStatus("Start und Ende sind erforderlich.");
			return;
		}
		setBusy(true);
		const res = await api("/time/entries", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				started_at: manualStart,
				ended_at: manualEnd,
				note: manualNote.trim()
			})
		});
		setBusy(false);
		if (res.ok) {
			setManualStart("");
			setManualEnd("");
			setManualNote("");
			setStatus(null);
			toast.success("Eintrag gespeichert.");
			load();
		} else if (res.status === 422) setStatus("Ende muss nach dem Start liegen.");
		else {
			setStatus(null);
			toast.danger(`Eintrag konnte nicht gespeichert werden (HTTP ${res.status}).`);
		}
	};
	const remove = async (e) => {
		try {
			const res = await api(`/time/entries/${e.id}`, { method: "DELETE" });
			if (res.ok) toast.success("Eintrag gelöscht.");
			else toast.danger(`Löschen fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			toast.danger("Löschen fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			load();
		}
	};
	const running = summary?.running ?? null;
	return /* @__PURE__ */ jsxs("div", {
		className: "time-tracker space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "time-tracker__timer rounded-xl border border-[color:var(--color-line)] p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm opacity-70",
						children: "Diese Woche"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-2xl font-semibold",
						children: [(summary?.weekHours ?? 0).toLocaleString("de-DE"), " h"]
					})] }), running ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-danger",
						onClick: stop,
						disabled: busy,
						"aria-busy": busy,
						children: "⏹ Timer stoppen"
					}) : /* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Woran arbeitest du?",
							"aria-label": "Woran arbeitest du?"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: start,
							disabled: busy,
							"aria-busy": busy,
							children: "▶ Timer starten"
						})]
					})]
				}), running ? /* @__PURE__ */ jsxs("p", {
					className: "text-xs opacity-70 mt-2",
					children: [
						"Läuft seit ",
						running.started_at,
						running.note ? ` · ${running.note}` : ""
					]
				}) : null]
			}),
			/* @__PURE__ */ jsxs("details", {
				className: "time-tracker__manual",
				children: [
					/* @__PURE__ */ jsx("summary", { children: "Eintrag manuell erfassen" }),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar mt-3",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: ["Start", /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									type: "datetime-local",
									value: manualStart,
									onChange: (e) => setManualStart(e.target.value)
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "tds-field-row",
								children: ["Ende", /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									type: "datetime-local",
									value: manualEnd,
									onChange: (e) => setManualEnd(e.target.value)
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								value: manualNote,
								onChange: (e) => setManualNote(e.target.value),
								placeholder: "Notiz (optional)",
								"aria-label": "Notiz"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-primary",
								onClick: addManual,
								disabled: busy,
								"aria-busy": busy,
								children: "Hinzufügen"
							})
						]
					}),
					status ? /* @__PURE__ */ jsx("p", {
						className: "tds-alert tds-alert--danger mt-2",
						role: "alert",
						children: status
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-stack",
				children: [/* @__PURE__ */ jsx("h3", { children: "Letzte Einträge" }), entries === null ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : entries.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "text-sm opacity-70",
					children: "Noch keine Einträge."
				}) : /* @__PURE__ */ jsx("ul", {
					className: "tds-list",
					children: entries.map((e) => /* @__PURE__ */ jsxs("li", {
						className: "tds-list__row text-sm",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: fmt(e.minutes)
							}),
							e.running ? /* @__PURE__ */ jsx("span", {
								className: "chip chip--info",
								children: "läuft"
							}) : null,
							/* @__PURE__ */ jsxs("span", {
								className: "opacity-70",
								children: [e.started_at, e.ended_at ? ` – ${e.ended_at}` : ""]
							}),
							e.note ? /* @__PURE__ */ jsxs("span", {
								className: "opacity-70",
								children: ["· ", e.note]
							}) : null,
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-danger text-xs ml-auto",
								onClick: () => remove(e),
								children: "Löschen"
							})
						]
					}, e.id))
				})]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-time-tracker/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Zeiterfassung</h1></div>${renderComponent($$result, "TimeTracker", TimeTracker, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-time-tracker/islands/TimeTracker.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-time-tracker/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/time.astro
var time_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Time,
	file: () => $$file,
	url: () => void 0
});
var $$Time = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Zeiterfassung" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/time.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/time.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/time@_@astro
var page = () => time_exports;
//#endregion
export { page };
