import type { ReactNode } from "react";
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
import globalHref from "../styles/global.css?url";
import tokensHref from "../styles/tokens.css?url";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: tokensHref },
  { rel: "stylesheet", href: globalHref },
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
  return <Outlet />;
}
