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

export type MenuItemProps = Omit<
  AriaMenuItemProps,
  "className" | "style" | "children" | "render"
> & {
  children: ReactNode;
  opensDialog?: boolean;
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
  opensDialog = false,
  className,
  ...props
}: MenuItemProps) {
  return (
    <AriaMenuItem
      {...props}
      {...(opensDialog
        ? {
            render: (domProps) =>
              "href" in domProps ? (
                <a {...domProps} aria-haspopup="dialog">
                  {domProps.children}
                </a>
              ) : (
                <div {...domProps} aria-haspopup="dialog" />
              ),
          }
        : {})}
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
  onAction?: MenuProps["onAction"];
  children: ReactNode;
};

export function Submenu({ label, icon, onAction, children }: SubmenuProps) {
  return (
    <SubmenuTrigger>
      <MenuItem {...(icon ? { icon } : {})}>{label}</MenuItem>
      <MenuPopover>
        <Menu {...(onAction ? { onAction } : {})}>{children}</Menu>
      </MenuPopover>
    </SubmenuTrigger>
  );
}
