import { type ReactNode, useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useMatches,
} from "react-router";
import { defaultLocale, localeFromPathname } from "../routes/routeMap";
import proseHref from "../assets/fonts/IBMPlexSans-Regular-Latin1.woff2?url";
import pixelOperatorBoldHref from "../assets/fonts/pixel-operator-700.woff2?url";
import globalHref from "../styles/global.css?url";
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
  { rel: "stylesheet", href: globalHref },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isNotFound = useMatches().some((match) => match.id === "not-found");
  return (
    <html lang={isNotFound ? defaultLocale : localeFromPathname(pathname)}>
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
  useEffect(() => {
    document.documentElement.dataset["hydrated"] = "true";
  }, []);
  return <Outlet />;
}
