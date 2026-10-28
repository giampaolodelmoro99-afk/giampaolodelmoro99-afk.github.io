import { expect, openPage, test } from "./fixtures";

test.describe("navigazione tra le lingue", () => {
  test("passa da / a /en/ e ritorno senza ricaricare la pagina", async ({ page }) => {
    await openPage(page, "/");
    await expect(page.locator("html")).toHaveAttribute("lang", "it");
    await page.evaluate(() => {
      Object.assign(window, { __noReload: true });
    });

    await page.getByRole("link", { name: "English version" }).click();
    await expect(page).toHaveURL("/en/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Gianpaolo Del Moro · Full Stack Developer");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://gianpaolodelmoro.it/en/",
    );

    await page.getByRole("link", { name: "Versione italiana" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "it");

    await page.goBack();
    await expect(page).toHaveURL("/en/");
    expect(await page.evaluate(() => "__noReload" in window)).toBe(true);
  });

  test("apre direttamente il deep link inglese", async ({ page }) => {
    const response = await openPage(page, "/en/");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Gianpaolo Del Moro");
  });

  test("risponde 404 agli URL sconosciuti e mostra la pagina di errore", async ({ page }) => {
    const response = await openPage(page, "/pagina-inesistente");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pagina non trovata");
    await page.getByRole("link", { name: "Back to the home page" }).click();
    await expect(page).toHaveURL("/en/");
  });
});
