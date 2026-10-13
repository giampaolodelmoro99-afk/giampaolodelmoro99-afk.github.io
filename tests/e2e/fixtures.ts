import { AxeBuilder } from "@axe-core/playwright";
import { test as base, expect } from "@playwright/test";

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

export { expect };
