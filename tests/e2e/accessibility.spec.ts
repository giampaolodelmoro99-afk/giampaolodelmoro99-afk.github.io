import { expect, openPage, test } from "./fixtures";

for (const path of ["/", "/en/", "/pagina-inesistente"]) {
  test(`nessuna violazione axe WCAG 2.2 AA su ${path}`, async ({ page, expectNoAxeViolations }) => {
    await openPage(page, path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoAxeViolations();
  });
}
