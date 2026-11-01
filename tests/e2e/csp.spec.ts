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
    const cspErrors = consoleErrors.filter((message) =>
      /Content Security Policy|style-src/i.test(message),
    );
    expect(cspErrors.length).toBeGreaterThan(0);
    const others = consoleErrors.filter((message) => !cspErrors.includes(message));
    consoleErrors.splice(0, consoleErrors.length, ...others);
  });
});

test.describe("CSP del sito sulla home con il desktop interattivo (ADR-0015)", () => {
  test("guscio, swap, icone, menu Start, finestre e taskbar senza violazioni", async ({ page }) => {
    const violations = await recordViolations(page);
    await page.goto("/");
    expect(await page.locator("[style]").count()).toBe(0);
    await expect(page.locator("[role=grid]")).toBeVisible();

    const cell = page.getByRole("gridcell", { name: "CV" });
    expect(await cell.evaluate((element) => getComputedStyle(element).display)).toBe("contents");

    await page.getByRole("row", { name: "CV" }).dblclick();
    const cv = page.getByRole("region", { name: "CV" });
    await expect(cv).toHaveAttribute("data-active", "true");
    expect(await cv.evaluate((element) => element.style.getPropertyValue("--window-z"))).toBe("1");

    await page.getByRole("button", { name: "Start" }).click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    expect(
      await menu.evaluate((element) => element.closest("[style]")?.getAttribute("style")),
    ).toContain("position");
    await page.getByRole("menuitem", { name: "Privacy" }).click();
    await page.getByRole("button", { name: "About" }).click();
    await expect(page.getByRole("region", { name: "About" })).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(violations).toEqual([]);
  });

  test("Esegui con un errore, Spegni con i Radio nascosti e il congedo senza violazioni", async ({
    page,
  }) => {
    const violations = await recordViolations(page);
    await page.goto("/");
    await expect(page.locator("[role=grid]")).toBeVisible();

    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "Esegui…" }).click();
    const field = page.getByRole("textbox", { name: "Apri" });
    await field.fill("xyz");
    await page.keyboard.press("Enter");
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await page.getByRole("button", { name: "Annulla" }).click();

    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "Spegni…" }).click();
    const radio = page.getByRole("radio", { name: "Spegni" });
    await expect(radio).toBeFocused();
    const hidden = await radio.evaluate((element) => {
      const style = getComputedStyle(element.parentElement ?? element);
      return { position: style.position, width: style.width };
    });
    expect(hidden).toEqual({ position: "absolute", width: "1px" });
    await page.getByRole("button", { name: "OK" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Puoi chiudere questa scheda.",
    );
    await expect(page).toHaveTitle("Spento · Gianpaolo Del Moro");
    await expect(page.getByRole("button", { name: "Riaccendi" })).toBeFocused();
    await page.getByRole("button", { name: "Riaccendi" }).click();
    await expect(page.getByRole("row", { name: "About" })).toBeFocused();
    expect(violations).toEqual([]);
  });
});
