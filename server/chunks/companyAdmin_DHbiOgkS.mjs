import { a as API_BASE, l as frontendFetch, o as AUTH_API_URL, s as CUSTOMER_API_URL } from "./Layout_EXQSk7Qd.mjs";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/lib/companies.ts
/**
* The company list the user editor needs for membership editing.
*
* This is the **last live dependency on the legacy `tds-customer-api`** in the
* whole frontend platform, and the one thing standing between that service and
* retirement (`tds-core-frontend-api#8`). The composed `tds-ext-customers`
* extension already serves the identical payload — `{customers:[{id,name}]}` —
* at `GET /admin/customers`, so this asks the composed API first and only falls
* back to `GET /customer/admin/customers`.
*
* **Why a fallback rather than a straight switch.** The composed frontend
* service cannot boot until `services/frontend/.env` and the `tds_frontend`
* database exist (issue #2), and until then every catch-all route answers 500.
* Cutting straight over would therefore have broken membership editing *today*
* to fix it *later*. With the fallback the call works on both sides of go-live,
* and the legacy leg simply stops being reached the moment the composed one
* answers — no second deploy needed to complete the migration.
*
* Delete the legacy leg (and `CUSTOMER_API_URL`) once `tds-customer-api` is
* retired.
*/
/** Composed `tds-ext-customers` — mounted at the API root by the frontend kernel. */
var COMPOSED_COMPANIES_URL = `${API_BASE}/admin/customers`;
/** Legacy `tds-customer-api`, reached through the gateway's `/customer` prefix. */
var LEGACY_COMPANIES_URL = `${CUSTOMER_API_URL}/admin/customers`;
/**
* Read the company list, preferring the composed API.
*
* Deliberately **never throws**: the editor works without names (it falls back
* to showing ids), so a company-list outage must not take the whole user
* management down with it. That was already the contract at the call site; it
* is just explicit now.
*/
async function fetchCompanies() {
	const composed = await tryFetch(COMPOSED_COMPANIES_URL);
	if (composed) return {
		companies: composed,
		source: "composed"
	};
	const legacy = await tryFetch(LEGACY_COMPANIES_URL);
	if (legacy) return {
		companies: legacy,
		source: "legacy"
	};
	return {
		companies: [],
		source: "none"
	};
}
/**
* One attempt. Returns null for anything that is not a usable list, so the
* caller cannot mistake "answered with junk" for "answered".
*/
async function tryFetch(url) {
	try {
		const res = await frontendFetch(url);
		if (!res.ok) return null;
		const data = await res.json();
		const list = Array.isArray(data.companies) ? data.companies : data.customers;
		if (!Array.isArray(list)) return null;
		return list.filter(isCompany);
	} catch {
		return null;
	}
}
function isCompany(value) {
	if (typeof value !== "object" || value === null) return false;
	const c = value;
	return typeof c.id === "number" && typeof c.name === "string";
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/PermissionMatrix.tsx
var withoutKey = (list, key) => list.filter((k) => k !== key);
var withKey = (list, key) => list.includes(key) ? list : [...list, key];
function PermissionMatrix({ catalog, assignedGroups, value, denies, ceiling = null, onChange }) {
	/** Which assigned group grants each key — the "aus Gruppe X" label. */
	const grantedBy = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const group of assignedGroups) for (const key of group.permissions) if (!map.has(key)) map.set(key, group.name);
		return map;
	}, [assignedGroups]);
	/**
	* Every key worth offering: the catalog, plus anything stored or granted by
	* a group that the catalog does not know.
	*
	* The extras matter. Loosening the backend's validation was one-way, so a
	* key can be legitimately held and unrecognised — dropping it here would
	* make it invisible AND unremovable.
	*/
	const rows = useMemo(() => {
		const byKey = /* @__PURE__ */ new Map();
		for (const def of catalog) byKey.set(def.id, def);
		for (const key of [
			...value,
			...denies,
			...grantedBy.keys()
		]) if (!byKey.has(key)) byKey.set(key, {
			id: key,
			label: key,
			group: "Unbekannt"
		});
		const bySection = /* @__PURE__ */ new Map();
		for (const def of byKey.values()) {
			if (ceiling !== null && !ceiling.includes(def.id) && !grantedBy.has(def.id)) continue;
			const section = def.group ?? "Allgemein";
			bySection.set(section, [...bySection.get(section) ?? [], def]);
		}
		return [...bySection.entries()];
	}, [
		catalog,
		value,
		denies,
		grantedBy,
		ceiling
	]);
	function setState(key, state) {
		onChange({
			permissions: state === "granted" ? withKey(value, key) : withoutKey(value, key),
			denies: state === "denied" ? withKey(denies, key) : withoutKey(denies, key)
		});
	}
	function stateOf(key) {
		if (denies.includes(key)) return "denied";
		if (value.includes(key)) return "granted";
		return "inherited";
	}
	if (rows.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "tds-empty",
		children: "Für diese Firma sind keine Rechte freigegeben."
	});
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-3",
		children: rows.map(([section, defs]) => /* @__PURE__ */ jsxs("fieldset", {
			className: "space-y-2",
			children: [/* @__PURE__ */ jsx("legend", {
				className: "text-xs uppercase opacity-60",
				children: section
			}), defs.map((def) => {
				const from = grantedBy.get(def.id);
				const state = stateOf(def.id);
				if (from === void 0) return /* @__PURE__ */ jsxs("label", {
					className: "tds-list__row",
					style: { gap: "0.625rem" },
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: state === "granted",
						onChange: (e) => setState(def.id, e.target.checked ? "granted" : "inherited")
					}), /* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: def.label
					})]
				}, def.id);
				return /* @__PURE__ */ jsxs("div", {
					className: "tds-list__row",
					style: { gap: "0.625rem" },
					children: [/* @__PURE__ */ jsxs("span", {
						className: "flex flex-col min-w-0",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: def.label
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs opacity-70",
							children: [
								"aus Gruppe „",
								from,
								"“"
							]
						})]
					}), /* @__PURE__ */ jsx("span", {
						className: "tds-toolbar",
						role: "radiogroup",
						"aria-label": def.label,
						children: [
							["inherited", "Aus Gruppe"],
							["granted", "Einzeln erlaubt"],
							["denied", "Entzogen"]
						].map(([option, label]) => /* @__PURE__ */ jsx("button", {
							type: "button",
							role: "radio",
							"aria-checked": state === option,
							className: `chip ${state === option ? option === "denied" ? "chip--danger" : "chip--info" : "chip--neutral"}`,
							onClick: () => setState(def.id, option),
							children: label
						}, option))
					})]
				}, def.id);
			})]
		}, section))
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/lib/companyAdmin.ts
/**
* The RBAC surfaces added in Phase 2: groups, per-company policies, and the
* delegated company-admin user management.
*
* All of it lives in **tds-auth-api**, not the composed API — it writes
* `app_user`, and auth-api is the only service that does. So these go through
* `frontendFetch` against `AUTH_API_URL`, while the permission CATALOG comes
* from the composed API (`/admin/permissions`), which is the service that
* enforces it.
*
* Every call returns the parsed body plus the `Response`, never throws, and
* never swallows a status: the callers report failures with the HTTP code,
* which is what separates "session expired" from "service down" in a report.
*/
async function call(url, init) {
	try {
		const res = await frontendFetch(url, init);
		if (!res.ok) return {
			res,
			data: null
		};
		return {
			res,
			data: await res.json()
		};
	} catch {
		return {
			res: null,
			data: null
		};
	}
}
var json = (body) => ({
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(body)
});
/**
* The composed catalog every module contributes.
*
* Falls back to `[]` rather than throwing: the editor degrades to the shared
* seed labels, which is the same never-throws contract `fetchCompanies` has —
* user management must not go down because the composed API is unreachable.
*/
async function fetchPermissionCatalog() {
	const { data } = await call(`${API_BASE}/admin/permissions`);
	return data?.permissions ?? [];
}
/** The raw call, for the screen that has to tell "none" from "unreachable". */
function listGroups(companyId) {
	const query = companyId !== void 0 ? `?company_id=${companyId}` : "";
	return call(`${AUTH_API_URL}/admin/groups${query}`);
}
/**
* Groups as a plain list, empty when they cannot be fetched.
*
* For the callers where the group picker is one control among many (the user
* editor): an outage there costs a checkbox list, and taking the whole editor
* down for it would be the worse trade. `listGroups` is the variant for the
* screen that IS the group list.
*/
async function fetchGroups(companyId) {
	const { data } = await listGroups(companyId);
	return data?.groups ?? [];
}
function createGroup(body) {
	return call(`${AUTH_API_URL}/admin/groups`, {
		method: "POST",
		...json(body)
	});
}
function updateGroup(id, body) {
	return call(`${AUTH_API_URL}/admin/groups/${id}`, {
		method: "PATCH",
		...json(body)
	});
}
function deleteGroup(id) {
	return call(`${AUTH_API_URL}/admin/groups/${id}`, { method: "DELETE" });
}
function fetchCompanyPolicy(companyId) {
	return call(`${AUTH_API_URL}/admin/companies/${companyId}/policy`);
}
function saveCompanyPolicy(companyId, body) {
	return call(`${AUTH_API_URL}/admin/companies/${companyId}/policy`, {
		method: "PUT",
		...json(body)
	});
}
function fetchCompanyUsers(companyId) {
	return call(`${AUTH_API_URL}/company/${companyId}/users`);
}
function createCompanyUser(companyId, body) {
	return call(`${AUTH_API_URL}/company/${companyId}/users`, {
		method: "POST",
		...json(body)
	});
}
function updateCompanyUser(companyId, userId, body) {
	return call(`${AUTH_API_URL}/company/${companyId}/users/${userId}`, {
		method: "PATCH",
		...json(body)
	});
}
function removeCompanyUser(companyId, userId) {
	return call(`${AUTH_API_URL}/company/${companyId}/users/${userId}`, { method: "DELETE" });
}
/**
* Turn a failed {@link Result} into something worth showing a person.
*
* The backend names WHY it refused (`seat_limit`, `permission_not_allowed`,
* `last_company_admin`, …) precisely so the UI does not have to say
* "Forbidden" and leave an admin guessing which checkbox to untick.
*/
async function describeFailure(res, fallback) {
	if (res === null) return `${fallback} (keine Verbindung).`;
	let body = {};
	try {
		body = await res.clone().json();
	} catch {}
	const code = typeof body.code === "string" ? body.code : "";
	const rejected = Array.isArray(body.rejected) ? body.rejected.join(", ") : "";
	switch (code) {
		case "seat_limit": return `Keine freien Benutzerplätze mehr (${body.used} von ${body.max}).`;
		case "permission_not_allowed": return `Diese Rechte sind für diese Firma nicht freigegeben: ${rejected}.`;
		case "last_company_admin": return "Die Firma braucht mindestens einen Firmenadmin.";
		case "field_not_allowed": return "Dieses Feld darf hier nicht geändert werden.";
		case "custom_groups_disabled": return "Diese Firma darf keine eigenen Gruppen anlegen.";
		case "delegation_disabled": return "Für diese Firma sind Firmenadmins nicht freigeschaltet (Benutzer → Firmen-Kontingente).";
		case "unknown_group": return "Unbekannte Gruppe.";
		case "seats_in_use": return `Die Firma hat bereits ${body.used} Benutzer.`;
		case "system_group": return "System-Gruppen können nicht gelöscht werden.";
		default: return `${fallback} (HTTP ${res.status}).`;
	}
}
//#endregion
export { fetchCompanyPolicy as a, fetchPermissionCatalog as c, saveCompanyPolicy as d, updateCompanyUser as f, fetchCompanies as h, describeFailure as i, listGroups as l, PermissionMatrix as m, createGroup as n, fetchCompanyUsers as o, updateGroup as p, deleteGroup as r, fetchGroups as s, createCompanyUser as t, removeCompanyUser as u };
