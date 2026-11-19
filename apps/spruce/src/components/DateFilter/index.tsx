import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { DatePicker } from "@via-ds/components";
import { Size } from "@via-ds/components/types";
import { StringMap } from "@evg-ui/lib/types/utils";
import { isProduction } from "utils/environmentVariables";

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

  const handleChange = (updatedValue: DateValue | null) => {
    if (updatedValue) {
      onChange(updatedValue.toString());
    }
  };

  return (
    <DatePicker
      aria-label="Go to date"
      data-testid="date-picker"
      firstDayOfWeek="mon"
      label={showLabel ? "Go to Date" : undefined}
      maxValue={maxDate}
      minValue={
        isProduction() ? maxDate.subtract({ years: 1, days: 1 }) : undefined
      }
      onChange={handleChange}
      size={size}
      value={toCalendarDate(value)}
      {...dataProps}
    />
  );
};

const toCalendarDate = (value: string): CalendarDate | null => {
  try {
    return parseDate(value);
  } catch {
    return null;
  }
};
