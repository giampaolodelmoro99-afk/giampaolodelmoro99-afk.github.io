import { useCallback, useRef, useState } from "react";
import type { AppId } from "../../../routes/routeMap";
import {
  type Edge,
  type Geometry,
  type Viewport,
  clampGeometry,
  moveBy,
  resizeBy,
} from "../../../stores/desktop";

const threshold = 4;

type Gesture = {
  id: AppId;
  edge: Edge | null;
  pointerId: number;
  startX: number;
  startY: number;
  origin: Geometry;
  current: Geometry;
  moved: boolean;
  target: HTMLElement;
};

export type WindowGestureOptions = {
  workspace: HTMLElement | null;
  viewport: () => Viewport | null;
  isEnabled: () => boolean;
  onPlace: (id: AppId, geometry: Geometry) => void;
};

export function windowRect(windowElement: Element, workspace: Element): Geometry {
  const area = workspace.getBoundingClientRect();
  const rect = windowElement.getBoundingClientRect();
  return {
    x: rect.left - area.left,
    y: rect.top - area.top,
    width: rect.width,
    height: rect.height,
  };
}

export function useWindowGestures({
  workspace,
  viewport,
  isEnabled,
  onPlace,
}: WindowGestureOptions) {
  const [outline, setOutline] = useState<Geometry | null>(null);
  const [resizing, setResizing] = useState<AppId | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef(0);

  const show = useCallback((geometry: Geometry | null) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setOutline(geometry));
  }, []);

  const end = useCallback(() => {
    const active = gesture.current;
    gesture.current = null;
    cancelAnimationFrame(frame.current);
    setOutline(null);
    setResizing(null);
    if (!active) return;
    if (active.target.hasPointerCapture(active.pointerId)) {
      active.target.releasePointerCapture(active.pointerId);
    }
  }, []);

  const start = useCallback(
    (id: AppId, edge: Edge | null, event: PointerEvent, windowElement: Element) => {
      if (event.button !== 0 || !workspace || !isEnabled() || gesture.current) return;
      if (!(event.currentTarget instanceof HTMLElement)) return;
      const target = event.currentTarget;
      const origin = windowRect(windowElement, workspace);
      gesture.current = {
        id,
        edge,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin,
        current: origin,
        moved: false,
        target,
      };
      target.setPointerCapture(event.pointerId);
      if (edge) setResizing(id);

      const onMove = (move: PointerEvent) => {
        const active = gesture.current;
        if (!active || move.pointerId !== active.pointerId) return;
        const dx = move.clientX - active.startX;
        const dy = move.clientY - active.startY;
        if (!active.moved && Math.hypot(dx, dy) < threshold) return;
        active.moved = true;
        const limits = viewport();
        const next = active.edge
          ? resizeBy(active.origin, active.edge, dx, dy, limits ?? { minWidth: 0, minHeight: 0 })
          : moveBy(active.origin, dx, dy);
        active.current = limits ? clampGeometry(next, limits) : next;
        show(active.current);
      };
      const finish = (place: boolean) => {
        const active = gesture.current;
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointercancel", onCancel);
        document.removeEventListener("keydown", onKey, true);
        if (place && active?.moved) onPlace(active.id, active.current);
        end();
      };
      const onUp = () => finish(true);
      const onCancel = () => finish(false);
      const onKey = (key: KeyboardEvent) => {
        if (key.key !== "Escape") return;
        key.preventDefault();
        key.stopPropagation();
        finish(false);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onCancel);
      document.addEventListener("keydown", onKey, true);
    },
    [workspace, viewport, isEnabled, onPlace, end, show],
  );

  return { outline, resizing, start };
}
