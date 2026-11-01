import { type ReactNode, useEffect, useRef, useState } from "react";
import type { MenuProps } from "./Menu";
import { Menu, MenuPopover } from "./Menu";
import styles from "./Menu.module.css";

export type ContextMenuProps = Omit<MenuProps, "children"> & {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  x: number;
  y: number;
  label: string;
  children: ReactNode;
};

export function ContextMenu({
  isOpen,
  onOpenChange,
  x,
  y,
  label,
  children,
  ...menuProps
}: ContextMenuProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [menu, setMenu] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menu) return undefined;
    const frame = requestAnimationFrame(() => {
      if (menu.contains(document.activeElement) && document.activeElement !== menu) return;
      menu.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [menu]);

  return (
    <>
      <span
        ref={anchor}
        aria-hidden="true"
        className={styles.anchor}
        style={{ "--anchor-x": `${x}px`, "--anchor-y": `${y}px` }}
      />
      <MenuPopover
        triggerRef={anchor}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom start"
        aria-label={label}
      >
        <Menu {...menuProps} ref={setMenu} aria-label={label}>
          {children}
        </Menu>
      </MenuPopover>
    </>
  );
}
