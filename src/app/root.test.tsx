import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { pressableStyleId } from "../styles/reactAriaPressable";
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

const fontPreload = (file: string) =>
  expect.objectContaining({
    rel: "preload",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
    href: expect.stringContaining(file),
  });

describe("root", () => {
  it("precarica il font pixel del titolo e quello delle frasi, poi foglio di stile (con l'id sentinella di React Aria) e favicon", () => {
    expect(links()).toEqual([
      fontPreload("pixel-operator-700"),
      fontPreload("IBMPlexSans-Regular-Latin1"),
      expect.objectContaining({ rel: "stylesheet", id: pressableStyleId }),
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
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
