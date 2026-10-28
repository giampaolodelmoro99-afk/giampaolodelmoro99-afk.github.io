import { useLocale } from "react-aria-components/I18nProvider";
import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { pressableStyleId } from "../styles/reactAriaPressable";
import App, { Layout, links } from "./root";

function AriaLocale() {
  return <output>{useLocale().locale}</output>;
}

function renderDocument(path: string, routeId: string, Child = () => <main>contenuto</main>) {
  const Stub = createRoutesStub([
    {
      id: "root",
      path: "/",
      Component: () => (
        <Layout>
          <App />
        </Layout>
      ),
      children: [{ id: routeId, path: "*", Component: Child }],
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

  it("passa a React Aria la lingua della route, non quella del browser", () => {
    expect(renderDocument("/en/", "desktop-en", AriaLocale)).toContain("<output>en-US</output>");
    expect(renderDocument("/profilo", "desktop-it", AriaLocale)).toContain(
      "<output>it-IT</output>",
    );
    expect(renderDocument("/en/inesistente", "not-found", AriaLocale)).toContain(
      "<output>it-IT</output>",
    );
  });

  it("rende il contenuto della route figlia", () => {
    expect(renderDocument("/en/", "desktop-en")).toContain("<main>contenuto</main>");
  });
});
