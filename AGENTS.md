# AGENTS.md — tds-admin-frontend

The **admin frontend product** (`management.tracht-digital.de`). A standalone Astro app that
composes the core frontend host (`@tracht-digital-solutions/tds-core-frontend`) with the
admin extension set, at build time, into one server-rendered Node application. This repo
owns only the composition and the deploy pipeline; the shell, base pages and every feature
live in published packages.

## Commands

```bash
npm install --no-package-lock   # needs NPM_TOKEN; never npm ci (win32 lockfile breaks Linux CI)
npm run dev                     # astro dev
npm run type-check              # astro check
npm run test:run                # vitest: composition + SSR invariants
npm run build                   # astro build → dist/, postbuild assembles release/
npm start                       # run release/app.cjs locally
```

## Hard rules

- **Never fork base UI into this repo.** Change the host or tds-shared, release, then repin here.
- Adding an extension is three edits: the import, the `extensions` array and `dependencies`.
- Keep each extension inside its pinned `0.MINOR.x` line; crossing it needs a dependency update here first.
- `npm ls @tracht-digital-solutions/tds-shared` must show exactly one version.
- `frontendHost` keeps its `layout` option; `FRONTEND_TARGET=admin` stays on both env vars.
- No page cache, ever. `vite.ssr.noExternal` covers `@tracht-digital-solutions/`.
- `public/.htaccess` never gets `Options +FollowSymLinks`.
- `tsconfig.json` keeps `release/` excluded.
- Production deploys only via the manual `release.yml` button.

## Topic files

| File | Read before |
|---|---|
| [docs/agents/architecture.md](docs/agents/architecture.md) | Changing the extension set, host options or anything visual |
| [docs/agents/deployment.md](docs/agents/deployment.md) | Changing the build, `release/`, workflows or host configuration |
| [docs/agents/testing.md](docs/agents/testing.md) | Changing tests or the composition |

Setup and hosting: [INSTALL.md](INSTALL.md). Workspace rules: `../CLAUDE.md`. Legacy
replacement status: `../MIGRATION-STATUS.md`.
