import { Label } from "react-aria-components/Label";
import { TextArea as AriaTextArea } from "react-aria-components/TextArea";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components/TextField";
import { cx } from "../cx";
import { FieldTexts, type FieldTextProps } from "../TextField";
import fieldStyles from "../TextField/TextField.module.css";
import styles from "./TextArea.module.css";

export type TextAreaProps = Omit<AriaTextFieldProps, "children" | "className" | "style" | "type"> &
  FieldTextProps & {
    rows?: number;
  };

export function TextArea({
  label,
  description,
  errorMessage,
  rows = 5,
  className,
  ...props
}: TextAreaProps) {
  return (
    <AriaTextField {...props} className={cx(fieldStyles.root, className)}>
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <AriaTextArea className={cx(styles.input)} rows={rows} />
      <FieldTexts description={description} errorMessage={errorMessage} />
    </AriaTextField>
  );
}
