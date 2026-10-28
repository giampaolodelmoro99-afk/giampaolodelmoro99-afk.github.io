import { createStore } from "zustand/vanilla";
import type { AppId } from "../../routes/routeMap";
import { type DesktopState, close, focus, open } from "./state";

export type DesktopActions = {
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
};

export type DesktopStore = ReturnType<typeof createDesktopStore>;

export function createDesktopStore(initial: DesktopState) {
  return createStore<DesktopState & DesktopActions>()((set) => ({
    ...initial,
    open: (id) => set((state) => open(state, id)),
    close: (id) => set((state) => close(state, id)),
    focus: (id) => set((state) => focus(state, id)),
  }));
}
