import { useCallback, useEffect, useState } from "react";
import type { MoveDirection } from "../../../components/MoveControls";
import type { AppId } from "../../../routes/routeMap";
import {
  type Geometry,
  type Viewport,
  clampGeometry,
  moveBy,
  resizeBy,
} from "../../../stores/desktop";

export type KeyboardGesture = {
  id: AppId;
  kind: "move" | "resize";
  origin: Geometry;
  current: Geometry;
};

export const smallStep = 8;
export const largeStep = 32;

const offsets: Record<MoveDirection, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const keys: Record<string, MoveDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export function stepGeometry(
  gesture: KeyboardGesture,
  direction: MoveDirection,
  size: number,
  viewport: Viewport | null,
): Geometry {
  const [x, y] = offsets[direction];
  const next =
    gesture.kind === "move"
      ? moveBy(gesture.current, x * size, y * size)
      : resizeBy(
          gesture.current,
          "se",
          x * size,
          y * size,
          viewport ?? { minWidth: 0, minHeight: 0 },
        );
  return viewport ? clampGeometry(next, viewport) : next;
}

export type KeyboardGestureOptions = {
  viewport: () => Viewport | null;
  isOutside: (target: Node) => boolean;
  onConfirm: (gesture: KeyboardGesture) => void;
  onCancel: (gesture: KeyboardGesture) => void;
};

export function useKeyboardGesture({
  viewport,
  isOutside,
  onConfirm,
  onCancel,
}: KeyboardGestureOptions) {
  const [gesture, setGesture] = useState<KeyboardGesture | null>(null);

  const step = useCallback(
    (direction: MoveDirection, size = smallStep) => {
      setGesture((current) =>
        current
          ? { ...current, current: stepGeometry(current, direction, size, viewport()) }
          : current,
      );
    },
    [viewport],
  );

  const confirm = useCallback(() => {
    if (gesture) onConfirm(gesture);
    setGesture(null);
  }, [gesture, onConfirm]);

  const cancel = useCallback(() => {
    if (gesture) onCancel(gesture);
    setGesture(null);
  }, [gesture, onCancel]);

  useEffect(() => {
    if (!gesture) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof Node && !isOutside(event.target)) return;
      const direction = keys[event.key];
      if (direction) step(direction, event.shiftKey ? largeStep : smallStep);
      else if (event.key === "Enter") confirm();
      else if (event.key === "Escape") cancel();
      else return;
      event.preventDefault();
      event.stopPropagation();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [gesture, step, confirm, cancel, isOutside]);

  const start = useCallback((id: AppId, kind: KeyboardGesture["kind"], origin: Geometry) => {
    setGesture({ id, kind, origin, current: origin });
  }, []);

  return { gesture, start, step, confirm, cancel };
}
