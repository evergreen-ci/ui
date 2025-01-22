import { DatePicker } from "@leafygreen-ui/date-picker";
import { DateType } from "@leafygreen-ui/date-utils";
import { useWaterfallAnalytics } from "analytics";
import { useQueryParam, useQueryParams } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "../types";

export const DateFilter = () => {
  const { sendEvent } = useWaterfallAnalytics();

  const [queryParams, setQueryParams] = useQueryParams();
  const [date] = useQueryParam<string>(WaterfallFilterOptions.Date, "");

  const handleChange = (value?: DateType) => {
    if (value) {
      // Dates do not store timezone information; all dates should be represented in UTC.
      const year = value.getUTCFullYear();
      const month = value.getUTCMonth() + 1;
      const day = value.getUTCDate();
      const utcDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      setQueryParams({
        ...queryParams,
        [WaterfallFilterOptions.MaxOrder]: undefined,
        [WaterfallFilterOptions.MinOrder]: undefined,
        [WaterfallFilterOptions.Date]: utcDate,
      });
      sendEvent({ name: "Filtered by date" });
    }
  };

  return (
    <DatePicker
      data-cy="date-picker"
      label="Go to Date"
      max={new Date()}
      onDateChange={handleChange}
      value={date.length ? new Date(date) : undefined}
    />
  );
};
