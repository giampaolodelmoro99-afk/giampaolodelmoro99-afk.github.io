import { expect, openPage, test } from "./fixtures";

test("il collegamento della lingua si raggiunge e si attiva da tastiera", async ({ page }) => {
  await openPage(page, "/");
  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: "English version" });
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/en/");
});
