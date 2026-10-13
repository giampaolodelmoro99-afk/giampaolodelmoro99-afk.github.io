import { expect, test } from "./fixtures";

for (const [name, path] of [
  ["desktop-it", "/"],
  ["desktop-en", "/en/"],
  ["not-found", "/pagina-inesistente"],
] as const) {
  test(`aspetto di ${name}`, { tag: "@visual" }, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
