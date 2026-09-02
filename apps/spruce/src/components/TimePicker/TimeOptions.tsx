import { createRef, forwardRef, useLayoutEffect } from "react";
import { DateType } from "@leafygreen-ui/date-utils";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./TimeOptions.module.css";
import { RefMap, TimepickerType } from "./types";

interface TimePickerOptionsProps {
  currentDateTime: Date;
  "data-testid": string;
  onDateChange: (newDate: DateType) => void;
  options: string[];
  type: TimepickerType;
  value: string;
}

const TimePickerOptions: React.FC<TimePickerOptionsProps> = ({
  currentDateTime,
  "data-testid": dataTestId,
  onDateChange,
  options,
  type,
  value,
}) => {
  const optionRefs = options.reduce((acc, v) => {
    acc[v] = createRef<HTMLButtonElement>();
    return acc;
  }, {} as RefMap);

  // Scroll to the selected option when the popover opens.
  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      optionRefs[value].current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timeout);
  }, [optionRefs]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.timeOptions} data-testid={dataTestId}>
      {options.map((o) => (
        <TimePickerOption
          key={`${type}-${o}`}
          ref={optionRefs[o]}
          isSelected={value === o}
          onSelectOption={(val) => {
            optionRefs[o].current?.scrollIntoView({ behavior: "smooth" });
            const valAsNumber = Number(val);
            const newDate = new Date(currentDateTime);
            if (type === TimepickerType.Minute) {
              newDate.setMinutes(valAsNumber);
            } else if (type === TimepickerType.Hour) {
              newDate.setHours(valAsNumber);
            }
            onDateChange(newDate);
          }}
          value={o}
        />
      ))}
    </div>
  );
};

interface TimePickerOptionProps {
  isSelected: boolean;
  onSelectOption: (value: string) => void;
  value: string;
}

const TimePickerOption = forwardRef<HTMLButtonElement, TimePickerOptionProps>(
  ({ isSelected, onSelectOption, value }, ref) => (
    <button
      ref={ref}
      className={cx(styles.item, isSelected && styles.itemSelected)}
      id={`time-picker-${value}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectOption(value);
      }}
      type="button"
    >
      {value}
    </button>
  ),
);
TimePickerOption.displayName = "TimePickerOption";

export default TimePickerOptions;
