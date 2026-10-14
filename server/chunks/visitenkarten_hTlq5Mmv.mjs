import { Z as __exportAll, a as renderComponent, f as renderTemplate, p as maybeRenderHead } from "./server_7reGX5XT.mjs";
import { n as emptyCardDocument, t as CARD_BLOCK_CATALOG } from "./schemas_CXOlHFBA.mjs";
import { n as createComponent } from "./compiler_CUvBrtul.mjs";
import { A as toast, O as apiFetch, g as ConfirmDialog, k as apiUrl, t as $$Layout, x as Spinner } from "./Layout_CQb545We.mjs";
import { n as staleClass, r as useCachedJson, t as invalidate } from "./data_CpAriVmi.mjs";
import { useEffect, useId, useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-cards/islands/BlockList.tsx
/** A label per type, so a collapsed row says what it is. */
var TYPE_LABEL = {
	links: "Linkgruppe",
	heading: "Überschrift",
	text: "Text",
	hours: "Öffnungszeiten",
	socials: "Profile",
	divider: "Trennlinie"
};
var ICONS = [
	"link",
	"phone",
	"mail",
	"map",
	"calendar",
	"download",
	"shop",
	"chat"
];
var NETWORKS = [
	"linkedin",
	"xing",
	"instagram",
	"facebook",
	"youtube",
	"github",
	"whatsapp",
	"website"
];
function BlockList({ blocks, onChange, disabled = false }) {
	const listId = useId();
	const replace = (index, block) => {
		onChange(blocks.map((b, i) => i === index ? block : b));
	};
	const move = (index, by) => {
		const target = index + by;
		if (target < 0 || target >= blocks.length) return;
		const next = [...blocks];
		const moved = next[index];
		next[index] = next[target];
		next[target] = moved;
		onChange(next);
	};
	const remove = (index) => {
		onChange(blocks.filter((_, i) => i !== index));
	};
	const add = (type) => {
		const entry = CARD_BLOCK_CATALOG.find((c) => c.id === type);
		if (!entry) return;
		onChange([...blocks, structuredClone(entry.block)]);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			/* @__PURE__ */ jsx("ul", {
				className: "tds-list",
				"aria-label": "Blöcke der Karte",
				id: listId,
				children: blocks.map((block, index) => /* @__PURE__ */ jsx("li", {
					className: "tds-list__row",
					children: /* @__PURE__ */ jsxs("div", {
						className: "tds-stack",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "tds-row",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "chip chip--neutral",
									children: TYPE_LABEL[block.type]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "marginalia",
									children: [
										index + 1,
										" von ",
										blocks.length
									]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									disabled: disabled || index === 0,
									onClick: () => move(index, -1),
									"aria-label": `${TYPE_LABEL[block.type]} nach oben`,
									children: "↑"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									disabled: disabled || index === blocks.length - 1,
									onClick: () => move(index, 1),
									"aria-label": `${TYPE_LABEL[block.type]} nach unten`,
									children: "↓"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-ghost",
									disabled,
									onClick: () => remove(index),
									"aria-label": `${TYPE_LABEL[block.type]} entfernen`,
									children: "Entfernen"
								})
							]
						}), /* @__PURE__ */ jsx(BlockFields, {
							block,
							disabled,
							onChange: (next) => replace(index, next)
						})]
					})
				}, `${block.type}-${index}`))
			}),
			blocks.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "marginalia",
				children: "Noch keine Blöcke. Eine Karte braucht mindestens eine Linkgruppe."
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				role: "group",
				"aria-label": "Block hinzufügen",
				children: CARD_BLOCK_CATALOG.map((entry) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn-ghost",
					disabled,
					title: entry.hint,
					onClick: () => add(entry.id),
					children: ["+ ", entry.label]
				}, entry.id))
			})
		]
	});
}
function BlockFields({ block, disabled, onChange }) {
	switch (block.type) {
		case "divider": return /* @__PURE__ */ jsx("p", {
			className: "marginalia",
			children: "Nur eine Linie. Nichts einzustellen."
		});
		case "heading":
		case "text": return /* @__PURE__ */ jsxs("label", {
			className: "tds-stack",
			children: [/* @__PURE__ */ jsx("span", { children: block.type === "heading" ? "Überschrift" : "Text" }), block.type === "heading" ? /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				type: "text",
				value: block.text,
				disabled,
				maxLength: 160,
				onChange: (e) => onChange({
					...block,
					text: e.target.value
				})
			}) : /* @__PURE__ */ jsx("textarea", {
				className: "field-boxed",
				rows: 3,
				value: block.text,
				disabled,
				maxLength: 2e3,
				onChange: (e) => onChange({
					...block,
					text: e.target.value
				})
			})]
		});
		case "links": return /* @__PURE__ */ jsxs("div", {
			className: "tds-stack",
			children: [/* @__PURE__ */ jsxs("label", {
				className: "tds-stack",
				children: [/* @__PURE__ */ jsx("span", { children: "Überschrift der Gruppe (optional)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					value: block.label ?? "",
					disabled,
					maxLength: 120,
					onChange: (e) => onChange({
						...block,
						label: e.target.value || null
					})
				})]
			}), /* @__PURE__ */ jsx(RowEditor, {
				label: "Links",
				rows: block.items,
				disabled,
				addLabel: "Link hinzufügen",
				empty: {
					label: "",
					href: "",
					note: null,
					icon: "link"
				},
				onChange: (items) => onChange({
					...block,
					items
				}),
				render: (item, update) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						placeholder: "Beschriftung",
						"aria-label": "Beschriftung",
						value: item.label,
						disabled,
						maxLength: 120,
						onChange: (e) => update({
							...item,
							label: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						placeholder: "https://, mailto: oder tel:",
						"aria-label": "Ziel",
						value: item.href,
						disabled,
						maxLength: 600,
						onChange: (e) => update({
							...item,
							href: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						type: "text",
						placeholder: "Zusatz (optional)",
						"aria-label": "Zusatz",
						value: item.note ?? "",
						disabled,
						maxLength: 160,
						onChange: (e) => update({
							...item,
							note: e.target.value || null
						})
					}),
					/* @__PURE__ */ jsx("select", {
						className: "field-boxed",
						"aria-label": "Symbol",
						value: item.icon ?? "link",
						disabled,
						onChange: (e) => update({
							...item,
							icon: e.target.value
						}),
						children: ICONS.map((icon) => /* @__PURE__ */ jsx("option", {
							value: icon,
							children: icon
						}, icon))
					})
				] })
			})]
		});
		case "socials": return /* @__PURE__ */ jsx(RowEditor, {
			label: "Profile",
			rows: block.items,
			disabled,
			addLabel: "Profil hinzufügen",
			empty: {
				network: "linkedin",
				href: ""
			},
			onChange: (items) => onChange({
				...block,
				items
			}),
			render: (item, update) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("select", {
				className: "field-boxed",
				"aria-label": "Netzwerk",
				value: item.network,
				disabled,
				onChange: (e) => update({
					...item,
					network: e.target.value
				}),
				children: NETWORKS.map((network) => /* @__PURE__ */ jsx("option", {
					value: network,
					children: network
				}, network))
			}), /* @__PURE__ */ jsx("input", {
				className: "field-boxed",
				type: "text",
				placeholder: "https://",
				"aria-label": "Ziel",
				value: item.href,
				disabled,
				maxLength: 600,
				onChange: (e) => update({
					...item,
					href: e.target.value
				})
			})] })
		});
		case "hours": return /* @__PURE__ */ jsxs("div", {
			className: "tds-stack",
			children: [/* @__PURE__ */ jsxs("label", {
				className: "tds-stack",
				children: [/* @__PURE__ */ jsx("span", { children: "Überschrift (optional)" }), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					value: block.label ?? "",
					disabled,
					maxLength: 120,
					onChange: (e) => onChange({
						...block,
						label: e.target.value || null
					})
				})]
			}), /* @__PURE__ */ jsx(RowEditor, {
				label: "Zeiten",
				rows: block.rows,
				disabled,
				addLabel: "Zeile hinzufügen",
				empty: {
					days: "",
					time: ""
				},
				onChange: (rows) => onChange({
					...block,
					rows
				}),
				render: (row, update) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					placeholder: "Mo–Do",
					"aria-label": "Tage",
					value: row.days,
					disabled,
					maxLength: 60,
					onChange: (e) => update({
						...row,
						days: e.target.value
					})
				}), /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "text",
					placeholder: "08:00–17:00",
					"aria-label": "Zeit",
					value: row.time,
					disabled,
					maxLength: 60,
					onChange: (e) => update({
						...row,
						time: e.target.value
					})
				})] })
			})]
		});
	}
}
/**
* The repeating rows inside a block.
*
* One component for links, profiles and opening hours: they differ only in the
* fields a row carries, and three near-identical copies is how the reorder
* buttons end up behaving differently in each.
*/
function RowEditor({ label, rows, disabled, addLabel, empty, onChange, render }) {
	const update = (index, next) => {
		onChange(rows.map((r, i) => i === index ? next : r));
	};
	const move = (index, by) => {
		const target = index + by;
		if (target < 0 || target >= rows.length) return;
		const next = [...rows];
		const moved = next[index];
		next[index] = next[target];
		next[target] = moved;
		onChange(next);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [/* @__PURE__ */ jsx("ul", {
			className: "tds-list",
			"aria-label": label,
			children: rows.map((row, index) => /* @__PURE__ */ jsx("li", {
				className: "tds-list__row",
				children: /* @__PURE__ */ jsxs("div", {
					className: "tds-row",
					children: [
						render(row, (next) => update(index, next)),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							disabled: disabled || index === 0,
							onClick: () => move(index, -1),
							"aria-label": `Zeile ${index + 1} nach oben`,
							children: "↑"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							disabled: disabled || index === rows.length - 1,
							onClick: () => move(index, 1),
							"aria-label": `Zeile ${index + 1} nach unten`,
							children: "↓"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-ghost",
							disabled,
							onClick: () => onChange(rows.filter((_, i) => i !== index)),
							"aria-label": `Zeile ${index + 1} entfernen`,
							children: "Entfernen"
						})
					]
				})
			}, index))
		}), /* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "btn btn-ghost",
			disabled,
			onClick: () => onChange([...rows, structuredClone(empty)]),
			children: ["+ ", addLabel]
		})]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-cards/islands/CardsList.tsx
var SURFACES = [
	"paper",
	"ink",
	"navy",
	"sand"
];
var THEMES = ["light", "dark"];
/**
* What a save did to the public pages, in words that are true — and in the
* VARIANT that is true.
*
* A save whose rebuild never went out is not a success and not a failure: the
* card is stored, the public page is unchanged. Reporting it green is the lie
* this function exists to avoid, so it returns the colour as well as the words.
*/
function cacheNote(report) {
	switch (report.cache_status) {
		case "refreshed": return {
			variant: "success",
			message: report.cached ? "Gespeichert. Die Seiten wurden neu gebaut." : "Gespeichert. Neu bauen wurde angefragt."
		};
		case "not_configured": return {
			variant: "warning",
			message: "Gespeichert. Die Kartenseite ist noch nicht verbunden — die öffentlichen Seiten sind unverändert."
		};
		case "failed": return {
			variant: "warning",
			message: "Gespeichert. Das Neubauen hat nicht geklappt."
		};
		default: return {
			variant: "success",
			message: "Gespeichert."
		};
	}
}
function CardsList() {
	const cardsQuery = useCachedJson("/cards");
	const cards = cardsQuery.data?.cards ?? [];
	const listStale = cardsQuery.stale && cards.length > 0;
	const [selectedSlug, setSelectedSlug] = useState(null);
	const selected = useMemo(() => cards.find((c) => c.slug === selectedSlug) ?? cards[0] ?? null, [cards, selectedSlug]);
	if (cardsQuery.loading) return /* @__PURE__ */ jsxs("p", {
		"aria-busy": "true",
		children: [/* @__PURE__ */ jsx(Spinner, {}), " Visitenkarten werden geladen …"]
	});
	if (cardsQuery.error && cards.length === 0) return /* @__PURE__ */ jsxs("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: [
			"Visitenkarten konnten nicht geladen werden (",
			cardsQuery.error.message,
			")."
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [
			cardsQuery.error ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Die Liste konnte nicht aktualisiert werden (",
					cardsQuery.error.message,
					"). Was hier steht, ist möglicherweise veraltet."
				]
			}) : null,
			/* @__PURE__ */ jsx(CreateCard, { onCreated: (slug) => setSelectedSlug(slug) }),
			cards.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "tds-empty",
				children: [/* @__PURE__ */ jsx("p", { children: "Noch keine Visitenkarte angelegt." }), /* @__PURE__ */ jsx("p", {
					className: "marginalia",
					children: "Eine Karte ist zuerst ein Entwurf. Sie geht live, sobald sie veröffentlicht wird."
				})]
			}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [cards.length > 1 ? /* @__PURE__ */ jsx("div", {
				className: staleClass(listStale, "tds-toolbar"),
				role: "group",
				"aria-label": "Visitenkarte wählen",
				"aria-busy": listStale,
				children: cards.map((card) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: card.slug === selected?.slug ? "chip tds-tab chip--info" : card.draft ? "chip tds-tab chip--neutral" : "chip tds-tab chip--success",
					"aria-pressed": card.slug === selected?.slug,
					onClick: () => setSelectedSlug(card.slug),
					children: [card.displayName || card.slug, card.draft ? " (Entwurf)" : ""]
				}, card.id))
			}) : null, selected ? /* @__PURE__ */ jsx(CardEditor, { card: selected }, selected.slug) : null] })
		]
	});
}
function CreateCard({ onCreated }) {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const create = async () => {
		setBusy(true);
		setError(null);
		try {
			const res = await apiFetch("/cards", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					displayName: name,
					slug: slug || void 0
				})
			});
			const payload = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(payload.error ?? `Anlegen fehlgeschlagen (${res.status}).`);
				return;
			}
			setName("");
			setSlug("");
			invalidate("/cards");
			if (payload.card) onCreated(payload.card.slug);
			toast.success("Visitenkarte angelegt. Sie ist noch ein Entwurf.");
		} catch (err) {
			toast.danger(`Anlegen fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs("form", {
		className: "tds-card tds-stack",
		onSubmit: (e) => {
			e.preventDefault();
			create();
		},
		children: [
			/* @__PURE__ */ jsx("h2", { children: "Neue Visitenkarte" }),
			error ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: error
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-row",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "tds-stack",
						children: [/* @__PURE__ */ jsx("span", { children: "Name auf der Karte" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: name,
							required: true,
							maxLength: 160,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-stack",
						children: [/* @__PURE__ */ jsx("span", { children: "Adresse (optional)" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: slug,
							placeholder: "wird aus dem Namen vorgeschlagen",
							maxLength: 80,
							onChange: (e) => setSlug(e.target.value)
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "btn btn-primary",
						disabled: busy || name.trim() === "",
						children: busy ? "Wird angelegt …" : "Anlegen"
					})
				]
			})
		]
	});
}
function CardEditor({ card }) {
	const [draft, setDraft] = useState(card);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	useEffect(() => {
		setDraft(card);
	}, [card]);
	const set = (key, value) => {
		setDraft((previous) => ({
			...previous,
			[key]: value
		}));
	};
	const save = async (publish) => {
		setBusy(true);
		setError(null);
		const nextDraft = publish === void 0 ? draft.draft : !publish;
		try {
			const res = await apiFetch(`/cards/${draft.slug}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...toPayload(draft),
					draft: nextDraft
				})
			});
			const payload = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(payload.error ?? `Speichern fehlgeschlagen (${res.status}).`);
				return;
			}
			invalidate("/cards");
			const note = cacheNote(payload);
			toast[note.variant](note.message);
		} catch (err) {
			toast.danger(`Speichern fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setBusy(false);
		}
	};
	const remove = async () => {
		setConfirmDelete(false);
		setBusy(true);
		try {
			const res = await apiFetch(`/cards/${draft.slug}`, { method: "DELETE" });
			if (!res.ok) {
				setError(`Löschen fehlgeschlagen (${res.status}).`);
				return;
			}
			invalidate("/cards");
			toast.success("Visitenkarte gelöscht.");
		} catch (err) {
			toast.danger(`Löschen fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-card tds-stack",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "tds-row",
				children: [/* @__PURE__ */ jsx("h2", { children: draft.displayName || draft.slug }), /* @__PURE__ */ jsx("span", {
					className: draft.draft ? "chip chip--neutral" : "chip chip--success",
					children: draft.draft ? "Entwurf" : "Veröffentlicht"
				})]
			}),
			error ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: error
			}) : null,
			/* @__PURE__ */ jsxs("fieldset", {
				className: "tds-stack",
				children: [
					/* @__PURE__ */ jsx("legend", { children: "Adressen" }),
					/* @__PURE__ */ jsxs("p", {
						className: "marginalia",
						children: [
							"Die Karte ist immer unter ",
							/* @__PURE__ */ jsxs("code", { children: ["karte.tracht-digital.de/", draft.slug] }),
							" erreichbar. Die eigene Domain kommt dazu, sobald sie im Hosting eingerichtet ist."
						]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-stack",
						children: [/* @__PURE__ */ jsx("span", { children: "Eigene Domain" }), /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							type: "text",
							value: draft.domain ?? "",
							placeholder: "mira-markt.de",
							maxLength: 190,
							onChange: (e) => set("domain", e.target.value || null)
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "tds-stack",
				children: [
					/* @__PURE__ */ jsx("legend", { children: "Feste Felder" }),
					/* @__PURE__ */ jsx(Text, {
						label: "Name",
						value: draft.displayName,
						onChange: (v) => set("displayName", v),
						max: 160
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Funktion",
						value: draft.role,
						onChange: (v) => set("role", v),
						max: 160
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Firma",
						value: draft.companyName,
						onChange: (v) => set("companyName", v),
						max: 160
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Kurzsatz",
						value: draft.tagline,
						onChange: (v) => set("tagline", v),
						max: 240
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Telefon",
						value: draft.phone,
						onChange: (v) => set("phone", v),
						max: 60
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Mobil",
						value: draft.mobile,
						onChange: (v) => set("mobile", v),
						max: 60
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "E-Mail",
						value: draft.email,
						onChange: (v) => set("email", v),
						max: 190
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Website",
						value: draft.website,
						onChange: (v) => set("website", v),
						max: 300
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Straße und Nummer",
						value: draft.addressLine,
						onChange: (v) => set("addressLine", v),
						max: 190
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Postleitzahl",
						value: draft.postalCode,
						onChange: (v) => set("postalCode", v),
						max: 20
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Ort",
						value: draft.city,
						onChange: (v) => set("city", v),
						max: 120
					}),
					/* @__PURE__ */ jsx(Text, {
						label: "Land (zwei Buchstaben)",
						value: draft.country,
						onChange: (v) => set("country", v),
						max: 2
					})
				]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "tds-stack",
				children: [/* @__PURE__ */ jsx("legend", { children: "Aussehen" }), /* @__PURE__ */ jsxs("div", {
					className: "tds-row",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "tds-stack",
							children: [/* @__PURE__ */ jsx("span", { children: "Akzentfarbe" }), /* @__PURE__ */ jsx("input", {
								className: "field-boxed",
								type: "color",
								value: /^#[0-9a-f]{6}$/i.test(draft.accent) ? draft.accent : "#1f3a5f",
								style: { width: "6rem" },
								onChange: (e) => set("accent", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "tds-stack",
							children: [/* @__PURE__ */ jsx("span", { children: "Fläche" }), /* @__PURE__ */ jsx("select", {
								className: "field-boxed",
								value: draft.surface,
								onChange: (e) => set("surface", e.target.value),
								children: SURFACES.map((s) => /* @__PURE__ */ jsx("option", {
									value: s,
									children: s
								}, s))
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "tds-stack",
							children: [/* @__PURE__ */ jsx("span", { children: "Hell oder dunkel" }), /* @__PURE__ */ jsx("select", {
								className: "field-boxed",
								value: draft.theme,
								onChange: (e) => set("theme", e.target.value),
								children: THEMES.map((t) => /* @__PURE__ */ jsx("option", {
									value: t,
									children: t === "light" ? "hell" : "dunkel"
								}, t))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "tds-stack",
				children: [
					/* @__PURE__ */ jsx("legend", { children: "Bilder" }),
					/* @__PURE__ */ jsx(ImageField, {
						slug: draft.slug,
						kind: "portrait",
						label: "Portrait",
						present: draft.assets.includes("portrait")
					}),
					/* @__PURE__ */ jsx(ImageField, {
						slug: draft.slug,
						kind: "logo",
						label: "Logo",
						present: draft.assets.includes("logo")
					})
				]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "tds-stack",
				children: [/* @__PURE__ */ jsx("legend", { children: "Freie Blöcke" }), /* @__PURE__ */ jsx(BlockList, {
					blocks: draft.blocks.length > 0 ? draft.blocks : emptyCardDocument().blocks,
					disabled: busy,
					onChange: (blocks) => set("blocks", blocks)
				})]
			}),
			/* @__PURE__ */ jsxs("fieldset", {
				className: "tds-stack",
				children: [/* @__PURE__ */ jsx("legend", { children: "Suchmaschinen" }), /* @__PURE__ */ jsxs("label", {
					className: "tds-stack",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Beschreibung (80–160 Zeichen)" }),
						/* @__PURE__ */ jsx("textarea", {
							className: "field-boxed",
							rows: 2,
							value: draft.metaDescription ?? "",
							maxLength: 200,
							onChange: (e) => set("metaDescription", e.target.value || null)
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "marginalia",
							children: [(draft.metaDescription ?? "").length, " Zeichen"]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-primary",
						disabled: busy,
						onClick: () => void save(),
						children: busy ? "Wird gespeichert …" : "Speichern"
					}),
					draft.draft ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-accent",
						disabled: busy,
						onClick: () => void save(true),
						children: "Speichern und veröffentlichen"
					}) : /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-accent",
						disabled: busy,
						onClick: () => void save(false),
						children: "Zurück auf Entwurf"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: busy,
						onClick: () => setConfirmDelete(true),
						children: "Löschen"
					})
				]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: confirmDelete,
				title: "Visitenkarte löschen?",
				message: `„${draft.displayName || draft.slug}" wird mit allen Bildern entfernt. Das lässt sich nicht zurückholen.`,
				confirmLabel: "Löschen",
				onConfirm: () => void remove(),
				onCancel: () => setConfirmDelete(false)
			})
		]
	});
}
/** Only the editable fields; `id`, `assets` and the timestamps are the server's. */
function toPayload(card) {
	return {
		domain: card.domain,
		lang: card.lang,
		displayName: card.displayName,
		role: card.role,
		companyName: card.companyName,
		tagline: card.tagline,
		phone: card.phone,
		mobile: card.mobile,
		email: card.email,
		website: card.website,
		addressLine: card.addressLine,
		postalCode: card.postalCode,
		city: card.city,
		country: card.country,
		accent: card.accent,
		surface: card.surface,
		theme: card.theme,
		metaDescription: card.metaDescription,
		blocks: card.blocks
	};
}
function Text({ label, value, onChange, max }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "tds-stack",
		children: [/* @__PURE__ */ jsx("span", { children: label }), /* @__PURE__ */ jsx("input", {
			className: "field-boxed",
			type: "text",
			value: value ?? "",
			maxLength: max,
			onChange: (e) => onChange(e.target.value || null)
		})]
	});
}
function ImageField({ slug, kind, label, present }) {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const upload = async (file) => {
		setBusy(true);
		setError(null);
		try {
			const blob = await downscale(file);
			const form = new FormData();
			form.append("file", blob, blob instanceof File ? blob.name : `${kind}.webp`);
			const res = await apiFetch(`/cards/${slug}/image/${kind}`, {
				method: "POST",
				body: form
			});
			const payload = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(payload.error ?? `Hochladen fehlgeschlagen (${res.status}).`);
				return;
			}
			invalidate("/cards");
			toast.success(`${label} hochgeladen.`);
		} catch (err) {
			toast.danger(`Hochladen fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setBusy(false);
		}
	};
	const remove = async () => {
		setBusy(true);
		try {
			const res = await apiFetch(`/cards/${slug}/image/${kind}`, { method: "DELETE" });
			if (!res.ok) {
				setError(`Entfernen fehlgeschlagen (${res.status}).`);
				return;
			}
			invalidate("/cards");
			toast.success(`${label} entfernt.`);
		} catch (err) {
			toast.danger(`Entfernen fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "tds-stack",
		children: [error ? /* @__PURE__ */ jsx("p", {
			className: "tds-alert tds-alert--danger",
			role: "alert",
			children: error
		}) : null, /* @__PURE__ */ jsxs("div", {
			className: "tds-row",
			children: [
				/* @__PURE__ */ jsx("span", { children: label }),
				present ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("a", {
					className: "link-underline",
					href: apiUrl(`/cards/${slug}/image/${kind}`),
					target: "_blank",
					rel: "noreferrer",
					children: "Ansehen"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-ghost",
					disabled: busy,
					onClick: () => void remove(),
					children: "Entfernen"
				})] }) : /* @__PURE__ */ jsx("span", {
					className: "marginalia",
					children: "noch keins"
				}),
				/* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					disabled: busy,
					"aria-label": `${label} hochladen`,
					onChange: (e) => {
						const file = e.target.files?.[0];
						if (file) upload(file);
						e.target.value = "";
					}
				})
			]
		})]
	});
}
/**
* Shrink a picture before it goes up.
*
* The server deliberately does NOT resize: the production host does not
* guarantee `ext-gd`, so a resize there would work in development and throw on
* the host. Doing it here also means a 12-megapixel phone photo does not travel
* over the wire to be rejected for size.
*
* Falls back to the original file whenever canvas or WebP is unavailable —
* a missing convenience, not a missing upload.
*/
async function downscale(file, max = 1024) {
	try {
		const bitmap = await createImageBitmap(file);
		const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
		const width = Math.round(bitmap.width * scale);
		const height = Math.round(bitmap.height * scale);
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext("2d");
		if (!context) return file;
		context.drawImage(bitmap, 0, 0, width, height);
		return await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", .9)) ?? file;
	} catch {
		return file;
	}
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-cards/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Visitenkarten</h1><p class="tds-page__lead">Eine Seite je Kunde. Sie läuft auf einer eigenen Domain und immer auch auf<code>karte.tracht-digital.de</code>.</p></div>${renderComponent($$result, "CardsList", CardsList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-cards/islands/CardsList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-cards/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/visitenkarten.astro
var visitenkarten_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Visitenkarten,
	file: () => $$file,
	url: () => void 0
});
var $$Visitenkarten = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Visitenkarten" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/visitenkarten.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/visitenkarten.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/visitenkarten@_@astro
var page = () => visitenkarten_exports;
//#endregion
export { page };
