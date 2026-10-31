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

  it("riduce a icona: la finestra sparisce e il focus va al suo pulsante nella taskbar", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: "Riduci a icona" }));
    expect(screen.queryByRole("region", { name: "About" })).not.toBeInTheDocument();
    const button = screen.getByRole("button", { name: "About, ridotta a icona" });
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("data-active", "true");
  });

  it("il pulsante della finestra attiva nella taskbar la riduce a icona", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: "About", pressed: true }));
    expect(screen.queryByRole("region", { name: "About" })).not.toBeInTheDocument();
  });

  it("ingrandisce e ripristina dallo stesso pulsante, che cambia nome", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: "Ingrandisci" }));
    const about = screen.getByRole("region", { name: "About" });
    expect(about).toHaveAttribute("data-maximized", "true");
    await user.click(screen.getByRole("button", { name: "Ripristina" }));
    expect(about).not.toHaveAttribute("data-maximized");
  });

  it("i pulsanti della taskbar restano nell'ordine di apertura", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    await user.click(screen.getByRole("button", { name: "About" }));
    const toolbar = screen.getByRole("toolbar", { name: "Barra delle applicazioni" });
    const names = within(toolbar)
      .getAllByRole("button")
      .map((button) => button.getAttribute("aria-label") ?? button.textContent);
    expect(names.slice(-2)).toEqual(["About", "CV"]);
  });

  it("il menu della finestra riduce, ingrandisce e chiude, con un annuncio", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    const about = screen.getByRole("region", { name: "About" });
    await user.click(within(about).getByRole("button", { name: "Menu della finestra" }));
    await user.click(await screen.findByRole("menuitem", { name: "Ingrandisci" }));
    expect(about).toHaveAttribute("data-maximized", "true");
    await user.click(within(about).getByRole("button", { name: "Menu della finestra" }));
    await user.click(await screen.findByRole("menuitem", { name: "Chiudi" }));
    expect(screen.queryByRole("region", { name: "About" })).not.toBeInTheDocument();
    expect(screen.getByText("About: finestra chiusa")).toBeInTheDocument();
  });

  it("Sposta dal menu: frecce, Maiusc per i passi lunghi, Invio conferma", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    const about = screen.getByRole("region", { name: "About" });
    await user.click(within(about).getByRole("button", { name: "Menu della finestra" }));
    await user.click(await screen.findByRole("menuitem", { name: "Sposta" }));
    expect(screen.getByText(/Spostamento di About: usa le frecce/)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Spostamento e ridimensionamento" }),
    ).toBeInTheDocument();
    await user.keyboard("{ArrowRight}{ArrowRight}{Shift>}{ArrowDown}{/Shift}{Enter}");
    expect(about.style.getPropertyValue("--window-x")).toBe("16px");
    expect(about.style.getPropertyValue("--window-y")).toBe("32px");
    expect(screen.getByText("About: spostata")).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Spostamento e ridimensionamento" })).toBeNull();
    expect(document.getElementById("window-about-body")).toHaveFocus();
  });

  it("Esc durante Sposta riporta la finestra com'era", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    const about = screen.getByRole("region", { name: "About" });
    await user.click(within(about).getByRole("button", { name: "Menu della finestra" }));
    await user.click(await screen.findByRole("menuitem", { name: "Sposta" }));
    await user.keyboard("{ArrowLeft}{Escape}");
    expect(about.style.getPropertyValue("--window-x")).toBe("");
    expect(screen.getByText("Annullato")).toBeInTheDocument();
  });

  it("Ridimensiona con le frecce sullo schermo e OK", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    const about = screen.getByRole("region", { name: "About" });
    await user.click(within(about).getByRole("button", { name: "Menu della finestra" }));
    await user.click(await screen.findByRole("menuitem", { name: "Ridimensiona" }));
    await user.click(screen.getByRole("button", { name: "Destra" }));
    await user.click(screen.getByRole("button", { name: "Giù" }));
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(about.style.getPropertyValue("--window-w")).toBe("8px");
    expect(about.style.getPropertyValue("--window-h")).toBe("8px");
    expect(screen.getByText("About: ridimensionata")).toBeInTheDocument();
  });

  it("Alt+Spazio e Alt+trattino aprono il menu della finestra attiva, non nei campi di testo", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    document.getElementById("window-about-body")?.focus();
    await user.keyboard("{Alt>}{ }{/Alt}");
    expect(await screen.findByRole("menu", { name: "Menu della finestra" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await user.keyboard("{Alt>}-{/Alt}");
    expect(await screen.findByRole("menu", { name: "Menu della finestra" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    const input = document.createElement("input");
    document.body.append(input);
    input.focus();
    await user.keyboard("{Alt>}{ }{/Alt}");
    expect(screen.queryByRole("menu")).toBeNull();
    input.remove();
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
