import type { ReactNode } from "react";
import { Label } from "react-aria-components/Label";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from "react-aria-components/RadioGroup";
import { cx } from "../cx";
import { radioCircle } from "../Icon";
import { FieldTexts, type FieldTextProps } from "../TextField";
import styles from "./Radio.module.css";

export type RadioGroupProps = Omit<AriaRadioGroupProps, "children" | "className" | "style"> &
  FieldTextProps & {
    children: ReactNode;
  };

export function RadioGroup({
  label,
  description,
  errorMessage,
  className,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={cx(styles.group, className)}>
      <Label className={cx(styles.groupLabel)}>{label}</Label>
      <div className={styles.items}>{children}</div>
      <FieldTexts description={description} errorMessage={errorMessage} />
    </AriaRadioGroup>
  );
}

export type RadioProps = Omit<AriaRadioProps, "children" | "className" | "style"> & {
  children: ReactNode;
  className?: string | undefined;
};

const { size, parts } = radioCircle;

export function Radio({ children, className, ...props }: RadioProps) {
  return (
    <AriaRadio {...props} className={cx(styles.root, className)}>
      <svg
        className={styles.mark}
        viewBox={`0 0 ${size} ${size}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        <path className={styles.shadow} d={parts.shadow} />
        <path className={styles.shadowDark} d={parts.shadowDark} />
        <path className={styles.highlight} d={parts.highlight} />
        <path className={styles.surfaceLight} d={parts.surfaceLight} />
        <path className={styles.field} d={parts.field} />
        <path className={styles.dot} d={parts.dot} />
      </svg>
      <span className={styles.label}>{children}</span>
    </AriaRadio>
  );
}
