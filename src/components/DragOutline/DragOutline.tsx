import { cx } from "../cx";
import styles from "./DragOutline.module.css";

export type OutlineRect = { x: number; y: number; width: number; height: number };

export type DragOutlineProps = {
  rect: OutlineRect;
  className?: string | undefined;
};

export function DragOutline({ rect, className }: DragOutlineProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(styles.root, className)}
      style={{
        "--outline-x": `${rect.x}px`,
        "--outline-y": `${rect.y}px`,
        "--outline-w": `${rect.width}px`,
        "--outline-h": `${rect.height}px`,
      }}
    />
  );
}
