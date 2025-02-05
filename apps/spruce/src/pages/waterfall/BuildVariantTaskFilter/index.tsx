import { useCallback } from "react";
import { useWaterfallAnalytics } from "analytics";
import TupleSelectWithRegexConditional, {
  FilterType,
} from "components/TupleSelectWithRegexConditional";
import { useUpsertQueryParams } from "hooks";
import { validators } from "utils";
import { WaterfallFilterOptions } from "../types";

export const BuildVariantTaskFilter = () => {
  const onSubmit = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const onSubmitTupleSelect = useCallback(
    ({
      category,
      type,
      value,
    }: {
      category: string;
      type: FilterType;
      value: string;
    }) => {
      onSubmit({ category, value });
      switch (category) {
        case WaterfallFilterOptions.BuildVariant:
          sendEvent({ name: "Filtered by build variant", type });
          break;
        case WaterfallFilterOptions.Task:
          sendEvent({ name: "Filtered by task", type });
          break;
        default:
      }
    },
    [onSubmit, sendEvent],
  );

  return (
    <TupleSelectWithRegexConditional
      onSubmit={onSubmitTupleSelect}
      options={options}
      validator={validators.validateRegexp}
      validatorErrorMessage="Invalid regular expression"
    />
  );
};

const options = [
  {
    value: WaterfallFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Filter build variants",
  },
  {
    value: WaterfallFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Filter tasks",
  },
];
