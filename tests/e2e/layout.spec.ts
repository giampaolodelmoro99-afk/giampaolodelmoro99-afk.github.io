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

test("con più finestre aperte i pulsanti della taskbar non coprono lingua e orologio", async ({
  page,
}) => {
  await openDesktop(page);
  for (const app of ["Progetti", "CV", "Contatti"]) {
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: app, exact: true }).click();
  }
  await expect(page.getByRole("region", { name: "Contatti" })).toHaveAttribute(
    "data-active",
    "true",
  );
  const covered = await page.evaluate(() => {
    const targets = [document.querySelector('a[hreflang="en"]'), document.querySelector("time")];
    return targets.map((element) => {
      if (!element) return "mancante";
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return hit !== null && (element === hit || element.contains(hit)) ? "libero" : "coperto";
    });
  });
  expect(covered).toEqual(["libero", "libero"]);
  const toolbar = page.getByRole("toolbar");
  await toolbar.getByRole("button").last().focus();
  const inside = await toolbar
    .getByRole("button")
    .last()
    .evaluate((button) => {
      const rect = button.getBoundingClientRect();
      const area = button.parentElement?.getBoundingClientRect();
      return area !== undefined && rect.left >= area.left - 1 && rect.right <= area.right + 1;
    });
  expect(inside).toBe(true);
});
