import { expect, openDesktop, test } from "./fixtures";

// Il menu contestuale esiste solo con il desktop largo (da 768 px).

test("il tasto destro sul desktop apre il menu nel punto del clic e ordina le icone", async ({
  page,
}) => {
  await openDesktop(page);
  await page.mouse.click(1200, 120, { button: "right" });
  const menu = page.getByRole("menu", { name: "Desktop" });
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  expect(box?.x).toBeGreaterThan(1000);
  await expect(page.getByRole("menuitem", { name: "Disponi icone" })).toBeFocused();
  await page.getByRole("menuitem", { name: "Disponi icone" }).hover();
  await page.getByRole("menuitem", { name: "Per nome" }).click();
  await expect(menu).toBeHidden();
  const names = await page.getByRole("row").allTextContents();
  expect(names.slice(0, 3)).toEqual(["About", "Campo minato", "Cestino"]);
});

test("Maiusc+F10 su un'icona apre il menu con Apri", async ({ page }) => {
  await openDesktop(page);
  await page.getByRole("row", { name: "CV" }).focus();
  await page.keyboard.press("Shift+F10");
  const menu = page.getByRole("menu", { name: "Desktop" });
  await expect(menu).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Apri" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "true");
});

test("Proprietà apre il Pannello di controllo; Esc chiude il menu senza azioni", async ({
  page,
}) => {
  await openDesktop(page);
  await page.mouse.click(1200, 400, { button: "right" });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toBeHidden();
  await page.mouse.click(1200, 400, { button: "right" });
  await page.getByRole("menuitem", { name: "Proprietà" }).click();
  await expect(page.getByRole("region", { name: "Pannello di controllo" })).toBeVisible();
});

test("il tasto destro dentro una finestra lascia il menu del browser", async ({ page }) => {
  await openDesktop(page);
  await page.locator("#window-about-body").click({ button: "right" });
  await expect(page.getByRole("menu", { name: "Desktop" })).toHaveCount(0);
});
