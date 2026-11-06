import { type DesktopState, deserialize, serialize } from "./state";

export const layoutStorageKey = "windows.v1";

type LayoutStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function defaultStorage(): LayoutStorage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readLayout(storage: LayoutStorage | null = defaultStorage()): DesktopState | null {
  if (!storage) return null;
  try {
    const text = storage.getItem(layoutStorageKey);
    if (text === null) return null;
    const state = deserialize(text);
    if (!state) storage.removeItem(layoutStorageKey);
    return state;
  } catch {
    return null;
  }
}

export function writeLayout(
  state: DesktopState,
  storage: LayoutStorage | null = defaultStorage(),
): string | null {
  if (!storage) return null;
  const text = serialize(state);
  try {
    storage.setItem(layoutStorageKey, text);
    return text;
  } catch {
    return null;
  }
}
