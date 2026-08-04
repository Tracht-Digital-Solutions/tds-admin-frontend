# Agent notes — tds-admin-frontend

The **admin frontend product** (`management.tracht-digital.de`). A standalone Astro app that
composes the shared core frontend **host** (`@tracht-digital-solutions/tds-core-frontend`)
with the **admin extension set**, at build time, into one static `dist/`. This repo owns
only the composition + deploy pipeline — the shell, base pages, and every feature live in
published packages.

> Read the root `C:\Projects\TDS-LP\CLAUDE.md` for the big picture and the shared gotchas,
> and `MIGRATION-STATUS.md` for how this product replaces the legacy `tds-admin`.

## Mental model

- **Everything is assembled at build time from GitHub Packages.** There is no app source
  here beyond `astro.config.mjs` + config:
  - `coreFrontendBase()` (host package `./astro`) `injectRoutes` the base pages — Dashboard,
    Login, Nutzer, Einstellungen, API-Wiki — plus the shell + pre-paint auth gate.
  - `frontendHost({ extensions })` (from `tds-frontend-contract-pkg`) injects each extension's route
    and folds its nav / widget / settings virtual modules into the composition.
  - `FRONTEND_TARGET=admin` selects the auth-hint key prefix (`tds_admin_*`), the brand suffix
    ("Panel"), and — since host 0.13.0 / tds-shared 0.15.0 — the **accent hue**: the host emits
    `<html data-frontend="admin">` and `surfaces/panel.css` paints this product in the brand
    **navy** (the customer portal reads teal). That is the only visual difference between the
    two products; it is one token block in tds-shared, not anything this repo configures.
- **The extension set is this repo's only real decision:** time-tracker, support-tickets,
  contact-tickets, live-chat-cta, website-cms, blog-cms, lexware, customers, billing.
  Adding/removing a feature = change the `extensions` array + its dep, bump, release.
- **To change the shell or a base page, edit the *host* package and release it, then repin
  the dep here.** Never fork base UI into this repo.

## Gotchas

- **The toast stack is the host's, and there is exactly one.** The shell mounts
  `ToastHost` (tds-shared) once; extensions only *raise* toasts. If a page ever
  shows every message twice, something mounted a second host — that is the first
  thing to check. Requires tds-shared `^0.16.0` + host `^0.14.0`, which is why
  those two pins moved together: a `0.x` caret is minor-locked, so `^0.15.0`
  would have kept resolving the toast-less build.
- **`npm install --no-package-lock`** — the Windows-generated lockfile is win32-only and
  breaks the Linux CI build (`npm ci` fails). CI uses `--no-package-lock`; match it locally.
- **Host pins each extension `^0.1.x`** (0.x caret = `>=0.1.1 <0.2.0`) — an extension bump
  the product should pick up must stay in the `0.1.x` line. To jump an ext to `0.2.x`, bump
  the dep range here first.
- **`@source` in the host's `global.css` makes Tailwind scan the extension packages** for
  utility classes (node_modules is ignored by default). It's in the host, not here — don't
  add a competing `@source`, but know that ext-only utilities depend on it.
- **`PACKAGE_TOKEN`** (classic PAT, `read:packages` + repo, SSO'd) is required to install the
  host + extensions from Packages and to push the deploy branch. `DEPLOY_WEBHOOK_URL` is
  optional (unset ⇒ the `release` branch still publishes, the host just isn't pinged).

## Build & deploy

```bash
npm install --no-package-lock   # host + extensions from GitHub Packages (needs NPM_TOKEN)
npm run dev                     # astro dev
npm run build                   # → dist/  (FRONTEND_TARGET=admin)
```

- **`dev` branch** — auto-built on every push to `main` (`dev.yml`); staging artifact, not
  deployed.
- **`release` branch** — the manual Actions button (`release.yml`): builds, force-pushes
  `dist/` to `release`, pings `DEPLOY_WEBHOOK_URL`. The production host pulls `release`.

## Tests

`npm run test:run` (vitest). This repo has no `src/` — its whole job is one
composition decision, so `test/composition.test.ts` tests that decision against
the **real installed extension manifests**, not fixtures.

- `composeExtensions()` runs over the actual admin set and must not throw. It
  hard-errors on any duplicate extension id, nav id, widget id or route — the FE
  twin of the shared-`phinxlog` rule — but normally only during a full product
  build, far from whoever introduced the collision.
- Every nav entry must target a route some extension or the host actually
  serves, or it is a 404 in the shipped panel. No extension route may shadow a
  base route (`/`, `/users`, `/einstellungen`, `/wiki`).
- **`frontendHost` must keep its `layout` option.** Dropping it ships every
  extension page as a bare unstyled fragment with no `<head>` — the documented
  "admin frontend has no formatting" bug. Verified: removing it fails the suite.
- The build stays `output: "static"`, Tailwind stays on PostCSS, `tdsViteBuild`
  stays spread, and `FRONTEND_TARGET` stays `admin` on **both** env vars.
- Imports, `dependencies` and the array handed to `frontendHost` must agree in
  all three directions. A missing dependency works locally via hoisted
  `node_modules` and fails only the clean CI install; an import that never
  reaches the array is a silently missing feature.

Adding an extension therefore means three edits — the import, the `extensions`
array and `dependencies` — and the suite fails if you miss one.

## Version

Bump `package.json` `version` on any composition/config/doc change, and commit the docs +
version with the code (see the root `CLAUDE.md` "After every task").
