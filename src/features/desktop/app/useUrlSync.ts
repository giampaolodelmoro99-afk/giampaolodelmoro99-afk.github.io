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

type Pending = { path: string; isBack: boolean };

export function useUrlSync(onRoute: (routeKey: RouteKey) => void): UrlSync {
  const navigate = useNavigate();
  const location = useLocation();
  const routeKey = routeKeyFromPathname(location.pathname) ?? "desktop";
  const lastEntry = useRef(location.key);
  const pending = useRef<Pending | null>(null);
  const queued = useRef<(() => void) | null>(null);
  const latest = useRef<{ location: Location; routeKey: RouteKey }>({ location, routeKey });

  useLayoutEffect(() => {
    latest.current = { location, routeKey };
  });

  const arrive = useEffectEvent((entry: string) => {
    if (entry === lastEntry.current) return;
    lastEntry.current = entry;
    const current = location;
    const key = routeKey;
    const wanted = pending.current;
    pending.current = null;
    if (wanted?.isBack && !samePath(wanted.path, current.pathname)) {
      pending.current = { path: wanted.path, isBack: false };
      void navigate(wanted.path, { replace: true, state: current.state });
      return;
    }
    if (wanted === null || !samePath(wanted.path, current.pathname)) onRoute(key);
    const next = queued.current;
    queued.current = null;
    next?.();
  });

  const entry = location.key;
  useEffect(() => {
    arrive(entry);
  }, [entry]);

  const target = (app: AppId | null) => {
    const { location: current, routeKey: key } = latest.current;
    const to = pathFor(app, key, localeFromPathname(current.pathname));
    if (to === null || samePath(to, current.pathname)) return null;
    return { to, current };
  };

  const whenIdle = (action: () => void) => {
    if (pending.current?.isBack) queued.current = action;
    else action();
  };

  const push = (app: AppId | null) =>
    whenIdle(() => {
      const next = target(app);
      if (!next) return;
      pending.current = { path: next.to, isBack: false };
      void navigate(next.to, { state: { back: next.current.pathname } });
    });

  const settle = (app: AppId | null) =>
    whenIdle(() => {
      const next = target(app);
      if (!next) return;
      const back = backPathOf(next.current.state);
      if (back !== null && represents(back, app)) {
        pending.current = { path: back, isBack: true };
        void navigate(-1);
        return;
      }
      pending.current = { path: next.to, isBack: false };
      void navigate(next.to, { replace: true, state: back === null ? null : { back } });
    });

  return { routeKey, push, settle };
}
