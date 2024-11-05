import { useCallback } from "react";
import { useWaterfallAnalytics } from "analytics";
import TupleSelectWithRegexConditional from "components/TupleSelectWithRegexConditional";
import { useUpsertQueryParams } from "hooks";
import { WaterfallFilterOptions } from "types/waterfall";
import { validators } from "utils";

export const NameFilter = () => {
  const onSubmit = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const onSubmitTupleSelect = useCallback(
    ({ category, value }: { category: string; value: string }) => {
      onSubmit({ category, value });
      switch (category) {
        case WaterfallFilterOptions.BuildVariant:
          sendEvent({ name: "Created build variant filter" });
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
      validatorErrorMessage="Invalid Regular Expression"
    />
  );
};

const options = [
  {
    value: WaterfallFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Filter build variants",
  },
];
