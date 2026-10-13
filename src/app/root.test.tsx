import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import App, { Layout, links } from "./root";

function renderDocument(path: string, routeId: string) {
  const Stub = createRoutesStub([
    {
      id: "root",
      path: "/",
      Component: () => (
        <Layout>
          <App />
        </Layout>
      ),
      children: [{ id: routeId, path: "*", Component: () => <main>contenuto</main> }],
    },
  ]);
  return renderToString(<Stub initialEntries={[path]} />);
}

describe("root", () => {
  it("collega i fogli di stile dei token e globali", () => {
    expect(links()).toEqual([
      expect.objectContaining({ rel: "stylesheet" }),
      expect.objectContaining({ rel: "stylesheet" }),
    ]);
  });

  it("imposta lang in base alla lingua del percorso", () => {
    expect(renderDocument("/en/", "desktop-en")).toContain('<html lang="en">');
    expect(renderDocument("/", "desktop-it")).toContain('<html lang="it">');
  });

  it("usa la lingua di default per la pagina non trovata", () => {
    expect(renderDocument("/en/inesistente", "not-found")).toContain('<html lang="it">');
  });

  it("rende il contenuto della route figlia", () => {
    expect(renderDocument("/en/", "desktop-en")).toContain("<main>contenuto</main>");
  });
});
