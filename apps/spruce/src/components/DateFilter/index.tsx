import { DatePicker } from "@leafygreen-ui/date-picker";
import { DateType } from "@leafygreen-ui/date-utils";
import { Size } from "@leafygreen-ui/tokens";
import { subDays, subYears } from "date-fns";
import { StringMap } from "@evg-ui/lib/types";
import { isProduction } from "utils/environmentVariables";

interface DateFilterProps {
  dataCyProps?: StringMap;
  onChange: (v: string) => void;
  showLabel?: boolean;
  size?: Size;
  value: string;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  dataCyProps,
  onChange,
  showLabel = false,
  size = Size.Default,
  value,
}) => {
  const handleChange = (updatedValue?: DateType) => {
    if (updatedValue) {
      // Dates do not store timezone information; all dates should be represented in UTC.
      const year = updatedValue.getUTCFullYear();
      const month = updatedValue.getUTCMonth() + 1;
      const day = updatedValue.getUTCDate();
      const utcDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      onChange(utcDate);
    }
  };

  return (
    <DatePicker
      aria-label="Go to date"
      data-cy="date-picker"
      label={showLabel ? "Go to Date" : ""}
      max={today}
      // Testing environments should not have a minimum date restriction due to static test data.
      min={isProduction() ? subDays(subYears(today, 1), 1) : undefined}
      onDateChange={handleChange}
      size={size}
      value={value.length ? new Date(value) : undefined}
      {...dataCyProps}
    />
  );
};

const today = new Date();
