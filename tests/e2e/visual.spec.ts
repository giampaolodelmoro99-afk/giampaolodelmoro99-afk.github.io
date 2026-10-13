import { expect, openPage, test } from "./fixtures";

for (const [name, path] of [
  ["desktop-it", "/"],
  ["desktop-en", "/en/"],
  ["not-found", "/pagina-inesistente"],
] as const) {
  test(`aspetto di ${name}`, { tag: "@visual" }, async ({ page }) => {
    await openPage(page, path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
