import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { composeExtensions } from "@tracht-digital-solutions/tds-frontend-contract";
import type { ExtensionManifest } from "@tracht-digital-solutions/tds-frontend-contract";

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

/**
 * This repo has no source of its own — it makes exactly one decision: which
 * extensions the admin product composes, and how the host is wired around them.
 * So that is what is tested, against the REAL installed manifests rather than
 * fixtures.
 *
 * The failures these catch are all silent-at-build-time:
 *
 *  - a cross-extension id / nav-key / widget-id / route collision. The contract
 *    hard-errors on it (the FE twin of the shared-`phinxlog` rule), but only
 *    once someone runs a full product build.
 *  - `frontendHost` losing its `layout` option — the documented "admin frontend
 *    has no formatting" bug: every extension page then ships as a bare
 *    unstyled fragment with no `<head>`.
 *  - an extension imported in astro.config but missing from `dependencies`
 *    (or the reverse), which breaks a clean CI install rather than local dev.
 */

const EXTENSIONS: ExtensionManifest[] = [
  timeTracker,
  supportTickets,
  contactTickets,
  liveChatCta,
  websiteCms,
  blogCms,
  lexware,
  customers,
  billing,
  tools,
  messages,
  projects,
  documents,
];

const config = readFileSync(new URL("../astro.config.mjs", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  dependencies: Record<string, string>;
  scripts: Record<string, string>;
};

/** astro.config with comments stripped — it documents these traps in prose. */
const configCode = config
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/(^|[^:])\/\/.*$/gm, "$1");

describe("the extension set composes", () => {
  it("composes without a collision", () => {
    // The real assertion: `composeExtensions` throws on any duplicate id, nav
    // key, widget id or route across the whole set.
    expect(() => composeExtensions(EXTENSIONS)).not.toThrow();
  });

  it("fills every composition slot", () => {
    const composed = composeExtensions(EXTENSIONS);
    for (const slot of ["routes", "nav", "widgets", "permissions", "settings"] as const) {
      expect(composed[slot], `slot ${slot}`).toBeInstanceOf(Array);
    }
    expect(composed.routes.length).toBeGreaterThan(0);
  });

  it("has globally unique extension ids", () => {
    const ids = EXTENSIONS.map((e) => e.id);
    expect(new Set(ids).size, `duplicate among: ${ids.join(", ")}`).toBe(ids.length);
  });

  it("has globally unique route patterns", () => {
    const patterns = composeExtensions(EXTENSIONS).routes.map((r) => r.pattern);
    expect(new Set(patterns).size, `duplicate among: ${patterns.join(", ")}`).toBe(
      patterns.length,
    );
  });

  it("has globally unique nav ids and hrefs", () => {
    const { nav } = composeExtensions(EXTENSIONS);
    const ids = nav.map((n) => n.id);
    const hrefs = nav.map((n) => n.href);
    expect(new Set(ids).size, `duplicate nav id among: ${ids.join(", ")}`).toBe(ids.length);
    expect(new Set(hrefs).size, `duplicate nav href among: ${hrefs.join(", ")}`).toBe(
      hrefs.length,
    );
  });

  it("points every nav entry at a composed route", () => {
    // A nav link to a route nobody injected is a 404 in the shipped panel.
    const { nav, routes } = composeExtensions(EXTENSIONS);
    const patterns = new Set(routes.map((r) => r.pattern));
    const BASE = new Set(["/", "/users", "/einstellungen", "/wiki"]);
    for (const entry of nav) {
      const target = entry.href.split("?")[0]!;
      expect(
        patterns.has(target) || BASE.has(target),
        `nav "${entry.id}" links to ${entry.href}, which no extension or base route serves`,
      ).toBe(true);
    }
  });

  it("gives every route an entrypoint in its own package", () => {
    for (const route of composeExtensions(EXTENSIONS).routes) {
      expect(route.entrypoint, `route ${route.pattern}`).toMatch(
        /^@tracht-digital-solutions\/tds-ext-/,
      );
      expect(route.entrypoint.endsWith(".astro")).toBe(true);
    }
  });

  it("has globally unique widget ids", () => {
    const ids = composeExtensions(EXTENSIONS).widgets.map((w) => w.id);
    expect(new Set(ids).size, `duplicate among: ${ids.join(", ")}`).toBe(ids.length);
  });

  it("does not collide with the host's own base routes", () => {
    // coreFrontendBase injects these; an extension claiming one would shadow it.
    const BASE = ["/", "/users", "/einstellungen", "/wiki"];
    const patterns = composeExtensions(EXTENSIONS).routes.map((r) => r.pattern);
    for (const base of BASE) {
      expect(patterns, `extension route shadows the base route ${base}`).not.toContain(base);
    }
  });

  it("provides both languages for every i18n key", () => {
    const { i18n } = composeExtensions(EXTENSIONS);
    expect(Object.keys(i18n.de).sort()).toEqual(Object.keys(i18n.en).sort());
  });
});

describe("host wiring", () => {
  it("passes the shell Layout to frontendHost", () => {
    // Omitting `layout` ships every extension page as a bare unstyled fragment
    // with no <head> — contract 1.4.0 fixed this; the option must stay.
    expect(configCode).toMatch(/frontendHost\(\s*\{[\s\S]*?layout:/);
    expect(configCode).toContain("tds-core-frontend/src/layouts/Layout.astro");
  });

  it("registers the base host alongside the extension host", () => {
    expect(configCode).toContain("coreFrontendBase()");
    expect(configCode).toMatch(/frontendHost\(/);
  });

  it("builds as the admin target on both env vars", () => {
    // The shell derives its auth-hint key prefix and brand from these; the
    // PUBLIC_ one is what reaches client code.
    expect(configCode).toMatch(/process\.env\.FRONTEND_TARGET\s*=\s*"admin"/);
    expect(configCode).toMatch(/process\.env\.PUBLIC_FRONTEND_TARGET\s*=\s*"admin"/);
    expect(configCode).not.toMatch(/=\s*"customer"/);
  });

  it("stays a static build — there is no Node on the production host", () => {
    expect(configCode).toMatch(/output:\s*"static"/);
    expect(configCode).not.toMatch(/output:\s*"server"/);
  });

  it("spreads the shared tdsViteBuild preset", () => {
    // Keeps lightningcss from dropping the -webkit-backdrop-filter prefix.
    expect(configCode).toMatch(/\.\.\.tdsViteBuild/);
    expect(configCode).not.toMatch(/cssTarget\s*:/);
  });

  it("runs Tailwind through PostCSS, never the Vite plugin", () => {
    expect(configCode).not.toMatch(/@tailwindcss\/vite/);
    expect(pkg.dependencies["@tailwindcss/postcss"]).toBeDefined();
    expect(pkg.dependencies["@tailwindcss/vite"]).toBeUndefined();
  });
});

describe("declared vs. composed extensions", () => {
  const importedSpecifiers = [...configCode.matchAll(/from "(@tracht-digital-solutions\/tds-ext-[^"]+)"/g)].map(
    (m) => m[1] as string,
  );

  it("imports every extension it composes", () => {
    expect(importedSpecifiers).toHaveLength(EXTENSIONS.length);
  });

  it("declares every imported extension as a dependency", () => {
    // A missing dependency works locally (hoisted node_modules) and fails the
    // clean CI install.
    for (const spec of importedSpecifiers) {
      expect(pkg.dependencies[spec], `${spec} is imported but not in dependencies`).toBeDefined();
    }
  });

  it("composes every extension it depends on", () => {
    // The reverse: a dependency nobody imports is dead weight in the bundle.
    const deps = Object.keys(pkg.dependencies).filter((d) =>
      d.startsWith("@tracht-digital-solutions/tds-ext-"),
    );
    for (const dep of deps) {
      expect(importedSpecifiers, `${dep} is a dependency but never composed`).toContain(dep);
    }
  });

  it("adds every imported extension to the array passed to frontendHost", () => {
    // An import that never reaches `extensions` is a silently missing feature.
    const arrayMatch = /const extensions\s*=\s*\[([^\]]*)\]/.exec(configCode);
    expect(arrayMatch, "no `const extensions = [...]` found").not.toBeNull();
    const names = arrayMatch![1]!.split(",").map((s) => s.trim()).filter(Boolean);
    expect(names).toHaveLength(EXTENSIONS.length);
  });

  it("pins the host and the contract", () => {
    expect(pkg.dependencies["@tracht-digital-solutions/tds-core-frontend"]).toBeDefined();
    expect(pkg.dependencies["@tracht-digital-solutions/tds-frontend-contract"]).toBeDefined();
  });
});

describe("build commands", () => {
  it("exposes the scripts the release workflow runs", () => {
    for (const script of ["build", "type-check", "test:run"]) {
      expect(pkg.scripts[script], `missing npm script: ${script}`).toBeDefined();
    }
  });
});
