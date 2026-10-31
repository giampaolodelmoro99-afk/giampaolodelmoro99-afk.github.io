import { expect, test } from "../e2e/fixtures";
import { openStory, visualStories, visualVariants } from "./stories";

for (const id of visualStories) {
  for (const variant of visualVariants) {
    test(
      `aspetto di ${id} (${variant.theme}, ${variant.input})`,
      { tag: "@visual" },
      async ({ page }) => {
        const root = await openStory(page, id, variant);
        await expect(root).toHaveScreenshot(`${id}-${variant.theme}-${variant.input}.png`);
      },
    );
  }
}
