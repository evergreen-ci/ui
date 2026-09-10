import { DatePicker } from "@via-ds/components/date-picker";
import { StringMap } from "@evg-ui/lib/types/utils";

interface DateFilterProps {
  dataProps?: StringMap;
  onChange: (v: string) => void;
  showLabel?: boolean;
  size?: "small" | "medium" | "large";
  value: string;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  dataProps,
  onChange,
  showLabel = false,
  size = "medium",
  value: _value,
}) => {
  // Via's DatePicker uses CalendarDate from @internationalized/date.
  // The value object has year, month, day properties.
  const handleChange = (
    date: { year: number; month: number; day: number } | null,
  ) => {
    if (date) {
      const formattedDate = `${date.year}-${date.month.toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;
      onChange(formattedDate);
    }
  };

  return (
    <DatePicker
      aria-label="Go to date"
      data-testid="date-picker"
      label={showLabel ? "Go to Date" : ""}
      onChange={handleChange}
      size={size}
      {...(dataProps as Record<string, unknown>)}
    />
  );
};
