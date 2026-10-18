import { type ReactNode, useEffect, useId, useRef } from "react";
import { Dialog } from "react-aria-components/Dialog";
import { Modal, ModalOverlay } from "react-aria-components/Modal";
import { Button } from "../Button";
import { cx } from "../cx";
import { Icon } from "../Icon";
import { useUiStrings } from "../useUiStrings";
import { Window } from "../Window";
import styles from "./AlertDialog.module.css";

export type AlertKind = "warning" | "error" | "info";

export type AlertDialogFrameProps = {
  title: string;
  kind?: AlertKind;
  message: ReactNode;
  primaryLabel: string;
  secondaryLabel?: string | undefined;
  onPrimary?: () => void;
  onDismiss?: () => void;
  className?: string | undefined;
};

export function AlertDialogFrame({
  title,
  kind = "warning",
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onDismiss,
  className,
}: AlertDialogFrameProps) {
  const titleId = useId();
  const messageId = useId();
  const strings = useUiStrings().alertDialog;
  const primary = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    primary.current?.focus();
  }, []);

  return (
    <Dialog
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className={cx(styles.dialog, className)}
    >
      <Window
        title={title}
        titleId={titleId}
        isLandmark={false}
        controls={["close"]}
        {...(onDismiss ? { onClose: onDismiss } : {})}
        className={styles.window}
      >
        <div className={styles.body}>
          <Icon name={kind} size={32} label={strings[kind]} />
          <div id={messageId} className={styles.message}>
            {message}
          </div>
        </div>
        <div className={styles.actions}>
          <Button ref={primary} variant="default" {...(onPrimary ? { onPress: onPrimary } : {})}>
            {primaryLabel}
          </Button>
          {secondaryLabel && (
            <Button {...(onDismiss ? { onPress: onDismiss } : {})}>{secondaryLabel}</Button>
          )}
        </div>
      </Window>
    </Dialog>
  );
}

export type AlertDialogProps = Omit<AlertDialogFrameProps, "onDismiss" | "className"> & {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function AlertDialog({ isOpen, onOpenChange, onPrimary, ...frame }: AlertDialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      className={cx(styles.overlay)}
    >
      <Modal className={cx(styles.modal)}>
        <AlertDialogFrame
          {...frame}
          onPrimary={() => {
            onPrimary?.();
            onOpenChange(false);
          }}
          onDismiss={() => onOpenChange(false)}
        />
      </Modal>
    </ModalOverlay>
  );
}
