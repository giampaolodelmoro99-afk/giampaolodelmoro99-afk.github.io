import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { githubFilterToRegExp, tagFilters } from "./workflows.mjs";

const workflows = resolve(import.meta.dirname, "../../.github/workflows");
const deploy = readFileSync(resolve(workflows, "deploy.yml"), "utf8");

const releases = ["v1.0.0", "v1.2.3", "v10.20.30"];
const notReleases = [
  "v1.0.0-legacy",
  "v1.0.0-rc1",
  "v1",
  "v1.2",
  "phase-01a",
  "phase-00",
  "v1.2.3.4",
];

describe("githubFilterToRegExp", () => {
  it("segue la sintassi dei filtri di GitHub", () => {
    expect(githubFilterToRegExp("v*").test("v1.0.0-legacy")).toBe(true);
    expect(githubFilterToRegExp("phase/**").test("phase/01a/x")).toBe(true);
    expect(githubFilterToRegExp("phase/*").test("phase/01a/x")).toBe(false);
    expect(githubFilterToRegExp("v[0-9]+").test("v12")).toBe(true);
    expect(githubFilterToRegExp("a.b").test("axb")).toBe(false);
  });
});

describe("deploy.yml", () => {
  it("parte solo con i tag vMAJOR.MINOR.PATCH", () => {
    const filters = tagFilters(deploy).map(githubFilterToRegExp);
    expect(filters).toHaveLength(1);
    const matches = (/** @type {string} */ tag) => filters.some((filter) => filter.test(tag));
    expect(releases.filter((tag) => !matches(tag))).toEqual([]);
    expect(notReleases.filter(matches)).toEqual([]);
  });

  it("ricontrolla il tag con la stessa regola prima della CI", () => {
    const guard = /=~ (\^v\S+\$) \]\]/.exec(deploy)?.[1] ?? "";
    const regex = new RegExp(guard);
    expect(releases.every((tag) => regex.test(tag))).toBe(true);
    expect(notReleases.some((tag) => regex.test(tag))).toBe(false);
    expect(deploy).toMatch(/ci:\n\s+name: CI completa\n\s+needs: tag/);
  });
});

describe("runner della CI", () => {
  it("usano una versione esplicita di Ubuntu, mai ubuntu-latest", () => {
    const runners = readdirSync(workflows).flatMap((file) =>
      [...readFileSync(resolve(workflows, file), "utf8").matchAll(/runs-on: (\S+)/g)].map(
        ([, runner]) => `${file}: ${runner}`,
      ),
    );
    expect(runners.length).toBeGreaterThan(0);
    expect(runners.filter((entry) => !/: ubuntu-\d{2}\.\d{2}$/.test(entry))).toEqual([]);
  });
});
