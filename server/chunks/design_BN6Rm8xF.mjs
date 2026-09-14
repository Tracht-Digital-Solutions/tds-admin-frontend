//#region node_modules/@tracht-digital-solutions/tds-shared/dist/design/index.js
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
var CHIP_ALIASES = {
	violet: "cat-violet",
	purple: "cat-violet",
	teal: "cat-teal",
	green: "success",
	amber: "cat-amber",
	orange: "cat-amber",
	yellow: "warning",
	rose: "cat-rose",
	pink: "cat-rose",
	red: "danger",
	cyan: "cat-cyan",
	blue: "info",
	grey: "neutral",
	gray: "neutral"
};
var VARIANT_SET = new Set(CHIP_VARIANTS);
function resolveChipVariant(color, fallback = "neutral") {
	const key = (color ?? "").trim().toLowerCase();
	if (VARIANT_SET.has(key)) return `chip--${key}`;
	const aliased = CHIP_ALIASES[key];
	if (aliased) return `chip--${aliased}`;
	return `chip--${fallback}`;
}
//#endregion
export { resolveChipVariant as t };
