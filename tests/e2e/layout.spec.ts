import { expect, test } from "./fixtures";

for (const path of ["/", "/en/"]) {
  test(`nessuno scroll orizzontale su ${path}`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("il collegamento della lingua misura almeno 44×44 px", async ({ page }) => {
  await page.goto("/");
  const box = await page.getByRole("link", { name: "English version" }).boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});
