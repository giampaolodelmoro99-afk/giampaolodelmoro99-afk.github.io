import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, it } from "vitest";
import { inlineScriptHashes, sha256Source } from "../../scripts/lib/csp.mjs";
import { bootId } from "../../scripts/lib/hydration.mjs";
import { githubUrl, siteUrl } from "../../src/config/site";
import { getDictionary } from "../../src/i18n";
import { type Locale, locales, routeKeys, routeMap } from "../../src/routes/routeMap";

const client = join(import.meta.dirname, "../../build/client");

function fileFor(href: string): string {
  return href === "/" ? join(client, "index.html") : join(client, href, "index.html");
}

async function load(file: string) {
  const html = await readFile(file, "utf8");
  return { html, document: new JSDOM(html).window.document };
}

function attr(document: Document, selector: string, name: string): string | null {
  return document.querySelector(selector)?.getAttribute(name) ?? null;
}

beforeAll(() => {
  if (!existsSync(client)) {
    throw new Error(
      "build/client non trovato: esegui `npm run build` prima di `npm run test:prerender`",
    );
  }
});

const pages = routeKeys.flatMap((key) =>
  locales.map((locale): [string, Locale, (typeof routeKeys)[number]] => [
    routeMap[key][locale],
    locale,
    key,
  ]),
);

describe.each(pages)("HTML prerenderizzato di %s", (href, locale, key) => {
  const t = getDictionary(locale);

  it("dichiara lingua, title e description", async () => {
    const { document } = await load(fileFor(href));
    expect(document.documentElement.lang).toBe(locale);
    expect(document.title).toBe(t.meta[key].title);
    expect(attr(document, 'meta[name="description"]', "content")).toBe(t.meta[key].description);
  });

  it("ha canonical e hreflang per tutte le lingue più x-default", async () => {
    const { document } = await load(fileFor(href));
    expect(attr(document, 'link[rel="canonical"]', "href")).toBe(`${siteUrl}${href}`);
    const alternates = [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(
      (link) => [link.getAttribute("hreflang"), link.getAttribute("href")],
    );
    expect(alternates).toEqual([
      ...locales.map((other) => [other, `${siteUrl}${routeMap[key][other]}`]),
      ["x-default", `${siteUrl}${routeMap[key].it}`],
    ]);
  });

  it("ha Open Graph e Twitter card", async () => {
    const { document } = await load(fileFor(href));
    expect(attr(document, 'meta[property="og:title"]', "content")).toBe(t.meta[key].title);
    expect(attr(document, 'meta[property="og:url"]', "content")).toBe(`${siteUrl}${href}`);
    expect(attr(document, 'meta[property="og:locale"]', "content")).toBe(t.meta.ogLocale);
    expect(attr(document, 'meta[name="twitter:card"]', "content")).toBeTruthy();
  });

  it("contiene un JSON-LD valido con Person, WebSite e ProfilePage", async () => {
    const { document } = await load(fileFor(href));
    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
    expect(scripts).toHaveLength(1);
    const data: unknown = JSON.parse(scripts[0]?.textContent ?? "");
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Person", sameAs: [githubUrl] },
        { "@type": "WebSite" },
        { "@type": "ProfilePage", inLanguage: locale },
      ],
    });
  });

  it("mostra il contenuto principale senza eseguire JavaScript", async () => {
    const { document } = await load(fileFor(href));
    expect(document.querySelector("main h1")?.textContent).toBe(t.desktop.heading);
    expect(document.querySelector("main")?.textContent).toContain(t.desktop.tagline);
  });

  it("ha la CSP come primo meta dopo il charset, con l'hash di ogni script inline", async () => {
    const { html, document } = await load(fileFor(href));
    const csp = document.head.children[1];
    expect(document.head.children[0]?.getAttribute("charset")).toBe("utf-8");
    expect(csp?.getAttribute("http-equiv")).toBe("Content-Security-Policy");
    const policy = csp?.getAttribute("content") ?? "";
    for (const hash of inlineScriptHashes(html)) {
      expect(policy).toContain(hash);
    }
    expect(policy).not.toContain("unsafe-inline");
  });

  it("rinvia l'idratazione: nessun modulepreload e payload di avvio consentito dalla CSP", async () => {
    const { html, document } = await load(fileFor(href));
    expect(html).not.toContain("modulepreload");
    const payload = document.getElementById(bootId);
    expect(payload?.getAttribute("type")).toBe("text/plain");
    expect(attr(document, 'meta[http-equiv="Content-Security-Policy"]', "content")).toContain(
      sha256Source(payload?.textContent ?? ""),
    );
  });

  it("precarica solo i due pesi di Pixel Operator, file esistenti e dello stesso sito", async () => {
    const { document } = await load(fileFor(href));
    const preloads = [...document.querySelectorAll('link[rel="preload"]')];
    expect(preloads.map((link) => link.getAttribute("href"))).toEqual([
      expect.stringMatching(/^\/assets\/pixel-operator-400-[\w-]+\.woff2$/),
      expect.stringMatching(/^\/assets\/pixel-operator-700-[\w-]+\.woff2$/),
    ]);
    for (const link of preloads) {
      expect(link.getAttribute("as")).toBe("font");
      expect(link.getAttribute("type")).toBe("font/woff2");
      expect(link.getAttribute("crossorigin")).toBe("anonymous");
      expect(existsSync(join(client, link.getAttribute("href") ?? ""))).toBe(true);
    }
  });
});

describe("404.html", () => {
  it("esiste, non è indicizzabile e spiega l'errore in italiano", async () => {
    const { document } = await load(join(client, "404.html"));
    expect(document.documentElement.lang).toBe("it");
    expect(attr(document, 'meta[name="robots"]', "content")).toBe("noindex");
    expect(document.querySelector("main h1")?.textContent).toBe(
      getDictionary("it").notFound.heading,
    );
  });
});

describe("dati personali nel build", () => {
  it("nessun file statico contiene l'indirizzo email in chiaro", async () => {
    const entries = await readdir(client, { recursive: true, withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && /\.(html|txt|xml|json)$/.test(entry.name))
      .map((entry) => join(entry.parentPath, entry.name));
    expect(files.length).toBeGreaterThan(0);
    const contents = await Promise.all(files.map((file) => readFile(file, "utf8")));
    const leaks = files.filter((_, index) => /delmoro99\s*@/i.test(contents[index] ?? ""));
    expect(leaks).toEqual([]);
  });
});

describe("Storybook in /storybook/", () => {
  const storybook = join(client, "storybook");

  it.each(["index.html", "iframe.html"])(
    "%s non è indicizzabile e ha una CSP dedicata come primo elemento di head",
    async (name) => {
      const { html, document } = await load(join(storybook, name));
      expect(attr(document, 'meta[name="robots"]', "content")).toBe("noindex, nofollow");
      expect(html).toMatch(/<head><meta http-equiv="Content-Security-Policy"/);
      const policy = attr(document, 'meta[http-equiv="Content-Security-Policy"]', "content") ?? "";
      for (const hash of inlineScriptHashes(html)) {
        expect(policy).toContain(hash);
      }
      expect(policy).not.toMatch(/unsafe-eval|https?:/);
      expect(policy).not.toMatch(/script-src[^;]*unsafe-inline/);
      expect(html.indexOf("<meta charset")).toBeGreaterThan(0);
      expect(html.indexOf("<meta charset")).toBeLessThan(1024);
    },
  );

  it("non pubblica project.json con le dipendenze di sviluppo", () => {
    expect(existsSync(join(storybook, "project.json"))).toBe(false);
  });

  it("robots.txt esclude Storybook", async () => {
    const robots = await readFile(join(client, "robots.txt"), "utf8");
    expect(robots.split("\n")).toContain("Disallow: /storybook/");
  });

  it.each(pages.map(([href]) => href))(
    "la pagina %s non riferisce Storybook e mantiene la CSP senza unsafe-inline",
    async (href) => {
      const { html, document } = await load(fileFor(href));
      expect(html).not.toContain("storybook");
      expect(attr(document, 'meta[http-equiv="Content-Security-Policy"]', "content")).not.toContain(
        "unsafe-inline",
      );
    },
  );
});
