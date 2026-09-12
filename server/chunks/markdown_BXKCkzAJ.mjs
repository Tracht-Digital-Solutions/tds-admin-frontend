//#region node_modules/@tracht-digital-solutions/tds-shared/dist/markdown/index.js
function escapeHtml(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function safeHref(url) {
	const u = url.trim();
	return /^(https?:\/\/|mailto:|\/|#)/i.test(u) ? u : null;
}
function inlineMd(escaped) {
	return escaped.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`).replace(/\*\*([^*]+)\*\*/g, (_m, c) => `<strong>${c}</strong>`).replace(/(^|[^*])\*([^*]+)\*/g, (_m, pre, c) => `${pre}<em>${c}</em>`).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, text, url) => {
		const href = safeHref(url);
		return href ? `<a href="${href}" rel="noopener" target="_blank">${text}</a>` : m;
	});
}
function renderMarkdown(src) {
	const lines = src.replace(/\r\n/g, "\n").split("\n");
	const out = [];
	let inFence = false;
	let fenceBuf = [];
	let listBuf = [];
	let paraBuf = [];
	const flushList = () => {
		if (listBuf.length) {
			out.push(`<ul>${listBuf.map((li) => `<li>${inlineMd(escapeHtml(li))}</li>`).join("")}</ul>`);
			listBuf = [];
		}
	};
	const flushPara = () => {
		if (paraBuf.length) {
			out.push(`<p>${inlineMd(escapeHtml(paraBuf.join(" ")))}</p>`);
			paraBuf = [];
		}
	};
	for (const line of lines) {
		if (line.trim().startsWith("```")) {
			if (inFence) {
				out.push(`<pre><code>${escapeHtml(fenceBuf.join("\n"))}</code></pre>`);
				fenceBuf = [];
				inFence = false;
			} else {
				flushPara();
				flushList();
				inFence = true;
			}
			continue;
		}
		if (inFence) {
			fenceBuf.push(line);
			continue;
		}
		const heading = /^(#{1,4})\s+(.*)$/.exec(line);
		if (heading) {
			flushPara();
			flushList();
			const level = heading[1].length;
			out.push(`<h${level}>${inlineMd(escapeHtml(heading[2]))}</h${level}>`);
			continue;
		}
		const li = /^[-*]\s+(.*)$/.exec(line);
		if (li) {
			flushPara();
			listBuf.push(li[1]);
			continue;
		}
		if (line.trim() === "") {
			flushPara();
			flushList();
			continue;
		}
		flushList();
		paraBuf.push(line.trim());
	}
	if (inFence) out.push(`<pre><code>${escapeHtml(fenceBuf.join("\n"))}</code></pre>`);
	flushPara();
	flushList();
	return out.join("\n");
}
//#endregion
export { renderMarkdown as t };
