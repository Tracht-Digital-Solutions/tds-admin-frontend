import { defineConfig, passthroughImageService } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import { frontendHost } from "@tracht-digital-solutions/tds-frontend-contract/astro";
import { coreFrontendBase } from "@tracht-digital-solutions/tds-core-frontend/astro";
import { tdsViteBuild } from "@tracht-digital-solutions/tds-shared/astro";

// The admin extension set — this repo's ONLY composition decision. coreFrontendBase
// injects the shared base routes (dashboard/login/users/settings/wiki); frontendHost
// injects each extension's route + the widget/settings virtual modules.
import timeTracker from "@tracht-digital-solutions/tds-ext-time-tracker";
import supportTickets from "@tracht-digital-solutions/tds-ext-support-tickets";
import contactTickets from "@tracht-digital-solutions/tds-ext-contact-tickets";
import liveChatCta from "@tracht-digital-solutions/tds-ext-live-chat-cta";
import websiteCms from "@tracht-digital-solutions/tds-ext-website-cms";
import blogCms from "@tracht-digital-solutions/tds-ext-blog-cms";
import lexware from "@tracht-digital-solutions/tds-ext-lexware";
import customers from "@tracht-digital-solutions/tds-ext-customers";
import billing from "@tracht-digital-solutions/tds-ext-billing";
import tools from "@tracht-digital-solutions/tds-ext-tools";
import messages from "@tracht-digital-solutions/tds-ext-messages";
import projects from "@tracht-digital-solutions/tds-ext-projects";
import documents from "@tracht-digital-solutions/tds-ext-documents";

const extensions = [timeTracker, supportTickets, contactTickets, liveChatCta, websiteCms, blogCms, lexware, customers, billing, tools, messages, projects, documents];

// This product builds as the ADMIN target (shell auth-hint key + brand).
process.env.FRONTEND_TARGET = "admin";
process.env.PUBLIC_FRONTEND_TARGET = "admin";
// Login is the central site (auth.tracht-digital.de) — the host bounces there.
// The host defaults PUBLIC_LOGIN_URL; set it in the build env to override (e.g.
// the local tds-auth dev server).

export default defineConfig({
  // ─── Server-rendered under Plesk's Passenger, deliberately WITHOUT a cache ──
  //
  // This product was `output: "static"` until 2026-08-25, and the docs used to
  // forbid anything else on the grounds that the production host has no Node
  // runtime. That stopped being true on 2026-08-24, when the three public sites
  // moved to Astro SSR under Passenger (DEPLOY-PLESK.md §3.2).
  //
  // What server rendering buys here is an honest 404. The static deploy relied
  // on the vhost answering every unmatched path with the dashboard's
  // index.html — an SPA fallback that also answered *mis-resolved relative API
  // calls* with HTTP 200 and an HTML body, so `res.ok` was true, `res.json()`
  // threw, and the usual `.catch(() => setRows([]))` painted a calm, permanent
  // empty state with nothing logged anywhere.
  //
  // Two things it deliberately does NOT buy:
  //
  //  - NO page cache. The three public sites store each render as a file; a
  //    panel page is per-visitor. tds-shared/cache refuses a response carrying
  //    Set-Cookie and its cacheLocation cannot key on identity — a cache here
  //    would either store nothing or hand one visitor's page to the next.
  //  - NO server-side session check. The pre-paint gate in the host's
  //    Layout.astro stays exactly as it was: a client-side localStorage hint
  //    confirmed against /me behind a brand spinner. No Astro middleware, no
  //    Astro.cookies. Server rendering changed the deploy model, not the auth
  //    model.
  output: "server",
  adapter: node({
    mode: "standalone",
    // Matches the three public sites. Nothing here needs a complete body the
    // way a cache writer does, but a streamed response behind Passenger buys
    // nothing either, and this is the posture that is known-good on this host.
    experimentalDisableStreaming: true,
  }),
  integrations: [
    react(),
    coreFrontendBase(),
    // Pass the host shell Layout so every extension route renders inside the
    // full panel chrome (head/CSS/nav), not as a bare unstyled fragment.
    frontendHost({
      extensions,
      layout: "@tracht-digital-solutions/tds-core-frontend/src/layouts/Layout.astro",
    }),
  ],
  trailingSlash: "ignore",
  build: { format: "directory" },

  // Astro's default image service is sharp — a native addon Rollup cannot
  // bundle and every deploy would have to carry. Nothing in the host or in any
  // composed extension imports astro:assets, <Image>, <Picture> or getImage(),
  // so the passthrough service is the honest declaration rather than a
  // workaround.
  image: { service: passthroughImageService() },

  vite: {
    build: { ...tdsViteBuild },
    ssr: {
      // Bundle every first-party package INTO dist/server. Without this the
      // server bundle keeps bare @tracht-digital-solutions/… specifiers and the
      // host cannot boot at all — it has no GitHub Packages token, and giving
      // it one is exactly what this avoids. pack-release.mjs fails the build if
      // a first-party import survives.
      //
      // Enumerated, never `noExternal: true`: the blanket form drags in
      // CJS-only packages and anything touching Node builtins, and Rollup then
      // fails in ways whose message points nowhere near the cause.
      noExternal: [/^@tracht-digital-solutions\//, "zod"],
    },
  },
});
