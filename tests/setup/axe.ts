import { expect } from "vitest";
import { configureAxe } from "vitest-axe";

const axe = configureAxe({
  rules: {
    "color-contrast": { enabled: false },
  },
});

export async function expectNoAxeViolations(container: Element): Promise<void> {
  const results = await axe(container);
  expect(
    results.violations.map(({ id, help, nodes }) => ({ id, help, nodes: nodes.length })),
  ).toEqual([]);
}
