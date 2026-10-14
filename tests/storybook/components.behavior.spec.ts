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
