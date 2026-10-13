import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "../e2e/fixtures";
import { openStory, stories, variants } from "./stories";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const interactive =
  "button, input, select, textarea, [role=button], [role=checkbox], [role=radio], [role=tab], [role=menuitem], [role=option], [role=gridcell], [tabindex]:not([tabindex='-1'])";

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

      if (variant.input === "touch") {
        const small = await page.locator("#storybook-root").evaluate((root, selector) => {
          return [...root.querySelectorAll(selector)]
            .map((element) => {
              const { width, height } = element.getBoundingClientRect();
              return { element: element.outerHTML.slice(0, 80), width, height };
            })
            .filter(({ width, height }) => width < 44 || height < 44);
        }, interactive);
        expect(small, "in modalità touch ogni controllo misura almeno 44×44 px").toEqual([]);
      }
    });
  }
}
