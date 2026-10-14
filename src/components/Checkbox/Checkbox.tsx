import type { ReactNode } from "react";
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components/Checkbox";
import { cx } from "../cx";
import { Glyph } from "../Icon";
import styles from "./Checkbox.module.css";

export type CheckboxProps = Omit<AriaCheckboxProps, "children" | "className" | "style"> & {
  children: ReactNode;
  className?: string | undefined;
};

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox {...props} className={cx(styles.root, className)}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <span className={styles.box} aria-hidden="true">
            {isIndeterminate ? <Glyph name="dash" /> : isSelected && <Glyph name="check" />}
          </span>
          <span className={styles.label}>{children}</span>
        </>
      )}
    </AriaCheckbox>
  );
}
