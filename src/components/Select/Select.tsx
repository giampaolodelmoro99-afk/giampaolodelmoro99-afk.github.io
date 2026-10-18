import { Button } from "react-aria-components/Button";
import { Label } from "react-aria-components/Label";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Popover } from "react-aria-components/Popover";
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue,
} from "react-aria-components/Select";
import { cx } from "../cx";
import { Glyph } from "../Icon";
import { FieldTexts, type FieldTextProps } from "../TextField";
import styles from "./Select.module.css";

export type SelectOption = {
  id: string;
  label: string;
  isDisabled?: boolean;
};

export type SelectProps = Omit<
  AriaSelectProps<SelectOption>,
  "children" | "className" | "style" | "items"
> &
  FieldTextProps & {
    options: SelectOption[];
  };

export function Select({
  label,
  description,
  errorMessage,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <AriaSelect {...props} className={cx(styles.root, className)}>
      <Label className={cx(styles.label)}>{label}</Label>
      <Button className={cx(styles.button)}>
        <SelectValue className={cx(styles.value)} />
        <span className={styles.arrow} aria-hidden="true">
          <Glyph name="down" className={cx(styles.arrowGlyph)} />
        </span>
      </Button>
      <FieldTexts description={description} errorMessage={errorMessage} />
      <Popover className={cx(styles.popover)} offset={0}>
        <ListBox items={options} className={cx(styles.listbox)}>
          {(option) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              isDisabled={option.isDisabled ?? false}
              className={cx(styles.option)}
            >
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
