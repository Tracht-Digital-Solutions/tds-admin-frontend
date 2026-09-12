//#region node_modules/@tracht-digital-solutions/tds-shared/dist/toast/index.js
var SEMANTIC_CHIP_VARIANTS = [
	"neutral",
	"success",
	"warning",
	"danger",
	"info"
];
var CATEGORICAL_CHIP_VARIANTS = [
	"cat-violet",
	"cat-teal",
	"cat-amber",
	"cat-rose",
	"cat-cyan"
];
var CHIP_VARIANTS = [...SEMANTIC_CHIP_VARIANTS, ...CATEGORICAL_CHIP_VARIANTS];
new Set(CHIP_VARIANTS);
var TOAST_VARIANT_SET = /* @__PURE__ */ new Set([
	"success",
	"warning",
	"danger",
	"info"
]);
function resolveToastVariant(variant, fallback = "info") {
	const key = (variant ?? "").trim().toLowerCase();
	return TOAST_VARIANT_SET.has(key) ? key : fallback;
}
var TOAST_EVENT = "tds:toast";
function showToast(detail) {
	if (typeof window === "undefined") return;
	const w = window;
	const normalised = {
		...detail,
		variant: resolveToastVariant(detail.variant)
	};
	try {
		w.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: normalised }));
	} catch {}
	try {
		if (!w.__tdsToastReady) (w.__tdsToastQueue ??= []).push(normalised);
	} catch {}
}
var raise = (variant) => (message, opts = {}) => showToast({
	...opts,
	variant,
	message
});
var toast = {
	success: raise("success"),
	warning: raise("warning"),
	danger: raise("danger"),
	info: raise("info")
};
//#endregion
export { toast as t };
