import { expect, openDesktop, test } from "./fixtures";

// Animazioni delle finestre: solo transform e opacity, durate dai token.

const animationOf = (element: Element) => getComputedStyle(element).animationName;

test("la finestra del prerender non si anima, quelle aperte dopo sì; chiudere aspetta l'animazione", async ({
  page,
}) => {
  await openDesktop(page);
  expect(await page.getByRole("region", { name: "About" }).evaluate(animationOf)).toBe("none");
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("menuitem", { name: "CV" }).click();
  const cv = page.getByRole("region", { name: "CV" });
  expect(await cv.evaluate(animationOf)).toContain("window-open");
  await cv.getByRole("button", { name: "Chiudi" }).click();
  expect(await cv.evaluate(animationOf)).toContain("window-close");
  await expect(cv).toHaveCount(0);
  await expect(page.locator("#window-about-body")).toBeFocused();
});

test.describe("con movimento ridotto", () => {
  test.use({ reducedMotion: "reduce" });

  test("aprire e chiudere non animano e la chiusura è immediata", async ({ page }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "CV" }).click();
    const cv = page.getByRole("region", { name: "CV" });
    expect(await cv.evaluate((element) => getComputedStyle(element).animationDuration)).toBe("0s");
    await cv.getByRole("button", { name: "Chiudi" }).click();
    expect(await cv.count()).toBe(0);
  });
});
