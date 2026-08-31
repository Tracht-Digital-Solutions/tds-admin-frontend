import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { _ as FormAlert, b as toast, g as ConfirmDialog, l as frontendFetch, o as AUTH_API_URL, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { a as fetchCompanyPolicy, c as fetchPermissionCatalog, d as saveCompanyPolicy, h as fetchCompanies, i as describeFailure, l as listGroups, m as PermissionMatrix, n as createGroup, p as updateGroup, r as deleteGroup, s as fetchGroups } from "./companyAdmin_DHbiOgkS.mjs";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/CompanyQuotasAdmin.tsx
/**
* What a company may do for itself: how many users it may create, and which
* rights it may hand out.
*
* ### The two "unlimited" states are different, and both are meaningful
*
* `maxUsers = null` is "no cap"; `allowedPermissions = null` is "no ceiling",
* while `[]` is "may grant nothing". An empty array and a null therefore must
* not be collapsed into one control — a company set to `[]` whose policy round-
* trips as `null` silently gains the right to grant everything.
*
* ### The ceiling is a cut, not a one-time check
*
* Lowering it takes effect immediately, including on rights a group already
* grants: `EffectivePermissions::resolve()` intersects with the ceiling on
* every token issue. That is deliberate — a limit that only applied at
* assignment time would be a suggestion.
*
* A platform admin is never subject to this. The quota is a DELEGATION limit,
* not a licence.
*/
function CompanyQuotasAdmin() {
	const [companies, setCompanies] = useState(null);
	const [companyId, setCompanyId] = useState(null);
	const [catalog, setCatalog] = useState([]);
	const [policy, setPolicy] = useState(null);
	const [seatsUsed, setSeatsUsed] = useState(0);
	const [companyAdmins, setCompanyAdmins] = useState(0);
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		(async () => {
			const [companyResult, defs] = await Promise.all([fetchCompanies(), fetchPermissionCatalog()]);
			setCatalog(defs);
			setCompanies(companyResult.companies);
			setCompanyId(companyResult.companies[0]?.id ?? null);
		})();
	}, []);
	useEffect(() => {
		if (companyId === null) return;
		let cancelled = false;
		(async () => {
			setPolicy(null);
			const { res, data } = await fetchCompanyPolicy(companyId);
			if (cancelled) return;
			if (!data) {
				setError(await describeFailure(res, "Kontingent konnte nicht geladen werden"));
				return;
			}
			setError("");
			setPolicy(data.policy);
			setSeatsUsed(data.seatsUsed);
			setCompanyAdmins(data.companyAdmins);
		})();
		return () => {
			cancelled = true;
		};
	}, [companyId]);
	const grouped = useMemo(() => {
		const byGroup = /* @__PURE__ */ new Map();
		for (const def of catalog) {
			const key = def.group ?? "Weitere";
			const bucket = byGroup.get(key);
			if (bucket) bucket.push(def);
			else byGroup.set(key, [def]);
		}
		return [...byGroup.entries()];
	}, [catalog]);
	async function save(event) {
		event.preventDefault();
		if (companyId === null || policy === null) return;
		setSaving(true);
		try {
			const { res, data } = await saveCompanyPolicy(companyId, {
				maxUsers: policy.maxUsers,
				allowedPermissions: policy.allowedPermissions,
				allowCustomGroups: policy.allowCustomGroups,
				allowCompanyAdmins: policy.allowCompanyAdmins
			});
			if (!data) {
				toast.danger(await describeFailure(res, "Speichern fehlgeschlagen"));
				return;
			}
			setPolicy(data.policy);
			setSeatsUsed(data.seatsUsed);
			const revoked = data.sessionsRevoked ?? 0;
			toast.success(revoked > 0 ? `Kontingent gespeichert. ${revoked} Sitzung${revoked === 1 ? "" : "en"} beendet — die Rechte gelten ab der nächsten Anmeldung.` : "Kontingent gespeichert.");
		} finally {
			setSaving(false);
		}
	}
	function toggleCeiling(key) {
		setPolicy((current) => {
			if (current === null) return current;
			const base = current.allowedPermissions ?? catalog.map((d) => d.id);
			return {
				...current,
				allowedPermissions: base.includes(key) ? base.filter((k) => k !== key) : [...base, key]
			};
		});
	}
	if (companies === null) return /* @__PURE__ */ jsx("p", {
		role: "status",
		children: /* @__PURE__ */ jsx(Spinner, {})
	});
	if (companies.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "tds-empty",
		children: "Es sind keine Firmen angelegt."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(FormAlert, { message: error }),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "Firma"
				}), /* @__PURE__ */ jsx("select", {
					className: "field-boxed",
					value: companyId ?? "",
					onChange: (e) => setCompanyId(Number(e.target.value)),
					children: companies.map((company) => /* @__PURE__ */ jsx("option", {
						value: company.id,
						children: company.name
					}, company.id))
				})]
			}),
			policy === null ? /* @__PURE__ */ jsx("p", {
				role: "status",
				children: /* @__PURE__ */ jsx(Spinner, {})
			}) : /* @__PURE__ */ jsxs("form", {
				className: "tds-card p-4 space-y-4",
				onSubmit: save,
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm opacity-70",
						children: [
							seatsUsed,
							" Benutzer belegt",
							policy.maxUsers !== null ? ` von ${policy.maxUsers}` : " (kein Limit)",
							" ·",
							" ",
							companyAdmins,
							" Firmenadmin",
							companyAdmins === 1 ? "" : "s"
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Maximale Benutzerzahl"
							}), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "number",
								min: 0,
								value: policy.maxUsers ?? "",
								placeholder: "unbegrenzt",
								onChange: (e) => setPolicy({
									...policy,
									maxUsers: e.target.value === "" ? null : Math.max(0, Number(e.target.value))
								})
							})]
						}), /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: policy.allowCustomGroups,
								onChange: (e) => setPolicy({
									...policy,
									allowCustomGroups: e.target.checked
								})
							}), "Darf eigene Gruppen anlegen"]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-list__row",
						style: { gap: "0.625rem" },
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: policy.allowCompanyAdmins,
							onChange: (e) => setPolicy({
								...policy,
								allowCompanyAdmins: e.target.checked
							})
						}), /* @__PURE__ */ jsxs("span", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Firmenadmins zulassen"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs opacity-70",
								children: "Ohne diese Freigabe verwaltet niemand aus der Firma heraus Benutzer, Rechte oder Gruppen — die Seite „Meine Firma“ bleibt unsichtbar. Sie selbst können die Firma weiterhin vollständig verwalten."
							})]
						})]
					}),
					policy.allowCompanyAdmins && companyAdmins === 0 && /* @__PURE__ */ jsxs("p", {
						className: "tds-alert",
						role: "status",
						children: [
							"Freigegeben, aber noch niemand ernannt: unter ",
							/* @__PURE__ */ jsx("em", { children: "Benutzer" }),
							" jemanden dieser Firma bearbeiten und dort ",
							/* @__PURE__ */ jsx("em", { children: "Firmenadmin" }),
							" setzen."
						]
					}),
					/* @__PURE__ */ jsxs("fieldset", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx("legend", {
								className: "text-sm font-medium",
								children: "Vergebbare Rechte"
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: policy.allowedPermissions === null,
									onChange: (e) => setPolicy({
										...policy,
										allowedPermissions: e.target.checked ? null : catalog.map((d) => d.id)
									})
								}), "Alle Rechte freigeben"]
							}),
							policy.allowedPermissions !== null && (grouped.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "tds-empty",
								children: "Der Rechte-Katalog ist nicht erreichbar — die Auswahl lässt sich gerade nicht bearbeiten."
							}) : grouped.map(([section, defs]) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs uppercase opacity-60",
								children: section
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-x-4 gap-y-2 mt-1",
								children: defs.map((def) => /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: policy.allowedPermissions?.includes(def.id) ?? false,
										onChange: () => toggleCeiling(def.id)
									}), def.label]
								}, def.id))
							})] }, section))),
							policy.allowedPermissions?.length === 0 && /* @__PURE__ */ jsx("p", {
								className: "tds-alert",
								role: "status",
								children: "Diese Firma darf derzeit keine Rechte vergeben. Bestehende Rechte ihrer Benutzer werden dadurch ebenfalls wirkungslos."
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "tds-toolbar",
						children: /* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn btn-primary",
							disabled: saving,
							children: saving ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
						})
					})
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/GroupsAdmin.tsx
/**
* Platform-side group management.
*
* A group is a named bundle of permissions that can be assigned per company, so
* "Buchhaltung" is one edit instead of nine checkboxes on every user. Four are
* seeded as SYSTEM groups (the former role presets): their rights stay
* editable, their slug and their existence do not — something is assigned to
* them, and deleting a group silently drops whatever it granted.
*
* Groups belong either to the platform (`companyId = 0`, assignable
* everywhere) or to one company. Both are the same row; the scope is the only
* difference, which is why a company admin's own groups need no second concept.
*
* ### Every write revokes sessions
*
* A group's rights ride in the JWT as a resolved union, so a changed group does
* nothing until the affected tokens are gone. The backend revokes them and
* reports how many — this screen says so, because "saved" while nothing
* changes for an hour is the kind of silence that gets debugged twice.
*/
var PLATFORM = 0;
var emptyDraft = () => ({
	id: null,
	companyId: PLATFORM,
	name: "",
	slug: "",
	description: "",
	permissions: []
});
var draftOf = (group) => ({
	id: group.id,
	companyId: group.companyId,
	name: group.name,
	slug: group.slug,
	description: group.description ?? "",
	permissions: [...group.permissions]
});
function GroupsAdmin() {
	const [groups, setGroups] = useState(null);
	const [catalog, setCatalog] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [error, setError] = useState("");
	const [draft, setDraft] = useState(null);
	const [saving, setSaving] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(null);
	const load = async () => {
		const [result, defs, companyResult] = await Promise.all([
			listGroups(),
			fetchPermissionCatalog(),
			fetchCompanies()
		]);
		setCatalog(defs);
		setCompanies(companyResult.companies);
		if (!result.data) {
			setError(await describeFailure(result.res, "Gruppen konnten nicht geladen werden"));
			setGroups([]);
			return;
		}
		setError("");
		setGroups(result.data.groups);
	};
	useEffect(() => {
		load();
	}, []);
	const companyName = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const company of companies) map.set(company.id, company.name);
		return map;
	}, [companies]);
	const grouped = useMemo(() => {
		const byGroup = /* @__PURE__ */ new Map();
		for (const def of catalog) {
			const key = def.group ?? "Weitere";
			const bucket = byGroup.get(key);
			if (bucket) bucket.push(def);
			else byGroup.set(key, [def]);
		}
		return [...byGroup.entries()];
	}, [catalog]);
	async function save(event) {
		event.preventDefault();
		if (draft === null) return;
		setSaving(true);
		try {
			const body = {
				companyId: draft.companyId,
				name: draft.name.trim(),
				slug: draft.slug.trim(),
				description: draft.description.trim(),
				permissions: draft.permissions
			};
			const { res, data } = draft.id === null ? await createGroup(body) : await updateGroup(draft.id, body);
			if (!data) {
				toast.danger(await describeFailure(res, "Speichern fehlgeschlagen"));
				return;
			}
			const revoked = data.sessionsRevoked ?? 0;
			toast.success(revoked > 0 ? `Gruppe gespeichert. ${revoked} Sitzung${revoked === 1 ? "" : "en"} beendet — die Rechte gelten ab der nächsten Anmeldung.` : "Gruppe gespeichert.");
			setDraft(null);
			await load();
		} finally {
			setSaving(false);
		}
	}
	async function remove(group) {
		const { res, data } = await deleteGroup(group.id);
		setPendingDelete(null);
		if (!data) {
			toast.danger(await describeFailure(res, "Löschen fehlgeschlagen"));
			return;
		}
		toast.success("Gruppe gelöscht.");
		await load();
	}
	function toggle(key) {
		setDraft((current) => current === null ? current : {
			...current,
			permissions: current.permissions.includes(key) ? current.permissions.filter((k) => k !== key) : [...current.permissions, key]
		});
	}
	if (groups === null) return /* @__PURE__ */ jsx("p", {
		role: "status",
		children: /* @__PURE__ */ jsx(Spinner, {})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(FormAlert, { message: error }),
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => setDraft(draft === null ? emptyDraft() : null),
					children: draft !== null && draft.id === null ? "Abbrechen" : "Neue Gruppe"
				})
			}),
			draft !== null && /* @__PURE__ */ jsxs("form", {
				className: "tds-card p-4 space-y-4",
				onSubmit: save,
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "font-medium",
						children: draft.id === null ? "Neue Gruppe" : "Gruppe bearbeiten"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-row",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "block",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm",
									children: "Name"
								}), /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									value: draft.name,
									required: true,
									onChange: (e) => setDraft({
										...draft,
										name: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "block",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm",
									children: "Kürzel (optional)"
								}), /* @__PURE__ */ jsx("input", {
									className: "field-boxed",
									value: draft.slug,
									placeholder: "wird aus dem Namen gebildet",
									onChange: (e) => setDraft({
										...draft,
										slug: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "block",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm",
									children: "Gilt für"
								}), /* @__PURE__ */ jsxs("select", {
									className: "field-boxed",
									value: draft.companyId,
									disabled: draft.id !== null,
									onChange: (e) => setDraft({
										...draft,
										companyId: Number(e.target.value)
									}),
									children: [/* @__PURE__ */ jsx("option", {
										value: PLATFORM,
										children: "Alle Firmen"
									}), companies.map((company) => /* @__PURE__ */ jsx("option", {
										value: company.id,
										children: company.name
									}, company.id))]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Beschreibung"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: draft.description,
							onChange: (e) => setDraft({
								...draft,
								description: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ jsxs("fieldset", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("legend", {
							className: "text-sm font-medium",
							children: "Rechte"
						}), grouped.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "tds-empty",
							children: "Der Rechte-Katalog ist nicht erreichbar. Die Gruppe lässt sich trotzdem speichern — die bestehenden Rechte bleiben unverändert."
						}) : grouped.map(([section, defs]) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs uppercase opacity-60",
							children: section
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-x-4 gap-y-2 mt-1",
							children: defs.map((def) => /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: draft.permissions.includes(def.id),
									onChange: () => toggle(def.id)
								}), def.label]
							}, def.id))
						})] }, section))]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "tds-toolbar",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn btn-primary",
							disabled: saving,
							children: saving ? /* @__PURE__ */ jsx(Spinner, { size: "sm" }) : "Speichern"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setDraft(null),
							children: "Abbrechen"
						})]
					})
				]
			}),
			groups.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Keine Gruppen."
			}) : /* @__PURE__ */ jsx("ul", {
				className: "tds-stack",
				children: groups.map((group) => /* @__PURE__ */ jsx("li", {
					className: "tds-card p-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "font-medium",
									children: group.name
								}),
								group.description && /* @__PURE__ */ jsx("p", {
									className: "text-sm opacity-70",
									children: group.description
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-2 mt-2 items-center",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "chip chip--cat-teal",
											children: group.companyId === PLATFORM ? "Alle Firmen" : companyName.get(group.companyId) ?? `Firma ${group.companyId}`
										}),
										group.isSystem && /* @__PURE__ */ jsx("span", {
											className: "chip chip--cat-violet",
											children: "System"
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-xs opacity-60",
											children: [
												group.permissions.length,
												" Recht",
												group.permissions.length === 1 ? "" : "e",
												group.memberCount !== void 0 ? ` · ${group.memberCount} Zuweisung${group.memberCount === 1 ? "" : "en"}` : ""
											]
										})
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "tds-toolbar",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => setDraft(draftOf(group)),
								children: "Bearbeiten"
							}), !group.isSystem && /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-danger",
								onClick: () => setPendingDelete(group),
								children: "Löschen"
							})]
						})]
					})
				}, group.id))
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: `Gruppe „${pendingDelete?.name ?? ""}“ löschen?`,
				message: "Alle Zuweisungen dieser Gruppe entfallen. Betroffene Benutzer verlieren die Rechte, die nur über diese Gruppe kamen.",
				onConfirm: () => void (pendingDelete && remove(pendingDelete)),
				onCancel: () => setPendingDelete(null)
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/permissions/index.js
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
var PORTAL_PERMISSION_LABELS = {
	"projects:read": "Projekte ansehen",
	"invoices:read": "Rechnungen ansehen",
	"invoices:pay": "Rechnungen bezahlen",
	"documents:read": "Dokumente ansehen & herunterladen",
	"documents:write": "Dokumente hochladen / umbenennen",
	"messages:read": "Nachrichten ansehen",
	"messages:write": "Nachrichten senden",
	"tickets:read": "Tickets ansehen",
	"tickets:write": "Tickets erstellen & beantworten"
};
[...PORTAL_PERMISSIONS], PORTAL_PERMISSIONS.filter((p) => p.endsWith(":read"));
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/UsersAdmin.tsx
var usersUrl = `${AUTH_API_URL}/admin/users`;
/**
* Core user management (Benutzerverwaltung) — the base service's own screen. Users
* live in tds-auth-api (`/admin/users`); the company list comes from
* `lib/companies.ts`, which prefers the composed `tds-ext-customers` extension
* and falls back to the legacy customer-api (see that file for why the fallback
* exists). Beyond list/create/reset/delete this now offers the full
* per-user editor: admin/support-agent/blog-author flags, account status, and
* **company memberships with per-company portal permissions** (the fine-grained
* RBAC). Admins bypass portal permissions, so their memberships are cleared.
*/
function UsersAdmin() {
	const [users, setUsers] = useState(null);
	const [companies, setCompanies] = useState([]);
	const [catalog, setCatalog] = useState([]);
	const [groups, setGroups] = useState([]);
	const [error, setError] = useState(null);
	const [notice, setNotice] = useState(null);
	const [showCreate, setShowCreate] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [pendingDelete, setPendingDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const load = async () => {
		setError(null);
		try {
			const [uRes, companyResult, permissionDefs, groupList] = await Promise.all([
				frontendFetch(usersUrl),
				fetchCompanies(),
				fetchPermissionCatalog(),
				fetchGroups()
			]);
			if (!uRes.ok) throw new Error(`Benutzer laden fehlgeschlagen (HTTP ${uRes.status}).`);
			const uData = await uRes.json();
			setUsers(uData.users ?? []);
			setCompanies(companyResult.companies);
			setCatalog(permissionDefs);
			setGroups(groupList);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			setUsers([]);
		}
	};
	useEffect(() => {
		load();
	}, []);
	const companyName = useMemo(() => {
		const m = /* @__PURE__ */ new Map();
		for (const c of companies) m.set(c.id, c.name);
		return m;
	}, [companies]);
	const createUser = async (payload) => {
		setError(null);
		setNotice(null);
		const res = await frontendFetch(usersUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		if (res.ok) {
			const data = await res.json().catch(() => ({}));
			if (data.tempPassword) setNotice(`Benutzer angelegt. Temporäres Passwort: ${data.tempPassword}`);
			else toast.success("Benutzer angelegt.");
			setShowCreate(false);
			load();
		} else toast.danger(res.status === 409 ? "E-Mail existiert bereits." : `Anlegen fehlgeschlagen (HTTP ${res.status}).`);
	};
	const updateUser = async (id, patch) => {
		setError(null);
		const res = await frontendFetch(`${usersUrl}/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(patch)
		});
		if (res.ok) {
			setEditingId(null);
			load();
			toast.success("Benutzer gespeichert.");
		} else toast.danger(res.status === 409 ? "Konflikt (z. B. eigener Admin-Zugang)." : `Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const resetPassword = async (u) => {
		const res = await frontendFetch(`${usersUrl}/${u.id}/reset-password`, { method: "POST" });
		if (res.ok) {
			const d = await res.json().catch(() => ({}));
			if (d.tempPassword) setNotice(`Neues temporäres Passwort für ${u.email}: ${d.tempPassword}`);
			else toast.success(`Passwort für ${u.email} zurückgesetzt.`);
		} else toast.danger(`Zurücksetzen fehlgeschlagen (HTTP ${res.status}).`);
	};
	const confirmRemove = async () => {
		const u = pendingDelete;
		if (!u) return;
		setDeleting(true);
		try {
			const res = await frontendFetch(`${usersUrl}/${u.id}`, { method: "DELETE" });
			setPendingDelete(null);
			load();
			if (res.ok) toast.success(`${u.email} gelöscht.`);
			else toast.danger(`Löschen fehlgeschlagen (HTTP ${res.status}).`);
		} catch {
			setPendingDelete(null);
			toast.danger("Löschen fehlgeschlagen — die API ist nicht erreichbar.");
		} finally {
			setDeleting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "users-admin space-y-6",
		children: [
			/* @__PURE__ */ jsx(FormAlert, { message: error }),
			notice ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert",
				style: { "--tds-alert-hue": "var(--color-info)" },
				role: "status",
				children: notice
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => setShowCreate((v) => !v),
					children: showCreate ? "Abbrechen" : "Neuer Benutzer"
				})
			}),
			showCreate ? /* @__PURE__ */ jsx(UserForm, {
				companies,
				catalog,
				groups,
				onSubmit: createUser,
				onCancel: () => setShowCreate(false)
			}) : null,
			users === null ? /* @__PURE__ */ jsx("p", {
				role: "status",
				children: /* @__PURE__ */ jsx(Spinner, {})
			}) : users.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Keine Benutzer."
			}) : /* @__PURE__ */ jsx("ul", {
				className: "tds-stack",
				children: users.map((u) => /* @__PURE__ */ jsx("li", {
					className: "tds-card p-4",
					children: editingId === u.id ? /* @__PURE__ */ jsx(UserForm, {
						companies,
						catalog,
						groups,
						initial: u,
						onSubmit: (patch) => updateUser(u.id, patch),
						onCancel: () => setEditingId(null)
					}) : /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "font-medium",
									children: u.name ?? "—"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm opacity-70 break-all",
									children: u.email
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-2 mt-2",
									children: [
										u.isAdmin ? /* @__PURE__ */ jsx("span", {
											className: "chip chip--cat-violet",
											children: "Admin"
										}) : null,
										u.isAdmin && u.isSupportAgent ? /* @__PURE__ */ jsx("span", {
											className: "chip chip--cat-teal",
											children: "Support-Agent"
										}) : null,
										u.isBlogAuthor && !u.isAdmin ? /* @__PURE__ */ jsx("span", {
											className: "chip chip--cat-amber",
											children: "Blog-Autor"
										}) : null,
										u.status === "disabled" ? /* @__PURE__ */ jsx("span", {
											className: "chip chip--cat-rose",
											children: "Gesperrt"
										}) : null,
										!u.isAdmin ? /* @__PURE__ */ jsxs("span", {
											className: "text-xs opacity-60",
											children: [
												u.memberships?.length ?? 0,
												" Firma",
												(u.memberships?.length ?? 0) === 1 ? "" : "s",
												u.memberships && u.memberships.length > 0 ? ": " + u.memberships.map((m) => companyName.get(m.customerId) ?? `#${m.customerId}`).join(", ") : ""
											]
										}) : null
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "tds-toolbar",
							children: [
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => setEditingId(u.id),
									children: "Bearbeiten"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => void resetPassword(u),
									children: "Passwort zurücksetzen"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-danger",
									onClick: () => setPendingDelete(u),
									children: "Löschen"
								})
							]
						})]
					})
				}, u.id))
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: `Benutzer „${pendingDelete?.name ?? pendingDelete?.email ?? ""}“ wirklich löschen?`,
				message: "Der Zugang und alle Firmen-Mitgliedschaften werden entfernt. Das lässt sich nicht rückgängig machen.",
				busy: deleting,
				onConfirm: () => void confirmRemove(),
				onCancel: () => setPendingDelete(null)
			})
		]
	});
}
function UserForm({ companies, catalog, groups, initial, onSubmit, onCancel }) {
	const editing = initial !== void 0;
	/**
	* `companyId -> may it have company admins`, for the companies this form
	* touches. Loaded per company rather than up front: the list screen shows
	* every user and would otherwise fetch a policy for every company on a page
	* where nobody is editing anything.
	*/
	const [delegation, setDelegation] = useState(/* @__PURE__ */ new Map());
	const [email, setEmail] = useState(initial?.email ?? "");
	const [name, setName] = useState(initial?.name ?? "");
	const [isAdmin, setIsAdmin] = useState(initial?.isAdmin ?? false);
	const [isSupportAgent, setIsSupportAgent] = useState(initial?.isSupportAgent ?? false);
	const [isBlogAuthor, setIsBlogAuthor] = useState(initial?.isBlogAuthor ?? false);
	const [status, setStatus] = useState(initial?.status ?? "active");
	const [memberships, setMemberships] = useState(initial?.memberships ?? (initial?.customerId != null ? [{
		customerId: initial.customerId,
		permissions: initial.permissions ?? []
	}] : []));
	const usedCompanyIds = new Set(memberships.map((m) => m.customerId));
	const availableCompanies = companies.filter((c) => !usedCompanyIds.has(c.id));
	useEffect(() => {
		const unknown = [...usedCompanyIds].filter((id) => !delegation.has(id));
		if (unknown.length === 0) return;
		let cancelled = false;
		(async () => {
			const answers = await Promise.all(unknown.map(async (id) => [id, (await fetchCompanyPolicy(id)).data?.policy]));
			if (cancelled) return;
			setDelegation((current) => {
				const next = new Map(current);
				for (const [id, policy] of answers) if (policy !== void 0) next.set(id, policy.allowCompanyAdmins);
				return next;
			});
		})();
		return () => {
			cancelled = true;
		};
	}, [memberships, delegation]);
	const addMembership = () => {
		const next = availableCompanies[0];
		if (!next) return;
		setMemberships([...memberships, {
			customerId: next.id,
			permissions: []
		}]);
	};
	const updateMembership = (index, patch) => setMemberships(memberships.map((m, i) => i === index ? {
		...m,
		...patch
	} : m));
	const removeMembership = (index) => setMemberships(memberships.filter((_, i) => i !== index));
	const submit = (e) => {
		e.preventDefault();
		onSubmit({
			email: email.trim(),
			name: name.trim() === "" ? null : name.trim(),
			isAdmin,
			isSupportAgent: isAdmin && isSupportAgent,
			isBlogAuthor,
			status,
			memberships: isAdmin ? [] : memberships.filter((m) => m.customerId > 0)
		});
	};
	return /* @__PURE__ */ jsxs("form", {
		className: "user-form space-y-4",
		onSubmit: submit,
		children: [
			/* @__PURE__ */ jsx("h3", {
				className: "font-medium",
				children: editing ? "Benutzer bearbeiten" : "Neuer Benutzer"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm mb-1 block",
						children: "E-Mail"
					}), /* @__PURE__ */ jsx("input", {
						type: "email",
						className: "field-boxed w-full",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm mb-1 block",
						children: "Name"
					}), /* @__PURE__ */ jsx("input", {
						className: "field-boxed w-full",
						value: name ?? "",
						onChange: (e) => setName(e.target.value)
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-6",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: isAdmin,
							onChange: (e) => setIsAdmin(e.target.checked)
						}), /* @__PURE__ */ jsx("span", { children: "Admin-Panel-Zugang" })]
					}),
					isAdmin ? /* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: isSupportAgent,
							onChange: (e) => setIsSupportAgent(e.target.checked)
						}), /* @__PURE__ */ jsx("span", { children: "Support-Agent (Tickets zuweisbar)" })]
					}) : null,
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: isAdmin || isBlogAuthor,
							disabled: isAdmin,
							onChange: (e) => setIsBlogAuthor(e.target.checked)
						}), /* @__PURE__ */ jsxs("span", { children: ["Blog-Autor", isAdmin ? " (Admins immer)" : ""] })]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: status === "active",
							onChange: (e) => setStatus(e.target.checked ? "active" : "disabled")
						}), /* @__PURE__ */ jsx("span", { children: "Aktiv" })]
					})
				]
			}),
			isAdmin ? /* @__PURE__ */ jsx("p", {
				className: "text-xs opacity-60",
				children: "Admins haben vollen Zugriff — Firmen-Zuordnungen & Portal-Berechtigungen entfallen."
			}) : /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: "Firmen & Berechtigungen"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost text-xs",
							onClick: addMembership,
							disabled: availableCompanies.length === 0,
							children: "+ Firma hinzufügen"
						})]
					}),
					memberships.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "text-xs opacity-60",
						children: "Keine Firma zugeordnet — dieses Konto kann sich anmelden, sieht aber kein Portal."
					}) : null,
					memberships.map((m, i) => /* @__PURE__ */ jsxs("div", {
						className: "tds-card p-3 space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ jsxs("select", {
									className: "field-boxed",
									value: String(m.customerId),
									onChange: (e) => updateMembership(i, { customerId: Number(e.target.value) }),
									children: [companies.filter((c) => c.id === m.customerId || !usedCompanyIds.has(c.id)).map((c) => /* @__PURE__ */ jsx("option", {
										value: c.id,
										children: c.name
									}, c.id)), companies.every((c) => c.id !== m.customerId) ? /* @__PURE__ */ jsxs("option", {
										value: m.customerId,
										children: ["Firma #", m.customerId]
									}) : null]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-danger text-xs ml-auto",
									onClick: () => removeMembership(i),
									children: "Entfernen"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "tds-list__row",
								style: { gap: "0.625rem" },
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: m.isCompanyAdmin ?? false,
									disabled: delegation.get(m.customerId) === false,
									onChange: (e) => updateMembership(i, { isCompanyAdmin: e.target.checked })
								}), /* @__PURE__ */ jsxs("span", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-sm",
										children: "Firmenadmin"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs opacity-70",
										children: delegation.get(m.customerId) === false ? "Für diese Firma nicht freigeschaltet — Firmen-Kontingente → „Firmenadmins zulassen“." : "Darf die Benutzer DIESER Firma selbst verwalten (Seite „Meine Firma“) — begrenzt durch die Rechte, die der Firma freigegeben sind."
									})]
								})]
							}),
							groups.length > 0 ? /* @__PURE__ */ jsxs("fieldset", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsx("legend", {
										className: "text-sm",
										children: "Gruppen"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs opacity-70",
										children: "Gruppenrechte gelten zusätzlich zu den einzeln vergebenen. Ändert jemand die Gruppe, ändert sich damit auch, was ihre Mitglieder dürfen."
									}),
									groups.filter((g) => g.scope === "platform" || g.companyId === m.customerId).map((g) => /* @__PURE__ */ jsxs("label", {
										className: "tds-list__row",
										style: { gap: "0.625rem" },
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: (m.groupIds ?? []).includes(g.id),
											onChange: (e) => updateMembership(i, { groupIds: e.target.checked ? [...m.groupIds ?? [], g.id] : (m.groupIds ?? []).filter((id) => id !== g.id) })
										}), /* @__PURE__ */ jsxs("span", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-sm",
												children: g.name
											}), /* @__PURE__ */ jsx("span", {
												className: "text-xs opacity-70",
												children: g.permissions.join(", ") || "keine Rechte"
											})]
										})]
									}, g.id))
								]
							}) : null,
							/* @__PURE__ */ jsx(PermissionMatrix, {
								catalog: catalog.length > 0 ? catalog : PORTAL_PERMISSIONS.map((id) => ({
									id,
									label: PORTAL_PERMISSION_LABELS[id]
								})),
								assignedGroups: groups.filter((g) => (m.groupIds ?? []).includes(g.id)),
								value: m.permissions,
								denies: m.permissionDenies ?? [],
								ceiling: m.permissionCeiling ?? null,
								onChange: (next) => updateMembership(i, {
									permissions: next.permissions,
									permissionDenies: next.denies
								})
							})
						]
					}, m.customerId))
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ jsx("button", {
					type: "submit",
					className: "btn btn-primary",
					disabled: email.trim() === "",
					children: editing ? "Speichern" : "Anlegen"
				}), onCancel ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: onCancel,
					children: "Abbrechen"
				}) : null]
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/AccessAdmin.tsx
var TABS = [
	{
		id: "users",
		label: "Benutzer"
	},
	{
		id: "groups",
		label: "Gruppen"
	},
	{
		id: "quotas",
		label: "Firmen-Kontingente"
	}
];
function AccessAdmin() {
	const [tab, setTab] = useState("users");
	const [seen, setSeen] = useState(["users"]);
	function show(next) {
		setTab(next);
		setSeen((current) => current.includes(next) ? current : [...current, next]);
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				role: "tablist",
				"aria-label": "Zugriffsverwaltung",
				children: TABS.map((entry) => /* @__PURE__ */ jsx("button", {
					type: "button",
					role: "tab",
					id: `access-tab-${entry.id}`,
					"aria-selected": tab === entry.id,
					"aria-controls": `access-panel-${entry.id}`,
					className: `chip ${tab === entry.id ? "chip--info" : "chip--neutral"}`,
					onClick: () => show(entry.id),
					children: entry.label
				}, entry.id))
			}),
			/* @__PURE__ */ jsx("div", {
				role: "tabpanel",
				id: "access-panel-users",
				"aria-labelledby": "access-tab-users",
				hidden: tab !== "users",
				children: seen.includes("users") && /* @__PURE__ */ jsx(UsersAdmin, {})
			}),
			/* @__PURE__ */ jsx("div", {
				role: "tabpanel",
				id: "access-panel-groups",
				"aria-labelledby": "access-tab-groups",
				hidden: tab !== "groups",
				children: seen.includes("groups") && /* @__PURE__ */ jsx(GroupsAdmin, {})
			}),
			/* @__PURE__ */ jsx("div", {
				role: "tabpanel",
				id: "access-panel-quotas",
				"aria-labelledby": "access-tab-quotas",
				hidden: tab !== "quotas",
				children: seen.includes("quotas") && /* @__PURE__ */ jsx(CompanyQuotasAdmin, {})
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/users.astro
var users_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Users,
	file: () => $$file,
	url: () => $$url
});
var $$Users = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Benutzerverwaltung" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Zugriff</p><h1 class="tds-page__title">Benutzerverwaltung</h1><p class="tds-page__lede">Benutzer, ihre Gruppen und die Rechte, die eine Firma selbst vergeben darf.</p></div></div>${renderComponent($$result, "AccessAdmin", AccessAdmin, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/AccessAdmin.tsx",
		"client:component-export": "default"
	})}</section>` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/users.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/users.astro";
var $$url = "/users";
//#endregion
//#region \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/users@_@astro
var page = () => users_exports;
//#endregion
export { page };
