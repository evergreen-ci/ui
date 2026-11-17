import { useCallback } from "react";
import { setLocalStorageString } from "@evg-ui/lib/utils/localStorage";
import { useWaterfallAnalytics } from "analytics";
import { useUpsertQueryParams } from "hooks";
import { TASK_FILTER_SETTING_KEY, tupleSelectOptions } from "../constants";
import TextFilterInput from "../TextFilterInput";
import { FilterType, WaterfallFilterOptions } from "../types";
import { getFilterType, makeExactFilter } from "../utils";

export const TaskFilter = () => {
  const updateURL = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const onSubmit = useCallback(
    ({ category, value }: { category: string; value: string }) => {
      const filterType = category as FilterType;
      const filterValue =
        filterType === FilterType.Exact ? makeExactFilter(value) : value;
      const param =
        filterType === FilterType.Tag
          ? WaterfallFilterOptions.TaskTags
          : WaterfallFilterOptions.Task;
      updateURL({
        category: param,
        value: filterValue,
      });
      sendEvent({
        name: "Filtered by task",
        "filter.type": filterType,
        "filter.value": filterValue,
      });
    },
    [updateURL, sendEvent],
  );

  const defaultFilterType = getFilterType(TASK_FILTER_SETTING_KEY);

  const handleToggleOption = useCallback((newOption: string) => {
    setLocalStorageString(TASK_FILTER_SETTING_KEY, newOption);
  }, []);

  return (
    <TextFilterInput
      ariaLabel="Task Filter"
      data-testid="task-filter"
      defaultOption={defaultFilterType}
      id="task-filter"
      label="Task"
      onSubmit={onSubmit}
      onToggleOption={handleToggleOption}
      options={tupleSelectOptions}
      placeholder="Search"
      validatorErrorMessage="Invalid regular expression"
    />
  );
};
