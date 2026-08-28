import { useCallback, useState } from "react";
import { cx } from "@evg-ui/lib/utils/css";
import { days } from "constants/time";
import styles from "./index.module.css";

const emptyState = new Array(days.length).fill(false);

type DayPickerState = Array<boolean>;

/**
 * Allows selecting days of the week
 * @param props - React props
 * @param props.defaultState - optionally specifies the initial selected days
 * @param props.onChange - optionally calls a side effect function with the new selection state when a change is made
 * @param props.disabled - optionally disable interacting with the entire component
 * @returns DayPicker - DayPicker component
 */
export const DayPicker: React.FC<{
  defaultState?: DayPickerState;
  disabled?: boolean;
  onChange?: (value: DayPickerState) => void;
}> = ({ defaultState = emptyState, disabled = false, onChange }) => {
  const [selectedDays, setSelectedDays] =
    useState<DayPickerState>(defaultState);

  const handleClick = useCallback(
    (selectedIndex: number) => {
      setSelectedDays((prev) => {
        const newState = [...prev];
        newState[selectedIndex] = !prev[selectedIndex];
        onChange?.(newState);
        return newState;
      });
    },
    [onChange],
  );

  return (
    <div className={styles.container} data-testid="daypicker">
      {days.map((day, i) => (
        <Day
          key={day}
          day={day}
          disabled={disabled}
          handleClick={() => handleClick(i)}
          selected={selectedDays[i]}
        />
      ))}
    </div>
  );
};

const Day: React.FC<{
  day: string;
  disabled: boolean;
  handleClick: () => void;
  selected: boolean;
}> = ({ day, disabled, handleClick, selected }) => (
  <label
    className={cx(styles.circle, selected && styles.selected)}
    htmlFor={day}
    title={day}
  >
    <input
      aria-checked={selected}
      className={styles.invisibleInput}
      disabled={disabled}
      id={day}
      onChange={handleClick}
      type="checkbox"
    />
    {day.charAt(0)}
  </label>
);
