import type { ReactNode, Ref } from "react";
import { Keyboard } from "react-aria-components/Keyboard";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  SubmenuTrigger,
} from "react-aria-components/Menu";
import { Popover, type PopoverProps } from "react-aria-components/Popover";
import { Separator } from "react-aria-components/Separator";
import { cx } from "../cx";
import { Glyph, type GlyphName, Icon, type SmallIconName } from "../Icon";
import styles from "./Menu.module.css";

export type MenuProps = Omit<AriaMenuProps<object>, "className" | "style" | "children"> & {
  ref?: Ref<HTMLDivElement> | undefined;
  children: ReactNode;
  size?: "default" | "start";
  className?: string | undefined;
};

export function MenuPopover({
  children,
  className,
  ...props
}: Omit<PopoverProps, "className" | "children"> & {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <Popover {...props} offset={0} className={cx(styles.popover, className)}>
      {children}
    </Popover>
  );
}

export function Menu({ ref, children, size = "default", className, ...props }: MenuProps) {
  return (
    <AriaMenu
      {...props}
      ref={ref}
      className={cx(styles.menu, className)}
      data-size={size === "start" ? size : undefined}
    >
      {children}
    </AriaMenu>
  );
}

export type MenuItemProps = Omit<AriaMenuItemProps, "className" | "style" | "children"> & {
  children: ReactNode;
  icon?: SmallIconName;
  glyph?: GlyphName;
  shortcut?: string;
  isDefault?: boolean;
  className?: string | undefined;
};

export function MenuItem({
  children,
  icon,
  glyph,
  shortcut,
  isDefault = false,
  className,
  ...props
}: MenuItemProps) {
  return (
    <AriaMenuItem
      {...props}
      className={cx(styles.item, className)}
      data-default={isDefault || undefined}
    >
      {({ isSelected, hasSubmenu }) => (
        <>
          <span className={styles.check} aria-hidden="true">
            {isSelected ? (
              <Glyph name="check" />
            ) : glyph ? (
              <Glyph name={glyph} />
            ) : (
              icon && <Icon name={icon} size={16} />
            )}
          </span>
          <span className={styles.label}>{children}</span>
          {shortcut && <Keyboard className={cx(styles.shortcut)}>{shortcut}</Keyboard>}
          {hasSubmenu && <Glyph name="right" className={cx(styles.submenuArrow)} />}
        </>
      )}
    </AriaMenuItem>
  );
}

export function MenuSeparator() {
  return <Separator className={cx(styles.separator)} />;
}

export type SubmenuProps = {
  label: string;
  icon?: SmallIconName;
  children: ReactNode;
};

export function Submenu({ label, icon, children }: SubmenuProps) {
  return (
    <SubmenuTrigger>
      <MenuItem {...(icon ? { icon } : {})}>{label}</MenuItem>
      <MenuPopover>
        <Menu>{children}</Menu>
      </MenuPopover>
    </SubmenuTrigger>
  );
}
