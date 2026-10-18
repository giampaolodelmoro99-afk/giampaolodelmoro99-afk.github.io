import type { ReactNode } from "react";
import { Button } from "react-aria-components/Button";
import { MenuTrigger } from "react-aria-components/Menu";
import { Toolbar } from "react-aria-components/Toolbar";
import { cx } from "../cx";
import { Menu, MenuPopover, type MenuProps } from "./Menu";
import styles from "./Menu.module.css";

export type MenuBarProps = {
  label: string;
  children: ReactNode;
  className?: string | undefined;
};

export function MenuBar({ label, children, className }: MenuBarProps) {
  return (
    <Toolbar aria-label={label} className={cx(styles.bar, className)}>
      {children}
    </Toolbar>
  );
}

export type MenuButtonProps = Omit<MenuProps, "className"> & {
  label: string;
  isDisabled?: boolean;
  defaultOpen?: boolean;
};

export function MenuButton({
  label,
  isDisabled,
  defaultOpen,
  children,
  ...menuProps
}: MenuButtonProps) {
  return (
    <MenuTrigger {...(defaultOpen === undefined ? {} : { defaultOpen })}>
      <Button className={cx(styles.trigger)} isDisabled={isDisabled ?? false}>
        {label}
      </Button>
      <MenuPopover placement="bottom start">
        <Menu {...menuProps}>{children}</Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}
