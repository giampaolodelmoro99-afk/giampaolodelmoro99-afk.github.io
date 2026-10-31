import { type FormEvent, useEffect, useId, useState } from "react";
import { Autocomplete } from "react-aria-components/Autocomplete";
import { Dialog } from "react-aria-components/Dialog";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Modal, ModalOverlay } from "react-aria-components/Modal";
import { Button } from "../Button";
import { cx } from "../cx";
import { Icon } from "../Icon";
import { TextField } from "../TextField";
import { useUiStrings } from "../useUiStrings";
import { Window } from "../Window";
import styles from "./RunDialog.module.css";

export type RunSuggestion = { id: string; label: string };

export type RunDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  suggestions: RunSuggestion[];
  onRun: (command: string) => string | null;
  className?: string | undefined;
};

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export function RunDialog({ isOpen, onOpenChange, suggestions, onRun, className }: RunDialogProps) {
  const strings = useUiStrings().runDialog;
  const titleId = useId();
  const [command, setCommand] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<HTMLFormElement | null>(null);

  useEffect(() => {
    form?.querySelector("input")?.focus();
  }, [form]);

  const run = (text: string) => {
    const problem = onRun(text);
    setError(problem);
    if (!problem) {
      setCommand("");
      onOpenChange(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    run(command);
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
            isLandmark={false}
            controls={["close"]}
            onClose={() => onOpenChange(false)}
            className={styles.window}
          >
            <form ref={setForm} onSubmit={submit} className={styles.form}>
              <div className={styles.intro}>
                <Icon name="run" size={32} />
                <p className={styles.help}>{strings.help}</p>
              </div>
              <Autocomplete
                inputValue={command}
                onInputChange={(value) => {
                  setCommand(value);
                  setError(null);
                }}
                filter={(textValue, inputValue) =>
                  normalize(textValue).includes(normalize(inputValue))
                }
                disableAutoFocusFirst
              >
                <TextField
                  label={strings.label}
                  isInvalid={error !== null}
                  errorMessage={error ?? undefined}
                  autoComplete="off"
                  className={styles.field}
                />
                {command.trim() !== "" && (
                  <ListBox
                    aria-label={strings.suggestions}
                    items={suggestions}
                    onAction={(key) =>
                      run(suggestions.find((item) => item.id === key)?.label ?? "")
                    }
                    renderEmptyState={() => null}
                    className={cx(styles.suggestions)}
                  >
                    {(item) => (
                      <ListBoxItem
                        id={item.id}
                        textValue={item.label}
                        className={cx(styles.suggestion)}
                      >
                        {item.label}
                      </ListBoxItem>
                    )}
                  </ListBox>
                )}
              </Autocomplete>
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
