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
  "[role=menuitemradio]",
  "[role=menuitemcheckbox]",
  "[role=row]",
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

      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
            .map((animation) => animation.finished),
        ),
      );
      const minimum = variant.input === "touch" ? 44 : 24;
      const small = await page.locator("#storybook-root").evaluate(
        (root, [selector, size]) => {
          const isClipped = (element: Element) => {
            for (let node: Element | null = element; node && node !== root;) {
              const style = getComputedStyle(node);
              if (style.clip === "rect(0px, 0px, 0px, 0px)" || style.clipPath === "inset(50%)") {
                return true;
              }
              node = node.parentElement;
            }
            return false;
          };
          return [...root.querySelectorAll(selector)]
            .filter((element) => getComputedStyle(element).display !== "contents")
            .map((element) => {
              const label = element.closest("label");
              const target = isClipped(element)
                ? label && !isClipped(label)
                  ? label
                  : null
                : element;
              const { width, height } = target?.getBoundingClientRect() ?? { width: 0, height: 0 };
              return {
                element: (target ?? element).outerHTML.slice(0, 80),
                width,
                height,
                hidden: target === null,
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
