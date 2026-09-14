import { useCallback, useState } from "react";
import { Option, Select } from "@leafygreen-ui/select";
import { Label } from "@leafygreen-ui/typography";
import TextInput from "components/TextInputWithValidation";
import styles from "./index.module.css";

type Option<T extends string = string> = {
  value: T;
  displayName: string;
  placeholderText?: string;
  validator?: (value: string) => boolean;
};

interface TupleSelectProps<T extends string = string> {
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

const TupleSelect: React.FC<TupleSelectProps> = ({
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
      <Label htmlFor={id}>
        <div className={styles.labelContainer}>{label}</div>
      </Label>
      <div className={styles.inputGroup}>
        <Select
          allowDeselect={false}
          aria-labelledby={`${ariaLabel} Select`}
          className={styles.groupedSelect}
          data-testid={`${dataTestId}-select`}
          dropdownWidthBasis="option"
          onChange={handleChange}
          value={selected}
        >
          {options.map((o) => (
            <Option key={o.value} value={o.value}>
              {o.displayName}
            </Option>
          ))}
        </Select>
        <TextInput
          aria-label={`${ariaLabel} Input`}
          aria-labelledby={`${ariaLabel} Input`}
          className={styles.groupedTextInput}
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
    </div>
  );
};

export default TupleSelect;
