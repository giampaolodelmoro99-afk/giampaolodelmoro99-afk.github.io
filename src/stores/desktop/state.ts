import { type AppId, type RouteKey, appIds } from "../../routes/routeMap";
import { homeApp, openAppFor } from "./home";
import { type Geometry, type Viewport, clampGeometry, isGeometry, isNumber } from "./geometry";

export type WindowState = {
  id: AppId;
  maximized: boolean;
  minimized: boolean;
  geometry: Geometry | null;
  cascade: number;
};

export type LayoutMode = "desktop" | "mobile";

export type DesktopState = {
  version: 1;
  windows: Partial<Record<AppId, WindowState>>;
  stack: AppId[];
  recent: AppId[];
  activeId: AppId | null;
  layoutMode: LayoutMode;
  viewport: Viewport | null;
};

export { homeApp, openAppFor } from "./home";

export const emptyState: DesktopState = {
  version: 1,
  windows: {},
  stack: [],
  recent: [],
  activeId: null,
  layoutMode: "desktop",
  viewport: null,
};

export function initialStateFor(routeKey: RouteKey): DesktopState {
  return open(emptyState, openAppFor(routeKey));
}

const withoutId = (ids: AppId[], id: AppId) => ids.filter((candidate) => candidate !== id);

function topVisible(state: Pick<DesktopState, "windows" | "recent">): AppId | null {
  return state.recent.find((id) => state.windows[id]?.minimized === false) ?? null;
}

function update(state: DesktopState, id: AppId, change: Partial<WindowState>): DesktopState {
  const window = state.windows[id];
  if (!window) return state;
  return { ...state, windows: { ...state.windows, [id]: { ...window, ...change } } };
}

export function focus(state: DesktopState, id: AppId): DesktopState {
  const window = state.windows[id];
  if (!window) return state;
  if (state.activeId === id && !window.minimized && state.stack.at(-1) === id) return state;
  const restored = window.minimized ? update(state, id, { minimized: false }) : state;
  return {
    ...restored,
    stack: [...withoutId(state.stack, id), id],
    recent: [id, ...withoutId(state.recent, id)],
    activeId: id,
  };
}

export function open(state: DesktopState, id: AppId): DesktopState {
  if (state.windows[id]) return focus(state, id);
  const window: WindowState = {
    id,
    maximized: false,
    minimized: false,
    geometry: null,
    cascade: state.stack.length,
  };
  return focus({ ...state, windows: { ...state.windows, [id]: window } }, id);
}

export function close(state: DesktopState, id: AppId): DesktopState {
  if (!state.windows[id]) return state;
  const { [id]: _closed, ...windows } = state.windows;
  const recent = withoutId(state.recent, id);
  return {
    ...state,
    windows,
    stack: withoutId(state.stack, id),
    recent,
    activeId: topVisible({ windows, recent }),
  };
}

export function minimize(state: DesktopState, id: AppId): DesktopState {
  if (!state.windows[id]) return state;
  const minimized = update(state, id, { minimized: true });
  return { ...minimized, activeId: topVisible(minimized) };
}

export function restore(saved: DesktopState | null, routeKey: RouteKey): DesktopState {
  const base = initialStateFor(routeKey);
  if (!saved) return base;
  const app = openAppFor(routeKey);
  const urlWindow = base.windows[app];
  if (!urlWindow) return base;
  const others = (ids: AppId[]) => ids.filter((id) => id !== app && saved.windows[id]);
  return {
    ...base,
    windows: { ...saved.windows, [app]: urlWindow },
    stack: [...others(saved.stack), app],
    recent: [app, ...others(saved.recent)],
    activeId: app,
  };
}

export function deactivate(state: DesktopState): DesktopState {
  return state.activeId === null ? state : { ...state, activeId: null };
}

export function followRoute(state: DesktopState, routeKey: RouteKey): DesktopState {
  if (routeKey === "desktop") {
    if (state.windows[homeApp]) return focus(state, homeApp);
    return deactivate(state);
  }
  return open(state, routeKey);
}

export function toggleMaximize(state: DesktopState, id: AppId): DesktopState {
  const window = state.windows[id];
  if (!window) return state;
  return focus(update(state, id, { maximized: !window.maximized }), id);
}

export function place(state: DesktopState, id: AppId, geometry: Geometry): DesktopState {
  if (!state.windows[id]) return state;
  const placed = state.viewport ? clampGeometry(geometry, state.viewport) : geometry;
  return update(state, id, { geometry: placed, maximized: false });
}

export function setViewport(state: DesktopState, viewport: Viewport): DesktopState {
  const windows: DesktopState["windows"] = {};
  for (const window of Object.values(state.windows)) {
    windows[window.id] = window.geometry
      ? { ...window, geometry: clampGeometry(window.geometry, viewport) }
      : window;
  }
  return { ...state, windows, viewport };
}

export function zIndexOf(state: DesktopState, id: AppId): number {
  return state.stack.indexOf(id);
}

const isAppId = (value: unknown): value is AppId =>
  typeof value === "string" && appIds.some((id) => id === value);

function parseWindow(value: unknown): WindowState | null {
  if (typeof value !== "object" || value === null) return null;
  const id: unknown = Reflect.get(value, "id");
  const maximized: unknown = Reflect.get(value, "maximized");
  const minimized: unknown = Reflect.get(value, "minimized");
  const geometry: unknown = Reflect.get(value, "geometry");
  const cascade: unknown = Reflect.get(value, "cascade");
  if (!isAppId(id) || typeof maximized !== "boolean" || typeof minimized !== "boolean") {
    return null;
  }
  if (geometry !== null && !isGeometry(geometry)) return null;
  if (!isNumber(cascade)) return null;
  return { id, maximized, minimized, geometry, cascade };
}

export function serialize(state: DesktopState): string {
  return JSON.stringify({
    version: state.version,
    windows: Object.values(state.windows),
    stack: state.stack,
    recent: state.recent,
  });
}

export function deserialize(text: string, layoutMode: LayoutMode = "desktop"): DesktopState | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null || Reflect.get(data, "version") !== 1) return null;
  const rawWindows: unknown = Reflect.get(data, "windows");
  const rawStack: unknown = Reflect.get(data, "stack");
  const rawRecent: unknown = Reflect.get(data, "recent");
  if (!Array.isArray(rawWindows) || !Array.isArray(rawStack) || !Array.isArray(rawRecent)) {
    return null;
  }
  const parsed = rawWindows.map(parseWindow);
  if (parsed.some((window) => window === null)) return null;
  const windows: DesktopState["windows"] = {};
  for (const window of parsed) {
    if (window) windows[window.id] = window;
  }
  const ids = Object.keys(windows).filter(isAppId).toSorted();
  const stack = rawStack.filter(isAppId);
  const recent = rawRecent.filter(isAppId);
  const sameIds = (list: AppId[]) =>
    list.length === ids.length && [...list].toSorted().every((id, index) => id === ids[index]);
  if (!sameIds(stack) || !sameIds(recent)) return null;
  return {
    version: 1,
    windows,
    stack,
    recent,
    activeId: topVisible({ windows, recent }),
    layoutMode,
    viewport: null,
  };
}
