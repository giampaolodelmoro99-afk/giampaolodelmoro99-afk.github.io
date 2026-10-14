import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "../e2e/fixtures";
import { openStory, stories, variants } from "./stories";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const interactive = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "[role=button]",
  "[role=link]",
  "[role=checkbox]",
  "[role=radio]",
  "[role=switch]",
  "[role=slider]",
  "[role=tab]",
  "[role=menuitem]",
  "[role=option]",
  "[role=gridcell]",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

for (const id of stories) {
  for (const variant of variants) {
    test(`axe e target di ${id} (${variant.theme}, ${variant.input})`, async ({ page }) => {
      await openStory(page, id, variant);
      const results = await new AxeBuilder({ page })
        .include("#storybook-root")
        .withTags(wcagTags)
        .analyze();
      expect(
        results.violations.map(({ id: rule, help, nodes }) => ({
          rule,
          help,
          nodes: nodes.length,
        })),
      ).toEqual([]);

      const minimum = variant.input === "touch" ? 44 : 24;
      const small = await page.locator("#storybook-root").evaluate(
        (root, [selector, size]) => {
          return [...root.querySelectorAll(selector)]
            .map((element) => {
              let hidden = false;
              for (let node: Element | null = element; node && node !== root;) {
                const style = getComputedStyle(node);
                if (style.clip !== "auto" || style.clipPath !== "none") hidden = true;
                node = node.parentElement;
              }
              const target = hidden ? (element.closest("label") ?? element) : element;
              const { width, height } = target.getBoundingClientRect();
              return {
                element: target.outerHTML.slice(0, 80),
                width,
                height,
                hidden: target === element && hidden,
              };
            })
            .filter(({ hidden }) => !hidden)
            .filter(({ width, height }) => width < size || height < size)
            .map(({ element, width, height }) => ({ element, width, height }));
        },
        [interactive, minimum] as const,
      );
      expect(
        small,
        `ogni controllo misura almeno ${minimum}×${minimum} px (${variant.input})`,
      ).toEqual([]);
    });
  }
}
