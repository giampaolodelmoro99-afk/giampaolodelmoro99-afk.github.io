import { expect, openDesktop, openPage, test } from "./fixtures";

for (const [name, path] of [
  ["desktop-it", "/"],
  ["desktop-en", "/en/"],
  ["not-found", "/pagina-inesistente"],
] as const) {
  test(`aspetto di ${name}`, { tag: "@visual" }, async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-18T14:49:00"));
    await (name === "not-found" ? openPage(page, path) : openDesktop(page, path));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
