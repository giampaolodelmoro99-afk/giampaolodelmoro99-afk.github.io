import { useEffect, useState } from "react";
import { cx } from "../cx";
import { type ResizeEdge, isResizeEdge, resizeEdges } from "./edges";
import styles from "./ResizeHandles.module.css";

export type ResizeHandlesProps = {
  isResizing?: boolean;
  onResizeStart: (edge: ResizeEdge, event: PointerEvent) => void;
  className?: string | undefined;
};

export function ResizeHandles({
  isResizing = false,
  onResizeStart,
  className,
}: ResizeHandlesProps) {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!root) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      const edge = event.target instanceof HTMLElement ? event.target.dataset["edge"] : undefined;
      if (isResizeEdge(edge)) onResizeStart(edge, event);
    };
    root.addEventListener("pointerdown", onPointerDown);
    return () => root.removeEventListener("pointerdown", onPointerDown);
  }, [root, onResizeStart]);

  return (
    <span
      ref={setRoot}
      aria-hidden="true"
      className={cx(styles.root, className)}
      data-resizing={isResizing || undefined}
    >
      {resizeEdges.map((edge) => (
        <span key={edge} className={styles.handle} data-edge={edge} />
      ))}
    </span>
  );
}
