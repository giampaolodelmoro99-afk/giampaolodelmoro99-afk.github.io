import type { Key } from "react";
import { GridList, GridListItem, type GridListProps } from "react-aria-components/GridList";
import { cx } from "../cx";
import { Icon, type IconName } from "../Icon";
import styles from "./DesktopIcons.module.css";

export type DesktopItem = {
  id: string;
  label: string;
  icon: IconName;
  isDisabled?: boolean;
};

export type DesktopIconsProps = Omit<
  GridListProps<DesktopItem>,
  "children" | "className" | "style" | "items" | "onAction" | "selectionMode" | "layout"
> & {
  label: string;
  items: DesktopItem[];
  onAction?: (id: Key) => void;
  className?: string | undefined;
};

export function DesktopIcons({ label, items, onAction, className, ...props }: DesktopIconsProps) {
  const disabledKeys = items.filter((item) => item.isDisabled).map((item) => item.id);
  return (
    <GridList
      {...props}
      aria-label={label}
      items={items}
      layout="grid"
      selectionMode="single"
      selectionBehavior="replace"
      disabledKeys={disabledKeys}
      {...(onAction ? { onAction } : {})}
      className={cx(styles.grid, className)}
    >
      {(item) => (
        <GridListItem id={item.id} textValue={item.label} className={cx(styles.item)}>
          <span className={styles.image}>
            <Icon name={item.icon} className={cx(styles.icon)} />
          </span>
          <span className={styles.label}>{item.label}</span>
        </GridListItem>
      )}
    </GridList>
  );
}
