# tds-admin-frontend

The **admin frontend** product (`management.tracht-digital.de`). A standalone Astro
app that composes the shared **core frontend host**
(`@tracht-digital-solutions/tds-core-frontend`) with the **admin extension
set**. Deployed from this repo's own `dev` / `release` branches.

## How it works

The whole frontend is assembled at build time from published packages — this repo
owns only the composition + deploy pipeline:

- `astro.config.mjs`:
  - `coreFrontendBase()` (from the host package) injects the shared base routes —
    Dashboard, Login, Benutzer, Einstellungen, `/wiki` (API-Referenz here) + the shell/auth gate.
  - `frontendHost({ extensions })` (from `tds-frontend-contract-pkg`) injects each
    extension's route + the widget/settings virtual modules.
  - `FRONTEND_TARGET = admin` selects the shell's auth-hint key + brand ("Panel").
- The host keeps the shell mounted across internal navigation, prefetches likely
  destinations and preserves the selected theme + drawer state. CMS screens use
  the shared stale-while-revalidate cache: known old values remain visible but are
  dimmed and marked as refreshing until the API answers.
- The extension set (this repo's only real decision): time-tracker,
  support-tickets, contact-tickets, website-cms, blog-cms, lexware, customers,
  billing, projects, documents, messages, live-chat-cta and tools.

To add/remove a feature: change the `extensions` array + the matching dep, bump,
release. To change the shell/base pages: edit the **host** package and release it,
then repin here.

> **Full provisioning:** `INSTALL.md` is the step-by-step runbook that stands up the
> whole system (database → identity → frontend-API → gateway → build/deploy → config →
> tools platform → adding extensions).

## Develop

```bash
npm install --no-package-lock   # host + extensions from GitHub Packages (needs NPM_TOKEN)
npm run dev                     # astro dev
npm run type-check              # release/ is excluded: it is generated output
npm run build                   # → dist/, then postbuild packs release/
cd release && node app.cjs      # run the deployable tree exactly as the host does
```

## Deploy

- **`dev` branch** — auto-built on every push to `main` (`dev.yml`), not deployed.
- **`release` branch** — the manual button (`release.yml`) builds the server
  application, force-pushes `release/` and pings `DEPLOY_WEBHOOK_URL`.

Production deploys are deliberately manual because `release/` is a running Node
application (`app.cjs`, `server/`, `client/`, prebuilt `node_modules/`), not a
folder of static files.

Secrets: `PACKAGE_TOKEN` (install from Packages + push the branch),
`DEPLOY_WEBHOOK_URL` (optional; unset ⇒ the branch still publishes, no host ping).
