import { expect, openDesktop, test } from "./fixtures";

// Animazioni delle finestre: solo transform e opacity, durate dai token.

const animationOf = (element: Element) => getComputedStyle(element).animationName;

test("la finestra del prerender non si anima, quelle aperte dopo sì; chiudere aspetta l'animazione", async ({
  page,
}) => {
  await openDesktop(page);
  expect(await page.getByRole("region", { name: "About" }).evaluate(animationOf)).toBe("none");
  await page.evaluate(() => {
    const started: string[] = [];
    Reflect.set(window, "startedAnimations", started);
    const record = (node: Node) => {
      if (!(node instanceof HTMLElement) || !node.matches("section")) return;
      const name = getComputedStyle(node).animationName;
      if (name !== "none" && started.at(-1) !== name) started.push(name);
    };
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        record(mutation.target);
        mutation.addedNodes.forEach(record);
      }
    }).observe(document.querySelector("main") ?? document.body, {
      subtree: true,
      childList: true,
      attributeFilter: ["class"],
    });
  });
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("menuitem", { name: "CV" }).click();
  const cv = page.getByRole("region", { name: "CV" });
  await expect(cv).toHaveAttribute("data-active", "true");
  await cv.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  await cv.getByRole("button", { name: "Chiudi" }).click();
  await expect(cv).toHaveCount(0);
  const started = await page.evaluate(() => Reflect.get(window, "startedAnimations"));
  expect(started).toEqual([
    expect.stringContaining("window-open"),
    expect.stringContaining("window-close"),
  ]);
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
