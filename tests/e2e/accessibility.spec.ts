import { contrastRatio, expect, openPage, test } from "./fixtures";

for (const path of ["/", "/en/", "/pagina-inesistente"]) {
  test(`nessuna violazione axe WCAG 2.2 AA su ${path}`, async ({ page, expectNoAxeViolations }) => {
    await openPage(page, path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoAxeViolations();
  });

  test(`nessuna violazione axe in alto contrasto su ${path}`, async ({
    page,
    expectNoAxeViolations,
  }) => {
    await openPage(page, path);
    await page.locator("html").evaluate((html) => {
      html.dataset["theme"] = "high-contrast";
    });
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    expect(await contrastRatio(heading)).toBeGreaterThanOrEqual(7);
    await expectNoAxeViolations();
  });
}
