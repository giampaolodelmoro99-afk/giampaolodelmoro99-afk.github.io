import type { ReactNode } from "react";
import { Button } from "react-aria-components/Button";
import { MenuTrigger } from "react-aria-components/Menu";
import { siteHandle } from "../../config/site";
import { cx } from "../cx";
import { Icon } from "../Icon";
import { Menu, MenuPopover, type MenuProps } from "../MenuBar";
import { useUiStrings } from "../useUiStrings";
import styles from "./StartButton.module.css";

export type StartButtonProps = Omit<MenuProps, "className" | "size"> & {
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string | undefined;
};

export function StartButton({ children, defaultOpen, className, ...menuProps }: StartButtonProps) {
  const strings = useUiStrings().startButton;
  return (
    <MenuTrigger {...(defaultOpen === undefined ? {} : { defaultOpen })}>
      <Button className={cx(styles.root, className)}>
        <Icon name="gdm" size={16} />
        <span>{strings.label}</span>
      </Button>
      <MenuPopover placement="top start" className={styles.popover}>
        <div className={styles.startMenu}>
          <span className={styles.side} aria-hidden="true">
            <span className={styles.sideText}>{siteHandle}</span>
          </span>
          <Menu {...menuProps} size="start" className={styles.menu}>
            {children}
          </Menu>
        </div>
      </MenuPopover>
    </MenuTrigger>
  );
}
