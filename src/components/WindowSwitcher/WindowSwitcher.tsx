import { type ReactNode, useEffect, useId, useState } from "react";
import { Dialog } from "react-aria-components/Dialog";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Modal, ModalOverlay } from "react-aria-components/Modal";
import { cx } from "../cx";
import { Icon, type SmallIconName } from "../Icon";
import { useUiStrings } from "../useUiStrings";
import styles from "./WindowSwitcher.module.css";

export type SwitcherItem = { id: string; label: string; icon: SmallIconName };

export type WindowSwitcherProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  items: SwitcherItem[];
  selectedId: string | null;
  onSelectionChange: (id: string) => void;
  onActivate: (id: string) => void;
  hint?: ReactNode;
  className?: string | undefined;
};

export function WindowSwitcher({
  isOpen,
  onOpenChange,
  items,
  selectedId,
  onSelectionChange,
  onActivate,
  hint,
  className,
}: WindowSwitcherProps) {
  const strings = useUiStrings().windowSwitcher;
  const titleId = useId();
  const [list, setList] = useState<HTMLDivElement | null>(null);
  const selected = items.find((item) => item.id === selectedId);

  useEffect(() => {
    if (!list || !selectedId) return;
    list.querySelector<HTMLElement>(`[data-key="${CSS.escape(selectedId)}"]`)?.focus();
  }, [list, selectedId]);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className={cx(styles.overlay)}
    >
      <Modal className={cx(styles.modal)}>
        <Dialog aria-labelledby={titleId} className={cx(styles.panel, className)}>
          <span id={titleId} className={styles.title}>
            {strings.label}
          </span>
          <ListBox
            ref={setList}
            aria-labelledby={titleId}
            items={items}
            orientation="horizontal"
            selectionMode="single"
            selectionBehavior="replace"
            disallowEmptySelection
            selectedKeys={selectedId ? [selectedId] : []}
            onSelectionChange={(keys) => {
              const [key] = keys === "all" ? [] : [...keys];
              if (key !== undefined) onSelectionChange(String(key));
            }}
            className={cx(styles.list)}
          >
            {(item) => (
              <ListBoxItem
                id={item.id}
                textValue={item.label}
                aria-label={item.label}
                onPress={() => onActivate(item.id)}
                className={cx(styles.item)}
              >
                <Icon name={item.icon} size={32} />
              </ListBoxItem>
            )}
          </ListBox>
          <output aria-live="polite" className={styles.name}>
            {selected?.label}
          </output>
          {hint && <p className={styles.hint}>{hint}</p>}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
