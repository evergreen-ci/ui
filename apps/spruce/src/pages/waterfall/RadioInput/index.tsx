import { useCallback, useState } from "react";
import { Label } from "@leafygreen-ui/typography";
import { Radio, RadioGroup } from "@via-ds/components/radio-group";
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components/tooltip";
import TextInput from "components/TextInputWithValidation";
import styles from "./index.module.css";

type Option<T extends string = string> = {
  value: T;
  displayName: string;
  placeholderText?: string;
  tooltip?: string;
  validator?: (value: string) => boolean;
};

interface RadioInputProps<T extends string = string> {
  ariaLabel: string;
  "data-testid": string;
  defaultOption?: T;
  id: string;
  label: React.ReactNode;
  options: Option[];
  placeholder?: string;
  onSubmit?: ({ category, value }: { category: string; value: string }) => void;
  onToggleOption?: (newOption: string) => void;
  validator?: (value: string) => boolean;
  validatorErrorMessage?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  ariaLabel,
  "data-testid": dataTestId,
  defaultOption,
  id,
  label,
  onSubmit,
  onToggleOption,
  options,
  placeholder,
  validator,
  validatorErrorMessage = "Invalid input",
}) => {
  const [selected, setSelected] = useState(defaultOption || options[0].value);

  const handleOnSubmit = (input: string) => {
    onSubmit?.({ category: selected, value: input });
  };

  const selectedOption =
    options.find((o) => o.value === selected) ?? options[0];

  const handleChange = useCallback(
    (v: string) => {
      setSelected(v);
      onToggleOption?.(v);
    },
    [onToggleOption],
  );

  return (
    <div className={styles.container}>
      <div className={styles.labelContainer}>
        <Label htmlFor={id}>{label}</Label>
        <RadioGroup
          aria-label={`${ariaLabel} Filter Type`}
          className={styles.radioGroup}
          name={`${id}-filter-type`}
          onChange={handleChange}
          orientation="horizontal"
          value={selected}
        >
          {options.map((o) => (
            <Radio key={o.value} value={o.value}>
              {o.tooltip ? (
                <TooltipRoot delay={1000}>
                  <TooltipTrigger>
                    <span>{o.displayName}</span>
                  </TooltipTrigger>
                  <Tooltip>{o.tooltip}</Tooltip>
                </TooltipRoot>
              ) : (
                o.displayName
              )}
            </Radio>
          ))}
        </RadioGroup>
      </div>
      <TextInput
        aria-label={`${ariaLabel} Input`}
        aria-labelledby={`${ariaLabel} Input`}
        clearOnSubmit
        data-testid={`${dataTestId}-input`}
        id={id}
        onSubmit={handleOnSubmit}
        placeholder={placeholder || selectedOption.placeholderText}
        // Chrome will overlay a clear "x" button on the input if type is not set to 'search'
        type="text"
        validator={validator || selectedOption.validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    </div>
  );
};

export default RadioInput;
