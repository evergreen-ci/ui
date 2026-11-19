import { useCallback } from "react";
import { setLocalStorageString } from "@evg-ui/lib/utils/localStorage";
import { useWaterfallAnalytics } from "analytics";
import { useUpsertQueryParams } from "hooks";
import { VARIANT_FILTER_SETTING_KEY, tupleSelectOptions } from "../constants";
import TextFilterInput from "../TextFilterInput";
import { FilterType, WaterfallFilterOptions } from "../types";
import { getFilterType, makeExactFilter } from "../utils";

export const BuildVariantFilter = () => {
  const updateURL = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const onSubmit = useCallback(
    ({ category, value }: { category: string; value: string }) => {
      const filterType = category as FilterType;
      const filterValue =
        filterType === FilterType.Exact ? makeExactFilter(value) : value;
      const param =
        filterType === FilterType.Tag
          ? WaterfallFilterOptions.VariantTags
          : WaterfallFilterOptions.BuildVariant;
      updateURL({
        category: param,
        value: filterValue,
      });
      sendEvent({
        name: "Filtered by build variant",
        "filter.type": filterType,
        "filter.value": filterValue,
      });
    },
    [updateURL, sendEvent],
  );

  const defaultFilterType = getFilterType(VARIANT_FILTER_SETTING_KEY);

  const handleToggleOption = useCallback((newOption: string) => {
    setLocalStorageString(VARIANT_FILTER_SETTING_KEY, newOption);
  }, []);

  return (
    <TextFilterInput
      ariaLabel="Build Variant Filter"
      data-testid="build-variant-filter"
      defaultOption={defaultFilterType}
      id="build-variant-filter"
      label="Build Variant"
      onSubmit={onSubmit}
      onToggleOption={handleToggleOption}
      options={tupleSelectOptions}
      placeholder="Search"
      validatorErrorMessage="Invalid regular expression"
    />
  );
};
