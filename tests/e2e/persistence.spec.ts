import { expect, openDesktop, test } from "./fixtures";

test.describe("persistenza del layout", () => {
  test("ricaricando la home tornano le finestre di prima, dietro About", async ({ page }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "CV" }).click();
    const cv = page.getByRole("region", { name: "CV" });
    await cv.getByRole("button", { name: "Ingrandisci" }).click();
    await expect(cv).toHaveAttribute("data-maximized", "true");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("windows.v1")))
      .toContain('"maximized":true');
    await openDesktop(page, "/");
    await expect(page.getByRole("region", { name: "About" })).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(cv).toHaveAttribute("data-active", "false");
    await expect(cv).toHaveAttribute("data-maximized", "true");
  });

  test("un link diretto mostra la sua finestra in primo piano, con le altre salvate dietro", async ({
    page,
  }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "Contatti" }).click();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("windows.v1")))
      .toContain("contacts");
    await openDesktop(page, "/progetti/");
    await expect(page.getByRole("region", { name: "Progetti" })).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(page.getByRole("region", { name: "Contatti" })).toHaveAttribute(
      "data-active",
      "false",
    );
    await expect(page.getByRole("region", { name: "About" })).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  test("un layout salvato con un'altra versione si ignora, si cancella e si riscrive al primo cambiamento", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("windows.v1", JSON.stringify({ version: 99, windows: "x" }));
    });
    await openDesktop(page);
    await expect(page.getByRole("region")).toHaveCount(1);
    expect(await page.evaluate(() => localStorage.getItem("windows.v1"))).toBeNull();
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "CV" }).click();
    await expect
      .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("windows.v1") ?? "{}")))
      .toMatchObject({ version: 1, stack: ["about", "cv"] });
  });
});
