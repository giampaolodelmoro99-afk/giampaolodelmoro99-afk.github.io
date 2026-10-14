import type { ReactNode } from "react";
import { cx } from "../cx";
import styles from "./ScrollArea.module.css";

export type ScrollAreaProps = {
  label: string;
  children: ReactNode;
  className?: string | undefined;
};

export function ScrollArea({ label, children, className }: ScrollAreaProps) {
  return (
    <section aria-label={label} tabIndex={0} className={cx(styles.root, className)}>
      {children}
    </section>
  );
}
