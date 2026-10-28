import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import App, { Layout } from "../root";
import DesktopRoute, { meta as desktopMeta } from "./desktop";
import NotFoundRoute, { meta as notFoundMeta } from "./not-found";

function renderDocument(path: string) {
  const Stub = createRoutesStub([
    {
      id: "root",
      path: "/",
      Component: () => (
        <Layout>
          <App />
        </Layout>
      ),
      children: [
        { id: "desktop-it", index: true, Component: DesktopRoute, meta: desktopMeta },
        { id: "desktop-en", path: "en", Component: DesktopRoute, meta: desktopMeta },
        { id: "not-found", path: "*", Component: NotFoundRoute, meta: notFoundMeta },
      ],
    },
  ]);
  return renderToString(<Stub initialEntries={[path]} />);
}

describe("route desktop", () => {
  it("rende il desktop con i metadati della lingua del percorso", () => {
    const html = renderDocument("/en/");
    expect(html).toContain('<link rel="canonical" href="https://gianpaolodelmoro.it/en/"/>');
    expect(html).toContain("<h1");
    expect(html).toContain("Full Stack Developer · ITS Academy Prodigi student");
  });
});

describe("route not-found", () => {
  it("rende la pagina di errore esclusa dall'indicizzazione", () => {
    const html = renderDocument("/inesistente");
    expect(html).toContain('<meta name="robots" content="noindex"/>');
    expect(html).toContain("Pagina non trovata");
  });
});
