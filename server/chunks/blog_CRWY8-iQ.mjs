import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, z as __exportAll } from "./server_LvAcRe-s.mjs";
import { t as createComponent } from "./compiler_BCOESMar.mjs";
import { b as toast, g as ConfirmDialog, t as $$Layout, y as Spinner } from "./Layout_EXQSk7Qd.mjs";
import { t as apiFetch } from "./api_sTTHNFo-.mjs";
import { n as staleClass, r as useCachedJson, t as invalidate } from "./data_CxFkYAe0.mjs";
import { t as renderMarkdown } from "./markdown_BXKCkzAJ.mjs";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogsList.tsx
var api = apiFetch;
var EMPTY_POST = {
	slug: "",
	lang: "de",
	category: "allgemein",
	title: "",
	excerpt: "",
	meta_description: "",
	tags: "",
	cover_hint: "",
	body: "",
	author_id: 0,
	draft: true
};
/**
* Blog-CMS — the CONTENT screen: pick a blog, pick an article, edit it.
*
* ### What is deliberately NOT here any more
*
* Adding and connecting a blog moved to **Einstellungen → Blog-CMS**
* (`BlogRegistry.tsx`). Connection controls were sitting above the article list, on
* the screen someone opens to write. This one answers a single question: what
* does this article say.
*
* ### Stale-while-revalidate
*
* The blog list, the article list and the author list all read through
* `useCachedJson`, so returning to this screen paints last visit's contents
* immediately and refreshes them behind the user. A list being refreshed wears
* `tds-stale` — dimmed and pulsing — because data that may already be wrong
* must not look current.
*/
function BlogsList() {
	const blogsQuery = useCachedJson("/blogs");
	const blogs = useMemo(() => blogsQuery.data?.blogs ?? [], [blogsQuery.data]);
	const [selectedKey, setSelectedKey] = useState(null);
	useEffect(() => {
		if (blogs.length === 0) {
			if (selectedKey !== null) setSelectedKey(null);
			return;
		}
		if (selectedKey === null || !blogs.some((b) => b.blog_key === selectedKey)) setSelectedKey(blogs[0]?.blog_key ?? null);
	}, [blogs, selectedKey]);
	const selected = blogs.find((b) => b.blog_key === selectedKey) ?? null;
	if (blogsQuery.loading) return /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (blogsQuery.error && blogs.length === 0) return /* @__PURE__ */ jsxs("p", {
		className: "tds-alert tds-alert--danger",
		role: "alert",
		children: [
			"Blogs konnten nicht geladen werden (",
			blogsQuery.error.message,
			")."
		]
	});
	if (blogs.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "tds-empty",
		children: [/* @__PURE__ */ jsx("p", { children: "Noch kein Blog verbunden." }), /* @__PURE__ */ jsxs("p", {
			className: "marginalia",
			children: [
				"Blogs werden unter ",
				/* @__PURE__ */ jsx("a", {
					className: "link-underline",
					href: "/einstellungen",
					children: "Einstellungen → Blog-CMS"
				}),
				" ",
				"hinzugefügt. Dort liegt auch, wohin ein veröffentlichter Beitrag den Seiten-Cache schickt."
			]
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: staleClass(blogsQuery.stale, "blog-list tds-stack"),
		"aria-busy": blogsQuery.stale,
		children: [
			blogsQuery.error ? /* @__PURE__ */ jsxs("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: [
					"Die Blog-Liste konnte nicht aktualisiert werden (",
					blogsQuery.error.message,
					"). Die angezeigten Daten können veraltet sein."
				]
			}) : null,
			blogs.length > 1 ? /* @__PURE__ */ jsx("div", {
				className: "tds-toolbar",
				role: "group",
				"aria-label": "Blog wählen",
				children: blogs.map((b) => /* @__PURE__ */ jsx("button", {
					type: "button",
					className: b.blog_key === selectedKey ? "chip chip--info" : "chip chip--neutral",
					"aria-pressed": b.blog_key === selectedKey,
					onClick: () => setSelectedKey(b.blog_key),
					children: b.name
				}, b.id))
			}) : null,
			selected ? /* @__PURE__ */ jsx(BlogPosts, { blog: selected }, selected.blog_key) : null
		]
	});
}
/** One blog's articles, plus the editor for the chosen one. */
function BlogPosts({ blog }) {
	const postsQuery = useCachedJson(`/blogs/${blog.blog_key}/posts`);
	const posts = postsQuery.data?.posts ?? [];
	const authorsQuery = useCachedJson("/blog/authors");
	const authors = useMemo(() => authorsQuery.data?.authors ?? [], [authorsQuery.data]);
	const [editing, setEditing] = useState(null);
	/** True when the editor targets an existing (blog, slug, lang) — locks slug/lang. */
	const [isExisting, setIsExisting] = useState(false);
	const [backfillStatus, setBackfillStatus] = useState(null);
	const [cacheStatus, setCacheStatus] = useState(null);
	const cacheConfigured = Boolean((blog.cache_url ?? "").trim());
	const backfill = async () => {
		setBackfillStatus("Übersetzungen werden erzeugt …");
		const res = await api(`/blogs/${blog.blog_key}/translations/backfill`, { method: "POST" });
		if (res.ok) {
			const d = await res.json().catch(() => ({}));
			setBackfillStatus(null);
			toast.success(`Fertig: ${d.created ?? 0} erstellt, ${d.skipped ?? 0} übersprungen.`);
			invalidate(`/blogs/${blog.blog_key}/`);
		} else if (res.status === 503) setBackfillStatus("Automatische Übersetzung ist nicht konfiguriert (Einstellungen → Blog-CMS).");
		else {
			setBackfillStatus(null);
			toast.danger(`Übersetzungslauf fehlgeschlagen (HTTP ${res.status}).`);
		}
	};
	/**
	* Re-render the cached pages of ONE article.
	*
	* This is the case the whole page cache exists for: correcting one paragraph
	* used to cost a rebuild of the entire corpus. Publishing does it by itself —
	* this button is the catch-up for when that did not land.
	*/
	const rebuildArticle = async (slug) => {
		setCacheStatus(`Seiten von „${slug}“ werden neu gebaut …`);
		const res = await api(`/blogs/${blog.blog_key}/cache/rebuild`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ slug })
		});
		if (res.ok) {
			setCacheStatus(null);
			toast.success(`Cache-Neubau für „${slug}“ wurde angefragt.`);
		} else if (res.status === 422) setCacheStatus("Für diesen Blog ist keine Adresse hinterlegt (Einstellungen → Blog-CMS).");
		else if (res.status === 503) setCacheStatus("Der Seiten-Cache ist nicht vollständig konfiguriert (Token unter Einstellungen → Blog-CMS prüfen).");
		else {
			setCacheStatus(null);
			toast.danger(`Cache-Neubau fehlgeschlagen (HTTP ${res.status}).`);
		}
	};
	const openPost = async (p) => {
		const res = await api(`/blogs/${blog.blog_key}/posts/${p.slug}?lang=${p.lang}`);
		if (!res.ok) {
			toast.danger(`Beitrag konnte nicht geladen werden (HTTP ${res.status}).`);
			return;
		}
		const d = await res.json();
		setIsExisting(true);
		setEditing({
			slug: p.slug,
			lang: p.lang,
			category: d.category ?? "allgemein",
			title: d.title ?? p.title,
			excerpt: d.excerpt ?? "",
			meta_description: d.meta_description ?? "",
			tags: d.tags ?? "",
			cover_hint: d.cover_hint ?? "",
			body: d.body ?? "",
			author_id: d.author_id ?? 0,
			draft: Boolean(d.draft ?? p.draft)
		});
	};
	const newPost = () => {
		setIsExisting(false);
		setEditing({ ...EMPTY_POST });
	};
	if (editing) return /* @__PURE__ */ jsx(PostEditor, {
		blogKey: blog.blog_key,
		post: editing,
		isExisting,
		authors,
		cacheConfigured,
		onDone: () => {
			setEditing(null);
			invalidate(`/blogs/${blog.blog_key}/`);
		},
		onCancel: () => setEditing(null)
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "blog-posts tds-stack",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "tds-row tds-row--between",
				children: [/* @__PURE__ */ jsx("h2", { children: blog.name }), /* @__PURE__ */ jsx("button", {
					className: "btn btn-ghost",
					type: "button",
					onClick: newPost,
					children: "Neuer Beitrag"
				})]
			}),
			postsQuery.error ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: posts.length === 0 ? `Beiträge konnten nicht geladen werden (${postsQuery.error.message}).` : `Die Beiträge konnten nicht aktualisiert werden (${postsQuery.error.message}). Die angezeigten Daten können veraltet sein.`
			}) : null,
			cacheStatus ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert",
				role: "status",
				children: cacheStatus
			}) : null,
			postsQuery.loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : posts.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "tds-empty",
				children: "Noch keine Beiträge."
			}) : /* @__PURE__ */ jsx("ul", {
				className: staleClass(postsQuery.stale, "tds-list"),
				"aria-busy": postsQuery.stale,
				children: posts.map((p) => /* @__PURE__ */ jsxs("li", {
					className: "tds-list__row",
					children: [/* @__PURE__ */ jsxs("button", {
						className: "btn btn-ghost",
						type: "button",
						onClick: () => openPost(p),
						children: [
							/* @__PURE__ */ jsx("strong", { children: p.title }),
							" ",
							/* @__PURE__ */ jsx("code", { children: p.slug }),
							/* @__PURE__ */ jsx("span", {
								className: "chip chip--neutral",
								children: p.lang
							}),
							/* @__PURE__ */ jsx("span", {
								className: `chip chip--${p.draft ? "warning" : "success"}`,
								children: p.draft ? "Entwurf" : "Veröffentlicht"
							}),
							p.machine_translated ? /* @__PURE__ */ jsx("span", {
								className: "chip chip--info",
								title: "Automatisch übersetzt",
								children: "Auto-Übersetzung"
							}) : null,
							p.author_name ? /* @__PURE__ */ jsxs("span", {
								className: "text-xs opacity-60",
								children: [" · ", p.author_name]
							}) : null
						]
					}), p.draft ? null : /* @__PURE__ */ jsx("button", {
						className: "btn btn-ghost",
						type: "button",
						onClick: () => rebuildArticle(p.slug),
						title: "Nur die Seiten dieses Beitrags neu rendern",
						children: "Cache neu bauen"
					})]
				}, `${p.slug}-${p.lang}`))
			}),
			/* @__PURE__ */ jsx(AuthorManager, {
				authors,
				loading: authorsQuery.loading,
				stale: authorsQuery.stale,
				error: authorsQuery.error,
				onChange: () => invalidate("/blog/authors")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "blog-translate",
				children: [
					/* @__PURE__ */ jsx("h3", { children: "Automatische Übersetzung" }),
					/* @__PURE__ */ jsx("p", {
						className: "marginalia",
						children: "Beim Speichern eines veröffentlichten Beitrags wird die Gegensprache per DeepL erzeugt (Schlüssel unter Einstellungen → Blog-CMS). Vorhandene Beiträge lassen sich hier nachziehen."
					}),
					backfillStatus ? /* @__PURE__ */ jsx("p", {
						className: "tds-alert",
						role: "status",
						children: backfillStatus
					}) : null,
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: backfill,
						children: "Übersetzungen nachziehen"
					})
				]
			})
		]
	});
}
function PostEditor({ blogKey, post, isExisting, authors, cacheConfigured, onDone, onCancel }) {
	const [form, setForm] = useState(post);
	const [status, setStatus] = useState(null);
	const [busy, setBusy] = useState(false);
	const [preview, setPreview] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const set = (field, value) => setForm((f) => ({
		...f,
		[field]: value
	}));
	const save = async () => {
		if (!/^[a-z0-9-]{2,64}$/.test(form.slug)) {
			setStatus("Slug muss kebab-case sein (a-z, 0-9, -).");
			return;
		}
		if (form.title.trim() === "" || form.body.trim() === "") {
			setStatus("Titel und Inhalt sind erforderlich.");
			return;
		}
		setBusy(true);
		setStatus(null);
		const res = await api(`/blogs/${blogKey}/posts/${form.slug}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				lang: form.lang,
				category: form.category.trim() || "allgemein",
				title: form.title.trim(),
				excerpt: form.excerpt.trim(),
				meta_description: form.meta_description.trim(),
				tags: form.tags.trim(),
				cover_hint: form.cover_hint.trim(),
				body: form.body,
				author_id: form.author_id,
				draft: form.draft
			})
		});
		setBusy(false);
		if (!res.ok) {
			toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
			return;
		}
		const body = await res.json().catch(() => ({}));
		toast.success(body.cached === true ? "Beitrag gespeichert — der Neubau seiner Seiten wurde angefragt." : form.draft ? "Entwurf gespeichert. Entwürfe sind nicht öffentlich." : cacheConfigured ? "Beitrag gespeichert. Der Seiten-Cache konnte nicht angestoßen werden." : "Beitrag gespeichert. Für diesen Blog ist kein Seiten-Cache hinterlegt.");
		onDone();
	};
	const remove = async () => {
		setBusy(true);
		const res = await api(`/blogs/${blogKey}/posts/${form.slug}?lang=${form.lang}`, { method: "DELETE" });
		setBusy(false);
		setConfirmDelete(false);
		if (res.ok) {
			toast.success("Beitrag gelöscht.");
			onDone();
		} else toast.danger(`Löschen fehlgeschlagen (HTTP ${res.status}).`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "blog-editor",
		children: [
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-ghost",
				type: "button",
				onClick: onCancel,
				children: "← Beiträge"
			}),
			/* @__PURE__ */ jsx("h2", { children: isExisting ? "Beitrag bearbeiten" : "Neuer Beitrag" }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: ["Slug", /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: form.slug,
							onChange: (e) => set("slug", e.target.value),
							placeholder: "mein-beitrag",
							disabled: isExisting
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: ["Sprache", /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: form.lang,
							onChange: (e) => set("lang", e.target.value),
							disabled: isExisting,
							children: [/* @__PURE__ */ jsx("option", {
								value: "de",
								children: "de"
							}), /* @__PURE__ */ jsx("option", {
								value: "en",
								children: "en"
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: ["Kategorie", /* @__PURE__ */ jsx("input", {
							className: "field-boxed",
							value: form.category,
							onChange: (e) => set("category", e.target.value),
							placeholder: "allgemein"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "tds-field-row",
						children: ["Autor", /* @__PURE__ */ jsxs("select", {
							className: "field-boxed",
							value: String(form.author_id),
							onChange: (e) => set("author_id", Number(e.target.value)),
							children: [/* @__PURE__ */ jsx("option", {
								value: "0",
								children: "— kein Autor —"
							}), authors.map((a) => /* @__PURE__ */ jsx("option", {
								value: a.id,
								children: a.name
							}, a.id))]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: ["Titel", /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					value: form.title,
					onChange: (e) => set("title", e.target.value),
					placeholder: "Titel des Beitrags"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: ["Auszug", /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					value: form.excerpt,
					onChange: (e) => set("excerpt", e.target.value),
					placeholder: "Kurzbeschreibung (optional)"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: ["Cover-Hinweis", /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					value: form.cover_hint,
					onChange: (e) => set("cover_hint", e.target.value),
					placeholder: "Bild-Hinweis (optional)"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: ["Meta-Description (SEO)", /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					value: form.meta_description,
					onChange: (e) => set("meta_description", e.target.value),
					maxLength: 300,
					placeholder: "Suchmaschinen-Beschreibung (≤160 Zeichen ideal)"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "tds-field-row",
				children: ["Tags / Keywords", /* @__PURE__ */ jsx("input", {
					className: "field-boxed",
					value: form.tags,
					onChange: (e) => set("tags", e.target.value),
					maxLength: 200,
					placeholder: "komma, getrennt, keywords"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "tds-field-row",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("span", { children: "Inhalt (Markdown)" }), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-ghost text-xs ml-auto",
						onClick: () => setPreview((v) => !v),
						children: preview ? "Bearbeiten" : "Vorschau"
					})]
				}), preview ? /* @__PURE__ */ jsx("div", {
					className: "blog-editor__preview prose",
					dangerouslySetInnerHTML: { __html: renderMarkdown(form.body) }
				}) : /* @__PURE__ */ jsx("textarea", {
					className: "field-boxed",
					value: form.body,
					onChange: (e) => set("body", e.target.value),
					rows: 18,
					spellCheck: false,
					placeholder: "# Überschrift\n\nText in Markdown …"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "blog-editor__publish",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: !form.draft,
					onChange: (e) => set("draft", !e.target.checked)
				}), "Veröffentlichen (sonst Entwurf)"]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "tds-toolbar",
				children: [/* @__PURE__ */ jsx("button", {
					className: "btn btn-primary",
					type: "button",
					onClick: save,
					disabled: busy,
					children: "Speichern"
				}), isExisting ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-danger",
					onClick: () => setConfirmDelete(true),
					disabled: busy,
					children: "Löschen"
				}) : null]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: confirmDelete,
				title: `Beitrag „${form.title || form.slug}“ löschen?`,
				message: "Die Sprachfassung wird dauerhaft entfernt. Das lässt sich nicht rückgängig machen.",
				busy,
				onConfirm: () => void remove(),
				onCancel: () => setConfirmDelete(false)
			})
		]
	});
}
/** Manage the byline registry: list authors, add one, remove one. */
function AuthorManager({ authors, loading, stale, error, onChange }) {
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [avatar, setAvatar] = useState("");
	const [status, setStatus] = useState(null);
	const [panelUsers, setPanelUsers] = useState([]);
	const [pickedUser, setPickedUser] = useState("");
	const [pendingDelete, setPendingDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	useEffect(() => {
		apiFetch("/auth/admin/users").then((r) => r.ok ? r.json() : { users: [] }).then((d) => setPanelUsers((d.users ?? []).filter((u) => u.isBlogAuthor || u.isAdmin))).catch(() => setPanelUsers([]));
	}, []);
	const linkedUserIds = new Set(authors.map((a) => a.user_id).filter((v) => typeof v === "number"));
	const importable = panelUsers.filter((u) => !linkedUserIds.has(u.id));
	const post = async (payload, reset) => {
		const res = await api("/blog/authors", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		if (res.ok) {
			reset?.();
			setStatus(null);
			onChange();
		} else toast.danger(`Speichern fehlgeschlagen (HTTP ${res.status}).`);
	};
	const add = () => {
		if (name.trim().length < 2) {
			setStatus("Name ist erforderlich.");
			return;
		}
		post({
			name: name.trim(),
			bio: bio.trim(),
			avatar_url: avatar.trim()
		}, () => {
			setName("");
			setBio("");
			setAvatar("");
		});
	};
	const importUser = () => {
		const u = panelUsers.find((x) => String(x.id) === pickedUser);
		if (!u) return;
		post({
			user_id: u.id,
			name: (u.name ?? u.email).trim()
		}, () => setPickedUser(""));
	};
	const confirmRemove = async () => {
		const a = pendingDelete;
		if (!a) return;
		setDeleting(true);
		try {
			const res = await api(`/blog/authors/${a.id}`, { method: "DELETE" });
			setPendingDelete(null);
			if (res.ok) onChange();
		} finally {
			setDeleting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "blog-authors",
		children: [
			/* @__PURE__ */ jsx("h3", { children: "Autoren" }),
			error ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: authors.length === 0 ? `Autoren konnten nicht geladen werden (${error.message}).` : `Die Autoren konnten nicht aktualisiert werden (${error.message}). Die angezeigten Daten können veraltet sein.`
			}) : null,
			loading ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Spinner, {}) }) : authors.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "text-xs opacity-60",
				children: "Noch keine Autoren."
			}) : /* @__PURE__ */ jsx("ul", {
				className: staleClass(stale, "tds-list"),
				"aria-busy": stale,
				children: authors.map((a) => /* @__PURE__ */ jsxs("li", {
					className: "tds-list__row",
					children: [
						/* @__PURE__ */ jsx("strong", { children: a.name }),
						a.user_id ? /* @__PURE__ */ jsx("span", {
							className: "chip chip--cat-violet",
							children: "Panel-Nutzer"
						}) : null,
						a.bio ? /* @__PURE__ */ jsx("span", {
							className: "text-xs opacity-60",
							children: a.bio
						}) : null,
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-danger text-xs ml-auto",
							onClick: () => setPendingDelete(a),
							children: "Entfernen"
						})
					]
				}, a.id))
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: pendingDelete !== null,
				title: `Autor „${pendingDelete?.name ?? ""}“ entfernen?`,
				message: "Bestehende Beiträge behalten die Byline nicht.",
				confirmLabel: "Entfernen",
				busy: deleting,
				onConfirm: () => void confirmRemove(),
				onCancel: () => setPendingDelete(null)
			}),
			importable.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 mt-3",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-sm",
						children: "Aus Panel-Nutzer:"
					}),
					/* @__PURE__ */ jsxs("select", {
						className: "field-boxed",
						value: pickedUser,
						onChange: (e) => setPickedUser(e.target.value),
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "— Nutzer wählen —"
						}), importable.map((u) => /* @__PURE__ */ jsx("option", {
							value: u.id,
							children: u.name ?? u.email
						}, u.id))]
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: importUser,
						disabled: pickedUser === "",
						children: "Als Autor übernehmen"
					})
				]
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-2 mt-2",
				children: [
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Name (Gast-Autor)"
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: bio,
						onChange: (e) => setBio(e.target.value),
						placeholder: "Kurzbio (optional)"
					}),
					/* @__PURE__ */ jsx("input", {
						className: "field-boxed",
						value: avatar,
						onChange: (e) => setAvatar(e.target.value),
						placeholder: "Avatar-URL (optional)"
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn btn-primary",
						type: "button",
						onClick: add,
						children: "Autor hinzufügen"
					})
				]
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "tds-alert tds-alert--danger",
				role: "alert",
				children: status
			}) : null
		]
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-ext-blog-cms/pages/Index.astro
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="tds-page"><div class="tds-page__head"><h1 class="tds-page__title">Blog-CMS</h1></div>${renderComponent($$result, "BlogsList", BlogsList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/islands/BlogsList.tsx",
		"client:component-export": "default"
	})}</section>`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/@tracht-digital-solutions/tds-ext-blog-cms/pages/Index.astro", void 0);
//#endregion
//#region node_modules/.tds-frontend/routes/blog.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Blog,
	file: () => $$file,
	url: () => void 0
});
var $$Blog = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog-CMS" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Page", $$Index, {})}` })}`;
}, "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/blog.astro", void 0);
var $$file = "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.tds-frontend/routes/blog.astro";
//#endregion
//#region \0virtual:astro:page:node_modules/.tds-frontend/routes/blog@_@astro
var page = () => blog_exports;
//#endregion
export { page };
