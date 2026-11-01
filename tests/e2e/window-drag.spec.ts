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

  test("si ridimensiona dall'angolo, con la misura minima", async ({ page }) => {
    await openDesktop(page);
    const about = page.getByRole("region", { name: "About" });
    const before = await about.boundingBox();
    const corner = about.locator('[data-edge="se"]');
    const handle = await corner.boundingBox();
    if (!before || !handle) throw new Error("maniglia non visibile");
    const x = handle.x + handle.width / 2;
    const y = handle.y + handle.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 80, y - 60, { steps: 5 });
    await expect(about.locator("[data-resizing]")).toHaveCount(1);
    await page.mouse.up();
    const after = await about.boundingBox();
    expect(after?.width).toBeCloseTo(before.width - 80, 0);
    expect(after?.height).toBeCloseTo(before.height - 60, 0);
    expect(after?.x).toBeCloseTo(before.x, 0);

    const shrunk = await corner.boundingBox();
    if (!shrunk) throw new Error("maniglia non visibile");
    await page.mouse.move(shrunk.x + shrunk.width / 2, shrunk.y + shrunk.height / 2);
    await page.mouse.down();
    await page.mouse.move(0, 0, { steps: 5 });
    await page.mouse.up();
    const smallest = await about.boundingBox();
    expect(smallest?.width).toBe(240);
    expect(smallest?.height).toBe(160);
  });

  test("dal bordo sinistro il ridimensionamento sposta anche l'origine", async ({ page }) => {
    await openDesktop(page);
    const about = page.getByRole("region", { name: "About" });
    const before = await about.boundingBox();
    const edge = await about.locator('[data-edge="w"]').boundingBox();
    if (!before || !edge) throw new Error("maniglia non visibile");
    await page.mouse.move(edge.x + edge.width / 2, edge.y + edge.height / 2);
    await page.mouse.down();
    await page.mouse.move(edge.x + edge.width / 2 - 50, edge.y + edge.height / 2, { steps: 5 });
    await page.mouse.up();
    const after = await about.boundingBox();
    expect(after?.x).toBeCloseTo(before.x - 50, 0);
    expect(after?.width).toBeCloseTo(before.width + 50, 0);
  });

  test("Sposta dal menu della finestra, solo da tastiera (WCAG 2.5.7)", async ({ page }) => {
    await openDesktop(page);
    const about = page.getByRole("region", { name: "About" });
    const before = await about.boundingBox();
    const menuButton = about.getByRole("button", { name: "Menu della finestra" });
    await menuButton.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menuitem", { name: "Sposta" })).toBeFocused();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Shift+ArrowDown");
    await expect(page.locator("[aria-hidden=true][style*='--outline-x']")).toBeVisible();
    await page.keyboard.press("Enter");
    const after = await about.boundingBox();
    expect(after?.x).toBeCloseTo((before?.x ?? 0) + 8, 0);
    expect(after?.y).toBeCloseTo((before?.y ?? 0) + 32, 0);
    await expect(page.getByText("About: spostata")).toBeAttached();
  });

  test("Ridimensiona con le frecce sullo schermo", async ({ page }) => {
    await openDesktop(page);
    const about = page.getByRole("region", { name: "About" });
    const before = await about.boundingBox();
    await about.getByRole("button", { name: "Menu della finestra" }).click();
    await page.getByRole("menuitem", { name: "Ridimensiona" }).click();
    const controls = page.getByRole("group", { name: "Spostamento e ridimensionamento" });
    await controls.getByRole("button", { name: "Destra" }).click();
    await controls.getByRole("button", { name: "Destra" }).click();
    await controls.getByRole("button", { name: "OK" }).click();
    expect((await about.boundingBox())?.width).toBeCloseTo((before?.width ?? 0) + 16, 0);
  });
});

test("le finestre aperte a cascata restano tutte nell'area visibile", async ({ page }) => {
  await openDesktop(page);
  for (const app of [
    "Progetti",
    "CV",
    "Contatti",
    "Skills",
    "Timeline",
    "Making of",
    "Terminale",
  ]) {
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: app, exact: true }).click();
  }
  await expect(page.getByRole("region", { name: "Terminale" })).toHaveAttribute(
    "data-active",
    "true",
  );
  const area = await page.getByRole("main").boundingBox();
  const windows = await page.locator("main section").evaluateAll((sections) =>
    sections.map((section) => {
      const { left, right, bottom } = section.getBoundingClientRect();
      return { left, right, bottom };
    }),
  );
  expect(windows).toHaveLength(8);
  for (const rect of windows) {
    expect(rect.left).toBeGreaterThanOrEqual(area?.x ?? 0);
    expect(rect.right).toBeLessThanOrEqual((area?.x ?? 0) + (area?.width ?? 0) + 0.5);
    expect(rect.bottom).toBeLessThanOrEqual((area?.y ?? 0) + (area?.height ?? 0) + 0.5);
  }
});
