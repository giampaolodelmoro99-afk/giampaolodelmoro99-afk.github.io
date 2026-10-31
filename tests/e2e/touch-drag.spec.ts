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

test("al tocco la finestra si ridimensiona dall'angolo, con una zona di presa di 44 px", async ({
  page,
}) => {
  await openDesktop(page);
  const cdp = await page.context().newCDPSession(page);
  const about = page.getByRole("region", { name: "About" });
  const before = await about.boundingBox();
  const corner = await about.locator('[data-edge="se"]').boundingBox();
  if (!before || !corner) throw new Error("maniglia non visibile");
  expect(corner.width).toBeGreaterThanOrEqual(44);
  expect(corner.height).toBeGreaterThanOrEqual(44);
  await touchDrag(
    cdp,
    { x: corner.x + corner.width / 2, y: corner.y + corner.height / 2 },
    { x: 60, y: 40 },
  );
  await expect
    .poll(async () => (await about.boundingBox())?.width)
    .toBeCloseTo(before.width + 60, 0);
});

test("la pressione lunga sul desktop apre il menu contestuale", async ({ page }) => {
  await openDesktop(page);
  const cdp = await page.context().newCDPSession(page);
  const point = [{ x: 950, y: 120, id: 1 }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: point });
  await expect(page.getByRole("menu", { name: "Desktop" })).toBeVisible({ timeout: 3000 });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.getByRole("menu", { name: "Desktop" })).toBeVisible();
});
