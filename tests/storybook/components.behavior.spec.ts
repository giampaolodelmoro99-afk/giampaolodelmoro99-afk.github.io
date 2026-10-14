import { expect, test } from "../e2e/fixtures";
import { openStory } from "./stories";

// Comportamenti dei componenti che servono un browser vero (misure, scorrimento,
// tocco): i test unitari in jsdom non li vedono.

for (const theme of ["classic", "high-contrast"] as const) {
  test(`TextField: in touch il testo del campo resta almeno a 16 px, niente zoom su iOS (${theme})`, async ({
    page,
  }) => {
    await openStory(page, "componenti-textfield--default", { theme, input: "touch" });
    const fontSize = await page
      .getByRole("textbox", { name: "Nome" })
      .evaluate((input) => Number.parseFloat(getComputedStyle(input).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });
}

test("TextArea: si ridimensiona solo in verticale e scorre con la barra GDM 95", async ({
  page,
}) => {
  await openStory(page, "componenti-textarea--stati", { theme: "classic", input: "mouse" });
  const area = page.getByRole("textbox", { name: "Messaggio lungo" });
  const { resize, scrollbar, overflowing } = await area.evaluate((element: HTMLElement) => ({
    resize: getComputedStyle(element).resize,
    scrollbar: element.offsetWidth - element.clientWidth,
    overflowing: element.scrollHeight > element.clientHeight,
  }));
  expect(resize).toBe("vertical");
  expect(overflowing).toBe(true);
  expect(scrollbar).toBeGreaterThanOrEqual(24);
});

test("ProgressBar: indeterminata si anima, con movimento ridotto resta ferma e lo dice", async ({
  page,
}) => {
  const fill = () =>
    page.getByRole("progressbar", { name: "Invio del messaggio" }).evaluate((bar) => {
      const blocks = bar.querySelector("[data-indeterminate]");
      return blocks ? getComputedStyle(blocks).animationName : "assente";
    });
  const variant = { theme: "classic", input: "mouse" } as const;
  await openStory(page, "componenti-progressbar--indeterminata", variant);
  expect(await fill()).not.toBe("none");
  await openStory(page, "componenti-progressbar--indeterminata", variant, { motion: "reduce" });
  expect(await fill()).toBe("none");
  await expect(page.getByText("In corso…")).toBeVisible();
});
