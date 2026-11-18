import { forwardRef, useEffect, useState } from "react";
import { Button } from "@via-ds/components/button";
import { TextField, TextFieldProps } from "@via-ds/components/text-field";
import Plus from "@via-ds/icons/Plus";
import IconWithTooltip from "@evg-ui/lib/components/IconWithTooltip";

type TextInputWithValidationProps = {
  /**
   * `onSubmit` will be called when the user submits a new input with the enter key or the plus button
   * if the input is valid
   * @param value - the value of the input
   * @returns void
   */
  onSubmit?: (value: string) => void;
  validator?: (value: string) => boolean;
  /**
   * `onChange` will be called when the user types into the input and the input is valid
   * @param value - the value of the input
   * @returns void
   */
  onChange?: (value: string) => void;
  validatorErrorMessage?: string;
  /** The controlled value that should be displayed within the text input */
  value?: string;
  /**
   * If true, the input will be cleared when the user submits a new input
   */
  clearOnSubmit?: boolean;
  "data-testid"?: string;
} & Omit<
  TextFieldProps,
  "children" | "defaultValue" | "onChange" | "onKeyDown" | "value"
>;

const TextInputWithValidation = forwardRef<
  HTMLInputElement,
  TextInputWithValidationProps
>((props, ref) => {
  const {
    clearOnSubmit = false,
    isDisabled,
    onChange = () => {},
    onSubmit = () => {},
    validator = () => true,
    validatorErrorMessage = "Invalid input",
    value = "",
    ...rest
  } = props;

  const [input, setInput] = useState(value);
  useEffect(() => {
    setInput(value);
  }, [value]);

  const isValid = validator(input);

  const handleOnSubmit = () => {
    if (isValid) {
      onSubmit(input);
      if (clearOnSubmit) {
        setInput("");
      }
    }
  };

  const handleOnChange = (v: string) => {
    if (validator(v)) {
      onChange(v);
    }
    setInput(v);
  };

  return (
    <TextField
      ref={ref}
      isDisabled={isDisabled}
      onChange={handleOnChange}
      onKeyDown={(e) => e.key === "Enter" && handleOnSubmit()}
      value={input}
      {...rest}
    >
      {isValid ? (
        <Button
          aria-label="Select plus button"
          onPress={handleOnSubmit}
          slot="trailing"
          variant="tertiary"
        >
          <Plus />
        </Button>
      ) : (
        <IconWithTooltip
          aria-label="validation error"
          fill="var(--via-color-icon-warning)"
          glyph="Warning"
        >
          {validatorErrorMessage}
        </IconWithTooltip>
      )}
    </TextField>
  );
});

TextInputWithValidation.displayName = "TextInputWithValidation";
export default TextInputWithValidation;
