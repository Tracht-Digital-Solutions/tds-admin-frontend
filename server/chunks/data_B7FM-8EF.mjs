import { D as apiFetch } from "./Layout_kCpQGkaf.mjs";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/data/index.js
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
		super(`HTTP ${status} f\xFCr ${path}`);
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
