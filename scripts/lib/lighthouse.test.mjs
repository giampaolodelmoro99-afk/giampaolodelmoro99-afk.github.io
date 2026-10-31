import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Regola di ADR-0018: Accessibility, Best Practices e SEO a 100 sempre;
// Performance ≥ 90 a ogni push, e a chiusura di fase e release desktop 100 e
// mobile ≥ 90; LCP, TBT e CLS alle soglie "buone" di Google; 3 esecuzioni,
// mediana, in entrambi i livelli.

const root = join(import.meta.dirname, "../..");
/** @param {string} file */
const read = (file) => JSON.parse(readFileSync(join(root, file), "utf8")).ci;

const strictPerformance = { mobile: 0.9, desktop: 1 };

describe.each(/** @type {const} */ (["mobile", "desktop"]))("Lighthouse %s", (preset) => {
  const commit = read(`lighthouserc.${preset}.json`);
  const strict = read(`lighthouserc.${preset}.strict.json`);

  it("a ogni push: Performance almeno 90", () => {
    expect(commit.assert.assertions["categories:performance"]).toEqual([
      "error",
      { minScore: 0.9 },
    ]);
  });

  it("a chiusura di fase e release: desktop 100, mobile almeno 90", () => {
    expect(strict.assert.assertions["categories:performance"]).toEqual([
      "error",
      { minScore: strictPerformance[preset] },
    ]);
  });

  it.each(["accessibility", "best-practices", "seo"])("%s a 100 in entrambi i livelli", (name) => {
    for (const config of [commit, strict]) {
      expect(config.assert.assertions[`categories:${name}`]).toEqual(["error", { minScore: 1 }]);
    }
  });

  it("LCP, TBT e CLS alle soglie buone di Google, senza limiti su FCP; 3 esecuzioni, mediana", () => {
    const metrics = {
      "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
      "total-blocking-time": ["error", { maxNumericValue: 200 }],
      "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
    };
    for (const config of [commit, strict]) {
      expect(config.assert.assertions).toMatchObject(metrics);
      expect(config.assert.assertions).not.toHaveProperty("first-contentful-paint");
      expect(config.assert.aggregationMethod).toBe("median-run");
      expect(config.collect.numberOfRuns).toBe(3);
      expect(config.collect.url).toEqual(commit.collect.url);
      expect(config.collect.settings).toEqual(commit.collect.settings);
    }
  });
});

describe("Lighthouse nei workflow", () => {
  const ci = readFileSync(join(root, ".github/workflows/ci.yml"), "utf8");
  const deploy = readFileSync(join(root, ".github/workflows/deploy.yml"), "utf8");

  it("la CI usa il livello di chiusura solo se richiesto, e il deploy lo richiede", () => {
    expect(ci).toContain(
      "npm run lhci:${{ matrix.preset }}${{ inputs.strict-lighthouse && ':strict' || '' }}",
    );
    expect(deploy).toMatch(
      /uses: \.\/\.github\/workflows\/ci\.yml\s+with:\s+strict-lighthouse: true/,
    );
  });
});
