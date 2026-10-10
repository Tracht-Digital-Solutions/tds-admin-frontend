import { k as apiFetch } from "./Layout_BX35BL1S.mjs";
//#region node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/lib.ts
/** The sites the beacon runs on, in the order the filter lists them. */
var SITES = [
	{
		key: "landing",
		label: "Landingpage"
	},
	{
		key: "blog",
		label: "Blog"
	},
	{
		key: "tools",
		label: "Tools"
	},
	{
		key: "shop",
		label: "Shop"
	},
	{
		key: "auth",
		label: "Login"
	}
];
/** Calendar day in Europe/Berlin — the zone the API groups by. */
function berlinDay(date = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(date);
}
function addDays(day, days) {
	const d = /* @__PURE__ */ new Date(`${day}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}
function defaultFilter() {
	const to = berlinDay();
	return {
		site: "",
		from: addDays(to, -29),
		to
	};
}
function query(f) {
	const q = new URLSearchParams({
		from: f.from,
		to: f.to
	});
	if (f.site) q.set("site", f.site);
	return q.toString();
}
/**
* GET a report. A network failure and a non-OK status both become an error
* the island shows in-flow — never an empty list, which would read as "no
* visitors" while the API is simply down.
*/
async function loadReport(name, f) {
	const path = f ? `/analytics/${name}?${query(f)}` : `/analytics/${name}`;
	const res = await apiFetch(path).catch(() => null);
	if (res === null) return {
		state: "error",
		message: "Die API ist nicht erreichbar."
	};
	if (res.status === 401 || res.status === 403) return {
		state: "error",
		message: "Keine Berechtigung für die Besucher-Statistik."
	};
	if (!res.ok) return {
		state: "error",
		message: (await res.json().catch(() => null))?.error ?? `Statistik konnte nicht geladen werden (HTTP ${res.status}).`
	};
	try {
		return {
			state: "ok",
			data: await res.json()
		};
	} catch {
		return {
			state: "error",
			message: "Die Antwort der API war kein JSON."
		};
	}
}
var nf = new Intl.NumberFormat("de-DE");
var num = (n) => n === null || n === void 0 ? "–" : nf.format(n);
var pct = (r, digits = 0) => r === null || r === void 0 ? "–" : `${(r * 100).toLocaleString("de-DE", {
	maximumFractionDigits: digits,
	minimumFractionDigits: digits
})} %`;
function duration(ms) {
	if (ms === null || ms === void 0) return "–";
	const s = Math.round(ms / 1e3);
	if (s < 60) return `${s} s`;
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`;
}
/** Relative change against the previous period, or null when there is no base. */
function delta(now, prev) {
	if (now === null || prev === null || prev === 0) return null;
	return (now - prev) / prev;
}
var CHANNEL_LABELS = {
	direct: "Direkt",
	search: "Suchmaschine",
	social: "Soziale Netzwerke",
	campaign: "Kampagne",
	referral: "Verweis",
	internal: "Eigene Seiten"
};
var DEVICE_LABELS = {
	mobile: "Smartphone",
	tablet: "Tablet",
	desktop: "Desktop"
};
var BROWSER_LABELS = {
	chrome: "Chrome",
	safari: "Safari",
	firefox: "Firefox",
	edge: "Edge",
	opera: "Opera",
	samsung: "Samsung Internet",
	other: "Andere"
};
var OS_LABELS = {
	windows: "Windows",
	macos: "macOS",
	ios: "iOS",
	android: "Android",
	linux: "Linux",
	chromeos: "ChromeOS",
	other: "Andere"
};
var regionNames = (() => {
	try {
		return new Intl.DisplayNames(["de"], { type: "region" });
	} catch {
		return null;
	}
})();
function countryName(code) {
	if (!code) return "Unbekannt";
	try {
		return regionNames?.of(code) ?? code;
	} catch {
		return code;
	}
}
var label = (map, key) => map[key] ?? (key === "" ? "Unbekannt" : key);
//#endregion
export { SITES as a, countryName as c, duration as d, label as f, pct as h, OS_LABELS as i, defaultFilter as l, num as m, CHANNEL_LABELS as n, addDays as o, loadReport as p, DEVICE_LABELS as r, berlinDay as s, BROWSER_LABELS as t, delta as u };
