import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../../tests/setup/axe";
import { renderAt } from "../../../../tests/setup/render";
import { routeKeyFromPathname } from "../../../routes/routeMap";
import { DesktopApp } from "./DesktopApp";

function renderDesktop(path: string, onReady?: () => void) {
  const key = routeKeyFromPathname(path) ?? "desktop";
  return renderAt(path, () => <DesktopApp routeKey={key} {...(onReady ? { onReady } : {})} />);
}

describe("DesktopApp", () => {
  it("parte con la finestra della route attiva, come il guscio statico", () => {
    renderDesktop("/");
    const about = screen.getByRole("region", { name: "About" });
    expect(about).toHaveAttribute("data-active", "true");
    expect(within(about).getByRole("heading", { level: 1 })).toHaveTextContent(
      "Gianpaolo Del Moro",
    );
    expect(screen.getByRole("button", { name: "About" })).toHaveAttribute("aria-pressed", "true");
  });

  it("dà ai componenti di React Aria la lingua della route, non quella del browser", () => {
    renderDesktop("/en/about/");
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    renderDesktop("/profilo/");
    expect(screen.getByRole("button", { name: "Chiudi" })).toBeInTheDocument();
  });

  it("apre un'app dal desktop con Invio e porta il focus nel suo corpo", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    const icons = screen.getByRole("grid", { name: "Icone del desktop" });
    await user.click(within(icons).getByRole("row", { name: "Progetti" }));
    await user.keyboard("{Enter}");
    const projects = screen.getByRole("region", { name: "Progetti" });
    expect(projects).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("data-active", "false");
    expect(document.getElementById("window-projects-body")).toHaveFocus();
    expect(within(projects).getByRole("heading", { level: 2 })).toHaveTextContent("Progetti");
  });

  it("apre un'app dal menu Start", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "Pannello di controllo" }));
    expect(screen.getByRole("region", { name: "Pannello di controllo" })).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("rende inerte il corpo delle finestre inattive e le attiva al clic", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    expect(document.getElementById("window-about-body")).toHaveAttribute("inert");
    await user.click(screen.getByRole("region", { name: "About" }));
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("data-active", "true");
    expect(document.getElementById("window-about-body")).not.toHaveAttribute("inert");
  });

  it("chiudendo una finestra attiva la successiva e, se non resta nulla, porta il focus alle icone", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    const cv = screen.getByRole("region", { name: "CV" });
    await user.click(within(cv).getByRole("button", { name: "Chiudi" }));
    expect(document.getElementById("window-about-body")).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Chiudi" }));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.getByRole("row", { name: "About" })).toHaveFocus();
  });

  it("attiva una finestra dal suo pulsante nella taskbar", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    await user.click(screen.getByRole("button", { name: "About" }));
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("data-active", "true");
  });

  it("segnala di essere pronto quando le icone sono nella griglia", async () => {
    const onReady = vi.fn<() => void>();
    renderDesktop("/", onReady);
    await waitFor(() => expect(onReady).toHaveBeenCalled());
    expect(screen.getAllByRole("row")).toHaveLength(11);
  });

  it("mostra l'ora con la sua etichetta", () => {
    renderDesktop("/");
    expect(screen.getByText("Ora")).toBeInTheDocument();
    expect(document.querySelector("time")?.getAttribute("dateTime")).toMatch(/^\d{4}-/);
  });

  it("non ha violazioni axe", async () => {
    const { container } = renderDesktop("/");
    await expectNoAxeViolations(container);
  });
});
