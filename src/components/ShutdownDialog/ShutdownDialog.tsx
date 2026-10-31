import { type FormEvent, useEffect, useId, useState } from "react";
import { Dialog } from "react-aria-components/Dialog";
import { Modal, ModalOverlay } from "react-aria-components/Modal";
import { Button } from "../Button";
import { cx } from "../cx";
import { Icon } from "../Icon";
import { Radio, RadioGroup } from "../Radio";
import { useUiStrings } from "../useUiStrings";
import { Window } from "../Window";
import styles from "./ShutdownDialog.module.css";

export type ShutdownChoice = "shutdown" | "restart" | "simpleView";

const choices: readonly ShutdownChoice[] = ["shutdown", "restart", "simpleView"];

const isChoice = (value: string): value is ShutdownChoice =>
  choices.some((choice) => choice === value);

export type ShutdownDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (choice: ShutdownChoice) => void;
  className?: string | undefined;
};

export function ShutdownDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  className,
}: ShutdownDialogProps) {
  const strings = useUiStrings().shutdownDialog;
  const titleId = useId();
  const [choice, setChoice] = useState<ShutdownChoice>("shutdown");
  const [form, setForm] = useState<HTMLFormElement | null>(null);

  useEffect(() => {
    form?.querySelector<HTMLInputElement>('input[type="radio"]:checked')?.focus();
  }, [form]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm(choice);
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      className={cx(styles.overlay)}
    >
      <Modal className={cx(styles.modal)}>
        <Dialog aria-labelledby={titleId} className={cx(styles.dialog, className)}>
          <Window
            title={strings.title}
            titleId={titleId}
            icon="power"
            isLandmark={false}
            controls={["close"]}
            onClose={() => onOpenChange(false)}
            className={styles.window}
          >
            <form ref={setForm} onSubmit={submit} className={styles.form}>
              <div className={styles.body}>
                <Icon name="power" size={32} />
                <RadioGroup
                  label={strings.question}
                  value={choice}
                  onChange={(value) => {
                    if (isChoice(value)) setChoice(value);
                  }}
                >
                  {choices.map((value) => (
                    <Radio key={value} value={value}>
                      {strings[value]}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
              <div className={styles.actions}>
                <Button type="submit" variant="default">
                  {strings.ok}
                </Button>
                <Button onPress={() => onOpenChange(false)}>{strings.cancel}</Button>
              </div>
            </form>
          </Window>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
