import { defineConfig } from "vitest/config";

/**
 * This repo has no `src/` — its entire job is one composition decision in
 * `astro.config.mjs`. The suite therefore tests that decision: it composes the
 * REAL extension set through the contract's `composeExtensions` and checks the
 * wiring the product build depends on.
 */
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    environment: "node",
    restoreMocks: true,
  },
});
