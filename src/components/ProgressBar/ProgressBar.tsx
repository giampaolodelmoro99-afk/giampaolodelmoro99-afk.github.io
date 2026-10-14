import { Label } from "react-aria-components/Label";
import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components/ProgressBar";
import { cx } from "../cx";
import { useUiStrings } from "../useUiStrings";
import styles from "./ProgressBar.module.css";

export type ProgressBarProps = Omit<
  AriaProgressBarProps,
  "children" | "className" | "style" | "valueLabel"
> & {
  label: string;
  valueLabel?: string | undefined;
  className?: string;
};

export function ProgressBar({ label, valueLabel, className, ...props }: ProgressBarProps) {
  const strings = useUiStrings();
  return (
    <AriaProgressBar
      {...props}
      {...(valueLabel === undefined ? {} : { valueLabel })}
      className={cx(styles.root, className)}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <span className={styles.head}>
            <Label className={cx(styles.label)}>{label}</Label>
            <span className={styles.value}>
              {isIndeterminate ? (valueLabel ?? strings.progressBar.inProgress) : valueText}
            </span>
          </span>
          <span className={styles.track}>
            <span
              className={styles.fill}
              data-indeterminate={isIndeterminate || undefined}
              style={isIndeterminate ? undefined : { "--progress-value": `${percentage ?? 0}%` }}
            />
          </span>
        </>
      )}
    </AriaProgressBar>
  );
}
