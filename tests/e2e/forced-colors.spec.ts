import { expect, openDesktop, test } from "./fixtures";

test.use({ forcedColors: "active" });

test("in forced-colors il cerchio del Radio ha un bordo, Highlight se scelto", async ({ page }) => {
  await openDesktop(page);
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("menuitem", { name: "Spegni…" }).click();
  const marks = page.getByRole("dialog").locator("label svg");
  const border = (index: number) =>
    marks.nth(index).evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        style: style.borderTopStyle,
        width: style.borderTopWidth,
        color: style.borderTopColor,
      };
    });
  const selected = await border(0);
  const other = await border(1);
  expect(selected.style).toBe("solid");
  expect(selected.width).toBe("2px");
  expect(other.style).toBe("solid");
  expect(other.width).toBe("2px");
  expect(selected.color).not.toBe(other.color);
});

test(
  "in forced-colors la voce scelta del selettore aperto con il mouse ha un contorno",
  { tag: "@desktop" },
  async ({ page }) => {
    await openDesktop(page);
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("menuitem", { name: "CV" }).click();
    await page.getByRole("button", { name: /^Finestre aperte/ }).click();
    const selected = page.getByRole("dialog").getByRole("option", { selected: true });
    await expect(selected).toBeVisible();
    const outline = await selected.evaluate((element) => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline.style).toBe("solid");
    expect(Number.parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  },
);
