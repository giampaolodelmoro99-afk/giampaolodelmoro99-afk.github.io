import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { prerenderPaths } from "../../routes/routeMap";
import App, { Layout } from "../root";
import routes from "../routes";
import AppRoute, { meta as appMeta } from "./app";
import DesktopLayout from "./desktop-layout";
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
        {
          id: "desktop",
          Component: DesktopLayout,
          children: [
            { id: "desktop-it", index: true, Component: AppRoute, meta: appMeta },
            { id: "desktop-en", path: "en", Component: AppRoute, meta: appMeta },
          ],
        },
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

describe("configurazione delle route", () => {
  it("tutte le pagine del sito stanno sotto la route di layout del desktop, che resta montata tra una pagina e l'altra", () => {
    const [desktop, notFound] = routes;
    expect(routes).toHaveLength(2);
    expect(desktop).toMatchObject({ id: "desktop", file: "routes/desktop-layout.tsx" });
    const children = desktop?.children ?? [];
    expect(children.every((child) => child.file === "routes/app.tsx")).toBe(true);
    expect(
      children.map((child) => `/${child.path ?? ""}`.replace(/^\/\//, "/")).toSorted(),
    ).toEqual(
      prerenderPaths()
        .filter((path) => path !== "/404")
        .toSorted(),
    );
    expect(notFound).toMatchObject({ id: "not-found", path: "*" });
  });
});
