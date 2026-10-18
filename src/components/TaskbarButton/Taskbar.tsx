import type { ReactNode } from "react";
import { Toolbar } from "react-aria-components/Toolbar";
import { cx } from "../cx";
import styles from "./TaskbarButton.module.css";

export type TaskbarProps = {
  label: string;
  tray?: ReactNode;
  children: ReactNode;
  className?: string | undefined;
};

export function Taskbar({ label, tray, children, className }: TaskbarProps) {
  return (
    <div className={cx(styles.taskbar, className)}>
      <Toolbar aria-label={label} className={cx(styles.buttons)}>
        {children}
      </Toolbar>
      {tray && <div className={styles.tray}>{tray}</div>}
    </div>
  );
}
