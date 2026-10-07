# Build and deployment

## Server-rendered Node application

The build is `output: "server"` with the Node adapter. Tailwind stays on PostCSS,
`tdsViteBuild` stays spread, and `FRONTEND_TARGET` stays on **both** env vars.

Invariants, each failing silently without it (the test suite pins them):

- **`vite.ssr.noExternal` covers `@tracht-digital-solutions/`.** The production host has no
  GitHub Packages token, so a first-party specifier left in the server bundle is
  `ERR_MODULE_NOT_FOUND` at boot. `pack-release.mjs`'s `verify()` fails the build on one.
- **No page cache, ever.** A panel page belongs to one visitor; `tds-shared/cache` refuses a
  response with `Set-Cookie` and can't key on identity. Only the public sites use it.
- **`passthroughImageService()`**, because Astro's default image service is sharp, a native addon
  nothing here needs.
- **`public/.htaccess` never gets `Options +FollowSymLinks`.** Plesk's AllowOverride grant omits
  it, and a disallowed option is fatal: Apache answers every request with 500.
- **`tsconfig.json` excludes `release/`.** `postbuild` writes a complete application with bundled
  dependencies there; `astro check` would report errors from generated code.

## Branches and workflows

| Branch | Workflow | Result |
|---|---|---|
| `dev` | `dev.yml` on every push to `main` | Staging build artifact, **not deployed** |
| `release` | `release.yml`, manual button | Builds, force-pushes `release/` to `release`, pings `DEPLOY_WEBHOOK_URL`; production pulls `release` |

- **The deployed branch is an application, not a folder of files.** `release` carries `app.cjs`,
  `server/`, `client/` (the document root) and a prebuilt `node_modules`. Pushed at a domain still
  configured for static serving, it takes the panel down on every path. That is why `release.yml`
  has no push trigger and other repos may only dispatch `dev.yml` here.
- After a deploy the Node app needs a restart on the host.
- **The vhost SPA fallback (`try_files … /index.html`) must be gone.** Left in place, it answers
  every unmatched path, including mis-resolved relative API calls, with 200 and dashboard HTML:
  the calm-permanent-empty-list bug.

## Secrets

- `PACKAGE_TOKEN` (classic PAT, `read:packages` + repo, SSO-authorised) installs the host and
  extensions and pushes the deploy branch.
- `DEPLOY_WEBHOOK_URL` is optional; unset, the `release` branch still publishes but the host isn't
  pinged.

Host setup: [INSTALL.md](../../INSTALL.md).

## Version

The product version in `package.json` is bumped by hand with composition or config changes.
