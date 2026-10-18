import { ToggleButton, type ToggleButtonProps } from "react-aria-components/ToggleButton";
import { cx } from "../cx";
import { Icon, type SmallIconName } from "../Icon";
import styles from "./TaskbarButton.module.css";

export type TaskbarButtonProps = Omit<ToggleButtonProps, "children" | "className" | "style"> & {
  icon?: SmallIconName;
  children: string;
  className?: string | undefined;
};

export function TaskbarButton({ icon, children, className, ...props }: TaskbarButtonProps) {
  return (
    <ToggleButton {...props} className={cx(styles.root, className)}>
      <span className={styles.content}>
        {icon && <Icon name={icon} size={16} className={cx(styles.icon)} />}
        <span className={styles.label}>{children}</span>
      </span>
    </ToggleButton>
  );
}
