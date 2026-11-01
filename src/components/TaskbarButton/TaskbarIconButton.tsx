import { Button, type ButtonProps } from "react-aria-components/Button";
import { cx } from "../cx";
import { Icon, type SmallIconName } from "../Icon";
import styles from "./TaskbarButton.module.css";

export type TaskbarIconButtonProps = Omit<
  ButtonProps,
  "children" | "className" | "style" | "isDisabled" | "render"
> & {
  icon: SmallIconName;
  "aria-label": string;
  isUnavailable?: boolean;
  isPressed?: boolean;
  className?: string | undefined;
};

export function TaskbarIconButton({
  icon,
  isUnavailable = false,
  isPressed = false,
  onPress,
  className,
  ...props
}: TaskbarIconButtonProps) {
  return (
    <Button
      {...props}
      {...(isUnavailable || !onPress ? {} : { onPress })}
      className={cx(styles.root, styles.iconButton, className)}
      data-unavailable={isUnavailable || undefined}
      data-selected={isPressed || undefined}
      render={(domProps) => (
        <button
          {...domProps}
          aria-disabled={isUnavailable || undefined}
          aria-expanded={isPressed}
          aria-haspopup="dialog"
        />
      )}
    >
      <span className={styles.content}>
        <Icon name={icon} size={16} className={cx(styles.icon)} />
      </span>
    </Button>
  );
}
