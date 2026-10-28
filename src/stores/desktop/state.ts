import { type AppId, type RouteKey, appIds } from "../../routes/routeMap";

export type WindowStatus = "normal" | "minimized" | "maximized";

export type Geometry = { x: number; y: number; width: number; height: number };

export type WindowState = {
  id: AppId;
  status: WindowStatus;
  geometry: Geometry | null;
  restore: Geometry | null;
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
};

export const homeApp: AppId = "about";

export function openAppFor(routeKey: RouteKey): AppId {
  return routeKey === "desktop" ? homeApp : routeKey;
}

export const emptyState: DesktopState = {
  version: 1,
  windows: {},
  stack: [],
  recent: [],
  activeId: null,
  layoutMode: "desktop",
};

export function initialStateFor(routeKey: RouteKey): DesktopState {
  return open(emptyState, openAppFor(routeKey));
}

const withoutId = (ids: AppId[], id: AppId) => ids.filter((candidate) => candidate !== id);

function topVisible(state: Pick<DesktopState, "windows" | "recent">): AppId | null {
  return state.recent.find((id) => state.windows[id]?.status !== "minimized") ?? null;
}

export function focus(state: DesktopState, id: AppId): DesktopState {
  const window = state.windows[id];
  if (!window) return state;
  return {
    ...state,
    windows:
      window.status === "minimized"
        ? { ...state.windows, [id]: { ...window, status: "normal" } }
        : state.windows,
    stack: [...withoutId(state.stack, id), id],
    recent: [id, ...withoutId(state.recent, id)],
    activeId: id,
  };
}

export function open(state: DesktopState, id: AppId): DesktopState {
  if (state.windows[id]) return focus(state, id);
  const window: WindowState = {
    id,
    status: "normal",
    geometry: null,
    restore: null,
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

export function zIndexOf(state: DesktopState, id: AppId): number {
  return state.stack.indexOf(id);
}

const isAppId = (value: unknown): value is AppId =>
  typeof value === "string" && appIds.some((id) => id === value);

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isGeometry = (value: unknown): value is Geometry =>
  typeof value === "object" &&
  value !== null &&
  ["x", "y", "width", "height"].every((key) => isNumber(Reflect.get(value, key)));

const statuses: readonly WindowStatus[] = ["normal", "minimized", "maximized"];

function parseWindow(value: unknown): WindowState | null {
  if (typeof value !== "object" || value === null) return null;
  const id: unknown = Reflect.get(value, "id");
  const status: unknown = Reflect.get(value, "status");
  const geometry: unknown = Reflect.get(value, "geometry");
  const restore: unknown = Reflect.get(value, "restore");
  const cascade: unknown = Reflect.get(value, "cascade");
  if (!isAppId(id) || !statuses.some((candidate) => candidate === status)) return null;
  if (geometry !== null && !isGeometry(geometry)) return null;
  if (restore !== null && !isGeometry(restore)) return null;
  if (!isNumber(cascade)) return null;
  return {
    id,
    status: statuses.find((candidate) => candidate === status) ?? "normal",
    geometry,
    restore,
    cascade,
  };
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
  };
}
