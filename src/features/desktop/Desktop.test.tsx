import { screen, waitFor, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { renderAt } from "../../../tests/setup/render";
import { getDictionary } from "../../i18n";
import { locales, routeKeys, routeMap } from "../../routes/routeMap";
import { desktopApps } from "./apps";
import { Desktop } from "./Desktop";

describe("Desktop (guscio statico)", () => {
  it("sulla home apre About con nome, titolo approvato e bio", () => {
    renderAt("/", Desktop);
    const about = screen.getByRole("region", { name: "About" });
    expect(
      within(about).getByRole("heading", { level: 1, name: "Gianpaolo Del Moro" }),
    ).toBeInTheDocument();
    expect(
      within(about).getByText("Full Stack Developer · Studente ITS Academy Prodigi"),
    ).toBeInTheDocument();
    expect(within(about).getByText(getDictionary("it").about.bio)).toBeInTheDocument();
    expect(within(about).getByRole("link", { name: "Vedere i progetti" })).toHaveAttribute(
      "href",
      "/progetti/",
    );
  });

  it("mostra le icone del desktop come link alle route delle app, nella lingua della pagina", () => {
    renderAt("/en/", Desktop);
    const icons = within(screen.getByRole("navigation", { name: "Desktop icons" }));
    const links = icons.getAllByRole("link");
    expect(links).toHaveLength(desktopApps.length);
    expect(icons.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/en/projects/");
    expect(icons.getByRole("link", { name: "Simple view" })).toHaveAttribute(
      "href",
      "/en/simple-view/",
    );
  });

  it("su una route di un'app apre la sua finestra con il segnaposto", () => {
    renderAt("/progetti/", Desktop);
    const window = screen.getByRole("region", { name: "Progetti" });
    expect(within(window).getByRole("heading", { level: 1, name: "Progetti" })).toBeInTheDocument();
    expect(within(window).getByText(getDictionary("it").desktop.placeholder)).toBeInTheDocument();
  });

  it("porta lo skip link al corpo della finestra aperta", () => {
    renderAt("/en/about/", Desktop);
    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip).toHaveAttribute("href", "#window-about-body");
    expect(document.getElementById("window-about-body")).toHaveAttribute("tabindex", "-1");
  });

  it("collega la stessa app nell'altra lingua dalla taskbar", () => {
    renderAt("/contatti/", Desktop);
    const link = screen.getByRole("link", { name: "English version" });
    expect(link).toHaveAttribute("href", "/en/contact/");
    expect(link).toHaveAttribute("hreflang", "en");
    expect(link).toHaveAttribute("lang", "en");
  });

  it("nasconde ai lettori di schermo i controlli che richiedono JavaScript", () => {
    renderAt("/", Desktop);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Start").closest("[aria-hidden]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it.each(routeKeys.flatMap((key) => locales.map((locale) => [routeMap[key][locale]] as const)))(
    "non produce attributi style nel rendering lato server (%s)",
    (path) => {
      const Stub = createRoutesStub([{ path: "*", Component: Desktop }]);
      const html = renderToString(<Stub initialEntries={[path]} />);
      expect(html).not.toMatch(/\sstyle="/);
      expect(html.match(/<h1/g)).toHaveLength(1);
    },
  );

  it("dopo l'idratazione lascia il posto al desktop interattivo e conserva il focus", async () => {
    renderAt("/", Desktop);
    screen.getByRole("link", { name: "Salta al contenuto" }).focus();
    await waitFor(() => expect(screen.getByRole("grid")).toBeVisible());
    expect(screen.queryByRole("navigation", { name: "Icone del desktop" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Salta al contenuto" })).toHaveFocus();
  });

  it("riporta il focus sull'icona che lo aveva nel guscio", async () => {
    renderAt("/", Desktop);
    screen.getByRole("link", { name: "CV" }).focus();
    await waitFor(() => expect(screen.getByRole("row", { name: "CV" })).toHaveFocus());
  });

  it("non ha violazioni axe", async () => {
    const { container } = renderAt("/", Desktop);
    await expectNoAxeViolations(container);
  });
});
