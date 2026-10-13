import stylelint from "stylelint";
import { describe, expect, it } from "vitest";

async function lintModule(code: string) {
  const { results } = await stylelint.lint({
    code,
    codeFilename: "src/components/Fixture/Fixture.module.css",
    configFile: ".stylelintrc.json",
  });
  return (results[0]?.warnings ?? []).map((warning) => warning.rule);
}

describe("regole di Stylelint per i CSS Modules", () => {
  it("accetta solo token nelle proprietà controllate", async () => {
    const valid = `.root {
  --_bevel: var(--bevel-raised);

  box-shadow: var(--_bevel);
  opacity: var(--opacity-disabled);
  text-shadow: var(--text-etch);
  translate: var(--offset-pressed) var(--offset-pressed);
  outline-offset: var(--focus-offset);
  text-underline-offset: var(--underline-offset);
  text-decoration-thickness: var(--underline-thickness);
}
`;
    expect(await lintModule(valid)).toEqual([]);
  });

  it.each([
    ["opacity", "opacity: 0.5;"],
    ["text-shadow", "text-shadow: 1px 1px 0 var(--color-text-disabled-etch);"],
    ["translate", "translate: 1px 1px;"],
    ["outline-offset", "outline-offset: 2px;"],
    ["text-underline-offset", "text-underline-offset: 3px;"],
    ["text-decoration-thickness", "text-decoration-thickness: 1px;"],
    ["color", "color: #000;"],
  ])("rifiuta un valore letterale in %s", async (_property, declaration) => {
    const rules = await lintModule(`.root {\n  ${declaration}\n}\n`);
    expect(rules.length).toBeGreaterThan(0);
  });

  it("ammette le proprietà private con il prefisso _ e rifiuta i nomi non validi", async () => {
    expect(await lintModule(".root {\n  --_halo: var(--no-shadow);\n}\n")).toEqual([]);
    expect(await lintModule(".root {\n  --Halo: var(--no-shadow);\n}\n")).toContain(
      "custom-property-pattern",
    );
  });
});
