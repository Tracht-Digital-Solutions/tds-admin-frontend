import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { _ as FormAlert, b as toast, c as fetchMe, d as membershipIds, g as ConfirmDialog, i as getActiveCompany, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { f as updateCompanyUser, h as fetchCompanies, i as describeFailure, m as PermissionMatrix, o as fetchCompanyUsers, t as createCompanyUser, u as removeCompanyUser } from "./companyAdmin_DHbiOgkS.mjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/CompanyUsersAdmin.tsx
var emptyDraft = () => ({
	email: "",
	name: "",
	permissions: [],
	permissionDenies: [],
	groupIds: [],
	isCompanyAdmin: false,
	status: "active"
});
var draftOf = (member) => ({
	email: member.email,
	name: member.name ?? "",
	permissions: [...member.permissions],
	permissionDenies: [...member.permissionDenies ?? []],
	groupIds: [...member.groupIds],
	isCompanyAdmin: member.isCompanyAdmin,
	status: member.status
});
function CompanyUsersAdmin() {
	const [me, setMe] = useState(null);
	const [companyId, setCompanyId] = useState(null);
	/** Non-empty only for a platform admin: every company, for the picker. */
	const [directory, setDirectory] = useState([]);
	const [payload, setPayload] = useState(null);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [draft, setDraft] = useState(emptyDraft());
	const [saving, setSaving] = useState(false);
	const [pendingRemove, setPendingRemove] = useState(null);
	const load = useCallback(async (id) => {
		const { res, data } = await fetchCompanyUsers(id);
		if (!data) {
			setError(await describeFailure(res, "Benutzer konnten nicht geladen werden"));
			setPayload(null);
			return;
		}
		setPayload(data);
		setError("");
	}, []);
	useEffect(() => {
		(async () => {
			const principal = await fetchMe();
			setMe(principal);
			if (principal?.isAdmin) {
				const { companies } = await fetchCompanies();
				setDirectory(companies);
				const stored = getActiveCompany();
				const active = stored !== null && companies.some((c) => c.id === stored) ? stored : companies[0]?.id ?? null;
				setCompanyId(active);
				if (active !== null) await load(active);
				setLoading(false);
				return;
			}
			const administered = membershipIds(principal, (c) => c.isCompanyAdmin === true);
			const stored = getActiveCompany();
			const active = stored !== null && administered.includes(stored) ? stored : administered[0] ?? null;
			setCompanyId(active);
			if (active !== null) await load(active);
			setLoading(false);
		})();
	}, [load]);
	const groupById = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const group of payload?.groups ?? []) map.set(group.id, group);
		return map;
	}, [payload]);
	/**
	* The rights this admin may hand out. `null` from the server means "no
	* ceiling" — then everything the assignable groups mention is offered, since
	* there is no catalog call on this surface.
	*/
	const grantable = useMemo(() => {
		if (payload?.allowedPermissions) return payload.allowedPermissions;
		const fromGroups = /* @__PURE__ */ new Set();
		for (const group of payload?.groups ?? []) for (const key of group.permissions) fromGroups.add(key);
		return [...fromGroups].sort();
	}, [payload]);
	const seatsFull = payload?.seats.remaining !== null && payload?.seats.remaining !== void 0 ? payload.seats.remaining <= 0 : false;
	function startCreate() {
		setDraft(emptyDraft());
		setEditingId("new");
		setNotice("");
	}
	function startEdit(member) {
		setDraft(draftOf(member));
		setEditingId(member.id);
		setNotice("");
	}
	async function save(event) {
		event.preventDefault();
		if (companyId === null) return;
		setSaving(true);
		try {
			const body = {
				email: draft.email.trim(),
				name: draft.name.trim() || null,
				permissions: draft.permissions,
				permissionDenies: draft.permissionDenies,
				groupIds: draft.groupIds,
				isCompanyAdmin: draft.isCompanyAdmin,
				status: draft.status
			};
			const { res, data } = editingId === "new" ? await createCompanyUser(companyId, body) : await updateCompanyUser(companyId, editingId, body);
			if (!data) {
				toast.danger(await describeFailure(res, "Speichern fehlgeschlagen"));
				return;
			}
			const temporary = data.temporaryPassword;
			if (temporary) setNotice(`Benutzer angelegt. Temporäres Passwort: ${temporary}`);
			else toast.success(editingId === "new" ? "Benutzer angelegt." : "Benutzer gespeichert.");
			setEditingId(null);
			await load(companyId);
		} finally {
			setSaving(false);
		}
	}
	async function remove(member) {
		if (companyId === null) return;
		const { res, data } = await removeCompanyUser(companyId, member.id);
		setPendingRemove(null);
		if (!data) {
			toast.danger(await describeFailure(res, "Entfernen fehlgeschlagen"));
			return;
		}
		toast.success("Benutzer aus der Firma entfernt.");
		await load(companyId);
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "tds-card",
		style: { padding: "1.5rem" },
		children: /* @__PURE__ */ jsx(Spinner, {
			size: "lg",
			tone: "primary"
		})
	});
	if (companyId === null) return /* @__PURE__ */ jsx("p", {
		className: "tds-alert",
		role: "status",
		children: me?.isAdmin ? "Es sind keine Firmen angelegt." : "Sie verwalten derzeit keine Firma. Ein Administrator kann Ihnen diese Rolle geben."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-4",
		children: [
			error && /* @__PURE__ */ jsx(FormAlert, { message: error }),
			directory.length > 0 && /* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "Firma"
				}), /* @__PURE__ */ jsx("select", {
					className: "field-boxed",
					value: companyId,
					onChange: (e) => {
						const next = Number(e.target.value);
						setCompanyId(next);
						setEditingId(null);
						load(next);
					},
					children: directory.map((company) => /* @__PURE__ */ jsx("option", {
						value: company.id,
						children: company.name
					}, company.id))
				})]
			}),
			notice && /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--success",
				role: "status",
				children: notice
			}),
			payload && /* @__PURE__ */ jsxs("div", {
				className: "tds-card",
				style: { padding: "1rem" },
				children: [/* @__PURE__ */ jsxs("div", {
					className: "tds-row",
					style: {
						justifyContent: "space-between",
						gap: "1rem"
					},
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ jsx("strong", { children: payload.seats.used }),
							payload.seats.max !== null ? ` von ${payload.seats.max}` : "",
							" Benutzerplätzen belegt",
							payload.seats.max === null && " (unbegrenzt)"
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-primary",
						disabled: seatsFull || editingId !== null,
						onClick: startCreate,
						children: "Benutzer hinzufügen"
					})]
				}), seatsFull && /* @__PURE__ */ jsx("p", {
					className: "text-xs",
					style: {
						color: "var(--color-muted)",
						marginTop: "0.5rem"
					},
					children: "Alle Plätze sind belegt. Entfernen Sie einen Benutzer oder fragen Sie nach mehr Plätzen."
				})]
			}),
			editingId !== null && /* @__PURE__ */ jsxs("form", {
				className: "tds-card flex flex-col gap-4",
				style: { padding: "1.25rem" },
				onSubmit: save,
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-sm font-medium",
						children: editingId === "new" ? "Neuer Benutzer" : "Benutzer bearbeiten"
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex flex-col gap-1",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium",
								children: "E-Mail"
							}),
							/* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "email",
								required: true,
								value: draft.email,
								onChange: (e) => setDraft({
									...draft,
									email: e.target.value
								})
							}),
							editingId === "new" && /* @__PURE__ */ jsx("span", {
								className: "text-xs",
								style: { color: "var(--color-muted)" },
								children: "Existiert bereits ein Konto mit dieser Adresse, wird es Ihrer Firma hinzugefügt — eine Person braucht keine zweite Anmeldung."
							})
						]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm font-medium",
							children: "Name"
						}), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: draft.name,
							onChange: (e) => setDraft({
								...draft,
								name: e.target.value
							})
						})]
					}),
					payload && payload.groups.length > 0 && /* @__PURE__ */ jsxs("fieldset", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ jsx("legend", {
								className: "text-sm font-medium",
								children: "Gruppen"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs",
								style: { color: "var(--color-muted)" },
								children: "Rechte aus einer Gruppe gelten zusätzlich zu den einzeln vergebenen."
							}),
							payload.groups.map((group) => /* @__PURE__ */ jsxs("label", {
								className: "tds-list__row",
								style: { gap: "0.625rem" },
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: draft.groupIds.includes(group.id),
									onChange: (e) => setDraft({
										...draft,
										groupIds: e.target.checked ? [...draft.groupIds, group.id] : draft.groupIds.filter((id) => id !== group.id)
									})
								}), /* @__PURE__ */ jsxs("span", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-sm",
										children: group.name
									}), group.description && /* @__PURE__ */ jsx("span", {
										className: "text-xs",
										style: { color: "var(--color-muted)" },
										children: group.description
									})]
								})]
							}, group.id))
						]
					}),
					/* @__PURE__ */ jsxs("fieldset", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ jsx("legend", {
							className: "text-sm font-medium",
							children: "Rechte"
						}), /* @__PURE__ */ jsx(PermissionMatrix, {
							catalog: grantable.map((id) => ({
								id,
								label: id
							})),
							assignedGroups: (payload?.groups ?? []).filter((g) => draft.groupIds.includes(g.id)),
							value: draft.permissions,
							denies: draft.permissionDenies,
							ceiling: payload?.allowedPermissions ?? null,
							onChange: (next) => setDraft({
								...draft,
								permissions: next.permissions,
								permissionDenies: next.denies
							})
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-list__row",
						style: { gap: "0.625rem" },
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: draft.isCompanyAdmin,
							onChange: (e) => setDraft({
								...draft,
								isCompanyAdmin: e.target.checked
							})
						}), /* @__PURE__ */ jsxs("span", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: "Firmenadmin"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs",
								style: { color: "var(--color-muted)" },
								children: "Darf die Benutzer dieser Firma verwalten — also auch diese Seite hier."
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm font-medium",
							children: "Status"
						}), /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: draft.status,
							onChange: (e) => setDraft({
								...draft,
								status: e.target.value
							}),
							children: [/* @__PURE__ */ jsx("option", {
								value: "active",
								children: "Aktiv"
							}), /* @__PURE__ */ jsx("option", {
								value: "disabled",
								children: "Deaktiviert"
							})]
						})]
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
							disabled: saving,
							onClick: () => setEditingId(null),
							children: "Abbrechen"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-card",
				style: { padding: "1.25rem" },
				children: [/* @__PURE__ */ jsxs("table", {
					className: "tds-table",
					children: [
						/* @__PURE__ */ jsx("caption", {
							className: "sr-only",
							children: "Benutzer dieser Firma"
						}),
						/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", { children: "Benutzer" }),
							/* @__PURE__ */ jsx("th", { children: "Gruppen" }),
							/* @__PURE__ */ jsx("th", { children: "Status" }),
							/* @__PURE__ */ jsx("th", { children: "Aktionen" })
						] }) }),
						/* @__PURE__ */ jsx("tbody", { children: (payload?.users ?? []).map((member) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsxs("td", { children: [/* @__PURE__ */ jsx("span", {
								className: "block text-sm",
								children: member.label
							}), /* @__PURE__ */ jsx("span", {
								className: "block text-xs",
								style: { color: "var(--color-muted)" },
								children: member.email
							})] }),
							/* @__PURE__ */ jsxs("td", { children: [
								member.isCompanyAdmin && /* @__PURE__ */ jsx("span", {
									className: "chip chip--info",
									children: "Firmenadmin"
								}),
								" ",
								member.groupIds.map((id) => groupById.get(id)?.name).filter(Boolean).join(", ")
							] }),
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
								className: `status-pill ${member.status === "active" ? "" : "opacity-70"}`,
								children: member.status === "active" ? "Aktiv" : "Deaktiviert"
							}) }),
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
								className: "tds-row",
								style: { gap: "0.375rem" },
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => startEdit(member),
									children: "Bearbeiten"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: () => setPendingRemove(member),
									children: "Entfernen"
								})]
							}) })
						] }, member.id)) })
					]
				}), (payload?.users.length ?? 0) === 0 && /* @__PURE__ */ jsx("p", {
					className: "tds-empty",
					children: "Noch keine weiteren Benutzer in dieser Firma."
				})]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingRemove !== null,
				title: `„${pendingRemove?.label ?? ""}“ entfernen?`,
				message: "Das Konto bleibt bestehen und verliert nur den Zugang zu dieser Firma. Wenn die Person noch zu anderen Firmen gehört, bleibt der Zugang dorthin unberührt.",
				confirmLabel: "Entfernen",
				onCancel: () => setPendingRemove(null),
				onConfirm: () => pendingRemove && void remove(pendingRemove)
			})
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/firma.astro
var firma_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Firma,
	file: () => $$file,
	url: () => $$url
});
var $$Firma = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Meine Firma" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><div><p class="tds-page__eyebrow">Firma</p><h1 class="tds-page__title">Benutzer meiner Firma</h1><p class="tds-page__lede">Legen Sie Benutzer Ihrer Firma an, weisen Sie ihnen Gruppen und Rechte zu und bestimmen Sie, wer die Firma mitverwalten darf.</p></div></div>${renderComponent($$result, "CompanyUsersAdmin", CompanyUsersAdmin, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/components/CompanyUsersAdmin.tsx",
		"client:component-export": "default"
	})}</section>` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/firma.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/firma.astro";
var $$url = "/firma";
//#endregion
//#region \0virtual:astro:page:node_modules/@tracht-digital-solutions/tds-core-frontend/src/pages/firma@_@astro
var page = () => firma_exports;
//#endregion
export { page };
