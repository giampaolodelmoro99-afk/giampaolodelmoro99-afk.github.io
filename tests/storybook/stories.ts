import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";

const index = join(import.meta.dirname, "../../build/client/storybook/index.json");

if (!existsSync(index)) {
  throw new Error("build/client/storybook/index.json non trovato: esegui `npm run build`");
}

type Entry = { id: string; type: string; tags: string[] };

function parseEntries(json: unknown): Entry[] {
  if (typeof json !== "object" || json === null || !("entries" in json)) {
    throw new Error("index.json di Storybook in formato inatteso");
  }
  const { entries } = json;
  if (typeof entries !== "object" || entries === null) {
    throw new Error("index.json di Storybook senza entries");
  }
  return Object.values(entries).map((entry: unknown) => {
    if (typeof entry !== "object" || entry === null) throw new Error("voce non valida");
    const fields = new Map<string, unknown>(Object.entries(entry));
    const id = fields.get("id");
    const type = fields.get("type");
    const tags: unknown = fields.get("tags") ?? [];
    if (typeof id !== "string" || typeof type !== "string" || !Array.isArray(tags)) {
      throw new Error("voce di index.json non valida");
    }
    return { id, type, tags: tags.filter((tag): tag is string => typeof tag === "string") };
  });
}

const entries = parseEntries(JSON.parse(readFileSync(index, "utf8")));

export const stories = entries.filter((entry) => entry.type === "story").map((entry) => entry.id);

export const visualStories = entries
  .filter((entry) => entry.type === "story" && entry.tags.includes("visual"))
  .map((entry) => entry.id);

export const variants = [
  { theme: "classic", input: "mouse" },
  { theme: "classic", input: "touch" },
  { theme: "high-contrast", input: "mouse" },
  { theme: "high-contrast", input: "touch" },
] as const;

export type Variant = (typeof variants)[number];

// Screenshot dei componenti: due combinazioni sole, i due estremi (decisione del
// 31/10/2026, ADR-0019). axe e target touch restano su tutte e quattro.
export const visualVariants: readonly Variant[] = [
  { theme: "classic", input: "mouse" },
  { theme: "high-contrast", input: "touch" },
];

export async function openStory(
  page: Page,
  id: string,
  { theme, input }: Variant,
  extraGlobals: Record<string, string> = {},
) {
  const extra = Object.entries(extraGlobals).map(([name, value]) => `;${name}:${value}`);
  await page.goto(
    `/storybook/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};input:${input};a11y.manual:!true${extra.join("")}`,
  );
  const root = page.locator("#storybook-root");
  await root.locator(":scope > *").first().waitFor({ state: "attached" });
  await page.waitForFunction(
    ([expectedTheme, expectedInput]) =>
      document.documentElement.dataset["theme"] === expectedTheme &&
      document.documentElement.dataset["input"] === expectedInput,
    [theme, input],
  );
  const phase = await page.waitForFunction(() => {
    const preview: unknown = Reflect.get(window, "__STORYBOOK_PREVIEW__");
    const render: unknown =
      typeof preview === "object" && preview !== null
        ? Reflect.get(preview, "currentRender")
        : undefined;
    const current: unknown =
      typeof render === "object" && render !== null ? Reflect.get(render, "phase") : undefined;
    return ["finished", "errored", "aborted"].includes(String(current)) ? String(current) : false;
  });
  const finalPhase = await phase.jsonValue();
  if (finalPhase !== "finished") {
    throw new Error(`la story ${id} è finita nella fase "${String(finalPhase)}" (play fallita?)`);
  }
  await page.evaluate(() => document.fonts.ready);
  return root;
}
