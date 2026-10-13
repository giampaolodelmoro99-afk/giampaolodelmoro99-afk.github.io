import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        extends: false,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
          setupFiles: ["tests/setup/unit.ts"],
          css: { modules: { classNameStrategy: "non-scoped" } },
        },
      },
      {
        extends: false,
        test: {
          name: "prerender",
          environment: "node",
          include: ["tests/prerender/**/*.test.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}", "scripts/lib/**/*.mjs"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.stories.tsx", "src/app/routes.ts"],
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
      reporter: ["text", "html", "lcov"],
    },
  },
});
