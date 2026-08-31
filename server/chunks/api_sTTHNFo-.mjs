var RUNTIME_CONFIG_PATH = "/tds-runtime.json";
var STATE_KEY = /* @__PURE__ */ Symbol.for("@tracht-digital-solutions/tds-shared:api-state");
var state = (() => {
	const host = globalThis;
	const existing = host[STATE_KEY];
	if (existing !== void 0) return existing;
	const fresh = {
		cached: null,
		runtimePromise: null,
		runtimeValue: null,
		onUnauthorized: null,
		headersProvider: null
	};
	host[STATE_KEY] = fresh;
	return fresh;
})();
var trimEnd = (value) => value.replace(/\/+$/, "");
function apiBase() {
	if (state.cached !== null) return state.cached;
	const env = typeof import.meta !== "undefined" ? Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_FRONTEND_TARGET": "admin",
		"SITE": void 0,
		"SSR": true
	}, {
		_: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm",
		PATH: "/home/runner/work/tds-admin-frontend/tds-admin-frontend/node_modules/.bin:/home/runner/work/tds-admin-frontend/node_modules/.bin:/home/runner/work/node_modules/.bin:/home/runner/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/opt/hostedtoolcache/node/22.23.2/x64/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/opt/hostedtoolcache/node/22.23.2/x64/bin:/snap/bin:/home/runner/.local/bin:/opt/pipx_bin:/home/runner/.cargo/bin:/home/runner/.config/composer/vendor/bin:/usr/local/.ghcup/bin:/home/runner/.dotnet/tools:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
	})?.PUBLIC_API_BASE ?? "" : "";
	if (typeof document === "undefined") return trimEnd(env || "https://api.tracht-digital.de");
	let meta = "";
	try {
		meta = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	state.cached = trimEnd(meta.trim() || env || "https://api.tracht-digital.de");
	return state.cached;
}
async function runtimeConfig() {
	if (state.runtimePromise !== null) return state.runtimePromise;
	if (typeof document === "undefined" || typeof fetch !== "function") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	let declared = "";
	try {
		declared = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	if (declared.trim() !== "") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	state.runtimePromise = (async () => {
		try {
			const res = await fetch(RUNTIME_CONFIG_PATH, {
				credentials: "same-origin",
				headers: { Accept: "application/json" },
				signal: typeof AbortSignal?.timeout === "function" ? AbortSignal.timeout(3e3) : void 0
			});
			if (!res.ok) return null;
			if (!(res.headers.get("content-type") ?? "").includes("json")) return null;
			const parsed = await res.json();
			if (parsed === null || typeof parsed !== "object") return null;
			const config = parsed;
			if (typeof config.apiBase === "string" && config.apiBase !== "") state.cached = trimEnd(config.apiBase);
			state.runtimeValue = config;
			return config;
		} catch {
			return null;
		}
	})();
	return state.runtimePromise;
}
function apiUrl(path) {
	if (/^(https?:)?\/\//i.test(path)) return path;
	return `${apiBase()}${path.startsWith("/") ? "" : "/"}${path}`;
}
async function apiFetch(path, init = {}) {
	await runtimeConfig();
	const url = apiUrl(path);
	let extra = {};
	if (state.headersProvider !== null) try {
		extra = state.headersProvider(url);
	} catch {}
	const res = await fetch(url, {
		credentials: "include",
		...init,
		headers: {
			...extra,
			...init.headers
		}
	});
	if (res.status === 401 && state.onUnauthorized !== null) try {
		await state.onUnauthorized(url);
	} catch {}
	return res;
}
//#endregion
export { apiUrl as n, apiFetch as t };
