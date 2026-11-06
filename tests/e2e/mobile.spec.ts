import type { Page } from "@playwright/test";
import { expect, openDesktop, test } from "./fixtures";

async function closeAbout(page: Page) {
  await page.getByRole("button", { name: "Chiudi About" }).click();
  await expect(page.getByRole("region", { name: "About" })).toBeHidden();
}

async function markNoReload(page: Page) {
  await page.evaluate(() => Object.assign(window, { __noReload: true }));
}

const openApps = (page: Page) => page.getByRole("button", { name: /^App aperte/ });

test.describe("modalità mobile", { tag: "@mobile" }, () => {
  test("la home apre About a schermo intero; chiusa, resta la griglia di 13 voci a 3 colonne", async ({
    page,
  }) => {
    await openDesktop(page, "/");
    const about = page.getByRole("region", { name: "About" });
    const viewport = page.viewportSize();
    const box = await about.boundingBox();
    expect(box?.width).toBe(viewport?.width);
    await expect(page.getByRole("button", { name: "Riduci a icona" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Menu della finestra" })).toHaveCount(0);
    await expect(openApps(page)).toHaveAccessibleName("App aperte: 1");
    await closeAbout(page);
    await expect(page).toHaveURL(/:\d+\/$/);
    const rows = page.getByRole("row");
    await expect(rows).toHaveCount(13);
    await expect(page.getByRole("row", { name: "About" })).toBeFocused();
    const lefts = new Set(
      await rows.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().left)),
    );
    expect(lefts.size).toBe(3);
    for (const row of await rows.all()) {
      const cell = await row.boundingBox();
      expect(cell?.width).toBeGreaterThanOrEqual(44);
      expect(cell?.height).toBeGreaterThanOrEqual(44);
    }
    await expect(openApps(page)).toHaveAttribute("aria-disabled", "true");
    await expect(openApps(page)).toHaveAccessibleName("App aperte: 0");
  });

  test("una voce apre l'app a schermo intero con il focus sull'h1, senza ricaricare", async ({
    page,
  }) => {
    await openDesktop(page, "/");
    await closeAbout(page);
    await markNoReload(page);
    await page.getByRole("row", { name: "CV" }).click();
    await expect(page).toHaveURL(/\/cv\/$/);
    await expect(page).toHaveTitle("CV · Gianpaolo Del Moro");
    await expect(page.getByRole("heading", { level: 1, name: "CV" })).toBeFocused();
    const cv = page.getByRole("region", { name: "CV" });
    await expect.poll(async () => (await cv.boundingBox())?.width).toBe(page.viewportSize()?.width);
    expect(await page.evaluate(() => "__noReload" in window)).toBe(true);
  });

  test("Indietro del browser torna alla schermata precedente senza chiudere l'app", async ({
    page,
  }) => {
    await openDesktop(page, "/");
    await closeAbout(page);
    await page.getByRole("row", { name: "CV" }).click();
    await expect(page).toHaveURL(/\/cv\/$/);
    await page.goBack();
    await expect(page).toHaveURL(/:\d+\/$/);
    await expect(page.getByRole("region", { name: "CV" })).toBeHidden();
    await expect(page.getByRole("row", { name: "About" })).toBeFocused();
    await expect(openApps(page)).toHaveAccessibleName("App aperte: 1");
    await page.goForward();
    await expect(page.getByRole("heading", { level: 1, name: "CV" })).toBeFocused();
  });

  test("App aperte: ordine d'uso, apre un'app, chiude una riga con il pulsante e con Canc, Chiudi tutte", async ({
    page,
  }) => {
    await openDesktop(page, "/");
    for (const name of ["CV", "Contatti"]) {
      await page.getByRole("button", { name: "Start" }).click();
      await page.getByRole("menuitem", { name }).click();
      await expect(page.getByRole("heading", { level: 1, name })).toBeFocused();
    }
    await expect(openApps(page)).toHaveAccessibleName("App aperte: 3");
    await openApps(page).click();
    await expect(page.getByRole("dialog", { name: "App aperte (3)" })).toBeVisible();
    const panel = page.getByRole("dialog");
    const rows = panel.getByRole("row");
    await expect(rows).toHaveText([/Contatti/, /CV/, /About/]);
    await expect(rows.first()).toBeFocused();
    await panel.getByRole("button", { name: "Chiudi CV" }).click();
    await expect(rows).toHaveText([/Contatti/, /About/]);
    await expect(page.getByRole("dialog", { name: "App aperte (2)" })).toBeVisible();
    await rows.filter({ hasText: "About" }).focus();
    await page.keyboard.press("Delete");
    await expect(rows).toHaveText([/Contatti/]);
    await rows.first().click();
    await expect(panel).toBeHidden();
    await expect(page.getByRole("heading", { level: 1, name: "Contatti" })).toBeFocused();
    await openApps(page).click();
    await page.getByRole("button", { name: "Chiudi tutte" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/:\d+\/$/);
    await expect(openApps(page)).toBeFocused();
    await expect(openApps(page)).toHaveAccessibleName("App aperte: 0");
  });

  test("Alt+W apre App aperte, Esc lo chiude e riporta il focus; Alt+Spazio non apre menu", async ({
    page,
  }) => {
    await openDesktop(page, "/");
    await page.locator("#window-about-body").focus();
    await page.keyboard.press("Alt+Space");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await page.keyboard.press("Alt+w");
    const panel = page.getByRole("dialog", { name: "App aperte (1)" });
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(openApps(page)).toBeFocused();
  });

  test("Start a pannello apre un'app; il tasto destro non apre il menu del desktop", async ({
    page,
  }) => {
    await openDesktop(page, "/");
    await closeAbout(page);
    await page.locator("main").click({ button: "right", position: { x: 20, y: 20 } });
    await expect(page.getByRole("menu")).toHaveCount(0);
    await page.getByRole("button", { name: "Start" }).click();
    const menu = page.getByRole("menu");
    const box = await menu.boundingBox();
    const width = page.viewportSize()?.width ?? 0;
    expect(box?.width ?? 0).toBeGreaterThan(width * 0.7);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.getByRole("menuitem", { name: "Timeline" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Timeline" })).toBeFocused();
  });

  test("ruotare o allargare lo schermo non perde le app né la loro posizione", async ({ page }) => {
    const start = page.viewportSize() ?? { width: 375, height: 667 };
    await openDesktop(page, "/");
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "CV" }).click();
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.getByRole("region", { name: "About" })).toBeVisible();
    const cv = page.getByRole("region", { name: "CV" });
    await expect(cv).toHaveAttribute("data-active", "true");
    await expect(page.getByRole("button", { name: "CV", pressed: true })).toBeVisible();
    await page.setViewportSize({ width: start.height, height: start.width });
    await expect(page.getByRole("region", { name: "About" })).toBeHidden();
    await expect(cv).toBeVisible();
    await page.setViewportSize(start);
    await expect(cv).toBeVisible();
    await expect(openApps(page)).toHaveAccessibleName("App aperte: 2");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(start.width);
  });

  test("sotto i 360 px App aperte mostra icona e numero, con lo stesso nome", async ({ page }) => {
    await page.setViewportSize({ width: 340, height: 640 });
    await openDesktop(page, "/");
    const button = openApps(page);
    await expect(button).toHaveAccessibleName("App aperte: 1");
    await expect(button.getByText("App aperte (1)")).toBeHidden();
    await expect(button.getByText("1", { exact: true })).toBeVisible();
  });

  test("ricaricando tornano le app di prima, con quella dell'URL davanti", async ({ page }) => {
    await openDesktop(page, "/");
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "Contatti" }).click();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("windows.v1")))
      .toContain("contacts");
    await openDesktop(page, "/cv/");
    await expect(page.getByRole("region", { name: "CV" })).toBeVisible();
    await expect(openApps(page)).toHaveAccessibleName("App aperte: 3");
  });

  test("con un'app a schermo intero la home coperta non è raggiungibile con Tab né dal lettore", async ({
    page,
  }) => {
    await openDesktop(page, "/");
    const close = page.getByRole("button", { name: "Chiudi About" });
    await close.focus();
    await page.keyboard.press("Shift+Tab");
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("role"));
    expect(focused).not.toBe("row");
    await expect(page.getByRole("row")).toHaveCount(0);
    await closeAbout(page);
    await expect(page.getByRole("row")).toHaveCount(13);
  });

  test("se il chunk di App aperte non si carica l'app resta usabile, lo annuncia e il focus torna al pulsante", async ({
    page,
    consoleErrors,
  }) => {
    await page.route(/\/assets\/OpenApps-[^/]+\.js$/, (route) => route.abort());
    await openDesktop(page, "/");
    await openApps(page).click();
    await expect(page.locator("[aria-live=polite]")).toHaveText(
      "Non riesco ad aprire questa finestra: ricarica la pagina.",
    );
    await expect(openApps(page)).toBeFocused();
    await expect(page.getByRole("region", { name: "About" })).toBeVisible();
    const expected = /OpenApps|net::ERR_FAILED|Importing a module script failed|JSHandle@object/;
    expect(consoleErrors.some((error) => expected.test(error))).toBe(true);
    consoleErrors.splice(
      0,
      consoleErrors.length,
      ...consoleErrors.filter((error) => !expected.test(error)),
    );
  });

  test("home vuota, App aperte e app a schermo intero senza violazioni axe", async ({
    page,
    expectNoAxeViolations,
  }) => {
    await openDesktop(page, "/");
    await expectNoAxeViolations();
    await closeAbout(page);
    await expectNoAxeViolations();
    await page.getByRole("row", { name: "CV" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "CV" })).toBeFocused();
    await openApps(page).click();
    await expect(page.getByRole("dialog", { name: "App aperte (1)" })).toBeVisible();
    await expectNoAxeViolations();
  });
});
