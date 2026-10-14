import { render, screen } from "@testing-library/react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("espone valore, nome e percentuale", () => {
    render(
      <I18nProvider locale="it-IT">
        <ProgressBar label="Download" value={40} />
      </I18nProvider>,
    );
    const bar = screen.getByRole("progressbar", { name: "Download" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("usa valueLabel con unità quando la percentuale non basta", () => {
    render(<ProgressBar label="Copia" value={3} maxValue={7} valueLabel="3 file su 7" />);
    expect(screen.getByRole("progressbar", { name: "Copia" })).toHaveAttribute(
      "aria-valuetext",
      "3 file su 7",
    );
  });

  it("indeterminata mostra «In corso…» nella lingua di React Aria e non ha valore", () => {
    const { rerender } = render(
      <I18nProvider locale="it-IT">
        <ProgressBar label="Invio" isIndeterminate />
      </I18nProvider>,
    );
    const bar = screen.getByRole("progressbar", { name: "Invio" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(screen.getByText("In corso…")).toBeInTheDocument();
    rerender(
      <I18nProvider locale="en-US">
        <ProgressBar label="Sending" isIndeterminate />
      </I18nProvider>,
    );
    expect(screen.getByRole("progressbar", { name: "Sending" })).toBeInTheDocument();
    expect(screen.getByText("In progress…")).toBeInTheDocument();
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(
      <>
        <ProgressBar label="Download" value={40} />
        <ProgressBar label="Invio" isIndeterminate />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
