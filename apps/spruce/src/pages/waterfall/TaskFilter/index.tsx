import { useCallback } from "react";
import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { setLocalStorageString } from "@evg-ui/lib/utils/localStorage";
import { useWaterfallAnalytics } from "analytics";
import { useUpsertQueryParams } from "hooks";
import { TASK_FILTER_SETTING_KEY, tupleSelectOptions } from "../constants";
import RadioInput from "../RadioInput";
import { FilterType, WaterfallFilterOptions } from "../types";
import { getFilterType, makeExactFilter } from "../utils";

export const TaskFilter = () => {
  const onSubmit = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const onSubmitTupleSelect = useCallback(
    ({ category, value }: { category: string; value: string }) => {
      const filterType = category as FilterType;
      const filterValue =
        filterType === FilterType.Exact ? makeExactFilter(value) : value;
      const param =
        filterType === FilterType.Tag
          ? WaterfallFilterOptions.TaskTags
          : WaterfallFilterOptions.Task;
      onSubmit({
        category: param,
        value: filterValue,
      });
      sendEvent({
        name: "Filtered by task",
        "filter.type": filterType,
        "filter.value": filterValue,
      });
    },
    [onSubmit, sendEvent],
  );

  const defaultFilterType = getFilterType(TASK_FILTER_SETTING_KEY);

  const handleToggleOption = useCallback((newOption: string) => {
    setLocalStorageString(TASK_FILTER_SETTING_KEY, newOption);
  }, []);

  return (
    <RadioInput
      ariaLabel="Task Filter"
      data-testid="task-filter"
      defaultOption={defaultFilterType}
      id="task-filter"
      label={<LabelContainer>Task</LabelContainer>}
      onSubmit={onSubmitTupleSelect}
      onToggleOption={handleToggleOption}
      options={tupleSelectOptions}
      placeholder="Search"
      validatorErrorMessage="Invalid regular expression"
    />
  );
};

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
