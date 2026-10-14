import type { ReactNode } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components/Button";
import { cx } from "../cx";
import { Icon, type SmallIconName } from "../Icon";
import styles from "./Button.module.css";

type BaseProps = Omit<AriaButtonProps, "children" | "className" | "style"> & {
  variant?: "normal" | "default";
  className?: string | undefined;
};

type WithLabel = { children: ReactNode; icon?: SmallIconName };

type IconOnly = { children?: never; icon: SmallIconName; "aria-label": string };

export type ButtonProps = BaseProps & (WithLabel | IconOnly);

export function Button({ variant = "normal", icon, children, className, ...props }: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={cx(styles.root, children === undefined && styles.iconOnly, className)}
      data-variant={variant === "default" ? variant : undefined}
    >
      <span className={styles.content}>
        {icon && <Icon name={icon} size={16} className={cx(styles.icon)} />}
        {children}
      </span>
    </AriaButton>
  );
}
