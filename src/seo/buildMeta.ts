import type { MetaDescriptor } from "react-router";
import { githubUrl, personName, siteUrl, themeColor } from "../config/site";
import { getDictionary } from "../i18n";
import { type Locale, type RouteKey, defaultLocale, locales, routeMap } from "../routes/routeMap";

export function absoluteUrl(href: string): string {
  return new URL(href, siteUrl).href;
}

export function jsonLd(locale: Locale, key: RouteKey): Record<string, unknown> {
  const t = getDictionary(locale);
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: personName,
        jobTitle: t.person.jobTitle,
        url: absoluteUrl("/"),
        sameAs: [githubUrl],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: t.meta.siteName,
        url: absoluteUrl("/"),
        inLanguage: locales,
        author: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${absoluteUrl(routeMap[key][locale])}#page`,
        url: absoluteUrl(routeMap[key][locale]),
        name: t.meta[key].title,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
    ],
  };
}

export function buildMeta(locale: Locale, key: RouteKey): MetaDescriptor[] {
  const t = getDictionary(locale);
  const { title, description } = t.meta[key];
  const canonical = absoluteUrl(routeMap[key][locale]);
  const alternates = locales.filter((other) => other !== locale);
  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: personName },
    { name: "theme-color", content: themeColor },
    { tagName: "link", rel: "canonical", href: canonical },
    ...locales.map((hrefLang) => ({
      tagName: "link",
      rel: "alternate",
      hrefLang,
      href: absoluteUrl(routeMap[key][hrefLang]),
    })),
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: absoluteUrl(routeMap[key][defaultLocale]),
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: t.meta.siteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:locale", content: t.meta.ogLocale },
    ...alternates.map((other) => ({
      property: "og:locale:alternate",
      content: getDictionary(other).meta.ogLocale,
    })),
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { "script:ld+json": jsonLd(locale, key) },
  ];
}
