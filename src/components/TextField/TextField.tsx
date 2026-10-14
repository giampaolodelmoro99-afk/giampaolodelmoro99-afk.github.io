import type { ReactNode } from "react";
import { FieldError, type ValidationResult } from "react-aria-components/FieldError";
import { Input } from "react-aria-components/Input";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components/TextField";
import { cx } from "../cx";
import { Glyph } from "../Icon";
import styles from "./TextField.module.css";

export type FieldErrorMessage = string | ((validation: ValidationResult) => string);

export type FieldTextProps = {
  label: string;
  description?: string | undefined;
  errorMessage?: FieldErrorMessage | undefined;
  className?: string;
};

export type TextFieldProps = Omit<AriaTextFieldProps, "children" | "className" | "style"> &
  FieldTextProps & {
    placeholder?: string | undefined;
    type?: "text" | "email" | "tel" | "url" | "search" | "password";
  };

export function FieldTexts({
  description,
  errorMessage,
}: Pick<FieldTextProps, "description" | "errorMessage">) {
  return (
    <>
      {description && (
        <Text slot="description" className={cx(styles.description)}>
          {description}
        </Text>
      )}
      <FieldError className={cx(styles.error)}>
        {(validation): ReactNode => (
          <>
            <Glyph name="close" className={cx(styles.errorIcon)} />
            <span>
              {typeof errorMessage === "function"
                ? errorMessage(validation)
                : (errorMessage ?? validation.validationErrors.join(" "))}
            </span>
          </>
        )}
      </FieldError>
    </>
  );
}

export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  className,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField {...props} className={cx(styles.root, className)}>
      <Label className={cx(styles.label)}>{label}</Label>
      <Input className={cx(styles.input)} {...(placeholder ? { placeholder } : {})} />
      <FieldTexts description={description} errorMessage={errorMessage} />
    </AriaTextField>
  );
}
