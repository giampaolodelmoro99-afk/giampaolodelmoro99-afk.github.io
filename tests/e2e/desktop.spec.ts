import { expect, openDesktop, test } from "./fixtures";

test.describe("desktop dopo l'idratazione", () => {
  test("il desktop interattivo prende il posto del guscio con le stesse posizioni", async ({
    page,
  }) => {
    await page.goto("/");
    const boxes = () =>
      Promise.all(
        [
          page.getByRole("region", { name: "About" }),
          page.getByText("Cestino", { exact: true }),
          page.getByText("Start", { exact: true }),
        ].map((locator) => locator.boundingBox()),
      );
    await page.waitForLoadState("load");
    await page.evaluate(() => document.fonts.ready);
    const before = await boxes();
    await expect(page.locator("[role=grid]")).toBeVisible();
    expect(await boxes()).toEqual(before);
  });

  test("un'icona apre la finestra senza ricaricare la pagina", async ({ page }) => {
    await openDesktop(page);
    await page.evaluate(() => Object.assign(window, { __noReload: true }));
    const icon = page.getByRole("row", { name: "Progetti", exact: true });
    await icon.dblclick();
    const projects = page.getByRole("region", { name: "Progetti" });
    await expect(projects).toHaveAttribute("data-active", "true");
    await expect(page.locator("#window-projects-body")).toBeFocused();
    await expect(page.getByRole("region", { name: "About" })).toHaveAttribute(
      "data-active",
      "false",
    );
    expect(await page.evaluate(() => "__noReload" in window)).toBe(true);
  });

  test("il menu Start apre un'app e chiudere una finestra attiva la successiva", async ({
    page,
  }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "Pannello di controllo" }).click();
    const panel = page.getByRole("region", { name: "Pannello di controllo" });
    await expect(panel).toHaveAttribute("data-active", "true");
    await panel.getByRole("button", { name: "Chiudi" }).click();
    await expect(panel).toBeHidden();
    await expect(page.locator("#window-about-body")).toBeFocused();
  });

  test("il primo Tab resta «Salta al contenuto» anche dopo lo swap", async ({ page }) => {
    await openDesktop(page);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Salta al contenuto" })).toBeFocused();
  });

  test("la lingua di React Aria segue la route", async ({ page }) => {
    await openDesktop(page, "/en/projects/");
    await expect(
      page.getByRole("region", { name: "Projects" }).getByRole("button", { name: "Close" }),
    ).toBeVisible();
  });
});
