import type { Locator, Page } from "@playwright/test";
import { expect, openDesktop, openPage, test } from "./fixtures";

async function tabTo(page: Page, target: Locator, limit = 40) {
  for (let step = 0; step < limit; step += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error("elemento non raggiunto con Tab");
}

test("il primo Tab mostra «Salta al contenuto», che porta al corpo della finestra attiva", async ({
  page,
}) => {
  await openPage(page, "/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Salta al contenuto" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("#window-about-body")).toBeFocused();
});

test("il collegamento della lingua si raggiunge e si attiva da tastiera", async ({ page }) => {
  await openPage(page, "/");
  const link = page.getByRole("link", { name: "English version" });
  await tabTo(page, link);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/en/");
});

for (const [path, name] of [
  ["/", "Salta al contenuto"],
  ["/pagina-inesistente", "Torna alla home"],
] as const) {
  test(`il focus da tastiera su ${path} è un doppio anello`, async ({ page }) => {
    await openPage(page, path);
    await page.keyboard.press("Tab");
    const link = page.getByRole("link", { name });
    await expect(link).toBeFocused();
    const ring = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
      };
    });
    expect(ring.outlineStyle).toBe("dashed");
    expect(ring.outlineWidth).toBe("2px");
    expect(ring.boxShadow).toContain("0px 0px 0px 6px");
  });
}

test("in forced-colors il focus da tastiera resta visibile con il colore di sistema", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await openPage(page, "/");
  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: "Salta al contenuto" });
  await expect(link).toBeFocused();
  const outline = await link.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(outline).toEqual({ style: "dashed", width: "2px" });
});

test("Alt+Spazio e Alt+trattino aprono il menu della finestra attiva", async ({ page }) => {
  await openDesktop(page);
  await page.locator("#window-about-body").focus();
  await page.keyboard.press("Alt+Space");
  const menu = page.getByRole("menu", { name: "Menu della finestra" });
  await expect(menu).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Sposta" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.locator("#window-about-body")).toBeFocused();
  await page.keyboard.press("Alt+Minus");
  await expect(menu).toBeVisible();
});
