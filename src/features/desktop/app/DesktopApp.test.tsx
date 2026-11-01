import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../../tests/setup/axe";
import { renderWithHistory } from "../../../../tests/setup/render";
import { DesktopApp } from "./DesktopApp";

function renderDesktop(path: string, onReady?: () => void) {
  return renderWithHistory(path, () => <DesktopApp {...(onReady ? { onReady } : {})} />);
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
    expect(within(projects).getByRole("heading", { level: 1 })).toHaveTextContent("Progetti");
    expect(
      within(screen.getByRole("region", { name: "About" })).getByRole("heading", { level: 2 }),
    ).toHaveTextContent("Gianpaolo Del Moro");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
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
    await waitFor(() => expect(document.getElementById("window-about-body")).toHaveFocus());
  });

  it("i link di About portano all'URL dell'app e la aprono in una finestra, accanto ad About", async () => {
    const user = userEvent.setup();
    const { pathname } = renderDesktop("/");
    const link = screen.getByRole("link", { name: "Vedere i progetti" });
    expect(link).toHaveAttribute("href", "/progetti/");
    await user.click(link);
    expect(pathname()).toBe("/progetti/");
    expect(screen.getByRole("region", { name: "Progetti" })).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("region", { name: "About" })).toBeInTheDocument();
    await waitFor(() => expect(document.getElementById("window-projects-body")).toHaveFocus());
    expect(screen.getByText("Progetti: finestra aperta")).toBeInTheDocument();
  });

  it("i pulsanti della barra delle finestre inattive escono dall'ordine di Tab", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    const about = screen.getByRole("region", { name: "About" });
    const cv = screen.getByRole("region", { name: "CV" });
    for (const button of within(about).getAllByRole("button")) {
      expect(button).toHaveAttribute("tabindex", "-1");
    }
    for (const button of within(cv).getAllByRole("button")) {
      expect(button).not.toHaveAttribute("tabindex", "-1");
    }
    await user.click(within(about).getByRole("button", { name: "Chiudi" }));
    expect(screen.queryByRole("region", { name: "About" })).toBeNull();
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
    const button = screen.getByRole("button", { name: "About, finestra ridotta a icona" });
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
    expect(screen.getByText("About: finestra spostata")).toBeInTheDocument();
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
    expect(screen.getByText("About: finestra ridimensionata")).toBeInTheDocument();
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

  it("il pulsante Finestre apre il selettore sulla finestra successiva e una scelta la attiva", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    const windows = screen.getByRole("button", { name: "Finestre aperte (Alt+W)" });
    await user.click(windows);
    const dialog = await screen.findByRole("dialog", { name: "Finestre aperte" });
    expect(within(dialog).getByRole("option", { name: "About" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(windows).toHaveAttribute("aria-expanded", "true");
    await user.click(within(dialog).getByRole("option", { name: "About" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("data-active", "true");
  });

  it("Alt+W apre il selettore, Alt+W avanza, il rilascio di Alt attiva la scelta", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "Skills" }));
    await user.keyboard("{Alt>}w");
    const dialog = await screen.findByRole("dialog", { name: "Finestre aperte" });
    expect(within(dialog).getByRole("option", { name: "CV" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("w");
    expect(within(dialog).getByRole("option", { name: "About" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{Shift>}w{/Shift}");
    expect(within(dialog).getByRole("option", { name: "CV" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{/Alt}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "true");
  });

  it("senza finestre il pulsante Finestre resta raggiungibile ma non apre nulla", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: "Chiudi" }));
    const windows = screen.getByRole("button", { name: "Finestre aperte: nessuna" });
    expect(windows).toHaveAttribute("aria-disabled", "true");
    await user.click(windows);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("nel menu Start Esegui… e Spegni… dichiarano di aprire un dialog", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    for (const name of ["Esegui…", "Spegni…"]) {
      expect(screen.getByRole("menuitem", { name })).toHaveAttribute("aria-haspopup", "dialog");
    }
    expect(screen.getByRole("menuitem", { name: "Progetti" })).not.toHaveAttribute("aria-haspopup");
  });

  it("Start › Esegui… apre un'app per nome; un nome sconosciuto mostra l'errore", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "Esegui…" }));
    const field = await screen.findByRole("textbox", { name: "Apri" });
    await user.type(field, "xyz{Enter}");
    expect(field).toHaveAccessibleDescription(
      'Non trovo "xyz". Prova con progetti, cv o contatti.',
    );
    await waitFor(() =>
      expect(document.querySelector("main [aria-live=polite]")).toHaveTextContent(
        'Non trovo "xyz". Prova con progetti, cv o contatti.',
      ),
    );
    await user.clear(field);
    await user.type(field, "progetti{Enter}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Esegui" })).toBeNull());
    expect(screen.getByRole("region", { name: "Progetti" })).toHaveAttribute("data-active", "true");
  });

  it("Annulla in Esegui… riporta il focus su Start", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    const start = screen.getByRole("button", { name: /Start/ });
    await user.click(start);
    await user.click(screen.getByRole("menuitem", { name: "Esegui…" }));
    await user.click(await screen.findByRole("button", { name: "Annulla" }));
    await waitFor(() => expect(start).toHaveFocus());
  });

  it("Spegni porta al congedo con il titolo della scheda; Riaccendi riporta un desktop vuoto", async () => {
    const user = userEvent.setup();
    const title = document.title;
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "Spegni…" }));
    await screen.findByRole("dialog", { name: "Spegni" });
    await user.click(screen.getByRole("button", { name: "OK" }));
    const restart = await screen.findByRole("button", { name: "Riaccendi" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Puoi chiudere questa scheda.",
    );
    expect(document.title).toBe("Spento · Gianpaolo Del Moro");
    expect(screen.queryByRole("toolbar")).toBeNull();
    await waitFor(() => expect(restart).toHaveFocus());
    await user.click(restart);
    expect(document.title).toBe(title);
    expect(await screen.findByRole("grid", { name: "Icone del desktop" })).toBeInTheDocument();
    expect(screen.queryByRole("region")).toBeNull();
    await waitFor(() => expect(screen.getByRole("row", { name: "About" })).toHaveFocus());
  });

  it("Riavvia riporta un desktop vuoto senza passare dal congedo", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "Spegni…" }));
    await user.click(await screen.findByRole("radio", { name: "Riavvia" }));
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(await screen.findByRole("grid", { name: "Icone del desktop" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Riaccendi" })).toBeNull();
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("Annulla in Spegni… lascia il desktop com'era e riporta il focus su Start", async () => {
    const user = userEvent.setup();
    renderDesktop("/");
    const start = screen.getByRole("button", { name: /Start/ });
    await user.click(start);
    await user.click(screen.getByRole("menuitem", { name: "Spegni…" }));
    await user.click(await screen.findByRole("button", { name: "Annulla" }));
    await waitFor(() => expect(start).toHaveFocus());
    expect(screen.getByRole("region", { name: "About" })).toBeInTheDocument();
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

async function go(router: ReturnType<typeof renderDesktop>["router"], delta: number) {
  await act(async () => {
    await router.navigate(delta);
  });
}

describe("DesktopApp e URL", () => {
  it("aprire una finestra cambia l'URL; chiuderla torna alla voce della home", async () => {
    const user = userEvent.setup();
    const { pathname, router } = renderDesktop("/");
    await user.dblClick(screen.getByRole("row", { name: "Progetti" }));
    expect(pathname()).toBe("/progetti/");
    const projects = screen.getByRole("region", { name: "Progetti" });
    await user.click(within(projects).getByRole("button", { name: "Chiudi" }));
    await waitFor(() => expect(pathname()).toBe("/"));
    expect(router.state.historyAction).toBe("POP");
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("data-active", "true");
  });

  it("Indietro torna alla finestra precedente senza chiudere, Avanti la riporta in primo piano", async () => {
    const user = userEvent.setup();
    const { pathname, router } = renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    expect(pathname()).toBe("/cv/");
    await go(router, -1);
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "false");
    await waitFor(() => expect(document.getElementById("window-about-body")).toHaveFocus());
    await go(router, 1);
    expect(screen.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "true");
    await waitFor(() => expect(document.getElementById("window-cv-body")).toHaveFocus());
  });

  it("Avanti verso una finestra chiusa la riapre e lo annuncia", async () => {
    const user = userEvent.setup();
    const { pathname, router } = renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    await user.click(
      within(screen.getByRole("region", { name: "CV" })).getByRole("button", { name: "Chiudi" }),
    );
    await waitFor(() => expect(pathname()).toBe("/"));
    await go(router, 1);
    expect(pathname()).toBe("/cv/");
    expect(screen.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "true");
    expect(screen.getByText("CV: finestra aperta")).toBeInTheDocument();
  });

  it("la home senza About lascia le finestre al loro posto, nessuna attiva, con il focus sulle icone", async () => {
    const user = userEvent.setup();
    const { pathname, router } = renderDesktop("/");
    await user.click(screen.getByRole("button", { name: "Chiudi" }));
    expect(pathname()).toBe("/");
    await user.dblClick(screen.getByRole("row", { name: "CV" }));
    expect(pathname()).toBe("/cv/");
    await go(router, -1);
    expect(screen.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "false");
    await waitFor(() => expect(screen.getByRole("row", { name: "About" })).toHaveFocus());
    expect(screen.queryByRole("button", { pressed: true })).toBeNull();
  });

  it("ridurre l'unica finestra porta l'URL sulla home, sostituendo la voce", async () => {
    const user = userEvent.setup();
    const { pathname, router } = renderDesktop("/cv/");
    await user.click(screen.getByRole("button", { name: "Riduci a icona" }));
    expect(pathname()).toBe("/");
    expect(router.state.historyAction).toBe("REPLACE");
  });

  it("attivare una finestra con il clic aggiunge la sua voce", async () => {
    const user = userEvent.setup();
    const { pathname } = renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    await user.click(screen.getByRole("region", { name: "About" }));
    expect(pathname()).toBe("/profilo/");
  });

  it("cambiare lingua tiene aperte le finestre", async () => {
    const user = userEvent.setup();
    const { pathname } = renderDesktop("/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "CV" }));
    await user.click(screen.getByRole("link", { name: "EN, English version" }));
    expect(pathname()).toBe("/en/cv/");
    expect(screen.getByRole("region", { name: "CV" })).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("region", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "IT, Versione italiana" })).toHaveAttribute(
      "href",
      "/cv/",
    );
  });

  it("Riavvia riporta l'URL sulla home", async () => {
    const user = userEvent.setup();
    const { pathname } = renderDesktop("/progetti/");
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.click(screen.getByRole("menuitem", { name: "Spegni…" }));
    await user.click(await screen.findByRole("radio", { name: "Riavvia" }));
    await user.click(screen.getByRole("button", { name: "OK" }));
    await screen.findByRole("grid", { name: "Icone del desktop" });
    await waitFor(() => expect(pathname()).toBe("/"));
    expect(screen.queryByRole("region")).toBeNull();
  });
});
