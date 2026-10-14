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

test("ScrollArea: con il focus le frecce della tastiera scorrono il contenuto", async ({
  page,
}) => {
  await openStory(page, "componenti-scrollarea--default", { theme: "classic", input: "mouse" });
  const region = page.getByRole("region", { name: "Come funziona il portfolio" });
  await page.keyboard.press("Tab");
  await expect(region).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => region.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
});

test("Tooltip: compare con l'hover del mouse dopo il ritardo, non subito", async ({ page }) => {
  await openStory(page, "componenti-tooltip--default", { theme: "classic", input: "mouse" });
  // React Aria apre il tooltip all'hover solo se l'ultima interazione è stata
  // col puntatore (un clic), non dopo il solo caricamento della pagina.
  await page.mouse.click(300, 150);
  await page.getByRole("button", { name: "Svuota il cestino" }).hover();
  await expect(page.getByRole("tooltip")).toBeHidden();
  await expect(page.getByRole("tooltip")).toHaveText("Svuota il cestino");
});

test("Select: la lista si apre larga quanto il campo e si sceglie al clic", async ({ page }) => {
  await openStory(page, "componenti-select--default", { theme: "classic", input: "touch" });
  const button = page.getByRole("button", { name: /Carattere/ });
  await button.click();
  const listbox = page.getByRole("listbox");
  await expect(listbox).toBeVisible();
  const [buttonBox, listBox] = await Promise.all([
    button.evaluate((element) => element.getBoundingClientRect().width),
    listbox.evaluate((element) => element.parentElement?.getBoundingClientRect().width ?? 0),
  ]);
  expect(Math.abs(listBox - buttonBox)).toBeLessThanOrEqual(1);
  await page.getByRole("option", { name: "Leggibile" }).click();
  await expect(listbox).toBeHidden();
  await expect(button).toContainText("Leggibile");
});

test("MenuBar: frecce tra i menu, freccia giù apre, Esc chiude e riporta il focus", async ({
  page,
}) => {
  await openStory(page, "componenti-menubar--default", { theme: "classic", input: "mouse" });
  const file = page.getByRole("button", { name: "File" });
  await page.keyboard.press("Tab");
  await expect(file).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "Visualizza" })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem", { name: /Nuovo/ })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toBeHidden();
  await expect(file).toBeFocused();
});

for (const [input, size] of [
  ["mouse", 24],
  ["touch", 44],
] as const) {
  test(`Window: i pulsanti della barra del titolo misurano ${size}×${size} px (${input})`, async ({
    page,
  }) => {
    await openStory(page, "componenti-window--default", { theme: "classic", input });
    const sizes = await Promise.all(
      ["Riduci a icona", "Ingrandisci", "Chiudi"].map((name) =>
        page.getByRole("button", { name }).evaluate((button) => {
          const { width, height } = button.getBoundingClientRect();
          return [Math.round(width), Math.round(height)];
        }),
      ),
    );
    expect(sizes).toEqual([
      [size, size],
      [size, size],
      [size, size],
    ]);
  });
}
