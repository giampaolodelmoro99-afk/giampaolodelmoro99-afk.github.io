import { getDictionary } from "../../src/i18n";
import { expect, test } from "./fixtures";

// La 404 deve funzionare anche prima dell'idratazione: i link prerenderizzati
// del Link di React Aria sono <a href> normali (ADR-0012).
// Il tracer di Playwright fotografa il DOM del desktop mentre si carica: in
// Firefox questo produce l'avviso "Layout was forced…" da "debugger eval code",
// non dalla pagina, che qui non esegue JavaScript. Per questo il trace è spento.
test.use({ javaScriptEnabled: false, trace: "off" });

test("dalla 404 i link prerenderizzati portano al desktop", async ({ page }) => {
  await page.goto("/pagina-inesistente");
  const link = page.getByRole("link", { name: getDictionary("it").notFound.home });
  await expect(link).toHaveAttribute("href", "/");
  await Promise.all([page.waitForURL("/", { waitUntil: "load" }), link.press("Enter")]);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Gianpaolo Del Moro");
});

test("dalla 404 il focus da tastiera è il doppio anello anche senza JavaScript", async ({
  page,
}) => {
  await page.goto("/pagina-inesistente");
  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: getDictionary("it").notFound.home });
  await expect(link).toBeFocused();
  const ring = await link.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(ring).toEqual({ outlineStyle: "dashed", outlineWidth: "2px" });
});
