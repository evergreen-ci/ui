import { useState, forwardRef, useEffect } from "react";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import {
  TextInputWithGlyph,
  TextInputWithGlyphProps,
} from "@evg-ui/lib/components/TextInputWithGlyph";
import Icon from "components/Icon";
import IconTooltip from "components/IconTooltip";

const { yellow } = palette;
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
  placeholder?: string;
  /** The controlled value that should be displayed within the text input */
  value?: string;
  /**
   * If true, the input will be cleared when the user submits a new input
   */
  clearOnSubmit?: boolean;
} & Omit<TextInputWithGlyphProps, "icon" | "onSubmit" | "onChange">;

const TextInputWithValidation: React.FC<TextInputWithValidationProps> =
  forwardRef((props, ref) => {
    const {
      "aria-label": ariaLabel,
      clearOnSubmit = false,
      disabled,
      label,
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
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      <TextInputWithGlyph
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        icon={
          isValid ? (
            <IconButton
              aria-label="Select plus button"
              disabled={disabled}
              onClick={handleOnSubmit}
            >
              <Icon glyph="Plus" />
            </IconButton>
          ) : (
            <IconTooltip
              aria-label="validation error"
              fill={yellow.base}
              glyph="Warning"
            >
              {validatorErrorMessage}
            </IconTooltip>
          )
        }
        label={label}
        onChange={(e) => handleOnChange(e.target.value)}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && handleOnSubmit()
        }
        value={input}
        {...rest}
      />
    );
  });

TextInputWithValidation.displayName = "TextInputWithValidation";
export default TextInputWithValidation;
