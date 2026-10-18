import type { ReactNode } from "react";
import { cx } from "../cx";
import styles from "./GroupBox.module.css";

export type GroupBoxProps = {
  legend: string;
  children: ReactNode;
  className?: string | undefined;
};

export function GroupBox({ legend, children, className }: GroupBoxProps) {
  return (
    <fieldset className={cx(styles.root, className)}>
      <legend className={styles.legend}>{legend}</legend>
      {children}
    </fieldset>
  );
}
