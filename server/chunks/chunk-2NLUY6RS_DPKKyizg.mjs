import "react";
// node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-2NLUY6RS.js
async function copyText(text) {
	try {
		if (!navigator.clipboard?.writeText) throw new Error("no async clipboard");
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const ta = document.createElement("textarea");
		try {
			ta.value = text;
			ta.setAttribute("readonly", "");
			ta.style.position = "fixed";
			ta.style.opacity = "0";
			document.body.appendChild(ta);
			ta.select();
			return document.execCommand("copy");
		} catch {
			return false;
		} finally {
			ta.remove();
		}
	}
}
export { copyText as t };
