import type { Page } from "@playwright/test";
import { expect, openDesktop, test } from "./fixtures";

function boxes(target: Page) {
  return Promise.all(
    [
      target.getByRole("region", { name: "About" }),
      target.getByText("Cestino", { exact: true }),
      target.getByText("Start", { exact: true }),
    ].map((locator) => locator.boundingBox()),
  );
}

test.describe("desktop dopo l'idratazione", () => {
  test("il desktop interattivo prende il posto del guscio con le stesse posizioni", async ({
    page,
    browser,
  }) => {
    const shell = await browser.newPage({
      viewport: page.viewportSize(),
      javaScriptEnabled: false,
    });
    await shell.goto("/", { waitUntil: "load" });
    const before = await boxes(shell);
    await shell.close();
    await openDesktop(page);
    await page.evaluate(() => document.fonts.ready);
    expect(await boxes(page)).toEqual(before);
  });

  test("un'icona apre la finestra senza ricaricare la pagina", async ({ page }) => {
    await openDesktop(page);
    await page.evaluate(() => Object.assign(window, { __noReload: true }));
    const icon = page.getByRole("row", { name: "Progetti", exact: true });
    await icon.dblclick();
    const projects = page.getByRole("region", { name: "Progetti" });
    await expect(projects).toHaveAttribute("data-active", "true");
    await expect(page.locator("#window-projects-body")).toBeFocused();
    await expect(page.getByRole("region", { name: "About" })).toHaveAttribute(
      "data-active",
      "false",
    );
    expect(await page.evaluate(() => "__noReload" in window)).toBe(true);
  });

  test("il menu Start apre un'app e chiudere una finestra attiva la successiva", async ({
    page,
  }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "Pannello di controllo" }).click();
    const panel = page.getByRole("region", { name: "Pannello di controllo" });
    await expect(panel).toHaveAttribute("data-active", "true");
    await panel.getByRole("button", { name: "Chiudi" }).click();
    await expect(panel).toBeHidden();
    await expect(page.locator("#window-about-body")).toBeFocused();
  });

  test("il primo Tab resta «Salta al contenuto» anche dopo lo swap", async ({ page }) => {
    await openDesktop(page);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Salta al contenuto" })).toBeFocused();
  });

  test("la lingua di React Aria segue la route", async ({ page }) => {
    await openDesktop(page, "/en/projects/");
    await expect(
      page.getByRole("region", { name: "Projects" }).getByRole("button", { name: "Close" }),
    ).toBeVisible();
  });

  test("in alto contrasto il pulsante attivo e Start aperto sono gialli, con il focus interno", async ({
    page,
  }) => {
    await openDesktop(page);
    await page.locator("html").evaluate((html) => {
      html.dataset["theme"] = "high-contrast";
    });
    const yellow = "rgb(255, 255, 0)";
    await expect(page.getByRole("button", { name: "About", pressed: true })).toHaveCSS(
      "background-color",
      yellow,
    );
    const start = page.getByRole("button", { name: "Start" });
    await start.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(start).toBeFocused();
    await expect(start).toHaveCSS("outline-offset", "-4px");
    await page.keyboard.press("Enter");
    await expect(start).toHaveAttribute("aria-expanded", "true");
    await expect(start).toHaveCSS("background-color", yellow);
    await expect(start).toHaveCSS("color", "rgb(0, 0, 0)");
  });

  test("Esegui… apre un'app scritta per nome, con i suggerimenti dentro il dialog", async ({
    page,
  }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "Esegui…" }).click();
    const dialog = page.getByRole("dialog", { name: "Esegui" });
    const field = dialog.getByRole("textbox", { name: "Apri" });
    await expect(field).toBeFocused();
    await field.fill("cont");
    const list = dialog.getByRole("listbox", { name: "Suggerimenti" });
    await expect(list.getByRole("option")).toHaveCount(2);
    const listBox = await list.boundingBox();
    const okBox = await dialog.getByRole("button", { name: "OK" }).boundingBox();
    expect((listBox?.y ?? 0) + (listBox?.height ?? 0)).toBeLessThanOrEqual(okBox?.y ?? 0);
    await field.fill("contatti");
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("region", { name: "Contatti" })).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  test("dopo l'idratazione i link di About aprono le finestre e cambiano l'URL senza ricaricare", async ({
    page,
  }) => {
    await openDesktop(page);
    await page.evaluate(() => Object.assign(window, { __noReload: true }));
    await page.getByRole("link", { name: "Vedere i progetti" }).click();
    await expect(page.getByRole("region", { name: "Progetti" })).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(page.getByRole("region", { name: "About" })).toBeVisible();
    await expect(page).toHaveURL(/\/progetti\/$/);
    expect(await page.evaluate(() => "__noReload" in window)).toBe(true);
  });

  test("se il chunk di Esegui non si carica il desktop resta usabile e lo annuncia", async ({
    page,
    consoleErrors,
  }) => {
    await page.route(/\/assets\/RunDialog-[^/]+\.js$/, (route) => route.abort());
    await openDesktop(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "Esegui…" }).click();
    await expect(page.locator("main [aria-live=polite]")).toHaveText(
      "Non riesco ad aprire questa finestra: ricarica la pagina.",
    );
    await expect(page.getByRole("button", { name: "Start" })).toBeFocused();
    await expect(page.getByRole("region", { name: "About" })).toBeVisible();
    // Gli errori del chunk bloccato sono quelli che il test provoca: si tolgono
    // solo questi, ogni altro errore in console fa ancora fallire il test.
    // Firefox mostra l'errore che React registra per l'error boundary come
    // "JSHandle@object".
    const expected = /RunDialog|net::ERR_FAILED|Importing a module script failed|JSHandle@object/;
    expect(consoleErrors.some((error) => expected.test(error))).toBe(true);
    consoleErrors.splice(
      0,
      consoleErrors.length,
      ...consoleErrors.filter((error) => !expected.test(error)),
    );
  });
});
