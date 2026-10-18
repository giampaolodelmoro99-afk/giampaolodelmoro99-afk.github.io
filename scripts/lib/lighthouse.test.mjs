import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Regola di ADR-0013: Accessibility, Best Practices e SEO a 100 sempre;
// Performance ≥ 95 a ogni commit e 100 (mediana di 5) a chiusura di fase e
// release; LCP, FCP, TBT e CLS con budget fissi uguali nei due livelli.

const root = join(import.meta.dirname, "../..");
/** @param {string} file */
const read = (file) => JSON.parse(readFileSync(join(root, file), "utf8")).ci;

const budgets = {
  mobile: { lcp: 1350, fcp: 1050 },
  desktop: { lcp: 500, fcp: 425 },
};

describe.each(/** @type {const} */ (["mobile", "desktop"]))("Lighthouse %s", (preset) => {
  const commit = read(`lighthouserc.${preset}.json`);
  const strict = read(`lighthouserc.${preset}.strict.json`);

  it("a ogni commit: Performance almeno 95 su 3 esecuzioni, le altre categorie a 100", () => {
    expect(commit.collect.numberOfRuns).toBe(3);
    expect(commit.assert.assertions["categories:performance"]).toEqual([
      "error",
      { minScore: 0.95 },
    ]);
  });

  it("a chiusura di fase e release: Performance 100, mediana di 5 esecuzioni", () => {
    expect(strict.collect.numberOfRuns).toBe(5);
    expect(strict.assert.aggregationMethod).toBe("median-run");
    expect(strict.assert.assertions["categories:performance"]).toEqual(["error", { minScore: 1 }]);
  });

  it.each(["accessibility", "best-practices", "seo"])("%s a 100 in entrambi i livelli", (name) => {
    for (const config of [commit, strict]) {
      expect(config.assert.assertions[`categories:${name}`]).toEqual(["error", { minScore: 1 }]);
    }
  });

  it("LCP, FCP, TBT e CLS con gli stessi budget nei due livelli", () => {
    const metrics = {
      "largest-contentful-paint": ["error", { maxNumericValue: budgets[preset].lcp }],
      "first-contentful-paint": ["error", { maxNumericValue: budgets[preset].fcp }],
      "total-blocking-time": ["error", { maxNumericValue: 50 }],
      "cumulative-layout-shift": ["error", { maxNumericValue: 0.01 }],
    };
    for (const config of [commit, strict]) {
      expect(config.assert.assertions).toMatchObject(metrics);
      expect(config.collect.url).toEqual(commit.collect.url);
      expect(config.collect.settings).toEqual(commit.collect.settings);
    }
  });
});

describe("Lighthouse nei workflow", () => {
  const ci = readFileSync(join(root, ".github/workflows/ci.yml"), "utf8");
  const deploy = readFileSync(join(root, ".github/workflows/deploy.yml"), "utf8");

  it("la CI usa il livello severo solo se richiesto, e il deploy lo richiede", () => {
    expect(ci).toContain(
      "npm run lhci:${{ matrix.preset }}${{ inputs.strict-lighthouse && ':strict' || '' }}",
    );
    expect(deploy).toMatch(
      /uses: \.\/\.github\/workflows\/ci\.yml\s+with:\s+strict-lighthouse: true/,
    );
  });
});
