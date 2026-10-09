# Architecture

## Everything is assembled at build time from GitHub Packages

There is no app source here beyond `astro.config.mjs` and configuration.

- **`coreFrontendBase()`** (host package, `./astro`) injects the base pages (Dashboard,
  Benutzer, Profil, Firma, Module, Einstellungen, `/wiki` as the API reference in this build,
  404 and 500), the shell and the pre-paint auth gate. There is no `/login`; sign-in is the
  central auth site. The list is exported as `BASE_ROUTE_PATTERNS`.
- **`frontendHost({ extensions })`** (from `tds-frontend-contract-pkg`) injects each extension's
  routes and folds its nav, widget and settings virtual modules into the composition.
- **`FRONTEND_TARGET=admin`** selects the auth-hint key prefix (`tds_admin_*`), the brand suffix
  ("Panel") and the accent: the host emits `<html data-frontend="admin">`, and tds-shared's
  `surfaces/panel.css` paints this product burgundy (`--color-management`). The customer portal
  renders the base navy. The red marks the management surface, where permissions, content
  administration and destructive actions live. It is one token block in tds-shared; nothing here
  configures it.

## The extension set is this repo's only real decision

time-tracker, support-tickets, contact-tickets, live-chat-cta, website-cms, blog-cms, lexware,
customers, billing, tools, messages, projects, documents, shop, cards and analytics.

Adding or removing a feature: change the import, the `extensions` array and the dependency.

## One tds-shared, decided here

The host takes tds-shared as a peer. When it carried its own copy, npm nested a second
version: the shell and the extensions ran different tds-shared versions (two toast hosts, two
theme states). `npm ls @tracht-digital-solutions/tds-shared` must show exactly one version.

## Shell behaviour lives in the host and tds-shared

- **Navigation is app-like.** The host owns Astro's `ClientRouter`, prefetch hints and the
  persisted shell regions. Drawer state and theme survive a route change; data consumers may keep
  cached values visible with the shared stale treatment while revalidating.
- **One toast stack.** The shell mounts `ToastHost` once; extensions only raise toasts. If every
  message shows twice, something mounted a second host.
- **Mobile behaviour comes from tds-shared.** `.tds-table` scrolls itself below 40rem,
  `.tds-page__head` stacks, chips get 44 px touch targets, fixed bottom elements clear the home
  indicator. Don't add wrappers or breakpoints here.
- **Tailwind scans extension packages via `@source` in the host's `global.css`.** Don't add a
  competing `@source` here.

Fix any of these in the host or tds-shared and repin; never add product-local code.

## Version pins

Each extension is pinned to its current `0.MINOR.x` line (a 0.x caret never crosses the minor).
A release this product should pick up must stay in that line.
