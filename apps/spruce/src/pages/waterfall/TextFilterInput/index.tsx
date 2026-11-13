import { useCallback, useState } from "react";
import { Label } from "@leafygreen-ui/typography";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@via-ds/components/segmented-control";
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components/tooltip";
import Icon, { IconProps } from "@evg-ui/lib/components/Icon";
import TextInput from "components/TextInputWithValidation";
import styles from "./index.module.css";

type Option<T extends string = string> = {
  value: T;
  displayName: string;
  glyph?: IconProps["glyph"];
  placeholderText?: string;
  tooltip?: string;
  validator?: (value: string) => boolean;
};

interface TextFilterInputProps<T extends string = string> {
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

const TextFilterInput: React.FC<TextFilterInputProps> = ({
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
    (value: React.Key) => {
      const selectedValue = String(value);
      setSelected(selectedValue);
      onToggleOption?.(selectedValue);
    },
    [onToggleOption],
  );

  return (
    <div className={styles.container}>
      <div className={styles.labelContainer}>
        <Label htmlFor={id}>{label}</Label>
        <SegmentedControl
          aria-label={`${ariaLabel} Filter Type`}
          className={styles.segmentedControl}
          name={`${id}-filter-type`}
          onChange={handleChange}
          size="small"
          value={selected}
        >
          {options.map((o) => {
            const button = (
              <SegmentedControlItem
                key={o.value}
                className={styles.segmentedControlItem}
                value={o.value}
              >
                {o?.glyph ? <Icon glyph={o.glyph} /> : null}
                <span>{o.displayName}</span>
              </SegmentedControlItem>
            );
            return o.tooltip ? (
              <TooltipRoot delay={1000}>
                <TooltipTrigger>{button}</TooltipTrigger>
                <Tooltip>{o.tooltip}</Tooltip>
              </TooltipRoot>
            ) : (
              button
            );
          })}
        </SegmentedControl>
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

export default TextFilterInput;
