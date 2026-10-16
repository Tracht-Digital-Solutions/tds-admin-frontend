import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-ext-analytics/islands/charts.tsx
var W = 600;
/** Day series as an area chart. `aria-label` carries the numbers a sighted reader gets from the shape. */
function AreaChart({ points, secondary, label, height = 160 }) {
	if (points.length === 0) return null;
	const max = Math.max(1, ...points.map((p) => p.value), ...(secondary ?? []).map((p) => p.value));
	const step = points.length > 1 ? W / (points.length - 1) : W;
	const y = (v) => height - 4 - v / max * (height - 12);
	const line = (ps) => ps.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
	const area = `${line(points)} L${((points.length - 1) * step).toFixed(1)},${height} L0,${height} Z`;
	const first = points[0];
	const last = points[points.length - 1];
	return /* @__PURE__ */ jsxs("figure", {
		className: "tds-stack tds-stack--tight",
		children: [/* @__PURE__ */ jsxs("svg", {
			viewBox: `0 0 ${W} ${height}`,
			preserveAspectRatio: "none",
			width: "100%",
			height,
			role: "img",
			"aria-label": label,
			children: [
				/* @__PURE__ */ jsx("title", { children: label }),
				[
					.25,
					.5,
					.75
				].map((f) => /* @__PURE__ */ jsx("line", {
					x1: "0",
					x2: W,
					y1: y(max * f),
					y2: y(max * f),
					stroke: "var(--color-line)",
					strokeWidth: "1",
					vectorEffect: "non-scaling-stroke"
				}, f)),
				/* @__PURE__ */ jsx("path", {
					d: area,
					fill: "color-mix(in srgb, var(--color-primary) 14%, transparent)"
				}),
				/* @__PURE__ */ jsx("path", {
					d: line(points),
					fill: "none",
					stroke: "var(--color-primary)",
					strokeWidth: "2",
					vectorEffect: "non-scaling-stroke",
					strokeLinejoin: "round"
				}),
				secondary ? /* @__PURE__ */ jsx("path", {
					d: line(secondary),
					fill: "none",
					stroke: "var(--color-info)",
					strokeWidth: "1.5",
					strokeDasharray: "4 4",
					vectorEffect: "non-scaling-stroke"
				}) : null
			]
		}), /* @__PURE__ */ jsxs("figcaption", {
			className: "tds-row tds-row--between marginalia",
			children: [
				/* @__PURE__ */ jsx("span", { children: shortDay(first.label) }),
				/* @__PURE__ */ jsxs("span", { children: ["max. ", max.toLocaleString("de-DE")] }),
				/* @__PURE__ */ jsx("span", { children: shortDay(last.label) })
			]
		})]
	});
}
function Sparkline({ values, label }) {
	if (values.length < 2) return null;
	const h = 36;
	const max = Math.max(1, ...values);
	const step = 120 / (values.length - 1);
	const d = values.map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(34 - v / max * 30).toFixed(1)}`).join(" ");
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: `0 0 120 ${h}`,
		width: "120",
		height: h,
		role: "img",
		"aria-label": label,
		children: [/* @__PURE__ */ jsx("title", { children: label }), /* @__PURE__ */ jsx("path", {
			d,
			fill: "none",
			stroke: "var(--tds-widget-hue, var(--color-primary))",
			strokeWidth: "2",
			strokeLinejoin: "round"
		})]
	});
}
/**
* A ranked list with a proportional bar behind each row. A list, not a table:
* it reads top-down on a phone without a horizontal scroller.
*/
function BarList({ rows, empty, max }) {
	if (rows.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "tds-empty",
		children: empty
	});
	const top = max ?? Math.max(1, ...rows.map((r) => r.value));
	return /* @__PURE__ */ jsx("ul", {
		className: "tds-list",
		children: rows.map((r) => /* @__PURE__ */ jsx("li", {
			className: "tds-list__row",
			children: /* @__PURE__ */ jsxs("span", {
				className: "tds-stack tds-stack--tight",
				style: {
					flex: "1 1 100%",
					minWidth: 0
				},
				children: [/* @__PURE__ */ jsxs("span", {
					className: "tds-row tds-row--between",
					children: [/* @__PURE__ */ jsx("span", {
						style: { overflowWrap: "anywhere" },
						children: r.label
					}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: r.value.toLocaleString("de-DE") }), r.hint ? /* @__PURE__ */ jsxs("span", {
						className: "marginalia",
						children: [" · ", r.hint]
					}) : null] })]
				}), /* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					style: {
						display: "block",
						height: "0.375rem",
						borderRadius: "999px",
						background: "color-mix(in srgb, var(--color-primary) 12%, transparent)"
					},
					children: /* @__PURE__ */ jsx("span", { style: {
						display: "block",
						height: "100%",
						width: `${Math.max(2, Math.min(100, r.value / top * 100)).toFixed(1)}%`,
						borderRadius: "999px",
						background: "var(--color-primary)"
					} })
				})]
			})
		}, r.key))
	});
}
function shortDay(day) {
	const [, m, d] = day.split("-");
	return d && m ? `${d}.${m}.` : day;
}
//#endregion
export { BarList as n, Sparkline as r, AreaChart as t };
