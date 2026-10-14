import type { ReactNode } from "react";
import { Group } from "react-aria-components/Group";
import { cx } from "../cx";
import styles from "./StatusBar.module.css";

export type StatusBarField = {
  id: string;
  text: ReactNode;
  grow?: boolean;
};

export type StatusBarProps = {
  label: string;
  fields: StatusBarField[];
  className?: string;
};

export function StatusBar({ label, fields, className }: StatusBarProps) {
  return (
    <Group aria-label={label} className={cx(styles.root, className)}>
      {fields.map(({ id, text, grow }) => (
        <span key={id} className={styles.field} data-grow={grow || undefined}>
          {text}
        </span>
      ))}
    </Group>
  );
}
