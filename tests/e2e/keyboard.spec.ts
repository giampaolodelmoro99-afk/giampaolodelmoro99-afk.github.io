import { expect, openPage, test } from "./fixtures";

test("il collegamento della lingua si raggiunge e si attiva da tastiera", async ({ page }) => {
  await openPage(page, "/");
  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: "English version" });
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/en/");
});

for (const [path, name] of [
  ["/", "English version"],
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
  const link = page.getByRole("link", { name: "English version" });
  await expect(link).toBeFocused();
  const outline = await link.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(outline).toEqual({ style: "dashed", width: "2px" });
});
