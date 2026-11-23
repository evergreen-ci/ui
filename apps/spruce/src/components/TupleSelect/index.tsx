import { useCallback, useState } from "react";
import { Select, SelectItem } from "@via-ds/components/select";
import { Label } from "@via-ds/components/typography";
import TextInput from "components/TextInputWithValidation";
import styles from "./index.module.css";

type TupleSelectOption<T extends string = string> = {
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
  options: TupleSelectOption[];
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
    (key: React.Key | null) => {
      if (key === null) return;
      const value = String(key);
      setSelected(value);
      onToggleOption?.(value);
    },
    [onToggleOption],
  );

  return (
    <div className={styles.container}>
      <Label className={styles.labelContainer} htmlFor={id}>
        {label}
      </Label>
      <div className={styles.inputGroup}>
        <Select
          aria-label={`${ariaLabel} Select`}
          className={styles.groupedSelect}
          data-testid={`${dataTestId}-select`}
          dropdownWidthBasis="option"
          onChange={handleChange}
          selectionMode="single"
          value={selected}
        >
          {options.map((o) => (
            <SelectItem key={o.value} id={o.value} textValue={o.displayName}>
              {o.displayName}
            </SelectItem>
          ))}
        </Select>
        <TextInput
          aria-label={`${ariaLabel} Input`}
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
