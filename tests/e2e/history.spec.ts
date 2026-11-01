import type { Page } from "@playwright/test";
import { expect, openDesktop, test } from "./fixtures";

const canonical = (page: Page) => page.locator('link[rel="canonical"]');

async function markNoReload(page: Page) {
  await page.evaluate(() => Object.assign(window, { __noReload: true }));
}

async function expectNoReload(page: Page) {
  expect(await page.evaluate(() => "__noReload" in window)).toBe(true);
}

test.describe("URL e history delle finestre", () => {
  test("aprire una finestra cambia URL, titolo e canonical; Indietro e Avanti la seguono", async ({
    page,
  }) => {
    await openDesktop(page);
    await markNoReload(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "CV" }).click();
    await expect(page).toHaveURL(/\/cv\/$/);
    await expect(page).toHaveTitle("CV · Gianpaolo Del Moro");
    await expect(canonical(page)).toHaveAttribute("href", "https://gianpaolodelmoro.it/cv/");
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle("Gianpaolo Del Moro · Full Stack Developer");
    await expect(page.getByRole("region", { name: "About" })).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(page.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "false");
    await expect(page.locator("#window-about-body")).toBeFocused();
    await page.goForward();
    await expect(page.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "true");
    await expect(page.locator("#window-cv-body")).toBeFocused();
    await expectNoReload(page);
  });

  test("chiudere la finestra aperta dalla home non lascia una voce doppia nella history", async ({
    page,
  }) => {
    await openDesktop(page);
    await markNoReload(page);
    const length = await page.evaluate(() => history.length);
    await page.getByRole("row", { name: "Progetti", exact: true }).dblclick();
    await expect(page).toHaveURL(/\/progetti\/$/);
    const projects = page.getByRole("region", { name: "Progetti" });
    await projects.getByRole("button", { name: "Chiudi" }).click();
    await expect(projects).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("#window-about-body")).toBeFocused();
    await page.goForward();
    await expect(projects).toHaveAttribute("data-active", "true");
    expect(await page.evaluate(() => history.length)).toBe(length + 1);
    await expectNoReload(page);
  });

  test("un link diretto apre la sua finestra; chiudendola si va alla home e Indietro esce dal sito", async ({
    page,
  }) => {
    await page.goto("about:blank");
    await openDesktop(page, "/progetti/");
    const projects = page.getByRole("region", { name: "Progetti" });
    await projects.getByRole("button", { name: "Chiudi" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle("Gianpaolo Del Moro · Full Stack Developer");
    await expect(page.getByRole("row", { name: "About" })).toBeFocused();
    await page.goBack();
    await expect(page).toHaveURL("about:blank");
  });

  test("cambiare lingua tiene le finestre e la lingua di React Aria segue la route", async ({
    page,
  }) => {
    await openDesktop(page);
    await markNoReload(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "CV" }).click();
    await page.getByRole("link", { name: "EN, English version" }).click();
    await expect(page).toHaveURL(/\/en\/cv\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "true");
    await expect(page.getByRole("region", { name: "About" })).toBeVisible();
    await expect(
      page.getByRole("region", { name: "CV" }).getByRole("button", { name: "Close" }),
    ).toBeVisible();
    await expectNoReload(page);
  });
});
