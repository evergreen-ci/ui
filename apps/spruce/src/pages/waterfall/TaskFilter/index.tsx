import { useCallback } from "react";
import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { size } from "@evg-ui/lib/constants";
import { toEscapedRegex } from "@evg-ui/lib/utils";
import { useWaterfallAnalytics } from "analytics";
import TupleSelect from "components/TupleSelect";
import { FilterType } from "components/TupleSelectWithRegexConditional";
import { useUpsertQueryParams } from "hooks";
import { tupleSelectOptions } from "../constants";
import { WaterfallFilterOptions } from "../types";

export const TaskFilter = () => {
  const onSubmit = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const onSubmitTupleSelect = useCallback(
    ({ category, value }: { category: string; value: string }) => {
      const filterType = category as FilterType;
      const isRegex = filterType === FilterType.Regex;
      onSubmit({
        category: WaterfallFilterOptions.Task,
        value: isRegex ? value : toEscapedRegex(value),
      });
      sendEvent({
        name: "Filtered by task",
        "filter.type": filterType,
      });
    },
    [onSubmit, sendEvent],
  );

  return (
    <TupleSelect
      ariaLabel="Task Filter"
      data-cy="task-filter"
      id="task-filter"
      label={
        <LabelContainer>
          <span>Task</span>
          <InfoSprinkle>Search is case sensitive.</InfoSprinkle>
        </LabelContainer>
      }
      onSubmit={onSubmitTupleSelect}
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
