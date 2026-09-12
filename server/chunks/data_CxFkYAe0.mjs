import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/data/index.js
var API_BASE_META = "tds-api-base";
var DEFAULT_API_BASE = "https://api.tracht-digital.de";
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
	if (typeof document === "undefined") return trimEnd(env || DEFAULT_API_BASE);
	let meta = "";
	try {
		meta = document.querySelector(`meta[name="${API_BASE_META}"]`)?.getAttribute("content") ?? "";
	} catch {}
	state.cached = trimEnd(meta.trim() || env || DEFAULT_API_BASE);
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
		declared = document.querySelector(`meta[name="${API_BASE_META}"]`)?.getAttribute("content") ?? "";
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
var DEFAULT_STALE_TIME = 3e4;
var entries = /* @__PURE__ */ new Map();
var inflight = /* @__PURE__ */ new Map();
var errors = /* @__PURE__ */ new Map();
var subscribers = /* @__PURE__ */ new Map();
var invalidated = /* @__PURE__ */ new Set();
var versions = /* @__PURE__ */ new Map();
var epochs = /* @__PURE__ */ new Map();
function bump(key) {
	versions.set(key, (versions.get(key) ?? 0) + 1);
	const set = subscribers.get(key);
	if (set) for (const fn of [...set]) fn();
}
function bumpEpoch(key) {
	epochs.set(key, (epochs.get(key) ?? 0) + 1);
	bump(key);
}
function subscribe(key, listener) {
	let set = subscribers.get(key);
	if (!set) {
		set = /* @__PURE__ */ new Set();
		subscribers.set(key, set);
	}
	set.add(listener);
	return () => {
		set.delete(listener);
		if (set.size === 0) subscribers.delete(key);
	};
}
function invalidate(prefix) {
	const keys = prefix === void 0 ? [...entries.keys()] : [...entries.keys()].filter((k) => k.startsWith(prefix));
	const listening = prefix === void 0 ? [...subscribers.keys()] : [...subscribers.keys()].filter((k) => k.startsWith(prefix));
	for (const key of /* @__PURE__ */ new Set([...keys, ...listening])) {
		errors.delete(key);
		inflight.delete(key);
		invalidated.add(key);
		bumpEpoch(key);
	}
}
function revalidate(key, fetcher) {
	const existing = inflight.get(key);
	if (existing) return existing;
	const request = fetcher().then((value) => {
		if (inflight.get(key) === request) {
			inflight.delete(key);
			entries.set(key, {
				value,
				at: Date.now()
			});
			errors.delete(key);
			invalidated.delete(key);
			bump(key);
		}
		return value;
	}).catch((cause) => {
		if (inflight.get(key) === request) {
			inflight.delete(key);
			errors.set(key, cause instanceof Error ? cause : new Error(String(cause)));
			bump(key);
		}
		throw cause;
	});
	inflight.set(key, request);
	bump(key);
	return request;
}
function useCachedResource(key, fetcher, options = {}) {
	const { staleTime = DEFAULT_STALE_TIME, enabled = true } = options;
	const fetcherRef = useRef(fetcher);
	fetcherRef.current = fetcher;
	const [nonce, setNonce] = useState(0);
	const listen = useCallback((listener) => key === null ? () => {} : subscribe(key, listener), [key]);
	const zero = useCallback(() => 0, []);
	const version = useSyncExternalStore(listen, () => key === null ? 0 : versions.get(key) ?? 0, zero);
	const epoch = useSyncExternalStore(listen, () => key === null ? 0 : epochs.get(key) ?? 0, zero);
	const active = key !== null && enabled;
	useEffect(() => {
		if (!active || key === null) return;
		const entry2 = entries.get(key);
		if (nonce === 0 && !invalidated.has(key) && entry2 !== void 0 && Date.now() - entry2.at < staleTime) return;
		revalidate(key, fetcherRef.current).catch(() => {});
	}, [
		active,
		key,
		staleTime,
		nonce,
		epoch
	]);
	const hasClientSnapshot = version !== 0;
	const entry = key === null || !hasClientSnapshot ? void 0 : entries.get(key);
	const pending = key !== null && hasClientSnapshot && inflight.has(key);
	const refresh = useCallback(() => {
		if (key !== null) inflight.delete(key);
		setNonce((n) => n + 1);
	}, [key]);
	return {
		data: entry?.value,
		stale: pending && entry !== void 0,
		loading: pending && entry === void 0,
		error: key === null || !hasClientSnapshot ? null : errors.get(key) ?? null,
		refresh
	};
}
var ApiError = class extends Error {
	constructor(status, path) {
		super(`HTTP ${status} für ${path}`);
		this.status = status;
		this.path = path;
		this.name = "ApiError";
	}
	status;
	path;
};
function useCachedJson(path, options = {}) {
	return useCachedResource(path, async () => {
		const res = await apiFetch(path);
		if (!res.ok) throw new ApiError(res.status, path);
		return await res.json();
	}, options);
}
function staleClass(stale, base = "") {
	return stale ? `${base} tds-stale`.trim() : base;
}
//#endregion
export { staleClass as n, useCachedJson as r, invalidate as t };
