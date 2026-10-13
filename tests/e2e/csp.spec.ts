import type { Page } from "@playwright/test";
import { pressableStyleId } from "../../src/styles/reactAriaPressable";
import { expect, openPage, test } from "./fixtures";

// ADR-0012: la 404 usa il Link di React Aria, che passa da usePress. Con la CSP
// reale della build non deve comparire nessuna violazione, e la regola che
// React Aria inserirebbe deve arrivare da global.css.

const notFound = "/pagina-inesistente";

async function recordViolations(page: Page): Promise<string[]> {
  const violations: string[] = [];
  await page.exposeFunction("reportCspViolation", (violation: string) => {
    violations.push(violation);
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      const report: unknown = Reflect.get(window, "reportCspViolation");
      if (typeof report === "function") report(`${event.effectiveDirective} ${event.blockedURI}`);
    });
  });
  return violations;
}

test.describe("CSP del sito con un componente React Aria", () => {
  test("la 404 non produce violazioni e usa la regola di global.css", async ({ page }) => {
    const violations = await recordViolations(page);
    await openPage(page, notFound);
    const link = page.getByRole("link", { name: "Back to the home page" });
    await expect(link).toHaveAttribute("data-react-aria-pressable", "true");

    const sentinel = await page.evaluate(
      (id) => document.getElementById(id)?.tagName,
      pressableStyleId,
    );
    expect(sentinel).toBe("LINK");
    expect(await page.locator(`style#${pressableStyleId}`).count()).toBe(0);
    // Chromium serializza "pan-x pan-y pinch-zoom" con l'equivalente "manipulation".
    expect(await link.evaluate((element) => getComputedStyle(element).touchAction)).toMatch(
      /^(pan-x pan-y pinch-zoom|manipulation)$/,
    );

    await page.evaluate(() => {
      Object.assign(window, { __noReload: true });
    });
    await link.click();
    await expect(page).toHaveURL("/en/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Gianpaolo Del Moro");
    expect(await page.evaluate(() => "__noReload" in window)).toBe(true);
    expect(violations).toEqual([]);
  });

  test("senza la sentinella la violazione viene rilevata (controllo in negativo)", async ({
    page,
    consoleErrors,
  }) => {
    await page.route(`**${notFound}`, async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace(` id="${pressableStyleId}"`, "");
      await route.fulfill({ response, body });
    });
    const violations = await recordViolations(page);
    await openPage(page, notFound);

    await expect.poll(() => violations).toContainEqual(expect.stringMatching(/^style-src/));
    expect(consoleErrors.length).toBeGreaterThan(0);
    consoleErrors.splice(0);
  });
});
