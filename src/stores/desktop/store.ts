import { createStore } from "zustand/vanilla";
import type { AppId, RouteKey } from "../../routes/routeMap";
import type { Geometry, Viewport } from "./geometry";
import {
  type DesktopState,
  close,
  deactivate,
  focus,
  followRoute,
  minimize,
  open,
  place,
  setViewport,
  toggleMaximize,
} from "./state";

export type DesktopActions = {
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  deactivate: () => void;
  followRoute: (routeKey: RouteKey) => void;
  minimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  place: (id: AppId, geometry: Geometry) => void;
  setViewport: (viewport: Viewport) => void;
};

export type DesktopStore = ReturnType<typeof createDesktopStore>;

export function createDesktopStore(initial: DesktopState) {
  return createStore<DesktopState & DesktopActions>()((set) => ({
    ...initial,
    open: (id) => set((state) => open(state, id)),
    close: (id) => set((state) => close(state, id)),
    focus: (id) => set((state) => focus(state, id)),
    deactivate: () => set((state) => deactivate(state)),
    followRoute: (routeKey) => set((state) => followRoute(state, routeKey)),
    minimize: (id) => set((state) => minimize(state, id)),
    toggleMaximize: (id) => set((state) => toggleMaximize(state, id)),
    place: (id, geometry) => set((state) => place(state, id, geometry)),
    setViewport: (viewport) => set((state) => setViewport(state, viewport)),
  }));
}
