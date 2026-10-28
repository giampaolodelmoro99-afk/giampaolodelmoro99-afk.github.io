import { expect, openDesktop, openPage, test } from "./fixtures";

for (const path of ["/", "/en/", "/profilo/", "/en/projects/"]) {
  test(`nessuno scroll orizzontale su ${path}`, async ({ page }) => {
    await openPage(page, path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

// Con il mouse il bersaglio minimo è 24×24 px (WCAG 2.5.8); in touch 44×44, in touch.spec.ts.
test("il collegamento della lingua nella taskbar misura almeno 24×24 px", async ({ page }) => {
  await openDesktop(page, "/");
  const box = await page.getByRole("link", { name: "English version" }).evaluate((element) => {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  });
  expect(box.width).toBeGreaterThanOrEqual(24);
  expect(box.height).toBeGreaterThanOrEqual(24);
});
