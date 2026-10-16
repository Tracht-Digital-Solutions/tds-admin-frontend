import { $ as _coercedDate, G as array, J as literal, K as boolean, Q as union, U as ZodDate, W as _enum, X as object, Y as number, Z as string, q as discriminatedUnion } from "./server_D5Yed9jg.mjs";
import { n as PORTAL_PERMISSIONS, t as PERMISSION_KEY_PATTERN } from "./chunk-N6TATNUU_C8MXdYR4.mjs";
//#region node_modules/zod/v4/classic/coerce.js
function date(params) {
	return _coercedDate(ZodDate, params);
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/schemas/index.js
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
var ALLOWED_SCHEMES = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function isSafeHref(value) {
	const trimmed = value.trim();
	if (trimmed === "") return false;
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		return false;
	}
	return ALLOWED_SCHEMES.includes(url.protocol);
}
var SafeHref = string().max(600).refine((v) => v.trim() === "" || isSafeHref(v), { message: "href" });
var LinkItem = object({
	label: string().max(120),
	href: SafeHref,
	/** One short line under the label, e.g. "Mo–Fr, 8–17 Uhr". */
	note: string().max(160).optional().nullable(),
	/**
	* Which glyph the renderer draws. A closed vocabulary, not a free string:
	* an icon name the renderer does not know renders as nothing at all, and the
	* editor should not be able to produce that state.
	*/
	icon: _enum([
		"link",
		"phone",
		"mail",
		"map",
		"calendar",
		"download",
		"shop",
		"chat"
	]).optional().nullable()
});
var LinksBlock = object({
	type: literal("links"),
	/** Optional heading above the group. */
	label: string().max(120).optional().nullable(),
	items: array(LinkItem).max(30)
});
var HeadingBlock2 = object({
	type: literal("heading"),
	text: string().max(160)
});
var TextBlock = object({
	type: literal("text"),
	text: string().max(2e3)
});
var DividerBlock2 = object({ type: literal("divider") });
var HoursRow = object({
	/** "Mo–Do" — free text, because business reality does not fit an enum. */
	days: string().max(60),
	/** "08:00–17:00" or "geschlossen". */
	time: string().max(60)
});
var HoursBlock = object({
	type: literal("hours"),
	label: string().max(120).optional().nullable(),
	rows: array(HoursRow).max(14)
});
var SocialItem = object({
	network: _enum([
		"linkedin",
		"xing",
		"instagram",
		"facebook",
		"youtube",
		"github",
		"whatsapp",
		"website"
	]),
	href: SafeHref
});
var SocialsBlock = object({
	type: literal("socials"),
	items: array(SocialItem).max(12)
});
var CardBlockSchema = discriminatedUnion("type", [
	LinksBlock,
	HeadingBlock2,
	TextBlock,
	HoursBlock,
	SocialsBlock,
	DividerBlock2
]);
object({
	version: literal(1),
	blocks: array(CardBlockSchema).max(60)
});
function emptyCardDocument() {
	return {
		version: 1,
		blocks: [{
			type: "links",
			label: null,
			items: []
		}]
	};
}
var CARD_BLOCK_CATALOG = [
	{
		id: "links",
		label: "Linkgruppe",
		hint: "Beschriftete Links untereinander.",
		block: {
			type: "links",
			label: null,
			items: [{
				label: "",
				href: "",
				icon: "link"
			}]
		}
	},
	{
		id: "heading",
		label: "Überschrift",
		hint: "Trennt zwei Bereiche der Karte.",
		block: {
			type: "heading",
			text: ""
		}
	},
	{
		id: "text",
		label: "Text",
		hint: "Ein kurzer Absatz.",
		block: {
			type: "text",
			text: ""
		}
	},
	{
		id: "hours",
		label: "Öffnungszeiten",
		hint: "Tage und Zeiten als Tabelle.",
		block: {
			type: "hours",
			label: null,
			rows: [{
				days: "",
				time: ""
			}]
		}
	},
	{
		id: "socials",
		label: "Profile",
		hint: "Symbole für Netzwerke.",
		block: {
			type: "socials",
			items: [{
				network: "linkedin",
				href: ""
			}]
		}
	},
	{
		id: "divider",
		label: "Trennlinie",
		hint: "Nur eine Linie.",
		block: { type: "divider" }
	}
];
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
	subject: string().max(200).optional(),
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
	permissions: array(PermissionKeySchema).max(128).default([]),
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
	permissionDenies: array(PermissionKeySchema).max(128).default([])
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
	permissions: array(PermissionKeySchema).max(128).default([]),
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
	permissions: array(PermissionKeySchema).max(128).optional(),
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
export { emptyCardDocument as n, emptyPlacement as r, CARD_BLOCK_CATALOG as t };
