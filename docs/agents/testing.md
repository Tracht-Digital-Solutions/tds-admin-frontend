# Testing

`npm run test:run` runs vitest. There is no `src/`; `test/composition.test.ts` tests the
composition against the **real installed extension manifests**, not fixtures.

| Assertion | Why |
|---|---|
| `composeExtensions()` over the actual admin set doesn't throw | It fails hard on duplicate extension, nav, widget or route ids, normally only in a full product build far from the cause |
| Every nav entry targets a served route | Otherwise it's a 404 in the shipped panel |
| No extension route shadows a base route (`/`, `/users`, `/firma`, `/profil`, `/module`, `/einstellungen`, `/wiki`) | Base pages come from `BASE_ROUTE_PATTERNS` |
| `frontendHost` keeps its `layout` option | Without it every extension page ships as a bare fragment with no `<head>` |
| Imports, `dependencies` and the `extensions` array agree in all three directions | A missing dependency works locally via hoisting and fails only the clean CI install; an import missing from the array is a silently absent feature |
| SSR invariants (`noExternal`, no page cache, passthrough images, `.htaccess`) | See [deployment.md](deployment.md) |
