import { type ButtonHTMLAttributes, type Key, useEffect, useState } from "react";
import { Button } from "react-aria-components/Button";
import { MenuTrigger } from "react-aria-components/Menu";
import { cx } from "../cx";
import { Icon, type SmallIconName } from "../Icon";
import { Menu, MenuItem, MenuPopover, MenuSeparator } from "../MenuBar";
import { useUiStrings } from "../useUiStrings";
import styles from "./WindowMenu.module.css";

export type WindowMenuAction = "restore" | "move" | "resize" | "minimize" | "maximize" | "close";

export type WindowMenuProps = {
  icon: SmallIconName;
  isMaximized?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onAction: (action: WindowMenuAction) => void;
  isInTabOrder?: boolean;
  className?: string | undefined;
};

const actions: readonly WindowMenuAction[] = [
  "restore",
  "move",
  "resize",
  "minimize",
  "maximize",
  "close",
];

const isAction = (key: Key): key is WindowMenuAction => actions.some((action) => action === key);

function outOfTabOrder(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} tabIndex={-1} />;
}

export function WindowMenu({
  icon,
  isMaximized = false,
  isOpen,
  onOpenChange,
  onAction,
  isInTabOrder = true,
  className,
}: WindowMenuProps) {
  const strings = useUiStrings().windowMenu;
  const [menu, setMenu] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menu) return undefined;
    const frame = requestAnimationFrame(() => {
      if (document.activeElement !== menu) return;
      menu.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [menu]);
  const disabledKeys: WindowMenuAction[] = isMaximized
    ? ["move", "resize", "maximize"]
    : ["restore"];
  return (
    <MenuTrigger
      {...(isOpen === undefined ? {} : { isOpen })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <Button
        aria-label={strings.label}
        className={cx(styles.trigger, className)}
        {...(isInTabOrder ? {} : { render: outOfTabOrder })}
      >
        <Icon name={icon} size={16} />
      </Button>
      <MenuPopover placement="bottom start">
        <Menu
          ref={setMenu}
          aria-label={strings.label}
          disabledKeys={disabledKeys}
          onAction={(key) => {
            if (isAction(key)) onAction(key);
          }}
        >
          <MenuItem id="restore" glyph="restore">
            {strings.restore}
          </MenuItem>
          <MenuItem id="move">{strings.move}</MenuItem>
          <MenuItem id="resize">{strings.resize}</MenuItem>
          <MenuItem id="minimize" glyph="minimize">
            {strings.minimize}
          </MenuItem>
          <MenuItem id="maximize" glyph="maximize">
            {strings.maximize}
          </MenuItem>
          <MenuSeparator />
          <MenuItem id="close" glyph="close" isDefault>
            {strings.close}
          </MenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}
