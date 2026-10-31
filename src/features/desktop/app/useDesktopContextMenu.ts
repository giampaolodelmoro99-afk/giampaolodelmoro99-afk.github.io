import { useEffect, useState } from "react";
import { type AppId, appIds } from "../../../routes/routeMap";

export type ContextMenuState = { x: number; y: number; iconId: AppId | null };

const longPressDelay = 500;
const longPressSlop = 10;

const isAppId = (value: string | undefined): value is AppId => appIds.some((id) => id === value);

function iconOf(target: EventTarget | null): AppId | null {
  if (!(target instanceof Element)) return null;
  const key = target.closest<HTMLElement>("[role=row][data-key]")?.dataset["key"];
  return isAppId(key) ? key : null;
}

function isDesktopSurface(target: EventTarget | null): boolean {
  return (
    target instanceof Element && target.closest("section, [role=menu], [role=dialog]") === null
  );
}

export function useDesktopContextMenu(
  workspace: HTMLElement | null,
  isEnabled: () => boolean,
): [ContextMenuState | null, (state: ContextMenuState | null) => void] {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  useEffect(() => {
    if (!workspace) return undefined;
    let timer = 0;
    let start: { x: number; y: number } | null = null;

    const onContextMenu = (event: MouseEvent) => {
      if (!isEnabled() || !isDesktopSurface(event.target)) return;
      event.preventDefault();
      const fromKeyboard = event.clientX === 0 && event.clientY === 0;
      const rect = event.target instanceof Element ? event.target.getBoundingClientRect() : null;
      setMenu({
        x: fromKeyboard && rect ? rect.left : event.clientX,
        y: fromKeyboard && rect ? rect.bottom : event.clientY,
        iconId: iconOf(event.target),
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const isMenuKey = event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
      if (!isMenuKey || !isEnabled() || !isDesktopSurface(event.target)) return;
      event.preventDefault();
      const rect = event.target instanceof Element ? event.target.getBoundingClientRect() : null;
      setMenu({ x: rect?.left ?? 0, y: rect?.bottom ?? 0, iconId: iconOf(event.target) });
    };

    const cancelLongPress = () => {
      window.clearTimeout(timer);
      start = null;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || !isEnabled() || !isDesktopSurface(event.target)) return;
      start = { x: event.clientX, y: event.clientY };
      const target = event.target;
      timer = window.setTimeout(() => {
        if (start) setMenu({ x: start.x, y: start.y, iconId: iconOf(target) });
        start = null;
      }, longPressDelay);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > longPressSlop) {
        cancelLongPress();
      }
    };

    workspace.addEventListener("contextmenu", onContextMenu);
    workspace.addEventListener("keydown", onKeyDown);
    workspace.addEventListener("pointerdown", onPointerDown);
    workspace.addEventListener("pointermove", onPointerMove);
    workspace.addEventListener("pointerup", cancelLongPress);
    workspace.addEventListener("pointercancel", cancelLongPress);
    return () => {
      cancelLongPress();
      workspace.removeEventListener("contextmenu", onContextMenu);
      workspace.removeEventListener("keydown", onKeyDown);
      workspace.removeEventListener("pointerdown", onPointerDown);
      workspace.removeEventListener("pointermove", onPointerMove);
      workspace.removeEventListener("pointerup", cancelLongPress);
      workspace.removeEventListener("pointercancel", cancelLongPress);
    };
  }, [workspace, isEnabled]);

  return [menu, setMenu];
}
