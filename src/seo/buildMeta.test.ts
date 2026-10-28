import { describe, expect, it } from "vitest";
import { getDictionary } from "../i18n";
import { locales, routeKeys } from "../routes/routeMap";
import { absoluteUrl, buildMeta, jsonLd } from "./buildMeta";

type Entry = Record<string, unknown>;

function find(meta: ReturnType<typeof buildMeta>, predicate: (entry: Entry) => boolean): Entry[] {
  return meta.map((entry): Entry => ({ ...entry })).filter(predicate);
}

describe("buildMeta", () => {
  it("costruisce URL assoluti sul dominio del sito", () => {
    expect(absoluteUrl("/en/")).toBe("https://gianpaolodelmoro.it/en/");
  });

  it("genera title, description e canonical della lingua richiesta", () => {
    const meta = buildMeta("en", "desktop");
    expect(meta).toContainEqual({ title: "Gianpaolo Del Moro · Full Stack Developer" });
    expect(find(meta, (entry) => entry["name"] === "description")[0]).toMatchObject({
      content:
        "Portfolio of Gianpaolo Del Moro, Full Stack Developer and student at ITS Academy Prodigi in Pisa. Laravel and React projects in a Windows 95 style.",
    });
    expect(meta).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "https://gianpaolodelmoro.it/en/",
    });
  });

  it("usa il titolo approvato per Open Graph, Twitter e jobTitle", () => {
    const meta = buildMeta("it", "desktop");
    const approved = "Full Stack Developer · Studente ITS Academy Prodigi";
    expect(meta).toContainEqual({ property: "og:title", content: approved });
    expect(meta).toContainEqual({ name: "twitter:title", content: approved });
    expect(jsonLd("it", "desktop")["@graph"]).toContainEqual(
      expect.objectContaining({ "@type": "Person", jobTitle: approved }),
    );
  });

  it.each(locales)("rispetta le lunghezze di title e description (%s)", (locale) => {
    const t = getDictionary(locale);
    for (const key of routeKeys) {
      expect(t.meta[key].title.length).toBeLessThanOrEqual(60);
      expect(t.meta[key].description.length).toBeLessThanOrEqual(160);
    }
  });

  it("dichiara hreflang per ogni lingua e x-default sull'italiano", () => {
    const alternates = find(buildMeta("it", "desktop"), (entry) => entry["rel"] === "alternate");
    expect(alternates.map((entry) => [entry["hrefLang"], entry["href"]])).toEqual([
      ["it", "https://gianpaolodelmoro.it/"],
      ["en", "https://gianpaolodelmoro.it/en/"],
      ["x-default", "https://gianpaolodelmoro.it/"],
    ]);
  });

  it("imposta og:locale e og:locale:alternate", () => {
    const meta = buildMeta("it", "desktop");
    expect(meta).toContainEqual({ property: "og:locale", content: "it_IT" });
    expect(meta).toContainEqual({ property: "og:locale:alternate", content: "en_US" });
  });

  it("produce un JSON-LD con Person, WebSite e ProfilePage, senza email", () => {
    const data = jsonLd("it", "desktop");
    expect(data["@graph"]).toEqual([
      expect.objectContaining({ "@type": "Person" }),
      expect.objectContaining({ "@type": "WebSite" }),
      expect.objectContaining({ "@type": "ProfilePage" }),
    ]);
    expect(data["@graph"]).toContainEqual(
      expect.objectContaining({
        name: "Gianpaolo Del Moro",
        sameAs: ["https://github.com/giampaolodelmoro99-afk"],
      }),
    );
    expect(JSON.stringify(data)).not.toContain("@gmail");
  });
});
