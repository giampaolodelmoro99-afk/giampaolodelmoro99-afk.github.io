import { expect, openDesktop, openPage, test } from "./fixtures";

test("il collegamento della lingua funziona al tocco", async ({ page }) => {
  await openPage(page, "/");
  const link = page.getByRole("link", { name: "English version" });
  const box = await link.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await link.tap();
  await expect(page).toHaveURL("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("un tocco su un'icona del desktop apre la sua finestra", async ({ page }) => {
  await openDesktop(page, "/");
  const icon = page.getByRole("row", { name: "Progetti", exact: true });
  const box = await icon.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await icon.tap();
  await expect(page.getByRole("region", { name: "Progetti" })).toHaveAttribute(
    "data-active",
    "true",
  );
});
