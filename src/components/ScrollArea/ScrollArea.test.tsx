import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { ScrollArea } from "./ScrollArea";

describe("ScrollArea", () => {
  it("è una regione con nome raggiungibile da tastiera", async () => {
    render(
      <ScrollArea label="Note di rilascio">
        <p>Testo lungo</p>
      </ScrollArea>,
    );
    const region = screen.getByRole("region", { name: "Note di rilascio" });
    expect(region).toHaveAttribute("tabindex", "0");
    await userEvent.tab();
    expect(region).toHaveFocus();
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(
      <ScrollArea label="Note di rilascio">
        <p>Testo lungo</p>
      </ScrollArea>,
    );
    await expectNoAxeViolations(container);
  });
});
