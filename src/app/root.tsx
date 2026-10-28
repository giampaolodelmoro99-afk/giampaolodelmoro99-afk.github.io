import { type ReactNode, useEffect } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useMatches,
} from "react-router";
import { type Locale, defaultLocale, intlLocales, localeFromPathname } from "../routes/routeMap";
import proseHref from "../assets/fonts/IBMPlexSans-Regular-Latin1.woff2?url";
import pixelOperatorBoldHref from "../assets/fonts/pixel-operator-700.woff2?url";
import globalHref from "../styles/global.css?url";
import { pressableStyleId } from "../styles/reactAriaPressable";
import type { Route } from "./+types/root";

const fontPreload = (href: string) => ({
  rel: "preload",
  href,
  as: "font",
  type: "font/woff2",
  crossOrigin: "anonymous" as const,
});

export const links: Route.LinksFunction = () => [
  fontPreload(pixelOperatorBoldHref),
  fontPreload(proseHref),
  { rel: "stylesheet", href: globalHref, id: pressableStyleId },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

function usePageLocale(): Locale {
  const { pathname } = useLocation();
  const isNotFound = useMatches().some((match) => match.id === "not-found");
  return isNotFound ? defaultLocale : localeFromPathname(pathname);
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang={usePageLocale()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const locale = usePageLocale();
  useEffect(() => {
    document.documentElement.dataset["hydrated"] = "true";
  }, []);
  return (
    <I18nProvider locale={intlLocales[locale]}>
      <Outlet />
    </I18nProvider>
  );
}
