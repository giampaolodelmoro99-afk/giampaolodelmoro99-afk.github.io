import type { CDPSession, Page } from "@playwright/test";
import { expect, openDesktop, test } from "./fixtures";

// Tocchi veri via CDP (solo Chromium): il progetto touch-pixel-7 con un viewport da
// tablet, dove il desktop è largo e le finestre si trascinano.
test.use({ viewport: { width: 1024, height: 768 } });

async function touchDrag(
  cdp: CDPSession,
  from: { x: number; y: number },
  by: { x: number; y: number },
) {
  const point = (step: number) => [
    { x: from.x + (by.x * step) / 5, y: from.y + (by.y * step) / 5, id: 1 },
  ];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: point(0) });
  for (let step = 1; step <= 5; step += 1) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: point(step) });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

async function titleCenter(page: Page) {
  const box = await page.getByRole("region", { name: "About" }).locator("header").boundingBox();
  if (!box) throw new Error("barra del titolo non visibile");
  return { x: box.x + 60, y: box.y + box.height / 2 };
}

test("al tocco la finestra si trascina dalla barra del titolo", async ({ page }) => {
  await openDesktop(page);
  const cdp = await page.context().newCDPSession(page);
  const about = page.getByRole("region", { name: "About" });
  const before = await about.boundingBox();
  await touchDrag(cdp, await titleCenter(page), { x: 120, y: 60 });
  await expect
    .poll(async () => (await about.boundingBox())?.x)
    .toBeCloseTo((before?.x ?? 0) + 120, 0);
  expect((await about.boundingBox())?.y).toBeCloseTo((before?.y ?? 0) + 60, 0);
});
