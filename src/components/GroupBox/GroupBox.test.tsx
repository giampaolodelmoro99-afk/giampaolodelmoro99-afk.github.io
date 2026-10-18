import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Checkbox } from "../Checkbox";
import { GroupBox } from "./GroupBox";

describe("GroupBox", () => {
  it("è un gruppo con il nome dalla legenda", () => {
    render(
      <GroupBox legend="Orologio">
        <Checkbox>Mostra i secondi</Checkbox>
      </GroupBox>,
    );
    const group = screen.getByRole("group", { name: "Orologio" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group).toContainElement(screen.getByRole("checkbox", { name: "Mostra i secondi" }));
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(
      <GroupBox legend="Orologio">
        <Checkbox>Mostra i secondi</Checkbox>
      </GroupBox>,
    );
    await expectNoAxeViolations(container);
  });
});
