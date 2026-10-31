import { expect, openDesktop, test } from "./fixtures";

// Trascinamento e ridimensionamento esistono solo con il desktop largo (da 768 px):
// i progetti stretti non eseguono questo file (playwright.config.ts).

test.describe("finestre: trascinamento", () => {
  test("si trascina dalla barra del titolo: si muove il contorno, la finestra al rilascio", async ({
    page,
  }) => {
    await openDesktop(page);
    const about = page.getByRole("region", { name: "About" });
    const title = about.locator("header");
    const before = await about.boundingBox();
    const start = await title.boundingBox();
    if (!before || !start) throw new Error("finestra non visibile");
    await page.mouse.move(start.x + 60, start.y + start.height / 2);
    await page.mouse.down();
    await page.mouse.move(start.x + 160, start.y + start.height / 2 + 80, { steps: 5 });
    const outline = page.locator("[aria-hidden=true][style*='--outline-x']");
    await expect(outline).toBeVisible();
    expect(await about.boundingBox()).toEqual(before);
    await page.mouse.up();
    await expect(outline).toHaveCount(0);
    const after = await about.boundingBox();
    expect(after?.x).toBeCloseTo(before.x + 100, 0);
    expect(after?.y).toBeCloseTo(before.y + 80, 0);
    expect(after?.width).toBeCloseTo(before.width, 0);
  });

  test("Esc durante il trascinamento annulla lo spostamento", async ({ page }) => {
    await openDesktop(page);
    const about = page.getByRole("region", { name: "About" });
    const before = await about.boundingBox();
    const start = await about.locator("header").boundingBox();
    if (!before || !start) throw new Error("finestra non visibile");
    await page.mouse.move(start.x + 60, start.y + 10);
    await page.mouse.down();
    await page.mouse.move(start.x + 300, start.y + 200, { steps: 5 });
    await page.keyboard.press("Escape");
    await page.mouse.up();
    expect(await about.boundingBox()).toEqual(before);
    await expect(about).toHaveAttribute("data-active", "true");
  });

  test("la finestra non esce dall'area visibile: resta una parte della barra del titolo", async ({
    page,
  }) => {
    await openDesktop(page);
    const about = page.getByRole("region", { name: "About" });
    const start = await about.locator("header").boundingBox();
    if (!start) throw new Error("finestra non visibile");
    await page.mouse.move(start.x + 60, start.y + 10);
    await page.mouse.down();
    await page.mouse.move(-2000, -2000, { steps: 5 });
    await page.mouse.up();
    const after = await about.boundingBox();
    const viewport = page.viewportSize();
    expect(after?.y).toBeGreaterThanOrEqual(0);
    expect((after?.x ?? 0) + (after?.width ?? 0)).toBeGreaterThanOrEqual(40);
    await page.mouse.move(start.x + 60, 10);
    await page.mouse.down();
    await page.mouse.move(5000, 5000, { steps: 5 });
    await page.mouse.up();
    const last = await about.boundingBox();
    expect(last?.x).toBeLessThanOrEqual((viewport?.width ?? 0) - 40);
    expect(last?.y).toBeLessThanOrEqual((viewport?.height ?? 0) - 40);
  });

  test("il doppio clic sulla barra del titolo ingrandisce e ripristina", async ({ page }) => {
    await openDesktop(page);
    const about = page.getByRole("region", { name: "About" });
    await about.locator("header span[id]").dblclick();
    await expect(about).toHaveAttribute("data-maximized", "true");
    await about.locator("header span[id]").dblclick();
    await expect(about).not.toHaveAttribute("data-maximized");
  });
});
