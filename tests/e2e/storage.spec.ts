import { expect, openDesktop, test } from "./fixtures";

// Chiavi ammesse: LEGAL.md §2 e ADR-0003. Una chiave nuova va aggiunta lì e qui.
const allowedLocalStorage = ["windows.v1"];

test("il sito scrive solo lo storage tecnico elencato in LEGAL.md", async ({ page }) => {
  await openDesktop(page);
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("menuitem", { name: "CV" }).click();
  await page.getByRole("link", { name: "EN, English version" }).click();
  await expect(page).toHaveURL(/\/en\/cv\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/cv\/$/);
  await openDesktop(page, "/progetti/");
  await page
    .getByRole("region", { name: "Progetti" })
    .getByRole("button", { name: "Chiudi" })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect
    .poll(() => page.evaluate(() => Object.keys(localStorage)))
    .toEqual(allowedLocalStorage);
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
});
