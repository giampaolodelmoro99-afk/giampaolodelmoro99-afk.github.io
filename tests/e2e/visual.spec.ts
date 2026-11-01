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

test("aspetto del desktop con due finestre aperte", { tag: "@visual" }, async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-18T14:49:00"));
  await openDesktop(page, "/");
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("menuitem", { name: "Progetti" }).click();
  await expect(page.getByRole("region", { name: "Progetti" })).toHaveAttribute(
    "data-active",
    "true",
  );
  await page.mouse.move(0, 0);
  await expect(page).toHaveScreenshot("desktop-due-finestre.png", { fullPage: true });
});
