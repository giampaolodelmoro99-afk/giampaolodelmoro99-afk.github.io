import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { Button as AriaButton } from "react-aria-components/Button";
import { Dialog } from "react-aria-components/Dialog";
import { GridList, GridListItem } from "react-aria-components/GridList";
import { Modal, ModalOverlay } from "react-aria-components/Modal";
import { Button } from "../../../components/Button";
import { cx } from "../../../components/cx";
import { Glyph, Icon, type SmallIconName } from "../../../components/Icon";
import { Window } from "../../../components/Window";
import styles from "./AppSwitcher.module.css";

export type AppSwitcherItem = { id: string; label: string; icon: SmallIconName };

export type AppSwitcherProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  items: AppSwitcherItem[];
  currentId: string | null;
  closeLabel: (label: string) => string;
  closeAllLabel: string;
  onOpen: (id: string) => void;
  onClose: (id: string) => void;
  onCloseAll: () => void;
};

export function AppSwitcher({
  isOpen,
  onOpenChange,
  title,
  items,
  currentId,
  closeLabel,
  closeAllLabel,
  onOpen,
  onClose,
  onCloseAll,
}: AppSwitcherProps) {
  const titleId = useId();
  const [list, setList] = useState<HTMLDivElement | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const ids = items.map((item) => item.id).join();
  const lastIds = useRef(ids);

  useEffect(() => {
    if (!list) return;
    const rows = [...list.querySelectorAll<HTMLElement>("[role=row]")];
    if (focusIndex === null) {
      const current = rows.find((row) => row.dataset["key"] === currentId) ?? rows[0];
      current?.focus();
      return;
    }
    if (lastIds.current === ids) return;
    lastIds.current = ids;
    rows[Math.min(focusIndex, rows.length - 1)]?.focus();
  }, [list, ids, currentId, focusIndex]);

  const closeAt = (id: string) => {
    setFocusIndex(
      Math.max(
        0,
        items.findIndex((item) => item.id === id),
      ),
    );
    onClose(id);
  };

  const onDelete = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== "Delete") return;
    const row = event.target instanceof Element ? event.target.closest("[role=row]") : null;
    const key = row?.getAttribute("data-key");
    if (!key) return;
    event.preventDefault();
    closeAt(key);
  });

  useEffect(() => {
    if (!list) return undefined;
    const listener = (event: KeyboardEvent) => onDelete(event);
    list.addEventListener("keydown", listener);
    return () => list.removeEventListener("keydown", listener);
  }, [list]);

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} className={cx(styles.overlay)}>
      <Modal className={cx(styles.modal)}>
        <Dialog aria-labelledby={titleId} className={cx(styles.dialog)}>
          <Window
            title={title}
            titleId={titleId}
            icon="windows"
            isLandmark={false}
            controls={["close"]}
            onClose={() => onOpenChange(false)}
            className={cx(styles.window)}
            bodyClassName={cx(styles.body)}
          >
            <div className={cx(styles.listArea)}>
              <GridList
                ref={setList}
                aria-labelledby={titleId}
                items={items}
                onAction={(key) => onOpen(String(key))}
                className={cx(styles.list)}
              >
                {(item) => (
                  <GridListItem id={item.id} textValue={item.label} className={cx(styles.row)}>
                    <span className={styles.app}>
                      <Icon name={item.icon} size={32} />
                      <span className={styles.label}>{item.label}</span>
                    </span>
                    <AriaButton
                      aria-label={closeLabel(item.label)}
                      className={cx(styles.close)}
                      onPress={() => closeAt(item.id)}
                    >
                      <Glyph name="close" />
                    </AriaButton>
                  </GridListItem>
                )}
              </GridList>
            </div>
            <Button className={cx(styles.closeAll)} onPress={onCloseAll}>
              {closeAllLabel}
            </Button>
          </Window>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
