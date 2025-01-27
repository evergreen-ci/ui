import { DatePicker } from "@leafygreen-ui/date-picker";
import { DateType } from "@leafygreen-ui/date-utils";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import { useQueryParam, useQueryParams } from "hooks/useQueryParam";
import { walkthroughSteps, waterfallGuideId } from "../constants";
import { WaterfallFilterOptions } from "../types";

const datePickerProps = {
  [waterfallGuideId]: walkthroughSteps[3].targetId,
};

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
      popoverZIndex={zIndex.popover}
      value={date.length ? new Date(date) : undefined}
      {...datePickerProps}
    />
  );
};
