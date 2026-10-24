import { useEffect, useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// node_modules/@tracht-digital-solutions/tds-shared/dist/dropzone/index.js
function matchesAccept(file, accept) {
	const tokens = (accept ?? "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
	if (tokens.length === 0) return true;
	const type = (file.type || "").toLowerCase();
	const name = file.name.toLowerCase();
	return tokens.some((t) => {
		if (t.startsWith(".")) return name.endsWith(t);
		if (t.endsWith("/*")) return type.startsWith(t.slice(0, -1));
		return type === t;
	});
}
function partitionFiles(files, accept, multiple = false) {
	const accepted = [];
	const rejected = [];
	for (const f of files) (matchesAccept(f, accept) ? accepted : rejected).push(f);
	return {
		accepted: multiple ? accepted : accepted.slice(0, 1),
		rejected
	};
}
function carriesFiles(e) {
	return Array.from(e.dataTransfer?.types ?? []).includes("Files");
}
function UploadIcon() {
	return /* @__PURE__ */ jsxs("svg", {
		className: "tds-dropzone__icon",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.75",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("path", { d: "M12 15V4" }),
			/* @__PURE__ */ jsx("path", { d: "m7.5 8.5 4.5-4.5 4.5 4.5" }),
			/* @__PURE__ */ jsx("path", { d: "M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" })
		]
	});
}
function summarise(names) {
	if (names.length <= 3) return names.join(", ");
	return `${names.slice(0, 3).join(", ")} +${names.length - 3}`;
}
function FileDropZone({ label, hint, activeLabel, accept, multiple = false, disabled = false, paste = false, onFiles, onReject, className, children }) {
	const [over, setOver] = useState(false);
	const [pageDrag, setPageDrag] = useState(false);
	const [dropped, setDropped] = useState(false);
	const [names, setNames] = useState([]);
	const hintId = useId();
	const zone = useRef(null);
	const latest = useRef({
		onFiles,
		onReject,
		accept,
		multiple,
		disabled
	});
	latest.current = {
		onFiles,
		onReject,
		accept,
		multiple,
		disabled
	};
	const take = (list) => {
		const { onFiles: give, onReject: refuse, accept: acc, multiple: many, disabled: off } = latest.current;
		if (off || list.length === 0) return;
		const { accepted, rejected } = partitionFiles(list, acc, many);
		if (rejected.length) refuse?.(rejected);
		if (accepted.length === 0) return;
		setNames(accepted.map((f) => f.name));
		setDropped(true);
		give(accepted);
	};
	useEffect(() => {
		let depth = 0;
		const enter = (e) => {
			if (!carriesFiles(e)) return;
			depth++;
			setPageDrag(true);
		};
		const leave = (e) => {
			if (!carriesFiles(e)) return;
			depth = Math.max(0, depth - 1);
			if (depth === 0) setPageDrag(false);
		};
		const end = () => {
			depth = 0;
			setPageDrag(false);
			setOver(false);
		};
		const overDoc = (e) => {
			if (carriesFiles(e)) e.preventDefault();
		};
		const dropDoc = (e) => {
			if (carriesFiles(e)) e.preventDefault();
			end();
		};
		document.addEventListener("dragenter", enter);
		document.addEventListener("dragleave", leave);
		document.addEventListener("dragover", overDoc);
		document.addEventListener("drop", dropDoc);
		document.addEventListener("dragend", end);
		return () => {
			document.removeEventListener("dragenter", enter);
			document.removeEventListener("dragleave", leave);
			document.removeEventListener("dragover", overDoc);
			document.removeEventListener("drop", dropDoc);
			document.removeEventListener("dragend", end);
		};
	}, []);
	useEffect(() => {
		const el = zone.current;
		if (!el) return;
		const done = (e) => {
			if (e.target === el) setDropped(false);
		};
		el.addEventListener("animationend", done);
		return () => el.removeEventListener("animationend", done);
	}, []);
	useEffect(() => {
		if (!paste) return;
		const onPaste = (e) => {
			if (e.target?.closest?.("input:not([type=file]), textarea, [contenteditable]")) return;
			const files = Array.from(e.clipboardData?.files ?? []);
			if (files.length === 0) return;
			e.preventDefault();
			take(files);
		};
		document.addEventListener("paste", onPaste);
		return () => document.removeEventListener("paste", onPaste);
	}, [paste]);
	const classes = ["tds-dropzone", className].filter(Boolean).join(" ");
	return /* @__PURE__ */ jsx("div", {
		ref: zone,
		className: classes,
		"data-over": over || void 0,
		"data-page-drag": pageDrag && !disabled || void 0,
		"data-dropped": dropped || void 0,
		"data-disabled": disabled || void 0,
		onDragEnter: (e) => {
			if (!carriesFiles(e) || disabled) return;
			e.preventDefault();
			setOver(true);
		},
		onDragOver: (e) => {
			if (!carriesFiles(e) || disabled) return;
			e.preventDefault();
			e.dataTransfer.dropEffect = "copy";
			setOver(true);
		},
		onDragLeave: (e) => {
			if (!zone.current?.contains(e.relatedTarget)) setOver(false);
		},
		onDrop: (e) => {
			e.preventDefault();
			setOver(false);
			setPageDrag(false);
			take(Array.from(e.dataTransfer?.files ?? []));
		},
		children: /* @__PURE__ */ jsxs("label", {
			className: "tds-dropzone__body",
			children: [
				/* @__PURE__ */ jsx(UploadIcon, {}),
				/* @__PURE__ */ jsx("span", {
					className: "tds-dropzone__title",
					children: over && activeLabel ? activeLabel : label
				}),
				hint && /* @__PURE__ */ jsx("span", {
					id: hintId,
					className: "tds-dropzone__hint",
					children: hint
				}),
				names.length > 0 && /* @__PURE__ */ jsx("span", {
					className: "tds-dropzone__files",
					"aria-live": "polite",
					children: summarise(names)
				}),
				/* @__PURE__ */ jsx("input", {
					type: "file",
					className: "tds-dropzone__input",
					"aria-label": label,
					"aria-describedby": hint ? hintId : void 0,
					accept,
					multiple,
					disabled,
					onChange: (e) => {
						take(Array.from(e.target.files ?? []));
						e.target.value = "";
					}
				}),
				children
			]
		})
	});
}
export { FileDropZone as t };
