import { expect, openPage, test } from "./fixtures";

test("il collegamento della lingua funziona al tocco", async ({ page }) => {
  await openPage(page, "/");
  await page.getByRole("link", { name: "English version" }).tap();
  await expect(page).toHaveURL("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
