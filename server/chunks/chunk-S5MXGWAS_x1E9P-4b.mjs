import { jsx } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-S5MXGWAS.js
function Alert({ tone = "danger", children, className }) {
	if (children === null || children === void 0 || children === false || children === "") return null;
	const urgent = tone === "danger";
	return /* @__PURE__ */ jsx("p", {
		className: `tds-alert${tone === "neutral" ? "" : ` tds-alert--${tone}`} tds-appear${className ? ` ${className}` : ""}`,
		role: urgent ? "alert" : "status",
		children
	});
}
export { Alert as t };
