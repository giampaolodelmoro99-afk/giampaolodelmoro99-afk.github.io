import { useEffect, useEffectEvent, useLayoutEffect, useRef } from "react";
import { type Location, useLocation, useNavigate } from "react-router";
import {
  type AppId,
  type RouteKey,
  localeFromPathname,
  routeKeyFromPathname,
} from "../../../routes/routeMap";
import { backPathOf, pathFor, represents, samePath } from "../url";

export type UrlSync = {
  routeKey: RouteKey;
  push: (target: AppId | null) => void;
  settle: (target: AppId | null) => void;
};

export function useUrlSync(onRoute: (routeKey: RouteKey) => void): UrlSync {
  const navigate = useNavigate();
  const location = useLocation();
  const routeKey = routeKeyFromPathname(location.pathname) ?? "desktop";
  const expected = useRef<string | null>(null);
  const previous = useRef(routeKey);
  const latest = useRef<{ location: Location; routeKey: RouteKey }>({ location, routeKey });

  useLayoutEffect(() => {
    latest.current = { location, routeKey };
  });

  const follow = useEffectEvent((pathname: string, key: RouteKey) => {
    const before = previous.current;
    previous.current = key;
    const wanted = expected.current;
    expected.current = null;
    if (wanted !== null && samePath(wanted, pathname)) return;
    if (key !== before) onRoute(key);
  });

  useEffect(() => {
    follow(location.pathname, routeKey);
  }, [location.pathname, routeKey]);

  const target = (app: AppId | null) => {
    const { location: current, routeKey: key } = latest.current;
    const to = pathFor(app, key, localeFromPathname(current.pathname));
    if (to === null || samePath(to, current.pathname)) return null;
    return { to, current };
  };

  return {
    routeKey,
    push: (app) => {
      const next = target(app);
      if (!next) return;
      expected.current = next.to;
      void navigate(next.to, { state: { back: next.current.pathname } });
    },
    settle: (app) => {
      const next = target(app);
      if (!next) return;
      const back = backPathOf(next.current.state);
      if (back !== null && represents(back, app)) {
        expected.current = back;
        void navigate(-1);
        return;
      }
      expected.current = next.to;
      void navigate(next.to, { replace: true, state: back === null ? null : { back } });
    },
  };
}
