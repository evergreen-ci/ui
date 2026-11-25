import { useState } from "react";
import { DatePicker, Internationalized } from "@via-ds/components";
import { Size } from "@via-ds/components/types";
import { StringMap } from "@evg-ui/lib/types/utils";
import { isProduction } from "utils/environmentVariables";
import styles from "./index.module.css";

const { getLocalTimeZone, parseDate, today } = Internationalized;

interface DateFilterProps {
  dataProps?: StringMap;
  onChange: (v: string) => void;
  showLabel?: boolean;
  size?: Size;
  value: string;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  dataProps,
  onChange,
  showLabel = false,
  size,
  value,
}) => {
  const maxDate = today(getLocalTimeZone());
  // Testing environments should not have a minimum date restriction due to static test data.
  const minDate = isProduction()
    ? maxDate.subtract({ years: 1, days: 1 })
    : undefined;

  // The picker keeps its own copy of the date so partial or out-of-range input
  // stays on screen. Feeding it only the URL value would make react-aria reset
  // the field, wiping the month and day while the year is still being typed.
  const [draftDate, setDraftDate] =
    useState<Internationalized.DateValue | null>(() => toCalendarDate(value));
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraftDate(toCalendarDate(value));
  }

  const handleChange = (updatedValue: Internationalized.DateValue | null) => {
    setDraftDate(updatedValue);
    if (updatedValue && isSelectable(updatedValue, minDate, maxDate)) {
      onChange(updatedValue.toString());
    }
  };

  return (
    <DatePicker
      aria-label="Go to date"
      className={
        size === Size.Small
          ? `${styles.datePicker} ${styles.small}`
          : styles.datePicker
      }
      data-testid="date-picker"
      firstDayOfWeek="mon"
      label={showLabel ? "Go to Date" : undefined}
      maxValue={maxDate}
      minValue={minDate}
      onChange={handleChange}
      size={size}
      value={draftDate}
      {...dataProps}
    />
  );
};

/**
 * Via's DatePicker only marks out-of-range dates invalid and still emits them,
 * and it emits on every keystroke in the year segment (typing 2022 emits 0002,
 * 0020, 0202, then 2022), so both have to be filtered before reaching the URL.
 * @param date - the date the picker emitted
 * @param min - the earliest allowed date, if any
 * @param max - the latest allowed date
 * @returns whether the date should be passed to onChange
 */
const isSelectable = (
  date: Internationalized.DateValue,
  min: Internationalized.DateValue | undefined,
  max: Internationalized.DateValue,
) =>
  date.year >= MIN_COMPLETE_YEAR &&
  date.compare(max) <= 0 &&
  (min === undefined || date.compare(min) >= 0);

const MIN_COMPLETE_YEAR = 1000;

const toCalendarDate = (
  value: string,
): Internationalized.CalendarDate | null => {
  try {
    return parseDate(value);
  } catch {
    return null;
  }
};
