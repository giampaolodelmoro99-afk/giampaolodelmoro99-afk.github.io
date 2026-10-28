import { AxeBuilder } from "@axe-core/playwright";
import { test as base, expect, type Locator, type Page, type Response } from "@playwright/test";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

type Fixtures = {
  consoleErrors: string[];
  externalRequests: string[];
  expectNoAxeViolations: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  consoleErrors: [
    async ({ page }, provide) => {
      const errors: string[] = [];
      const notFoundDocuments = new Set<string>();
      page.on("response", (response) => {
        if (response.request().isNavigationRequest() && response.status() === 404) {
          notFoundDocuments.add(response.url());
        }
      });
      page.on("console", (message) => {
        if (message.type() !== "error" && message.type() !== "warning") return;
        const source = message.location().url;
        const expectedDocument404 =
          message.text().includes("status of 404") &&
          notFoundDocuments.size > 0 &&
          (source === "" || notFoundDocuments.has(source));
        if (!expectedDocument404) errors.push(`${message.type()}: ${message.text()}`);
      });
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      await provide(errors);
      expect(errors, "la console deve restare senza errori").toEqual([]);
    },
    { auto: true },
  ],
  externalRequests: [
    async ({ page, baseURL }, provide) => {
      const external: string[] = [];
      const origin = new URL(baseURL ?? "http://localhost").origin;
      page.on("request", (request) => {
        const url = new URL(request.url());
        if (url.protocol !== "data:" && url.origin !== origin) external.push(request.url());
      });
      await provide(external);
      expect(external, "nessuna richiesta verso terze parti").toEqual([]);
    },
    { auto: true },
  ],
  expectNoAxeViolations: async ({ page }, provide) => {
    await provide(async () => {
      const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
      expect(
        results.violations.map(({ id, help, nodes }) => ({ id, help, nodes: nodes.length })),
      ).toEqual([]);
    });
  },
});

const channels = (color: string) => (color.match(/[\d.]+/g) ?? []).map(Number);

const linear = (value: number) => {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r = 0, g = 0, b = 0]: number[]) =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

export async function contrastRatio(locator: Locator): Promise<number> {
  const { text, background } = await locator.evaluate((element) => {
    let current: Element | null = element;
    while (current) {
      const color = getComputedStyle(current).backgroundColor;
      if (!(color === "transparent" || (color.startsWith("rgba(") && color.endsWith(", 0)")))) {
        return { text: getComputedStyle(element).color, background: color };
      }
      current = current.parentElement;
    }
    return { text: getComputedStyle(element).color, background: "rgb(255, 255, 255)" };
  });
  const [lighter, darker] = [luminance(channels(text)), luminance(channels(background))].toSorted(
    (a, b) => b - a,
  );
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
}

export async function openPage(page: Page, path: string): Promise<Response | null> {
  const response = await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  return response;
}

export async function openDesktop(page: Page, path = "/"): Promise<Response | null> {
  const response = await openPage(page, path);
  await expect(page.locator("[role=grid]")).toBeVisible();
  return response;
}

export { expect };
